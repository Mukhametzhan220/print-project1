from redis.asyncio import Redis

from app.utils.errors import RateLimitError


class RateLimiter:
    def __init__(self, redis: Redis):
        self.redis = redis

    async def hit(self, key: str, limit: int, window_seconds: int) -> None:
        full_key = f"ratelimit:{key}"
        current = await self.redis.incr(full_key)
        if current == 1:
            await self.redis.expire(full_key, window_seconds)
        if current > limit:
            raise RateLimitError("Too many requests, try again later")
