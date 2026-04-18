from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Order, User
from app.models.order import ColorMode, OrderStatus, PaymentMethod
from app.repositories.file_repo import FileRepository
from app.repositories.order_repo import OrderRepository
from app.schemas.order import OrderCreate, OrderUpdate
from app.services.pricing_service import calculate_price
from app.utils.errors import ConflictError, NotFoundError


class OrderService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.orders = OrderRepository(session)
        self.files = FileRepository(session)

    async def create(self, user: User, payload: OrderCreate) -> Order:
        file_record = await self.files.get_for_user(file_id=payload.file_id, user_id=user.id)
        if file_record is None:
            raise NotFoundError("File not found")
        price = calculate_price(copies=payload.copies, color_mode=payload.color_mode)
        order = await self.orders.create(
            user_id=user.id,
            file_id=payload.file_id,
            copies=payload.copies,
            color_mode=payload.color_mode,
            duplex=payload.duplex,
            price=price,
            status=OrderStatus.DRAFT,
        )
        await self.session.commit()
        return order

    async def get(self, user: User, order_id: int) -> Order:
        order = await self.orders.get_for_user(order_id=order_id, user_id=user.id)
        if order is None:
            raise NotFoundError("Order not found")
        return order

    async def list(self, user: User, *, limit: int = 50, offset: int = 0) -> tuple[list[Order], int]:
        return await self.orders.list_for_user(user_id=user.id, limit=limit, offset=offset)

    async def update(self, user: User, order_id: int, payload: OrderUpdate) -> Order:
        order = await self.get(user, order_id)
        if order.status not in (OrderStatus.DRAFT, OrderStatus.PENDING_PAYMENT):
            raise ConflictError("Order cannot be modified in its current status")

        copies = payload.copies if payload.copies is not None else order.copies
        color_mode: ColorMode = payload.color_mode if payload.color_mode is not None else order.color_mode
        duplex = payload.duplex if payload.duplex is not None else order.duplex
        method: PaymentMethod | None = payload.payment_method if payload.payment_method is not None else order.payment_method

        order.copies = copies
        order.color_mode = color_mode
        order.duplex = duplex
        order.payment_method = method
        order.price = calculate_price(copies=copies, color_mode=color_mode)
        await self.session.flush()
        await self.session.commit()
        return order

    async def confirm(self, user: User, order_id: int) -> Order:
        order = await self.get(user, order_id)
        if order.status != OrderStatus.DRAFT:
            raise ConflictError("Only draft orders can be confirmed")
        order.status = OrderStatus.PENDING_PAYMENT
        await self.session.flush()
        await self.session.commit()
        return order
