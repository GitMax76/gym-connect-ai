-- Create a specific type for user roles if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.user_type AS ENUM ('user', 'trainer', 'gym_owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Create Base Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  user_type public.user_type DEFAULT 'user',
  avatar_url TEXT,
  city TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create Specific Profile Tables (These were missing!)

-- User Profiles (for athletes/regular users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  fitness_level TEXT,
  primary_goal TEXT,
  secondary_goals TEXT[],
  availability_hours_per_week INTEGER,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  preferred_location TEXT,
  health_conditions TEXT,
  experience_description TEXT
);

-- Trainer Profiles
CREATE TABLE IF NOT EXISTS public.trainer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  years_experience INTEGER,
  specializations TEXT[],
  certifications TEXT[],
  languages TEXT[],
  personal_rate_per_hour DECIMAL(10,2),
  group_rate_per_hour DECIMAL(10,2),
  preferred_areas TEXT,
  availability_schedule JSONB,
  is_verified BOOLEAN DEFAULT false,
  date_of_birth DATE
);

-- Gym Profiles
CREATE TABLE IF NOT EXISTS public.gym_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  gym_name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  postal_code TEXT,
  website_url TEXT,
  business_email TEXT,
  social_media JSONB,
  opening_hours TEXT,
  closing_hours TEXT,
  monthly_fee DECIMAL(10,2),
  day_pass_fee DECIMAL(10,2),
  member_capacity INTEGER,
  facilities TEXT[],
  specializations TEXT[],
  is_verified BOOLEAN DEFAULT false
);

-- 3. Setup Triggers for New User Handling

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create base profile
  INSERT INTO public.profiles (id, email, first_name, last_name, user_type)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    COALESCE((new.raw_user_meta_data->>'user_type')::public.user_type, 'user')
  );

  -- Create specific profile based on type
  IF (new.raw_user_meta_data->>'user_type') = 'user' THEN
      INSERT INTO public.user_profiles (id) VALUES (new.id);
  ELSIF (new.raw_user_meta_data->>'user_type') = 'trainer' THEN
      INSERT INTO public.trainer_profiles (id) VALUES (new.id);
  ELSIF (new.raw_user_meta_data->>'user_type') = 'gym_owner' THEN
      INSERT INTO public.gym_profiles (id, gym_name) VALUES (new.id, 'My Gym'); -- Default name, user should update
  ELSE
      -- Default to user profile if unknown
      INSERT INTO public.user_profiles (id) VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for user_profiles
CREATE POLICY "Users can view their own user profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own user profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own user profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own user profile" ON public.user_profiles FOR DELETE USING (auth.uid() = id);

-- Policies for trainer_profiles
CREATE POLICY "Trainers can view their own trainer profile" ON public.trainer_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Trainers can insert their own trainer profile" ON public.trainer_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Trainers can update their own trainer profile" ON public.trainer_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Trainers can delete their own trainer profile" ON public.trainer_profiles FOR DELETE USING (auth.uid() = id);

-- Policies for gym_profiles
CREATE POLICY "Gym owners can view their own gym profile" ON public.gym_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Gym owners can insert their own gym profile" ON public.gym_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Gym owners can update their own gym profile" ON public.gym_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Gym owners can delete their own gym profile" ON public.gym_profiles FOR DELETE USING (auth.uid() = id);

-- Public View Policies (Added to allow Search/Matchmaking)
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can view trainer profiles" ON public.trainer_profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can view gym profiles" ON public.gym_profiles FOR SELECT USING (true);

-- 6. Create Additional Feature Tables

-- Matching Preferences
CREATE TABLE IF NOT EXISTS public.matching_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferred_trainer_specializations TEXT[],
  preferred_gym_facilities TEXT[],
  max_distance_km INTEGER DEFAULT 10,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  preferred_times JSONB,
  workout_frequency_per_week INTEGER,
  group_vs_personal TEXT CHECK (group_vs_personal IN ('personal', 'group', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Search Filters
CREATE TABLE IF NOT EXISTS public.search_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  filter_name TEXT NOT NULL,
  filter_type TEXT CHECK (filter_type IN ('trainer', 'gym')) NOT NULL,
  filters JSONB NOT NULL,
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, filter_name)
);

