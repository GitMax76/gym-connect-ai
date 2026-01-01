-- 1. FIX TRAINER PROFILE PERMISSIONS
-- The frontend uses direct UPDATE, so we need a policy for it.
ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trainers can update own profile" ON public.trainer_profiles;
CREATE POLICY "Trainers can update own profile" 
ON public.trainer_profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Trainers can insert own profile" ON public.trainer_profiles;
CREATE POLICY "Trainers can insert own profile" 
ON public.trainer_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 2. FIX TRAINER AVAILABILITY PERMISSIONS
ALTER TABLE public.trainer_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trainers manage own availability" ON public.trainer_availability;
CREATE POLICY "Trainers manage own availability" 
ON public.trainer_availability FOR ALL
USING (auth.uid() = trainer_id);

DROP POLICY IF EXISTS "Public view trainer availability" ON public.trainer_availability;
CREATE POLICY "Public view trainer availability" 
ON public.trainer_availability FOR SELECT
USING (true);

-- 3. FIX BOOKINGS PERMISSIONS (For Dashboard)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own bookings" ON public.bookings;
CREATE POLICY "Users view own bookings" 
ON public.bookings FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = trainer_id);

DROP POLICY IF EXISTS "Users create bookings" ON public.bookings;
CREATE POLICY "Users create bookings" 
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Trainers manage bookings" ON public.bookings;
CREATE POLICY "Trainers manage bookings" 
ON public.bookings FOR UPDATE
USING (auth.uid() = trainer_id);

GRANT ALL ON public.trainer_profiles TO authenticated;
GRANT ALL ON public.trainer_availability TO authenticated;
GRANT ALL ON public.bookings TO authenticated;

-- 4. SEED DUMMY BOOKING FOR TRAINER DASHBOARD
-- Links 'athlete_fake' (Laura) to 'trainer_fake' (Marco)
DO $$
DECLARE
    trainer_id UUID;
    athlete_id UUID;
BEGIN
    SELECT id INTO trainer_id FROM public.profiles WHERE email = 'trainer_fake@test.com' LIMIT 1;
    SELECT id INTO athlete_id FROM public.profiles WHERE email = 'athlete_fake@test.com' LIMIT 1;

    IF trainer_id IS NOT NULL AND athlete_id IS NOT NULL THEN
        INSERT INTO public.bookings (
            id, user_id, trainer_id, booking_date, start_time, end_time, session_type, status, price
        ) VALUES (
            gen_random_uuid(),
            athlete_id,
            trainer_id,
            CURRENT_DATE,
            '10:00',
            '11:00',
            'personal',
            'confirmed',
            50
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;
