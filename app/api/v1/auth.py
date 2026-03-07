from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from app.schemas.user import UserCreate, UserResponse, Token, UserVerifyEmail, UserForgotPassword, UserResetPassword
from app.api.dependency import AuthServiceDependency, CurrentUserDependency
from app.core.exceptions import EmailAlreadyExistsError, InvalidCredentialsError, OTPExpiredError, OTPInvalidError, OTPRateLimitError

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

@router.post("/verify-email", response_model=UserResponse)
async def verify_email(data: UserVerifyEmail, service: AuthServiceDependency) -> UserResponse:
    try:
        return await service.verify_email(data.user_id, data.otp)
    except OTPExpiredError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except OTPInvalidError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except OTPRateLimitError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))


@router.post("/resend-otp", status_code=status.HTTP_204_NO_CONTENT)
async def resend_otp(service: AuthServiceDependency, current_user: CurrentUserDependency) -> None:
    try:
        await service.resend_otp(current_user.id)
    except OTPRateLimitError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    
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


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(data: UserForgotPassword, service: AuthServiceDependency) -> dict:
    await service.forgot_password(data.email)
    return {"message": "If this email is registered you will receive an OTP shortly."}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(data: UserResetPassword, service: AuthServiceDependency)->dict:
    try:
        await service.reset_password(data.user_id, data.otp, data.new_password)
        return {"message": "Password reset successfully."}
    
    except OTPExpiredError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except OTPInvalidError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except OTPRateLimitError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: CurrentUserDependency) -> UserResponse:
    return current_user