-- Match Scores
CREATE TABLE IF NOT EXISTS public.match_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK ((trainer_id IS NOT NULL AND gym_id IS NULL) OR (trainer_id IS NULL AND gym_id IS NOT NULL))
);

-- Trainer Availability
CREATE TABLE IF NOT EXISTS public.trainer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT no_overlapping_times CHECK (start_time < end_time)
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  session_type TEXT CHECK (session_type IN ('personal', 'group')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(trainer_id, booking_date, start_time)
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(reviewer_id, booking_id),
  CHECK (reviewer_id != reviewed_id)
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_method TEXT CHECK (payment_method IN ('stripe', 'paypal', 'cash')) DEFAULT 'stripe',
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  subscription_type TEXT CHECK (subscription_type IN ('monthly', 'quarterly', 'yearly')) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')) DEFAULT 'active',
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Enable RLS on remaining tables
ALTER TABLE public.matching_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_availability ENABLE ROW LEVEL SECURITY;

-- 8. Additional RLS Policies (Simplified for brevity, ensuring essential access)

-- Matching Preferences
CREATE POLICY "Users can manage their matching preferences" ON public.matching_preferences FOR ALL USING (auth.uid() = user_id);

-- Match Scores
CREATE POLICY "Users can view their match scores" ON public.match_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert match scores" ON public.match_scores FOR INSERT WITH CHECK (true);

-- Search Filters
CREATE POLICY "Users can manage their search filters" ON public.search_filters FOR ALL USING (auth.uid() = user_id);

-- Bookings
CREATE POLICY "Users and trainers can view bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() = trainer_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users and trainers can update their bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = trainer_id);

-- Reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- Trainer Availability
CREATE POLICY "Anyone can view trainer availability" ON public.trainer_availability FOR SELECT USING (true);
CREATE POLICY "Trainers can manage their availability" ON public.trainer_availability FOR ALL USING (auth.uid() = trainer_id);

-- Payments
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage payments" ON public.payments FOR ALL WITH CHECK (true);

-- Subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Functions
CREATE OR REPLACE FUNCTION calculate_match_score(p_user_id UUID, p_trainer_id UUID DEFAULT NULL, p_gym_id UUID DEFAULT NULL) RETURNS DECIMAL AS $$
DECLARE
  base_score DECIMAL := 50.0;
  final_score DECIMAL := 50.0;
BEGIN
  final_score := base_score + (RANDOM() * 50);
  IF final_score > 100 THEN final_score := 100; END IF;
  IF final_score < 0 THEN final_score := 0; END IF;
  RETURN final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_trainer_availability(p_trainer_id UUID, p_date DATE, p_start_time TIME, p_end_time TIME) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trainer_availability ta
    WHERE ta.trainer_id = p_trainer_id
    AND ta.day_of_week = EXTRACT(DOW FROM p_date)
    AND ta.is_available = true
    AND ta.start_time <= p_start_time
    AND ta.end_time >= p_end_time
  ) AND NOT EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.trainer_id = p_trainer_id
    AND b.booking_date = p_date
    AND b.status IN ('confirmed', 'pending')
    AND (
      (b.start_time <= p_start_time AND b.end_time > p_start_time) OR
      (b.start_time < p_end_time AND b.end_time >= p_end_time) OR
      (b.start_time >= p_start_time AND b.end_time <= p_end_time)
    )
  );
END;
$$ LANGUAGE plpgsql;

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
-- Create leads table for contact forms
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    type TEXT NOT NULL CHECK (type IN ('athlete', 'trainer', 'gym')),
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived'))
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can submit a contact form)
CREATE POLICY "Allow public insert to leads" ON public.leads
    FOR INSERT
    WITH CHECK (true);

-- Allow admins (or authenticated users for now if no admin role) to view leads
-- For simplicity in this demo phase, we'll allow authenticated users to view, 
-- but in production this should be restricted to admin roles.
CREATE POLICY "Allow authenticated view leads" ON public.leads
    FOR SELECT
    USING (auth.role() = 'authenticated');
