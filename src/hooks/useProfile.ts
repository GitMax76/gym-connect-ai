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
  opening_hours_map?: any;
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

  const updateProfile = async (updates: Partial<Profile>, userId?: string) => {
    const targetId = userId || user?.id;
    if (!targetId) return { error: 'No user logged in or provided' };

    try {
      // Use type assertion to allow optional user_type since the trigger handles defaults
      const upsertData = {
        id: targetId,
        ...updates,
        updated_at: new Date().toISOString()
      } as any;

      const { error } = await supabase
        .from('profiles')
        .upsert(upsertData);

      if (!error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      return { error };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const createUserProfile = async (data: Partial<UserProfile>, userId?: string) => {
    const targetId = userId || user?.id;
    if (!targetId) return { error: 'No user logged in or provided' };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ id: targetId, ...data });

      if (!error) {
        await fetchProfile();
      }

      return { error };
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      return { error };
    }
  };

  const createTrainerProfile = async (data: Partial<TrainerProfile>, userId?: string) => {
    const targetId = userId || user?.id;
    if (!targetId) return { error: 'No user logged in or provided' };

    try {
      const { error } = await supabase
        .from('trainer_profiles')
        .upsert({ id: targetId, ...data });

      if (!error) {
        await fetchProfile();
      }

      return { error };
    } catch (error: any) {
      console.error('Error creating trainer profile:', error);
      return { error };
    }
  };

  const createGymProfile = async (data: { gym_name: string } & Partial<Omit<GymProfile, 'id' | 'gym_name'>>, userId?: string) => {
    const targetId = userId || user?.id;
    console.log('createGymProfile called with targetId:', targetId);
    console.log('createGymProfile data:', data);

    if (!targetId) {
      console.error('createGymProfile: No user ID available');
      return { error: 'No user logged in or provided' };
    }

    try {
      // Use RPC to create profile - ensuring we pass opening_hours_map
      const rpcParams = {
        p_user_id: targetId,
        p_gym_name: data.gym_name,
        p_business_email: data.business_email || null,
        p_address: data.address || null,
        p_city: data.city || null,
        p_postal_code: data.postal_code || null,
        p_description: data.description || null,
        p_facilities: data.facilities || null,
        p_specializations: data.specializations || null,
        p_opening_days: data.opening_days || null,
        p_opening_hours: data.opening_hours || null,
        p_closing_hours: data.closing_hours || null,
        p_member_capacity: data.member_capacity || null,
        p_subscription_plans: data.subscription_plans || null,
        p_monthly_fee: data.monthly_fee || null,
        p_day_pass_fee: data.day_pass_fee || null,
        p_website_url: data.website_url || null,
        p_social_media: data.social_media || null,
        p_opening_hours_map: data.opening_hours_map || null
      };

      console.log('Calling manage_gym_profile RPC with:', rpcParams);

      const { data: result, error } = await (supabase.rpc as any)('manage_gym_profile', rpcParams);

      console.log('RPC result:', { result, error: error?.message });

      if (error) {
        console.error('Error creating gym profile via RPC:', error);
        return { error: error.message || error };
      }

      if (result) {
        setGymProfile(result as unknown as GymProfile);
      }

      return { error: null, data: result };
    } catch (error: any) {
      console.error('Error creating gym profile (exception):', error);
      return { error: error.message || error };
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
    console.log('updateGymProfile called with updates:', updates);
    console.log('Current gymProfile state:', gymProfile);

    if (!user) {
      console.error('updateGymProfile: No user logged in');
      return { error: 'No user logged in' };
    }

    try {
      const merged = { ...gymProfile, ...updates };
      console.log('Merged profile data:', merged);

      const rpcParams = {
        p_user_id: user.id,
        p_gym_name: merged.gym_name || '',
        p_business_email: merged.business_email,
        p_address: merged.address,
        p_city: merged.city,
        p_postal_code: merged.postal_code,
        p_description: merged.description,
        p_facilities: merged.facilities,
        p_specializations: merged.specializations,
        p_opening_days: merged.opening_days,
        p_opening_hours: merged.opening_hours,
        p_closing_hours: merged.closing_hours,
        p_member_capacity: merged.member_capacity,
        p_subscription_plans: merged.subscription_plans,
        p_monthly_fee: merged.monthly_fee,
        p_day_pass_fee: merged.day_pass_fee,
        p_website_url: merged.website_url,
        p_social_media: merged.social_media
      };
      console.log('Calling RPC manage_gym_profile for update with params:', rpcParams);

      // Type assertion needed because manage_gym_profile RPC isn't in generated types yet
      const { data, error } = await (supabase.rpc as any)('manage_gym_profile', rpcParams);

      console.log('RPC update result:', { data, error: error?.message });

      if (error) throw error;

      const updatedProfile = data as unknown as GymProfile;
      console.log('Setting gymProfile state to:', updatedProfile);
      setGymProfile(updatedProfile);
      return { data: updatedProfile, error: null };

    } catch (error: any) {
      console.error('Error updating gym profile (exception):', error);
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
