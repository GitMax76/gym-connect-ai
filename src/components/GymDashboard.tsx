import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building, Users, Calendar, DollarSign, Star, TrendingUp, LogOut, Search, Tag, Pencil } from 'lucide-react';
import GymProfileEditDialog from './GymProfileEditDialog';
import GymLeads from './GymLeads';
import GymPromotionsManager from './GymPromotionsManager';
import GymMembers from './GymMembers';
import GymBookings from './GymBookings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const GymDashboard = () => {
  const { profile, gymProfile, loading } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            GymConnect AI
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
              {gymProfile?.gym_name || "Utente"}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Disconnetti">
              <LogOut className="h-5 w-5 text-slate-500" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-24 h-24 border-4 border-slate-50">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
              {gymProfile?.gym_name?.substring(0, 2).toUpperCase() || "GY"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">{gymProfile?.gym_name || "La Tua Palestra"}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500">
              <Building className="h-4 w-4" />
              <span>{gymProfile?.address || "Indirizzo non impostato"}, {profile?.city}</span>
            </div>
            <p className="text-slate-600 max-w-2xl text-sm leading-relaxed">
              {gymProfile?.description || "Aggiungi una descrizione per presentare la tua palestra."}
            </p>
          </div>

          <Button variant="outline" size="sm" className="ml-auto" onClick={() => openEditDialog("details")}>
            <Pencil className="h-4 w-4 mr-2" />
            Modifica Profilo
          </Button>

          <GymProfileEditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            defaultTab={editDialogTab}
            onSwitchToTab={setActiveTab}
            currentProfile={gymProfile}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-1 border shadow-sm rounded-lg grid grid-cols-4 w-full h-auto min-h-[44px]">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Panoramica</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2 py-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Membri</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2 py-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Prenotazioni</span>
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2 py-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Promozioni</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Membri Attivi</p>
                    <h3 className="text-2xl font-bold mt-1">124</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <Users className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Prenotazioni Oggi</p>
                    <h3 className="text-2xl font-bold mt-1">8</h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full text-green-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Rating Medio</p>
                    <h3 className="text-2xl font-bold mt-1">4.8</h3>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                    <Star className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Nuovi Leads</p>
                    <h3 className="text-2xl font-bold mt-1">12</h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Azioni Rapide</CardTitle>
                  <CardDescription>Gestisci la tua attività</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full flex justify-start" onClick={() => navigate('/search')}>
                    <Search className="mr-2 h-4 w-4" />
                    Cerca Trainer/Atleti
                  </Button>
                  <Button className="w-full flex justify-start" variant="outline" onClick={() => setActiveTab("members")}>
                    <Users className="mr-2 h-4 w-4" />
                    Gestisci Membri
                  </Button>
                  <Button className="w-full flex justify-start" variant="outline" onClick={() => setActiveTab("bookings")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Prenotazioni
                  </Button>
                  <Button className="w-full flex justify-start" variant="outline" onClick={() => openEditDialog("facilities")}>
                    <Building className="mr-2 h-4 w-4" />
                    Gestisci Strutture
                  </Button>
                  <Button className="w-full flex justify-start" variant="outline" onClick={() => openEditDialog("pricing")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Piani Abbonamento
                  </Button>
                  <Button className="w-full flex justify-start" variant="secondary" onClick={() => openEditDialog("promotions")}>
                    <Tag className="mr-2 h-4 w-4" />
                    Gestisci Promozioni
                  </Button>
                </CardContent>
              </Card>

              {/* Stats & Leads */}
              <div className="lg:col-span-2 space-y-6">
                <GymLeads />

                <Card>
                  <CardHeader>
                    <CardTitle>Statistiche Utilizzo (Stimate)</CardTitle>
                  </CardHeader>
                  <CardContent>
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
