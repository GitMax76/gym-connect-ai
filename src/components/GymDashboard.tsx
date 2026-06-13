import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { useNavigate } from 'react-router-dom';
import { Building, Users, Calendar, DollarSign, Star, TrendingUp, LogOut, Search, Tag, Pencil } from 'lucide-react';
import GymProfileEditDialog from './GymProfileEditDialog';
import GymLeads from './GymLeads';
import GymPromotionsManager from './GymPromotionsManager';
import GymMembers from './GymMembers';
import GymBookings from './GymBookings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

const GymDashboard = () => {
  const { profile, gymProfile, loading, refetch } = useProfile();
  const { wallet } = useWallet();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { brandNameFull, toggleBrandName } = useBranding();

  // Dashboard Tabs State
  const [activeTab, setActiveTab] = useState("overview");

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogTab, setEditDialogTab] = useState("details");

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const openEditDialog = (tab: string) => {
    setEditDialogTab(tab);
    setEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 
            onClick={toggleBrandName}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent cursor-pointer flex items-center gap-2 select-none active:scale-95 transition-transform"
            title="Clicca per cambiare brand"
          >
            {brandNameFull}
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full border border-indigo-100 animate-pulse font-normal">Demo</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
              {gymProfile?.gym_name || "Utente"}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title={t('dashboard.logout')}>
              <LogOut className="h-5 w-5 text-slate-500 hover:text-red-500 transition-colors" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-sm">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold">
              {gymProfile?.gym_name?.substring(0, 2).toUpperCase() || "GY"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">{gymProfile?.gym_name || t('gym.welcome')}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm">
              <Building className="h-4 w-4 text-indigo-500" />
              <span>{gymProfile?.address || t('dashboard.profile.not_set')}, {profile?.city}</span>
            </div>
            <p className="text-slate-600 max-w-2xl text-sm leading-relaxed">
              {gymProfile?.description || "Aggiungi una descrizione per presentare la tua palestra."}
            </p>
          </div>

          <Button variant="outline" size="sm" className="ml-auto hover:bg-indigo-50 hover:text-indigo-700 transition-all active:scale-95 border-slate-200" onClick={() => openEditDialog("details")}>
            <Pencil className="h-4 w-4 mr-2 text-indigo-500" />
            {t('gym.edit_profile')}
          </Button>

          <GymProfileEditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            defaultTab={editDialogTab}
            onSwitchToTab={setActiveTab}
            currentProfile={gymProfile}
            onProfileUpdated={() => refetch({ silent: true })}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-1 border shadow-sm rounded-lg grid grid-cols-4 w-full h-auto min-h-[44px]">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-2 data-[state=active]:text-indigo-700 data-[state=active]:bg-indigo-50/50 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('gym.tabs.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2 py-2 data-[state=active]:text-indigo-700 data-[state=active]:bg-indigo-50/50 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('gym.tabs.members')}</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2 py-2 data-[state=active]:text-indigo-700 data-[state=active]:bg-indigo-50/50 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t('gym.tabs.bookings')}</span>
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2 py-2 data-[state=active]:text-indigo-700 data-[state=active]:bg-indigo-50/50 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">{t('gym.tabs.promotions')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="border-slate-200/80 shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{t('gym.stats.active_members')}</p>
                    <h3 className="text-2xl font-bold mt-1 text-slate-800">124</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 border border-indigo-100">
                    <Users className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/80 shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{t('gym.stats.wallet_balance')}</p>
                    <h3 className="text-2xl font-bold mt-1 text-slate-800">{wallet?.balance || 0} FC</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 border border-indigo-100">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/80 shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{t('gym.stats.today_bookings')}</p>
                    <h3 className="text-2xl font-bold mt-1 text-slate-800">8</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100">
                    <Calendar className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/80 shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{t('gym.stats.avg_rating')}</p>
                    <h3 className="text-2xl font-bold mt-1 text-slate-800">4.8</h3>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-full text-amber-600 border border-amber-100">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/80 shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{t('gym.stats.new_leads')}</p>
                    <h3 className="text-2xl font-bold mt-1 text-slate-800">12</h3>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full text-purple-600 border border-purple-100">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-1 h-fit border-slate-200/80 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">{t('gym.actions.title')}</CardTitle>
                  <CardDescription className="text-slate-400">{t('gym.actions.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-98" onClick={() => navigate('/search')}>
                    <Search className="mr-2 h-4 w-4" />
                    {t('gym.actions.search')}
                  </Button>
                  <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => navigate('/wallet')}>
                    <DollarSign className="mr-2 h-4 w-4 text-indigo-500" />
                    {t('gym.actions.wallet')}
                  </Button>
                  <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => setActiveTab("members")}>
                    <Users className="mr-2 h-4 w-4 text-indigo-500" />
                    {t('gym.actions.manage_members')}
                  </Button>
                  <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => setActiveTab("bookings")}>
                    <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                    {t('gym.actions.bookings')}
                  </Button>
                  <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => openEditDialog("facilities")}>
                    <Building className="mr-2 h-4 w-4 text-indigo-500" />
                    {t('gym.actions.manage_facilities')}
                  </Button>
                  <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => openEditDialog("pricing")}>
                    <DollarSign className="mr-2 h-4 w-4 text-indigo-500" />
                    {t('gym.actions.pricing_plans')}
                  </Button>
                  <Button className="w-full justify-start hover:bg-indigo-50 border-slate-200 hover:text-indigo-700 transition-all active:scale-98" variant="outline" onClick={() => openEditDialog("promotions")}>
                    <Tag className="mr-2 h-4 w-4 text-indigo-500" />
                    {t('gym.actions.manage_promotions')}
                  </Button>
                </CardContent>
              </Card>

              {/* Stats & Leads */}
              <div className="lg:col-span-2 space-y-6">
                <GymLeads />

                <Card className="border-slate-200/80 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t('gym.stats.usage_title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1 font-medium text-slate-700">
                          <span>{t('gym.stats.peak_hours')}</span>
                          <span className="text-red-600">85%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 font-medium text-slate-700">
                          <span>{t('gym.stats.morning')}</span>
                          <span className="text-amber-600">45%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 font-medium text-slate-700">
                          <span>{t('gym.stats.afternoon')}</span>
                          <span className="text-emerald-600">60%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-5 text-center italic">
                      {t('gym.stats.usage_footer')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <GymMembers />
          </TabsContent>

          <TabsContent value="bookings">
            <GymBookings />
          </TabsContent>

          <TabsContent value="promotions">
            <GymPromotionsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GymDashboard;
