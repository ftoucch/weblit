import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import config

logger = logging.getLogger(__name__)

class EmailService:

    def _get_connection(self) -> smtplib.SMTP:
        smtp = smtplib.SMTP(config.smtp_host, config.smtp_port)
        smtp.ehlo()
        smtp.starttls()

        if config.smtp_user and config.smtp_password:
            smtp.login(config.smtp_user, config.smtp_password)
        return smtp
    
    def _build_message(self, to: str, subject: str, html: str)->MIMEMultipart:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    =  config.smtp_from
        msg["To"]      = to
        msg.attach(MIMEText(html, "html"))
        return msg
    
    def send(self, to: str, subject: str, html: str) -> None:
        try:
            conn = self._get_connection()
            msg  = self._build_message(to, subject, html)
            conn.sendmail(config.smtp_from, to, msg.as_string())
            conn.quit()
            logger.info(f"Email sent to {to} — subject: '{subject}'")
        except Exception as e:
            logger.error(f"Failed to send email to {to}: {e}")
            raise

email_service = EmailService()