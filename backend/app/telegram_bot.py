import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from sqlalchemy.future import select

from app.core.config import settings
from app.db.session import async_session_maker
from app.models.user import User

logger = logging.getLogger(__name__)

bot_instance = None
dp = Dispatcher()

contact_kb = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="Поделиться контактом 📱", request_contact=True)]],
    resize_keyboard=True,
    one_time_keyboard=True
)

@dp.message(Command("start"))
async def start_cmd(message: types.Message):
    await message.answer(
        "Добро пожаловать в Paraq KZ! Пожалуйста, поделитесь контактом для привязки аккаунта, чтобы бесплатно получать SMS коды.",
        reply_markup=contact_kb
    )

@dp.message(F.contact)
async def contact_received(message: types.Message):
    if not message.contact:
        return
        
    phone = message.contact.phone_number
    if not phone.startswith('+') and not phone.startswith('8'):
        phone = '+' + phone
        
    chat_id = str(message.chat.id)

    async with async_session_maker() as session:
        stmt = select(User).where(User.phone == phone)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        
        if user:
            user.telegram_chat_id = chat_id
            await session.commit()
            await message.answer("✅ Ваш аккаунт успешно привязан! Можете вернуться на сайт и запросить код.", reply_markup=types.ReplyKeyboardRemove())
        else:
            new_user = User(phone=phone, telegram_chat_id=chat_id, language="ru")
            session.add(new_user)
            await session.commit()
            await message.answer("✅ Вы успешно зарегистрированы! Вернитесь на сайт и просто нажмите 'Продолжить'.", reply_markup=types.ReplyKeyboardRemove())

async def run_bot():
    global bot_instance
    if not settings.telegram_bot_token:
        logger.warning("No telegram_bot_token found, skipping bot polling.")
        return
        
    bot_instance = Bot(token=settings.telegram_bot_token)
    logger.info("Starting Telegram bot polling...")
    # Polling blocks, so this should usually be run as an asyncio Task
    await dp.start_polling(bot_instance)

async def stop_bot():
    if bot_instance:
         await bot_instance.session.close()

def get_bot() -> Bot | None:
    return bot_instance
