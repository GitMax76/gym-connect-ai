import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfile, TrainerProfile } from '@/hooks/useProfile';
import { useToast } from "@/hooks/use-toast";
import { Pencil } from 'lucide-react';
import { DISCIPLINES } from '@/constants/disciplines';

interface TrainerProfileEditDialogProps {
    currentProfile: TrainerProfile | null;
}

const TrainerProfileEditDialog = ({ currentProfile }: TrainerProfileEditDialogProps) => {
    const { updateTrainerProfile, updateProfile, profile } = useProfile();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [bio, setBio] = useState(currentProfile?.bio || '');
    const [yearsExperience, setYearsExperience] = useState(currentProfile?.years_experience?.toString() || '');
    const [hourlyRate, setHourlyRate] = useState(currentProfile?.personal_rate_per_hour?.toString() || '');
    const [city, setCity] = useState(profile?.city || '');

    // Manage specializations as string array
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(
        currentProfile?.specializations || []
    );

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            if (currentProfile) {
                setBio(currentProfile.bio || '');
                setYearsExperience(currentProfile.years_experience?.toString() || '');
                setHourlyRate(currentProfile.personal_rate_per_hour?.toString() || '');
                setSelectedSpecializations(currentProfile.specializations || []);
            }
            if (profile) {
                setCity(profile.city || '');
            }
        }
    }

    const handleSpecializationChange = (discipline: string, checked: boolean) => {
        if (checked) {
            setSelectedSpecializations([...selectedSpecializations, discipline]);
        } else {
            setSelectedSpecializations(selectedSpecializations.filter(s => s !== discipline));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates = {
            bio,
            specializations: selectedSpecializations,
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
            // Update Base Profile City
            if (city !== profile?.city) {
                await updateProfile({ city });
            }

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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifica Profilo Trainer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">Zona Operativa (Città)</Label>
                        <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Es. Milano, Roma..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Descrivi la tua esperienza..." />
                    </div>

                    <div className="space-y-3">
                        <Label>Specializzazioni</Label>
                        <div className="grid grid-cols-2 gap-2 border p-3 rounded-md bg-slate-50">
                            {DISCIPLINES.map((discipline) => (
                                <div key={discipline} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`spec-${discipline}`}
                                        checked={selectedSpecializations.includes(discipline)}
                                        onCheckedChange={(checked) => handleSpecializationChange(discipline, checked as boolean)}
                                    />
                                    <Label
                                        htmlFor={`spec-${discipline}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {discipline}
                                    </Label>
                                </div>
                            ))}
                        </div>
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
                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                        {loading ? 'Salvataggio...' : 'Salva Modifiche'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TrainerProfileEditDialog;
