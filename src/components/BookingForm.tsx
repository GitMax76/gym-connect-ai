
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBookings } from '@/hooks/useBookings';
import { useTrainerAvailability } from '@/hooks/useTrainerAvailability';
import { toast } from 'sonner';

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
      // Check availability first
      const isAvailable = await checkAvailability(
        trainerId,
        formData.booking_date,
        formData.start_time,
        formData.end_time
      );

      if (!isAvailable) {
        toast.error('Il trainer non è disponibile in questo orario');
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
          onChange={(e) => setFormData(prev => ({ ...prev, booking_date: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Ora inizio</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">Ora fine</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
            required
          />
        </div>
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

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Prenotazione in corso...' : 'Prenota Sessione'}
      </Button>
    </form>
  );
};

export default BookingForm;
