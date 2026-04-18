from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Payment


class PaymentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, **fields) -> Payment:
        payment = Payment(**fields)
        self.session.add(payment)
        await self.session.flush()
        return payment

    async def get_by_id(self, payment_id: int) -> Payment | None:
        return await self.session.get(Payment, payment_id)

    async def get_by_external_id(self, external_id: str) -> Payment | None:
        stmt = select(Payment).where(Payment.external_payment_id == external_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def update(self, payment: Payment, **fields) -> Payment:
        for key, value in fields.items():
            if value is not None:
                setattr(payment, key, value)
        await self.session.flush()
        return payment
