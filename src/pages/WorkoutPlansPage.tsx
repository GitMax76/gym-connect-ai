
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, ArrowLeft, Dumbbell, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

const WorkoutPlansPage = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const dateLocale = language === 'IT' ? it : enUS;

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

    const handlePayment = async (planId: string, price: number) => {
        try {
            const { data, error } = await supabase.rpc('pay_for_workout_plan' as any, {
                p_user_id: user?.id,
                p_plan_id: planId
            });

            if (error) throw error;

            if (data && (data as any).success) {
                toast({
                    title: t('workout.toast.purchase_completed'),
                    description: t('workout.toast.unlocked_desc'),
                });
                fetchPlans();
            } else {
                toast({
                    variant: "destructive",
                    title: t('workout.toast.payment_error'),
                    description: (data as any).error === "Insufficient balance" ? t('workout.toast.insufficient_funds') : ((data as any).error || t('workout.toast.payment_failed')),
                });
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast({
                variant: "destructive",
                title: t('workout.toast.error'),
                description: t('workout.toast.payment_failed'),
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow max-w-4xl">
                <Button
                    variant="ghost"
                    className="mb-6 hover:bg-indigo-50 hover:text-indigo-700 transition-all border border-slate-200/80 bg-white"
                    onClick={() => navigate('/dashboard')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2 text-indigo-500" />
                    {t('workout.back_to_dashboard')}
                </Button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-600">
                        <Dumbbell className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{t('workout.title')}</h1>
                        <p className="text-slate-500 text-sm mt-0.5">{t('workout.subtitle')}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : plans.length === 0 ? (
                    <Card className="text-center py-16 bg-white border-dashed border-slate-200/80 shadow-none">
                        <CardContent>
                            <Dumbbell className="h-16 w-16 text-indigo-100 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-800">{t('workout.empty_title')}</h3>
                            <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm leading-relaxed">
                                {t('workout.empty_desc')}
                            </p>
                            <Button
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95 border-0 shadow-md shadow-indigo-100 font-semibold"
                                onClick={() => navigate('/search')}
                            >
                                {t('workout.find_trainer_btn')}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {plans.map((plan) => {
                            const isLocked = plan.payment_status === 'pending' && plan.price > 0;

                            return (
                                <Card key={plan.id} className={`overflow-hidden border-slate-200/80 shadow-sm transition-all hover:shadow-md ${plan.status === 'completed' ? 'opacity-75 bg-slate-50/50' : 'bg-white'}`}>
                                    <div className={`h-1.5 w-full ${plan.status === 'active' ? 'bg-emerald-500' : isLocked ? 'bg-amber-500' : 'bg-slate-300'}`} />
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start flex-wrap gap-4">
                                            <div>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`mb-2.5 rounded-full font-medium border text-xs px-2.5 py-0.5 ${
                                                        isLocked 
                                                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                                            : plan.status === 'active' 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                            : 'bg-slate-50 text-slate-700 border-slate-200'
                                                    }`}
                                                >
                                                    {isLocked ? t('workout.status.pending') : plan.status === 'active' ? t('workout.status.active') : t('workout.status.completed')}
                                                </Badge>
                                                <CardTitle className="text-2xl font-bold text-slate-800">{plan.title}</CardTitle>
                                                <CardDescription className="flex items-center mt-1.5 text-slate-500 font-medium text-sm">
                                                    <User className="h-4 w-4 mr-1 text-indigo-500" />
                                                    Trainer: {plan.trainer?.first_name} {plan.trainer?.last_name}
                                                </CardDescription>
                                            </div>
                                            {plan.status === 'active' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 transition-all active:scale-95 text-xs font-semibold"
                                                    onClick={() => handleMarkCompleted(plan.id)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1.5" />
                                                    {t('workout.mark_completed')}
                                                </Button>
                                            )}
                                            {isLocked && (
                                                <Button
                                                    onClick={() => handlePayment(plan.id, plan.price)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95 border-0 shadow-md shadow-indigo-100 text-xs font-semibold"
                                                >
                                                    {t('workout.unlock_btn').replace('{price}', plan.price.toString())}
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100/80">
                                            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center">
                                                <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                                {t('workout.duration')}
                                            </h4>
                                            <div className="flex gap-12 text-sm">
                                                <div>
                                                    <span className="text-slate-400 text-xs block font-medium">{t('workout.start')}</span>
                                                    <span className="font-semibold text-slate-700 mt-0.5 block">
                                                        {plan.start_date ? format(new Date(plan.start_date), 'd MMMM yyyy', { locale: dateLocale }) : 'N/A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 text-xs block font-medium">{t('workout.end')}</span>
                                                    <span className="font-semibold text-red-500 mt-0.5 block">
                                                        {plan.end_date ? format(new Date(plan.end_date), 'd MMMM yyyy', { locale: dateLocale }) : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-3">{t('workout.details_title')}</h4>
                                            {isLocked ? (
                                                <div className="relative bg-slate-50/50 p-8 rounded-lg border border-slate-100 text-center">
                                                    <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 flex items-center justify-center rounded-lg">
                                                        <div className="text-center p-4">
                                                            <Lock className="h-7 w-7 mx-auto text-indigo-500/80 mb-2 animate-bounce" />
                                                            <p className="text-slate-700 font-bold text-sm">{t('workout.locked_title')}</p>
                                                            <p className="text-xs text-slate-500 mt-1">{t('workout.locked_desc')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="blur-sm select-none opacity-20 font-mono text-xs leading-relaxed text-left">
                                                        DAY 1: Full Body workout
                                                        - Bench Press: 4 sets x 8 reps
                                                        - Squats: 4 sets x 10 reps
                                                        - Pull-ups: 3 sets x max reps
                                                        - Dumbbell shoulder press: 3 sets x 12 reps
                                                        DAY 2: Rest & recovery stretching exercises
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap bg-slate-50/50 p-4 rounded-lg border border-slate-100 text-slate-700 font-mono text-xs leading-relaxed">
                                                    {plan.description || t('workout.no_details')}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutPlansPage;
