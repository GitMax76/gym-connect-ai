import React from 'react';
import UniversalHero from '@/components/UniversalHero';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useLanguage } from '@/contexts/LanguageContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { popover: { title: 'Benvenuto in Gym Connect AI', description: 'La piattaforma universale che connette l\'intero ecosistema del fitness in pochi click.' } },
        { element: '#tour-athlete', popover: { title: 'Sei un Atleta?', description: 'Trova il trainer perfetto e la palestra ideale. L\'AI analizza il tuo stile e ti propone i match migliori.' } },
        { element: '#tour-trainer', popover: { title: 'Sei un Trainer?', description: 'Gestisci i tuoi clienti, ricevi pagamenti sicuri e aumenta le tue entrate senza costi fissi.' } },
        { element: '#tour-gym', popover: { title: 'Gestisci una Palestra?', description: 'Monetizza gli orari morti ospitando trainer esterni e utenti occasionali.' } },
        { element: '#tour-sponsor', popover: { title: 'Sei un Brand?', description: 'Inserisci i tuoi prodotti nel momento perfetto: il post-workout reward.' } },
        { popover: { title: 'Pronto a iniziare?', description: 'Scegli la tua categoria qui sopra e inizia la rivoluzione fitness!' } }
      ]
    });

    driverObj.drive();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <UniversalHero />

      {/* SECTIONS */}
      <div className="relative z-10">

        {/* 1. ATHLETE SECTION */}
        <section id="athletes" className="py-24 bg-white">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="fade-right">
              <div className="relative">
                <div className="absolute -inset-4 bg-green-200/50 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                    <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                    <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  </div>
                  <p className="text-slate-600 italic">"Ho trovato il coach di Powerlifting perfetto a 2km da casa."</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-left">
              <span className="text-green-600 font-semibold tracking-wider text-sm">{t('section.athlete.title')}</span>
              <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">{t('section.athlete.heading')}</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {t('section.athlete.desc')}
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3"><CheckCircle className="text-green-600 w-5 h-5" /> <span>Match Istantaneo con IA</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="text-green-600 w-5 h-5" /> <span>Paghi solo le sessioni reali</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="text-green-600 w-5 h-5" /> <span>Accesso a palestre premium</span></li>
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
        <section id="trainers" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <ScrollReveal animation="fade-right" className="order-2 md:order-1">
              <span className="text-blue-600 font-semibold tracking-wider text-sm">PER TRAINER</span>
              <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">Da Freelance a CEO.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Lead pronti, pagamenti protetti, CRM integrato. Dimentica la vendita e concentrati sull'allenamento.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-900">+10h</div>
                  <div className="text-sm text-blue-600">Recuperate/settimana</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-900">Zero</div>
                  <div className="text-sm text-blue-600">Costi fissi mensili</div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
                onClick={() => navigate('/register?role=instructor')}
              >
                {t('hero.cta.trainer')}
              </Button>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" className="order-1 md:order-2">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <div className="w-32 h-32 bg-blue-100 rounded-full blur-3xl"></div>
                </div>
                {/* Mock UI for CRM */}
                <div className="space-y-4 opacity-80">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-20 bg-slate-100 rounded w-full mt-4"></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 3. GYM SECTION */}
        <section id="gyms" className="py-24 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="fade-right">
              <div className="bg-gradient-to-br from-orange-100 to-slate-50 p-1 rounded-2xl">
                <div className="bg-white p-8 rounded-xl h-full shadow-lg">
                  <div className="flex items-end gap-2 mb-2">
                    <div className="h-24 w-8 bg-orange-400 rounded-t"></div>
                    <div className="h-16 w-8 bg-slate-200 rounded-t"></div>
                    <div className="h-32 w-8 bg-green-400 rounded-t"></div>
                    <div className="h-20 w-8 bg-slate-200 rounded-t"></div>
                  </div>
                  <p className="text-center text-sm text-slate-500 mt-4">Analisi Occupazione Sale</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-left">
              <span className="text-orange-600 font-semibold tracking-wider text-sm">PER PALESTRE</span>
              <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">Hub Liquido.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Monetizza spazi off-peak con PT esterni e utenti profilati. Trasforma i costi fissi in ricavi dinamici.
              </p>
              <div className="mb-10">
                <div className="text-5xl font-bold text-slate-900 mb-2">80%</div>
                <div className="text-slate-600">Utilizzo medio sale (vs 35% standard)</div>
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
        <section id="sponsors" className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-50 mix-blend-multiply"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <ScrollReveal animation="scale-in">
              <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-600 text-xs font-bold tracking-wider mb-6">
                PER BRAND & PARTNER
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Own the Moment.</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                Inserisci il tuo brand nel momento di massima endorfina: il post-workout.
                Ads contestuali, reward sbloccabili, zero sprechi.
              </p>

              <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-200 mb-10 transform rotate-1 hover:rotate-0 transition-transform duration-500 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-black">P</div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">Protein Power</div>
                    <div className="text-xs text-slate-500">Sponsor Premium</div>
                  </div>
                </div>
                <div className="h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-500">
                  [Ad Visual: Shake Gratuito]
                </div>
                <p className="text-sm text-slate-600 text-left">
                  "Hai bruciato 600kcal! Riscatta la tua barretta gratuita ora."
                </p>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-full px-8"
                onClick={() => navigate('/contact')}
              >
                Diventa Partner
              </Button>
            </ScrollReveal>
          </div>
        </section>

        {/* UNIFIED FINAL CTA */}
        <section className="py-32 bg-slate-50 text-center border-t border-slate-200">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                Non sai da dove iniziare?
              </h2>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button
                  className="h-16 px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-lg font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group"
                  onClick={startTour}
                >
                  <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                  Avvia Tour Interattivo (AI)
                </Button>
              </div>
              <p className="mt-8 text-sm text-slate-500">
                Anche per Enti Pubblici: <a href="#" className="underline hover:text-slate-800">Scopri il Welfare Sportivo Digitale</a>
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
