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
assignments=[]


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
    room={"id":len(rooms)+1, "room_name":name}
    rooms.append(room)
    return room

@app.get("/get_rooms")
def get_rooms():
    return rooms

@app.post("/assign")
def assign(employee_id:int,room_id:int):
    emp=next((e for e in employees if e["id"]==employee_id),None)
    if not emp:
        raise HTTPException (status_code=404,detail="Employee not found")

    room=next((r for r in rooms if r["id"]==room_id),None)
    if not room:
        raise HTTPException(status_code=404,detail="Room not found")
    
    for a in assignments:
        if a["room_id"]==room_id:
            raise HTTPException(status_code=404,detail="Already assigned")
    
    assignment={"employee_id":employee_id, "room_id":room_id}
    assignments.append(assignment)
    
    return assignment

@app.get("/assignments")
def get_assignments():
    return assignments
    





