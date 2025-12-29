
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, DollarSign, Users, Award, Zap } from 'lucide-react';
import { MatchResult } from '@/hooks/useMatching';


import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface SearchResultsProps {
  results: MatchResult[];
  loading: boolean;
  type: 'trainer' | 'gym' | 'user';
}

const SearchResults = ({ results, loading, type }: SearchResultsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading) {
    // ... (keep loading state as is, but I can't overwrite partial file easily if I need to inject hooks at top component level)
    // I will overwrite properly.
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nessun risultato trovato
          </h3>
          <p className="text-gray-600">
            Prova a modificare i filtri di ricerca per trovare più opzioni.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Ottimo Match';
    if (score >= 60) return 'Buon Match';
    return 'Match Base';
  };

  const handleBooking = () => {
    if (type === 'user') {
      toast({
        title: "Promozione Inviata! 🚀",
        description: "L'atleta riceverà una notifica con la tua offerta.",
        variant: "default",
      });
      return;
    }

    toast({
      description: "Il sistema di prenotazione sarà disponibile a breve.",
    });
  };

  const getActionButtonLabel = () => {
    if (type === 'user') return 'Invia Promozione';
    if (type === 'trainer') return 'Prenota Sessione';
    return 'Richiedi Info';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {results.length} {type === 'trainer' ? 'Trainer' : type === 'gym' ? 'Palestre' : 'Atleti'} trovati
        </h2>
        <div className="text-sm text-gray-600">
          Ordinati per compatibilità
        </div>
      </div>

      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                {(type === 'trainer' || type === 'user') && (
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={result.profile.profiles?.avatar_url} />
                    <AvatarFallback>
                      {result.profile.profiles?.first_name?.[0]}{result.profile.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {(type === 'trainer' || type === 'user')
                      ? `${result.profile.profiles?.first_name || ''} ${result.profile.profiles?.last_name || ''}`
                      : result.profile.gym_name
                    }
                  </h3>
                  {result.profile.profiles?.city && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {result.profile.profiles.city}
                    </div>
                  )}
                </div>
              </div>

              {/* Match Score */}
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(result.score)}`}>
                  <Zap className="h-4 w-4" />
                  {Math.round(result.score)}% Match
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getMatchLabel(result.score)}
                </div>
              </div>
            </div>

            {/* Description */}
            {result.profile.bio && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {result.profile.bio}
              </p>
            )}

            {result.profile.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {result.profile.description}
              </p>
            )}

            {/* Tags/Specializations */}
            <div className="flex flex-wrap gap-2 mb-4">
              {type === 'trainer' && result.profile.specializations?.slice(0, 3).map((spec: string) => (
                <Badge key={spec} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {type === 'gym' && result.profile.facilities?.slice(0, 3).map((facility: string) => (
                <Badge key={facility} variant="secondary" className="text-xs">
                  {facility}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-4">
                {type === 'trainer' && (
                  <>
                    {result.profile.years_experience && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {result.profile.years_experience} anni
                      </div>
                    )}
                    {result.profile.personal_rate_per_hour && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        €{result.profile.personal_rate_per_hour}/ora
                      </div>
                    )}
                  </>
                )}
                {type === 'gym' && (
                  <>
                    {result.profile.monthly_fee && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        €{result.profile.monthly_fee}/mese
                      </div>
                    )}
                    {result.profile.member_capacity && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Fino a {result.profile.member_capacity} membri
                      </div>
                    )}
                  </>
                )}
                {type === 'user' && (
                  <>
                    {result.profile.primary_goal && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {result.profile.primary_goal === 'muscle-gain' ? 'Massa Muscolare' :
                          result.profile.primary_goal === 'weight-loss' ? 'Perdita Peso' :
                            result.profile.primary_goal}
                      </div>
                    )}
                    {result.profile.fitness_level && (
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-1" />
                        {result.profile.fitness_level}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span>4.8 (15 recensioni)</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => navigate(`/profile/${result.id}`)}
              >
                Visualizza Profilo
              </Button>
              <Button variant="outline" onClick={handleBooking}>
                {type === 'trainer' ? 'Prenota Sessione' : type === 'user' ? 'Invia Promozione' : 'Richiedi Info'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


export default SearchResults;
