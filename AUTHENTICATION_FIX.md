# 🔐 **URGENT: Authentication Fix Guide**

## 🚨 Current Issue: "Failed to Fetch" Login Error on Production

**Root Cause**: Missing or incorrect environment variables in Vercel deployment

## 🔧 **IMMEDIATE FIX STEPS (5 minutes)**

### **Step 1: Debug the Issue**
1. Visit: `https://your-app.vercel.app/auth-debug`
2. Check browser console for error messages
3. Look for red error indicators on the debug page

### **Step 2: Fix Vercel Environment Variables**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project → Settings → Environment Variables
3. **DELETE** any existing Supabase variables
4. **ADD** these exact variables for **Production**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ypalglrgqjkcufyqepjo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwYWxnbHJncWprY3VmeXFlcGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDc2MzIsImV4cCI6MjA2ODkyMzYzMn0.Iv1BAj7SKERYSHuptnW_WJspIFiZbi6XHVt8Fek8IGc
     ```

2. **Check Supabase Auth Settings**:
   - Go to Supabase Dashboard → Authentication → Settings
   - **Confirm Email**: Disable this for testing (can re-enable later)
   - **Site URL**: Add your Vercel deployment URL (e.g., `https://trails-of-teak-resort.vercel.app`)
   - **Redirect URLs**: Add your domain with `/auth/callback`

### **Step 3: Redeploy & Test**
1. After setting environment variables, **trigger a new deployment**:
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on the latest deployment
2. Wait for deployment to complete (2-3 minutes)
3. **Test login** with:
   ```
   Email: admin@trailsofteak.com
   Password: admin123
   ```

## ⚠️ **TROUBLESHOOTING**

### **If still getting "Failed to Fetch":**
1. **Check browser console** for exact error message
2. **Verify environment variables** are set correctly (check /auth-debug page)
3. **Check Supabase project status** - ensure it's not paused
4. **Verify CORS settings** in Supabase

### **Common Error Messages:**
- **"Failed to fetch"** = Environment variables missing
- **"Invalid API key"** = Wrong Supabase anon key
- **"User not found"** = Need to create admin user in database

## 🔧 **CREATE ADMIN USER (if needed)**
Run this SQL in Supabase SQL Editor:
```sql
-- First create the auth user
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'admin@trailsofteak.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"role":"admin","full_name":"Admin User"}',
  NOW(),
  NOW()
);

-- Then create the profile
INSERT INTO public.users (
  id, email, full_name, phone_number, role, created_at, updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@trailsofteak.com'),
  'admin@trailsofteak.com',
  'Admin User',
  '+91 98765 43210',
  'admin',
  NOW(),
  NOW()
);
```

## ✅ **SUCCESS INDICATORS**
- ✅ `/auth-debug` page shows all green checkmarks
- ✅ Console shows "Supabase Environment Check" with correct values
- ✅ Login works without "Failed to fetch" error
- ✅ Admin dashboard loads with user name displayed

---

**🚀 After following these steps, authentication should work perfectly!**

### Immediate Fixes Needed:

#### 1. Update Supabase Auth Settings
```sql
-- In Supabase SQL Editor, run:
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-admin-email@example.com';
```

#### 2. Add Production URL to Supabase
- Authentication → Settings → Site URL: `https://your-vercel-app.vercel.app`
- Authentication → Settings → Redirect URLs: `https://your-vercel-app.vercel.app/**`

#### 3. Create Test Admin User (if needed)
```sql
-- Create a test admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',  
  'authenticated',
  'admin@trailsofteak.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","full_name":"Admin User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

### Test Login Credentials:
- **Email**: `admin@trailsofteak.com`
- **Password**: `admin123`

### Debug Steps:
1. Open browser dev tools → Network tab
2. Try logging in
3. Check for CORS errors or 400/500 responses
4. Verify Supabase client connection in console

---

**Quick Fix Priority**: Update Supabase auth settings first, then test with provided credentials.