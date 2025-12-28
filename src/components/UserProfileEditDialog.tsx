
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile, UserProfile } from '@/hooks/useProfile';
import { useToast } from "@/hooks/use-toast";
import { Pencil } from 'lucide-react';

interface UserProfileEditDialogProps {
    currentProfile: UserProfile | null;
}

const UserProfileEditDialog = ({ currentProfile }: UserProfileEditDialogProps) => {
    const { updateUserProfile, updateProfile } = useProfile();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [weight, setWeight] = useState(currentProfile?.weight?.toString() || '');
    const [height, setHeight] = useState(currentProfile?.height?.toString() || '');
    const [fitnessLevel, setFitnessLevel] = useState(currentProfile?.fitness_level || '');
    const [primaryGoal, setPrimaryGoal] = useState(currentProfile?.primary_goal || '');
    const [availability, setAvailability] = useState(currentProfile?.availability_hours_per_week?.toString() || '');
    const [budgetMin, setBudgetMin] = useState(currentProfile?.budget_min?.toString() || '');
    const [budgetMax, setBudgetMax] = useState(currentProfile?.budget_max?.toString() || '');
    const [preferredLocation, setPreferredLocation] = useState(currentProfile?.preferred_location || '');

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen && currentProfile) {
            setWeight(currentProfile.weight?.toString() || '');
            setHeight(currentProfile.height?.toString() || '');
            setFitnessLevel(currentProfile.fitness_level || '');
            setPrimaryGoal(currentProfile.primary_goal || '');
            setAvailability(currentProfile.availability_hours_per_week?.toString() || '');
            setBudgetMin(currentProfile.budget_min?.toString() || '');
            setBudgetMax(currentProfile.budget_max?.toString() || '');
            setPreferredLocation(currentProfile.preferred_location || '');
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates = {
            weight: parseFloat(weight) || undefined,
            height: parseFloat(height) || undefined,
            fitness_level: fitnessLevel,
            primary_goal: primaryGoal,
            availability_hours_per_week: parseInt(availability) || 0,
            budget_min: parseFloat(budgetMin) || 0,
            budget_max: parseFloat(budgetMax) || 0,
            preferred_location: preferredLocation
        };

        const { error } = await updateUserProfile(updates);

        if (error) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile aggiornare il profilo. Riprova.",
            });
        } else {
            // Also update the base profile city if provided
            if (preferredLocation) {
                await updateProfile({ city: preferredLocation });
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifica Profilo Atleta</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="preferredLocation">Zona di Interesse (Città)</Label>
                        <Input id="preferredLocation" value={preferredLocation} onChange={e => setPreferredLocation(e.target.value)} placeholder="Es. Salerno" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Peso (kg)</Label>
                            <Input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Altezza (cm)</Label>
                            <Input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fitnessLevel">Livello Fitness</Label>
                        <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona livello" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Principiante</SelectItem>
                                <SelectItem value="intermediate">Intermedio</SelectItem>
                                <SelectItem value="advanced">Avanzato</SelectItem>
                                <SelectItem value="expert">Esperto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="goal">Obiettivo Principale</Label>
                        <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona obiettivo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weight-loss">Perdita Peso</SelectItem>
                                <SelectItem value="muscle-gain">Massa Muscolare</SelectItem>
                                <SelectItem value="endurance">Resistenza</SelectItem>
                                <SelectItem value="strength">Forza</SelectItem>
                                <SelectItem value="wellness">Benessere</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="availability">Ore Settimanali</Label>
                        <Input id="availability" type="number" value={availability} onChange={e => setAvailability(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="minBudget">Budget Min (€)</Label>
                            <Input id="minBudget" type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxBudget">Budget Max (€)</Label>
                            <Input id="maxBudget" type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} />
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

export default UserProfileEditDialog;
