-- Check if the trigger exists and is working
-- Run these queries in Supabase SQL Editor

-- 1. Check if the trigger function exists
SELECT 
    p.proname as function_name,
    p.prosrc as function_body
FROM pg_proc p
WHERE p.proname = 'handle_new_user';

-- 2. Check if the trigger exists
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.event_object_table,
    t.action_statement,
    t.action_timing
FROM information_schema.triggers t
WHERE t.trigger_name = 'on_auth_user_created';

-- 3. Check all users in auth.users (to see if anyone signed up)
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- 4. Check all users in public.users (to see if trigger created profiles)
SELECT 
    id,
    full_name,
    phone_number,
    role,
    created_at
FROM public.users
ORDER BY created_at DESC;

-- 5. Check for any users who are in auth.users but NOT in public.users (trigger failed)
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created,
    pu.id as profile_exists
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- 6. View raw_user_meta_data to see what data is being passed during signup
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;