
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface ReviewDialogProps {
    bookingId: string;
    targetId: string; // The person being reviewed (User or Trainer)
    targetName: string;
    onSuccess?: () => void;
}

const ReviewDialog = ({ bookingId, targetId, targetName, onSuccess }: ReviewDialogProps) => {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: "Errore",
                description: "Devi selezionare un voto da 1 a 5 stelle.",
                variant: "destructive"
            });
            return;
        }

        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .insert({
                    booking_id: bookingId,
                    reviewer_id: user.id,
                    reviewed_id: targetId,
                    rating,
                    comment
                });

            if (error) {
                console.error(error);
                toast({
                    title: "Errore",
                    description: "Impossibile salvare la recensione.",
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Grazie!",
                    description: "La tua recensione è stata salvata.",
                });
                setOpen(false);
                onSuccess?.();
            }
        } catch (error) {
            console.error("Critical error saving review:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Star className="w-4 h-4" /> Lascia Recensione
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Recensisci {targetName}</DialogTitle>
                    <DialogDescription>
                        Condividi la tua esperienza per aiutare gli altri utenti.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`p-1 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                            >
                                <Star className="w-8 h-8 fill-current" />
                            </button>
                        ))}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="comment" className="text-left">
                            Commento
                        </Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Scrivi qui la tua recensione..."
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Salvataggio..." : "Invia Recensione"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;
