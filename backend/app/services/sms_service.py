import logging
import secrets
from typing import Protocol

from app.core.config import settings

logger = logging.getLogger(__name__)


class SmsProvider(Protocol):
    async def send(self, phone: str, code: str) -> None: ...


class StubSmsProvider:
    async def send(self, phone: str, code: str) -> None:
        logger.warning("[STUB SMS] %s -> %s", phone, code)


def get_sms_provider() -> SmsProvider:
    if settings.sms_provider == "stub":
        return StubSmsProvider()
    raise NotImplementedError(f"SMS provider {settings.sms_provider} is not configured")


def generate_code(length: int = 6) -> str:
    return "".join(secrets.choice("0123456789") for _ in range(length))
