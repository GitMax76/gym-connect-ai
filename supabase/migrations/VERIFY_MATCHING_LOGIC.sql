-- VERIFICATION SCRIPT: SALERNO MATCHING LOGIC
-- Purpose: Verify that the `calculate_match_score` function returns high scores for compatible profiles in Salerno.

BEGIN;

-- 1. Setup Test Data (Temporary IDs)
-- We use static UUIDs for reproducibility in this test
\set test_user_id '00000000-0000-0000-0000-000000000001'
\set test_trainer_id '00000000-0000-0000-0000-000000000002'
\set test_gym_id '00000000-0000-0000-0000-000000000003'

-- Clean up any previous test artifacts
DELETE FROM public.matching_preferences WHERE user_id = :'test_user_id';
DELETE FROM public.trainer_profiles WHERE id = :'test_trainer_id';
DELETE FROM public.gym_profiles WHERE id = :'test_gym_id';
DELETE FROM public.profiles WHERE id IN (:'test_user_id', :'test_trainer_id', :'test_gym_id');

-- 2. Insert Profiles (Salerno Base)
INSERT INTO public.profiles (id, email, first_name, last_name, city, user_type) VALUES
(:'test_user_id', 'test_athlete@salerno.com', 'Luigi', 'Verdi', 'Salerno', 'user'),
(:'test_trainer_id', 'test_trainer@salerno.com', 'Mario', 'Rossi', 'Salerno', 'trainer'),
(:'test_gym_id', 'test_gym@salerno.com', 'FitHub', 'Salerno', 'Salerno', 'gym_owner');

-- 3. Insert Specific Data for Perfect Match
-- Trainer: 50€/hr, Specialization: Weight Loss, Functional
INSERT INTO public.trainer_profiles (id, personal_rate_per_hour, specializations) VALUES
(:'test_trainer_id', 50, ARRAY['Weight Loss', 'Functional Training']);

-- Gym: 40€/mo, Facilities: Sauna, Pool
INSERT INTO public.gym_profiles (id, monthly_fee, facilities) VALUES
(:'test_gym_id', 40, ARRAY['Sauna', 'Pool']);

-- User: Budget 60€, Wants: Weight Loss, Sauna
INSERT INTO public.matching_preferences (user_id, budget_max, preferred_trainer_specializations, preferred_gym_facilities) VALUES
(:'test_user_id', 60, ARRAY['Weight Loss'], ARRAY['Sauna']);

-- 4. RUN VERIFICATION TESTS

-- Test A: User <-> Trainer Match
-- Expected:
-- City match (Salerno == Salerno) -> +30
-- Budget match (50 <= 60) -> +30
-- Spec match (Weight Loss in [Weight Loss, Functional]) -> +10
-- Total Expected: 70
SELECT 
    'Trainer Verification' as test_name,
    CASE 
        WHEN calculate_match_score(:'test_user_id', :'test_trainer_id', NULL) >= 70 THEN 'PASS' 
        ELSE 'FAIL' 
    END as status,
    calculate_match_score(:'test_user_id', :'test_trainer_id', NULL) as score;

-- Test B: User <-> Gym Match
-- Expected:
-- City match (+30)
-- Budget match (40 <= 60) -> +30
-- Facility match (Sauna in [Sauna, Pool]) -> +10
-- Total Expected: 70
SELECT 
    'Gym Verification' as test_name,
    CASE 
        WHEN calculate_match_score(:'test_user_id', NULL, :'test_gym_id') >= 70 THEN 'PASS' 
        ELSE 'FAIL' 
    END as status,
    calculate_match_score(:'test_user_id', NULL, :'test_gym_id') as score;

ROLLBACK; -- Rollback changes so we don't pollute the DB, just verify logic
