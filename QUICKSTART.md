# 🚀 Quick Start Guide

## Step 1: Start Backend
```bash
./scripts/start-backend.sh
```
- This starts PocketBase at http://127.0.0.1:8090
- Keep this terminal open

## Step 2: Setup Database (First Time)
1. Open http://127.0.0.1:8090/_/ 
2. Create PocketBase admin account
3. Import collections from the admin panel (based on scripts/init-db.js)

## Step 3: Start Frontend
```bash
# In a new terminal
npm run dev
```
- Frontend available at http://localhost:3000

## Step 4: Create Admin User
1. Go to http://localhost:3000
2. Click "Login" → "Sign up" 
3. Register with your details
4. In PocketBase admin (http://127.0.0.1:8090/_/):
   - Users collection → Find your user → Change role to "admin"
5. Refresh frontend → "Admin" link appears

## Step 5: Access Admin Dashboard
- URL: **http://localhost:3000/admin**
- Only visible to users with admin role
- Manage bookings, view analytics, update statuses

## 🎯 Test the Full System
1. **Guest Flow**: Register → Browse Rooms → Book Room
2. **Admin Flow**: Login as admin → Go to /admin → Manage bookings
3. **Update Status**: Change booking from "pending" to "confirmed"

## 🔧 Troubleshooting
- **Can't access admin**: Check user role in PocketBase admin panel
- **Backend not starting**: Make sure port 8090 is free
- **Database errors**: Recreate collections in PocketBase admin

---
**Admin Dashboard**: http://localhost:3000/admin (admin role required)