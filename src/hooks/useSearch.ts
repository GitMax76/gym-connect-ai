
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SearchFilters {
  location?: string;
  specializations?: string[];
  priceMin?: number;
  priceMax?: number;
  sessionType?: 'personal' | 'group';
  searchType: 'trainers' | 'gyms';
}

export interface TrainerSearchResult {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
    city: string;
    avatar_url?: string;
  };
  bio?: string;
  specializations?: string[];
  years_experience?: number;
  personal_rate_per_hour?: number;
  group_rate_per_hour?: number;
  is_verified?: boolean;
  average_rating?: number;
  total_reviews?: number;
}

export interface GymSearchResult {
  id: string;
  gym_name: string;
  profile: {
    city: string;
  };
  address?: string;
  description?: string;
  specializations?: string[];
  facilities?: string[];
  monthly_fee?: number;
  day_pass_fee?: number;
  is_verified?: boolean;
  average_rating?: number;
  total_reviews?: number;
}

export const useSearch = () => {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<TrainerSearchResult[]>([]);
  const [gyms, setGyms] = useState<GymSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTrainers = async (filters: SearchFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('trainer_profiles')
        .select(`
          *,
          profile:profiles!id (first_name, last_name, city, avatar_url)
        `);

      // Apply filters
      if (filters.location) {
        query = query.ilike('profile.city', `%${filters.location}%`);
      }

      if (filters.specializations && filters.specializations.length > 0) {
        query = query.overlaps('specializations', filters.specializations);
      }

      if (filters.priceMin && filters.sessionType === 'personal') {
        query = query.gte('personal_rate_per_hour', filters.priceMin);
      }

      if (filters.priceMax && filters.sessionType === 'personal') {
        query = query.lte('personal_rate_per_hour', filters.priceMax);
      }

      if (filters.priceMin && filters.sessionType === 'group') {
        query = query.gte('group_rate_per_hour', filters.priceMin);
      }

      if (filters.priceMax && filters.sessionType === 'group') {
        query = query.lte('group_rate_per_hour', filters.priceMax);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching trainers:', error);
        return;
      }

      // Transform data to match our interface
      const transformedData: TrainerSearchResult[] = (data || []).map((trainer: any) => ({
        id: trainer.id,
        profile: trainer.profile,
        bio: trainer.bio,
        specializations: trainer.specializations,
        years_experience: trainer.years_experience,
        personal_rate_per_hour: trainer.personal_rate_per_hour,
        group_rate_per_hour: trainer.group_rate_per_hour,
        is_verified: trainer.is_verified,
        average_rating: 0, // TODO: Calculate from reviews
        total_reviews: 0 // TODO: Calculate from reviews
      }));

      setTrainers(transformedData);
    } catch (error) {
      console.error('Error searching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchGyms = async (filters: SearchFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('gym_profiles')
        .select(`
          *,
          profile:profiles!id (city)
        `);

      // Apply filters
      if (filters.location) {
        query = query.ilike('profile.city', `%${filters.location}%`);
      }

      if (filters.specializations && filters.specializations.length > 0) {
        query = query.overlaps('specializations', filters.specializations);
      }

      if (filters.priceMin) {
        query = query.gte('monthly_fee', filters.priceMin);
      }

      if (filters.priceMax) {
        query = query.lte('monthly_fee', filters.priceMax);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching gyms:', error);
        return;
      }

      // Transform data to match our interface
      const transformedData: GymSearchResult[] = (data || []).map((gym: any) => ({
        id: gym.id,
        gym_name: gym.gym_name,
        profile: gym.profile,
        address: gym.address,
        description: gym.description,
        specializations: gym.specializations,
        facilities: gym.facilities,
        monthly_fee: gym.monthly_fee,
        day_pass_fee: gym.day_pass_fee,
        is_verified: gym.is_verified,
        average_rating: 0, // TODO: Calculate from reviews
        total_reviews: 0 // TODO: Calculate from reviews
      }));

      setGyms(transformedData);
    } catch (error) {
      console.error('Error searching gyms:', error);
    } finally {
      setLoading(false);
    }
  };

  const search = async (filters: SearchFilters) => {
    if (filters.searchType === 'trainers') {
      await searchTrainers(filters);
    } else {
      await searchGyms(filters);
    }
  };

  return {
    trainers,
    gyms,
    loading,
    search,
    searchTrainers,
    searchGyms
  };
};
