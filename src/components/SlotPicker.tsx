
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { format, addHours, parse, isBefore, startOfDay, getDay } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface SlotPickerProps {
    trainerId: string;
    date: Date | undefined;
    onSelectSlot: (start: string, end: string) => void;
}

interface TimeSlot {
    start: string;
    end: string;
    available: boolean;
}

const SlotPicker = ({ trainerId, date, onSelectSlot }: SlotPickerProps) => {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    useEffect(() => {
        if (trainerId && date) {
            fetchSlots();
        } else {
            setSlots([]);
        }
    }, [trainerId, date]);

    const fetchSlots = async () => {
        if (!date) return;
        setLoading(true);
        try {
            // 1. Get Day of Week (0-6)
            const dayOfWeek = date.getDay(); // 0 is Sunday

            // 2. Fetch Trainer Availability for this day
            const { data: availabilityData, error: availError } = await supabase
                .from('trainer_availability')
                .select('*')
                .eq('trainer_id', trainerId)
                .eq('day_of_week', dayOfWeek)
                .single();

            if (availError && availError.code !== 'PGRST116') {
                console.error('Error fetching availability:', availError);
            }

            // Default fallback if no availability set: Not Available or Default (e.g. 9-18)?
            // Better to assume Not Available if not set, or prompt trainer to set it.
            // For now, if no record, we assume NO availability.
            if (!availabilityData || !availabilityData.is_available) {
                setSlots([]);
                setLoading(false);
                return;
            }

            // 3. Fetch Existing Bookings for this date
            const dateStr = format(date, 'yyyy-MM-dd');
            const { data: bookingsData } = await supabase
                .from('bookings')
                .select('start_time, end_time')
                .eq('trainer_id', trainerId)
                .eq('booking_date', dateStr)
                .neq('status', 'cancelled');

            // 4. Generate Slots
            const startHour = parseInt(availabilityData.start_time.split(':')[0]);
            const endHour = parseInt(availabilityData.end_time.split(':')[0]);

            const generatedSlots: TimeSlot[] = [];

            for (let hour = startHour; hour < endHour; hour++) {
                const slotStart = `${hour.toString().padStart(2, '0')}:00`;
                const slotEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;

                // Check if booked
                const isBooked = bookingsData?.some(booking => {
                    // Simple overlap check for 1-hour slots matching booking times exactly or partially
                    // Assuming bookings are also 1 hour or respect same grid? 
                    // Let's do a time comparison (string comparison works for HH:MM format properly)
                    return (booking.start_time < slotEnd && booking.end_time > slotStart);
                });

                generatedSlots.push({
                    start: slotStart,
                    end: slotEnd,
                    available: !isBooked
                });
            }

            setSlots(generatedSlots);

        } catch (error) {
            console.error('Error calculating slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = (slot: TimeSlot) => {
        if (!slot.available) return;
        setSelectedSlot(slot.start);
        onSelectSlot(slot.start, slot.end);
    };

    if (!date) return <div className="text-sm text-slate-500">Seleziona una data per vedere gli orari.</div>;

    if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin h-5 w-5 text-blue-500" /></div>;

    if (slots.length === 0) return <div className="text-sm text-slate-500 p-2">Nessuna disponibilità per questa data.</div>;

    return (
        <div className="grid grid-cols-3 gap-2 mt-2 max-h-[200px] overflow-y-auto">
            {slots.map((slot) => (
                <Button
                    key={slot.start}
                    type="button"
                    variant={selectedSlot === slot.start ? "default" : "outline"}
                    className={`text-xs ${!slot.available ? 'opacity-50 cursor-not-allowed bg-slate-100 placeholder:text-slate-400' : ''}`}
                    disabled={!slot.available}
                    onClick={() => handleSlotClick(slot)}
                >
                    {slot.start}
                </Button>
            ))}
        </div>
    );
};

export default SlotPicker;
