from fastapi import FastAPI, HTTPException, Query
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

def paginate(collection, page=1, limit=10, filter_query={}):
    page = int(page)
    limit = int(limit)
    skip = (page - 1) * limit
    
    total = collection.count_documents(filter_query)
    items = list(collection.find(filter_query).skip(skip).limit(limit))
    
    return {
        "data": [serialize(item) for item in items],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "limit": limit
    }


@app.post("/employees")
def add_employee(name: str, gender: str, address: str, email: str, contact: str):
    if not all([name, gender, address, email, contact]):
        raise HTTPException(400, "All fields required")
    
    if employees_col.find_one({"name": name}):
        raise HTTPException(400, "Employee already exists")
    
    result = employees_col.insert_one({
        "name": name.strip(),
        "gender": gender.strip(),
        "address": address.strip(),
        "email": email.strip(),
        "contact": contact.strip()
    })
    
    return {"_id": str(result.inserted_id), "name": name, "gender": gender, "address": address, "email": email, "contact": contact}

@app.get("/employees")
def get_employees(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    return paginate(employees_col, page, limit)

@app.get("/employees/all")
def get_all_employees():
    return [serialize(e) for e in employees_col.find()]


@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str):
    try:
        result = employees_col.delete_one({"_id": ObjectId(employee_id)})
        if result.deleted_count == 0:
            raise HTTPException(404, "Employee not found")
        assignments_col.delete_many({"employee_id": employee_id})
        return {"message": "Deleted successfully"}
    except InvalidId:
        raise HTTPException(400, "Invalid ID")



@app.post("/rooms")
def add_room(name: str, floor_no: int, size: str):
    if not all([name, floor_no, size]):
        raise HTTPException(400, "All fields required")
    
    if rooms_col.find_one({"room_name": name}):
        raise HTTPException(400, "Room already exists")
    
    result = rooms_col.insert_one({
        "room_name": name.strip(),
        "floor_no": floor_no,
        "size": size
    })
    
    return {"_id": str(result.inserted_id), "room_name": name, "floor_no": floor_no, "size": size}

@app.get("/rooms")
def get_rooms(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    return paginate(rooms_col, page, limit)

@app.get("/rooms/all")
def get_all_rooms():
    return [serialize(r) for r in rooms_col.find()]

@app.delete("/rooms/{room_id}")
def delete_room(room_id: str):
    try:
        result = rooms_col.delete_one({"_id": ObjectId(room_id)})
        if result.deleted_count == 0:
            raise HTTPException(404, "Room not found")
        assignments_col.delete_many({"room_id": room_id})
        return {"message": "Deleted successfully"}
    except InvalidId:
        raise HTTPException(400, "Invalid ID")


@app.post("/assign")
def assign(employee_id: str, room_id: str, start: str, end: str):
    try:
        emp = employees_col.find_one({"_id": ObjectId(employee_id)})
        room = rooms_col.find_one({"_id": ObjectId(room_id)})
        
        if not emp or not room:
            raise HTTPException(404, "Employee or Room not found")
        
        if start >= end:
            raise HTTPException(400, "Invalid time range")
        for b in assignments_col.find({"room_id": room_id}):
            if not (end <= b["start"] or start >= b["end"]):
                raise HTTPException(400, "Room already booked")
        
        for b in assignments_col.find({"employee_id": employee_id}):
            if not (end <= b["start"] or start >= b["end"]):
                raise HTTPException(400, "Employee already booked")
        
        result = assignments_col.insert_one({
            "employee_id": employee_id,
            "room_id": room_id,
            "start": start,
            "end": end
        })
        
        return {
            "_id": str(result.inserted_id),
            "employee_name": emp["name"],
            "room_name": room["room_name"],
            "start": start,
            "end": end
        }
    except InvalidId:
        raise HTTPException(400, "Invalid ID")

@app.get("/assignments")
def get_assignments(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    result = paginate(assignments_col, page, limit)
    

    for item in result["data"]:
        emp = employees_col.find_one({"_id": ObjectId(item["employee_id"])})
        room = rooms_col.find_one({"_id": ObjectId(item["room_id"])})
        item["employee_name"] = emp["name"] if emp else "Unknown"
        item["room_name"] = room["room_name"] if room else "Unknown"
    
    return result

@app.delete("/assignments/{booking_id}")
def delete_assignment(booking_id: str):
    try:
        result = assignments_col.delete_one({"_id": ObjectId(booking_id)})
        if result.deleted_count == 0:
            raise HTTPException(404, "Booking not found")
        return {"message": "Deleted successfully"}
    except InvalidId:
        raise HTTPException(400, "Invalid ID")
