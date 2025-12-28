
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CreateWorkoutPlanDialog from '@/components/CreateWorkoutPlanDialog';
import { Users, Mail, MapPin, Activity, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const ClientsPage = () => {
    const { user } = useAuth();
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchClients();
        }
    }, [user]);

    const fetchClients = async () => {
        try {
            // Fetch unique users who have booked this trainer
            const { data: bookings } = await supabase
                .from('bookings')
                .select('user_id')
                .eq('trainer_id', user?.id);

            if (bookings && bookings.length > 0) {
                const userIds = [...new Set(bookings.map(b => b.user_id))];

                const { data: profiles } = await supabase
                    .from('profiles')
                    .select(`
                        id, 
                        first_name, 
                        last_name, 
                        email, 
                        city, 
                        avatar_url,
                        user_profiles (
                            primary_goal,
                            fitness_level
                        )
                    `)
                    .in('id', userIds);

                if (profiles) {
                    setClients(profiles);
                }
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow">
                <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => navigate('/dashboard')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Torna alla Dashboard
                </Button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">I Miei Clienti</h1>
                        <p className="text-gray-600">Gestisci i tuoi atleti e i loro piani di allenamento</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : clients.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Nessun Cliente Trovato</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2">
                                Non hai ancora clienti. Quando riceverai la prima prenotazione, i tuoi clienti appariranno qui.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.map((client) => (
                            <Card key={client.id} className="hover:shadow-md transition-all">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={client.avatar_url} />
                                        <AvatarFallback>{client.first_name?.[0]}{client.last_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {client.first_name} {client.last_name}
                                        </CardTitle>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {client.city || 'Città non specificata'}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {client.email}
                                        </div>
                                        {client.user_profiles && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Activity className="h-4 w-4 mr-2" />
                                                Goal: {client.user_profiles.primary_goal || 'N/A'}
                                            </div>
                                        )}
                                        {client.user_profiles?.fitness_level && (
                                            <Badge variant="secondary" className="mt-1">
                                                Livello: {client.user_profiles.fitness_level}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t mt-2">
                                        <CreateWorkoutPlanDialog
                                            userId={client.id}
                                            userName={`${client.first_name} ${client.last_name}`}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientsPage;
