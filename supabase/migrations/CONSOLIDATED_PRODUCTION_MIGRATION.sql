-- CONSOLIDATED MIGRATION SCRIPT FOR GYM CONNECT AI
-- VERSION: 2025-12-31-PRODUCTION-RELEASE
-- AUTHOR: Antigravity Agent
-- 
-- INSTRUCTIONS: Run this script in your Supabase SQL Editor to apply all critical fixes.

-- ============================================================================
-- 1. GYM RPC & SCHEMA
-- ============================================================================
-- Ensure `manage_gym_profile` RPC exists
CREATE OR REPLACE FUNCTION manage_gym_profile(
    p_user_id UUID,
    p_gym_name TEXT,
    p_business_email TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_postal_code TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_facilities TEXT[] DEFAULT NULL,
    p_specializations TEXT[] DEFAULT NULL,
    p_opening_days TEXT[] DEFAULT NULL,
    p_opening_hours TEXT DEFAULT NULL,
    p_closing_hours TEXT DEFAULT NULL,
    p_member_capacity INTEGER DEFAULT NULL,
    p_subscription_plans JSONB[] DEFAULT NULL,
    p_monthly_fee NUMERIC DEFAULT NULL,
    p_day_pass_fee NUMERIC DEFAULT NULL,
    p_website_url TEXT DEFAULT NULL,
    p_social_media JSONB DEFAULT NULL,
    p_opening_hours_map JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_profile JSONB;
BEGIN
    -- Check permissions: User must be inserting their own profile OR correspond to the p_user_id
    IF auth.uid() <> p_user_id AND auth.uid() IS NOT NULL THEN
        RAISE EXCEPTION 'Unauthorized: You can only manage your own gym profile.';
    END IF;

    INSERT INTO public.gym_profiles (
        id, gym_name, business_email, address, city, postal_code, description,
        facilities, specializations, opening_days, opening_hours, closing_hours,
        member_capacity, subscription_plans, monthly_fee, day_pass_fee,
        website_url, social_media, opening_hours_map
    ) VALUES (
        p_user_id, p_gym_name, p_business_email, p_address, p_city, p_postal_code, p_description,
        p_facilities, p_specializations, p_opening_days, p_opening_hours, p_closing_hours,
        p_member_capacity, p_subscription_plans, p_monthly_fee, p_day_pass_fee,
        p_website_url, p_social_media, p_opening_hours_map
    )
    ON CONFLICT (id) DO UPDATE SET
        gym_name = EXCLUDED.gym_name,
        business_email = EXCLUDED.business_email,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        postal_code = EXCLUDED.postal_code,
        description = EXCLUDED.description,
        facilities = EXCLUDED.facilities,
        specializations = EXCLUDED.specializations,
        opening_days = EXCLUDED.opening_days,
        opening_hours = EXCLUDED.opening_hours,
        closing_hours = EXCLUDED.closing_hours,
        member_capacity = EXCLUDED.member_capacity,
        subscription_plans = EXCLUDED.subscription_plans,
        monthly_fee = EXCLUDED.monthly_fee,
        day_pass_fee = EXCLUDED.day_pass_fee,
        website_url = EXCLUDED.website_url,
        social_media = EXCLUDED.social_media,
        opening_hours_map = EXCLUDED.opening_hours_map;

    SELECT to_jsonb(gp) INTO new_profile FROM public.gym_profiles gp WHERE id = p_user_id;
    RETURN new_profile;
END;
$$;

-- Ensure opening_hours_map column exists
ALTER TABLE public.gym_profiles ADD COLUMN IF NOT EXISTS opening_hours_map JSONB;

-- ============================================================================
-- 2. RLS POLICIES (SEARCH & PUBLIC ACCESS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are visible" ON public.profiles;
CREATE POLICY "Public profiles are visible" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gym profiles are public" ON public.gym_profiles;
CREATE POLICY "Gym profiles are public" ON public.gym_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Trainer profiles are public" ON public.trainer_profiles;
CREATE POLICY "Trainer profiles are public" ON public.trainer_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "User profiles are public" ON public.user_profiles;
CREATE POLICY "User profiles are public" ON public.user_profiles FOR SELECT USING (true);

-- ============================================================================
-- 3. PROMOTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gym_profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage NUMERIC,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Promotions are public" ON public.promotions;
CREATE POLICY "Promotions are public" ON public.promotions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gyms manage own promotions" ON public.promotions;
CREATE POLICY "Gyms manage own promotions" ON public.promotions FOR ALL USING (auth.uid() = gym_id);

-- ============================================================================
-- 4. SUBSCRIPTIONS & MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    gym_id UUID NOT NULL REFERENCES public.gym_profiles(id),
    subscription_type TEXT CHECK (subscription_type IN ('monthly', 'annual', '3_months', '6_months')),
    price NUMERIC,
    status TEXT DEFAULT 'active',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gym owners view subscriptions" ON public.subscriptions;
CREATE POLICY "Gym owners view subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = gym_id);

DROP POLICY IF EXISTS "Users view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- 5. TRAINER RLS
-- ============================================================================
DROP POLICY IF EXISTS "Trainers update own profile" ON public.trainer_profiles;
CREATE POLICY "Trainers update own profile" ON public.trainer_profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Trainers insert own profile" ON public.trainer_profiles;
CREATE POLICY "Trainers insert own profile" ON public.trainer_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trainer Availability
CREATE TABLE IF NOT EXISTS public.trainer_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES public.trainer_profiles(id),
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true 
);
ALTER TABLE public.trainer_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trainers manage availability" ON public.trainer_availability;
CREATE POLICY "Trainers manage availability" ON public.trainer_availability FOR ALL USING (auth.uid() = trainer_id);

DROP POLICY IF EXISTS "Public view trainer availability" ON public.trainer_availability;
CREATE POLICY "Public view trainer availability" ON public.trainer_availability FOR SELECT USING (true);

-- ============================================================================
-- 6. BOOKINGS & PAYMENTS
-- ============================================================================
-- Ensure price column exists
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price NUMERIC;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own bookings" ON public.bookings;
CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() = trainer_id);

DROP POLICY IF EXISTS "Users create bookings" ON public.bookings;
CREATE POLICY "Users create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Trainers manage bookings" ON public.bookings;
CREATE POLICY "Trainers manage bookings" ON public.bookings FOR UPDATE USING (auth.uid() = trainer_id);

-- ============================================================================
-- 7. REVIEWS & WORKOUT PLANS
-- ============================================================================
-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
    reviewed_id UUID NOT NULL REFERENCES public.profiles(id),
    booking_id UUID REFERENCES public.bookings(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users create reviews" ON public.reviews;
CREATE POLICY "Users create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Workout Plans
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES public.profiles(id),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active'
);
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trainers manage plans" ON public.workout_plans;
CREATE POLICY "Trainers manage plans" ON public.workout_plans FOR ALL USING (auth.uid() = trainer_id);

DROP POLICY IF EXISTS "Users view own plans" ON public.workout_plans;
CREATE POLICY "Users view own plans" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
