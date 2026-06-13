import React from 'react';
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Building2, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

const UniversalHero = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { brandNameFull } = useBranding();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative min-h-[85vh] bg-slate-50 flex flex-col justify-center overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] animate-pulse z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-100/30 rounded-full blur-[100px] animate-pulse delay-1000 z-0" />

            <div className="container mx-auto px-4 relative z-10 py-16">

                {/* Main Headline */}
                <div className="text-center max-w-5xl mx-auto mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-indigo-700 text-sm font-medium mb-6 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                        {t('hero.tagline')}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight whitespace-pre-line">
                        {brandNameFull}: {t('hero.title').split('\n')[0]}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-lime-500">
                            {t('hero.title').split('\n')[1] || ''}
                        </span>
                    </h1>
                </div>

                {/* The Choice Matrix (4 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

                    {/* Athlete */}
                    <div id="tour-athlete" className="group relative bg-white/70 backdrop-blur-md border border-slate-250/60 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100/50 transition-colors">
                            <Dumbbell className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('hero.choice.athlete.title')}</h3>
                        <p className="text-slate-600 text-sm mb-6 h-10 flex items-center justify-center">
                            {t('hero.choice.athlete.desc')}
                        </p>
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all hover:shadow-md active:scale-98"
                            onClick={() => scrollToSection('athletes')}
                        >
                            {t('hero.choice.athlete.cta')}
                        </Button>
                    </div>

                    {/* Trainer */}
                    <div id="tour-trainer" className="group relative bg-white/70 backdrop-blur-md border border-slate-250/60 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100/50 transition-colors">
                            <Users className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('hero.choice.trainer.title')}</h3>
                        <p className="text-slate-600 text-sm mb-6 h-10 flex items-center justify-center">
                            {t('hero.choice.trainer.desc')}
                        </p>
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all hover:shadow-md active:scale-98"
                            onClick={() => scrollToSection('trainers')}
                        >
                            {t('hero.choice.trainer.cta')}
                        </Button>
                    </div>

                    {/* Gym */}
                    <div id="tour-gym" className="group relative bg-white/70 backdrop-blur-md border border-slate-250/60 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100/50 transition-colors">
                            <Building2 className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('hero.choice.gym.title')}</h3>
                        <p className="text-slate-600 text-sm mb-6 h-10 flex items-center justify-center">
                            {t('hero.choice.gym.desc')}
                        </p>
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all hover:shadow-md active:scale-98"
                            onClick={() => scrollToSection('gyms')}
                        >
                            {t('hero.choice.gym.cta')}
                        </Button>
                    </div>

                    {/* Sponsor */}
                    <div id="tour-sponsor" className="group relative bg-white/70 backdrop-blur-md border border-slate-250/60 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100/50 transition-colors">
                            <Megaphone className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('hero.choice.sponsor.title')}</h3>
                        <p className="text-slate-600 text-sm mb-6 h-10 flex items-center justify-center">
                            {t('hero.choice.sponsor.desc')}
                        </p>
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all hover:shadow-md active:scale-98"
                            onClick={() => scrollToSection('sponsors')}
                        >
                            {t('hero.choice.sponsor.cta')}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UniversalHero;
