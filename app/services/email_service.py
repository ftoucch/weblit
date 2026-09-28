import smtplib
import logging
import httpx
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import config
from app.email.templates.welcome_template import welcome_template
from app.email.templates.otp_verification_template import otp_verification_template
from app.email.templates.password_reset_template import password_reset_template
from app.email.templates.password_reset_confirmation_template import password_reset_confirmation_template

logger = logging.getLogger(__name__)

class EmailService:

    def _get_connection(self) -> smtplib.SMTP:
        if config.smtp_port == 465:
            smtp = smtplib.SMTP_SSL(config.smtp_host, config.smtp_port, timeout=10)
        else:
            smtp = smtplib.SMTP(config.smtp_host, config.smtp_port, timeout=10)
            smtp.ehlo()
            if config.app_env == "production":
                smtp.starttls()

        if config.smtp_user and config.smtp_password:
            smtp.login(config.smtp_user, config.smtp_password)
        return smtp

    def _build_message(self, to: str, subject: str, html: str) -> MIMEMultipart:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = config.smtp_from
        msg["To"]      = to
        msg.attach(MIMEText(html, "html"))
        return msg

    def send(self, to: str, subject: str, html: str) -> None:
        try:
            if config.app_env == "production":
                response = httpx.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {config.smtp_password}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": config.smtp_from,
                        "to": [to],
                        "subject": subject,
                        "html": html,
                    },
                    timeout=10,
                )
                response.raise_for_status()
            else:
                conn = self._get_connection()
                msg  = self._build_message(to, subject, html)
                conn.sendmail(config.smtp_from, to, msg.as_string())
                conn.quit()

            logger.info(f"Email sent to {to} — subject: '{subject}'")
        except Exception as e:
            logger.error(f"Failed to send email to {to}: {e}")
            raise

    def send_otp_verification(self, name: str, email: str, otp: str) -> None:
        subject, html = otp_verification_template(name=name, otp=otp)
        self.send(to=email, subject=subject, html=html)

    def send_welcome_email(self, name: str, email: str) -> None:
        subject, html = welcome_template(name=name)
        self.send(to=email, subject=subject, html=html)

    def send_password_reset(self, name: str, email: str, otp: str) -> None:
        subject, html = password_reset_template(name=name, email=email, otp=otp)
        self.send(to=email, subject=subject, html=html)

    def send_password_reset_confirmation(self, name: str, email: str) -> None:
        subject, html = password_reset_confirmation_template(name=name)
        self.send(to=email, subject=subject, html=html)

email_service = EmailService()