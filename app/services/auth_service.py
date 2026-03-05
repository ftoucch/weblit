from datetime import timedelta
from bson import ObjectId
from app.core.security import Security
from app.core.config import config
from app.core.exceptions import EmailAlreadyExistsError, InvalidCredentialsError, UserNotFoundError, UserNotVerifiedError
from app.db.config import mongo_db

from app.models.user import UserDocument
from app.schemas.user import UserCreate, UserResponse
from app.enums.user import UserRole

class AuthService:
    def __init__(self) :
        self.users = mongo_db.collections["users"]

    def _to_response(self, doc: UserDocument) -> UserResponse:
        """converts a DB model into a safe APU schema"""
        return UserResponse(
            id = str(doc.id),
            name=doc.name,
            email=doc.email,
            role=doc.role,
            is_active=doc.is_active,
            is_verified=doc.is_verified,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
            last_login_at=doc.last_login_at,
        )

    async def register_user(self, data: UserCreate) -> UserResponse:
        existing_user = await self.users.find_one({"email": data.email})
        if existing_user:
            raise EmailAlreadyExistsError(data.email)
        
        user_doc = UserDocument(
            name=data.name,
            email=data.email,
            hashed_password=Security.hash_password(data.password),
        )
        
        await self.users.insert_one(user_doc.model_dump(by_alias=True))
        return self._to_response(user_doc)
    
    async def login_user(self, email: str, password: str) -> str:
        user = await self.users.find_one({"email": email})

        if not user or not Security.verify_password(password, user["hashed_password"]):
            raise InvalidCredentialsError()
        
        access_token_expires = timedelta(minutes=config.access_token_expire_minutes)
        return Security.create_access_token(
            subject=str(user["_id"]),
            expires_delta=access_token_expires,
        )
    
    async def get_user_by_id(self, user_id: str) -> UserResponse:
        user = await self.users.find_one({"_id": ObjectId(user_id)})
        if not user: 
            raise UserNotFoundError(user_id)
        
        user_doc = UserDocument(**user)
        return self._to_response(user_doc)