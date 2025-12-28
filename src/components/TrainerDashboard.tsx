import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Users, DollarSign, Star, Clock, Award, LogOut } from 'lucide-react';
import TrainerProfileEditDialog from './TrainerProfileEditDialog';
import { Notifications } from './Notifications';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AvailabilitySettings from './AvailabilitySettings';

const TrainerDashboard = () => {
  const { profile, trainerProfile, loading } = useProfile();
  const { signOut, user } = useAuth();
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white flex justify-between items-start">
        {/* ... existing header code ... */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Ciao, Trainer {profile?.first_name || 'Professionista'}! 👋
          </h1>
          <p className="text-blue-100">
            Gestisci i tuoi clienti e le tue sessioni
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

      {/* Quick Stats - No changes needed implicitly, but keeping context */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clienti Attivi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 questo mese</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tariffa Oraria</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{trainerProfile?.personal_rate_per_hour || 0}
            </div>
            <p className="text-xs text-muted-foreground">Sessioni individuali</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valutazione</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">15 recensioni</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esperienza</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainerProfile?.years_experience || 0}
            </div>
            <p className="text-xs text-muted-foreground">Anni di esperienza</p>
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
                <Award className="h-5 w-5" />
                Il Tuo Profilo Trainer
              </CardTitle>
              {trainerProfile && <TrainerProfileEditDialog currentProfile={trainerProfile} />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainerProfile ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Specializzazioni</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {trainerProfile.specializations?.map((spec, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {spec}
                      </span>
                    )) || <span className="text-muted-foreground">Nessuna specializzazione</span>}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificazioni</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {trainerProfile.certifications?.map((cert, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {cert}
                      </span>
                    )) || <span className="text-muted-foreground">Nessuna certificazione</span>}
                  </div>
                </div>
                {trainerProfile.bio && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="text-sm">{trainerProfile.bio}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Completa il tuo profilo trainer</p>
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
            {user && <AvailabilitySettings trainerId={user.id} />}
            <Button className="w-full" variant="outline" onClick={() => navigate('/clients')}>
              <Users className="mr-2 h-4 w-4" />
              I Miei Clienti
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/bookings')}>
              <Clock className="mr-2 h-4 w-4" />
              Prenotazioni Oggi
            </Button>
            <Button className="w-full" variant="outline" onClick={handleComingSoon}>
              <DollarSign className="mr-2 h-4 w-4" />
              Guadagni
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Programma di Oggi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Marco Rossi</p>
                <p className="text-sm text-muted-foreground">Allenamento Personal Training</p>
              </div>
              <div className="text-right">
                <p className="font-medium">09:00 - 10:00</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Confermato</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Laura Bianchi</p>
                <p className="text-sm text-muted-foreground">Sessione di Yoga</p>
              </div>
              <div className="text-right">
                <p className="font-medium">14:00 - 15:00</p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In attesa</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerDashboard;
