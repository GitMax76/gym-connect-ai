
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import RoleSelector from '@/components/RoleSelector';
import UserRegistrationForm from '@/components/UserRegistrationForm';
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
    toast({
      title: "Registrazione completata!",
      description: "Il tuo account è stato creato con successo. Ora puoi accedere alla piattaforma.",
    });
    navigate('/dashboard');
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'role' ? (
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Scegli il Tuo
                <span className="block bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                  Ruolo
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto">
                Seleziona come vuoi utilizzare GymConnect AI per iniziare la tua esperienza personalizzata
              </p>
              <RoleSelector onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
            </div>
          ) : (
            <div className="animate-slide-up">
              {selectedRole === 'user' && (
                <UserRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} />
              )}
              {selectedRole === 'instructor' && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold mb-4">Modulo Istruttore</h2>
                  <p className="text-slate-600 mb-8">Questa sezione sarà disponibile nella prossima versione</p>
                  <button 
                    onClick={handleBack}
                    className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Torna alla Selezione
                  </button>
                </div>
              )}
              {selectedRole === 'gym' && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold mb-4">Modulo Palestra</h2>
                  <p className="text-slate-600 mb-8">Questa sezione sarà disponibile nella prossima versione</p>
                  <button 
                    onClick={handleBack}
                    className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Torna alla Selezione
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
