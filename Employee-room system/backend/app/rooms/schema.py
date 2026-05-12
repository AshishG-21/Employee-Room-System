from pydantic import BaseModel
from typing import Optional

class RoomCreate(BaseModel):
    name:str
    floor_no:int
    occupancy:str

class RoomUpdate(BaseModel):
    name:str
    floor_no:int
    occupancy:str

class RoomResponse(BaseModel):
    id:str
    name:str
    floor_no:int
    occupancy:str
