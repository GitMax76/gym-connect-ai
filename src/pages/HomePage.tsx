import React from 'react';
import UniversalHero from '@/components/UniversalHero';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { brandNameFull } = useBranding();

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
      <div className="bg-slate-50 font-sans text-slate-900">
        <UniversalHero />

        {/* SECTIONS */}
        <div className="relative z-10">

          {/* 1. ATHLETE SECTION */}
          <section id="athletes" className="py-24 bg-white">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal animation="fade-right">
                <div className="relative">
                  <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
                  <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200 shadow-xl">
                    <div className="flex gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
                      <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
                      <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
                    </div>
                    <p className="text-slate-600 italic">"Ho trovato il coach di Powerlifting perfetto a 2km da casa."</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-left">
                <span className="text-indigo-600 font-semibold tracking-wider text-sm">{t('section.athlete.title')}</span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">{t('section.athlete.heading')}</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {t('section.athlete.desc')}
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3"><CheckCircle className="text-indigo-600 w-5 h-5" /> <span>{t('section.athlete.feat1')}</span></li>
                  <li className="flex items-center gap-3"><CheckCircle className="text-indigo-600 w-5 h-5" /> <span>{t('section.athlete.feat2')}</span></li>
                  <li className="flex items-center gap-3"><CheckCircle className="text-indigo-600 w-5 h-5" /> <span>{t('section.athlete.feat3')}</span></li>
                </ul>
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 transition-all hover:shadow-lg active:scale-95"
                  onClick={() => navigate('/register?role=user')}
                >
                  {t('hero.cta.user')}
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* 2. TRAINER SECTION */}
          <section id="trainers" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal animation="fade-right" className="order-2 md:order-1">
                <span className="text-indigo-600 font-semibold tracking-wider text-sm">{t('section.trainer.title')}</span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">{t('section.trainer.heading')}</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {t('section.trainer.desc')}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <div className="text-3xl font-bold text-indigo-900">{t('section.trainer.stat1.val')}</div>
                    <div className="text-sm text-indigo-600">{t('section.trainer.stat1.label')}</div>
                  </div>
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <div className="text-3xl font-bold text-indigo-900">{t('section.trainer.stat2.val')}</div>
                    <div className="text-sm text-indigo-600">{t('section.trainer.stat2.label')}</div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 transition-all hover:shadow-lg active:scale-95"
                  onClick={() => navigate('/register?role=instructor')}
                >
                  {t('hero.cta.trainer')}
                </Button>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" className="order-1 md:order-2">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-50">
                    <div className="w-32 h-32 bg-indigo-100 rounded-full blur-3xl"></div>
                  </div>
                  {/* Mock UI for CRM */}
                  <div className="space-y-4 opacity-80">
                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                    <div className="h-20 bg-slate-100 rounded w-full mt-4 flex items-center justify-center text-xs text-slate-400 font-mono">
                      [FitFlow CRM dashboard mock]
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* 3. GYM SECTION */}
          <section id="gyms" className="py-24 bg-white border-t border-slate-200">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal animation="fade-right">
                <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-1 rounded-2xl">
                  <div className="bg-white p-8 rounded-xl h-full shadow-lg">
                    <div className="flex items-end gap-2 mb-2">
                      <div className="h-24 w-8 bg-indigo-400 rounded-t animate-pulse"></div>
                      <div className="h-16 w-8 bg-slate-200 rounded-t animate-pulse"></div>
                      <div className="h-32 w-8 bg-lime-400 rounded-t animate-pulse"></div>
                      <div className="h-20 w-8 bg-slate-200 rounded-t animate-pulse"></div>
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-4">{t('section.gym.stat.label')}</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-left">
                <span className="text-indigo-600 font-semibold tracking-wider text-sm">{t('section.gym.title')}</span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">{t('section.gym.heading')}</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {t('section.gym.desc')}
                </p>
                <div className="mb-10">
                  <div className="text-5xl font-bold text-slate-900 mb-2">{t('section.gym.stat.val')}</div>
                  <div className="text-slate-600">{t('section.gym.stat.label')}</div>
                </div>
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 transition-all hover:shadow-lg active:scale-95"
                  onClick={() => navigate('/register?role=gym')}
                >
                  {t('section.gym.cta')}
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* 4. SPONSOR SECTION */}
          <section id="sponsors" className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
              <ScrollReveal animation="scale-in">
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold tracking-wider mb-6">
                  {t('section.sponsor.title')}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('section.sponsor.heading')}</h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                  {t('section.sponsor.desc')}
                </p>

                <div className="max-w-md mx-auto bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 mb-10 transform rotate-1 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">P</div>
                    <div className="text-left">
                      <div className="font-bold text-white">{t('section.sponsor.mock.title')}</div>
                      <div className="text-xs text-slate-400">{t('section.sponsor.mock.label')}</div>
                    </div>
                  </div>
                  <div className="h-32 bg-slate-900 rounded-lg mb-4 flex items-center justify-center text-slate-500 border border-slate-800 text-sm">
                    {t('section.sponsor.mock.ad')}
                  </div>
                  <p className="text-sm text-slate-300 text-left italic">
                    {t('section.sponsor.mock.desc')}
                  </p>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-indigo-400 text-indigo-300 hover:bg-slate-800 rounded-full px-8 transition-all active:scale-95"
                  onClick={() => navigate('/contact')}
                >
                  {t('section.sponsor.cta')}
                </Button>
              </ScrollReveal>
            </div>
          </section>

          {/* UNIFIED FINAL CTA */}
          <section className="py-32 bg-slate-50 text-center border-t border-slate-200">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                  {t('section.final.title')}
                </h2>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                  <Button
                    className="h-16 px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-lg font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group active:scale-95"
                    onClick={startTour}
                  >
                    <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                    {t('section.final.cta')}
                  </Button>
                </div>
                <p className="mt-8 text-sm text-slate-500">
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
