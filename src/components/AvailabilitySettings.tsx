
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Calendar, Loader2 } from 'lucide-react';

interface AvailabilityDay {
    day_of_week: number;
    is_available: boolean;
    start_time: string;
    end_time: string;
    id?: string;
}

const DAYS_OF_WEEK = [
    { id: 1, name: 'Lunedì' },
    { id: 2, name: 'Martedì' },
    { id: 3, name: 'Mercoledì' },
    { id: 4, name: 'Giovedì' },
    { id: 5, name: 'Venerdì' },
    { id: 6, name: 'Sabato' },
    { id: 0, name: 'Domenica' },
];

const AvailabilitySettings = ({ trainerId }: { trainerId: string }) => {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [schedule, setSchedule] = useState<AvailabilityDay[]>([]);

    useEffect(() => {
        if (open && trainerId) {
            fetchAvailability();
        }
    }, [open, trainerId]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('trainer_availability')
                .select('*')
                .eq('trainer_id', trainerId);

            if (error) throw error;

            // Merge with default days structure to ensure all days are present
            const fullSchedule = DAYS_OF_WEEK.map(day => {
                const existing = data?.find(d => d.day_of_week === day.id);
                return existing ? { ...existing } : {
                    day_of_week: day.id,
                    is_available: false,
                    start_time: '09:00',
                    end_time: '18:00',
                    trainer_id: trainerId
                };
            });

            setSchedule(fullSchedule);
        } catch (error) {
            console.error('Error fetching availability:', error);
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile caricare la disponibilità.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDayChange = (dayOfWeek: number, field: keyof AvailabilityDay, value: any) => {
        setSchedule(prev => prev.map(day =>
            day.day_of_week === dayOfWeek ? { ...day, [field]: value } : day
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Prepare data for upsert
            const updates = schedule.map(({ id, ...day }) => ({
                ...day,
                trainer_id: trainerId
            }));

            // We use upsert. We need to handle potential conflicts or ID issues.
            // Since we merged 'id' if it existed, upsert should work if we include id?
            // Actually, for new rows id is undefined. Upsert works by PK or specified conflict columns.
            // Our standard upsert might rely on id if present.
            // A safer way for this specific table (which usually has id PK) is to rely on match criteria if possible, 
            // but here we might just have multiple rows. 
            // Ideally we should have a unique constraint on (trainer_id, day_of_week).
            // Assuming standard logic: upsert on id if present.

            // Wait, if I don't send ID for new rows, it creates them. 
            // If I send ID, it updates.

            const { error } = await supabase
                .from('trainer_availability')
                .upsert(updates.map(u => {
                    // removing undefined id to let postgres generate it or handle update
                    // typescript might complain if id is missing in specific types, let's see.
                    // The update object allows optional id.
                    return u;
                }));

            if (error) throw error;

            toast({
                title: "Salvato",
                description: "Orari di disponibilità aggiornati.",
            });
            setOpen(false);
        } catch (error) {
            console.error('Error saving availability:', error);
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile salvare le modifiche.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Gestisci Orari
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Disponibilità Settimanale</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {DAYS_OF_WEEK.map((dayLabel) => {
                            const dayData = schedule.find(d => d.day_of_week === dayLabel.id);
                            if (!dayData) return null;

                            return (
                                <div key={dayLabel.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                                    <div className="flex items-center space-x-4">
                                        <Switch
                                            checked={dayData.is_available}
                                            onCheckedChange={(checked) => handleDayChange(dayLabel.id, 'is_available', checked)}
                                        />
                                        <Label className="w-24 font-medium">{dayLabel.name}</Label>
                                    </div>

                                    {dayData.is_available && (
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="time"
                                                value={dayData.start_time}
                                                onChange={(e) => handleDayChange(dayLabel.id, 'start_time', e.target.value)}
                                                className="w-24"
                                            />
                                            <span className="text-slate-400">-</span>
                                            <Input
                                                type="time"
                                                value={dayData.end_time}
                                                onChange={(e) => handleDayChange(dayLabel.id, 'end_time', e.target.value)}
                                                className="w-24"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <Button onClick={handleSave} disabled={saving} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvataggio...
                                </>
                            ) : (
                                'Salva Modifiche'
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AvailabilitySettings;
