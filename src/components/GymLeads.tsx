
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Target } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

interface Lead {
    id: string;
    first_name: string;
    last_name: string;
    city: string;
    primary_goal: string;
    fitness_level: string;
}

const GymLeads = () => {
    const { profile } = useProfile();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (profile?.city) {
            fetchLeads();
        }
    }, [profile]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            // Find users in the same city
            // Ideally we would look at 'matching_preferences' too, but city is a good start
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id, 
                    first_name, 
                    last_name, 
                    city,
                    user_profiles!inner(primary_goal, fitness_level)
                `)
                .eq('user_type', 'user')
                .eq('city', profile.city) // Simple matching by location
                .limit(10);

            if (data) {
                const mappedLeads: Lead[] = data.map((d: any) => ({
                    id: d.id,
                    first_name: d.first_name,
                    last_name: d.last_name,
                    city: d.city,
                    primary_goal: d.user_profiles.primary_goal,
                    fitness_level: d.user_profiles.fitness_level
                }));
                setLeads(mappedLeads);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-4">Ricerca potenziali membri...</div>;

    if (leads.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    Nessun utente trovato nella tua zona al momento.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Potenziali Membri in Zona
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {leads.map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="space-y-1">
                                <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{lead.city}</span>
                                    <span className="text-slate-300">|</span>
                                    <Target className="h-3 w-3" />
                                    <span>{lead.primary_goal}</span>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => navigate(`/profile/${lead.id}`)}>
                                Visualizza Profilo
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default GymLeads;
