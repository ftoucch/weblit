def password_reset_confirmation_template(name: str) -> tuple[str, str]:
    subject = "Your password has been reset"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Hi {name},</h2>
        <p>Your password has been successfully reset.</p>
        <p style="color: #888; font-size: 13px;">If you did not do this, please contact support immediately.</p>
    </div>
    """
    return subject, html