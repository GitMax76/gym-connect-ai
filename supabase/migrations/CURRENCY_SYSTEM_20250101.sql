-- CURRENCY SYSTEM (WALLETS & TRANSACTIONS)
-- VERSION: 2025-01-01-CURRENCY-DEMO
-- ----------------------------------------------------------------------------

-- 1. Create WALLETS Table
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0), -- Prevent negative balance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    UNIQUE(user_id)
);

-- 2. Create TRANSACTIONS Table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Can be negative (payment) or positive (deposit)
    type TEXT NOT NULL CHECK (type IN ('welcome_bonus', 'booking_payment', 'booking_income', 'deposit', 'withdrawal')),
    status TEXT NOT NULL DEFAULT 'completed',
    description TEXT,
    related_entity_id UUID, -- Generic link to booking_id or stripe_id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. RLS Policies
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own wallet
CREATE POLICY "Users view own wallet" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own transactions
CREATE POLICY "Users view own transactions" ON public.transactions
    FOR SELECT USING (
        wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
    );

-- 4. TRIGGER: Initial Welcome Bonus
-- Automatically give 100 Credits when a new Profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER AS $$
DECLARE
    new_wallet_id UUID;
BEGIN
    -- Create Wallet
    INSERT INTO public.wallets (user_id, balance)
    VALUES (NEW.id, 100) -- 100 Credits Welcome Bonus
    RETURNING id INTO new_wallet_id;
    
    -- Log Transaction
    INSERT INTO public.transactions (wallet_id, amount, type, description)
    VALUES (new_wallet_id, 100, 'welcome_bonus', 'Bonus di Benvenuto');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach to profiles table (after insert)
DROP TRIGGER IF EXISTS on_profile_created_wallet ON public.profiles;
CREATE TRIGGER on_profile_created_wallet
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();


-- 5. SECURE PAYMENT FUNCTION (RPC)
-- This performs the transfer safely on the backend
CREATE OR REPLACE FUNCTION process_booking_payment(
    p_user_id UUID,
    p_trainer_id UUID,
    p_amount INTEGER,
    p_booking_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with superuser privileges to bypass RLS for the recipient update
AS $$
DECLARE
    v_user_wallet_id UUID;
    v_trainer_wallet_id UUID;
    v_user_balance INTEGER;
BEGIN
    -- 1. Get User Wallet
    SELECT id, balance INTO v_user_wallet_id, v_user_balance
    FROM public.wallets WHERE user_id = p_user_id;
    
    IF v_user_wallet_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Wallet utente non trovato');
    END IF;

    -- 2. Check Balance
    IF v_user_balance < p_amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Credito insufficiente');
    END IF;

    -- 3. Get Trainer Wallet
    SELECT id INTO v_trainer_wallet_id
    FROM public.wallets WHERE user_id = p_trainer_id;
    
    IF v_trainer_wallet_id IS NULL THEN
        -- Auto-create trainer wallet if missing (robustness)
        INSERT INTO public.wallets (user_id, balance) VALUES (p_trainer_id, 0)
        RETURNING id INTO v_trainer_wallet_id;
    END IF;

    -- 4. EXECUTE TRANSFER (Atomic)
    
    -- Deduct from User
    UPDATE public.wallets 
    SET balance = balance - p_amount, updated_at = now()
    WHERE id = v_user_wallet_id;
    
    INSERT INTO public.transactions (wallet_id, amount, type, description, related_entity_id)
    VALUES (v_user_wallet_id, -p_amount, 'booking_payment', 'Pagamento Prenotazione', p_booking_id);

    -- Add to Trainer (Full amount for demo, can add fee logic here later)
    UPDATE public.wallets 
    SET balance = balance + p_amount, updated_at = now()
    WHERE id = v_trainer_wallet_id;

    INSERT INTO public.transactions (wallet_id, amount, type, description, related_entity_id)
    VALUES (v_trainer_wallet_id, p_amount, 'booking_income', 'Incasso Prenotazione', p_booking_id);

    RETURN jsonb_build_object('success', true);

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
