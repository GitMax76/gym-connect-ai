import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_type: 'user' | 'trainer' | 'gym_owner';
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  city?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  age?: number;
  weight?: number;
  height?: number;
  fitness_level?: string;
  primary_goal?: string;
  secondary_goals?: string[];
  availability_hours_per_week?: number;
  budget_min?: number;
  budget_max?: number;
  preferred_location?: string;
  health_conditions?: string;
  experience_description?: string;
}

export interface TrainerProfile {
  id: string;
  date_of_birth?: string;
  bio?: string;
  certifications?: string[];
  specializations?: string[];
  years_experience?: number;
  languages?: string[];
  personal_rate_per_hour?: number;
  group_rate_per_hour?: number;
  preferred_areas?: string;
  availability_schedule?: any;
  is_verified?: boolean;
}

export interface GymProfile {
  id: string;
  gym_name: string; // Required field
  business_email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  description?: string;
  facilities?: string[];
  specializations?: string[];
  opening_days?: string[] | null;
  opening_hours?: string;
  closing_hours?: string;
  subscription_plans?: any[] | null;
  member_capacity?: number;
  monthly_fee?: number;
  day_pass_fee?: number;
  website_url?: string;
  social_media?: any;
  is_verified?: boolean;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(null);
  const [gymProfile, setGymProfile] = useState<GymProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setUserProfile(null);
      setTrainerProfile(null);
      setGymProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async (options: { silent?: boolean } = {}) => {
    if (!user) return;

    try {
      if (!options.silent) setLoading(true);
      console.log('Fetching profile for user:', user.id);

      // Fetch base profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      if (profileData) {
        setProfile(profileData as Profile);

        // Fetch specific profile based on user type
        if (profileData.user_type) {
          switch (profileData.user_type) {
            case 'user':
              const { data: userData } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();
              setUserProfile(userData as UserProfile);
              break;
            case 'trainer':
              const { data: trainerData } = await supabase
                .from('trainer_profiles')
                .select('*')
                .eq('id', user.id)
                .single();
              setTrainerProfile(trainerData as TrainerProfile);
              break;
            case 'gym_owner':
              const { data: gymData } = await supabase
                .from('gym_profiles')
                .select('*')
                .eq('id', user.id)
                .single();
              setGymProfile(gymData as GymProfile);
              break;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      if (!options.silent) setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      return { error };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const createUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ id: user.id, ...data });

      if (!error) {
        await fetchProfile();
      }

      return { error };
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      return { error };
    }
  };

  const createTrainerProfile = async (data: Partial<TrainerProfile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('trainer_profiles')
        .upsert({ id: user.id, ...data });

      if (!error) {
        await fetchProfile();
      }

      return { error };
    } catch (error: any) {
      console.error('Error creating trainer profile:', error);
      return { error };
    }
  };

  const createGymProfile = async (data: { gym_name: string } & Partial<Omit<GymProfile, 'id' | 'gym_name'>>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('gym_profiles')
        .upsert({ id: user.id, ...data });

      if (!error) {
        await fetchProfile();
      }

      return { error };
    } catch (error: any) {
      console.error('Error creating gym profile:', error);
      return { error };
    }
  };

  const updateTrainerProfile = async (updates: Partial<TrainerProfile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('trainer_profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        setTrainerProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      return { error };
    } catch (error: any) {
      console.error('Error updating trainer profile:', error);
      return { error };
    }
  };

  const updateGymProfile = async (updates: Partial<GymProfile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Create full profile object for upsert to ensure no data loss and satisfy insert constraints
      const fullProfile = {
        ...gymProfile,
        ...updates,
        id: user.id,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('gym_profiles')
        .upsert(fullProfile)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedProfile = data[0] as GymProfile;
        setGymProfile(updatedProfile);
        return { data: updatedProfile, error: null };
      } else {
        console.warn('Upsert succeeded but no row was returned.');
        return { data: null, error: { message: 'Salvataggio non riuscito (Nessun dato ritornato)' } };
      }
    } catch (error: any) {
      console.error('Error updating gym profile:', error);
      return { data: null, error };
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      return { error };
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return { error };
    }
  };

  return {
    profile,
    userProfile,
    trainerProfile,
    gymProfile,
    loading,
    updateProfile,
    createUserProfile,
    createTrainerProfile,
    createGymProfile,
    updateTrainerProfile,
    updateGymProfile,
    updateUserProfile,
    refetch: fetchProfile
  };
};
