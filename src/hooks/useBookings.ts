
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  user_id: string;
  trainer_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  session_type: 'personal' | 'group';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`user_id.eq.${user.id},trainer_id.eq.${user.id}`)
        .order('booking_date', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id
        });

      if (!error) {
        await fetchUserBookings();
      }

      return { error };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      return { error };
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (!error) {
        await fetchUserBookings();
      }

      return { error };
    } catch (error: any) {
      console.error('Error updating booking:', error);
      return { error };
    }
  };

  return {
    bookings,
    loading,
    fetchUserBookings,
    createBooking,
    updateBookingStatus
  };
};
