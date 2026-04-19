from datetime import datetime, timedelta, timezone

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, hash_secret, verify_secret
from app.models import User
from app.repositories.auth_code_repo import AuthCodeRepository
from app.repositories.user_repo import UserRepository
from app.services.rate_limit import RateLimiter
from app.services.sms_service import generate_code, send_telegram_code
from app.utils.errors import UnauthorizedError, ValidationError, TelegramRequiredError


class AuthService:
    def __init__(self, session: AsyncSession, redis: Redis):
        self.session = session
        self.codes = AuthCodeRepository(session)
        self.users = UserRepository(session)
        self.limiter = RateLimiter(redis)
        self.limiter = RateLimiter(redis)

    async def send_code(self, phone: str) -> int:
        user = await self.users.get_by_phone(phone)
        if not user or not getattr(user, 'telegram_chat_id', None):
            raise TelegramRequiredError("Please share your contact with Telegram bot first.")

        await self.limiter.hit(
            key=f"sms:{phone}",
            limit=settings.sms_rate_limit_per_min,
            window_seconds=60,
        )
        await self.codes.invalidate_for_phone(phone)
        code = generate_code()
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=settings.sms_code_ttl_seconds)
        await self.codes.create(phone=phone, code_hash=hash_secret(code), expires_at=expires_at)
        await send_telegram_code(user.telegram_chat_id, code)
        await self.session.commit()
        return settings.sms_code_ttl_seconds

    async def verify_code(self, phone: str, code: str, language: str | None) -> tuple[User, str]:
        record = await self.codes.latest_active(phone)
        if record is None:
            raise UnauthorizedError("Code expired or not found")
        if record.attempts >= settings.sms_max_attempts:
            raise UnauthorizedError("Too many attempts")
        if not verify_secret(code, record.code_hash):
            await self.codes.increment_attempts(record)
            await self.session.commit()
            raise UnauthorizedError("Invalid code")
        await self.codes.consume(record)

        user = await self.users.get_by_phone(phone)
        if user is None:
            user = await self.users.create(phone=phone, language=language or "en")
        elif language and user.language != language:
            await self.users.update_language(user, language)

        if not user.is_active:
            raise ValidationError("User is inactive")

        token = create_access_token(subject=str(user.id), extra_claims={"phone": user.phone})
        await self.session.commit()
        return user, token
