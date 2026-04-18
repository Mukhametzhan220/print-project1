from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.dependencies.auth import get_current_user
from app.models import User
from app.schemas.payment import PaymentCreate, PaymentInitOut, PaymentOut, WebhookPayload
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/create", response_model=PaymentInitOut)
async def create_payment(
    payload: PaymentCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> PaymentInitOut:
    payment, redirect_url = await PaymentService(session).create_for_order(
        user=user, order_id=payload.order_id, method=payload.method
    )
    return PaymentInitOut(
        **PaymentOut.model_validate(payment).model_dump(),
        redirect_url=redirect_url,
    )


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def payment_webhook(
    payload: WebhookPayload,
    session: AsyncSession = Depends(get_session),
) -> dict[str, str]:
    payment = await PaymentService(session).handle_webhook(
        external_id=payload.external_payment_id,
        status=payload.status,
        signature=payload.signature,
    )
    return {"status": payment.status.value}


@router.get("/{payment_id}", response_model=PaymentOut)
async def get_payment(
    payment_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> PaymentOut:
    payment = await PaymentService(session).get(user, payment_id)
    return PaymentOut.model_validate(payment)
