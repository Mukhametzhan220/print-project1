import uuid
from pathlib import PurePosixPath

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models import File, User
from app.repositories.file_repo import FileRepository
from app.services.storage_service import get_storage
from app.utils.errors import NotFoundError, ValidationError
from app.utils.pdf import count_pdf_pages


class FileService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.files = FileRepository(session)
        self.storage = get_storage()

    async def upload(self, user: User, *, original_name: str, content: bytes, mime_type: str) -> File:
        size = len(content)
        if size == 0:
            raise ValidationError("Empty file")
        if size > settings.file_max_size_bytes:
            raise ValidationError(f"File too large (max {settings.file_max_size_mb} MB)")

        ext = PurePosixPath(original_name).suffix.lower().lstrip(".")
        if ext not in settings.allowed_extensions:
            raise ValidationError(f"Extension '.{ext}' is not allowed")

        stored_name = f"{user.id}/{uuid.uuid4().hex}.{ext}"
        url = await self.storage.upload(key=stored_name, data=content, content_type=mime_type)

        pages = count_pdf_pages(content) if ext == "pdf" else None

        return await self.files.create(
            user_id=user.id,
            original_name=original_name,
            stored_name=stored_name,
            file_url=url,
            mime_type=mime_type or "application/octet-stream",
            size_bytes=size,
            pages=pages,
        )

    async def get_for_user(self, user: User, file_id: int) -> File:
        record = await self.files.get_for_user(file_id=file_id, user_id=user.id)
        if record is None:
            raise NotFoundError("File not found")
        return record
