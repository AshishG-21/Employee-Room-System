from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from bson.errors import InvalidId
from app.database import employees_col, assignments_col, serialize, paginate
from app.employees.schema import EmployeeUpdate, EmployeeResponse, EmployeeCreate
from pydantic import ValidationError

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("", response_model=EmployeeResponse) 
def add_employee(name: str, gender: str, address: str, email: str, contact: str):
    try:
        validated = EmployeeCreate(
            name=name,
            gender=gender,
            address=address,
            email=email,
            contact=contact
        )
    except ValidationError as e:
        raise HTTPException(400, str(e.errors()))
    
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
    
    return EmployeeResponse(
        _id=str(result.inserted_id),
        name=name,
        gender=gender,
        address=address,
        email=email,
        contact=contact
    )

@router.get("")
def get_employees(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    return paginate(employees_col, page, limit)

@router.get("/all")
def get_all_employees():
    employees = list(employees_col.find())
    result = []
    for emp in employees:
        result.append({
            "_id": str(emp["_id"]),  
            "name": emp.get("name", ""),
            "gender": emp.get("gender", ""),
            "address": emp.get("address", ""),
            "email": emp.get("email", ""),
            "contact": emp.get("contact", "")
        })
    return result

@router.put("/{employee_id}")
def update_employee(employee_id: str, employee: EmployeeUpdate):
    try:
        emp_id = ObjectId(employee_id)
        
        existing = employees_col.find_one({"_id": emp_id})
        if not existing:
            raise HTTPException(404, "Employee not found")
        
        employees_col.update_one(
            {"_id": emp_id}, 
            {"$set": {
                "name": employee.name.strip(),
                "gender": employee.gender.strip(),
                "address": employee.address.strip(),
                "email": employee.email.strip(),
                "contact": employee.contact.strip()
            }}
        )
        
        updated_employee = employees_col.find_one({"_id": emp_id})
        
        return EmployeeResponse(
            _id=str(updated_employee["_id"]),
            name=updated_employee.get("name", ""),
            gender=updated_employee.get("gender", ""),
            address=updated_employee.get("address", ""),
            email=updated_employee.get("email", ""),
            contact=updated_employee.get("contact", "")
        )
    except InvalidId:
        raise HTTPException(400, "Invalid ID format")
    except Exception as e:
        raise HTTPException(500, str(e))

@router.delete("/{employee_id}")
def delete_employee(employee_id: str):
    try:
        result = employees_col.delete_one({"_id": ObjectId(employee_id)})
        if result.deleted_count == 0:
            raise HTTPException(404, "Employee not found")
        assignments_col.delete_many({"employee_id": employee_id})
        return {"message": "Deleted successfully"}
    except InvalidId:
        raise HTTPException(400, "Invalid ID")
