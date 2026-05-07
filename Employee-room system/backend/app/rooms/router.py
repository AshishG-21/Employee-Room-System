from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from bson.errors import InvalidId
from app.database import rooms_col, assignments_col, serialize, paginate
from app.rooms.schema import RoomUpdate

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post("")
def add_room(name: str, floor_no: int, occupancy: str):
    if not all([name, floor_no, occupancy]):
        raise HTTPException(400, "All fields required")
    
    if rooms_col.find_one({"room_name": name}):
        raise HTTPException(400, "Room already exists")
    
    result = rooms_col.insert_one({
        "room_name": name.strip(),
        "floor_no": floor_no,
        "occupancy": occupancy
    })
    
    return {"_id": str(result.inserted_id), "room_name": name, 
            "floor_no": floor_no, "occupancy": occupancy}

@router.get("")
def get_rooms(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    return paginate(rooms_col, page, limit)

@router.get("/all")
def get_all_rooms():
    return [serialize(r) for r in rooms_col.find()]

@router.put("/{room_id}")
def update_room(room_id: str, room: RoomUpdate):
    try:
        r_id = ObjectId(room_id)
        
        existing = rooms_col.find_one({"_id": r_id})
        if not existing:
            raise HTTPException(404, "Room not found")
    
        result = rooms_col.update_one(
            {"_id": r_id}, 
            {"$set": {
                "room_name": room.name.strip(),
                "floor_no": room.floor_no,
                "occupancy": room.occupancy
            }}
        )
        
        updated_room = rooms_col.find_one({"_id": r_id})
        
        return {
            "message": "Room updated successfully", 
            "success": True,
            "room": serialize(updated_room)
        }
    except InvalidId:
        raise HTTPException(400, "Invalid ID format")
    except Exception as e:
        raise HTTPException(500, str(e))

@router.delete("/{room_id}")
def delete_room(room_id: str):
    try:
        result = rooms_col.delete_one({"_id": ObjectId(room_id)})
        if result.deleted_count == 0:
            raise HTTPException(404, "Room not found")
        assignments_col.delete_many({"room_id": room_id})
        return {"message": "Deleted successfully"}
    except InvalidId:
        raise HTTPException(400, "Invalid ID")