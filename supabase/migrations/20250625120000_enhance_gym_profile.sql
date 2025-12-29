-- Add new columns to gym_profiles for enhanced profile management
ALTER TABLE public.gym_profiles 
ADD COLUMN IF NOT EXISTS opening_days TEXT[] DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_plans JSONB DEFAULT '[]'::jsonb;

-- Comment on columns for documentation
COMMENT ON COLUMN public.gym_profiles.opening_days IS 'Array of opening days (e.g. ["Mon", "Tue"])';
COMMENT ON COLUMN public.gym_profiles.subscription_plans IS 'JSON array of subscription plans available';
