from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import Optional
import secrets

load_dotenv()


class Config(BaseSettings):
    app_name: str = "weblit"
    app_env: str = "development"
    debug: bool = False

    mongo_uri: Optional[str] = None  
    mongo_user: str = ""
    mongo_password: str = ""
    mongo_db: str = "weblit"
    mongo_host: str = "mongo"
    mongo_port: int = 27017

    redis_url: Optional[str] = None
    redis_host: str = "redis"
    redis_port: int = 6379

    qdrant_host: str = "qdrant"
    qdrant_port: int = 6333
    qdrant_api_key: Optional[str] = None   
    qdrant_use_https: bool = False
    qdrant_collection: str = "papers"

    embedding_model: str = "all-mpnet-base-v2"
    vector_size: int = 768

    smtp_host: str = "mailhog"
    smtp_port: int = 1025
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@weblit.com"

    secret_key: str = secrets.token_urlsafe(32)
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    frontend_url: str = ""
    allowed_origins: str = "*"

    openalex_email: str = "ftoucch@gmail.com"

    @property
    def db_url(self) -> str:
        if self.mongo_uri:
            return self.mongo_uri
        return (
            f"mongodb://{self.mongo_user}:{self.mongo_password}"
            f"@{self.mongo_host}:{self.mongo_port}/{self.mongo_db}"
            "?authSource=admin"
        )

    @property
    def redis_connection_url(self) -> str:
        if self.redis_url:
            return self.redis_url
        return f"redis://{self.redis_host}:{self.redis_port}"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


config = Config()