from pydantic import BaseModel, EmailStr, Field
from pydantic import ConfigDict 
from bson import ObjectId
from datetime import datetime
from app.enums.user import UserRole


class UserDocument(BaseModel):

    model_config = ConfigDict(   
        arbitrary_types_allowed=True,
        populate_by_name=True
    )

    id: ObjectId = Field(default_factory = ObjectId, alias="_id")
    name: str
    email: str
    hashed_password: str

    role: UserRole = UserRole.USER
    is_active: bool = True
    is_verified: bool = False
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: datetime | None = None