
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Search, Dumbbell, MapPin, Trophy, Building2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleSelector from './RoleSelector';


const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'user' | 'instructor' | 'gym' | null>(null);

  // Content personalizzato per ogni tipo di utente (Ecosistema)
  const getPersonalizedContent = () => {
    switch (selectedRole) {
      case 'user':
        return {
          subtitle: "La tua soluzione su misura",
          description: "Smetti di adattarti all'offerta. Trova esattamente ciò che cerchi filtrando per budget, obiettivi, location e orari.",
          stats: [
            { icon: Users, number: "10K+", label: "Atleti Soddisfatti" },
            { icon: Trophy, number: "95%", label: "Match Perfetti" },
            { icon: MapPin, number: "200+", label: "Città" }
          ],
          testimonials: [
            {
              emoji: "🏃‍♀️",
              name: "Maria, 32 anni",
              role: "Atleta",
              text: "Ho trovato la trainer perfetta per i miei orari impossibili!"
            },
            {
              emoji: "💪",
              name: "Alessandro, 28 anni",
              role: "Appassionato",
              text: "Finalmente pago solo per quello che uso davvero."
            },
            {
              emoji: "🧘‍♀️",
              name: "Carla, 35 anni",
              role: "Yoga",
              text: "Un'esperienza su misura, dall'inizio alla fine."
            }
          ]
        };
      case 'instructor':
        return {
          subtitle: "Imprenditori di se stessi",
          description: "Zero costi di marketing, 100% ottimizzazione. Riempi gli slot orari 'morti' e accedi a una rete di nuovi potenziali clienti senza investire in pubblicità complesse.",
          stats: [
            { icon: Dumbbell, number: "500+", label: "Trainer Attivi" },
            { icon: Users, number: "85%", label: "Clienti Ricorrenti" },
            { icon: Trophy, number: "+40%", label: "Entrate Extra" }
          ],
          testimonials: [
            {
              emoji: "💪",
              name: "Marco",
              role: "Personal Trainer",
              text: "Ho riempito le mattine vuote con clienti motivati!"
            },
            {
              emoji: "🏋️‍♀️",
              name: "Laura",
              role: "Coach",
              text: "Niente più costi fissi, solo guadagno puro."
            },
            {
              emoji: "🥇",
              name: "Davide",
              role: "Performance Coach",
              text: "La piattaforma gestisce tutto, io penso solo ad allenare."
            }
          ]
        };
      case 'gym':
        return {
          subtitle: "Asset Monetization",
          description: "Trasforma i costi fissi in ricavi. Riempi le sale vuote nelle fasce orarie non di punta ospitando trainer esterni.",
          stats: [
            { icon: MapPin, number: "200+", label: "Palestre Partner" },
            { icon: Users, number: "+60%", label: "Nuovi Ingressi" },
            { icon: Building2, number: "90%", label: "Sale Occupate" }
          ],
          testimonials: [
            {
              emoji: "🏋️‍♂️",
              name: "FitZone",
              role: "Centro Fitness",
              text: "Le sale vuote ora generano reddito ogni ora."
            },
            {
              emoji: "💎",
              name: "Wellness Club",
              role: "Premium Gym",
              text: "Nuovi trainer portano nuovi clienti. Un circolo virtuoso."
            },
            {
              emoji: "🚀",
              name: "PowerGym",
              role: "Catena",
              text: "Massimizziamo ogni metro quadro della struttura."
            }
          ]
        };
      default:
        return null;
    }
  };

  const content = getPersonalizedContent();

  const handleRoleClick = (role: 'user' | 'instructor' | 'gym') => {
    setSelectedRole(role);
    // Optional: scroll to personalized content if needed
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background with fitness patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/10 to-slate-100"></div>
      <div className="absolute inset-0 opacity-5 hidden md:block">
        <div className="absolute top-20 left-10 text-6xl">🏋️‍♂️</div>
        <div className="absolute top-40 right-20 text-4xl">💪</div>
        <div className="absolute bottom-40 left-20 text-5xl">🏃‍♀️</div>
        <div className="absolute bottom-20 right-10 text-3xl">🧘‍♀️</div>
        <div className="absolute top-60 left-1/2 text-4xl">⚡</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-lime-50 rounded-full text-indigo-700 font-medium text-sm mb-4 border border-indigo-100 shadow-sm">
              🚀 Il Primo Ecosistema a Triplo Vantaggio
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Allenati alle Tue Condizioni.
            <span className="block bg-gradient-to-r from-indigo-650 via-violet-600 to-lime-500 bg-clip-text text-transparent">
              L'Ecosistema Fitness Definitivo.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Dimentica le liste di contatti statiche. Entra in un network vivo che connette <span className="font-semibold text-lime-650">Passione</span>, <span className="font-semibold text-indigo-650">Competenza</span> e <span className="font-semibold text-violet-650">Spazi Premium</span>.
          </p>

          {/* 3-Sided CTAs */}
          {!selectedRole && (
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-20">
              <Button
                size="lg"
                onClick={() => handleRoleClick('user')}
                className="bg-white text-lime-750 border-2 border-lime-200 hover:border-lime-500 hover:bg-lime-50/50 text-lg px-8 py-6 h-auto rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 group"
              >
                <Users className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Sono un Atleta</span>
              </Button>

              <Button
                size="lg"
                onClick={() => handleRoleClick('instructor')}
                className="bg-white text-indigo-650 border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-lg px-8 py-6 h-auto rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 group"
              >
                <Dumbbell className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Sono un Trainer</span>
              </Button>

              <Button
                size="lg"
                onClick={() => handleRoleClick('gym')}
                className="bg-white text-violet-650 border-2 border-violet-200 hover:border-violet-500 hover:bg-violet-50/50 text-lg px-8 py-6 h-auto rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 group"
              >
                <Building2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Gestisco una Struttura</span>
              </Button>
            </div>
          )}


          {/* Personalized Content Section */}
          {selectedRole && content && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-8">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedRole(null)}
                  className="text-sm hover:bg-slate-100"
                >
                  ← Torna alla selezione
                </Button>
              </div>

              <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${selectedRole === 'user' ? 'text-lime-700' :
                selectedRole === 'instructor' ? 'text-indigo-650' : 'text-violet-650'
                }`}>
                {content.subtitle}
              </h2>

              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                {content.description}
              </p>

              {/* Personalized Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                {content.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
                    <div className={`p-3 rounded-full ${selectedRole === 'user' ? 'bg-lime-100 text-lime-700' :
                      selectedRole === 'instructor' ? 'bg-indigo-100 text-indigo-650' : 'bg-violet-100 text-violet-650'
                      }`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-slate-900">{stat.number}</div>
                      <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mb-16">
                <Button
                  size="lg"
                  className={`text-slate-900 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-heartbeat ${selectedRole === 'user' ? 'bg-lime-400 hover:bg-lime-500 font-bold border border-lime-300' :
                    selectedRole === 'instructor' ? 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold' : 'bg-violet-650 hover:bg-violet-750 text-white font-bold'
                    }`}
                  onClick={() => navigate('/register')}
                >
                  Inizia Ora Gratuitamente
                </Button>
              </div>

              {/* Testimonials */}
              <div className="grid md:grid-cols-3 gap-6 text-left">
                {content.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">{testimonial.emoji}</div>
                    <p className="text-slate-700 italic mb-4">"{testimonial.text}"</p>
                    <div>
                      <div className="font-bold text-slate-900">{testimonial.name}</div>
                      <div className={`text-sm ${selectedRole === 'user' ? 'text-lime-750' :
                        selectedRole === 'instructor' ? 'text-indigo-650' : 'text-violet-650'
                        }`}>{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3-Column Core Value Cards (Shown when no role selected) */}
        {!selectedRole && (
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left animate-slide-up">

            {/* CARD A: ATLETI */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-lime-450 bg-gradient-to-b from-white to-lime-50/10">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-lime-100 text-lime-750 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Fitness su Misura</h3>
                <p className="text-sm font-semibold text-lime-700 mb-4 uppercase tracking-wider">Per gli Atleti</p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Il tuo tempo è prezioso. Trova il trainer ideale esattamente quando e dove vuoi tu. Nessun compromesso.
                </p>
                <div className="bg-white/80 p-3 rounded-lg border border-lime-100 text-sm text-lime-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                  Match Istantaneo: Solo professionisti certificati.
                </div>
                <div className="mt-4 flex items-center text-xs text-slate-400 gap-1 cursor-pointer hover:text-lime-750 transition-colors">
                  <Bell className="w-3 h-3" />
                  Smart Alert: Avvisami quando un match è disponibile
                </div>
              </CardContent>
            </Card>

            {/* CARD B: TRAINER */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-indigo-400 bg-gradient-to-b from-white to-indigo-50/10">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-650 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Imprenditori di se stessi</h3>
                <p className="text-sm font-semibold text-indigo-650 mb-4 uppercase tracking-wider">Per i Trainer</p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Zero costi di marketing, 100% ottimizzazione. Riempi gli slot orari 'morti' e accedi a una rete di nuovi clienti.
                </p>
                <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 text-sm text-indigo-850">
                  <strong>Networking Strutturale:</strong> Espandi il tuo raggio d'azione collaborando con nuove strutture.
                </div>
              </CardContent>
            </Card>

            {/* CARD C: GESTORI */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-violet-400 bg-gradient-to-b from-white to-violet-50/10">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-violet-100 text-violet-650 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Massimizza i Profitti</h3>
                <p className="text-sm font-semibold text-violet-650 mb-4 uppercase tracking-wider">Per i Gestori</p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Ogni metro quadro conta. Trasforma le ore morte in nuove entrate ospitando top trainer esterni.
                </p>
                <div className="bg-white/80 p-3 rounded-lg border border-violet-100 text-sm text-violet-850">
                  <strong>Effetto Rete:</strong> Nuovi trainer portano nuovi clienti nel tuo club.
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
