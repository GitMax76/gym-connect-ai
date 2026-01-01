-- 1. FIX RLS FOR SUBSCRIPTIONS
-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow Gym Owners to view subscriptions for their gym
DROP POLICY IF EXISTS "Gym owners can view their subscriptions" ON public.subscriptions;
CREATE POLICY "Gym owners can view their subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = gym_id);

-- Allow Users to view their own subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Grant access
GRANT ALL ON public.subscriptions TO authenticated;

-- 2. SEED DUMMY SUBSCRIPTION FOR TEST
-- We will dynamically find the ID of your test user and the dummy athlete
DO $$
DECLARE
    my_gym_id UUID;
    athlete_id UUID;
BEGIN
    -- Get ID of the user we're testing with (Change email if you used a different one)
    SELECT id INTO my_gym_id FROM auth.users WHERE email LIKE 'final_verify_%@example.com' LIMIT 1;
    
    -- Get ID of the dummy athlete (Laura)
    SELECT id INTO athlete_id FROM public.profiles WHERE email = 'athlete_fake@test.com' LIMIT 1;

    -- Create Subscription if both exist
    IF my_gym_id IS NOT NULL AND athlete_id IS NOT NULL THEN
        INSERT INTO public.subscriptions (
            id,
            user_id,
            gym_id,
            subscription_type,
            price,
            status,
            start_date,
            end_date
        ) VALUES (
            gen_random_uuid(),
            athlete_id,
            my_gym_id,
            'monthly',  -- Changed from 'Annual' to 'monthly' to satisfy check constraint
            50,
            'active',
            now(),
            now() + interval '1 month'
        )
        ON CONFLICT DO NOTHING; -- Avoid duplicates if running multiple times
    END IF;
END $$;
