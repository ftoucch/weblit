import asyncio
import time

# In-process sliding-window rate limiter. Not shared across instances/restarts —
# fine for a single-instance deployment, avoids running a Redis service just for this.
_windows: dict[str, list[float]] = {}
_lock = asyncio.Lock()


async def check_rate_limit(key: str, max_requests: int, window_seconds: int) -> bool:
    """Returns True if the request is allowed, False if the limit was exceeded."""
    now = time.monotonic()
    async with _lock:
        timestamps = _windows.setdefault(key, [])
        cutoff = now - window_seconds
        while timestamps and timestamps[0] < cutoff:
            timestamps.pop(0)
        if len(timestamps) >= max_requests:
            return False
        timestamps.append(now)
        return True
