
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTrainerAvailability } from '@/hooks/useTrainerAvailability';

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
}

export const useAvailableSlots = () => {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { checkAvailability } = useTrainerAvailability();

  const getAvailableSlots = async (trainerId: string, dateRange: { start: Date; end: Date }) => {
    setLoading(true);
    try {
      // Get trainer's availability schedule
      const { data: availability, error } = await supabase
        .from('trainer_availability')
        .select('*')
        .eq('trainer_id', trainerId)
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching trainer availability:', error);
        return;
      }

      // Get existing bookings for the trainer in the date range
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('booking_date, start_time, end_time')
        .eq('trainer_id', trainerId)
        .in('status', ['confirmed', 'pending'])
        .gte('booking_date', dateRange.start.toISOString().split('T')[0])
        .lte('booking_date', dateRange.end.toISOString().split('T')[0]);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        return;
      }

      const slots: AvailableSlot[] = [];
      const current = new Date(dateRange.start);

      // Generate slots for each day in the range
      while (current <= dateRange.end) {
        const dayOfWeek = current.getDay();
        const dateStr = current.toISOString().split('T')[0];

        // Find availability for this day of week
        const dayAvailability = availability?.filter(a => a.day_of_week === dayOfWeek) || [];

        // Check each availability slot
        for (const avail of dayAvailability) {
          const startTime = avail.start_time;
          const endTime = avail.end_time;

          // Generate 1-hour slots within the availability window
          const slotStart = new Date(`${dateStr}T${startTime}`);
          const slotEnd = new Date(`${dateStr}T${endTime}`);

          while (slotStart < slotEnd) {
            const slotEndTime = new Date(slotStart.getTime() + 60 * 60 * 1000); // 1 hour later
            
            if (slotEndTime <= slotEnd) {
              // Check if this slot conflicts with existing bookings
              const hasConflict = bookings?.some(booking => {
                if (booking.booking_date !== dateStr) return false;
                
                const bookingStart = new Date(`${dateStr}T${booking.start_time}`);
                const bookingEnd = new Date(`${dateStr}T${booking.end_time}`);
                
                return (slotStart < bookingEnd && slotEndTime > bookingStart);
              });

              if (!hasConflict) {
                slots.push({
                  date: dateStr,
                  startTime: slotStart.toTimeString().slice(0, 5),
                  endTime: slotEndTime.toTimeString().slice(0, 5),
                  dayOfWeek
                });
              }
            }
            
            slotStart.setTime(slotStart.getTime() + 60 * 60 * 1000); // Move to next hour
          }
        }

        current.setDate(current.getDate() + 1);
      }

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error generating available slots:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    availableSlots,
    loading,
    getAvailableSlots
  };
};
