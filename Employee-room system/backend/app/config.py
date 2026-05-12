import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # Server Settings
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # MongoDB Settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE", "office_booking")
    
    # API Settings
    API_VERSION: str = os.getenv("API_VERSION", "v1")
    API_TITLE: str = os.getenv("API_TITLE", "Office Booking System")
    API_DESCRIPTION: str = os.getenv("API_DESCRIPTION", "Employee Room Booking System API")
    
    # CORS Settings - parse JSON string to list
    import json
    CORS_ORIGINS: list = json.loads(os.getenv("CORS_ORIGINS", '["http://localhost:5173"]'))
    
    # Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

settings = Settings()