
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchFilters from '@/components/SearchFilters';
import SearchResults from '@/components/SearchResults';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMatching } from '@/hooks/useMatching';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Filter, Zap, Sparkles, ChevronRight } from 'lucide-react';

const SearchPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { matches, loading: matchingLoading, findMatches, preferences } = useMatching();
  const { profile, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<'trainer' | 'gym' | 'user'>('trainer');
  const [filters, setFilters] = useState<any>({});

  // Guest simulation sandbox states
  const [guestGoal, setGuestGoal] = useState('muscle-gain');
  const [guestCity, setGuestCity] = useState('Roma');

  // Determine available tabs based on user role
  const availableTabs = React.useMemo(() => {
    if (!user) return ['trainer', 'gym']; // Unregistered guests can only search trainers/gyms
    if (!profile?.user_type) return ['trainer', 'gym'];

    switch (profile.user_type) {
      case 'trainer':
        return ['user', 'gym'];
      case 'gym_owner':
        return ['trainer', 'user'];
      case 'user':
      default:
        return ['trainer', 'gym'];
    }
  }, [profile, user]);

  useEffect(() => {
    // Set default active tab when profile loads
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab as any)) {
      setActiveTab(availableTabs[0] as any);
    }
  }, [availableTabs]);

  useEffect(() => {
    // Wait for authentication and profile to load
    if (authLoading || profileLoading) return;

    // Build filters combining guestCity if user is guest
    const activeFilters = {
      ...filters,
      ...(!user ? { city: guestCity } : {})
    };

    findMatches(activeTab, activeFilters);
  }, [activeTab, authLoading, profileLoading, filters, guestCity, user]);

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
    // findMatches will be called by useEffect when filters change
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'trainer' | 'gym' | 'user');
  };

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'trainer': return 'Trainer Personali';
      case 'gym': return 'Palestre';
      case 'user': return 'Atleti';
      default: return type;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-lime-500 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Trova il Match Perfetto
              </h1>
            </div>
            <p className="text-slate-600 max-w-2xl">
              Utilizza il nostro algoritmo di matching intelligente per trovare {(!user || profile?.user_type !== 'trainer') ? 'trainer e palestre' : 'clienti e palestre'}
              perfettamente allineati ai tuoi obiettivi.
            </p>
          </div>

          {/* Smart Matching Banner */}
          <Card className="mb-6 bg-gradient-to-r from-indigo-50/50 to-lime-50/20 border-indigo-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-lime-500 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    Matching Intelligente Attivo
                  </h3>
                  <p className="text-slate-600">
                    I risultati sono ordinati in base alla compatibilità con le tue preferenze.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Guest Sandbox Controls */}
          {!user && (
            <Card className="mb-6 border-indigo-100 bg-gradient-to-r from-indigo-50/30 to-lime-50/10 shadow-sm relative overflow-hidden animate-reveal-in">
              <div className="absolute top-0 right-0 bg-indigo-605 text-white font-bold text-[9px] tracking-widest uppercase px-3 py-1 rounded-bl-lg gradient-primary">
                Sandbox Demo
              </div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-indigo-500 fill-indigo-100 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Simula il tuo Profilo Atleta
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Non sei ancora registrato. Configura questi filtri temporanei per simulare il tuo profilo ed esplorare i punteggi e i fattori di compatibilità AI in tempo reale!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Obiettivo Desiderato
                    </label>
                    <select
                      value={guestGoal}
                      onChange={(e) => setGuestGoal(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                      <option value="muscle-gain">Massa Muscolare</option>
                      <option value="weight-loss">Perdita Peso</option>
                      <option value="endurance">Resistenza & Corsa</option>
                      <option value="flexibility">Flessibilità & Yoga</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Città (Scenari Mock)
                    </label>
                    <select
                      value={guestCity}
                      onChange={(e) => setGuestCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                      <option value="Roma">Roma (Scenari completi)</option>
                      <option value="Salerno">Salerno (Scenari completi)</option>
                      <option value="Milano">Milano</option>
                    </select>
                  </div>

                  <div className="flex items-end pb-0.5">
                    <Button 
                      onClick={() => navigate('/register')} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform duration-100"
                    >
                      <span>Registrati gratis</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar con filtri */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtri di Ricerca
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SearchFilters
                    searchType={activeTab}
                    onFiltersChange={handleSearch}
                    preferences={preferences}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className={`grid w-full grid-cols-${availableTabs.length} mb-6`}>
                  {availableTabs.map(type => (
                    <TabsTrigger key={type} value={type}>
                      {getTabLabel(type)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {availableTabs.map(type => (
                  <TabsContent key={type} value={type}>
                    <SearchResults
                      results={matches.filter(m => m.type === type)}
                      loading={matchingLoading}
                      type={type as any}
                      currentUserProfile={profile || {
                        city: guestCity,
                        user_profiles: {
                          primary_goal: guestGoal,
                          budget_max: filters.budget_max || 80
                        }
                      }}
                      currentUserPreferences={preferences || {
                        user_id: 'guest-user',
                        budget_max: filters.budget_max || 80,
                        preferred_trainer_specializations: guestGoal === 'muscle-gain' ? ['Bodybuilding', 'CrossFit', 'Functional Training', 'Personal Training'] : guestGoal === 'weight-loss' ? ['Cardio', 'Functional Training', 'Pilates'] : []
                      }}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
