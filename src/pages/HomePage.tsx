import React, { useState, useEffect } from 'react';
import UniversalHero from '@/components/UniversalHero';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle, Sparkles, TrendingUp, Calendar, DollarSign, Award, Target, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { brandNameFull } = useBranding();
  const isEn = language === 'EN';

  // State to manage active section for sticky sub-nav highlight
  const [activeSection, setActiveSection] = useState('athletes');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['athletes', 'trainers', 'gyms', 'sponsors'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // Navbar + Sticky Subnav offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { popover: { title: `${t('tour.welcome.title')} (${brandNameFull})`, description: t('tour.welcome.desc') } },
        { element: '#tour-athlete', popover: { title: t('tour.athlete.title'), description: t('tour.athlete.desc') } },
        { element: '#tour-trainer', popover: { title: t('tour.trainer.title'), description: t('tour.trainer.desc') } },
        { element: '#tour-gym', popover: { title: t('tour.gym.title'), description: t('tour.gym.desc') } },
        { element: '#tour-sponsor', popover: { title: t('tour.sponsor.title'), description: t('tour.sponsor.desc') } },
        { popover: { title: t('tour.start.title'), description: t('tour.start.desc') } }
      ]
    });

    driverObj.drive();
  };

  return (
    <Layout>
      <div className="bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
        <UniversalHero />

        {/* Sticky Sub-Navigation Anchor Bar */}
        <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-4 hidden md:block select-none">
          <div className="container mx-auto px-4 flex justify-center gap-10 font-bold text-xs md:text-sm tracking-wider uppercase">
            <button
              onClick={() => scrollToSection('athletes')}
              className={`pb-1 transition-all border-b-2 hover:text-emerald-600 ${
                activeSection === 'athletes' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'
              }`}
            >
              {isEn ? "Athletes" : "Atleti / Utenti"}
            </button>
            <button
              onClick={() => scrollToSection('trainers')}
              className={`pb-1 transition-all border-b-2 hover:text-emerald-600 ${
                activeSection === 'trainers' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'
              }`}
            >
              {isEn ? "Personal Trainers" : "Personal Trainers"}
            </button>
            <button
              onClick={() => scrollToSection('gyms')}
              className={`pb-1 transition-all border-b-2 hover:text-emerald-600 ${
                activeSection === 'gyms' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'
              }`}
            >
              {isEn ? "Fitness Centers" : "Centri Fitness"}
            </button>
            <button
              onClick={() => scrollToSection('sponsors')}
              className={`pb-1 transition-all border-b-2 hover:text-emerald-600 ${
                activeSection === 'sponsors' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'
              }`}
            >
              {isEn ? "Sponsors" : "Sponsor & Brand"}
            </button>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="relative z-10">

          {/* 1. ATHLETE SECTION */}
          <section id="athletes" className="py-24 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
              <ScrollReveal animation="fade-right">
                <div className="relative">
                  <div className="absolute -inset-4 bg-emerald-100 rounded-full blur-3xl opacity-40"></div>
                  {/* High Fidelity Mock UI for Athlete Matching */}
                  <div className="relative bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                          <Target className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
                          {isEn ? "Smart Match Calculator" : "Calcolatore Compatibilità"}
                        </span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                        Active AI
                      </span>
                    </div>
                    
                    {/* Simulated Results Card */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-55 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
                            MS
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">Marco S.</h4>
                            <p className="text-xs text-slate-500 font-semibold">{isEn ? "Powerlifting Coach" : "Coach di Powerlifting"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-650 text-sm font-extrabold">98% Match</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">2.4 km {isEn ? "away" : "da te"}</div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-sm italic font-medium leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                        {isEn 
                          ? '"I found the perfect Powerlifting coach 2km from home, with direct access to local partner gyms without subscriptions!"'
                          : '"Ho trovato il coach di Powerlifting perfetto a 2km da casa, con accesso diretto alle palestre partner senza abbonamenti!"'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal animation="fade-left">
                <span className="text-emerald-600 font-extrabold tracking-widest text-xs uppercase bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100">
                  {t('section.athlete.title')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-5 mb-6 tracking-tight leading-tight">
                  {t('section.athlete.heading')}
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                  {t('section.athlete.desc')}
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3 text-slate-800 font-semibold">
                    <CheckCircle className="text-emerald-600 w-5.5 h-5.5 mt-0.5 flex-shrink-0 stroke-[2.5]" /> 
                    <span>{t('section.athlete.feat1')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-800 font-semibold">
                    <CheckCircle className="text-emerald-600 w-5.5 h-5.5 mt-0.5 flex-shrink-0 stroke-[2.5]" /> 
                    <span>{t('section.athlete.feat2')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-800 font-semibold">
                    <CheckCircle className="text-emerald-600 w-5.5 h-5.5 mt-0.5 flex-shrink-0 stroke-[2.5]" /> 
                    <span>{t('section.athlete.feat3')}</span>
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="bg-emerald-650 hover:bg-emerald-700 text-white rounded-2xl px-8 py-6 font-bold shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  onClick={() => navigate('/register?role=user')}
                >
                  <span>{t('hero.cta.user')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* 2. TRAINER SECTION */}
          <section id="trainers" className="py-24 bg-slate-50/70 border-b border-slate-200/60">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
              <ScrollReveal animation="fade-right" className="order-2 md:order-1">
                <span className="text-emerald-600 font-extrabold tracking-widest text-xs uppercase bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100">
                  {t('section.trainer.title')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-5 mb-6 tracking-tight leading-tight">
                  {t('section.trainer.heading')}
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                  {t('section.trainer.desc')}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl font-extrabold text-slate-900 mb-1">{t('section.trainer.stat1.val')}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('section.trainer.stat1.label')}</div>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl font-extrabold text-slate-900 mb-1">{t('section.trainer.stat2.val')}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('section.trainer.stat2.label')}</div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-emerald-650 hover:bg-emerald-700 text-white rounded-2xl px-8 py-6 font-bold shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  onClick={() => navigate('/register?role=instructor')}
                >
                  <span>{t('hero.cta.trainer')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </ScrollReveal>
              
              <ScrollReveal animation="fade-left" className="order-1 md:order-2">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden space-y-6">
                  {/* High Fidelity CRM Mock UI */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                      <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                        {isEn ? "Trainer CRM Dashboard" : "CRM Coach Dashboard"}
                      </span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-emerald-600 bg-emerald-50 p-1.5 rounded-lg" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isEn ? "Revenue (Mo)" : "Ricavi (Mese)"}</div>
                        <div className="font-extrabold text-slate-800 text-base">€2.840</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-emerald-600 bg-emerald-50 p-1.5 rounded-lg" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isEn ? "Sessions" : "Allenamenti"}</div>
                        <div className="font-extrabold text-slate-800 text-base">38 {isEn ? "booked" : "avviati"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/60">
                    <div className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>{isEn ? "Next Scheduled Match" : "Prossimo Match Confermato"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-800">Chiara M.</div>
                        <div className="text-slate-500">{isEn ? "Weight Loss - 18:30 today" : "Perdita Peso - Oggi 18:30"}</div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-850 font-extrabold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wide">
                        {isEn ? "Ready" : "Pronto"}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* 3. GYM SECTION */}
          <section id="gyms" className="py-24 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
              <ScrollReveal animation="fade-right">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                        {isEn ? "Asset Occupancy Rate" : "Tasso di Utilizzo Spazi"}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 font-extrabold px-2.5 py-1 rounded-md">
                      +145% Revenue
                    </span>
                  </div>

                  {/* Tailwind-based Bar Chart showing utility growth */}
                  <div className="space-y-4 font-semibold text-xs">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-slate-700">
                        <span>{isEn ? "Standard Occupancy (Before)" : "Tasso di occupazione standard (Prima)"}</span>
                        <span className="font-extrabold text-slate-500">35%</span>
                      </div>
                      <div className="h-4 w-full bg-slate-200 rounded-lg overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-lg transition-all" style={{ width: '35%' }} />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-slate-800">
                        <span>{isEn ? "Occupancy with Gym-Connect AI" : "Tasso di occupazione con Gym-Connect AI"}</span>
                        <span className="font-extrabold text-emerald-600">85%</span>
                      </div>
                      <div className="h-4 w-full bg-slate-200 rounded-lg overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg transition-all" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium text-center italic bg-white p-3 rounded-xl border border-slate-100">
                    {isEn 
                      ? "Monetize dead hours by letting external trainers run private sessions for their clients."
                      : "Monetizza le ore morte consentendo a trainer esterni di condurre sessioni private per i loro atleti."
                    }
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal animation="fade-left">
                <span className="text-emerald-600 font-extrabold tracking-widest text-xs uppercase bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100">
                  {t('section.gym.title')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-5 mb-6 tracking-tight leading-tight">
                  {t('section.gym.heading')}
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                  {t('section.gym.desc')}
                </p>
                <div className="mb-10">
                  <div className="text-5xl font-black text-slate-900 mb-2">{t('section.gym.stat.val')}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('section.gym.stat.label')}</div>
                </div>
                <Button
                  size="lg"
                  className="bg-emerald-650 hover:bg-emerald-700 text-white rounded-2xl px-8 py-6 font-bold shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  onClick={() => navigate('/register?role=gym')}
                >
                  <span>{t('section.gym.cta')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* 4. SPONSOR SECTION */}
          <section id="sponsors" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 to-slate-950/50 mix-blend-multiply z-0"></div>
            <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
              <ScrollReveal animation="scale-in">
                <span className="inline-block py-1 px-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs font-extrabold tracking-widest uppercase mb-6">
                  {t('section.sponsor.title')}
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">{t('section.sponsor.heading')}</h2>
                <p className="text-lg md:text-xl text-slate-350 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                  {t('section.sponsor.desc')}
                </p>

                <div className="max-w-md mx-auto bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl border border-slate-800 mb-12 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-black text-slate-950 text-sm">Ad</div>
                    <div className="text-left">
                      <div className="font-extrabold text-white text-sm">{t('section.sponsor.mock.title')}</div>
                      <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">{t('section.sponsor.mock.label')}</div>
                    </div>
                  </div>
                  <div className="h-28 bg-slate-950 rounded-xl mb-4 flex items-center justify-center text-slate-400 border border-slate-800 text-xs font-bold uppercase tracking-wider bg-gradient-to-br from-slate-900/30 to-slate-950">
                    {t('section.sponsor.mock.ad')}
                  </div>
                  <p className="text-xs text-slate-300 text-left italic font-medium">
                    {t('section.sponsor.mock.desc')}
                  </p>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-white hover:bg-slate-900 hover:border-emerald-500/40 rounded-2xl px-8 py-6 font-bold transition-all hover:-translate-y-0.5 active:scale-95"
                  onClick={() => navigate('/contact')}
                >
                  {t('section.sponsor.cta')}
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* UNIFIED FINAL CTA */}
          <section className="py-32 bg-slate-50 text-center border-t border-slate-200/60">
            <div className="container mx-auto px-4 max-w-4xl">
              <ScrollReveal>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                  {t('section.final.title')}
                </h2>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                  <Button
                    className="h-16 px-10 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 text-lg font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group active:scale-95 border border-slate-800"
                    onClick={startTour}
                  >
                    <Play className="w-5 h-5 fill-current text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span>{t('section.final.cta')}</span>
                  </Button>
                </div>
                <p className="mt-8 text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  {t('section.final.welfare_prefix')} <a href="#" className="underline hover:text-slate-800">{t('section.final.welfare')}</a>
                </p>
              </ScrollReveal>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
