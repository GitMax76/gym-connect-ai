import React, { useState } from 'react';
import { usePromotions, Promotion } from '@/hooks/usePromotions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Tag, Percent } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const GymPromotionsManager = () => {
    const { promotions, loading, createPromotion, updatePromotion, deletePromotion } = usePromotions();
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPromo, setNewPromo] = useState({
        title: '',
        description: '',
        discount_value: '',
        is_active: true
    });
    const [createLoading, setCreateLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);

        const { error } = await createPromotion(newPromo);

        if (error) {
            // Error is handled by the hook toast, but we can verify here if needed
        } else {
            setIsCreateOpen(false);
            setNewPromo({ title: '', description: '', discount_value: '', is_active: true });
        }
        setCreateLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Sei sicuro di voler eliminare questa promozione?')) {
            const { error } = await deletePromotion(id);
            if (!error) {
                toast({ title: 'Promozione eliminata' });
            }
        }
    };

    const handleToggleActive = async (promotion: Promotion) => {
        await updatePromotion(promotion.id, { is_active: !promotion.is_active });
    };

    if (loading) return <div>Caricamento promozioni...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Le Tue Promozioni</h2>
                    <p className="text-slate-500">Gestisci le offerte da inviare agli atleti.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Nuova Promozione
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crea Nuova Promozione</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Titolo Promozione</Label>
                                <Input
                                    placeholder="Es. Sconto Estivo -20%"
                                    value={newPromo.title}
                                    onChange={e => setNewPromo({ ...newPromo, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Valore Sconto (Opzionale)</Label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Es. 20% o 50€"
                                        value={newPromo.discount_value}
                                        onChange={e => setNewPromo({ ...newPromo, discount_value: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descrizione</Label>
                                <Textarea
                                    placeholder="Dettagli dell'offerta..."
                                    value={newPromo.description}
                                    onChange={e => setNewPromo({ ...newPromo, description: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Attiva subito</Label>
                                <Switch
                                    checked={newPromo.is_active}
                                    onCheckedChange={checked => setNewPromo({ ...newPromo, is_active: checked })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createLoading}>
                                    {createLoading ? 'Creazione...' : 'Crea Promozione'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map(promo => (
                    <Card key={promo.id} className={`${!promo.is_active ? 'opacity-60 bg-slate-50' : ''}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-green-600" />
                                    {promo.title}
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 -mt-2 -mr-2"
                                    onClick={() => handleDelete(promo.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardDescription>{promo.discount_value}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4 min-h-[40px]">
                                {promo.description || "Nessuna descrizione."}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded-full ${promo.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {promo.is_active ? 'Attiva' : 'Inattiva'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Stato</Label>
                                    <Switch
                                        checked={promo.is_active}
                                        onCheckedChange={() => handleToggleActive(promo)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {promotions.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                        <Tag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">Nessuna promozione</h3>
                        <p className="text-slate-500">Crea la tua prima offerta per attirare nuovi atleti.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GymPromotionsManager;
