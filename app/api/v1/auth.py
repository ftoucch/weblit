from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from app.schemas.user import UserCreate, UserResponse, Token
from app.api.dependency import AuthServiceDependency, CurrentUserDependency
from app.core.exceptions import EmailAlreadyExistsError, InvalidCredentialsError

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, service: AuthServiceDependency)-> UserResponse:
    try:
        return await service.register_user(data)
    except EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="A user with this email already exists"
        )
    
@router.post("/login", status_code=status.HTTP_200_OK)
async def login(service: AuthServiceDependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()])-> Token:
    try:
        access_token = await service.login_user(email=form_data.username, password=form_data.password)
        return Token(access_token=access_token)
    
    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Invalid credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: CurrentUserDependency) -> UserResponse:
    return current_user