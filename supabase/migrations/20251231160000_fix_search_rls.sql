-- 1. FIX RLS POLICIES FOR SEARCH
-- Profiles must be visible to all authenticated users for search to work. 
-- Note: 'authenticated' role includes anyone logged in.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Trainers viewable by everyone" ON public.trainer_profiles;
CREATE POLICY "Trainers viewable by everyone" 
ON public.trainer_profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Gyms viewable by everyone" ON public.gym_profiles;
CREATE POLICY "Gyms viewable by everyone" 
ON public.gym_profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users viewable by everyone" ON public.user_profiles;
CREATE POLICY "Users viewable by everyone" 
ON public.user_profiles FOR SELECT 
USING (true);

-- 2. SEED DUMMY DATA
-- We must insert into auth.users first because profiles references it.
-- We use a dummy password hash (it won't work for login but works for FK).

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'trainer_fake@test.com', 'dummy_hash', now(), '{"provider": "email", "providers": ["email"]}', '{"user_type": "trainer", "first_name": "Marco", "last_name": "Trainer"}', 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'athlete_fake@test.com', 'dummy_hash', now(), '{"provider": "email", "providers": ["email"]}', '{"user_type": "user", "first_name": "Laura", "last_name": "Rossi"}', 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000003', 'gym_fake@test.com', 'dummy_hash', now(), '{"provider": "email", "providers": ["email"]}', '{"user_type": "gym_owner", "first_name": "Spartan", "last_name": "Gym"}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- NOTE: The handle_new_user trigger usually runs on auth.users insert and creates the profile.
-- We'll try to update the profiles to ensure they have the city and avatar we want, 
-- or insert them if the trigger didn't run (unlikely but safe).

-- TRAINER
INSERT INTO public.profiles (id, email, first_name, last_name, user_type, city, avatar_url)
VALUES ('00000000-0000-0000-0000-000000000001', 'trainer_fake@test.com', 'Marco', 'Trainer', 'trainer', 'Roma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco')
ON CONFLICT (id) DO UPDATE SET city = EXCLUDED.city, avatar_url = EXCLUDED.avatar_url;

INSERT INTO public.trainer_profiles (id, specializations, bio, years_experience)
VALUES ('00000000-0000-0000-0000-000000000001', ARRAY['Bodybuilding', 'Crossfit'], 'Certified Personal Trainer with 5 years experience.', 5)
ON CONFLICT (id) DO NOTHING;

-- ATHLETE
INSERT INTO public.profiles (id, email, first_name, last_name, user_type, city, avatar_url)
VALUES ('00000000-0000-0000-0000-000000000002', 'athlete_fake@test.com', 'Laura', 'Rossi', 'user', 'Roma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura')
ON CONFLICT (id) DO UPDATE SET city = EXCLUDED.city, avatar_url = EXCLUDED.avatar_url;

INSERT INTO public.user_profiles (id, fitness_level, primary_goal)
VALUES ('00000000-0000-0000-0000-000000000002', 'Intermediate', 'Muscle Gain')
ON CONFLICT (id) DO NOTHING;

-- GYM
INSERT INTO public.profiles (id, email, first_name, last_name, user_type, city, avatar_url)
VALUES ('00000000-0000-0000-0000-000000000003', 'gym_fake@test.com', 'Spartan', 'Gym', 'gym_owner', 'Roma', 'https://api.dicebear.com/7.x/initials/svg?seed=SG')
ON CONFLICT (id) DO UPDATE SET city = EXCLUDED.city, avatar_url = EXCLUDED.avatar_url;

INSERT INTO public.gym_profiles (id, gym_name, address, description, facilities)
VALUES ('00000000-0000-0000-0000-000000000003', 'Spartan Gym Roma', 'Via Roma 100', 'Palestra storica nel cuore della città.', ARRAY['Sala Pesi', 'Sauna'])
ON CONFLICT (id) DO NOTHING;
