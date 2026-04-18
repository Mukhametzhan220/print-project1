from app.models.order import ColorMode
from app.services.pricing_service import calculate_price


def test_price_bw():
    assert calculate_price(copies=1, color_mode=ColorMode.BW) == 90


def test_price_color():
    assert calculate_price(copies=5, color_mode=ColorMode.COLOR) == 900


def test_price_zero_copies():
    assert calculate_price(copies=0, color_mode=ColorMode.BW) == 0
