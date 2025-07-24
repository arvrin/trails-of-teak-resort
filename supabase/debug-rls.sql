-- Debug RLS (Row Level Security) issues
-- Run these in Supabase SQL Editor

-- 1. Check if RLS is enabled on users table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- 2. List all RLS policies on users table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 3. Test direct access to users table (should work from SQL editor)
SELECT id, full_name, role 
FROM public.users 
WHERE id = '6bf7fc20-6aee-4e15-b04b-344d6f01873e';

-- 4. Check current user/role context
SELECT 
    current_user,
    current_role,
    session_user;

-- 5. Temporarily disable RLS to test (CAUTION: Only for debugging)
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 6. Re-enable RLS after testing (IMPORTANT: Run this after debugging)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;