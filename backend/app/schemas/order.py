from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.order import ColorMode, OrderStatus, PaymentMethod


class OrderCreate(BaseModel):
    file_id: int
    copies: int = Field(default=1, ge=1, le=99)
    color_mode: ColorMode = ColorMode.BW
    duplex: bool = True


class OrderUpdate(BaseModel):
    copies: int | None = Field(default=None, ge=1, le=99)
    color_mode: ColorMode | None = None
    duplex: bool | None = None
    payment_method: PaymentMethod | None = None


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    file_id: int
    copies: int
    color_mode: ColorMode
    duplex: bool
    price: int
    status: OrderStatus
    payment_method: PaymentMethod | None
    created_at: datetime
    updated_at: datetime


class OrderListOut(BaseModel):
    items: list[OrderOut]
    total: int
