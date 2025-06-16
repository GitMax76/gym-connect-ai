
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
  created_at: string;
  updated_at: string;
  trainer?: {
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trainer:trainer_profiles!trainer_id (
            profiles!id (first_name, last_name)
          )
        `)
        .order('booking_date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      // Type assertion to ensure proper typing
      const typedBookings = (data || []).map(booking => ({
        ...booking,
        session_type: booking.session_type as 'personal' | 'group',
        status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed'
      }));

      setBookings(typedBookings);
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
        await fetchBookings();
      }

      return { error };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      return { error };
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (!error) {
        await fetchBookings();
      }

      return { error };
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  return {
    bookings,
    loading,
    createBooking,
    updateBookingStatus,
    refetch: fetchBookings
  };
};
