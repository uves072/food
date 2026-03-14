# Food Ordering System - Complete Code Documentation

## Project Structure

```
/app
├── backend/
│   ├── server.py              # Main FastAPI server with all APIs
│   ├── .env                   # Environment variables
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── app/
│   │   ├── _layout.tsx        # Root layout
│   │   ├── index.tsx          # Home screen
│   │   ├── customer/
│   │   │   ├── menu.tsx       # Menu screen
│   │   │   ├── cart.tsx       # Shopping cart
│   │   │   ├── checkout.tsx   # Checkout screen
│   │   │   └── order-status.tsx # Order tracking
│   │   └── admin/
│   │       ├── login.tsx      # Admin login
│   │       ├── dashboard.tsx  # Admin dashboard
│   │       ├── add-item.tsx   # Add menu item
│   │       └── edit-item.tsx  # Edit menu item
│   │
│   ├── contexts/
│   │   ├── CartContext.tsx    # Shopping cart state
│   │   └── AuthContext.tsx    # Admin auth state
│   │
│   ├── utils/
│   │   ├── api.ts             # API functions
│   │   └── socket.ts          # Socket.IO client
│   │
│   ├── app.json               # Expo config
│   ├── package.json           # Dependencies
│   └── .env                   # Frontend environment variables
│
└── README.md
```

## All File Locations

### Backend Files:
- `/app/backend/server.py` - Main server (460+ lines)
- `/app/backend/.env` - MongoDB config
- `/app/backend/requirements.txt` - Python packages

### Frontend Files:
- `/app/frontend/app/_layout.tsx` - Root layout with providers
- `/app/frontend/app/index.tsx` - Home screen
- `/app/frontend/app/customer/menu.tsx` - Customer menu (250+ lines)
- `/app/frontend/app/customer/cart.tsx` - Shopping cart (220+ lines)
- `/app/frontend/app/customer/checkout.tsx` - Checkout (230+ lines)
- `/app/frontend/app/customer/order-status.tsx` - Order tracking (260+ lines)
- `/app/frontend/app/admin/login.tsx` - Admin login (180+ lines)
- `/app/frontend/app/admin/dashboard.tsx` - Admin dashboard (530+ lines)
- `/app/frontend/app/admin/add-item.tsx` - Add menu item (220+ lines)
- `/app/frontend/app/admin/edit-item.tsx` - Edit menu item (280+ lines)
- `/app/frontend/contexts/CartContext.tsx` - Cart state management (80+ lines)
- `/app/frontend/contexts/AuthContext.tsx` - Auth state management (80+ lines)
- `/app/frontend/utils/api.ts` - API service (100+ lines)
- `/app/frontend/utils/socket.ts` - Socket.IO setup (40+ lines)
- `/app/frontend/app.json` - Expo configuration
- `/app/frontend/package.json` - Dependencies
- `/app/frontend/.env` - Frontend config

### Documentation:
- `/app/README.md` - Complete documentation
- `/app/BUILD_INSTRUCTIONS.md` - Build & install guide
- `/app/frontend/public/qr.html` - QR code page

## How to View/Download Code

### Option 1: View Individual Files
You can view any file using these commands:
```bash
# Backend
cat /app/backend/server.py
cat /app/backend/requirements.txt

# Frontend
cat /app/frontend/app/index.tsx
cat /app/frontend/app/customer/menu.tsx
# ... etc
```

### Option 2: Create ZIP of Entire Project
Run this command to create a ZIP file:
```bash
cd /app
zip -r food-ordering-system.zip . -x "*/node_modules/*" "*/.git/*" "*/.metro-cache/*" "*/build/*"
```

### Option 3: Copy Entire Project
The entire project is in `/app` directory.

## Tech Stack Summary

**Backend:**
- FastAPI (Python web framework)
- MongoDB (Database)
- Socket.IO (Real-time communication)
- Motor (Async MongoDB driver)
- bcrypt (Password hashing)

**Frontend:**
- React Native (Expo)
- Expo Router (Navigation)
- TypeScript
- Socket.IO Client
- AsyncStorage
- Expo Image Picker

## Total Lines of Code
- Backend: ~500 lines
- Frontend: ~3000+ lines
- Total: ~3500+ lines of code

## Key Features Implemented
✅ Customer menu browsing
✅ Shopping cart
✅ Order placement
✅ Real-time order tracking
✅ Admin authentication
✅ Menu management (CRUD)
✅ Order management
✅ Real-time notifications
✅ Image upload (base64)
✅ Socket.IO integration
