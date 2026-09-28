import random
import uuid
import logging
from datetime import datetime, timedelta

from app.db.postgres import AsyncSessionLocal
from app.models.orm import OTPCode
from app.core.exceptions import OTPExpiredError, OTPRateLimitError, OTPInvalidError

logger = logging.getLogger(__name__)

OTP_TTL_SECONDS = 600  # OTP expires after 10 minutes
OTP_RESEND_COOLDOWN = 60  # must wait 60s before requesting a new OTP
OTP_MAX_ATTEMPTS = 5


class OTPService:

    def _generate(self) -> str:
        return str(random.randint(100000, 999999))

    async def create(self, user_id: str, purpose: str) -> str:
        uid = uuid.UUID(user_id)
        now = datetime.utcnow()

        async with AsyncSessionLocal() as session:
            row = await session.get(OTPCode, (uid, purpose))

            if row and row.cooldown_until and row.cooldown_until > now:
                raise OTPRateLimitError("Please wait before requesting a new OTP.")

            otp = self._generate()
            expires_at = now + timedelta(seconds=OTP_TTL_SECONDS)
            cooldown_until = now + timedelta(seconds=OTP_RESEND_COOLDOWN)

            if row:
                row.code = otp
                row.attempts = 0
                row.expires_at = expires_at
                row.cooldown_until = cooldown_until
            else:
                session.add(OTPCode(
                    user_id=uid,
                    purpose=purpose,
                    code=otp,
                    attempts=0,
                    expires_at=expires_at,
                    cooldown_until=cooldown_until,
                ))

            await session.commit()
            return otp

    async def verify(self, user_id: str, otp: str, purpose: str) -> bool:
        uid = uuid.UUID(user_id)
        now = datetime.utcnow()

        async with AsyncSessionLocal() as session:
            row = await session.get(OTPCode, (uid, purpose))

            if not row or row.expires_at < now:
                if row:
                    await session.delete(row)
                    await session.commit()
                raise OTPExpiredError("OTP has expired. Please request a new one.")

            row.attempts += 1
            if row.attempts > OTP_MAX_ATTEMPTS:
                await session.delete(row)
                await session.commit()
                raise OTPRateLimitError("Too many failed attempts. Please request a new OTP.")

            if row.code != otp:
                remaining = OTP_MAX_ATTEMPTS - row.attempts
                await session.commit()
                raise OTPInvalidError(f"Invalid OTP. {remaining} attempts remaining.")

            await session.delete(row)
            await session.commit()
            return True


otp_service = OTPService()
