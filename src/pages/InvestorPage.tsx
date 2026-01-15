import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShieldCheck, Wallet, PieChart, ArrowUpRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import CountUp from '@/components/CountUp';

const InvestorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        Gym Connect AI: The Future of Fitness
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        Scalable, profitable, and community-driven. Our ecosystem connects thousands of athletes with trainers through a proprietary, high-margin economy.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white" asChild>
                            <a href="mailto:invest@gymconnect.ai">Contact Investor Relations</a>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">

                {/* Vision & Economy Section */}
                <ScrollReveal animation="fade-up" delay={100}>
                    <div className="mb-20 space-y-16">
                        <div className="text-center max-w-4xl mx-auto">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Vision: La Democratizzazione del Fitness Premium</h2>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                Gym Connect AI non è solo un marketplace, è il primo <strong>Ecosistema Finanziario del Fitness</strong>.
                                La nostra visione è semplice: abbattere le barriere d'ingresso per il coaching di alta qualità attraverso una micro-economia interna efficiente e virale.
                                Sostituiamo le transazioni rigide in valuta fiat con un sistema fluido e gamificato: il FitCoin.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <ScrollReveal animation="fade-up" delay={200}>
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold mb-6">
                                        <Wallet className="w-5 h-5" />
                                        Il Sistema FitCoin (FC)
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 mb-6">Valuta Interna ad Alta Velocità</h3>
                                    <p className="text-slate-600 mb-6 text-lg">
                                        Il FitCoin (1 FC ≈ 1€) è il carburante della nostra piattaforma. Elimina le frizioni dei pagamenti tradizionali e abilita una monetizzazione "invisibile" per noi e conveniente per l'utente.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            { title: "Cash Flow Immediato", desc: "Gli utenti acquistano pacchetti (es. 500 FC). Incassiamo subito, paghiamo i trainer solo all'erogazione." },
                                            { title: "Convenienza & Bonus", desc: "Più ricarichi, più ottieni bonus. Un incentivo psicologico potente che aumenta il LTV (Lifetime Value)." },
                                            { title: "Micro-Transazioni", desc: "Permette di pagare anche singoli esercizi o check-up veloci senza commissioni bancarie su ogni operazione." },
                                            { title: "Breakage", desc: "I crediti residui non spesi rimangono nel sistema, massimizzando il margine operativo." }
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4">
                                                <div className="bg-green-500 w-2 h-2 rounded-full mt-2.5 flex-shrink-0" />
                                                <div>
                                                    <strong className="text-slate-900 block">{item.title}</strong>
                                                    <span className="text-slate-500">{item.desc}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal animation="scale-in" delay={400}>
                                <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                                    <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <ShieldCheck className="text-green-400" />
                                        Referral Virale: Il Motore di Crescita
                                    </h4>
                                    <p className="text-slate-300 mb-8 leading-relaxed">
                                        Il nostro sistema di referral trasforma ogni utente in un ambassador. Non offriamo sconti percentuali complessi, ma <strong>FitCoin reali</strong>.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                            <div className="text-3xl font-bold text-green-400 mb-1">+15 FC</div>
                                            <div className="text-sm text-slate-400">Al Referrer</div>
                                        </div>
                                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                            <div className="text-3xl font-bold text-green-400 mb-1">+15 FC</div>
                                            <div className="text-sm text-slate-400">Al Nuovo Utente</div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-400 italic border-l-4 border-green-500 pl-4">
                                        "La percezione di guadagnare 'soldi' (FitCoin) da spendere subito è 3x più efficace di uno sconto differito."
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
                            <ScrollReveal delay={200}>
                                <Card className="border-t-4 border-blue-500 shadow-lg hover:shadow-xl transition-shadow h-full hover-lift">
                                    <CardHeader>
                                        <PieChart className="w-10 h-10 text-blue-600 mb-4" />
                                        <CardTitle>Marketplace Fee</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 mb-4">
                                            Monetizziamo ogni transazione. Tratteniamo una commissione dinamica quando i trainer convertono i FC in Euro.
                                        </p>
                                        <ul className="list-disc pl-5 text-sm text-slate-500 space-y-2">
                                            <li><strong>Standard</strong>: 15% Fee</li>
                                            <li><strong>Pro</strong>: 8% Fee + Subscription</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>

                            <ScrollReveal delay={400}>
                                <Card className="border-t-4 border-amber-500 shadow-lg hover:shadow-xl transition-shadow h-full hover-lift">
                                    <CardHeader>
                                        <ArrowUpRight className="w-10 h-10 text-amber-600 mb-4" />
                                        <CardTitle>Partnership Strategiche</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 mb-4">
                                            Integriamo brand leader (es. MyProtein) nei pacchetti "Top-Up".
                                        </p>
                                        <ul className="list-disc pl-5 text-sm text-slate-500 space-y-2">
                                            <li><strong>Coupon Sbloccabili</strong>: Depositi più alti sbloccano sconti esclusivi.</li>
                                            <li><strong>Revenue Share</strong>: Guadagniamo su ogni vendita affiliata generata.</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>

                            <ScrollReveal delay={600}>
                                <Card className="border-t-4 border-purple-500 shadow-lg hover:shadow-xl transition-shadow h-full hover-lift">
                                    <CardHeader>
                                        <Users className="w-10 h-10 text-purple-600 mb-4" />
                                        <CardTitle>Trainer Subscription</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 mb-4">
                                            I Trainer professionisti pagano un abbonamento mensile per strumenti avanzati.
                                        </p>
                                        <ul className="list-disc pl-5 text-sm text-slate-500 space-y-2">
                                            <li><strong>CRM Clienti</strong>: Gestione schede e progressi.</li>
                                            <li><strong>Analytics</strong>: Dati su ritenzione e guadagni.</li>
                                            <li><strong>Visibility Boost</strong>: Priorità nei risultati di ricerca.</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Growth Stats Section (Mock) */}
                <ScrollReveal animation="scale-in" delay={300}>
                    <div className="bg-white rounded-2xl p-12 shadow-xl mb-20">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Projected Growth Metrics</h2>
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-slate-900 mb-2">
                                    <CountUp end={15} suffix="k+" duration={2500} />
                                </div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide">Active Users (Y1)</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    <CountUp end={2.5} suffix="M€" decimals={1} duration={3000} />
                                </div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide">Gross Volume</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    <CountUp end={350} suffix="k€" duration={2800} />
                                </div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide">Projected Revenue</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-amber-500 mb-2">
                                    <CountUp end={30} suffix="%" duration={2000} />
                                </div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide">MoM Growth</div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

            </div>

            {/* Final CTA */}
            <ScrollReveal delay={400}>
                <div className="container mx-auto px-4 text-center pb-20">
                    <Button
                        className="text-xl md:text-2xl px-10 py-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-heartbeat"
                        onClick={() => navigate('/register')}
                    >
                        Richiedi il Business Plan Completo 🚀
                    </Button>
                    <p className="mt-4 text-slate-500">
                        Unisciti a oltre 15k+ utenti attivi.
                    </p>
                </div>
            </ScrollReveal>

            <footer className="bg-slate-900 text-slate-400 py-12 text-center">
                <p>© 2025 Gym Connect AI. Confidential Investor materials.</p>
            </footer>
        </div>
    );
};

export default InvestorPage;
