class EmailAlreadyExistsError(Exception):
    pass

class InvalidCredentialsError(Exception):
    pass

class UserNotFoundError(Exception):
    pass

class UserNotVerifiedError(Exception):
    pass