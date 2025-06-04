
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Dumbbell, Building2 } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'user' | 'instructor' | 'gym') => void;
  selectedRole: string;
}

const RoleSelector = ({ onRoleSelect, selectedRole }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'user',
      title: 'Atleta & Fitness Lover',
      subtitle: 'Raggiungi i tuoi obiettivi',
      description: 'Trasforma il tuo corpo e la tua mente. Trova l\'istruttore perfetto e la palestra ideale per il tuo percorso di crescita personale.',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-400',
      benefits: ['Match personalizzato AI', 'Piani su misura', 'Monitoraggio progressi']
    },
    {
      id: 'instructor',
      title: 'Personal Trainer & Coach',
      subtitle: 'Ispira e trasforma vite',
      description: 'Condividi la tua passione per il fitness. Connettiti con clienti motivati e fai crescere la tua carriera nel mondo del benessere.',
      icon: Dumbbell,
      gradient: 'from-green-500 to-emerald-400',
      benefits: ['Clienti qualificati', 'Gestione smart', 'Crescita professionale']
    },
    {
      id: 'gym',
      title: 'Centro Fitness & Palestra',
      subtitle: 'Il tempio del benessere',
      description: 'Ottimizza la tua struttura fitness. Attira nuovi membri, gestisci al meglio i tuoi spazi e crea una community del benessere.',
      icon: Building2,
      gradient: 'from-orange-500 to-red-400',
      benefits: ['Ottimizzazione spazi', 'Nuovi membri', 'Analytics avanzati']
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {roles.map((role) => (
        <Card 
          key={role.id}
          className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg overflow-hidden ${
            selectedRole === role.id ? 'ring-4 ring-green-500 shadow-2xl scale-105' : ''
          }`}
          onClick={() => onRoleSelect(role.id as 'user' | 'instructor' | 'gym')}
        >
          <div className={`h-2 bg-gradient-to-r ${role.gradient}`}></div>
          
          <CardContent className="p-8 text-center relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <role.icon className="w-full h-full text-slate-600" />
            </div>
            
            {/* Icon */}
            <div className={`w-20 h-20 bg-gradient-to-r ${role.gradient} rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
              <role.icon className="w-10 h-10 text-white" />
            </div>
            
            {/* Content */}
            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
              {role.title}
            </h3>
            <p className="text-green-600 font-semibold mb-4 text-lg">
              {role.subtitle}
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {role.description}
            </p>
            
            {/* Benefits */}
            <div className="space-y-2">
              {role.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-center text-sm text-slate-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {benefit}
                </div>
              ))}
            </div>
            
            {/* Selection indicator */}
            {selectedRole === role.id && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoleSelector;
