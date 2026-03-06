import random
import logging

from app.db.redis import redis_client
from app.core.exceptions import OTPExpiredError, OTPRateLimitError, OTPInvalidError

logger = logging.getLogger(__name__)

OTP_TTL_SECONDS = 600  #OTP expires after 10 minutes
OTP_RESEND_COOLDOWN    = 60    # must wait 60s before requesting a new OTP
OTP_MAX_ATTEMPTS       = 5 

class OTPService:

    def _otp_key(self, user_id: str) -> str:
        return f"otp:{user_id}"
    
    def _attempts_key(self, user_id: str) -> str:
        return f"otp_attemps: {user_id}"
    
    def _cooldown_key(self, user_id: str) -> str:
        return f"otp_cooldown: {user_id}"
    
    def _generate(self) -> str:
        return str(random.randint(100000, 999999))
    
    async def create(self, user_id: str) -> str:
        """
        Generates a 6-digit OTP, stores it in Redis with a TTL,
        and sets a resend cooldown. Returns the OTP to be emailed.
        """
        cooldown = await redis_client.get(self._cooldown_key(user_id))
        if cooldown:
            raise OTPRateLimitError("Please wait before requesting a new OTP.")
        
        otp = self._generate()

        await redis_client.set(self._otp_key(user_id), otp, ex=OTP_TTL_SECONDS)

        await redis_client.delete(self._attempts_key(user_id))

        await redis_client.set(self._cooldown_key(user_id), "1", ex=OTP_RESEND_COOLDOWN)

        logger.info(f"OTP created for user {user_id}")
        return otp
    
    async def verify(self, user_id: str, otp: str) -> bool:
        """
        Verifies the OTP. Raises on expiry, invalid, or too many attempts.
        Deletes the OTP from Redis on success.
        """
        stored_otp = await redis_client.get(self._otp_key(user_id))

        if not stored_otp:
            raise OTPExpiredError("OTP has expired. Please request a new one.")

        attempts = await redis_client.incr(self._attempts_key(user_id))
        if attempts > OTP_MAX_ATTEMPTS:
            await redis_client.delete(self._otp_key(user_id))
            raise OTPRateLimitError("Too many failed attempts. Please request a new OTP.")

        if stored_otp != otp:
            raise OTPInvalidError(f"Invalid OTP. {OTP_MAX_ATTEMPTS - attempts} attempts remaining.")

        await redis_client.delete(self._otp_key(user_id))
        await redis_client.delete(self._attempts_key(user_id))
        await redis_client.delete(self._cooldown_key(user_id))

        logger.info(f"OTP verified for user {user_id}")
        return True
    
otp_service = OTPService()