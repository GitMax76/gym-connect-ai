
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Search, Clock } from 'lucide-react';

const DashboardPage = () => {
  // Mock data per dimostrare le funzionalità
  const mockMatches = [
    {
      id: 1,
      type: 'instructor',
      name: 'Marco Rossi',
      specialization: 'Personal Training & Riabilitazione',
      rating: 4.9,
      location: 'Milano Centro',
      availability: 'Lun-Ven 18:00-21:00',
      priceRange: '€40-60/ora',
      matchPercentage: 95
    },
    {
      id: 2,
      type: 'gym',
      name: 'FitnessPro Milano',
      services: ['Sala pesi', 'Corsi gruppo', 'Piscina'],
      rating: 4.7,
      location: 'Milano Porta Garibaldi',
      price: '€45/mese',
      matchPercentage: 88
    },
    {
      id: 3,
      type: 'instructor',
      name: 'Elena Bianchi',
      specialization: 'Yoga & Pilates',
      rating: 4.8,
      location: 'Milano Brera',
      availability: 'Mar-Sab 9:00-12:00',
      priceRange: '€35-50/ora',
      matchPercentage: 82
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              La Tua Dashboard
            </h1>
            <p className="text-slate-600">
              Ecco i match personalizzati basati sui tuoi obiettivi e preferenze
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Match Trovati</p>
                    <p className="text-2xl font-bold text-slate-900">{mockMatches.length}</p>
                  </div>
                  <Search className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Sessioni Prenotate</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Istruttori Salvati</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Ore di Allenamento</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Match Suggeriti */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Match Suggeriti per Te</h2>
              <Button variant="outline">
                Visualizza Tutti
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMatches.map((match) => (
                <Card key={match.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge 
                          variant="secondary" 
                          className={`mb-2 ${match.type === 'instructor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                        >
                          {match.type === 'instructor' ? 'Istruttore' : 'Palestra'}
                        </Badge>
                        <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                          {match.name}
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        <Badge className="gradient-primary text-white">
                          {match.matchPercentage}% Match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {match.type === 'instructor' ? (
                      <>
                        <p className="text-slate-600 text-sm">{match.specialization}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Rating:</span>
                          <span className="font-medium">⭐ {match.rating}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Disponibilità:</span>
                          <span className="font-medium">{match.availability}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Tariffa:</span>
                          <span className="font-medium text-green-600">{match.priceRange}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {match.services?.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Rating:</span>
                          <span className="font-medium">⭐ {match.rating}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Abbonamento:</span>
                          <span className="font-medium text-green-600">{match.price}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Zona:</span>
                      <span className="font-medium">{match.location}</span>
                    </div>

                    <div className="pt-3 space-y-2">
                      <Button className="w-full gradient-primary text-white">
                        Visualizza Profilo
                      </Button>
                      <Button variant="outline" className="w-full">
                        Contatta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Azioni Rapide */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Search className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">Ricerca Avanzata</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Affina i tuoi criteri di ricerca per trovare match ancora più precisi
                </p>
                <Button variant="outline" className="w-full">
                  Inizia Ricerca
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">Prenota Sessione</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Prenota subito una sessione con uno dei tuoi istruttori preferiti
                </p>
                <Button variant="outline" className="w-full">
                  Prenota Ora
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">Aggiorna Profilo</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Modifica i tuoi obiettivi e preferenze per migliorare i match
                </p>
                <Button variant="outline" className="w-full">
                  Modifica Profilo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
