
import React from 'react';
import Layout from '@/components/Layout';
import { useProfile } from '@/hooks/useProfile';
import UserDashboard from '@/components/UserDashboard';
import TrainerDashboard from '@/components/TrainerDashboard';
import GymDashboard from '@/components/GymDashboard';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Caricamento dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Profilo non trovato</h2>
              <p className="text-slate-600 mb-6">
                Non riusciamo a trovare le tue informazioni del profilo. 
                Potrebbe essere necessario completare la registrazione.
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/register')} className="w-full">
                  Completa Registrazione
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                  Torna alla Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const renderDashboard = () => {
    switch (profile.user_type) {
      case 'user':
        return <UserDashboard />;
      case 'trainer':
        return <TrainerDashboard />;
      case 'gym_owner':
        return <GymDashboard />;
      default:
        return (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Tipo utente non riconosciuto</h2>
              <p className="text-slate-600 mb-6">
                Il tuo tipo di utente non è stato riconosciuto. 
                Contatta il supporto per assistenza.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Torna alla Home
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderDashboard()}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
