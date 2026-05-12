from pymongo import MongoClient
from app.config import settings

MONGODB_URL = settings.MONGODB_URL
MONGODB_DATABASE = settings.MONGODB_DATABASE

try:
    client = MongoClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DATABASE]
    
    client.admin.command('ping')
    print(f"✅ MongoDB connected to {MONGODB_URL}")
    print(f"✅ Using database: {MONGODB_DATABASE}")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")

employees_col = db["employees"]
rooms_col = db["rooms"]
assignments_col = db["assignments"]

def serialize(data):
    if data:
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
