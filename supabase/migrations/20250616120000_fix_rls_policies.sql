
-- Fix RLS policies to allow public read access to profiles
-- This is necessary for the search and matchmaking functionality to work

-- Policy for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Policy for user_profiles
DROP POLICY IF EXISTS "Users can view their own user profile" ON public.user_profiles;
CREATE POLICY "User profiles are viewable by everyone" 
ON public.user_profiles FOR SELECT 
USING (true);

-- Policy for trainer_profiles
DROP POLICY IF EXISTS "Trainers can view their own trainer profile" ON public.trainer_profiles;
CREATE POLICY "Trainer profiles are viewable by everyone" 
ON public.trainer_profiles FOR SELECT 
USING (true);

-- Policy for gym_profiles
DROP POLICY IF EXISTS "Gym owners can view their own gym profile" ON public.gym_profiles;
CREATE POLICY "Gym profiles are viewable by everyone" 
ON public.gym_profiles FOR SELECT 
USING (true);
