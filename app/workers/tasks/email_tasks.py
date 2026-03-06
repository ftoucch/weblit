import logging
from app.workers.celery_app import celery_app
from app.services.email_service import email_service
from app.email.templates.welcome_template import welcome_template
from app.email.templates.otp_verification_template import otp_verification_template
from app.email.templates.password_reset_template import password_reset_template

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60, name="tasks.send_otp_verification")
def send_otp_verification(self, name: str, email: str, otp: str) -> None:
    """Fired after registration — sends OTP for email verification."""
    try:
        subject, html = otp_verification_template(name=name, otp=otp)
        email_service.send(to=email, subject=subject, html=html)
    except Exception as e:
        logger.error(f"send_otp_verification failed for {email}: {e}")
        raise self.retry(exc=e)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60, name="tasks.send_welcome_email")
def send_welcome_email(self, name: str, email: str) -> None:
    """Fired after email is successfully verified."""
    try:
        subject, html = welcome_template(name=name)
        email_service.send(to=email, subject=subject, html=html)
    except Exception as e:
        logger.error(f"send_welcome_email failed for {email}: {e}")
        raise self.retry(exc=e)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60, name="tasks.send_password_reset")
def send_password_reset(self, name: str, email: str, otp: str) -> None:
    """Fired when user requests a password reset."""
    try:
        subject, html = password_reset_template(name=name, otp=otp)
        email_service.send(to=email, subject=subject, html=html)
    except Exception as e:
        logger.error(f"send_password_reset failed for {email}: {e}")
        raise self.retry(exc=e)

