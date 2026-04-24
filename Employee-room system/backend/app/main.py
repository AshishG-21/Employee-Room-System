from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = MongoClient("mongodb://localhost:27017")
db = client["office_booking"]

employees_col = db["employees"]
rooms_col = db["rooms"]
assignments_col = db["assignments"]


def serialize(data):
    data["_id"] = str(data["_id"])
    return data



@app.post("/employees")
def add_employee(name: str,address:str,email:str,contact:str):
    name = name.strip()
    address = address.strip()
    email = email.strip()
    contact = contact.strip()

    if not name:
        raise HTTPException(status_code=400, detail="Name required")
    if not address:
        raise HTTPException(status_code=400, detail="Address required")
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    if not contact:
        raise HTTPException(status_code=400, detail="Contact required")

    existing = employees_col.find_one({"name": name})
    if existing:
        raise HTTPException(status_code=400, detail="Employee already exists")

    result = employees_col.insert_one({"name": name, "address": address, "email": email, "contact": contact})

    return {
        "_id": str(result.inserted_id),
        "name": name,
        "address": address,
        "email": email,
        "contact": contact
    }


@app.get("/employees")
def get_employees():
    return [serialize(e) for e in employees_col.find()]

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str):
    try:
        emp_id = ObjectId(employee_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = employees_col.delete_one({"_id": emp_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted successfully"}



@app.post("/rooms")
def add_room(name: str,floor_no:int,size:int):
    name = name.strip()
    floor_no = floor_no.strip()
    size = size.strip()

    if not name:
        raise HTTPException(status_code=400, detail="Room name required")
    if not floor_no:
        raise HTTPException(status_code=400, detail="Floor number required")
    if not size:
        raise HTTPException(status_code=400, detail="Size required")

    existing = rooms_col.find_one({"room_name": name})
    if existing:
        raise HTTPException(status_code=400, detail="Room already exists")

    result = rooms_col.insert_one({"room_name": name, "floor_no": floor_no, "size": size})

    return {
        "_id": str(result.inserted_id),
        "room_name": name,
        "floor_no": floor_no,
        "size": size
    }


@app.get("/rooms")
def get_rooms():
    return [serialize(r) for r in rooms_col.find()]

@app.delete("/rooms/{room_id}")
def delete_room(room_id: str):
    try:
        room_id_obj = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = rooms_col.delete_one({"_id": room_id_obj})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Room not found")

    return {"message": "Room deleted successfully"}


@app.post("/assign")
def assign(employee_id: str, room_id: str,start:str,end:str):



    
    try:
        emp_id = ObjectId(employee_id)
        room_id_obj = ObjectId(room_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    
    emp = employees_col.find_one({"_id": emp_id})
    room = rooms_col.find_one({"_id": room_id_obj})

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if start>=end:
        raise HTTPException(status_code=400,detail="Invalid time range")

    existing_room = assignments_col.find_one({"room_id": room_id})
    for b in assignments_col.find({"room_id": room_id}):
        if existing_room:
            if not (end<=b["start"] or start>=b["end"]):
                raise HTTPException(status_code=400,detail="Room already booked for the given time")

    
    existing_employee = assignments_col.find_one({"employee_id": employee_id})
    for b in assignments_col.find({"employee_id": employee_id}):
        if existing_employee:
            if not (end<=b["start"] or start>=b["end"]):
                raise HTTPException(status_code=400,detail="Employee already has a room booked for the given time")

    
    assignment = {
        "employee_id": employee_id,
        "room_id": room_id,
        "start": start,
        "end": end
    }

    assignments_col.insert_one(assignment)

    return assignment



@app.get("/assignments")
def get_assignments():
    return [serialize(b) for b in assignments_col.find()]

@app.delete("/assignments/{booking_id}")
def delete_assignment(booking_id: str):
    try:
        booking_id_obj = ObjectId(booking_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = assignments_col.delete_one({"_id": booking_id_obj})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Assignment not found")

    return {"message": "Assignment deleted successfully"}
