from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import Security
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.core.exceptions import UserNotFoundError


reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

TokenDependency = Annotated[str | None, Depends(reusable_oauth2)]

def get_auth_service() -> AuthService:
    return AuthService()

AuthServiceDependency = Annotated[AuthService, Depends(get_auth_service)]


async def get_current_user(
    token: TokenDependency,
    service: AuthServiceDependency,
) -> UserResponse | None:
    
    if not token:
        return None
    try:
        payload = Security.decode_access_token(token)
        user = await service.get_user_by_id(payload["sub"])
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or user no longer exists."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled."
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before continuing."
        )

    return user


def require_auth(
    current_user: Annotated[UserResponse | None, Depends(get_current_user)]
) -> UserResponse:
    
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required."
        )
    return current_user


CurrentUserDependency  = Annotated[UserResponse, Depends(require_auth)]
GuestOrUserDependency  = Annotated[UserResponse | None, Depends(get_current_user)]