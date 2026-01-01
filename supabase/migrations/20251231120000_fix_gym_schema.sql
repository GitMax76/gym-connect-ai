-- FIX GYM PROFILES SCHEMA
-- This script safely adds all columns expected by the registration form and RPC.
-- It uses "IF NOT EXISTS" so it is safe to run even if some columns already act partially.

ALTER TABLE public.gym_profiles
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS facilities TEXT[],
  ADD COLUMN IF NOT EXISTS specializations TEXT[],
  ADD COLUMN IF NOT EXISTS opening_hours TEXT,
  ADD COLUMN IF NOT EXISTS closing_hours TEXT,
  ADD COLUMN IF NOT EXISTS member_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC,
  ADD COLUMN IF NOT EXISTS day_pass_fee NUMERIC,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb;

-- Re-apply the opening_hours_map just in case
ALTER TABLE public.gym_profiles
  ADD COLUMN IF NOT EXISTS opening_hours_map JSONB DEFAULT NULL;

-- Commenting for clarity
COMMENT ON COLUMN public.gym_profiles.city IS 'City for the gym location';
COMMENT ON COLUMN public.gym_profiles.opening_hours_map IS 'Flexible opening hours per day';
