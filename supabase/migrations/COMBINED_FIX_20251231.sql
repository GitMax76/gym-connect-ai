-- ==============================================================================
-- 1. REGISTRATION TRIGGER FIX (Prevents "500 Database Error" during Sign Up)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, user_type)
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data->>'first_name', ''),
      COALESCE(new.raw_user_meta_data->>'last_name', ''),
      -- Safely cast user_type to text, defaulting to 'user' if missing/invalid
      COALESCE((new.raw_user_meta_data->>'user_type')::text, 'user')
    );
  EXCEPTION WHEN OTHERS THEN
    -- If profile creation fails, LOG it but DO NOT FAIL the entire registration
    RAISE WARNING 'Auto-create profile failed for user %: %', new.id, SQLERRM;
  END;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 2. GYM PROFILE RPC & COLUMN FIX (Updates manage_gym_profile and table schema)
-- ==============================================================================

-- Ensure the column exists for flexible opening hours
ALTER TABLE public.gym_profiles ADD COLUMN IF NOT EXISTS opening_hours_map JSONB DEFAULT NULL;

-- Create/Update the RPC function
CREATE OR REPLACE FUNCTION public.manage_gym_profile(
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
    p_subscription_plans JSONB DEFAULT NULL,
    p_monthly_fee NUMERIC DEFAULT NULL,
    p_day_pass_fee NUMERIC DEFAULT NULL,
    p_website_url TEXT DEFAULT NULL,
    p_social_media JSONB DEFAULT NULL,
    p_opening_hours_map JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSONB;
BEGIN
    -- Authorization check: Ensure the caller matches the p_user_id (if authenticated)
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'Unauthorized: You can only manage your own profile';
    END IF;

    -- Upsert logic
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

    -- Return the updated/inserted row
    SELECT to_jsonb(gp.*) INTO v_result FROM public.gym_profiles gp WHERE id = p_user_id;
    RETURN v_result;
END;
$$;
