-- Add referral code to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);

-- Create Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES public.profiles(id) NOT NULL,
    referee_id UUID REFERENCES public.profiles(id) NOT NULL,
    status TEXT DEFAULT 'completed', -- 'pending', 'completed'
    reward_amount INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referee_id) -- One referral per new user
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own referrals (as referrer)" 
ON public.referrals FOR SELECT 
USING (auth.uid() = referrer_id);

CREATE POLICY "Users can see their own referral status (as referee)" 
ON public.referrals FOR SELECT 
USING (auth.uid() = referee_id);

-- Function to generate random referral code
CREATE OR REPLACE FUNCTION generate_referral_code() 
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to assign referral code on profile creation
CREATE OR REPLACE FUNCTION handle_new_user_referral_code() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code := generate_referral_code();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_referral_code_trigger
BEFORE INSERT ON public.profiles
FOR EACH ROW
WHEN (NEW.referral_code IS NULL)
EXECUTE FUNCTION handle_new_user_referral_code();

-- Function to handle Referral Application (User enters code)
CREATE OR REPLACE FUNCTION apply_referral_code(code_input TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    referrer_profile RECORD;
    new_user_id UUID;
BEGIN
    new_user_id := auth.uid();
    
    -- Check if user already has a referrer
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = new_user_id AND referred_by IS NOT NULL) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Hai già riscattato un codice invito.');
    END IF;

    -- Find referrer
    SELECT * INTO referrer_profile FROM public.profiles WHERE referral_code = code_input;
    
    IF referrer_profile IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Codice invito non valido.');
    END IF;
    
    IF referrer_profile.id = new_user_id THEN
        RETURN jsonb_build_object('success', false, 'message', 'Non puoi usare il tuo stesso codice.');
    END IF;

    -- Update new user profile
    UPDATE public.profiles SET referred_by = referrer_profile.id WHERE id = new_user_id;

    -- Create Referral Record
    INSERT INTO public.referrals (referrer_id, referee_id, reward_amount)
    VALUES (referrer_profile.id, new_user_id, 15);

    -- Award FitCoin to Referrer
    INSERT INTO public.transactions (wallet_id, amount, type, description, related_entity_id)
    SELECT id, 15, 'referral_bonus', 'Bonus invito amico', new_user_id
    FROM public.wallets WHERE user_id = referrer_profile.id;

    -- Award FitCoin to Referee (New User)
    INSERT INTO public.transactions (wallet_id, amount, type, description, related_entity_id)
    SELECT id, 15, 'referral_bonus', 'Bonus benvenuto invito', referrer_profile.id
    FROM public.wallets WHERE user_id = new_user_id;

    -- Update balances
    UPDATE public.wallets SET balance = balance + 15 WHERE user_id = referrer_profile.id;
    UPDATE public.wallets SET balance = balance + 15 WHERE user_id = new_user_id;

    RETURN jsonb_build_object('success', true, 'message', 'Codice applicato! 15 FC accreditati.');
END;
$$;


-- WORKOUT PLANS & REQUESTS
-- Updates to workout_plans
ALTER TABLE public.workout_plans 
ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'; -- 'pending', 'paid'

-- Workout Requests Table
CREATE TABLE IF NOT EXISTS public.workout_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    trainer_id UUID REFERENCES public.profiles(id) NOT NULL,
    goals TEXT,
    injuries TEXT,
    days_per_week TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Workout Requests
ALTER TABLE public.workout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests" 
ON public.workout_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Trainers can view requests sent to them" 
ON public.workout_requests FOR SELECT 
USING (auth.uid() = trainer_id);

CREATE POLICY "Users can create requests" 
ON public.workout_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Trainers can update status" 
ON public.workout_requests FOR UPDATE 
USING (auth.uid() = trainer_id);
