import hashlib
import hmac
import logging
import uuid
from datetime import datetime, timezone
from typing import Protocol

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models import Order, Payment, User
from app.models.order import OrderStatus, PaymentMethod
from app.models.payment import PaymentStatus
from app.repositories.order_repo import OrderRepository
from app.repositories.payment_repo import PaymentRepository
from app.utils.errors import ConflictError, ForbiddenError, NotFoundError, ValidationError

logger = logging.getLogger(__name__)


class PaymentProvider(Protocol):
    async def create(self, *, payment: Payment, order: Order) -> tuple[str, str | None]: ...


class StubPaymentProvider:
    async def create(self, *, payment: Payment, order: Order) -> tuple[str, str | None]:
        external_id = f"stub_{uuid.uuid4().hex}"
        redirect_url = f"https://stub-payments.local/checkout/{external_id}"
        return external_id, redirect_url


def get_payment_provider() -> PaymentProvider:
    if settings.payment_provider == "stub":
        return StubPaymentProvider()
    raise NotImplementedError(f"Payment provider {settings.payment_provider} is not configured")


def _expected_signature(external_id: str, status: PaymentStatus) -> str:
    msg = f"{external_id}:{status.value}".encode()
    return hmac.new(settings.payment_webhook_secret.encode(), msg, hashlib.sha256).hexdigest()


def verify_webhook_signature(external_id: str, status: PaymentStatus, signature: str) -> bool:
    return hmac.compare_digest(_expected_signature(external_id, status), signature)


def sign_for_testing(external_id: str, status: PaymentStatus) -> str:
    return _expected_signature(external_id, status)


class PaymentService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.payments = PaymentRepository(session)
        self.orders = OrderRepository(session)
        self.provider = get_payment_provider()

    async def create_for_order(self, user: User, order_id: int, method: PaymentMethod) -> tuple[Payment, str | None]:
        order = await self.orders.get_for_user(order_id=order_id, user_id=user.id)
        if order is None:
            raise NotFoundError("Order not found")
        if order.status not in (OrderStatus.DRAFT, OrderStatus.PENDING_PAYMENT):
            raise ConflictError("Order is not payable in its current status")

        order.payment_method = method
        if order.status == OrderStatus.DRAFT:
            order.status = OrderStatus.PENDING_PAYMENT

        payment = await self.payments.create(
            order_id=order.id,
            method=method,
            amount=order.price,
            status=PaymentStatus.PENDING,
        )
        external_id, redirect_url = await self.provider.create(payment=payment, order=order)
        payment.external_payment_id = external_id
        await self.session.flush()
        await self.session.commit()
        return payment, redirect_url

    async def get(self, user: User, payment_id: int) -> Payment:
        payment = await self.payments.get_by_id(payment_id)
        if payment is None:
            raise NotFoundError("Payment not found")
        order = await self.orders.get_by_id(payment.order_id)
        if order is None or order.user_id != user.id:
            raise ForbiddenError("Access denied")
        return payment

    async def handle_webhook(self, *, external_id: str, status: PaymentStatus, signature: str) -> Payment:
        if not verify_webhook_signature(external_id, status, signature):
            raise ValidationError("Invalid webhook signature")

        payment = await self.payments.get_by_external_id(external_id)
        if payment is None:
            raise NotFoundError("Payment not found")

        if payment.status == status:
            return payment

        payment.status = status
        if status == PaymentStatus.SUCCEEDED:
            payment.paid_at = datetime.now(timezone.utc)
            order = await self.orders.get_by_id(payment.order_id)
            if order is not None and order.status in (OrderStatus.PENDING_PAYMENT, OrderStatus.DRAFT):
                order.status = OrderStatus.PAID
        await self.session.flush()
        await self.session.commit()
        return payment
