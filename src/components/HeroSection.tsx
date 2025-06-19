
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Search, Dumbbell, MapPin, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleSelector from './RoleSelector';

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'user' | 'instructor' | 'gym' | null>(null);

  // Content personalizzato per ogni tipo di utente
  const getPersonalizedContent = () => {
    switch (selectedRole) {
      case 'user':
        return {
          subtitle: "Trasforma il tuo corpo, supera i tuoi limiti",
          description: "Trova il trainer perfetto e la palestra ideale per raggiungere i tuoi obiettivi fitness. Il nostro matching AI ti connette con professionisti che capiscono le tue esigenze.",
          stats: [
            { icon: Users, number: "10K+", label: "Atleti Soddisfatti" },
            { icon: Trophy, number: "95%", label: "Obiettivi Raggiunti" },
            { icon: MapPin, number: "200+", label: "Città Servite" }
          ],
          testimonials: [
            {
              emoji: "🏃‍♀️",
              name: "Maria, 32 anni",
              role: "Atleta",
              text: "Ho perso 15kg in 6 mesi grazie al match perfetto con la mia trainer!"
            },
            {
              emoji: "💪",
              name: "Alessandro, 28 anni", 
              role: "Fitness Enthusiast",
              text: "Finalmente una palestra che capisce le mie esigenze e i miei orari!"
            },
            {
              emoji: "🧘‍♀️",
              name: "Carla, 35 anni",
              role: "Yoga Lover", 
              text: "Ho trovato la pace interiore e la forma fisica che cercavo da anni!"
            }
          ]
        };
      case 'instructor':
        return {
          subtitle: "Fai crescere la tua carriera, trasforma più vite",
          description: "Connettiti con clienti motivati e qualificati. La nostra piattaforma ti aiuta a gestire il tuo business, ottimizzare i tuoi orari e massimizzare i guadagni.",
          stats: [
            { icon: Dumbbell, number: "500+", label: "Trainer Attivi" },
            { icon: Users, number: "85%", label: "Clienti Ricorrenti" },
            { icon: Trophy, number: "+40%", label: "Guadagni Medi" }
          ],
          testimonials: [
            {
              emoji: "💪",
              name: "Marco, Personal Trainer",
              role: "Certified Trainer",
              text: "Ho triplicato i miei clienti e ora lavoro solo con persone motivate!"
            },
            {
              emoji: "🏋️‍♀️",
              name: "Laura, Fitness Coach",
              role: "Specialized Coach",
              text: "La piattaforma mi ha permesso di specializzarmi e aumentare le tariffe!"
            },
            {
              emoji: "🥇",
              name: "Davide, Ex-Atleta",
              role: "Performance Coach",
              text: "Gestisco 40+ clienti con facilità grazie agli strumenti integrati!"
            }
          ]
        };
      case 'gym':
        return {
          subtitle: "Ottimizza la tua palestra, attrai nuovi membri",
          description: "Aumenta le iscrizioni, ottimizza l'occupazione degli spazi e crea una community forte. Analytics avanzati per decisioni data-driven.",
          stats: [
            { icon: MapPin, number: "200+", label: "Palestre Partner" },
            { icon: Users, number: "+60%", label: "Nuove Iscrizioni" },
            { icon: Trophy, number: "90%", label: "Retention Rate" }
          ],
          testimonials: [
            {
              emoji: "🏋️‍♂️",
              name: "FitZone Gym",
              role: "Centro Fitness",
              text: "Il 40% di nuovi iscritti in 3 mesi grazie alla piattaforma!"
            },
            {
              emoji: "💎",
              name: "Wellness Club Roma",
              role: "Premium Gym",
              text: "Abbiamo ottimizzato gli spazi e raddoppiato i ricavi per metro quadro!"
            },
            {
              emoji: "🚀",
              name: "PowerGym Milano",
              role: "Catena Fitness",
              text: "Analytics dettagliati ci hanno aiutato a aprire 3 nuove sedi!"
            }
          ]
        };
      default:
        return {
          subtitle: "Un solo portale. Tutto il mondo fitness.",
          description: "La prima piattaforma AI che connette atleti motivati, trainer esperti e palestre innovative per creare la tua esperienza fitness perfetta",
          stats: [
            { icon: Users, number: "10K+", label: "Utenti Attivi" },
            { icon: Dumbbell, number: "500+", label: "Trainer Certificati" },
            { icon: MapPin, number: "200+", label: "Palestre Partner" }
          ],
          testimonials: [
            {
              emoji: "🏃‍♀️", 
              name: "Maria, 32 anni",
              role: "Atleta",
              text: "Ho perso 15kg in 6 mesi grazie al match perfetto con la mia trainer!"
            },
            {
              emoji: "💪",
              name: "Marco, Trainer", 
              role: "Personal Trainer",
              text: "Ho triplicato i miei clienti e ora lavoro solo con persone motivate!"
            },
            {
              emoji: "🏋️‍♂️",
              name: "FitZone Gym",
              role: "Centro Fitness", 
              text: "Il 40% di nuovi iscritti in 3 mesi grazie alla piattaforma!"
            }
          ]
        };
    }
  };

  const content = getPersonalizedContent();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background with fitness patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-orange-50"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-6xl">🏋️‍♂️</div>
        <div className="absolute top-40 right-20 text-4xl">💪</div>
        <div className="absolute bottom-40 left-20 text-5xl">🏃‍♀️</div>
        <div className="absolute bottom-20 right-10 text-3xl">🧘‍♀️</div>
        <div className="absolute top-60 left-1/2 text-4xl">⚡</div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-700 font-medium text-sm mb-4">
              🚀 La Rivoluzione del Fitness è Qui
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
            Un solo portale.
            <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-orange-500 bg-clip-text text-transparent">
              Tutto il mondo fitness.
            </span>
          </h1>

          {/* Role Selection */}
          {!selectedRole && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-8">
                Scegli il tuo percorso fitness
              </h2>
              <RoleSelector 
                onRoleSelect={setSelectedRole} 
                selectedRole={selectedRole || ''} 
              />
            </div>
          )}

          {/* Personalized Content */}
          {selectedRole && (
            <>
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRole(null)}
                  className="text-sm"
                >
                  ← Cambia selezione
                </Button>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                {content.subtitle}
              </h2>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                {content.description}
              </p>

              {/* Personalized Statistics */}
              <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
                {content.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.number}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button 
                  size="lg" 
                  className="gradient-primary text-white text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-lg"
                  onClick={() => navigate('/register')}
                >
                  🚀 Inizia la Tua Trasformazione
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 rounded-xl border-2 border-slate-300 hover:border-green-500 transition-colors"
                  onClick={() => navigate('/login')}
                >
                  💪 Accedi alla Community
                </Button>
              </div>

              {/* Personalized Success Stories */}
              <div className="mt-24 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Storie di Successo 💫
                </h2>
                <p className="text-xl text-slate-600 mb-12">
                  {selectedRole === 'user' && "Atleti come te hanno già trasformato la loro vita"}
                  {selectedRole === 'instructor' && "Trainer professionisti che hanno fatto il salto di qualità"}
                  {selectedRole === 'gym' && "Palestre che hanno rivoluzionato il loro business"}
                  {!selectedRole && "Ogni giorno aiutiamo persone a raggiungere i loro obiettivi fitness"}
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {content.testimonials.map((testimonial, index) => (
                    <div key={index} className={`p-6 rounded-2xl ${
                      selectedRole === 'user' ? 'bg-green-50' :
                      selectedRole === 'instructor' ? 'bg-blue-50' :
                      selectedRole === 'gym' ? 'bg-orange-50' : 
                      index === 0 ? 'bg-green-50' : index === 1 ? 'bg-blue-50' : 'bg-orange-50'
                    }`}>
                      <div className="text-4xl mb-4">{testimonial.emoji}</div>
                      <h4 className={`font-bold mb-1 ${
                        selectedRole === 'user' ? 'text-green-800' :
                        selectedRole === 'instructor' ? 'text-blue-800' :
                        selectedRole === 'gym' ? 'text-orange-800' :
                        index === 0 ? 'text-green-800' : index === 1 ? 'text-blue-800' : 'text-orange-800'
                      }`}>
                        {testimonial.name}
                      </h4>
                      <p className={`text-xs mb-2 ${
                        selectedRole === 'user' ? 'text-green-600' :
                        selectedRole === 'instructor' ? 'text-blue-600' :
                        selectedRole === 'gym' ? 'text-orange-600' :
                        index === 0 ? 'text-green-600' : index === 1 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {testimonial.role}
                      </p>
                      <p className={`text-sm ${
                        selectedRole === 'user' ? 'text-green-700' :
                        selectedRole === 'instructor' ? 'text-blue-700' :
                        selectedRole === 'gym' ? 'text-orange-700' :
                        index === 0 ? 'text-green-700' : index === 1 ? 'text-blue-700' : 'text-orange-700'
                      }`}>
                        "{testimonial.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Feature Cards - shown only when no role is selected or after role selection */}
        {!selectedRole && (
          <div className="grid md:grid-cols-3 gap-8 mt-20 animate-slide-up">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Matchmaking Intelligente</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Il nostro algoritmo AI analizza obiettivi, disponibilità e preferenze per trovarti 
                  il trainer perfetto e la palestra ideale
                </p>
                <div className="text-sm text-green-600 font-medium">
                  ✨ 95% di soddisfazione nei match
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Gestione Completa</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Prenota sessioni, gestisci schede personalizzate e monitora i progressi 
                  tutto da un'unica piattaforma integrata
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  📊 Dashboard analytics incluse
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Ricerca Avanzata</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Filtra per zona, specializzazione, orari e budget per trovare 
                  esattamente quello che cerchi nel mondo fitness
                </p>
                <div className="text-sm text-orange-600 font-medium">
                  🎯 Risultati ultra-personalizzati
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
