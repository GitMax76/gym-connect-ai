-- Execute this SQL in your Supabase SQL Editor to fix the "No results found" issue.
-- It works by allowing public read access to profiles, which is required for the search to find matches.

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can view trainer profiles" ON public.trainer_profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can view gym profiles" ON public.gym_profiles FOR SELECT USING (true);
