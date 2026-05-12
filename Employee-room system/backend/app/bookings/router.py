from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from bson.errors import InvalidId
from app.database import employees_col, rooms_col, assignments_col, serialize, paginate
from app.bookings.schema import BookingUpdate, BookingResponse

router = APIRouter(prefix="/assignments", tags=["Bookings"])

@router.post("/assign", response_model=BookingResponse)
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
        
        return BookingResponse(
            _id=str(result.inserted_id),
            employee_id=employee_id,
            room_id=room_id,
            employee_name=emp["name"],
            room_name=room["room_name"],
            start=start,
            end=end
        )
    except InvalidId:
        raise HTTPException(400, "Invalid ID format")
    except Exception as e:
        raise HTTPException(500, str(e))

@router.get("")
def get_assignments(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    result = paginate(assignments_col, page, limit)
    
    enriched_data = []
    for item in result["data"]:
        try:
            emp = employees_col.find_one({"_id": ObjectId(item["employee_id"])})
            room = rooms_col.find_one({"_id": ObjectId(item["room_id"])})
            item["employee_name"] = emp["name"] if emp else "Unknown"
            item["room_name"] = room["room_name"] if room else "Unknown"
            enriched_data.append(item)
        except:
            item["employee_name"] = "Unknown"
            item["room_name"] = "Unknown"
            enriched_data.append(item)
    
    result["data"] = enriched_data
    return result

@router.get("/all", response_model=list[BookingResponse])
def get_all_assignments():
    assignments = list(assignments_col.find())
    result = []
    
    for assignment in assignments:
        try:
            emp = employees_col.find_one({"_id": ObjectId(assignment["employee_id"])})
            room = rooms_col.find_one({"_id": ObjectId(assignment["room_id"])})
            
            result.append(BookingResponse(
                _id=str(assignment["_id"]),
                employee_id=assignment["employee_id"],
                room_id=assignment["room_id"],
                employee_name=emp["name"] if emp else "Unknown",
                room_name=room["room_name"] if room else "Unknown",
                start=assignment["start"],
                end=assignment["end"]
            ))
        except Exception as e:
            print(f"Error processing assignment: {e}")
            continue
    
    return result

@router.put("/{booking_id}", response_model=BookingResponse)
def update_assignment(booking_id: str, booking: BookingUpdate):
    try:
        
        
        b_id = ObjectId(booking_id)
        
        existing = assignments_col.find_one({"_id": b_id})
        if not existing:
            raise HTTPException(404, "Booking not found")
        
        # Validate employee_id and room_id
        if not ObjectId.is_valid(booking.employee_id):
            raise HTTPException(400, f"Invalid Employee ID format: {booking.employee_id}")
        if not ObjectId.is_valid(booking.room_id):
            raise HTTPException(400, f"Invalid Room ID format: {booking.room_id}")
        
        emp = employees_col.find_one({"_id": ObjectId(booking.employee_id)})
        room = rooms_col.find_one({"_id": ObjectId(booking.room_id)})
        
        if not emp or not room:
            raise HTTPException(404, "Employee or Room not found")
        
        if booking.start >= booking.end:
            raise HTTPException(400, "Invalid time range")
        
        # Check for conflicts excluding current booking
        for b in assignments_col.find({"room_id": booking.room_id, "_id": {"$ne": b_id}}):
            if not (booking.end <= b["start"] or booking.start >= b["end"]):
                raise HTTPException(400, "Room already booked")
        
        for b in assignments_col.find({"employee_id": booking.employee_id, "_id": {"$ne": b_id}}):
            if not (booking.end <= b["start"] or booking.start >= b["end"]):
                raise HTTPException(400, "Employee already booked")
        
        assignments_col.update_one(
            {"_id": b_id}, 
            {"$set": {
                "employee_id": booking.employee_id,
                "room_id": booking.room_id,
                "start": booking.start,
                "end": booking.end
            }}
        )
        
        updated_booking = assignments_col.find_one({"_id": b_id})
        
        return BookingResponse(
            _id=str(updated_booking["_id"]),
            employee_id=updated_booking["employee_id"],
            room_id=updated_booking["room_id"],
            employee_name=emp["name"],
            room_name=room["room_name"],
            start=updated_booking["start"],
            end=updated_booking["end"]
        )
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
