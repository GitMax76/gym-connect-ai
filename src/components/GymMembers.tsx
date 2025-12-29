import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { useGymMembers } from '@/hooks/useGymMembers';
import { format } from 'date-fns';

const GymMembers = () => {
    const { members, loading, error } = useGymMembers();

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                Errore nel caricamento dei membri: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Gestisci Membri</h2>
                    <p className="text-slate-500">Visualizza e gestisci gli iscritti alla tua palestra.</p>
                </div>
                {/* Future: Add member manually functionality */}
                <Button variant="outline" disabled>Aggiungi Membro (Presto)</Button>
            </div>

            <div className="grid gap-4">
                {members.map((member) => (
                    <Card key={member.id} className="flex items-center p-4">
                        <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={member.avatar_url || ''} />
                            <AvatarFallback>{member.full_name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h4 className="font-semibold">{member.full_name}</h4>
                            <div className="flex items-center text-sm text-slate-500 gap-4">
                                <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Scadenza: {member.end_date ? format(new Date(member.end_date), 'dd/MM/yyyy') : 'N/A'}
                                </span>
                                <span className="flex items-center">
                                    <Badge variant="outline" className="text-xs uppercase">{member.subscription_type}</Badge>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                {member.status === 'active' ? 'Attivo' : 'Scaduto/Annullato'}
                            </Badge>
                            <Button variant="ghost" size="sm">Dettagli</Button>
                        </div>
                    </Card>
                ))}

                {members.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-slate-500">Nessun membro trovato.</p>
                        <p className="text-sm text-slate-400">Gli utenti appariranno qui quando si iscriveranno alla tua palestra.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GymMembers;
