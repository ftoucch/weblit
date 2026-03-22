from app.core.config import config

def password_reset_template(name: str, email:str,  otp: str) -> tuple[str, str]:
    subject = "Reset your password"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Hi {name},</h2>
        <p>Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center;
                    padding: 24px; background: #f4f4f4; border-radius: 8px; margin: 24px 0;">
            <a href="{config.frontend_url}reset-password/?email={email}&otp={otp}"> Reset Password</a>
        </div>
        <p style="color: #888; font-size: 13px;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
    """
    return subject, html