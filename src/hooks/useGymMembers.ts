import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GymMember {
    id: string; // Subscription ID
    user_id: string;
    full_name: string;
    avatar_url: string | null;
    subscription_type: string;
    status: 'active' | 'cancelled' | 'expired';
    start_date: string;
    end_date: string;
}

export const useGymMembers = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState<GymMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!user) return;

            try {
                setLoading(true);
                // Fetch subscriptions for this gym
                const { data, error: fetchError } = await supabase
                    .from('subscriptions')
                    .select(`
                        id,
                        user_id,
                        subscription_type,
                        status,
                        start_date,
                        end_date,
                        profiles:user_id (
                            first_name,
                            last_name,
                            avatar_url,
                            email
                        )
                    `)
                    .eq('gym_id', user.id);

                if (fetchError) throw fetchError;

                if (data) {
                    const mappedMembers: GymMember[] = data.map((sub: any) => ({
                        id: sub.id,
                        user_id: sub.user_id,
                        full_name: `${sub.profiles?.first_name || ''} ${sub.profiles?.last_name || ''}`.trim() || sub.profiles?.email || 'Utente Sconosciuto',
                        avatar_url: sub.profiles?.avatar_url,
                        subscription_type: sub.subscription_type,
                        status: sub.status as any,
                        start_date: sub.start_date,
                        end_date: sub.end_date
                    }));
                    setMembers(mappedMembers);
                }
            } catch (err: any) {
                console.error("Error fetching members:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [user]);

    return { members, loading, error };
};
