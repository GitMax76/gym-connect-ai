
-- Create matching_preferences table for user preferences
CREATE TABLE public.matching_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferred_trainer_specializations TEXT[],
  preferred_gym_facilities TEXT[],
  max_distance_km INTEGER DEFAULT 10,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  preferred_times JSONB, -- {"monday": ["09:00", "18:00"], "tuesday": [...]}
  workout_frequency_per_week INTEGER,
  group_vs_personal TEXT CHECK (group_vs_personal IN ('personal', 'group', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Create match_scores table to store calculated matches
CREATE TABLE public.match_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB, -- Store breakdown of scoring factors
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CHECK ((trainer_id IS NOT NULL AND gym_id IS NULL) OR (trainer_id IS NULL AND gym_id IS NOT NULL))
);

-- Create search_filters table for advanced search
CREATE TABLE public.search_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  filter_name TEXT NOT NULL,
  filter_type TEXT CHECK (filter_type IN ('trainer', 'gym')) NOT NULL,
  filters JSONB NOT NULL, -- Store all filter criteria
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, filter_name)
);

-- Enable RLS for new tables
ALTER TABLE public.matching_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_filters ENABLE ROW LEVEL SECURITY;

-- RLS policies for matching_preferences
CREATE POLICY "Users can manage their matching preferences" 
  ON public.matching_preferences FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for match_scores
CREATE POLICY "Users can view their match scores" 
  ON public.match_scores FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert match scores" 
  ON public.match_scores FOR INSERT 
  WITH CHECK (true);

-- RLS policies for search_filters
CREATE POLICY "Users can manage their search filters" 
  ON public.search_filters FOR ALL 
  USING (auth.uid() = user_id);

-- Create function to calculate match scores
CREATE OR REPLACE FUNCTION calculate_match_score(
  p_user_id UUID,
  p_trainer_id UUID DEFAULT NULL,
  p_gym_id UUID DEFAULT NULL
) RETURNS DECIMAL AS $$
DECLARE
  base_score DECIMAL := 50.0;
  final_score DECIMAL := 50.0;
BEGIN
  -- Basic implementation - can be enhanced with more sophisticated ML algorithms
  -- This is a placeholder that returns a random score for demo purposes
  final_score := base_score + (RANDOM() * 50);
  
  -- Ensure score is within bounds
  IF final_score > 100 THEN final_score := 100; END IF;
  IF final_score < 0 THEN final_score := 0; END IF;
  
  RETURN final_score;
END;
$$ LANGUAGE plpgsql;
