import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPage = () => {
    return (
        <Layout>
            <div className="container mx-auto py-12 px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-slate-900">Privacy & Sicurezza dei Dati</h1>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-6 w-6 text-green-600" />
                                Protezione dei Dati
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">
                                Gym Connect AI prende sul serio la tua privacy. I tuoi dati personali sensibili (email, telefono, dati di pagamento)
                                sono crittografati e accessibili solo a te o alle parti con cui scegli esplicitamente di condividerli (es. il tuo Trainer).
                            </p>
                            <p>
                                I profili pubblici mostrano solo: Nome, Foto, Città e Informazioni professionali (per Trainer/Palestre).
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-6 w-6 text-blue-600" />
                                Utilizzo dei Dati
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Match IA:</strong> Utilizziamo le tue preferenze (budget, obiettivi) solo per calcolare la compatibilità.</li>
                                <li><strong>Prenotazioni:</strong> Quando prenoti, il Trainer riceve solo il tuo Nome e le note che inserisci.</li>
                                <li><strong>Pagamenti:</strong> Elaborati tramite Stripe in modo sicuro. Noi non salviamo i dati della tua carta.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-6 w-6 text-purple-600" />
                                I Tuoi Diritti
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Puoi modificare o cancellare il tuo profilo in qualsiasi momento dalla Dashboard.
                                Per una cancellazione completa dei dati (GDPR), contatta il supporto a privacy@gymconnect.ai.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPage;
