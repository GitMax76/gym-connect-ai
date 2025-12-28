import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Target, Clock, DollarSign, Activity, LogOut } from 'lucide-react';
import UserProfileEditDialog from './UserProfileEditDialog';
import { Notifications } from './Notifications';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { profile, userProfile, loading } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const handleComingSoon = () => {
    toast({
      title: "In arrivo",
      description: "Questa funzionalità sarà presto disponibile!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white flex justify-between items-start">
        {/* ... existing header code ... */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Ciao, {profile?.first_name || 'Utente'}! 👋
          </h1>
          <p className="text-green-100">
            Benvenuto nella tua dashboard personale
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Notifications />
          <Button
            variant="secondary"
            size="sm"
            onClick={signOut}
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Esci
          </Button>
        </div>
      </div>

      {/* Quick Stats - No changes needed implicitly, but checking for context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... stats ... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obiettivo Fitness</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile?.primary_goal || 'Non impostato'}
            </div>
            <p className="text-xs text-muted-foreground">
              Livello: {userProfile?.fitness_level || 'Non specificato'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{userProfile?.budget_min || 0} - €{userProfile?.budget_max || 0}
            </div>
            <p className="text-xs text-muted-foreground">Budget mensile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilità</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile?.availability_hours_per_week || 0}h
            </div>
            <p className="text-xs text-muted-foreground">Ore a settimana</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Summary - No changes needed implicitly */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Il Tuo Profilo
              </CardTitle>
              {userProfile && <UserProfileEditDialog currentProfile={userProfile} />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {userProfile ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Età</p>
                    <p className="font-medium">{userProfile.age || 'Non specificata'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Peso</p>
                    <p className="font-medium">{userProfile.weight ? `${userProfile.weight} kg` : 'Non specificato'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Altezza</p>
                    <p className="font-medium">{userProfile.height ? `${userProfile.height} cm` : 'Non specificata'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Livello</p>
                    <p className="font-medium">{userProfile.fitness_level || 'Non specificato'}</p>
                  </div>
                </div>
                {userProfile.experience_description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Esperienza</p>
                    <p className="text-sm">{userProfile.experience_description}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Completa il tuo profilo per iniziare</p>
                <Button>Completa Profilo</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Azioni Rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline" onClick={() => navigate('/search')}>
              <Calendar className="mr-2 h-4 w-4" />
              Trova Trainer
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/search')}>
              <MapPin className="mr-2 h-4 w-4" />
              Cerca Palestre
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/bookings')}>
              <Activity className="mr-2 h-4 w-4" />
              Le Mie Prenotazioni
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/workout-plans')}>
              <Target className="mr-2 h-4 w-4" />
              Piano di Allenamento
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Attività Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nessuna attività recente</p>
            <p className="text-sm">Le tue prenotazioni e sessioni appariranno qui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
