import logging
from datetime import datetime

from sqlalchemy import select

from app.core.config import config
from app.core.security import Security
from app.db.postgres import AsyncSessionLocal
from app.models.orm import User
from app.enums.user import UserRole

logger = logging.getLogger(__name__)


async def seed_admin() -> None:
    """Create or sync the bootstrap admin from ADMIN_EMAIL / ADMIN_PASSWORD.

    Runs on every startup and is idempotent: if the user already exists, its
    password/role are re-synced to match the env vars rather than left alone.
    That's deliberate — it doubles as an admin password-reset path (change
    ADMIN_PASSWORD, redeploy) since there's no other recovery flow. Skipped
    entirely if either env var is unset, so a deploy with no admin configured
    just stays admin-less instead of seeding a predictable account.
    """
    if not config.admin_email or not config.admin_password:
        logger.info("ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin seed.")
        return

    async with AsyncSessionLocal() as session:
        user = await session.scalar(select(User).where(User.email == config.admin_email))

        if user:
            user.hashed_password = Security.hash_password(config.admin_password)
            user.role = UserRole.ADMIN.value
            user.is_active = True
            user.is_verified = True
            user.updated_at = datetime.utcnow()
            await session.commit()
            logger.info(f"Admin user '{config.admin_email}' synced.")
        else:
            session.add(User(
                name=config.admin_name,
                email=config.admin_email,
                hashed_password=Security.hash_password(config.admin_password),
                role=UserRole.ADMIN.value,
                is_active=True,
                is_verified=True,
            ))
            await session.commit()
            logger.info(f"Admin user '{config.admin_email}' created.")
