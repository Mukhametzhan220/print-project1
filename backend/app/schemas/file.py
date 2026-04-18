from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    original_name: str
    file_url: str
    mime_type: str
    size_bytes: int
    pages: int | None
    created_at: datetime
