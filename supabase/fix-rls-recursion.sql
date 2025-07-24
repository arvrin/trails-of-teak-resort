-- Fix RLS infinite recursion issue
-- Run this in Supabase SQL Editor

-- Step 1: Drop all existing policies on users table to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.users;

-- Step 2: Temporarily disable RLS to clear any recursion
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, non-recursive policies

-- Policy 1: Users can read their own profile
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Users can update their own profile  
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy 3: Allow inserts for authenticated users (for user creation)
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Step 5: Test the fix
SELECT id, full_name, role 
FROM public.users 
WHERE id = auth.uid();

-- Step 6: Verify policies exist and are correct
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';