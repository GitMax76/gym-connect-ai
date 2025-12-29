import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Promotion {
    id: string;
    gym_id: string;
    title: string;
    description?: string;
    discount_value?: string;
    is_active: boolean;
    created_at: string;
}

export const usePromotions = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Added error state

    const gymId = user?.id; // Derive gymId from user.id

    const fetchPromotions = async () => {
        if (!gymId) { // Check for gymId instead of user
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data, error } = await (supabase
                .from('promotions' as any)
                .select('*')
                .eq('gym_id', gymId) as any);

            if (error) throw error;
            setPromotions(data as Promotion[]);
        } catch (err: any) {
            setError(err.message);
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile caricare le promozioni."
            });
        } finally {
            setLoading(false);
        }
    };

    const createPromotion = async (promotion: Omit<Promotion, 'id' | 'created_at' | 'gym_id'>) => {
        if (!gymId) { // Check for gymId instead of user
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Utente non autenticato."
            });
            return { error: 'No user' };
        }
        try {
            const { data, error } = await (supabase
                .from('promotions' as any)
                .insert([
                    { ...promotion, gym_id: gymId }
                ])
                .select() as any);

            if (error) throw error;
            setPromotions(prev => [...prev, data[0] as Promotion]);
            toast({
                title: "Promozione creata",
                description: "La promozione è stata creata con successo."
            });
            return data[0];
        } catch (err: any) {
            console.error('Error creating promotion:', err);
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile creare la promozione."
            });
            throw err;
        }
    };

    const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
        try {
            const { data, error } = await (supabase
                .from('promotions' as any)
                .update(updates)
                .eq('id', id)
                .select() as any);

            if (error) throw error;
            setPromotions(prev => prev.map(p => p.id === id ? (data[0] as Promotion) : p));
            toast({
                title: "Promozione aggiornata",
                description: "Le modifiche sono state salvate."
            });
        } catch (err: any) {
            console.error('Error updating promotion:', err);
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile aggiornare la promozione."
            });
        }
    };

    const deletePromotion = async (id: string) => {
        try {
            const { error } = await (supabase
                .from('promotions' as any)
                .delete()
                .eq('id', id) as any);

            if (error) throw error;
            setPromotions(prev => prev.filter(p => p.id !== id));
            toast({
                title: "Promozione eliminata",
                description: "La promozione è stata rimossa."
            });
        } catch (err: any) {
            console.error('Error deleting promotion:', err);
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile eliminare la promozione."
            });
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPromotions();
    }, [user]);

    return {
        promotions,
        loading,
        refetch: fetchPromotions,
        createPromotion,
        updatePromotion,
        deletePromotion
    };
};
