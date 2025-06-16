
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Euro, Clock, Dumbbell, Building } from 'lucide-react';
import { TrainerSearchResult, GymSearchResult } from '@/hooks/useSearch';

interface SearchResultCardProps {
  result: TrainerSearchResult | GymSearchResult;
  type: 'trainer' | 'gym';
  onViewDetails: (id: string) => void;
  onBook?: (id: string) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  type,
  onViewDetails,
  onBook
}) => {
  const isTrainer = type === 'trainer';
  const trainer = isTrainer ? result as TrainerSearchResult : null;
  const gym = !isTrainer ? result as GymSearchResult : null;

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {isTrainer 
              ? `${trainer?.profile.first_name} ${trainer?.profile.last_name}`
              : gym?.gym_name
            }
          </CardTitle>
          {result.is_verified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verificato
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>
            {isTrainer ? trainer?.profile.city : gym?.profile.city}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description/Bio */}
        <p className="text-sm text-gray-700 line-clamp-2">
          {isTrainer ? trainer?.bio : gym?.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">
            {result.average_rating ? result.average_rating.toFixed(1) : 'Nuovo'}
          </span>
          <span className="text-xs text-gray-500">
            ({result.total_reviews} recensioni)
          </span>
        </div>

        {/* Specializations */}
        {result.specializations && result.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {result.specializations.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
            {result.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{result.specializations.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Trainer specific info */}
        {isTrainer && (
          <div className="space-y-2">
            {trainer?.years_experience && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{trainer.years_experience} anni di esperienza</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Euro className="w-4 h-4 text-gray-500" />
              <span>
                {trainer?.personal_rate_per_hour 
                  ? `€${trainer.personal_rate_per_hour}/h personale` 
                  : 'Prezzo da concordare'
                }
              </span>
            </div>
            
            {trainer?.group_rate_per_hour && (
              <div className="flex items-center gap-2 text-sm">
                <Euro className="w-4 h-4 text-gray-500" />
                <span>€{trainer.group_rate_per_hour}/h gruppo</span>
              </div>
            )}
          </div>
        )}

        {/* Gym specific info */}
        {!isTrainer && gym && (
          <div className="space-y-2">
            {gym.facilities && gym.facilities.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Dumbbell className="w-4 h-4 text-gray-500" />
                <span>{gym.facilities.slice(0, 2).join(', ')}</span>
                {gym.facilities.length > 2 && <span>+{gym.facilities.length - 2}</span>}
              </div>
            )}
            
            {gym.address && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="truncate">{gym.address}</span>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              {gym.monthly_fee && (
                <div className="flex items-center gap-1">
                  <Euro className="w-4 h-4 text-gray-500" />
                  <span>€{gym.monthly_fee}/mese</span>
                </div>
              )}
              {gym.day_pass_fee && (
                <div className="flex items-center gap-1">
                  <Euro className="w-4 h-4 text-gray-500" />
                  <span>€{gym.day_pass_fee}/giorno</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(result.id)}
            className="flex-1"
          >
            Vedi dettagli
          </Button>
          {onBook && (
            <Button 
              size="sm" 
              onClick={() => onBook(result.id)}
              className="flex-1"
            >
              {isTrainer ? 'Prenota' : 'Iscriviti'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
