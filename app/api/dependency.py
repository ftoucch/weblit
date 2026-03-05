from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import Security
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.core.exceptions import UserNotFoundError

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_auth_service():
    return AuthService()

TokenDependency = Annotated[str, Depends(reusable_oauth2)]
AuthServiceDependency = Annotated[AuthService, Depends(get_auth_service)]

async def get_current_user(token: TokenDependency, service: AuthServiceDependency) -> UserResponse:
    payload = Security.decode_access_token(token)

    try:
        user = await service.get_user_by_id(payload["sub"])
    except UserNotFoundError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token or user no longer exists.")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is disabled.")

    return user

CurrentUserDependency = Annotated[UserResponse, Depends(get_current_user)]