from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: Literal["development", "staging", "production", "test"] = "development"
    app_name: str = "Printo KZ Backend"
    log_level: str = "INFO"
    cors_origins: str = "http://localhost:3000"

    database_url: str = "postgresql+asyncpg://printo:printo@localhost:5432/printo"

    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60

    sms_provider: Literal["stub", "twilio"] = "stub"
    sms_code_ttl_seconds: int = 300
    sms_rate_limit_per_min: int = 2
    sms_max_attempts: int = 5

    s3_endpoint_url: str | None = None
    s3_region: str = "us-east-1"
    s3_access_key: str = "minio"
    s3_secret_key: str = "miniominio"
    s3_bucket: str = "printo-files"
    s3_public_url_base: str | None = None

    file_max_size_mb: int = 25
    file_allowed_ext: str = "pdf,doc,docx,png,jpg,jpeg"

    price_bw: int = 90
    price_color: int = 180

    payment_provider: Literal["stub", "kaspi", "stripe"] = "stub"
    payment_webhook_secret: str = "change-me-webhook-secret"

    @field_validator("file_allowed_ext", "cors_origins")
    @classmethod
    def _strip(cls, v: str) -> str:
        return v.strip()

    @property
    def allowed_extensions(self) -> set[str]:
        return {ext.strip().lower().lstrip(".") for ext in self.file_allowed_ext.split(",") if ext.strip()}

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def file_max_size_bytes(self) -> int:
        return self.file_max_size_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
