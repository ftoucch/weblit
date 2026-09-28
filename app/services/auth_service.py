import asyncio
import logging
import uuid
from datetime import timedelta, datetime

from sqlalchemy import select

from app.core.security import Security
from app.core.config import config
from app.core.exceptions import EmailAlreadyExistsError, InvalidCredentialsError, UserNotFoundError
from app.db.postgres import AsyncSessionLocal
from app.models.orm import User
from app.schemas.user import UserCreate, UserResponse
from app.services.otp_service import otp_service
from app.services.email_service import email_service

logger = logging.getLogger(__name__)


def _send_email_background(fn, /, **kwargs) -> None:
    async def _run():
        try:
            await asyncio.to_thread(fn, **kwargs)
        except Exception as e:
            logger.error(f"Background email send failed ({fn.__name__}): {e}")

    asyncio.create_task(_run())


class AuthService:

    def _to_response(self, user: User) -> UserResponse:
        return UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at,
            updated_at=user.updated_at,
            last_login_at=user.last_login_at,
        )

    async def register_user(self, data: UserCreate) -> UserResponse:
        async with AsyncSessionLocal() as session:
            existing = await session.scalar(select(User).where(User.email == data.email))
            if existing:
                raise EmailAlreadyExistsError(data.email)

            user = User(
                name=data.name,
                email=data.email,
                hashed_password=Security.hash_password(data.password),
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)

        otp = await otp_service.create(str(user.id), purpose="verify_email")
        _send_email_background(email_service.send_otp_verification, name=user.name, email=user.email, otp=otp)

        return self._to_response(user)

    async def verify_email(self, user_id: str, otp: str) -> UserResponse:
        await otp_service.verify(user_id, otp, purpose="verify_email")

        async with AsyncSessionLocal() as session:
            user = await session.get(User, uuid.UUID(user_id))
            if not user:
                raise UserNotFoundError(user_id)

            user.is_verified = True
            await session.commit()
            await session.refresh(user)

        _send_email_background(email_service.send_welcome_email, name=user.name, email=user.email)

        return self._to_response(user)

    async def resend_otp(self, user_id: str) -> None:
        async with AsyncSessionLocal() as session:
            user = await session.get(User, uuid.UUID(user_id))
            if not user:
                raise UserNotFoundError(user_id)
            if user.is_verified:
                return
            name, email = user.name, user.email

        otp = await otp_service.create(user_id, purpose="verify_email")
        _send_email_background(email_service.send_otp_verification, name=name, email=email, otp=otp)

    async def login_user(self, email: str, password: str) -> str:
        async with AsyncSessionLocal() as session:
            user = await session.scalar(select(User).where(User.email == email))

        if not user or not Security.verify_password(password, user.hashed_password):
            raise InvalidCredentialsError()

        access_token_expires = timedelta(minutes=config.access_token_expire_minutes)
        return Security.create_access_token(
            subject=str(user.id),
            expires_delta=access_token_expires,
        )

    async def get_user_by_id(self, user_id: str) -> UserResponse:
        async with AsyncSessionLocal() as session:
            user = await session.get(User, uuid.UUID(user_id))
            if not user:
                raise UserNotFoundError(user_id)
            return self._to_response(user)

    async def forgot_password(self, email: str) -> None:
        async with AsyncSessionLocal() as session:
            user = await session.scalar(select(User).where(User.email == email))
            if not user:
                return
            user_id, name = str(user.id), user.name

        otp = await otp_service.create(user_id, purpose="password_reset")
        _send_email_background(email_service.send_password_reset, name=name, email=email, otp=otp)

    async def reset_password(self, email: str, otp: str, new_password: str) -> None:
        async with AsyncSessionLocal() as session:
            user = await session.scalar(select(User).where(User.email == email))
            if not user:
                return
            user_id = str(user.id)

        await otp_service.verify(user_id, otp, purpose="password_reset")

        async with AsyncSessionLocal() as session:
            user = await session.get(User, uuid.UUID(user_id))
            if not user:
                return
            user.hashed_password = Security.hash_password(new_password)
            user.updated_at = datetime.utcnow()
            await session.commit()
            name = user.name

        _send_email_background(email_service.send_password_reset_confirmation, name=name, email=email)


auth_service = AuthService()
