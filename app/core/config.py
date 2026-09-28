from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import Optional
import secrets

load_dotenv()


class Config(BaseSettings):
    app_name: str = "weblit"
    app_env: str = "development"
    debug: bool = False

    database_url: str = "postgresql://weblit:weblit@localhost:5432/weblit"

    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    vector_size: int = 384

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

    # Bootstrap admin — if both are set, seeded/synced as an admin user on every
    # startup (see app/db/seed.py). Unset by default so a deploy with no admin
    # configured stays admin-less rather than seeding a predictable account.
    admin_email: Optional[str] = None
    admin_password: Optional[str] = None
    admin_name: str = "Admin"

    @property
    def sqlalchemy_database_url(self) -> str:
        """Normalise DATABASE_URL to the asyncpg driver.

        Railway's Postgres plugin (and most providers) set DATABASE_URL as
        postgres:// or postgresql://, but SQLAlchemy's async engine needs an
        explicit +asyncpg driver in the scheme.
        """
        url = self.database_url
        if url.startswith("postgres://"):
            return "postgresql+asyncpg://" + url[len("postgres://"):]
        if url.startswith("postgresql://") and "+asyncpg" not in url:
            return "postgresql+asyncpg://" + url[len("postgresql://"):]
        return url

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


config = Config()
