from pydantic import BaseModel, EmailStr, Field, field_validator
import re

class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=2)
    gender: str
    address: str = Field(..., min_length=5)
    email: EmailStr  
    contact: str

    @field_validator('contact')
    def validate_contact(cls, v):
        if not re.match(r'^[0-9]{10}$', v):
            raise ValueError('Contact must be 10 digits')
        return v

class EmployeeUpdate(BaseModel):
    name: str = Field(..., min_length=2)
    gender: str
    address: str = Field(..., min_length=5)
    email: EmailStr
    contact: str

    @field_validator('contact')
    def validate_contact(cls, v):
        if not re.match(r'^[0-9]{10}$', v):
            raise ValueError('Contact must be 10 digits')
        return v

class EmployeeResponse(BaseModel):
    _id: str
    name: str
    gender: str
    address: str
    email: EmailStr
    contact: str
