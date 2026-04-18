from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Order, OrderStatus


class OrderRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, **fields) -> Order:
        order = Order(**fields)
        self.session.add(order)
        await self.session.flush()
        return order

    async def get_for_user(self, order_id: int, user_id: int) -> Order | None:
        stmt = select(Order).where(Order.id == order_id, Order.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, order_id: int) -> Order | None:
        return await self.session.get(Order, order_id)

    async def list_for_user(self, user_id: int, limit: int = 50, offset: int = 0) -> tuple[list[Order], int]:
        base = select(Order).where(Order.user_id == user_id)
        total = await self.session.scalar(select(func.count()).select_from(base.subquery()))
        stmt = base.order_by(desc(Order.created_at)).limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all()), int(total or 0)

    async def update(self, order: Order, **fields) -> Order:
        for key, value in fields.items():
            if value is not None:
                setattr(order, key, value)
        await self.session.flush()
        return order

    async def set_status(self, order: Order, status: OrderStatus) -> Order:
        order.status = status
        await self.session.flush()
        return order
