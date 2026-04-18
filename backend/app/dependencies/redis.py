from redis.asyncio import Redis

from app.db.redis import get_redis as _get_redis


def get_redis_dep() -> Redis:
    return _get_redis()
