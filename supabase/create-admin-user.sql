-- Create admin user for testing
-- Run this in Supabase SQL Editor after creating a user through authentication

-- First, you need to manually sign up with your email through the website authentication
-- Then run this query to update the user role to admin

-- Method 1: Update by finding the user through auth.users email
UPDATE public.users 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'aaryavar@hotmail.com'
);

-- Method 2: If you know the user UUID, you can update by ID directly
-- UPDATE public.users SET role = 'admin' WHERE id = 'USER_UUID_HERE';

-- Check if the update worked by joining with auth.users to see email
SELECT 
  u.id, 
  au.email, 
  u.full_name, 
  u.role 
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.role = 'admin';

-- Alternative: View all users with their emails to find the right one
SELECT 
  u.id, 
  au.email, 
  u.full_name, 
  u.role,
  u.created_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;