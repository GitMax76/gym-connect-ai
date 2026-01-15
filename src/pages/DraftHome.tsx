import React from 'react';
import UniversalHero from '@/components/UniversalHero';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DraftHome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
            {/* Simple Floating Nav for Draft */}
            <nav className="fixed top-0 inset-x-0 z-50 p-4 flex justify-between items-center bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="text-xl font-bold text-white tracking-tighter">
                    GymConnect<span className="text-green-500">AI</span>
                </div>
                <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => navigate('/login')}>
                    Accedi
                </Button>
            </nav>

            <UniversalHero />

            {/* SECTIONS */}
            <div className="relative z-10">

                {/* 1. ATHLETE SECTION */}
                <section id="athletes" className="py-24 bg-slate-900/50">
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="fade-right">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-3xl opacity-50"></div>
                                <div className="relative bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                                    <div className="flex gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                                        <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                                        <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                                    </div>
                                    <p className="text-slate-400 italic">"Ho trovato il coach di Powerlifting perfetto a 2km da casa."</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal animation="fade-left">
                            <span className="text-green-500 font-semibold tracking-wider text-sm">PER ATLETI</span>
                            <h2 className="text-4xl font-bold text-white mt-2 mb-6">Non cerchi, trovi.</h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                L’AI abbina il tuo stile (powerlifter, wellness, busy pro) con trainer verificati e palestre vicine.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> <span>Match Istantaneo con IA</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> <span>Paghi solo le sessioni reali</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> <span>Accesso a palestre premium</span></li>
                            </ul>
                            <Button
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8"
                                onClick={() => navigate('/register?role=user')}
                            >
                                Inizia match gratuito
                            </Button>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 2. TRAINER SECTION */}
                <section id="trainers" className="py-24 bg-slate-950 border-t border-slate-900">
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <ScrollReveal animation="fade-right" className="order-2 md:order-1">
                            <span className="text-blue-500 font-semibold tracking-wider text-sm">PER TRAINER</span>
                            <h2 className="text-4xl font-bold text-white mt-2 mb-6">Da Freelance a CEO.</h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                Lead pronti, pagamenti protetti, CRM integrato. Dimentica la vendita e concentrati sull'allenamento.
                            </p>
                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="p-4 bg-blue-900/10 rounded-xl border border-blue-500/20">
                                    <div className="text-3xl font-bold text-white">+10h</div>
                                    <div className="text-sm text-blue-400">Recuperate/settimana</div>
                                </div>
                                <div className="p-4 bg-blue-900/10 rounded-xl border border-blue-500/20">
                                    <div className="text-3xl font-bold text-white">Zero</div>
                                    <div className="text-sm text-blue-400">Costi fissi mensili</div>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
                                onClick={() => navigate('/register?role=instructor')}
                            >
                                Unisciti come Pro
                            </Button>
                        </ScrollReveal>
                        <ScrollReveal animation="fade-left" className="order-1 md:order-2">
                            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <div className="w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                                </div>
                                {/* Mock UI for CRM */}
                                <div className="space-y-4 opacity-80">
                                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                                    <div className="h-20 bg-slate-800 rounded w-full mt-4"></div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 3. GYM SECTION */}
                <section id="gyms" className="py-24 bg-slate-900/50 border-t border-slate-900">
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="fade-right">
                            <div className="bg-gradient-to-br from-orange-500/10 to-slate-900 p-1 rounded-2xl">
                                <div className="bg-slate-950 p-8 rounded-xl h-full">
                                    <div className="flex items-end gap-2 mb-2">
                                        <div className="h-24 w-8 bg-orange-500 rounded-t"></div>
                                        <div className="h-16 w-8 bg-slate-700 rounded-t"></div>
                                        <div className="h-32 w-8 bg-green-500 rounded-t"></div>
                                        <div className="h-20 w-8 bg-slate-700 rounded-t"></div>
                                    </div>
                                    <p className="text-center text-sm text-slate-500 mt-4">Analisi Occupazione Sale</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal animation="fade-left">
                            <span className="text-orange-500 font-semibold tracking-wider text-sm">PER PALESTRE</span>
                            <h2 className="text-4xl font-bold text-white mt-2 mb-6">Hub Liquido.</h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                Monetizza spazi off-peak con PT esterni e utenti profilati. Trasforma i costi fissi in ricavi dinamici.
                            </p>
                            <div className="mb-10">
                                <div className="text-5xl font-bold text-white mb-2">80%</div>
                                <div className="text-slate-400">Utilizzo medio sale (vs 35% standard)</div>
                            </div>
                            <Button
                                size="lg"
                                className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8"
                                onClick={() => navigate('/register?role=gym')}
                            >
                                Richiedi Analisi Rendimento
                            </Button>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 4. SPONSOR SECTION */}
                <section id="sponsors" className="py-24 bg-black border-t border-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <ScrollReveal animation="scale-in">
                            <span className="inline-block py-1 px-3 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold tracking-wider mb-6">
                                PER BRAND & PARTNER
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Own the Moment.</h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                                Inserisci il tuo brand nel momento di massima endorfina: il post-workout.
                                Ads contestuali, reward sbloccabili, zero sprechi.
                            </p>

                            <div className="max-w-md mx-auto bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-black">P</div>
                                    <div className="text-left">
                                        <div className="font-bold text-white">Protein Power</div>
                                        <div className="text-xs text-slate-500">Sponsor Premium</div>
                                    </div>
                                </div>
                                <div className="h-32 bg-slate-800 rounded-lg mb-4 flex items-center justify-center text-slate-600">
                                    [Ad Visual: Shake Gratuito]
                                </div>
                                <p className="text-sm text-slate-300 text-left">
                                    "Hai bruciato 600kcal! Riscatta la tua barretta gratuita ora."
                                </p>
                            </div>

                            <Button
                                size="lg"
                                variant="outline"
                                className="border-purple-500 text-purple-400 hover:bg-purple-950 hover:text-white rounded-full px-8"
                                onClick={() => navigate('/contact')}
                            >
                                Diventa Partner
                            </Button>
                        </ScrollReveal>
                    </div>
                </section>

                {/* UNIFIED FINAL CTA */}
                <section className="py-32 bg-gradient-to-b from-slate-900 to-slate-950 text-center">
                    <div className="container mx-auto px-4">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                Non sai da dove iniziare?
                            </h2>
                            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                                <Button className="h-16 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-200 text-lg font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group">
                                    <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                                    Guarda il Tour AI (30s)
                                </Button>
                            </div>
                            <p className="mt-8 text-sm text-slate-500">
                                Anche per Enti Pubblici: <a href="#" className="underline hover:text-slate-300">Scopri il Welfare Sportivo Digitale</a>
                            </p>
                        </ScrollReveal>
                    </div>
                </section>

                <footer className="py-8 bg-black text-center text-slate-600 text-sm border-t border-slate-900">
                    &copy; 2025 Gym Connect AI. Draft Version.
                </footer>
            </div>
        </div>
    );
};

export default DraftHome;
