
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const MatchNotification = () => {
    const { profile } = useProfile();
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (profile?.id) {
            checkForMatches();
        }
    }, [profile]);

    const checkForMatches = async () => {
        setLoading(true);
        try {
            if (profile?.user_type === 'user') {
                // Find Trainers in the same city
                const { data } = await supabase
                    .from('profiles')
                    .select(`
                        id, 
                        first_name, 
                        last_name,
                        trainer_profiles!inner (
                            specializations,
                            personal_rate_per_hour
                        )
                    `)
                    .eq('user_type', 'trainer')
                    .eq('city', profile.city)
                    .limit(5);

                if (data) setMatches(data);
            } else if (profile?.user_type === 'trainer') {
                // Find Users in the same city
                const { data } = await supabase
                    .from('profiles')
                    .select(`
                        id, 
                        first_name, 
                        last_name,
                        user_profiles!inner (
                            primary_goal,
                            fitness_level
                        )
                    `)
                    .eq('user_type', 'user')
                    .eq('city', profile.city)
                    .limit(5);

                if (data) setMatches(data);
            }
        } catch (error) {
            console.error("Error checking matches:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMatchClick = (id: string) => {
        setOpen(false);
        navigate(`/profile/${id}`);
    };

    if (matches.length === 0) {
        return (
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-white/80" />
            </Button>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-white" />
                    <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-blue-600 animate-pulse"></span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none">Nuovi Match Trovati! ({matches.length})</h4>
                    <p className="text-sm text-muted-foreground">
                        Questi profili sono compatibili con te a {profile?.city}.
                    </p>
                    <div className="grid gap-4">
                        {matches.map((match) => (
                            <div
                                key={match.id}
                                onClick={() => handleMatchClick(match.id)}
                                className="flex items-start space-x-4 border-b pb-2 last:border-0 hover:bg-slate-50 p-2 rounded transition-colors cursor-pointer"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {match.first_name} {match.last_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {profile?.user_type === 'user'
                                            ? `Specializzato in: ${match.trainer_profiles.specializations?.join(', ')}`
                                            : `Obiettivo: ${match.user_profiles.primary_goal}`
                                        }
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
