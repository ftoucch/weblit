def welcome_template(name: str) -> tuple[str, str]:
    subject = "Welcome aboard!"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome, {name}! 🎉</h2>
        <p>Your account has been verified and is ready to use.</p>
        <p>If you have any questions, just reply to this email — we're always happy to help.</p>
    </div>
    """
    return subject, html