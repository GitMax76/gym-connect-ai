
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import RoleSelector from '@/components/RoleSelector';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import GymRegistrationForm from '@/components/GymRegistrationForm';
import TrainerRegistrationForm from '@/components/TrainerRegistrationForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<'user' | 'instructor' | 'gym' | ''>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'user' | 'instructor' | 'gym') => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleFormSubmit = (data: any) => {
    console.log('Registration data:', { role: selectedRole, ...data });
    
    let welcomeMessage = '';
    let description = '';
    
    switch (selectedRole) {
      case 'user':
        welcomeMessage = "🎉 Benvenuto in GymConnect AI!";
        description = "Il tuo profilo atleta è stato creato. Preparati a scoprire il tuo match perfetto nel mondo del fitness!";
        break;
      case 'instructor':
        welcomeMessage = "💪 Benvenuto Coach!";
        description = "Il tuo profilo trainer è stato attivato. Inizia a costruire la tua community di atleti motivati!";
        break;
      case 'gym':
        welcomeMessage = "🏢 Palestra Registrata!";
        description = "La tua struttura è ora parte del network GymConnect. Attrai nuovi membri e ottimizza la gestione!";
        break;
    }
    
    toast({
      title: welcomeMessage,
      description: description,
    });
    navigate('/dashboard');
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'role' ? (
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Trasforma la Tua
                <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-orange-500 bg-clip-text text-transparent">
                  Passione Fitness
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-4 max-w-4xl mx-auto leading-relaxed">
                Unisciti alla rivoluzione del fitness intelligente. Scegli il tuo ruolo e inizia a creare 
                connessioni autentiche nel mondo del benessere e della forma fisica.
              </p>
              <p className="text-lg text-green-600 font-medium mb-12">
                ✨ Oltre 10.000 professionisti già connessi ✨
              </p>
              <RoleSelector onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
            </div>
          ) : (
            <div className="animate-slide-up">
              {selectedRole === 'user' && (
                <UserRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} />
              )}
              {selectedRole === 'instructor' && (
                <TrainerRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} />
              )}
              {selectedRole === 'gym' && (
                <GymRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
