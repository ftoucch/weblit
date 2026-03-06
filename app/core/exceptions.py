class EmailAlreadyExistsError(Exception):
    pass

class InvalidCredentialsError(Exception):
    pass

class UserNotFoundError(Exception):
    pass

class UserNotVerifiedError(Exception):
    pass

class OTPExpiredError(Exception):
    pass

class OTPInvalidError(Exception):
    pass

class OTPRateLimitError(Exception):
    pass