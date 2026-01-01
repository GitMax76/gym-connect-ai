
-- Verification Report Query
-- Run this in the Supabase SQL Editor to verify the state of the system

BEGIN;

DO $$
DECLARE
    v_referrer_id UUID;
    v_referee_id UUID;
    v_referral_code TEXT;
    v_referrer_wallet_id UUID;
    v_referee_wallet_id UUID;
    v_referrer_balance NUMERIC;
    v_referee_balance NUMERIC;
BEGIN
    RAISE NOTICE '--- STARTING VERIFICATION ---';

    -- 1. Find a user with a referral code (Referrer)
    SELECT id, referral_code INTO v_referrer_id, v_referral_code FROM profiles WHERE referral_code IS NOT NULL LIMIT 1;
    
    IF v_referrer_id IS NULL THEN
        RAISE NOTICE 'Skipping Referral Test: No users with referral code found due to lack of seed data or new registrations.';
    ELSE
        RAISE NOTICE 'Found Referrer: % (Code: %)', v_referrer_id, v_referral_code;
        
        -- Check Wallet Balance
        SELECT balance INTO v_referrer_balance FROM wallets WHERE user_id = v_referrer_id;
        RAISE NOTICE 'Referrer Balance: % FC', v_referrer_balance;
    END IF;

    -- 2. Verify Referrals Table Count
    DECLARE 
        v_count INTEGER;
    BEGIN
        SELECT count(*) INTO v_count FROM referrals;
        RAISE NOTICE 'Total Referrals Recorded: %', v_count;
    END;

    -- 3. Verify Transactions Count
    DECLARE
        v_tx_count INTEGER;
    BEGIN
        SELECT count(*) INTO v_tx_count FROM transactions;
        RAISE NOTICE 'Total Transactions Recorded: %', v_tx_count;
    END;

    -- 4. Verify Workout Plans
    DECLARE
        v_plans_count INTEGER;
        v_paid_plans INTEGER;
    BEGIN
        SELECT count(*) INTO v_plans_count FROM workout_plans;
        SELECT count(*) INTO v_paid_plans FROM workout_plans WHERE payment_status = 'paid';
        RAISE NOTICE 'Total Workout Plans: % (Paid: %)', v_plans_count, v_paid_plans;
    END;

    RAISE NOTICE '--- VERIFICATION COMPLETE ---';
END $$;

ROLLBACK; -- Don't commit, just check
