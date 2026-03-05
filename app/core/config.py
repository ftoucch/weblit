from dotenv import load_dotenv
from pydantic_settings import BaseSettings
import secrets

load_dotenv()


class Config(BaseSettings):
    app_name: str = "weblit"
    debug: bool = False
    mongo_user: str = ""
    mongo_password: str = ""
    mongo_db: str = ""
    mongo_host: str = "mongo"
    mongo_port: int = 27017
    redis_host: str = "redis"
    redis_port: int = 6379
    secret_key: str = secrets.token_urlsafe(32)
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    @property
    def db_url(self):
        return (
            f"mongodb://{self.mongo_user}:{self.mongo_password}"
            f"@{self.mongo_host}:{self.mongo_port}/{self.mongo_db}"
            "?authSource=admin"
        )
    
config = Config()