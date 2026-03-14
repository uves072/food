# Food Ordering System

A complete mobile food ordering system similar to KFC or McDonald's, built with React Native (Expo) and FastAPI.

## Features

### Customer App (No Login Required)
- 📱 **QR Code Access**: Customers scan QR code to access menu directly
- 🍔 **Browse Menu**: View all food items organized by categories
- 🛒 **Shopping Cart**: Add items, adjust quantities, and manage cart
- 💳 **Easy Checkout**: Place orders with table number and special instructions
- 📊 **Real-time Order Tracking**: Monitor order status (Pending → Preparing → Ready → Completed)
- 📜 **Order History**: View past orders

### Admin Dashboard (Login Required)
- 🔐 **Secure Login**: Admin authentication system
- 📝 **Menu Management**: Add, edit, delete menu items with images
- 📸 **Image Upload**: Upload food images from camera or gallery
- 🔔 **Real-time Notifications**: Instant alerts when new orders arrive
- 📦 **Order Management**: View all orders and update their status
- 🎛️ **Availability Toggle**: Mark items as available/unavailable
- 📊 **Order Dashboard**: View daily orders and manage kitchen workflow

## Tech Stack

### Frontend
- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Real-time**: Socket.IO Client
- **UI Components**: React Native core components + Expo Vector Icons
- **Image Handling**: Expo Image Picker with base64 encoding
- **Storage**: AsyncStorage for offline data

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Real-time**: Socket.IO for live order updates
- **Authentication**: bcrypt for password hashing
- **API Architecture**: RESTful API with Socket.IO events

## Project Structure

```
/app
├── backend/
│   ├── server.py           # FastAPI application with all endpoints
│   ├── .env                # Environment variables (MongoDB config)
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── app/
│   │   ├── _layout.tsx             # Root layout with providers
│   │   ├── index.tsx               # Home screen
│   │   ├── customer/
│   │   │   ├── menu.tsx            # Customer menu screen
│   │   │   ├── cart.tsx            # Shopping cart
│   │   │   ├── checkout.tsx        # Order placement
│   │   │   └── order-status.tsx    # Real-time order tracking
│   │   └── admin/
│   │       ├── login.tsx           # Admin login/register
│   │       ├── dashboard.tsx       # Orders & menu management
│   │       ├── add-item.tsx        # Add new menu item
│   │       └── edit-item.tsx       # Edit menu item
│   │
│   ├── contexts/
│   │   ├── CartContext.tsx         # Shopping cart state
│   │   └── AuthContext.tsx         # Admin authentication state
│   │
│   ├── utils/
│   │   ├── api.ts                  # API service functions
│   │   └── socket.ts               # Socket.IO client setup
│   │
│   ├── app.json                    # Expo configuration
│   └── package.json                # Dependencies
│
└── README.md
```

## API Endpoints

### Menu Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/menu/categories` - Get all categories
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Admin Endpoints
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Admin login

### Socket.IO Events
- `join_admin` - Admin joins notification room
- `new_order` - Emitted when customer places order
- `order_status_updated` - Emitted when order status changes

## Database Schema

### Menu Items Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String (base64),
  available: Boolean,
  created_at: DateTime
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  items: [
    {
      menu_item_id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String (base64)
    }
  ],
  total: Number,
  status: String (pending/preparing/ready/completed),
  table_number: String,
  notes: String,
  created_at: DateTime
}
```

### Admins Collection
```javascript
{
  _id: ObjectId,
  username: String,
  password: String (hashed with bcrypt),
  created_at: DateTime
}
```

## Setup & Installation

### Prerequisites
- Node.js and Yarn
- Python 3.11+
- MongoDB

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python server.py
```

### Frontend Setup
```bash
cd frontend
yarn install
yarn start
```

## User Flow

### Customer Journey
1. Customer scans QR code or opens app
2. Browses menu by categories
3. Adds items to cart with desired quantities
4. Proceeds to checkout
5. Enters table number and optional notes
6. Places order
7. Receives order confirmation
8. Tracks order status in real-time
9. Gets notified when order is ready

### Admin Journey
1. Admin logs in with credentials
2. Views dashboard with two tabs: Orders & Menu
3. **Orders Tab**:
   - Sees all orders in real-time
   - Receives instant notifications for new orders
   - Updates order status with one tap
   - Views order details including table number and notes
4. **Menu Tab**:
   - Views all menu items
   - Adds new items with image upload
   - Edits existing items (name, price, image, availability)
   - Deletes items
   - Toggles item availability

## Real-time Features

### Order Notifications
- Socket.IO connection established on admin login
- Admin joins 'admin_room' to receive notifications
- New orders trigger instant push notifications
- Order status updates sync across all connected clients

### Live Order Tracking
- Customers see real-time status updates
- Status progression: Pending → Preparing → Ready → Completed
- Visual progress indicators
- Automatic UI updates via Socket.IO

## Mobile-First Design

- Touch-friendly UI with 44px+ touch targets
- Native components for better performance
- Platform-specific behaviors (iOS/Android)
- Keyboard-aware input handling
- Safe area support for notched devices
- Pull-to-refresh on lists
- Optimized images with base64 encoding

## Key Features Implementation

### Image Handling
- All images stored as base64 strings
- Camera and gallery access with permissions
- Image compression to reduce size
- Optimized for mobile performance

### Cart Management
- Add/remove items dynamically
- Update quantities with +/- buttons
- Real-time total calculation
- Persistent cart state with Context API

### Order Status Flow
```
Pending (Yellow) → Preparing (Orange) → Ready (Green) → Completed (Gray)
```

Each status change is:
- Saved to database
- Broadcast via Socket.IO
- Reflected in customer's order tracking screen

## Testing

### Default Admin Credentials
- Username: `admin`
- Password: `admin123`

### Test the System
1. **Customer Flow**:
   - Open app → "Browse Menu"
   - Add items to cart
   - Go to cart
   - Checkout with table number
   - Track order status

2. **Admin Flow**:
   - Open app → "Admin Panel"
   - Login with credentials
   - View incoming orders
   - Update order status
   - Add new menu items
   - Edit/delete items

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
```

### Frontend (.env)
```
EXPO_PUBLIC_BACKEND_URL=https://your-app.preview.emergentagent.com
```

## Production Considerations

1. **Security**:
   - Implement JWT tokens for admin authentication
   - Add rate limiting for API endpoints
   - Validate all user inputs
   - Use HTTPS in production

2. **Performance**:
   - Implement image CDN for menu images
   - Add database indexing
   - Enable API response caching
   - Optimize Socket.IO connections

3. **Features to Add**:
   - Payment integration (Stripe, PayPal)
   - Email/SMS notifications
   - Order history for customers
   - Analytics dashboard for admin
   - Multi-restaurant support
   - Delivery tracking

## Support

For issues or questions, please check the logs:
- Backend logs: `/var/log/supervisor/backend.err.log`
- Frontend logs: `/var/log/supervisor/expo.out.log`

## License

MIT License - Feel free to use this for your restaurant!
