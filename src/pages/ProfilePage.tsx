
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Award, DollarSign, Star, Users, ArrowLeft, Mail, Phone, Globe, Clock, MessageSquare } from 'lucide-react';
import BookingDialog from '@/components/BookingDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [details, setDetails] = useState<any>(null);
    const [contactOpen, setContactOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (id) fetchProfile(id);
    }, [id]);

    const fetchProfile = async (userId: string) => {
        try {
            setLoading(true);
            const { data: baseData, error: baseError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (baseError) throw baseError;
            setProfile(baseData);

            if (baseData.user_type === 'trainer') {
                const { data: trainerData } = await supabase
                    .from('trainer_profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();
                setDetails(trainerData);
            } else if (baseData.user_type === 'gym_owner') {
                const { data: gymData } = await supabase
                    .from('gym_profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();
                setDetails(gymData);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = () => {
        toast({
            title: "Messaggio Inviato",
            description: `Il tuo messaggio è stato inviato a ${profile.first_name}.`,
        });
        setContactOpen(false);
        setMessage('');
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </Layout>
        );
    }

    if (!profile) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center p-6">
                        <h2 className="text-xl font-bold mb-2">Profilo non trovato</h2>
                        <Button onClick={() => navigate(-1)} variant="outline">Torna Indietro</Button>
                    </Card>
                </div>
            </Layout>
        );
    }

    const isTrainer = profile.user_type === 'trainer';
    const isGym = profile.user_type === 'gym_owner';

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-6 hover:bg-slate-200"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Torna ai risultati
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Basic Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="overflow-hidden">
                                <div className="h-32 bg-gradient-to-r from-blue-500 to-green-500"></div>
                                <CardContent className="pt-0 -mt-12 text-center">
                                    <Avatar className="w-24 h-24 border-4 border-white mx-auto shadow-md">
                                        <AvatarImage src={profile.avatar_url} />
                                        <AvatarFallback className="text-xl bg-slate-100">
                                            {isGym ? 'GYM' : `${profile.first_name?.[0]}${profile.last_name?.[0]}`}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h1 className="text-2xl font-bold mt-4 text-slate-900">
                                        {isGym ? profile.first_name : `${profile.first_name} ${profile.last_name}`}
                                    </h1>

                                    <div className="flex items-center justify-center gap-2 mt-2 text-slate-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{profile.city || 'Posizione non specificata'}</span>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        {isTrainer ? (
                                            <BookingDialog
                                                trainerId={profile.id}
                                                trainerName={`${profile.first_name} ${profile.last_name}`}
                                            />
                                        ) : (
                                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                                Richiedi Iscrizione
                                            </Button>
                                        )}

                                        <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Contatta
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Contatta {profile.first_name}</DialogTitle>
                                                    <DialogDescription>
                                                        Invia un messaggio diretto per chiedere informazioni.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <Textarea
                                                        placeholder="Scrivi qui il tuo messaggio..."
                                                        className="min-h-[100px]"
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                    />
                                                    <Button onClick={handleSendMessage} className="w-full">Invia Messaggio</Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Contatti</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="truncate">{profile.email}</span>
                                    </div>
                                    {isGym && details?.website_url && (
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4 text-slate-400" />
                                            <a href={details.website_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                Sito Web
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Bio / Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informazioni</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 leading-relaxed">
                                        {isTrainer ? details?.bio : details?.description || "Nessuna descrizione disponibile."}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Trainer Specifics */}
                            {isTrainer && details && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Card>
                                            <CardContent className="p-6 flex items-center gap-4">
                                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                                    <Award className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Esperienza</p>
                                                    <p className="font-bold text-lg">{details.years_experience} Anni</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-6 flex items-center gap-4">
                                                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Tariffa Oraria</p>
                                                    <p className="font-bold text-lg">€{details.personal_rate_per_hour}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Specializzazioni</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {details.specializations?.map((spec: string) => (
                                                    <Badge key={spec} variant="secondary" className="px-3 py-1 text-sm">
                                                        {spec}
                                                    </Badge>
                                                )) || <p className="text-slate-500">Nessuna specializzazione indicata.</p>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* Gym Specifics */}
                            {isGym && details && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Card>
                                            <CardContent className="p-6 flex items-center gap-4">
                                                <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Capacità</p>
                                                    <p className="font-bold text-lg">Max {details.member_capacity || 'N/A'}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-6 flex items-center gap-4">
                                                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Mensile</p>
                                                    <p className="font-bold text-lg">€{details.monthly_fee}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Servizi e Strutture</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {details.facilities?.map((fac: string) => (
                                                    <Badge key={fac} className="bg-slate-100 text-slate-800 hover:bg-slate-200 px-3 py-1">
                                                        {fac}
                                                    </Badge>
                                                )) || <p className="text-slate-500">Nessun servizio elencato.</p>}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Indirizzo</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-slate-400 mt-1" />
                                            <div>
                                                <p className="font-medium">{details.address}</p>
                                                <p className="text-slate-500">{details.postal_code}, {details.city}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
