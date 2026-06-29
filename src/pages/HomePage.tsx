import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dumbbell, Users, Building2, Check, ArrowRight, Sparkles, TrendingUp, Calendar, 
  DollarSign, Award, Target, LayoutDashboard, HelpCircle, Phone, Play, Star, Clock, 
  Zap, ChevronDown, ChevronUp, ShieldCheck, Mail, MessageSquare, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { brandNameFull, brandInitials } = useBranding();
  const isEn = language === 'EN';

  // State to manage active Tab
  const [activeTab, setActiveTab] = useState('home');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // CRM simulation states
  const [revenue, setRevenue] = useState(2840);
  const [sessions, setSessions] = useState(38);

  // Matchmaking simulation states
  const [simGoal, setSimGoal] = useState('strength');
  const [simCity, setSimCity] = useState('Roma');

  // Interactive Tour Launcher
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { popover: { title: `Benvenuto in ${brandNameFull}`, description: `Esplora le sezioni interattive per comprendere il valore di ${brandNameFull}.` } },
        { element: '#tab-btn-home', popover: { title: 'Home', description: 'La nostra proposta di valore in meno di 10 secondi.' } },
        { element: '#tab-btn-ai-coach', popover: { title: 'AI Matchmaker', description: 'Prova il simulatore di accoppiamento intelligente in tempo reale.' } },
        { element: '#tab-btn-dashboard', popover: { title: 'Anteprima Dashboard', description: 'Osserva come si presenta il cruscotto di controllo per gli utenti attivi.' } }
      ]
    });
    driverObj.drive();
  };

  // Fake database for matchmaking preview
  const fakeResults = [
    {
      id: 'trainer-1',
      name: 'Marco Bianchi',
      role: 'Trainer Pro',
      city: 'Roma',
      goal: 'strength',
      score: 98,
      rate: 35,
      exp: 6,
      avatar: 'MB',
      spec: ['Powerlifting', 'Massa Muscolare', 'Forza Max']
    },
    {
      id: 'trainer-2',
      name: 'Chiara Rossi',
      role: 'Trainer Pro',
      city: 'Milano',
      goal: 'weightloss',
      score: 94,
      rate: 40,
      exp: 4,
      avatar: 'CR',
      spec: ['Perdita Peso', 'Cardio Fitness', 'Tono Muscolare']
    },
    {
      id: 'gym-1',
      name: 'Olympus Gym',
      role: 'Centro Convenzionato',
      city: 'Roma',
      goal: 'strength',
      score: 92,
      rate: 65,
      exp: 10,
      avatar: 'OG',
      spec: ['Sale Attrezzate', 'Crossfit Area', 'Sauna']
    },
    {
      id: 'gym-2',
      name: 'FitLife Center',
      role: 'Centro Convenzionato',
      city: 'Salerno',
      goal: 'flexibility',
      score: 95,
      rate: 50,
      exp: 8,
      avatar: 'FL',
      spec: ['Yoga Room', 'Calisthenics', 'Piscina']
    }
  ];

  // Filtered preview match list based on simulator selectors
  const filteredMatches = fakeResults.filter(
    (item) => item.city === simCity || item.goal === simGoal
  ).sort((a, b) => b.score - a.score);

  // Tab definitions
  const tabs = [
    { id: 'home', label: 'Home', icon: Dumbbell },
    { id: 'ai-coach', label: 'AI Coach', icon: Target },
    { id: 'athletes', label: 'Atleti', icon: Award },
    { id: 'trainers', label: 'Personal Trainer', icon: Users },
    { id: 'gyms', label: 'Centri Fitness', icon: Building2 },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contatti', icon: Phone }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden antialiased">
        
        {/* Horizontal Sticky Sub-Navigation Tabs Bar (Immediately below the navbar at top-16) */}
        <div className="sticky top-16 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-slate-900 shadow-lg select-none py-3.5">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-start md:justify-center overflow-x-auto scrollbar-none gap-2.5">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl text-xs md:text-sm font-bold tracking-tight transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <TabIcon className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Full-Width Content Container */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          
          <main className="space-y-12 animate-fade-in">
            
            {/* 1. HOME TAB */}
            {activeTab === 'home' && (
              <div className="space-y-16">
                
                {/* 10-Second Premium Hero Header */}
                <div className="bg-gradient-to-br from-[#0A0A0A] via-slate-950 to-[#0A0A0A] border border-slate-900 rounded-3xl p-8 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-900/60 text-emerald-450 text-xs font-black tracking-widest uppercase mb-4 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>L'ecosistema del fitness on-demand</span>
                  </div>

                  <h1 className="text-4xl md:text-8xl font-black text-white leading-none tracking-tight">
                    {brandNameFull.includes(' ') ? (
                      <>
                        {brandNameFull.split(' ')[0]}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-400 to-violet-500"> {brandNameFull.split(' ')[1]}</span>
                      </>
                    ) : (
                      <>
                        {brandNameFull}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-400 to-violet-500">.ai</span>
                      </>
                    )}
                  </h1>

                  <p className="text-lg md:text-2xl text-slate-355 max-w-4xl mx-auto font-medium leading-relaxed">
                    Il punto d'incontro intelligente per <span className="text-white font-bold">Atleti</span>, <span className="text-white font-bold">Personal Trainer</span> e <span className="text-white font-bold">Centri Fitness</span>. 
                    Prenota allenamenti on-demand, gestisci clienti da un CRM avanzato e monetizza gli spazi vuoti delle palestre.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button 
                      size="lg" 
                      onClick={() => setActiveTab('ai-coach')}
                      className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-violet-650 hover:from-emerald-500 hover:to-violet-550 text-white font-extrabold text-base rounded-2xl px-8 py-7 shadow-lg shadow-violet-500/10 active:scale-[0.98] border border-violet-500/35 transition-all flex items-center gap-2 animate-glow-violet"
                    >
                      <span>Prova l'AI Matchmaker</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="ghost"
                      onClick={startTour}
                      className="border border-slate-800 text-white bg-slate-900/80 hover:bg-slate-850 rounded-2xl px-8 py-7 text-base font-extrabold transition-all shadow-lg hover:border-violet-500/40"
                    >
                      <Play className="w-4 h-4 fill-white mr-2" />
                      <span>Guarda come funziona</span>
                    </Button>
                  </div>
                </div>

                {/* 3-Pillar Value Matrix Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Athletes Card */}
                  <Card className="bg-[#0A0A0A] border-slate-900 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 p-8 flex flex-col justify-between group shadow-xl">
                    <div className="space-y-6">
                      <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-900/60 rounded-2xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-white tracking-tight">Atleti / Utenti</h3>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                          La massima libertà di allenarsi dove e quando vuoi, senza vincoli.
                        </p>
                      </div>
                      <ul className="space-y-3 font-semibold text-xs text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Match istantaneo con il coach ideale</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Prenotazione a consumo</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Accesso a strutture convenzionate</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('athletes')}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl py-3 mt-8 active:scale-98 transition-all"
                    >
                      Maggiori Info
                    </Button>
                  </Card>

                  {/* Trainer Card */}
                  <Card className="bg-[#0A0A0A] border-slate-900 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 p-8 flex flex-col justify-between group shadow-xl">
                    <div className="space-y-6">
                      <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-900/60 rounded-2xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-white tracking-tight">Personal Trainer</h3>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                          Acquisisci clienti in target e ottimizza l'agenda oraria.
                        </p>
                      </div>
                      <ul className="space-y-3 font-semibold text-xs text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Ricevi prenotazioni in zona</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Riempi le ore vuote</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> CRM integrato per allenamenti</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('trainers')}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl py-3 mt-8 active:scale-98 transition-all"
                    >
                      Maggiori Info
                    </Button>
                  </Card>

                  {/* Gyms Card */}
                  <Card className="bg-[#0A0A0A] border-slate-900 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 p-8 flex flex-col justify-between group shadow-xl">
                    <div className="space-y-6">
                      <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-900/60 rounded-2xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-white tracking-tight">Centri Fitness</h3>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                          Monetizza ingressi e attrezzature inutilizzate nelle ore morte.
                        </p>
                      </div>
                      <ul className="space-y-3 font-semibold text-xs text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Monetizza ore a bassa affluenza</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Ingressi extra certificati</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Zero costi fissi di gestione</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('gyms')}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl py-3 mt-8 active:scale-98 transition-all"
                    >
                      Maggiori Info
                    </Button>
                  </Card>

                </div>
              </div>
            )}

            {/* 2. AI COACH TAB (Matchmaking Interactive Preview) */}
            {activeTab === 'ai-coach' && (
              <div className="space-y-8">
                <div className="bg-[#0A0A0A] border border-slate-900 rounded-3xl p-8 space-y-6">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                      PREVIEW LIVE INTERATTIVA
                    </span>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                      AI Matchmaking Engine
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Simula le preferenze dell'atleta e osserva l'ordinamento dinamico basato sul punteggio di compatibilità.
                    </p>
                  </div>

                  {/* Simulator Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-900">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Obiettivo Fitness</Label>
                      <select 
                        value={simGoal} 
                        onChange={(e) => setSimGoal(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-slate-900 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                      >
                        <option value="strength">Aumento Forza / Massa</option>
                        <option value="weightloss">Perdita Peso / Cardio</option>
                        <option value="flexibility">Yoga / Flessibilità</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posizione / Città</Label>
                      <select 
                        value={simCity} 
                        onChange={(e) => setSimCity(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-slate-900 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                      >
                        <option value="Roma">Roma</option>
                        <option value="Milano">Milano</option>
                        <option value="Salerno">Salerno</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Simulated Result Cards */}
                  <div className="space-y-4">
                    {filteredMatches.map((item) => {
                      const radius = 20;
                      const strokeDash = 2 * Math.PI * radius;
                      const offset = strokeDash - (item.score / 100) * strokeDash;
                      return (
                        <div 
                          key={item.id} 
                          className="bg-slate-950 border border-slate-900 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-900 text-emerald-450 font-black rounded-xl flex items-center justify-center text-sm">
                              {item.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-white text-base">{item.name}</h4>
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded font-black tracking-wide uppercase">
                                  {item.role}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-semibold mt-1">
                                {item.spec.join(' • ')} • {item.city}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tariffa</div>
                              <div className="text-sm font-extrabold text-white">€{item.rate}/{item.id.includes('gym') ? 'mese' : 'ora'}</div>
                            </div>

                            {/* Circular gauge */}
                            <div className="flex items-center gap-2.5">
                              <div className="relative w-12 h-12">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="24" cy="24" r={radius} stroke="#18181b" strokeWidth="3" fill="transparent" />
                                  <circle 
                                    cx="24" cy="24" r={radius} stroke="#10b981" strokeWidth="3.5" fill="transparent" 
                                    strokeDasharray={strokeDash}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[10.5px] font-black text-emerald-400">
                                  {item.score}%
                                </div>
                              </div>
                              <span className="text-xs font-bold text-slate-400">{isEn ? 'Match' : 'Compatibilità'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center pt-4 border-t border-slate-900">
                    <Button 
                      onClick={() => navigate('/search')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl px-6 py-2 shadow active:scale-95 transition-all text-xs"
                    >
                      Apri Ricerca Completa
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ATHLETES TAB */}
            {activeTab === 'athletes' && (
              <div className="space-y-8 bg-[#0A0A0A] border border-slate-900 rounded-3xl p-8">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                    ATLETI & SPORTIVI
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                    L'esperienza fitness su misura per te
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 font-semibold text-slate-300 text-sm">
                    <p className="leading-relaxed">
                      Con {brandNameFull} dimentichi abbonamenti bloccanti, contratti lunghi e palestre affollate. Hai a disposizione un intero network di trainer qualificati e strutture in base alle tue esigenze orarie e geografiche.
                    </p>
                    <div className="flex items-start gap-3 pt-2">
                      <div className="p-1 bg-emerald-950/60 rounded-full border border-emerald-900 text-emerald-400 mt-0.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Filtri Intelligenti</h4>
                        <p className="text-xs text-slate-500">Cerca per area, fascia prezzo, disponibilità e recensioni certificate.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-emerald-950/60 rounded-full border border-emerald-900 text-emerald-400 mt-0.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Portafoglio Digitale Unico</h4>
                        <p className="text-xs text-slate-500">Paga a consumo tramite i crediti digitali della piattaforma (Tokens).</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 flex flex-col justify-center space-y-4">
                    <h3 className="text-lg font-bold text-white text-center">Registrati subito e inizia ad allenarti</h3>
                    <Button 
                      onClick={() => navigate('/register?role=user')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl py-3.5 shadow active:scale-95 transition-all text-sm"
                    >
                      Crea Account Atleta
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. TRAINERS TAB */}
            {activeTab === 'trainers' && (
              <div className="space-y-8">
                <div className="bg-[#0A0A0A] border border-slate-900 rounded-3xl p-8 space-y-6">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                      PERSONAL TRAINER & COACHES
                    </span>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                      Fai decollare la tua attività di coaching
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7 space-y-4 text-slate-355 text-sm font-semibold">
                      <p className="leading-relaxed">
                        Trova nuovi atleti in target, gestisci gli appuntamenti e monitora i pagamenti da un cruscotto CRM avanzato e integrato. Non avrai più ore vuote nella tua agenda quotidiana.
                      </p>
                      <ul className="space-y-3 text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Match automatico con clienti vicini a te</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Gestione schede e cronologia allenamenti</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Pagamenti istantanei protetti</li>
                      </ul>
                      <div className="pt-4">
                        <Button 
                          onClick={() => navigate('/register?role=instructor')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl px-6 py-3 shadow active:scale-95 transition-all text-xs"
                        >
                          Registrati come Personal Trainer
                        </Button>
                      </div>
                    </div>

                    {/* CRM Dashboard Preview Widget */}
                    <div className="md:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-900 space-y-6 shadow-xl relative overflow-hidden">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-4.5 h-4.5 text-emerald-400" />
                          <span className="font-extrabold text-xs text-white uppercase tracking-wider">CRM Coach Preview</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#0A0A0A] p-3 rounded-xl border border-slate-900">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Entrate (Mese)</div>
                          <div className="font-extrabold text-white text-base mt-1">€{revenue}</div>
                        </div>
                        <div className="bg-[#0A0A0A] p-3 rounded-xl border border-slate-900">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sessioni</div>
                          <div className="font-extrabold text-white text-base mt-1">{sessions} fatte</div>
                        </div>
                      </div>

                      <div className="bg-[#0A0A0A] p-3.5 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-extrabold text-white">Chiara M.</div>
                          <div className="text-[10px] text-slate-500 font-semibold">Oggi alle 18:30</div>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                          Pronto
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. FITNESS CENTERS TAB */}
            {activeTab === 'gyms' && (
              <div className="space-y-8 bg-[#0A0A0A] border border-slate-900 rounded-3xl p-8">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                    CENTRI FITNESS & PALESTRE
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                    Monetizza le tue ore morte
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3 text-xs">
                      <span className="font-extrabold text-white uppercase tracking-wider">Tasso Occupazione Spazi</span>
                      <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded font-black">+145% Entrate</span>
                    </div>

                    <div className="space-y-3 text-xs font-bold">
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Senza {brandNameFull} (Prima)</span>
                          <span>35%</span>
                        </div>
                        <div className="h-3 w-full bg-[#0A0A0A] rounded-lg overflow-hidden border border-slate-900">
                          <div className="h-full bg-slate-650 rounded-lg" style={{ width: '35%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-white">
                          <span>Con {brandNameFull}</span>
                          <span className="text-emerald-400">85%</span>
                        </div>
                        <div className="h-3 w-full bg-[#0A0A0A] rounded-lg overflow-hidden border border-slate-900">
                          <div className="h-full bg-emerald-500 rounded-lg" style={{ width: '85%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-slate-300 text-sm font-semibold">
                    <p className="leading-relaxed">
                      Ospita sessioni esterne di personal trainer accreditati e dei loro atleti nei momenti di bassa affluenza. Sei tu a stabilire tariffe, disponibilità oraria ed accessi tramite il tuo portale dedicato.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-450">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Monetizzazione di macchinari fermi</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Afflusso di potenziali nuovi iscritti</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 stroke-[3.5]" /> Gestione ingressi automatica via QR Code</li>
                    </ul>
                    <div className="pt-2">
                      <Button 
                        onClick={() => navigate('/register?role=gym')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl px-6 py-3 shadow active:scale-95 transition-all text-xs"
                      >
                        Registra la tua Palestra
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. DASHBOARD PREVIEW TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 bg-[#0A0A0A] border border-slate-900 rounded-3xl p-8">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                    DEMO LIVE DASHBOARD
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                    Il tuo centro operativo
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Visualizza in tempo reale le statistiche degli allenamenti e l'attività economica.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                    <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Ore Allenate</div>
                    <div className="text-3xl font-black text-white">124.5 h</div>
                    <p className="text-[10px] text-emerald-400 font-semibold">+12% questo mese</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                    <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Punteggio Feedback</div>
                    <div className="text-3xl font-black text-white">4.92 / 5</div>
                    <p className="text-[10px] text-slate-500 font-semibold">18 recensioni verificate</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-2">
                    <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Tokens Guadagnati</div>
                    <div className="text-3xl font-black text-white">480 FC</div>
                    <p className="text-[10px] text-slate-500 font-semibold">Equivalgono a circa €480</p>
                  </div>
                </div>

                {/* Calendar simulation */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 space-y-4">
                  <h3 className="text-base font-extrabold text-white">Appuntamenti della settimana</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-3 bg-[#0A0A0A] rounded-xl border border-slate-900">
                      <div>
                        <div className="font-bold text-white">Lunedì - 09:00</div>
                        <div className="text-slate-500">Giuseppe R. • Forza Max</div>
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 px-2 py-1 rounded font-bold uppercase text-[9px]">Completato</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#0A0A0A] rounded-xl border border-slate-900">
                      <div>
                        <div className="font-bold text-white">Mercoledì - 18:30</div>
                        <div className="text-slate-500">Chiara M. • Perdita Peso</div>
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 px-2 py-1 rounded font-bold uppercase text-[9px]">Completato</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. PRICING TAB */}
            {activeTab === 'pricing' && (
              <div className="space-y-8 bg-[#0A0A0A] border border-slate-900 rounded-3xl p-8">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                    LISTINO PREZZI
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    Tariffe trasparenti a consumo
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Acquista i pacchetti di crediti (FitFlow Tokens) per allenarti liberamente o ricevere compensi.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Basic Plan */}
                  <Card className="bg-slate-950 border-slate-900 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Starter Pack</h4>
                        <div className="text-3xl font-black text-white mt-1">€19.99</div>
                      </div>
                      <div className="text-emerald-400 font-extrabold text-sm">20 FitTokens</div>
                      <p className="text-xs text-slate-500 font-medium">Ottimo per iniziare ed effettuare i primi due allenamenti.</p>
                    </div>
                    <Button className="w-full bg-[#0A0A0A] hover:bg-slate-900 text-white font-bold text-xs rounded-xl py-3 border border-slate-900">
                      Acquista
                    </Button>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="bg-slate-950 border border-violet-500/40 rounded-2xl p-6 space-y-6 flex flex-col justify-between relative animate-glow-violet">
                    <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-violet-650 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                      POPOLARE
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pro Pack</h4>
                        <div className="text-3xl font-black text-white mt-1">€49.99</div>
                      </div>
                      <div className="text-emerald-400 font-extrabold text-sm">55 FitTokens</div>
                      <p className="text-xs text-slate-500 font-medium">Ideale per atleti costanti. Include 5 crediti bonus in regalo.</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-violet-650 hover:from-emerald-500 hover:to-violet-550 text-white font-bold text-xs rounded-xl py-3 shadow shadow-violet-500/10 border-0">
                      Acquista
                    </Button>
                  </Card>

                  {/* Ultra Plan */}
                  <Card className="bg-slate-950 border-slate-900 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Athlete Pack</h4>
                        <div className="text-3xl font-black text-white mt-1">€99.99</div>
                      </div>
                      <div className="text-emerald-400 font-extrabold text-sm">115 FitTokens</div>
                      <p className="text-xs text-slate-500 font-medium">Per chi si allena intensamente. Risparmio massimo con 15 crediti bonus.</p>
                    </div>
                    <Button className="w-full bg-[#0A0A0A] hover:bg-slate-900 text-white font-bold text-xs rounded-xl py-3 border border-slate-900">
                      Acquista
                    </Button>
                  </Card>

                </div>
              </div>
            )}

            {/* 8. FAQ TAB */}
            {activeTab === 'faq' && (
              <div className="space-y-8 bg-[#0A0A0A] border border-slate-900 rounded-3xl p-8">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                    DOMANDE FREQUENTI
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                    Chiarisci ogni dubbio
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      q: `Come funziona il sistema di Matchmaking AI di ${brandNameFull}?`,
                      a: "Il nostro algoritmo incrocia la tua posizione geografica con le tue preferenze orarie, gli obiettivi fisici e la tariffa oraria desiderata, fornendoti una percentuale di compatibilità dettagliata."
                    },
                    {
                      q: "Cosa sono i FitTokens?",
                      a: "I FitTokens sono la moneta virtuale della piattaforma. Consentono di pagare gli allenamenti a consumo senza dover sottoscrivere abbonamenti o contratti fisici con le singole palestre."
                    },
                    {
                      q: `Sono un gestore di una palestra, quanto mi costa aderire a ${brandNameFull}?`,
                      a: `L'adesione a ${brandNameFull} è totalmente gratuita. Guadagni una percentuale su ogni ora di utilizzo delle sale o attrezzature da parte di atleti esterni convenzionati.`
                    }
                  ].map((faq, index) => (
                    <div 
                      key={index} 
                      className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full p-5 text-left font-bold text-sm text-white flex justify-between items-center"
                      >
                        <span>{faq.q}</span>
                        {openFaq === index ? <ChevronUp className="w-4 h-4 text-emerald-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      {openFaq === index && (
                        <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed font-semibold">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-8 bg-[#0A0A0A] border border-slate-900 rounded-3xl p-8">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                    METTITI IN CONTATTO
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                    Scrivi al nostro team
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Siamo a tua disposizione per supporto, partnership commerciali o investimenti.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert('Messaggio inviato con successo!'); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Nome Completo</Label>
                      <Input 
                        placeholder="Inserisci il tuo nome" 
                        required 
                        className="bg-slate-950 border-slate-900 focus:border-emerald-600 focus:ring-emerald-600 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Indirizzo Email</Label>
                      <Input 
                        type="email" 
                        placeholder="Inserisci la tua email" 
                        required 
                        className="bg-slate-950 border-slate-900 focus:border-emerald-600 focus:ring-emerald-600 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Messaggio o Domanda</Label>
                    <textarea 
                      rows={5} 
                      placeholder="Scrivi qui il tuo messaggio..." 
                      required 
                      className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-600 focus:ring-emerald-600 rounded-xl py-3 px-4 text-sm focus:outline-none"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl px-6 py-3.5 shadow active:scale-95 transition-all text-xs"
                  >
                    Invia Messaggio
                  </Button>
                </form>
              </div>
            )}

          </main>

        </div>

      </div>
    </Layout>
  );
};

export default HomePage;
