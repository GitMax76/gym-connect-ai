
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TrainerAvailability {
  id: string;
  trainer_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export const useTrainerAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<TrainerAvailability[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async (trainerId?: string) => {
    const targetTrainerId = trainerId || user?.id;
    if (!targetTrainerId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trainer_availability')
        .select('*')
        .eq('trainer_id', targetTrainerId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching availability:', error);
        return;
      }

      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const setAvailabilitySlot = async (availabilityData: Omit<TrainerAvailability, 'id' | 'created_at'>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('trainer_availability')
        .upsert({
          ...availabilityData,
          trainer_id: user.id
        });

      if (!error) {
        await fetchAvailability();
      }

      return { error };
    } catch (error: any) {
      console.error('Error setting availability:', error);
      return { error };
    }
  };

  const checkAvailability = async (trainerId: string, date: string, startTime: string, endTime: string) => {
    try {
      const { data, error } = await supabase
        .rpc('check_trainer_availability', {
          p_trainer_id: trainerId,
          p_date: date,
          p_start_time: startTime,
          p_end_time: endTime
        });

      if (error) {
        console.error('Error checking availability:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  return {
    availability,
    loading,
    fetchAvailability,
    setAvailabilitySlot,
    checkAvailability
  };
};
