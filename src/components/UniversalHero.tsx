import React from 'react';
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Building2, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

const UniversalHero = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const { brandNameFull } = useBranding();
    const isEn = language === 'EN';

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative min-h-[95vh] bg-white flex flex-col justify-center overflow-hidden border-b border-slate-200/60">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-50/50 z-0" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] animate-pulse z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] animate-pulse delay-1000 z-0" />

            <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">

                {/* Main Headline */}
                <div className="text-center max-w-5xl mx-auto mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs md:text-sm font-extrabold mb-6 shadow-sm">
                        <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
                        <span className="uppercase tracking-wider">
                            {isEn ? "The On-Demand Fitness Revolution" : "La Rivoluzione del Fitness On-Demand"}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-none">
                        {brandNameFull}: <br className="hidden md:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-indigo-700">
                            {isEn ? "On-Demand Fitness Network" : "Il Network del Fitness On-Demand"}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
                        {isEn 
                            ? "We connect Athletes, Personal Trainers, and Fitness Centers in a single intelligent ecosystem. The technology that fills empty gym hours, optimizes coach schedules, and creates the perfect workout for you."
                            : "Connettiamo Atleti, Personal Trainer e Centri Fitness in un unico ecosistema intelligente. La tecnologia che riempie gli spazi vuoti delle palestre, ottimizza l'agenda dei coach e crea l'allenamento perfetto per te."
                        }
                    </p>
                </div>

                {/* The Choice Matrix (3 Columns representing the 3 Pillars) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">

                    {/* Pillar 1: Athlete */}
                    <div id="tour-athlete" className="group relative bg-white border-2 border-slate-100 hover:border-emerald-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between">
                        <div>
                            {/* Icon block */}
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors border border-emerald-100">
                                <Dumbbell className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                                {isEn ? "Athletes" : "Atleti / Utenti"}
                            </h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                                {isEn 
                                    ? "Achieve your fitness goals with total flexibility, wherever and whenever you want."
                                    : "Raggiungi i tuoi obiettivi con flessibilità totale, dove e quando vuoi."
                                }
                            </p>
                            
                            {/* Value points */}
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "Find the most suitable certified professional" : "Trova il professionista certificato più adatto"}</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "Choose your preferred location and time slot" : "Scegli liberamente luogo e fascia oraria"}</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "True on-demand fitness, pay per session" : "Esperienza fitness realmente on demand e a consumo"}</span>
                                </li>
                            </ul>
                        </div>
                        
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md group-hover:shadow-lg active:scale-98"
                          onClick={() => scrollToSection('athletes')}
                        >
                          <span>{isEn ? "Explore Athlete Info" : "Scopri per Atleti"}</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>

                    {/* Pillar 2: Trainer */}
                    <div id="tour-trainer" className="group relative bg-white border-2 border-slate-100 hover:border-emerald-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors border border-emerald-100">
                                <Users className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                                {isEn ? "Personal Trainers" : "Personal Trainer"}
                            </h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                                {isEn 
                                    ? "Grow your business, optimize your schedule, and manage your clients seamlessly."
                                    : "Fai crescere il tuo business, ottimizza l'agenda e gestisci i clienti senza burocrazia."
                                }
                            </p>
                            
                            {/* Value points */}
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "Acquire new matching clients in your area" : "Acquisisci nuovi clienti in target nella tua zona"}</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "Fill empty slots and optimize daily calendar" : "Ottimizza il tuo tempo e riempi le ore vuote"}</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "Integrated CRM dashboard for workouts & payments" : "CRM integrato per programmazione e pagamenti"}</span>
                                </li>
                            </ul>
                        </div>
                        
                        <Button
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md group-hover:shadow-lg active:scale-98"
                          onClick={() => scrollToSection('trainers')}
                        >
                          <span>{isEn ? "Explore Trainer Info" : "Scopri per Trainer"}</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>

                    {/* Pillar 3: Gym */}
                    <div id="tour-gym" className="group relative bg-white border-2 border-slate-100 hover:border-emerald-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors border border-emerald-100">
                                <Building2 className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                                {isEn ? "Fitness Centers" : "Centri Fitness"}
                            </h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                                {isEn 
                                    ? "Monetize unused facilities and welcome new users to your gym."
                                    : "Monetizza le attrezzature non utilizzate e ospita nuovi clienti nella tua struttura."
                                }
                            </p>
                            
                            {/* Value points */}
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "Monetize unused space and off-peak hours" : "Monetizza spazi e fasce orarie inutilizzate"}</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "Increase profitability of existing machinery" : "Aumenta la redditività e valorizza le risorse"}</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-slate-700 text-sm font-semibold">
                                    <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span>{isEn ? "Zero fixed costs, full control over slot access" : "Nessun costo di gestione, decidi tariffe e accessi"}</span>
                                </li>
                            </ul>
                        </div>
                        
                        <Button
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md group-hover:shadow-lg active:scale-98"
                          onClick={() => scrollToSection('gyms')}
                        >
                          <span>{isEn ? "Explore Gym Info" : "Scopri per Centri"}</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UniversalHero;
