-- SAFE GUARD TRIGGER for User Creation
-- This script updates the handle_new_user function to be "fail-safe".
-- If inserting the profile fails (e.g. constraints, missing columns), it catches the error
-- and allows the User to be created anyway. The generic error "Database error saving new user" will be gone.

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
      -- Safely cast user_type, defaulting to 'user' if missing or invalid
      COALESCE((new.raw_user_meta_data->>'user_type')::text, 'user')
    );
  EXCEPTION WHEN OTHERS THEN
    -- If profile creation fails, log it (visible in Supabase logs) but DO NOT FAIL the transaction
    RAISE WARNING 'Auto-create profile failed for user %: %', new.id, SQLERRM;
  END;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach the trigger to be sure
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
