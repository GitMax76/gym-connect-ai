
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { AvailableSlot } from '@/hooks/useAvailableSlots';

interface SlotSelectorProps {
  slots: AvailableSlot[];
  selectedSlot?: AvailableSlot;
  onSlotSelect: (slot: AvailableSlot) => void;
  loading?: boolean;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({
  slots,
  selectedSlot,
  onSlotSelect,
  loading = false
}) => {
  const getDayName = (dayOfWeek: number) => {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    return days[dayOfWeek];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long'
    });
  };

  // Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, AvailableSlot[]>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Caricamento slot disponibili...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (slots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Slot disponibili
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Nessuno slot disponibile nel periodo selezionato
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Seleziona uno slot disponibile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedSlots).map(([date, daySlots]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getDayName(daySlots[0].dayOfWeek)} {formatDate(date)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {daySlots.map((slot, index) => {
                const isSelected = selectedSlot?.date === slot.date && 
                                 selectedSlot?.startTime === slot.startTime;
                
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSlotSelect(slot)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Clock className="w-3 h-3" />
                    {slot.startTime} - {slot.endTime}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SlotSelector;
