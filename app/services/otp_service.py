import random
import logging

from app.db.redis import redis_client
from app.core.exceptions import OTPExpiredError, OTPRateLimitError, OTPInvalidError

logger = logging.getLogger(__name__)

OTP_TTL_SECONDS = 600  #OTP expires after 10 minutes
OTP_RESEND_COOLDOWN    = 60    # must wait 60s before requesting a new OTP
OTP_MAX_ATTEMPTS       = 5 

class OTPService:

    def _otp_key(self, user_id: str, purpose: str) -> str:
        return f"otp:{purpose}:{user_id}"

    def _attempts_key(self, user_id: str, purpose: str) -> str:
        return f"otp_attempts:{purpose}:{user_id}"

    def _cooldown_key(self, user_id: str, purpose: str) -> str:
        return f"otp_cooldown:{purpose}:{user_id}"
    
    def _generate(self) -> str:
        return str(random.randint(100000, 999999))
    
    async def create(self, user_id: str, purpose: str) -> str:
        cooldown = await redis_client.get(self._cooldown_key(user_id, purpose))
        if cooldown:
            raise OTPRateLimitError("Please wait before requesting a new OTP.")

        otp = self._generate()
        await redis_client.set(self._otp_key(user_id, purpose), otp, ex=OTP_TTL_SECONDS)
        await redis_client.delete(self._attempts_key(user_id, purpose))
        await redis_client.set(self._cooldown_key(user_id, purpose), "1", ex=OTP_RESEND_COOLDOWN)
        return otp

    async def verify(self, user_id: str, otp: str, purpose: str) -> bool:
        stored_otp = await redis_client.get(self._otp_key(user_id, purpose))
        if not stored_otp:
            raise OTPExpiredError("OTP has expired. Please request a new one.")

        attempts = await redis_client.incr(self._attempts_key(user_id, purpose))
        if attempts > OTP_MAX_ATTEMPTS:
            await redis_client.delete(self._otp_key(user_id, purpose))
            raise OTPRateLimitError("Too many failed attempts. Please request a new OTP.")

        if stored_otp != otp:
            raise OTPInvalidError(f"Invalid OTP. {OTP_MAX_ATTEMPTS - attempts} attempts remaining.")

        await redis_client.delete(self._otp_key(user_id, purpose))
        await redis_client.delete(self._attempts_key(user_id, purpose))
        await redis_client.delete(self._cooldown_key(user_id, purpose))
        return True
    
otp_service = OTPService()