
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBookings } from '@/hooks/useBookings';
import { useTrainerAvailability } from '@/hooks/useTrainerAvailability';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';
import SlotPicker from './SlotPicker';
import { supabase } from '@/integrations/supabase/client';

interface BookingFormProps {
  trainerId: string;
  trainerName: string;
  onSuccess?: () => void;
}

const BookingForm = ({ trainerId, trainerName, onSuccess }: BookingFormProps) => {
  const { createBooking } = useBookings();
  const { checkAvailability } = useTrainerAvailability();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  // Fetch Trainer rates for price calculation
  React.useEffect(() => {
    const fetchRates = async () => {
      const { data } = await supabase
        .from('trainer_profiles')
        .select('personal_rate_per_hour, group_rate_per_hour')
        .eq('id', trainerId)
        .single();

      if (data) {
        // Calculate initial price based on default session type 'personal'
        setPrice(data.personal_rate_per_hour || 0);
      }
    };
    fetchRates();
  }, [trainerId]);

  const [formData, setFormData] = useState({
    booking_date: '',
    start_time: '',
    end_time: '',
    session_type: 'personal' as 'personal' | 'group',
    notes: ''
  });

  // ... inside BookingForm component
  const { wallet, processPayment, refreshWallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!price) {
        toast.error("Impossibile determinare il prezzo");
        setLoading(false);
        return;
      }

      // 1. Check Wallet Balance
      if (!wallet || wallet.balance < price) {
        toast.error(`Credito insufficiente. Hai ${wallet?.balance || 0} crediti, necessari: ${price}`);
        setLoading(false);
        return;
      }

      // Basic validation
      if (!formData.booking_date || !formData.start_time || !formData.end_time) {
        toast.error("Seleziona data e orario");
        setLoading(false);
        return;
      }

      // Check Availability
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

      // 2. Create Booking (Pending Payment)
      const { data: bookingData, error: bookingError } = await createBooking({
        trainer_id: trainerId,
        user_id: '', // Hook handles this
        ...formData,
        price: price || 0,
        status: 'pending'
      });

      if (bookingError || !bookingData) {
        toast.error('Errore creazione prenotazione');
        setLoading(false);
        return;
      }

      // 3. Process Payment (Atomic Transfer)
      const paymentResult = await processPayment(trainerId, price, bookingData.id) as { success: boolean; error?: string };

      if (paymentResult?.success) {
        // 4. Update Booking to Confirmed
        const { error: confirmError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingData.id);

        if (confirmError) {
          console.error("Payment success but status update failed", confirmError);
          toast.warning("Pagamento riuscito ma stato non aggiornato. Contatta il supporto.");
        } else {
          toast.success('Prenotazione Confermata! Crediti scalati.');
          refreshWallet(); // Update UI
          setFormData({
            booking_date: '',
            start_time: '',
            end_time: '',
            session_type: 'personal',
            notes: ''
          });
          onSuccess?.();
        }
      } else {
        // Payment Failed -> Cancel Booking
        await supabase
          .from('bookings')
          .delete()
          .eq('id', bookingData.id);

        toast.error(`Pagamento fallito: ${paymentResult?.error || 'Errore sconosciuto'}`);
      }

    } catch (error) {
      console.error(error);
      toast.error('Errore critico durante la prenotazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Wallet Balance Display */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">Il tuo Saldo:</span>
        <span className={`font-bold ${wallet && price && wallet.balance >= price ? 'text-green-600' : 'text-red-500'}`}>
          {wallet?.balance || 0} Credits
        </span>
      </div>

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
        {price !== null && (
          <p className="text-sm text-muted-foreground text-right mt-1">
            Prezzo stimato: <span className="font-semibold text-green-600">{price} FC</span>
          </p>
        )}
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
