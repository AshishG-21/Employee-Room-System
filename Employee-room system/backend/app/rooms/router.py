from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from bson.errors import InvalidId
from app.database import rooms_col, assignments_col, serialize, paginate
from app.rooms.schema import RoomUpdate, RoomResponse

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post("", response_model=RoomResponse)
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
    
    return RoomResponse(
        id=str(result.inserted_id),
        room_name=name,
        floor_no=floor_no,
        occupancy=occupancy
    )

@router.get("")
def get_rooms(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    return paginate(rooms_col, page, limit)

@router.get("/all")
def get_all_rooms():
    rooms = list(rooms_col.find())
    result = []
    for room in rooms:
        result.append({
            "_id": str(room["_id"]),  
            "room_name": room.get("room_name", ""),
            "floor_no": room.get("floor_no", 0),
            "occupancy": room.get("occupancy", "")
        })
    return result

@router.put("/{room_id}", response_model=RoomResponse)
def update_room(room_id: str, room: RoomUpdate):
    try:
        r_id = ObjectId(room_id)
        
        existing = rooms_col.find_one({"_id": r_id})
        if not existing:
            raise HTTPException(404, "Room not found")
    
        rooms_col.update_one(
            {"_id": r_id}, 
            {"$set": {
                "room_name": room.name.strip(),
                "floor_no": room.floor_no,
                "occupancy": room.occupancy
            }}
        )
        
        updated_room = rooms_col.find_one({"_id": r_id})
        
        return RoomResponse(
            id=str(updated_room["_id"]),
            room_name=updated_room.get("room_name", ""),
            floor_no=updated_room.get("floor_no", 0),
            occupancy=updated_room.get("occupancy", "")
        )
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
