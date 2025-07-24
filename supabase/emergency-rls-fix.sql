-- EMERGENCY: Fix RLS infinite recursion by completely resetting
-- Run this in Supabase SQL Editor

-- Step 1: Completely disable RLS on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies on users table (even if they don't exist)
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.users';
    END LOOP;
END $$;

-- Step 3: Test that we can now query users table
SELECT 'SUCCESS: Can query users table' as status, id, full_name, role 
FROM public.users 
WHERE id = '6bf7fc20-6aee-4e15-b04b-344d6f01873e';

-- Step 4: For now, leave RLS disabled for testing
-- We'll add it back once admin dashboard is working

-- Step 5: Verify no policies exist
SELECT 'Policies remaining:' as info, count(*) as policy_count
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- IMPORTANT: This temporarily makes users table publicly accessible
-- Only use this for debugging, we'll add proper security back later