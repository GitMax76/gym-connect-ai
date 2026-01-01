-- FIX ROW LEVEL SECURITY (RLS) FOR GYM PROFILES
-- This script matches the logic we verified: Users need permission to SELECT (read) their own profile to log in.

-- 1. Ensure RLS is enabled
ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Safely create the "View Own Profile" policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'gym_profiles' AND policyname = 'Users can view own gym profile'
    ) THEN
        CREATE POLICY "Users can view own gym profile" ON public.gym_profiles
            FOR SELECT
            USING (auth.uid() = id);
    END IF;
END $$;

-- 3. Safely create the "Update Own Profile" policy (for non-RPC updates if any)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'gym_profiles' AND policyname = 'Users can update own gym profile'
    ) THEN
        CREATE POLICY "Users can update own gym profile" ON public.gym_profiles
            FOR UPDATE
            USING (auth.uid() = id);
    END IF;
END $$;

-- 4. Grant access to authenticated users
GRANT SELECT, UPDATE, INSERT ON public.gym_profiles TO authenticated;
