
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 gradient-primary opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
            Il Futuro del
            <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-orange-500 bg-clip-text text-transparent">
              Fitness Connesso
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            La prima piattaforma AI che connette <strong>utenti</strong>, <strong>istruttori professionali</strong> e <strong>palestre</strong> 
            per creare l'esperienza fitness perfetta per te
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="gradient-primary text-white text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform"
              onClick={() => navigate('/register')}
            >
              Inizia Ora Gratis
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 rounded-xl border-2 border-slate-300 hover:border-green-500 transition-colors"
              onClick={() => navigate('/login')}
            >
              Accedi alla Piattaforma
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 animate-slide-up">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Matchmaking Intelligente</h3>
              <p className="text-slate-600 leading-relaxed">
                Il nostro algoritmo AI analizza i tuoi obiettivi, disponibilità e preferenze per trovarti 
                l'istruttore e la palestra perfetti
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 gradient-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Gestione Completa</h3>
              <p className="text-slate-600 leading-relaxed">
                Prenota sessioni, gestisci le tue schede di allenamento e monitora i progressi 
                tutto da un'unica piattaforma
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ricerca Avanzata</h3>
              <p className="text-slate-600 leading-relaxed">
                Filtra per zona, specializzazione, orari e budget per trovare 
                esattamente quello che stai cercando
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
