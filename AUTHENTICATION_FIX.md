# 🔐 Authentication Fix Guide

## Current Issue: Unable to Login on Production

### Quick Diagnosis Steps:

1. **Check Vercel Environment Variables**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Ensure these are set correctly:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://ypalglrgqjkcufyqepjo.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

2. **Check Supabase Auth Settings**:
   - Go to Supabase Dashboard → Authentication → Settings
   - **Confirm Email**: Disable this for testing (can re-enable later)
   - **Site URL**: Add your Vercel deployment URL (e.g., `https://trails-of-teak-resort.vercel.app`)
   - **Redirect URLs**: Add your domain with `/auth/callback`

3. **Test Admin Login**:
   - Email: Use the admin email you created in Supabase
   - Password: Use the admin password you set

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