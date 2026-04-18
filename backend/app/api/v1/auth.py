from fastapi import APIRouter, Depends, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_session
from app.dependencies.auth import get_current_user
from app.dependencies.redis import get_redis_dep
from app.models import User
from app.schemas.auth import SendCodeRequest, SendCodeResponse, TokenResponse, VerifyCodeRequest
from app.schemas.user import UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/send-code", response_model=SendCodeResponse, status_code=status.HTTP_200_OK)
async def send_code(
    payload: SendCodeRequest,
    session: AsyncSession = Depends(get_session),
    redis: Redis = Depends(get_redis_dep),
) -> SendCodeResponse:
    expires_in = await AuthService(session, redis).send_code(payload.phone)
    return SendCodeResponse(sent=True, expires_in=expires_in)


@router.post("/verify-code", response_model=TokenResponse)
async def verify_code(
    payload: VerifyCodeRequest,
    session: AsyncSession = Depends(get_session),
    redis: Redis = Depends(get_redis_dep),
) -> TokenResponse:
    _, token = await AuthService(session, redis).verify_code(payload.phone, payload.code, payload.language)
    return TokenResponse(access_token=token, expires_in=settings.jwt_expires_minutes * 60)


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(user)
