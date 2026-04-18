from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import File


class FileRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, **fields) -> File:
        record = File(**fields)
        self.session.add(record)
        await self.session.flush()
        return record

    async def get_for_user(self, file_id: int, user_id: int) -> File | None:
        stmt = select(File).where(File.id == file_id, File.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
