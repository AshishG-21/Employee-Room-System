from pymongo import MongoClient

try:
    client = MongoClient("mongodb://localhost:27017")
    db = client["office_booking"]
    client.admin.command('ping')
    print("MongoDB connected successfully!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")

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