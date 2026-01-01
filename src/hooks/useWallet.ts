import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Transaction {
    id: string;
    amount: number;
    type: string;
    description: string;
    created_at: string;
}

export interface Wallet {
    id: string;
    balance: number;
}

export const useWallet = () => {
    const { user } = useAuth();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWallet = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('wallets')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            setWallet(data);

            const { data: txData, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .eq('wallet_id', data.id)
                .order('created_at', { ascending: false });

            if (txError) throw txError;
            setTransactions(txData || []);

        } catch (error) {
            console.error('Error fetching wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, [user]);

    const processPayment = async (trainerId: string, amount: number, bookingId: string) => {
        if (!user) return { success: false, error: 'User not logged in' };

        try {
            const { data, error } = await supabase.rpc('process_booking_payment', {
                p_user_id: user.id,
                p_trainer_id: trainerId,
                p_amount: amount,
                p_booking_id: bookingId
            });

            if (error) throw error;

            // Refresh wallet after payment
            await fetchWallet();

            return data;
        } catch (error: any) {
            console.error('Payment failed:', error);
            return { success: false, error: error.message };
        }
    };

    return {
        wallet,
        transactions,
        loading,
        processPayment,
        refreshWallet: fetchWallet
    };
};
