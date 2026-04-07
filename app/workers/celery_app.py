from celery import Celery
from app.core.config import config

_broker = config.redis_connection_url.replace("rediss://", "redis://") if config.redis_connection_url.startswith("rediss://") else config.redis_connection_url
_broker_url  = _broker.rstrip("/") + "/0" if not _broker.endswith("/0") else _broker
_backend_url = _broker.rstrip("/0").rstrip("/") + "/1"

if config.redis_url and config.redis_url.startswith("rediss://"):
    _broker_url  = config.redis_url
    _backend_url = config.redis_url

celery_app = Celery(
    "weblit",
    broker=_broker_url,
    backend=_backend_url,
    include=[
        "app.workers.tasks.email_tasks",
        "app.workers.tasks.indexing_tasks",
    ]
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],

    timezone="UTC",
    enable_utc=True,

    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,

    task_max_retries=3,
    task_default_retry_delay=60,

    result_expires=3600,

    # required for Upstash TLS
    broker_use_ssl={"ssl_cert_reqs": "none"} if (config.redis_url or "").startswith("rediss://") else None,
    redis_backend_use_ssl={"ssl_cert_reqs": "none"} if (config.redis_url or "").startswith("rediss://") else None,
)