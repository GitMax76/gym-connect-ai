import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, ShieldAlert, Scale } from 'lucide-react';

const TermsPage = () => {
    return (
        <Layout>
            <div className="container mx-auto py-12 px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-slate-900">Termini e Condizioni</h1>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ScrollText className="h-6 w-6 text-blue-600" />
                                Accettazione dei Termini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">
                                Utilizzando Gym Connect AI, accetti i presenti Termini e Condizioni.
                                La piattaforma funge da intermediario tra Utenti, Trainer e Palestre.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="h-6 w-6 text-orange-600" />
                                Responsabilità
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Servizio:</strong> Gym Connect AI non è responsabile per la qualità dei servizi offerti dai Trainer o dalle Palestre.</li>
                                <li><strong>Salute:</strong> Consultare sempre un medico prima di iniziare qualsiasi piano di allenamento.</li>
                                <li><strong>Pagamenti:</strong> Transazioni gestite in modo sicuro da terze parti (Stripe).</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="h-6 w-6 text-green-600" />
                                Regole di Comportamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Ci riserviamo il diritto di sospendere account che violano le linee guida della community,
                                inclusi comportamenti offensivi, profili falsi o mancati pagamenti.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default TermsPage;
