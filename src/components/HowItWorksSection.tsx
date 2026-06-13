import React from 'react';
import { Search, BrainCircuit, MapPin, Smile, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Come Funziona Gym Connect AI
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Inizia il tuo percorso fitness in 3 semplici passi.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Connecting Line (Desktop) - Adjusted for 3 columns */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1: Profile */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 bg-lime-100 text-lime-700 rounded-full flex items-center justify-center mb-6 text-3xl shadow-sm border-4 border-white">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Crea il Profilo</h3>
                            <p className="text-slate-600 mb-4">
                                Raccontaci i tuoi obiettivi, il tuo budget e la tua zona. L'AI troverà i Trainer e le Palestre perfette per te.
                            </p>
                            <div className="mt-auto bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Gratuito
                            </div>
                        </div>

                        {/* Step 2: FitCoin */}
                        <div className="bg-gradient-to-b from-indigo-50/50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300 transform scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                Novità
                            </div>
                            <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-6 text-3xl shadow-lg border-4 border-indigo-100">
                                <BrainCircuit className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Ricarica FitCoin</h3>
                            <p className="text-slate-600 mb-4">
                                Acquista pacchetti di crediti e ottieni subito <strong>Coupon Sconto</strong> dai nostri partner (Adidas, MyProtein).
                            </p>
                            <div className="mt-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                + Vantaggi
                            </div>
                        </div>

                        {/* Step 3: Train */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 bg-violet-100 text-violet-650 rounded-full flex items-center justify-center mb-6 text-3xl shadow-sm border-4 border-white">
                                <Smile className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Allenati</h3>
                            <p className="text-slate-600 mb-4">
                                Prenota sessioni con un click. Niente abbonamenti fissi, paghi solo quello che consumi con i tuoi FitCoin.
                            </p>
                            <div className="mt-auto bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Flessibile
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why FitCoin Section */}
                <div className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2">
                            <h3 className="text-3xl font-bold mb-4">Perché usiamo i FitCoin?</h3>
                            <p className="text-slate-300 mb-6 text-lg">
                                Abbiamo eliminato la complessità dei pagamenti in Euro per ogni singola sessione.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-lime-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white block">Transazioni Istantanee</strong>
                                        <span className="text-slate-400 text-sm">Prenota e disdici in un secondo senza attendere rimborsi bancari.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-lime-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white block">Bonus e Rewards</strong>
                                        <span className="text-slate-400 text-sm">Più ricarichi, più ricevi valore extra e sconti sui tuoi brand preferiti.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            {/* Visual representation of FitCoin */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-sm w-full">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-slate-400 text-sm">Il tuo Saldo</span>
                                    <BrainCircuit className="text-lime-400 w-6 h-6" />
                                </div>
                                <div className="text-5xl font-bold text-white mb-2">150 <span className="text-lime-400">FC</span></div>
                                <div className="text-sm text-lime-400 mb-8">+15 FC Bonus ottenuti</div>
                                <div className="space-y-3">
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-lime-400 w-[70%]"></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Starter</span>
                                        <span>Pro</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
