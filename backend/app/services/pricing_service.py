from app.core.config import settings
from app.models.order import ColorMode


def calculate_price(*, copies: int, color_mode: ColorMode) -> int:
    rate = settings.price_color if color_mode is ColorMode.COLOR else settings.price_bw
    return max(0, copies) * rate
