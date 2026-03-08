from celery import Celery
from app.core.config import config

celery_app = Celery(
    "weblit",
    broker=f"redis://{config.redis_host}:{config.redis_port}/0",
    backend=f"redis://{config.redis_host}:{config.redis_port}/1",
    include=[
        "app.workers.tasks.email_tasks",
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
)