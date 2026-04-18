from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.dependencies.auth import get_current_user
from app.models import User
from app.schemas.file import FileOut
from app.services.file_service import FileService

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload", response_model=FileOut)
async def upload_file(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> FileOut:
    content = await file.read()
    record = await FileService(session).upload(
        user,
        original_name=file.filename or "upload",
        content=content,
        mime_type=file.content_type or "application/octet-stream",
    )
    await session.commit()
    return FileOut.model_validate(record)


@router.get("/{file_id}", response_model=FileOut)
async def get_file(
    file_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> FileOut:
    record = await FileService(session).get_for_user(user, file_id)
    return FileOut.model_validate(record)
