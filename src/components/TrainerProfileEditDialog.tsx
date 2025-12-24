import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile, TrainerProfile } from '@/hooks/useProfile';
import { useToast } from "@/hooks/use-toast";
import { Pencil } from 'lucide-react';

interface TrainerProfileEditDialogProps {
    currentProfile: TrainerProfile | null;
}

const TrainerProfileEditDialog = ({ currentProfile }: TrainerProfileEditDialogProps) => {
    const { updateTrainerProfile } = useProfile();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [bio, setBio] = useState(currentProfile?.bio || '');
    const [specializations, setSpecializations] = useState(currentProfile?.specializations?.join(', ') || '');
    const [yearsExperience, setYearsExperience] = useState(currentProfile?.years_experience?.toString() || '');
    const [hourlyRate, setHourlyRate] = useState(currentProfile?.personal_rate_per_hour?.toString() || '');

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen && currentProfile) {
            setBio(currentProfile.bio || '');
            setSpecializations(currentProfile.specializations?.join(', ') || '');
            setYearsExperience(currentProfile.years_experience?.toString() || '');
            setHourlyRate(currentProfile.personal_rate_per_hour?.toString() || '');
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates = {
            bio,
            specializations: specializations.split(',').map(s => s.trim()).filter(Boolean),
            years_experience: parseInt(yearsExperience) || 0,
            personal_rate_per_hour: parseFloat(hourlyRate) || 0
        };

        const { error } = await updateTrainerProfile(updates);

        if (error) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile aggiornare il profilo. Riprova.",
            });
        } else {
            toast({
                title: "Successo",
                description: "Profilo aggiornato con successo!",
            });
            setOpen(false);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                    <Pencil className="h-4 w-4 mr-2" />
                    Modifica
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifica Profilo Trainer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Descrivi la tua esperienza..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="specializations">Specializzazioni (separate da virgola)</Label>
                        <Input id="specializations" value={specializations} onChange={e => setSpecializations(e.target.value)} placeholder="Yoga, CrossFit, Pilates" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="years">Anni di Esperienza</Label>
                            <Input id="years" type="number" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rate">Tariffa Oraria (€)</Label>
                            <Input id="rate" type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Salvataggio...' : 'Salva Modifiche'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TrainerProfileEditDialog;
