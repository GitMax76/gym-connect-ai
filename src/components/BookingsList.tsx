
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar, Clock, User } from 'lucide-react';

const BookingsList = () => {
  const { bookings, loading, updateBookingStatus } = useBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confermata';
      case 'pending':
        return 'In attesa';
      case 'cancelled':
        return 'Cancellata';
      case 'completed':
        return 'Completata';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento prenotazioni...</div>;
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Nessuna prenotazione trovata</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                Sessione {booking.session_type === 'personal' ? 'Personale' : 'di Gruppo'}
              </CardTitle>
              <Badge className={getStatusColor(booking.status)}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {booking.trainer?.profiles?.first_name} {booking.trainer?.profiles?.last_name}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {format(new Date(booking.booking_date), 'dd MMMM yyyy', { locale: it })}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {booking.start_time} - {booking.end_time}
                </span>
              </div>
            </div>

            {booking.notes && (
              <div className="text-sm text-gray-600">
                <strong>Note:</strong> {booking.notes}
              </div>
            )}

            {booking.price && (
              <div className="text-sm font-semibold">
                Prezzo: €{booking.price}
              </div>
            )}

            {booking.status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  variant="outline"
                >
                  Cancella
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsList;
