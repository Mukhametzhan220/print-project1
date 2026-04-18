import re

from pydantic import BaseModel, Field, field_validator

PHONE_RE = re.compile(r"^\+?[0-9]{8,15}$")


def normalize_phone(value: str) -> str:
    cleaned = re.sub(r"[\s\-()]", "", value)
    if not PHONE_RE.match(cleaned):
        raise ValueError("invalid phone format")
    return cleaned if cleaned.startswith("+") else f"+{cleaned}"


class SendCodeRequest(BaseModel):
    phone: str = Field(..., examples=["+77001234567"])

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return normalize_phone(v)


class SendCodeResponse(BaseModel):
    sent: bool = True
    expires_in: int


class VerifyCodeRequest(BaseModel):
    phone: str
    code: str = Field(..., min_length=4, max_length=8)
    language: str | None = Field(default=None, pattern=r"^(en|ru)$")

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return normalize_phone(v)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
