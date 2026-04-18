import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class OrderStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING_PAYMENT = "pending_payment"
    PAID = "paid"
    IN_PROGRESS = "in_progress"
    READY = "ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ColorMode(str, enum.Enum):
    BW = "bw"
    COLOR = "color"


class PaymentMethod(str, enum.Enum):
    KASPI = "kaspi"
    CARD = "card"
    APPLE = "apple"


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    file_id: Mapped[int] = mapped_column(ForeignKey("files.id", ondelete="RESTRICT"), index=True)
    copies: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    color_mode: Mapped[ColorMode] = mapped_column(
        Enum(ColorMode, name="color_mode"), default=ColorMode.BW, nullable=False
    )
    duplex: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    price: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status"), default=OrderStatus.DRAFT, nullable=False, index=True
    )
    payment_method: Mapped[PaymentMethod | None] = mapped_column(
        Enum(PaymentMethod, name="payment_method"), nullable=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
