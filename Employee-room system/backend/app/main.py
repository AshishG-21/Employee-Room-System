from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

employees=[]
rooms=[]
bookings=[]

@app.post("/employees")
def add_employees(name:str):
    emp= {"id":len(employees)+1,"name":name}
    employees.append(emp)
    return emp

@app.get("/get_employees")
def get_employees():
    return employees

@app.post("/rooms")
def add_rooms(name:str):
    room={"room_id":len(rooms)+1, "room_name":name}
    rooms.append(room)
    return room

@app.get("/get_rooms")
def get_rooms():
    return rooms


@app.post("/book")
def book_room(employee_id:int,room_id:int,start:str,end:str):
    if start>=end:
        raise HTTPException(status_code=400,detail="Invalid time range")

    for b in bookings:
        if b["room_id"]==room_id:
            if not (end<=b["start"] or start>=b["end"]):
                raise HTTPException(status_code=400,detail="Time conflict")
        
    booking={"employee_id":employee_id, "room_id":room_id,"start":start,"end":end}
    bookings.append(booking)
    return booking

@app.get("/bookings")
def get_bookings():
    return bookings
