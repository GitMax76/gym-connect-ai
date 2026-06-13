
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { Calendar, Clock, User, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ReviewDialog from './ReviewDialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingsListProps {
  filterStatus?: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const BookingsList = ({ filterStatus = 'all' }: BookingsListProps) => {
  const { bookings, loading, updateBookingStatus } = useBookings();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const dateLocale = language === 'IT' ? it : enUS;

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      case 'completed': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return t('bookings.status.confirmed');
      case 'pending': return t('bookings.status.pending');
      case 'cancelled': return t('bookings.status.cancelled');
      case 'completed': return t('bookings.status.completed');
      default: return status;
    }
  };

  const handleAction = async (id: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    const { error } = await updateBookingStatus(id, newStatus);
    if (error) {
      toast.error(t('bookings.toast.error_status'));
    } else {
      const messages = {
        confirmed: t('bookings.toast.confirmed'),
        cancelled: t('bookings.toast.cancelled'),
        completed: t('bookings.toast.completed')
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

  if (loading) return <div className="text-center py-12 text-slate-400 text-sm font-medium">{t('bookings.loading')}</div>;

  if (filteredBookings.length === 0) {
    return (
      <Card className="border-dashed border-slate-200 shadow-none">
        <CardContent className="text-center py-16">
          <p className="text-slate-400 text-sm font-medium">{t('bookings.empty')}</p>
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
          <Card key={booking.id} className="overflow-hidden border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  {booking.session_type === 'personal' ? t('bookings.session.personal') : t('bookings.session.group')}
                </CardTitle>
                <Badge variant="outline" className={`${getStatusColor(booking.status)} font-medium rounded-full px-2.5 py-0.5 border text-xs`}>
                  {getStatusText(booking.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <User className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-slate-700">{otherPartyName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium text-slate-600">{format(new Date(booking.booking_date), 'd MMMM yyyy', { locale: dateLocale })}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium text-slate-600">{booking.start_time} - {booking.end_time}</span>
                </div>
              </div>

              {booking.notes && (
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-md text-sm text-slate-600 italic">
                  "{booking.notes}"
                </div>
              )}

              {/* Actions Area */}
              <div className="flex gap-2 justify-end pt-3 border-t mt-2 flex-wrap">
                {booking.status === 'pending' && (
                  isTrainer ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-all active:scale-95 text-xs font-medium"
                        onClick={() => handleAction(booking.id, 'cancelled')}
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> {t('bookings.action.decline')}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95 text-xs font-medium border-0 shadow-md shadow-indigo-100"
                        onClick={() => handleAction(booking.id, 'confirmed')}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> {t('bookings.action.confirm')}
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95 text-xs font-medium"
                      onClick={() => handleAction(booking.id, 'cancelled')}
                    >
                      {t('bookings.action.cancel_request')}
                    </Button>
                  )
                )}

                {canComplete(booking) && (
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95 text-xs font-medium border-0 shadow-md shadow-indigo-100"
                    onClick={() => handleAction(booking.id, 'completed')}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" /> {t('bookings.action.complete')}
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
