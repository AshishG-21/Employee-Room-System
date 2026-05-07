from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from bson.errors import InvalidId
from app.database import employees_col, rooms_col, assignments_col, serialize, paginate
from app.bookings.schema import BookingUpdate

router = APIRouter(prefix="/assignments", tags=["Bookings"])

@router.post("/assign")
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

@router.get("")
def get_assignments(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    result = paginate(assignments_col, page, limit)
    
    for item in result["data"]:
        emp = employees_col.find_one({"_id": ObjectId(item["employee_id"])})
        room = rooms_col.find_one({"_id": ObjectId(item["room_id"])})
        item["employee_name"] = emp["name"] if emp else "Unknown"
        item["room_name"] = room["room_name"] if room else "Unknown"
    
    return result

@router.get("/all")
def get_all_assignments():
    result = [serialize(a) for a in assignments_col.find()]
    
    for item in result:
        emp = employees_col.find_one({"_id": ObjectId(item["employee_id"])})
        room = rooms_col.find_one({"_id": ObjectId(item["room_id"])})
        item["employee_name"] = emp["name"] if emp else "Unknown"
        item["room_name"] = room["room_name"] if room else "Unknown"
    
    return result

@router.put("/{booking_id}")
def update_assignment(booking_id: str, assignment: BookingUpdate):
    try:
        b_id = ObjectId(booking_id)
        
        existing = assignments_col.find_one({"_id": b_id})
        if not existing:
            raise HTTPException(404, "Booking not found")
        
        emp = employees_col.find_one({"_id": ObjectId(assignment.employee_id)})
        room = rooms_col.find_one({"_id": ObjectId(assignment.room_id)})
        
        if not emp or not room:
            raise HTTPException(404, "Employee or Room not found")
        
        if assignment.start >= assignment.end:
            raise HTTPException(400, "Invalid time range")
        
        for b in assignments_col.find({"room_id": assignment.room_id, "_id": {"$ne": b_id}}):
            if not (assignment.end <= b["start"] or assignment.start >= b["end"]):
                raise HTTPException(400, "Room already booked")
        
        for b in assignments_col.find({"employee_id": assignment.employee_id, "_id": {"$ne": b_id}}):
            if not (assignment.end <= b["start"] or assignment.start >= b["end"]):
                raise HTTPException(400, "Employee already booked")
        
        result = assignments_col.update_one(
            {"_id": b_id}, 
            {"$set": {
                "employee_id": assignment.employee_id,
                "room_id": assignment.room_id,
                "start": assignment.start,
                "end": assignment.end
            }}
        )
        
        return {
            "message": "Booking updated successfully", 
            "success": True
        }
    except InvalidId:
        raise HTTPException(400, "Invalid ID format")
    except Exception as e:
        raise HTTPException(500, str(e))

@router.delete("/{booking_id}")
def delete_assignment(booking_id: str):
    try:
        result = assignments_col.delete_one({"_id": ObjectId(booking_id)})
        if result.deleted_count == 0:
            raise HTTPException(404, "Booking not found")
        return {"message": "Deleted successfully"}
    except InvalidId:
        raise HTTPException(400, "Invalid ID")