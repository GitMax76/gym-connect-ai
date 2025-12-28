
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, ArrowLeft, Dumbbell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const WorkoutPlansPage = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchPlans();
        }
    }, [user]);

    const fetchPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('workout_plans')
                .select(`
                    *,
                    trainer:trainer_id (
                        first_name,
                        last_name
                    )
                `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (data) {
                setPlans(data);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkCompleted = async (planId: string) => {
        try {
            const { error } = await supabase
                .from('workout_plans')
                .update({ status: 'completed' })
                .eq('id', planId);

            if (!error) {
                setPlans(plans.map(p => p.id === planId ? { ...p, status: 'completed' } : p));
            }
        } catch (error) {
            console.error("Error updating plan:", error);
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

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-green-100 rounded-full">
                        <Dumbbell className="h-8 w-8 text-green-700" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">I Miei Piani di Allenamento</h1>
                        <p className="text-gray-600">Visualizza i programmi assegnati dai tuoi trainer</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                ) : plans.length === 0 ? (
                    <Card className="text-center py-16 bg-white border-dashed">
                        <CardContent>
                            <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900">Nessun piano attivo</h3>
                            <p className="text-gray-500 max-w-md mx-auto mt-2">
                                Non hai ancora ricevuto nessun piano di allenamento. Contatta un trainer o prenota una sessione per iniziare!
                            </p>
                            <Button
                                className="mt-6 bg-green-600 hover:bg-green-700"
                                onClick={() => navigate('/search')}
                            >
                                Trova un Trainer
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {plans.map((plan) => (
                            <Card key={plan.id} className={`overflow-hidden transition-all hover:shadow-lg ${plan.status === 'completed' ? 'opacity-75 bg-slate-50' : 'bg-white'}`}>
                                <div className={`h-2 w-full ${plan.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Badge variant={plan.status === 'active' ? 'default' : 'secondary'} className="mb-2">
                                                {plan.status === 'active' ? 'In Corso' : 'Completato'}
                                            </Badge>
                                            <CardTitle className="text-2xl text-gray-900">{plan.title}</CardTitle>
                                            <CardDescription className="flex items-center mt-1">
                                                <User className="h-4 w-4 mr-1" />
                                                Trainer: {plan.trainer?.first_name} {plan.trainer?.last_name}
                                            </CardDescription>
                                        </div>
                                        {plan.status === 'active' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                                onClick={() => handleMarkCompleted(plan.id)}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Segna Completato
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                                                Durata Programma
                                            </h4>
                                            <div className="flex gap-8 text-sm">
                                                <div>
                                                    <span className="text-gray-500 block">Inizio</span>
                                                    <span className="font-medium">
                                                        {plan.start_date ? format(new Date(plan.start_date), 'd MMMM yyyy', { locale: it }) : 'N/A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Scadenza</span>
                                                    <span className="font-medium text-red-600">
                                                        {plan.end_date ? format(new Date(plan.end_date), 'd MMMM yyyy', { locale: it }) : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Scheda Allenamento</h4>
                                            <div className="whitespace-pre-wrap bg-white p-4 rounded-lg border text-gray-700 font-mono text-sm leading-relaxed">
                                                {plan.description || "Nessun dettaglio fornito."}
                                            </div>
                                        </div>
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

export default WorkoutPlansPage;
