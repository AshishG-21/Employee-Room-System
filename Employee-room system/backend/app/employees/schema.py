from pydantic import BaseModel
from typing import Optional

class EmployeeCreate(BaseModel):
    name:str
    gender:str
    address:str
    email:str
    contact:str
class EmployeeUpdate(BaseModel):
    name:str
    gender:str
    address:str
    email:str
    contact:str
class EmployeeResponse(BaseModel):
    id:str
    name:str
    gender:str
    address:str
    email:str
    contact:str
