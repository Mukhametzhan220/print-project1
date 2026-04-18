from fastapi import APIRouter

from app.api.v1 import auth, files, health, orders, payments

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(files.router)
api_router.include_router(orders.router)
api_router.include_router(payments.router)

service_router = APIRouter()
service_router.include_router(health.router)
