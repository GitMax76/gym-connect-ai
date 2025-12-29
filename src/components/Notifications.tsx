
import React, { useEffect, useState } from 'react';
import { Bell, Calendar, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

interface NotificationItem {
    id: string;
    type: 'match' | 'booking';
    title: string;
    description: string;
    date?: string;
    link?: string;
}

export const Notifications = () => {
    const { profile } = useProfile();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (profile?.id) {
            fetchNotifications();
        }
    }, [profile]);

    const fetchNotifications = async () => {
        setLoading(true);
        const newNotifications: NotificationItem[] = [];

        try {
            // 1. Fetch Matches 
            if (profile?.user_type === 'user') {
                const { data } = await supabase
                    .from('profiles')
                    .select(`id, first_name, last_name, trainer_profiles!inner(specializations)`)
                    .eq('user_type', 'trainer')
                    .eq('city', profile.city)
                    .limit(5);

                if (data) {
                    data.forEach(match => {
                        newNotifications.push({
                            id: `match-${match.id}`,
                            type: 'match',
                            title: `Nuovo Match: ${match.first_name} ${match.last_name}`,
                            description: `Specializzato in ${match.trainer_profiles.specializations?.[0] || 'fitness'}`,
                            link: `/profile/${match.id}`
                        });
                    });
                }
            } else if (profile?.user_type === 'trainer') {
                const { data } = await supabase
                    .from('profiles')
                    .select(`id, first_name, last_name, user_profiles!inner(primary_goal)`)
                    .eq('user_type', 'user')
                    .eq('city', profile.city)
                    .limit(5);

                if (data) {
                    data.forEach(match => {
                        newNotifications.push({
                            id: `match-${match.id}`,
                            type: 'match',
                            title: `Nuovo Cliente Potenziale: ${match.first_name}`,
                            description: `Obiettivo: ${match.user_profiles.primary_goal}`,
                            link: `/profile/${match.id}`
                        });
                    });
                }
            } else if (profile?.user_type === 'gym_owner') {
                // Fetch Users in the same city who might be interested
                const { data } = await supabase
                    .from('profiles')
                    .select(`id, first_name, last_name, user_profiles!inner(primary_goal)`)
                    .eq('user_type', 'user')
                    .eq('city', profile.city)
                    .limit(5);

                if (data) {
                    data.forEach(match => {
                        newNotifications.push({
                            id: `lead-${match.id}`,
                            type: 'match',
                            title: `Nuovo Membro Potenziale: ${match.first_name}`,
                            description: `Obiettivo: ${match.user_profiles.primary_goal}`,
                            link: `/profile/${match.id}`
                        });
                    });
                }
            }

            // 2. Fetch Pending Bookings (For Trainers)
            if (profile?.user_type === 'trainer') {
                const { data } = await supabase
                    .from('bookings')
                    .select(`id, booking_date, start_time, profiles!user_id(first_name, last_name)`)
                    .eq('trainer_id', profile.id)
                    .eq('status', 'pending');

                if (data) {
                    data.forEach(booking => {
                        newNotifications.push({
                            id: `booking-${booking.id}`,
                            type: 'booking',
                            title: `Nuova Prenotazione`,
                            description: `${booking.profiles?.first_name} per il ${booking.booking_date} alle ${booking.start_time}`,
                            link: `/bookings`
                        });
                    });
                }
            }

            setNotifications(newNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (link?: string) => {
        if (link) {
            setOpen(false);
            navigate(link);
        }
    };

    // Grouping Logic
    const matches = notifications.filter(n => n.type === 'match');
    const bookings = notifications.filter(n => n.type === 'booking');

    const renderGrouped = () => {
        const renderedItems = [];

        // Matches Group
        if (matches.length > 3) {
            renderedItems.push(
                <div key="matches-group" className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => handleClick('/search')}>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-200 p-2 rounded-full">
                            <UserPlus className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-blue-900">{matches.length} Nuovi Match</p>
                            <p className="text-xs text-blue-700">Persone compatibili nella tua zona</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            matches.forEach(n => renderedItems.push(renderItem(n)));
        }

        // Bookings Group
        if (bookings.length > 3) {
            renderedItems.push(
                <div key="bookings-group" className="p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => handleClick('/bookings')}>
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-200 p-2 rounded-full">
                            <Calendar className="h-4 w-4 text-yellow-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-yellow-900">{bookings.length} Richieste Prenotazione</p>
                            <p className="text-xs text-yellow-700">Ci sono nuove richieste in attesa</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            bookings.forEach(n => renderedItems.push(renderItem(n)));
        }

        return renderedItems;
    };

    const renderItem = (n: NotificationItem) => (
        <div
            key={n.id}
            onClick={() => handleClick(n.link)}
            className="flex items-start space-x-3 border-b pb-3 last:border-0 hover:bg-slate-50 p-2 rounded transition-colors cursor-pointer"
        >
            <div className={`p-2 rounded-full ${n.type === 'booking' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {n.type === 'booking' ? <Calendar className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.description}</p>
            </div>
        </div>
    );

    if (notifications.length === 0) {
        return (
            <Button variant="ghost" size="icon" className="relative text-white/80 hover:text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white/80 hover:text-white hover:bg-white/20">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-inherit animate-pulse"></span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b bg-slate-50/50">
                    <h4 className="font-semibold">Notifiche</h4>
                </div>
                <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
                    {renderGrouped()}
                </div>
            </PopoverContent>
        </Popover>
    );
};
