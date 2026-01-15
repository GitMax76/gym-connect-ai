import React from 'react';
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Building2, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UniversalHero = () => {
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative min-h-[90vh] bg-slate-50 flex flex-col justify-center overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-[100px] animate-pulse z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] animate-pulse delay-1000 z-0" />

            <div className="container mx-auto px-4 relative z-10 py-20">

                {/* Main Headline */}
                <div className="text-center max-w-5xl mx-auto mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-green-700 text-sm font-medium mb-6 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        L'Ecosistema del Fitness 3.0
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                        Gym Connect AI: Trova il tuo trainer perfetto,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                            nella palestra giusta, subito.
                        </span>
                    </h1>
                </div>

                {/* The Choice Matrix (4 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">

                    {/* Athlete */}
                    <div id="tour-athlete" className="group relative bg-white border border-slate-200 hover:border-green-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200/50 transition-colors">
                            <Dumbbell className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Atleta / Appassionato</h3>
                        <p className="text-slate-600 text-sm mb-6 h-10 flex items-center justify-center">
                            Match perfetto: trainer + palestra + orario libero.
                        </p>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                            onClick={() => scrollToSection('athletes')}
                        >
                            Prova il match AI
                        </Button>
                    </div>

                    {/* Trainer */}
                    <div id="tour-trainer" className="group relative bg-white border border-slate-200 hover:border-blue-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200/50 transition-colors">
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Trainer / Coach</h3>
                        <p className="text-slate-600 text-sm mb-6 h-10 flex items-center justify-center">
                            Clienti qualificati, agenda piena, zero burocrazia.
                        </p>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            onClick={() => scrollToSection('trainers')}
                        >
                            Iscriviti Pro
                        </Button>
                    </div>

                    {/* Gym */}
                    <div id="tour-gym" className="group relative bg-white border border-slate-200 hover:border-orange-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200/50 transition-colors">
                            <Building2 className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Gestore Palestra</h3>
                        <p className="text-slate-600 text-sm mb-6 h-10 flex items-center justify-center">
                            Riempi ore vuote, revenue extra da utenza esterna.
                        </p>
                        <Button
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                            onClick={() => scrollToSection('gyms')}
                        >
                            Ottimizza spazi
                        </Button>
                    </div>

                    {/* Sponsor */}
                    <div id="tour-sponsor" className="group relative bg-white border border-slate-200 hover:border-purple-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200/50 transition-colors">
                            <Megaphone className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Sponsor / Brand</h3>
                        <p className="text-slate-600 text-sm mb-6 h-10 flex items-center justify-center">
                            Pubblicità nel momento post-allenamento, alta conversione.
                        </p>
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                            onClick={() => scrollToSection('sponsors')}
                        >
                            Marketing mirato
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UniversalHero;
