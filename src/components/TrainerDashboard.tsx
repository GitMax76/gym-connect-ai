import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Users, DollarSign, Star, Clock, Award, LogOut, Target } from 'lucide-react';
import TrainerProfileEditDialog from './TrainerProfileEditDialog';
import { Notifications } from './Notifications';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AvailabilitySettings from './AvailabilitySettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import CreateWorkoutPlanDialog from './CreateWorkoutPlanDialog';

const TrainerDashboard = () => {
  const { profile, trainerProfile, loading } = useProfile();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleComingSoon = () => {
    toast({
      title: t('trainer.coming_soon.title'),
      description: t('trainer.coming_soon.desc'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-6 text-white flex justify-between items-start shadow-md">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('trainer.welcome')}, {profile?.first_name || t('trainer.pro')}! 👋
          </h1>
          <p className="text-indigo-100">
            {t('trainer.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Notifications />
          <Button
            variant="secondary"
            size="sm"
            onClick={signOut}
            className="bg-white/20 hover:bg-white/30 text-white border-0 transition-transform active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('dashboard.logout')}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('trainer.stats.active_clients')}</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">12</div>
            <p className="text-xs text-emerald-600 mt-1">{t('trainer.stats.monthly_growth')}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('trainer.stats.hourly_rate')}</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              €{trainerProfile?.personal_rate_per_hour || 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('trainer.stats.rate_desc')}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('trainer.stats.rating')}</CardTitle>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">4.8</div>
            <p className="text-xs text-slate-400 mt-1">15 {t('trainer.stats.reviews')}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('trainer.stats.experience')}</CardTitle>
            <Award className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {trainerProfile?.years_experience || 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('trainer.stats.experience_desc')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Summary */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <Award className="h-5 w-5 text-indigo-500" />
                {t('trainer.profile.title')}
              </CardTitle>
              {trainerProfile && <TrainerProfileEditDialog currentProfile={trainerProfile} />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainerProfile ? (
              <>
                <div>
                  <p className="text-sm text-slate-400">{t('trainer.profile.specializations')}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {trainerProfile.specializations?.map((spec, index) => (
                      <span key={index} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-100">
                        {spec}
                      </span>
                    )) || <span className="text-slate-400 text-sm">{t('trainer.profile.no_specializations')}</span>}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400">{t('trainer.profile.certifications')}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {trainerProfile.certifications?.map((cert, index) => (
                      <span key={index} className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-100">
                        {cert}
                      </span>
                    )) || <span className="text-slate-400 text-sm">{t('trainer.profile.no_certifications')}</span>}
                  </div>
                </div>
                {trainerProfile.bio && (
                  <div>
                    <p className="text-sm text-slate-400">{t('trainer.profile.bio')}</p>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{trainerProfile.bio}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">{t('trainer.profile.incomplete')}</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95">
                  {t('trainer.profile.complete_btn')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calendar className="h-5 w-5 text-indigo-500" />
              {t('trainer.actions.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user && <AvailabilitySettings trainerId={user.id} />}
            <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => navigate('/clients')}>
              <Users className="mr-2 h-4 w-4 text-indigo-500" />
              {t('trainer.actions.my_clients')}
            </Button>
            <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => navigate('/bookings')}>
              <Clock className="mr-2 h-4 w-4 text-indigo-500" />
              {t('trainer.actions.today_bookings')}
            </Button>
            <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={handleComingSoon}>
              <DollarSign className="mr-2 h-4 w-4 text-indigo-500" />
              {t('trainer.actions.earnings')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">{t('trainer.schedule.today')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">Marco Rossi</p>
                <p className="text-sm text-slate-500">{t('trainer.schedule.pt')}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-700">09:00 - 10:00</p>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-100 font-medium">{t('trainer.status.confirmed')}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">Laura Bianchi</p>
                <p className="text-sm text-slate-500">{t('trainer.schedule.yoga')}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-700">14:00 - 15:00</p>
                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100 font-medium">{t('trainer.status.pending')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Section */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Target className="h-5 w-5 text-indigo-500" />
            {t('trainer.coaching.requests')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RequestsList t={t} user={user} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface RequestsListProps {
  t: (key: string) => string;
  user: any;
}

const RequestsList: React.FC<RequestsListProps> = ({ t, user }) => {
  const [requests, setRequests] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      const { data } = await supabase
        .from('workout_requests' as any)
        .select('*, profiles!workout_requests_user_id_fkey(first_name, last_name, email)')
        .eq('trainer_id', user.id)
        .eq('status', 'pending');
      if (data) setRequests(data);
    };
    fetchRequests();
  }, [user]);

  if (requests.length === 0) {
    return <p className="text-slate-400 text-sm">{t('trainer.coaching.no_requests')}</p>;
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200/80">
          <div>
            <p className="font-semibold text-slate-800">{req.profiles?.first_name} {req.profiles?.last_name}</p>
            <p className="text-sm text-slate-600">{t('trainer.coaching.goal')}: {req.goals}</p>
            <p className="text-xs text-slate-500 mt-0.5">{req.days_per_week} {t('trainer.coaching.days_per_week')}</p>
            {req.injuries && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {req.injuries}</p>}
          </div>
          <CreateWorkoutPlanDialog
            userId={req.user_id}
            userName={`${req.profiles?.first_name} ${req.profiles?.last_name}`}
            onSuccess={() => {
              window.location.reload();
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TrainerDashboard;
