
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBookings } from '@/hooks/useBookings';
import { useTrainerAvailability } from '@/hooks/useTrainerAvailability';
import { toast } from 'sonner';
import SlotPicker from './SlotPicker';

interface BookingFormProps {
  trainerId: string;
  trainerName: string;
  onSuccess?: () => void;
}

const BookingForm = ({ trainerId, trainerName, onSuccess }: BookingFormProps) => {
  const { createBooking } = useBookings();
  const { checkAvailability } = useTrainerAvailability();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    booking_date: '',
    start_time: '',
    end_time: '',
    session_type: 'personal' as 'personal' | 'group',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.booking_date || !formData.start_time || !formData.end_time) {
        toast.error("Seleziona data e orario");
        setLoading(false);
        return;
      }

      // We skip checkAvailability here if we assume SlotPicker only shows available slots,
      // but keeping it for safety is fine.
      const isAvailable = await checkAvailability(
        trainerId,
        formData.booking_date,
        formData.start_time,
        formData.end_time
      );

      if (!isAvailable) {
        toast.error('Il trainer non è disponibile in questo orario (verificato)');
        setLoading(false);
        return;
      }

      const { error } = await createBooking({
        trainer_id: trainerId,
        user_id: '', // Will be set by the hook
        ...formData,
        status: 'pending'
      });

      if (error) {
        toast.error('Errore durante la prenotazione');
      } else {
        toast.success('Prenotazione creata con successo!');
        setFormData({
          booking_date: '',
          start_time: '',
          end_time: '',
          session_type: 'personal',
          notes: ''
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
      toast.error('Errore durante la prenotazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trainer">Trainer</Label>
        <Input value={trainerName} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking_date">Data</Label>
        <Input
          id="booking_date"
          type="date"
          value={formData.booking_date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setFormData(prev => ({ ...prev, booking_date: e.target.value, start_time: '', end_time: '' }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Orario (Durata: 1 ora)</Label>
        <SlotPicker
          trainerId={trainerId}
          date={formData.booking_date ? new Date(formData.booking_date) : undefined}
          onSelectSlot={(start, end) => setFormData(prev => ({ ...prev, start_time: start, end_time: end }))}
        />
        {formData.start_time && (
          <p className="text-sm text-green-600 mt-1 font-medium bg-green-50 p-2 rounded border border-green-200 inline-block">
            Selezionato: {formData.start_time} - {formData.end_time}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="session_type">Tipo sessione</Label>
        <Select
          value={formData.session_type}
          onValueChange={(value: 'personal' | 'group') =>
            setFormData(prev => ({ ...prev, session_type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personale</SelectItem>
            <SelectItem value="group">Gruppo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Note (opzionale)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Aggiungi eventuali note per il trainer..."
        />
      </div>

      <Button type="submit" disabled={loading || !formData.start_time} className="w-full bg-green-600 hover:bg-green-700">
        {loading ? 'Prenotazione in corso...' : 'Prenota Sessione'}
      </Button>
    </form>
  );
};

export default BookingForm;
