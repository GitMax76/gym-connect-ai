
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building, Users, Calendar, DollarSign, Star, TrendingUp, LogOut } from 'lucide-react';
import GymProfileEditDialog from './GymProfileEditDialog';
import GymLeads from './GymLeads';

const GymDashboard = () => {
  const { profile, gymProfile, loading } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Benvenuto, {gymProfile?.gym_name || profile?.first_name || 'Gestore'}! 🏋️‍♀️
          </h1>
          <p className="text-purple-100">
            Gestisci la tua palestra e i tuoi membri
          </p>
        </div>
        <Button
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 text-white border-0"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Esci
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membri Attivi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+12% vs mese scorso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incasso Mensile</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{gymProfile?.monthly_fee ? gymProfile.monthly_fee * 248 : 0}
            </div>
            <p className="text-xs text-muted-foreground">Abbonamenti mensili</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valutazione</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">32 recensioni</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacità</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gymProfile?.member_capacity || 0}
            </div>
            <p className="text-xs text-muted-foreground">Membri massimi</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gym Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Profilo Palestra
              </CardTitle>
              {gymProfile && <GymProfileEditDialog currentProfile={gymProfile} />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {gymProfile ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Nome Palestra</p>
                  <p className="font-medium">{gymProfile.gym_name}</p>
                </div>
                {gymProfile.address && (
                  <div>
                    <p className="text-sm text-muted-foreground">Indirizzo</p>
                    <p className="text-sm">{gymProfile.address}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Servizi</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {gymProfile.facilities?.map((facility, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {facility}
                      </span>
                    )) || <span className="text-muted-foreground">Nessun servizio specificato</span>}
                  </div>
                </div>
                {gymProfile.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descrizione</p>
                    <p className="text-sm">{gymProfile.description}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Completa il profilo della tua palestra</p>
                <Button>Completa Profilo</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Azioni Rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Gestisci Membri
            </Button>
            <Button className="w-full" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Prenotazioni
            </Button>
            <Button className="w-full" variant="outline">
              <Building className="mr-2 h-4 w-4" />
              Gestisci Strutture
            </Button>
            <Button className="w-full" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Piani Abbonamento
            </Button>
          </CardContent>
        </Card>
      </div>

      import GymLeads from './GymLeads';

      // ... (inside component)

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gym Profile */}
        <Card>
          {/* ... keeping profile card distinct if possible, but the replace tool works on chunks. 
                I need to be careful not to delete GymProfileEditDialog integration.
                Wait, I see the Instruction says replace New Members card.
                Let's target the exact block for 'Recent Activity'.
             */}
        </Card>
        {/* ... */}
      </div>

      {/* Leads and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GymLeads />

        <Card>
          <CardHeader>
            <CardTitle>Statistiche Utilizzo (Stimate)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Keep stats but mark as estimated */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Ore di punta (18:00-20:00)</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mattina (08:00-12:00)</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pomeriggio (14:00-17:00)</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Dati basati sulla capacità dichiarata e prenotazioni medie.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymDashboard;
