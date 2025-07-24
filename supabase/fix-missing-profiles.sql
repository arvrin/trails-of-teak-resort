-- Fix missing user profiles manually
-- Run this if the trigger didn't create profiles for existing auth users

-- 1. Create missing profiles for users who signed up but don't have profiles
INSERT INTO public.users (id, full_name, phone_number, role)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(au.raw_user_meta_data->>'phone_number', ''),
    'guest'
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 2. Check the results
SELECT 
    u.id, 
    au.email, 
    u.full_name, 
    u.role,
    u.created_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;

-- 3. Set specific user as admin (replace email with your actual email)
UPDATE public.users 
SET role = 'admin' 
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'aaryavar@hotmail.com'
);