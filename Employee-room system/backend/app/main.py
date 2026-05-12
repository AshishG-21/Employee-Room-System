from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.employees import router as employees_router
from app.rooms import router as rooms_router
from app.bookings import router as bookings_router

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees_router)
app.include_router(rooms_router)
app.include_router(bookings_router)

@app.get("/")
def root():
    return {
        "message": f"{settings.API_TITLE} API",
        "version": settings.API_VERSION,
        "debug": settings.DEBUG
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
