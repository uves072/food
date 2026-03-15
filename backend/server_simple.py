from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (temporary - data will reset on restart)
menu_items_db = []
orders_db = []
admins_db = [{"username": "admin", "password": "admin123"}]

# Models
class MenuItem(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    price: float
    category: str
    image: str
    available: bool = True

class OrderItem(BaseModel):
    menu_item_id: str
    name: str
    price: float
    quantity: int
    image: str

class Order(BaseModel):
    id: Optional[str] = None
    items: List[OrderItem]
    total: float
    status: str = "pending"
    table_number: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

# Add some sample menu items on startup
@app.on_event("startup")
async def startup():
    global menu_items_db
    menu_items_db = [
        {
            "id": str(uuid.uuid4()),
            "name": "Classic Burger",
            "description": "Juicy beef patty with cheese",
            "price": 150.0,
            "category": "Burgers",
            "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "available": True
        },
        {
            "id": str(uuid.uuid4()),
            "name": "French Fries",
            "description": "Crispy golden fries",
            "price": 80.0,
            "category": "Sides",
            "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "available": True
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Coca Cola",
            "description": "Ice cold drink",
            "price": 50.0,
            "category": "Drinks",
            "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "available": True
        }
    ]

# Routes
@app.get("/")
def root():
    return {"message": "Food Ordering API - Simple Version", "status": "running"}

@app.get("/api/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/menu")
def get_menu():
    return menu_items_db

@app.post("/api/menu")
def create_menu_item(item: MenuItem):
    item_dict = item.dict()
    item_dict["id"] = str(uuid.uuid4())
    menu_items_db.append(item_dict)
    return item_dict

@app.put("/api/menu/{item_id}")
def update_menu_item(item_id: str, item: MenuItem):
    for i, menu_item in enumerate(menu_items_db):
        if menu_item["id"] == item_id:
            item_dict = item.dict()
            item_dict["id"] = item_id
            menu_items_db[i] = item_dict
            return item_dict
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/api/menu/{item_id}")
def delete_menu_item(item_id: str):
    global menu_items_db
    menu_items_db = [item for item in menu_items_db if item["id"] != item_id]
    return {"message": "Item deleted"}

@app.post("/api/orders")
def create_order(order: Order):
    order_dict = order.dict()
    order_dict["id"] = str(uuid.uuid4())
    order_dict["created_at"] = datetime.utcnow().isoformat()
    order_dict["status"] = "pending"
    orders_db.append(order_dict)
    return order_dict

@app.get("/api/orders")
def get_orders():
    return orders_db

@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    for order in orders_db:
        if order["id"] == order_id:
            return order
    raise HTTPException(status_code=404, detail="Order not found")

@app.put("/api/orders/{order_id}/status")
def update_order_status(order_id: str, status_update: dict):
    for order in orders_db:
        if order["id"] == order_id:
            order["status"] = status_update["status"]
            return order
    raise HTTPException(status_code=404, detail="Order not found")

@app.post("/api/admin/login")
def admin_login(admin: AdminLogin):
    for admin_user in admins_db:
        if admin_user["username"] == admin.username and admin_user["password"] == admin.password:
            return {"username": admin.username, "token": str(uuid.uuid4())}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/admin/register")
def admin_register(admin: AdminLogin):
    # Maximum 3 admins allowed
    if len(admins_db) >= 3:
        raise HTTPException(status_code=400, detail="Maximum 3 admins allowed. Registration limit reached.")
    
    for admin_user in admins_db:
        if admin_user["username"] == admin.username:
            raise HTTPException(status_code=400, detail="Username exists")
    admins_db.append({"username": admin.username, "password": admin.password})
    return {"username": admin.username, "token": str(uuid.uuid4())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
