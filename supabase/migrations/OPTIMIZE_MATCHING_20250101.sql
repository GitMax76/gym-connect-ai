-- OPTIMIZE MATCHING LOGIC & PERFORMANCE
-- VERSION: 2025-01-01-OPTIMIZE-MATCHING
-- ----------------------------------------------------------------------------
-- This script ensures the matching system is robust, performant, and logic-driven.
-- It replaces the random placeholder scoring with actual weighted logic.

-- 1. PERFORMANCE INDICES
-- ============================================================================
-- Speed up City filtering (used in every search)
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);

-- Speed up Array Overlap checks (Specializations & Facilities)
CREATE INDEX IF NOT EXISTS idx_trainer_specs ON public.trainer_profiles USING GIN(specializations);
CREATE INDEX IF NOT EXISTS idx_gym_facilities ON public.gym_profiles USING GIN(facilities);

-- Speed up Budget filtering
CREATE INDEX IF NOT EXISTS idx_trainer_price ON public.trainer_profiles(personal_rate_per_hour);
CREATE INDEX IF NOT EXISTS idx_gym_price ON public.gym_profiles(monthly_fee);


-- 2. ROBUST SCORING FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_match_score(
    p_user_id UUID,
    p_trainer_id UUID DEFAULT NULL,
    p_gym_id UUID DEFAULT NULL
) RETURNS DECIMAL 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    final_score DECIMAL := 0;
    user_city TEXT;
    entity_city TEXT;
    
    -- User Preferences
    pref_specs TEXT[];
    pref_facilities TEXT[];
    pref_budget_max DECIMAL;
    
    -- Entity Data
    ent_price DECIMAL;
    ent_tags TEXT[];
    
    common_tags INTEGER := 0;
BEGIN
    -- 1. Get User Data
    SELECT city INTO user_city FROM public.profiles WHERE id = p_user_id;
    
    SELECT 
        preferred_trainer_specializations, 
        preferred_gym_facilities,
        budget_max
    INTO pref_specs, pref_facilities, pref_budget_max
    FROM public.matching_preferences 
    WHERE user_id = p_user_id;

    -- 2. TRAINER MATCHING
    IF p_trainer_id IS NOT NULL THEN
        -- Get Trainer Data
        SELECT 
            p.city, 
            t.personal_rate_per_hour,
            t.specializations
        INTO entity_city, ent_price, ent_tags
        FROM public.trainer_profiles t
        JOIN public.profiles p ON p.id = t.id
        WHERE t.id = p_trainer_id;

        -- City Match (+30)
        IF user_city IS NOT NULL AND entity_city ILIKE user_city THEN
            final_score := final_score + 30;
        END IF;

        -- Budget Match (+30)
        IF pref_budget_max IS NOT NULL AND ent_price IS NOT NULL THEN
            IF ent_price <= pref_budget_max THEN
                final_score := final_score + 30;
            ELSE
                -- Penalize slightly if over budget but not fully exclude (soft matching)
                 final_score := final_score + GREATEST(0, 30 - ((ent_price - pref_budget_max) / 2));
            END IF;
        ELSE
            -- Neutral if no budget set
            final_score := final_score + 15;
        END IF;

        -- Specialization Match (+40 max)
        IF pref_specs IS NOT NULL AND ent_tags IS NOT NULL THEN
            -- Calculate array intersection count
            SELECT COUNT(*) INTO common_tags
            FROM (
                SELECT unnest(pref_specs)
                INTERSECT
                SELECT unnest(ent_tags)
            ) as intersection;
            
            -- 10 points per match, up to 40
            final_score := final_score + LEAST(40, common_tags * 10);
        END IF;

    -- 3. GYM MATCHING
    ELSIF p_gym_id IS NOT NULL THEN
        -- Get Gym Data
        SELECT 
            p.city, 
            g.monthly_fee,
            g.facilities
        INTO entity_city, ent_price, ent_tags
        FROM public.gym_profiles g
        JOIN public.profiles p ON p.id = g.id
        WHERE g.id = p_gym_id;

        -- City Match (+30)
        IF user_city IS NOT NULL AND entity_city ILIKE user_city THEN
            final_score := final_score + 30;
        END IF;

         -- Budget Match (+30)
        IF pref_budget_max IS NOT NULL AND ent_price IS NOT NULL THEN
            IF ent_price <= pref_budget_max THEN
                final_score := final_score + 30;
            END IF;
        ELSE
             final_score := final_score + 15;
        END IF;

        -- Facility Match (+40 max)
        IF pref_facilities IS NOT NULL AND ent_tags IS NOT NULL THEN
             SELECT COUNT(*) INTO common_tags
            FROM (
                SELECT unnest(pref_facilities)
                INTERSECT
                SELECT unnest(ent_tags)
            ) as intersection;
            
            final_score := final_score + LEAST(40, common_tags * 10);
        END IF;

    END IF;

    -- Cap score at 100
    IF final_score > 100 THEN final_score := 100; END IF;
    
    RETURN final_score;
END;
$$;
