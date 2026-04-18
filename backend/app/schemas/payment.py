from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from app.models.order import PaymentMethod
from app.models.payment import PaymentStatus


class PaymentCreate(BaseModel):
    order_id: int
    method: PaymentMethod


class PaymentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    method: PaymentMethod
    amount: int
    status: PaymentStatus
    external_payment_id: str | None
    created_at: datetime
    paid_at: datetime | None


class PaymentInitOut(PaymentOut):
    redirect_url: str | None = None


class WebhookPayload(BaseModel):
    external_payment_id: str
    status: PaymentStatus
    signature: str
    raw: dict[str, Any] | None = None
