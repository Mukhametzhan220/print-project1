from fastapi import HTTPException, status


class AppError(HTTPException):
    code: str = "app_error"
    default_status: int = status.HTTP_400_BAD_REQUEST

    def __init__(self, detail: str | None = None, status_code: int | None = None):
        super().__init__(
            status_code=status_code or self.default_status,
            detail={"code": self.code, "message": detail or self.code},
        )


class NotFoundError(AppError):
    code = "not_found"
    default_status = status.HTTP_404_NOT_FOUND


class ForbiddenError(AppError):
    code = "forbidden"
    default_status = status.HTTP_403_FORBIDDEN


class UnauthorizedError(AppError):
    code = "unauthorized"
    default_status = status.HTTP_401_UNAUTHORIZED


class ValidationError(AppError):
    code = "validation_error"
    default_status = status.HTTP_422_UNPROCESSABLE_ENTITY


class RateLimitError(AppError):
    code = "rate_limited"
    default_status = status.HTTP_429_TOO_MANY_REQUESTS


class ConflictError(AppError):
    code = "conflict"
    default_status = status.HTTP_409_CONFLICT


class TelegramRequiredError(AppError):
    code = "telegram_required"
    default_status = status.HTTP_403_FORBIDDEN
