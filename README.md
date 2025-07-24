# Trails of Teak Resort Platform

A luxury eco-resort management platform built with Next.js 14, TypeScript, Tailwind CSS, and PocketBase.

![Trails of Teak Resort](./public/images/logo.png)

## 🌟 Features

### Frontend (Completed)
- ✅ **Luxury Homepage** with cinematic hero section and animations
- ✅ **Room Listings** with detailed amenities and pricing
- ✅ **Image Gallery** with hover effects and categorization
- ✅ **Contact Forms** with validation and submission
- ✅ **User Authentication** (login/register modals)
- ✅ **Booking System** with date selection and pricing calculation
- ✅ **Admin Dashboard** for managing bookings and operations
- ✅ **Responsive Design** across all device sizes

### Backend (Completed)
- ✅ **PocketBase Integration** for database and authentication
- ✅ **User Management** with role-based access (guest, admin, staff, housekeeping, POS)
- ✅ **Booking Management** with status tracking
- ✅ **Database Schema** based on ER diagram (users, rooms, bookings, invoices, etc.)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and Setup**
   ```bash
   cd trails-of-teak
   npm install
   ```

2. **Start PocketBase Backend**
   ```bash
   # In one terminal
   ./scripts/start-backend.sh
   ```
   This will start PocketBase at `http://127.0.0.1:8090`

3. **Setup Database (First Time)**
   - Open `http://127.0.0.1:8090/_/` in your browser
   - Create admin account
   - Import collections from `scripts/init-db.js`
   - Add sample room data

4. **Start Frontend**
   ```bash
   # In another terminal
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── contact/            # Contact page with forms
│   ├── gallery/            # Image gallery
│   ├── rooms/              # Room listings and booking
│   ├── globals.css         # Brand colors and luxury styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── AuthModal.tsx       # Login/register modal
│   ├── BookingModal.tsx    # Room booking interface
│   ├── Header.tsx          # Navigation with auth
│   └── Footer.tsx          # Site footer
├── lib/
│   └── pocketbase.ts       # Database client and types
└── types/                  # TypeScript interfaces

backend/
├── pocketbase              # PocketBase executable
└── pb_data/                # Database files (created on first run)

public/images/              # Resort photos and logo
scripts/                    # Database initialization
```

## 🎨 Brand System

### Colors
- **Primary**: `#1E3D34` (Forest Green)
- **Accent**: `#D3A24F` (Gold)
- **Background**: `#F3EFE7` (Cream)
- **Text**: `#5A4B3B` (Brown)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 📊 Database Schema

Based on the ER diagram, the database includes:

- **users** - Guest and staff authentication
- **rooms** - Room details, pricing, amenities
- **bookings** - Reservation management
- **invoices** - Payment tracking
- **housekeeping_tasks** - Maintenance workflows
- **reviews** - Guest feedback
- **pos_orders** - Restaurant/service orders
- **gallery_media** - Image management
- **settings** - Resort configuration

## 🔐 User Roles

- **Guest**: Book rooms, submit reviews
- **Admin**: Full system access, manage bookings
- **Staff**: Booking management, guest services
- **Housekeeping**: Task management, room status
- **POS**: Order management, restaurant services

## 🛠️ Key Features

### Booking System
- Interactive date selection
- Real-time availability checking
- Automatic pricing calculation with 18% tax
- Guest count management
- Special requests handling

### Admin Dashboard
- Booking status management (pending → confirmed → completed)
- Revenue tracking and analytics
- Guest information management
- Real-time booking updates

### Authentication
- Secure user registration and login
- Role-based access control
- Session management with PocketBase

## 🎯 Next Steps (Phase 3)

1. **Payment Integration**
   - Razorpay integration for secure payments
   - Invoice generation and PDF export

2. **Communication Features**
   - WhatsApp integration for booking confirmations
   - Email notifications using Resend

3. **Advanced Features**
   - Real-time availability calendar
   - Advanced analytics and reporting
   - Housekeeping management system
   - POS integration for on-site services

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (VPS)
```bash
# Copy PocketBase binary and pb_data to server
./pocketbase serve --http="0.0.0.0:8090"
```

## 📝 Environment Variables

```env
# PocketBase URL (for production)
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-url.com

# Future integrations
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RESEND_API_KEY=your_resend_key
WHATSAPP_TOKEN=your_whatsapp_token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## 📄 License

This project is proprietary to Trails of Teak Resort.

---

**Built with ❤️ for luxury hospitality**
