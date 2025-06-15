
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Search, Dumbbell, MapPin, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

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
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            La prima piattaforma AI che connette <strong className="text-green-600">atleti motivati</strong>, <strong className="text-blue-600">trainer esperti</strong> e <strong className="text-orange-600">palestre innovative</strong> 
            per creare la tua esperienza fitness perfetta
          </p>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">10K+</div>
                <div className="text-sm text-slate-600">Utenti Attivi</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">500+</div>
                <div className="text-sm text-slate-600">Trainer Certificati</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">200+</div>
                <div className="text-sm text-slate-600">Palestre Partner</div>
              </div>
            </div>
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
        </div>

        {/* Enhanced Feature Cards */}
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

        {/* Success Stories Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Storie di Successo 💫
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Ogni giorno aiutiamo persone a raggiungere i loro obiettivi fitness
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-2xl">
              <div className="text-4xl mb-4">🏃‍♀️</div>
              <h4 className="font-bold text-green-800 mb-2">Maria, 32 anni</h4>
              <p className="text-green-700 text-sm">
                "Ho perso 15kg in 6 mesi grazie al match perfetto con la mia trainer!"
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl">
              <div className="text-4xl mb-4">💪</div>
              <h4 className="font-bold text-blue-800 mb-2">Marco, Trainer</h4>
              <p className="text-blue-700 text-sm">
                "Ho triplicato i miei clienti e ora lavoro solo con persone motivate!"
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl">
              <div className="text-4xl mb-4">🏋️‍♂️</div>
              <h4 className="font-bold text-orange-800 mb-2">FitZone Gym</h4>
              <p className="text-orange-700 text-sm">
                "Il 40% di nuovi iscritti in 3 mesi grazie alla piattaforma!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
