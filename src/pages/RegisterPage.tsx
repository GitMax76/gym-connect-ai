
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
      title: "🎉 Benvenuto in GymConnect AI!",
      description: "Il tuo profilo è stato creato. Preparati a scoprire il tuo match perfetto nel mondo del fitness!",
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
                <div className="text-center py-20 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-3xl">🏋️‍♂️</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-slate-900">Diventa un Coach di Successo</h2>
                    <p className="text-slate-600 mb-8 text-lg">
                      Il modulo per Personal Trainer e Istruttori sarà disponibile molto presto! 
                      Preparati a trasformare la tua passione in una carriera di successo.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg mb-6">
                      <p className="text-green-800 font-medium">
                        🚀 Funzionalità in arrivo: Gestione clienti, Piani personalizzati, Analytics dettagliati
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleBack}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    ← Torna alla Selezione
                  </button>
                </div>
              )}
              {selectedRole === 'gym' && (
                <div className="text-center py-20 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-400 rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-3xl">🏢</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-slate-900">Ottimizza la Tua Palestra</h2>
                    <p className="text-slate-600 mb-8 text-lg">
                      Il modulo per Palestre e Centri Fitness sarà disponibile molto presto! 
                      Preparati a rivoluzionare la gestione del tuo centro fitness.
                    </p>
                    <div className="bg-orange-50 p-4 rounded-lg mb-6">
                      <p className="text-orange-800 font-medium">
                        📊 Funzionalità in arrivo: Gestione spazi, Analytics membri, Sistema prenotazioni
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleBack}
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    ← Torna alla Selezione
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
