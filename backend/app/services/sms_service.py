import logging
import secrets

from app.core.config import settings
from app.telegram_bot import get_bot

logger = logging.getLogger(__name__)

async def send_telegram_code(chat_id: str, code: str) -> None:
    bot = get_bot()
    if bot is None:
        logger.warning(f"[STUB TELEGRAM] chat_id={chat_id} -> {code} (bot not running)")
        return
        
    try:
        await bot.send_message(
            chat_id=chat_id,
            text=f"Код авторизации Paraq KZ:\n\n* {code} *\n\nНикому не сообщайте этот код.",
            parse_mode="Markdown"
        )
    except Exception as e:
        logger.error(f"Failed to send telegram code to {chat_id}: {e}")
        # Optionally fallback or ignore, but user won't get code

def generate_code(length: int = 6) -> str:
    return "".join(secrets.choice("0123456789") for _ in range(length))
