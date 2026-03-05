from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"