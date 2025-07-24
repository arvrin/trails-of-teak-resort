# 🚀 Supabase Setup Guide

## Step 1: Create Supabase Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up/Login** with GitHub or email
3. **Create new project**:
   - Project name: `trails-of-teak`
   - Database password: (choose a strong password)
   - Region: Choose closest to your location
4. **Wait for project initialization** (2-3 minutes)

## Step 2: Get Project Credentials

1. **Go to Settings** → **API**
2. **Copy these values**:
   - Project URL: `https://your-project-id.supabase.co`
   - Project API Key (anon, public): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Create Environment File

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Database

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the entire content from `supabase/schema.sql`
3. **Click "Run"** to create all tables and policies
4. **Verify**: Go to Table Editor - you should see all tables

## Step 5: Test the Setup

```bash
npm run dev
```

Visit `http://localhost:3000` and:
1. **Register** a new account
2. **Book a room** - this will test the database connection
3. **Go to admin** (we'll make you admin in Supabase)

## Step 6: Create Admin User

1. **Register normally** on the website first
2. **Go to Supabase Dashboard** → **Authentication** → **Users**
3. **Find your user** and click on them
4. **Go to raw user metadata** and add:
   ```json
   {
     "role": "admin"
   }
   ```
5. **Save** - now you can access `/admin`

## Step 7: Verify Everything Works

✅ **Frontend**: http://localhost:3000  
✅ **Register/Login**: Should work without errors  
✅ **Room Booking**: Test the booking flow  
✅ **Admin Dashboard**: http://localhost:3000/admin (admin role required)  
✅ **Database**: Check Supabase dashboard for new records  

## 🎯 Advantages Over PocketBase

- ✅ **No local server setup**
- ✅ **Cloud-hosted and reliable**
- ✅ **Beautiful web dashboard**
- ✅ **Real-time subscriptions**
- ✅ **PostgreSQL (more powerful)**
- ✅ **Built-in authentication**
- ✅ **Free tier (no payment required)**

## 🔧 Troubleshooting

**Can't connect**: Check your `.env.local` file has correct URL and key  
**RLS errors**: Make sure Row Level Security policies are created  
**Admin access**: Verify user role is set to "admin" in Supabase  

---

**Much easier than PocketBase!** No localhost issues, no manual server management.