from datetime import datetime, timezone

from sqlalchemy import desc, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import AuthCode


class AuthCodeRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, phone: str, code_hash: str, expires_at: datetime) -> AuthCode:
        record = AuthCode(phone=phone, code_hash=code_hash, expires_at=expires_at)
        self.session.add(record)
        await self.session.flush()
        return record

    async def latest_active(self, phone: str) -> AuthCode | None:
        now = datetime.now(timezone.utc)
        stmt = (
            select(AuthCode)
            .where(
                AuthCode.phone == phone,
                AuthCode.consumed.is_(False),
                AuthCode.expires_at > now,
            )
            .order_by(desc(AuthCode.created_at))
            .limit(1)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def increment_attempts(self, record: AuthCode) -> AuthCode:
        record.attempts += 1
        await self.session.flush()
        return record

    async def consume(self, record: AuthCode) -> AuthCode:
        record.consumed = True
        await self.session.flush()
        return record

    async def invalidate_for_phone(self, phone: str) -> None:
        await self.session.execute(
            update(AuthCode).where(AuthCode.phone == phone, AuthCode.consumed.is_(False)).values(consumed=True)
        )
