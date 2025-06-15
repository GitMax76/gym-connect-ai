
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchFilters from '@/components/SearchFilters';
import SearchResults from '@/components/SearchResults';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMatching } from '@/hooks/useMatching';
import { Search, Filter, Zap } from 'lucide-react';

const SearchPage = () => {
  const { matches, loading, findMatches, preferences } = useMatching();
  const [activeTab, setActiveTab] = useState<'trainer' | 'gym'>('trainer');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Automatically find matches when page loads
    findMatches(activeTab);
  }, [activeTab]);

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
    findMatches(activeTab);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'trainer' | 'gym');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Trova il Match Perfetto
              </h1>
            </div>
            <p className="text-slate-600 max-w-2xl">
              Utilizza il nostro algoritmo di matching intelligente per trovare trainer e palestre 
              perfettamente allineati ai tuoi obiettivi e preferenze.
            </p>
          </div>

          {/* Smart Matching Banner */}
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    Matching Intelligente Attivo
                  </h3>
                  <p className="text-slate-600">
                    I risultati sono ordinati in base alla compatibilità con le tue preferenze. 
                    {preferences ? ' Le tue preferenze sono state caricate.' : ' Configura le tue preferenze per risultati più precisi.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="trainer">Trainer Personali</TabsTrigger>
                  <TabsTrigger value="gym">Palestre</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trainer">
                  <SearchResults 
                    results={matches.filter(m => m.type === 'trainer')} 
                    loading={loading} 
                    type="trainer"
                  />
                </TabsContent>
                
                <TabsContent value="gym">
                  <SearchResults 
                    results={matches.filter(m => m.type === 'gym')} 
                    loading={loading} 
                    type="gym"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
