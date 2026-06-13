import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Target, Clock, DollarSign, Activity, LogOut, Users } from 'lucide-react';
import UserProfileEditDialog from './UserProfileEditDialog';
import { Notifications } from './Notifications';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';

const UserDashboard = () => {
  const { profile, userProfile, loading } = useProfile();
  const { signOut } = useAuth();
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
      title: t('dashboard.coming_soon') || "In arrivo",
      description: t('dashboard.coming_soon.desc') || "Questa funzionalità sarà presto disponibile!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-6 text-white flex justify-between items-start shadow-md">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('dashboard.welcome')}, {profile?.first_name || t('dashboard.profile.not_specified')}! 👋
          </h1>
          <p className="text-indigo-100">
            {t('dashboard.subtitle.user')}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.goal')}</CardTitle>
            <Target className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {userProfile?.primary_goal || t('dashboard.profile.not_set')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t('dashboard.profile.level')}: {userProfile?.fitness_level || t('dashboard.profile.not_specified')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.budget')}</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              €{userProfile?.budget_min || 0} - €{userProfile?.budget_max || 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.stats.budget_label')}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.availability')}</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {userProfile?.availability_hours_per_week || 0}h
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.stats.availability_label')}</p>
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
                <Activity className="h-5 w-5 text-indigo-55px" />
                {t('dashboard.profile.title')}
              </CardTitle>
              {userProfile && <UserProfileEditDialog currentProfile={userProfile} />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {userProfile ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{t('dashboard.profile.age')}</p>
                    <p className="font-medium text-slate-700">{userProfile.age || t('dashboard.profile.not_defined')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{t('dashboard.profile.weight')}</p>
                    <p className="font-medium text-slate-700">{userProfile.weight ? `${userProfile.weight} kg` : t('dashboard.profile.not_specified')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{t('dashboard.profile.height')}</p>
                    <p className="font-medium text-slate-700">{userProfile.height ? `${userProfile.height} cm` : t('dashboard.profile.not_defined')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{t('dashboard.profile.level')}</p>
                    <p className="font-medium text-slate-700">{userProfile.fitness_level || t('dashboard.profile.not_specified')}</p>
                  </div>
                </div>
                {userProfile.experience_description && (
                  <div>
                    <p className="text-sm text-slate-400">{t('dashboard.profile.exp')}</p>
                    <p className="text-sm text-slate-700">{userProfile.experience_description}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">{t('dashboard.profile.incomplete')}</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95">
                  {t('dashboard.profile.complete_btn')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <MapPin className="h-5 w-5 text-indigo-55px" />
              {t('dashboard.actions.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => navigate('/search')}>
              <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
              {t('dashboard.actions.find_trainer')}
            </Button>
            <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => navigate('/search')}>
              <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
              {t('dashboard.actions.search_gyms')}
            </Button>
            <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => navigate('/bookings')}>
              <Activity className="mr-2 h-4 w-4 text-indigo-500" />
              {t('dashboard.actions.bookings')}
            </Button>
            <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => navigate('/workout-plans')}>
              <Target className="mr-2 h-4 w-4 text-indigo-500" />
              {t('dashboard.actions.workout_plans')}
            </Button>
          </CardContent>
        </Card>

        {/* Referral Card */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Users className="h-5 w-5 text-indigo-200" />
              {t('dashboard.referral.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-100 mb-4 text-sm leading-relaxed">
              {t('dashboard.referral.desc')}
            </p>
            <div className="bg-white/10 p-3 rounded-lg text-center mb-4 border border-white/10">
              <span className="font-mono text-xl font-bold tracking-wider">
                {profile?.referral_code || 'CARICAMENTO...'}
              </span>
            </div>
            <Button
              className="w-full bg-white text-indigo-600 hover:bg-indigo-50 transition-all active:scale-98"
              onClick={() => {
                navigator.clipboard.writeText(profile?.referral_code || '');
                toast({ title: t('common.copied') || "Copiato!", description: t('common.copied.desc') || "Codice invito copiato negli appunti." });
              }}
            >
              {t('dashboard.referral.copy')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">{t('dashboard.activity.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50 text-indigo-500" />
            <p className="font-semibold text-slate-600">{t('dashboard.activity.empty')}</p>
            <p className="text-sm mt-1">{t('dashboard.activity.desc')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
