from fastapi import APIRouter
from app.api.routes import health, chat

api_router = APIRouter()

# Include all modular routes here
api_router.include_router(health.router, tags=["health"])
api_router.include_router(chat.router, tags=["chat"])
