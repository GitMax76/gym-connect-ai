import React from 'react';
import { Search, BrainCircuit, MapPin, Smile, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Il Modello "Palestra di Quartiere"
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Come funziona il nostro motore di smart-matching
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Step 1: Trigger */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl shadow-sm border-4 border-white">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">1. La Domanda</h3>
                            <p className="text-sm text-slate-600">
                                Un Utente cerca "Pilates" alle 10:00 (orario tipicamente vuoto).
                            </p>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Trigger</div>
                        </div>

                        {/* Step 2: Engine */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 text-2xl shadow-sm border-4 border-white">
                                <BrainCircuit className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Il Matching</h3>
                            <p className="text-sm text-slate-600">
                                L'app trova un Trainer Specializzato libero in quella fascia oraria.
                            </p>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">AI Engine</div>
                        </div>

                        {/* Step 3: Asset */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 text-2xl shadow-sm border-4 border-white">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">3. La Location</h3>
                            <p className="text-sm text-slate-600">
                                L'app individua una Struttura con una sala disponibile alle 10:00.
                            </p>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Asset</div>
                        </div>

                        {/* Step 4: Result */}
                        <div className="bg-green-50 p-6 rounded-2xl shadow-md border border-green-200 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 text-2xl shadow-lg border-4 border-white">
                                <Smile className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-green-900 mb-2">4. Win-Win-Win</h3>
                            <ul className="text-sm text-green-800 space-y-1 text-left">
                                <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Utente soddisfatto</li>
                                <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Trainer pagato</li>
                                <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Palestra monetizzata</li>
                            </ul>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Risultato</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
