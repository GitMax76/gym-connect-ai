
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar, Clock, User, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ReviewDialog from './ReviewDialog';

interface BookingsListProps {
  filterStatus?: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const BookingsList = ({ filterStatus = 'all' }: BookingsListProps) => {
  const { bookings, loading, updateBookingStatus } = useBookings();
  const { user } = useAuth();

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confermata';
      case 'pending': return 'In attesa';
      case 'cancelled': return 'Cancellata';
      case 'completed': return 'Completata';
      default: return status;
    }
  };

  const handleAction = async (id: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    const { error } = await updateBookingStatus(id, newStatus);
    if (error) {
      toast.error("Errore nell'aggiornamento dello stato");
    } else {
      const messages = {
        confirmed: 'Prenotazione confermata',
        cancelled: 'Prenotazione cancellata',
        completed: 'Prenotazione segnata come completata'
      };
      toast.success(messages[newStatus]);
    }
  };

  // Check if a confirmed booking is in the past (eligible for completion)
  const canComplete = (booking: any) => {
    if (booking.status !== 'confirmed') return false;
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.end_time}`);
    const now = new Date();
    return now > bookingDateTime;
  };

  // Check availability of review (>= 4 completed bookings with this counterpart)
  const canReview = (booking: any) => {
    if (booking.status !== 'completed') return false;

    // Find bookings with same counterpart
    const isTrainer = user?.id === booking.trainer_id;
    const counterpartId = isTrainer ? booking.user_id : booking.trainer_id;

    const completedCount = bookings.filter(b =>
      b.status === 'completed' &&
      (isTrainer ? b.user_id === counterpartId : b.trainer_id === counterpartId)
    ).length;

    return completedCount >= 4;
  };

  if (loading) return <div className="text-center py-8">Caricamento prenotazioni...</div>;

  if (filteredBookings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Nessuna prenotazione trovata in questa sezione.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredBookings.map((booking) => {
        const isTrainer = user?.id === booking.trainer_id;
        const otherPartyName = isTrainer
          ? `${booking.client?.first_name || 'Utente'} ${booking.client?.last_name || ''}`
          : `${booking.trainer?.profiles?.first_name || 'Trainer'} ${booking.trainer?.profiles?.last_name || ''}`;

        return (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50/50 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  {booking.session_type === 'personal' ? 'Personal Training' : 'Sessione di Gruppo'}
                </CardTitle>
                <Badge variant="outline" className={getStatusColor(booking.status)}>
                  {getStatusText(booking.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-slate-900">{otherPartyName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(booking.booking_date), 'd MMMM yyyy', { locale: it })}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>{booking.start_time} - {booking.end_time}</span>
                </div>
              </div>

              {booking.notes && (
                <div className="bg-slate-50 p-3 rounded-md text-sm text-slate-600 italic">
                  "{booking.notes}"
                </div>
              )}

              {/* Actions Area */}
              <div className="flex gap-2 justify-end pt-2 border-t mt-2 flex-wrap">
                {booking.status === 'pending' && (
                  isTrainer ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleAction(booking.id, 'cancelled')}
                      >
                        <X className="h-4 w-4 mr-1" /> Rifiuta
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAction(booking.id, 'confirmed')}
                      >
                        <Check className="h-4 w-4 mr-1" /> Conferma
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleAction(booking.id, 'cancelled')}
                    >
                      Cancella Richiesta
                    </Button>
                  )
                )}

                {canComplete(booking) && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleAction(booking.id, 'completed')}
                  >
                    <Check className="h-4 w-4 mr-1" /> Segna come Completata
                  </Button>
                )}

                {canReview(booking) && (
                  <ReviewDialog
                    bookingId={booking.id}
                    targetId={isTrainer ? booking.user_id : booking.trainer_id}
                    targetName={otherPartyName}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BookingsList;
