
-- Re-create UPDATE policy for gym_profiles to ensure gym owners can update their data
DROP POLICY IF EXISTS "Gym owners can update their own gym profile" ON public.gym_profiles;

CREATE POLICY "Gym owners can update their own gym profile" 
ON public.gym_profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
