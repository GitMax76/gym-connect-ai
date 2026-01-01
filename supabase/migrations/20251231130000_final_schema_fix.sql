-- FINAL GYM PROFILES SCHEMA FIX
-- This script adds the columns that were still missing: opening_days and subscription_plans.

ALTER TABLE public.gym_profiles
  ADD COLUMN IF NOT EXISTS opening_days TEXT[],
  ADD COLUMN IF NOT EXISTS subscription_plans JSONB DEFAULT '[]'::jsonb;

-- Re-apply previous columns just to be absolutely safe (idempotent)
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
  ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS opening_hours_map JSONB DEFAULT NULL;

COMMENT ON COLUMN public.gym_profiles.opening_days IS 'List of days the gym is open';
COMMENT ON COLUMN public.gym_profiles.subscription_plans IS 'JSON Array of subscription plans';
