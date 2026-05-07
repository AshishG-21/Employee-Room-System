from pydantic import BaseModel

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
    id:str
    employee_name:str
    room_name:str
    start:str
    end:str

