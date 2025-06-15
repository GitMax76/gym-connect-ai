
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MatchingPreferences {
  id?: string;
  user_id: string;
  preferred_trainer_specializations?: string[];
  preferred_gym_facilities?: string[];
  max_distance_km?: number;
  budget_min?: number;
  budget_max?: number;
  preferred_times?: Record<string, string[]>;
  workout_frequency_per_week?: number;
  group_vs_personal?: 'personal' | 'group' | 'both';
}

export interface MatchResult {
  id: string;
  score: number;
  factors: any;
  profile: any;
  type: 'trainer' | 'gym';
}

export const useMatching = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<MatchingPreferences | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('matching_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data) {
        // Transform the data to match our interface
        const transformedData: MatchingPreferences = {
          id: data.id,
          user_id: data.user_id,
          preferred_trainer_specializations: data.preferred_trainer_specializations,
          preferred_gym_facilities: data.preferred_gym_facilities,
          max_distance_km: data.max_distance_km,
          budget_min: data.budget_min ? Number(data.budget_min) : undefined,
          budget_max: data.budget_max ? Number(data.budget_max) : undefined,
          preferred_times: data.preferred_times as Record<string, string[]> || {},
          workout_frequency_per_week: data.workout_frequency_per_week,
          group_vs_personal: data.group_vs_personal as 'personal' | 'group' | 'both'
        };
        setPreferences(transformedData);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: Partial<MatchingPreferences>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('matching_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        await fetchPreferences();
      }

      return { error };
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      return { error };
    }
  };

  const findMatches = async (type: 'trainer' | 'gym' = 'trainer') => {
    if (!user) return;

    setLoading(true);
    try {
      let query;
      
      if (type === 'trainer') {
        query = supabase
          .from('trainer_profiles')
          .select(`
            *,
            profiles(first_name, last_name, city, avatar_url)
          `);
      } else {
        query = supabase
          .from('gym_profiles')
          .select('*');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      // Calculate match scores for each result
      const matchResults: MatchResult[] = [];
      
      for (const item of data || []) {
        const score = await calculateMatchScore(user.id, type === 'trainer' ? item.id : null, type === 'gym' ? item.id : null);
        
        matchResults.push({
          id: item.id,
          score: score || 0,
          factors: {}, // TODO: implement detailed scoring factors
          profile: item,
          type
        });
      }

      // Sort by score (highest first)
      matchResults.sort((a, b) => b.score - a.score);
      setMatches(matchResults);

    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = async (userId: string, trainerId?: string, gymId?: string) => {
    try {
      const { data, error } = await supabase.rpc('calculate_match_score', {
        p_user_id: userId,
        p_trainer_id: trainerId,
        p_gym_id: gymId
      });

      if (error) {
        console.error('Error calculating match score:', error);
        return 0;
      }

      return data;
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 0;
    }
  };

  return {
    preferences,
    matches,
    loading,
    savePreferences,
    findMatches,
    refetchPreferences: fetchPreferences
  };
};
