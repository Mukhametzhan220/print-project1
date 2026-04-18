from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: int) -> User | None:
        return await self.session.get(User, user_id)

    async def get_by_phone(self, phone: str) -> User | None:
        result = await self.session.execute(select(User).where(User.phone == phone))
        return result.scalar_one_or_none()

    async def create(self, phone: str, language: str = "en") -> User:
        user = User(phone=phone, language=language)
        self.session.add(user)
        await self.session.flush()
        return user

    async def update_language(self, user: User, language: str) -> User:
        user.language = language
        await self.session.flush()
        return user
