import asyncio
from typing import Protocol

import boto3
from botocore.client import Config

from app.core.config import settings


class StorageProvider(Protocol):
    async def upload(self, *, key: str, data: bytes, content_type: str) -> str: ...


class S3StorageProvider:
    def __init__(self):
        self._client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            region_name=settings.s3_region,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
            config=Config(signature_version="s3v4"),
        )
        self._bucket = settings.s3_bucket

    def _put(self, *, key: str, data: bytes, content_type: str) -> None:
        self._client.put_object(Bucket=self._bucket, Key=key, Body=data, ContentType=content_type)

    async def upload(self, *, key: str, data: bytes, content_type: str) -> str:
        await asyncio.to_thread(self._put, key=key, data=data, content_type=content_type)
        if settings.s3_public_url_base:
            return f"{settings.s3_public_url_base.rstrip('/')}/{key}"
        return f"s3://{self._bucket}/{key}"


_storage: StorageProvider | None = None


def get_storage() -> StorageProvider:
    global _storage
    if _storage is None:
        _storage = S3StorageProvider()
    return _storage
