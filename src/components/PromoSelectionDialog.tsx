import React, { useState } from 'react';
import { usePromotions } from '@/hooks/usePromotions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PromoSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipientName: string;
}

const PromoSelectionDialog = ({ open, onOpenChange, recipientName }: PromoSelectionDialogProps) => {
    const { promotions, loading } = usePromotions();
    const { toast } = useToast();
    const [selectedPromoId, setSelectedPromoId] = useState<string>('');
    const [sending, setSending] = useState(false);

    const activePromotions = promotions.filter(p => p.is_active);

    const handleSend = async () => {
        if (!selectedPromoId) return;
        setSending(true);

        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const promo = activePromotions.find(p => p.id === selectedPromoId);

        toast({
            title: "Promozione Inviata! 🚀",
            description: `Hai inviato "${promo?.title}" a ${recipientName}.`,
            duration: 4000
        });

        setSending(false);
        onOpenChange(false);
        setSelectedPromoId('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invia Promozione a {recipientName}</DialogTitle>
                    <DialogDescription>
                        Scegli un'offerta attiva da inviare a questo atleta.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="text-center py-4 text-slate-500">Caricamento promozioni...</div>
                    ) : activePromotions.length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 rounded-md border border-dashed">
                            <Tag className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">Non hai promozioni attive.</p>
                            <p className="text-xs text-slate-400 mt-1">Vai alla Dashboard per crearne una.</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[240px] rounded-md border p-4">
                            <RadioGroup value={selectedPromoId} onValueChange={setSelectedPromoId}>
                                {activePromotions.map((promo) => (
                                    <div key={promo.id} className="flex items-start space-x-2 mb-4 last:mb-0">
                                        <RadioGroupItem value={promo.id} id={promo.id} className="mt-1" />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor={promo.id} className="font-semibold cursor-pointer">
                                                {promo.title}
                                            </Label>
                                            <p className="text-xs text-slate-500">
                                                {promo.description}
                                            </p>
                                            {promo.discount_value && (
                                                <span className="inline-block bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                    {promo.discount_value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </ScrollArea>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
                    <Button
                        onClick={handleSend}
                        disabled={!selectedPromoId || sending || loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {sending ? 'Invio...' : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Invia Promozione
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PromoSelectionDialog;
