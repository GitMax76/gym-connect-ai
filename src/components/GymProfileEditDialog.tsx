import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile, GymProfile } from '@/hooks/useProfile';
import { useToast } from "@/hooks/use-toast";
import { Pencil } from 'lucide-react';

interface GymProfileEditDialogProps {
    currentProfile: GymProfile | null;
}

const GymProfileEditDialog = ({ currentProfile }: GymProfileEditDialogProps) => {
    const { updateGymProfile } = useProfile();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [gymName, setGymName] = useState(currentProfile?.gym_name || '');
    const [address, setAddress] = useState(currentProfile?.address || '');
    const [description, setDescription] = useState(currentProfile?.description || '');
    const [facilities, setFacilities] = useState(currentProfile?.facilities?.join(', ') || '');
    const [monthlyFee, setMonthlyFee] = useState(currentProfile?.monthly_fee?.toString() || '');
    const [memberCapacity, setMemberCapacity] = useState(currentProfile?.member_capacity?.toString() || '');

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen && currentProfile) {
            setGymName(currentProfile.gym_name || '');
            setAddress(currentProfile.address || '');
            setDescription(currentProfile.description || '');
            setFacilities(currentProfile.facilities?.join(', ') || '');
            setMonthlyFee(currentProfile.monthly_fee?.toString() || '');
            setMemberCapacity(currentProfile.member_capacity?.toString() || '');
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates = {
            gym_name: gymName,
            address,
            description,
            facilities: facilities.split(',').map(s => s.trim()).filter(Boolean),
            monthly_fee: parseFloat(monthlyFee) || 0,
            member_capacity: parseInt(memberCapacity) || 0
        };

        const { error } = await updateGymProfile(updates);

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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Modifica Profilo Palestra</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="gymName">Nome Palestra</Label>
                        <Input id="gymName" value={gymName} onChange={e => setGymName(e.target.value)} placeholder="Nome della palestra" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Indirizzo</Label>
                        <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Via Roma 1, Roma" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrizione</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrivi la tua palestra..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="facilities">Servizi (separati da virgola)</Label>
                        <Input id="facilities" value={facilities} onChange={e => setFacilities(e.target.value)} placeholder="Sala Pesi, Sauna, WiFi" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="monthlyFee">Quota Mensile (€)</Label>
                            <Input id="monthlyFee" type="number" value={monthlyFee} onChange={e => setMonthlyFee(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacità Membri</Label>
                            <Input id="capacity" type="number" value={memberCapacity} onChange={e => setMemberCapacity(e.target.value)} />
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

export default GymProfileEditDialog;
