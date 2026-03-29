from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    
    class Config:
        orm_mode = True

class ReviewCreate(BaseModel):
    rating_overall: int
    body: str

class ReviewResponse(BaseModel):
    id: int
    source: str
    reviewer_name: str
    reviewer_type: Optional[str]
    rating_overall: int
    body: str
    created_at: datetime
    helpful_count: int
    
    class Config:
        orm_mode = True
