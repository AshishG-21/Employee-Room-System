from pydantic import BaseModel
from typing import Optional

class BookingCreate(BaseModel):
    employee_id:str
    room_id:str
    start:str
    end:str

class BookingUpdate(BaseModel):
    employee_id:str
    room_id:str
    start:str
    end:str

class BookingResponse(BaseModel):
    _id:str
    employee_id:str
    room_id:str
    employee_name:str
    room_name:str
    start:str
    end:str
