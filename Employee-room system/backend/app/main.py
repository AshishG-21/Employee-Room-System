from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.employees.router import router as employees_router
from app.rooms.router import router as rooms_router
from app.bookings.router import router as bookings_router

app = FastAPI(title="Office Booking System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees_router)  
app.include_router(rooms_router)      
app.include_router(bookings_router) 

@app.get("/")
def root():
    return {"message": "Office Booking System API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
