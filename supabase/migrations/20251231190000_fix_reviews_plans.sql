-- 1. FIX REVIEWS TABLE & RLS
-- Ensure table exists (idempotent)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
    reviewed_id UUID NOT NULL REFERENCES public.profiles(id),
    booking_id UUID REFERENCES public.bookings(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reviews for a profile
DROP POLICY IF EXISTS "Reading reviews is public" ON public.reviews;
CREATE POLICY "Reading reviews is public" 
ON public.reviews FOR SELECT 
USING (true);

-- Policy: Authenticated users can create reviews (as reviewers)
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
CREATE POLICY "Users can create reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = reviewer_id);

GRANT ALL ON public.reviews TO authenticated;

-- 2. FIX WORKOUT PLANS TABLE & RLS
-- Ensure table exists
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES public.profiles(id),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Trainers can manage plans they created
DROP POLICY IF EXISTS "Trainers manage their plans" ON public.workout_plans;
CREATE POLICY "Trainers manage their plans" 
ON public.workout_plans FOR ALL 
USING (auth.uid() = trainer_id);

-- Policy: Users can view plans assigned to them
DROP POLICY IF EXISTS "Users view their plans" ON public.workout_plans;
CREATE POLICY "Users view their plans" 
ON public.workout_plans FOR SELECT 
USING (auth.uid() = user_id);

GRANT ALL ON public.workout_plans TO authenticated;

-- 3. SEED DUMMY WORKOUT PLAN
-- Assign a plan from 'trainer_fake' to 'athlete_fake'
DO $$
DECLARE
    t_id UUID;
    u_id UUID;
BEGIN
    SELECT id INTO t_id FROM public.profiles WHERE email = 'trainer_fake@test.com' LIMIT 1;
    SELECT id INTO u_id FROM public.profiles WHERE email = 'athlete_fake@test.com' LIMIT 1;

    IF t_id IS NOT NULL AND u_id IS NOT NULL THEN
        INSERT INTO public.workout_plans (
            trainer_id, user_id, title, description, start_date, end_date
        ) VALUES (
            t_id,
            u_id,
            'Dimagrimento Flash',
            'Scheda intensiva per il primo mese',
            CURRENT_DATE,
            CURRENT_DATE + interval '30 days'
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;
