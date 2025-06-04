
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'user' | 'instructor' | 'gym') => void;
  selectedRole?: string;
}

const RoleSelector = ({ onRoleSelect, selectedRole }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'user',
      title: 'Utente',
      description: 'Trova la palestra e l\'istruttore perfetti per i tuoi obiettivi',
      icon: Users,
      features: ['Matchmaking personalizzato', 'Schede di allenamento', 'Monitoraggio progressi'],
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'instructor',
      title: 'Istruttore',
      description: 'Connettiti con clienti e palestre, gestisci la tua attività',
      icon: Calendar,
      features: ['Gestione clienti', 'Calendario integrato', 'Portafoglio digitale'],
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'gym',
      title: 'Palestra',
      description: 'Ottimizza la gestione degli spazi e aumenta la visibilità',
      icon: Clock,
      features: ['Gestione prenotazioni', 'Analytics avanzate', 'Promozioni mirate'],
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;
        
        return (
          <Card 
            key={role.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
              isSelected 
                ? 'border-green-500 shadow-lg' 
                : 'border-slate-200 hover:border-green-300'
            }`}
            onClick={() => onRoleSelect(role.id as 'user' | 'instructor' | 'gym')}
          >
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                {role.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center leading-relaxed">
                {role.description}
              </p>
              
              <ul className="space-y-2">
                {role.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full mt-4 ${
                  isSelected 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-slate-600 hover:bg-slate-700'
                } text-white`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRoleSelect(role.id as 'user' | 'instructor' | 'gym');
                }}
              >
                {isSelected ? 'Selezionato' : 'Seleziona'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoleSelector;
