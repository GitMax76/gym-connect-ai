
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Send, Dumbbell } from 'lucide-react';

interface WorkoutRequestDialogProps {
    trainerId: string;
    trainerName: string;
}

const WorkoutRequestDialog = ({ trainerId, trainerName }: WorkoutRequestDialogProps) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [goals, setGoals] = useState('');
    const [injuries, setInjuries] = useState('');
    const [daysPerWeek, setDaysPerWeek] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);

        try {
            const { error } = await supabase
                .from('workout_requests' as any)
                .insert({
                    user_id: user.id,
                    trainer_id: trainerId,
                    goals,
                    injuries,
                    days_per_week: daysPerWeek,
                    status: 'pending'
                });

            if (error) throw error;

            toast({
                title: "Richiesta Inviata!",
                description: `Hai richiesto un piano a ${trainerName}. Attendi la sua risposta.`,
            });
            setOpen(false);
            setGoals('');
            setInjuries('');
            setDaysPerWeek('');
        } catch (error: any) {
            console.error('Error sending request:', error);
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile inviare la richiesta.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Richiedi Scheda
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Richiedi Piano a {trainerName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="goals">Obiettivi Principali</Label>
                        <Textarea
                            id="goals"
                            placeholder="Es. Voglio aumentare la massa muscolare e migliorare la panca piana."
                            value={goals}
                            onChange={e => setGoals(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="days">Giorni a settimana disponibili</Label>
                        <Select value={daysPerWeek} onValueChange={setDaysPerWeek} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">2 giorni</SelectItem>
                                <SelectItem value="3">3 giorni</SelectItem>
                                <SelectItem value="4">4 giorni</SelectItem>
                                <SelectItem value="5">5 giorni</SelectItem>
                                <SelectItem value="6+">6+ giorni</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="injuries">Infortuni o Limitazioni (Opzionale)</Label>
                        <Input
                            id="injuries"
                            placeholder="Es. Dolore alla spalla destra..."
                            value={injuries}
                            onChange={e => setInjuries(e.target.value)}
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                        {loading ? 'Invio in corso...' : 'Invia Richiesta'} <Send className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WorkoutRequestDialog;
