
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MatchingPreferences } from '@/hooks/useMatching';

interface SearchFiltersProps {
  searchType: 'trainer' | 'gym' | 'user';
  onFiltersChange: (filters: any) => void;
  preferences: MatchingPreferences | null;
}

const SearchFilters = ({ searchType, onFiltersChange, preferences }: SearchFiltersProps) => {
  const [budget, setBudget] = useState<number[]>([
    preferences?.budget_min || 20,
    preferences?.budget_max || 100
  ]);
  const [distance, setDistance] = useState<number[]>([preferences?.max_distance_km || 10]);
  const [specializations, setSpecializations] = useState<string[]>(
    preferences?.preferred_trainer_specializations || []
  );
  const [facilities, setFacilities] = useState<string[]>(
    preferences?.preferred_gym_facilities || []
  );

  const trainerSpecializations = [
    'Personal Training',
    'Yoga',
    'Pilates',
    'CrossFit',
    'Bodybuilding',
    'Cardio',
    'Functional Training',
    'Riabilitazione',
    'Nutrizione',
    'Preparazione Atletica'
  ];

  const gymFacilities = [
    'Sala Pesi',
    'Cardio Area',
    'Piscina',
    'Sauna',
    'Spogliatoi',
    'Parcheggio',
    'Sala Corsi',
    'Personal Training',
    'Area Funzionale',
    'Stretching Area'
  ];

  const handleSpecializationChange = (spec: string, checked: boolean) => {
    const newSpecs = checked
      ? [...specializations, spec]
      : specializations.filter(s => s !== spec);
    setSpecializations(newSpecs);
  };

  const handleFacilityChange = (facility: string, checked: boolean) => {
    const newFacilities = checked
      ? [...facilities, facility]
      : facilities.filter(f => f !== facility);
    setFacilities(newFacilities);
  };

  const applyFilters = () => {
    const filters = {
      budget_min: budget[0],
      budget_max: budget[1],
      max_distance: distance[0],
      ...(searchType === 'trainer' ? { specializations } : { facilities })
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setBudget([20, 100]);
    setDistance([10]);
    setSpecializations([]);
    setFacilities([]);
    onFiltersChange({});
  };

  return (
    <div className="space-y-6">
      {/* Budget Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Budget (€{budget[0]} - €{budget[1]}/ora)
        </Label>
        <Slider
          value={budget}
          onValueChange={setBudget}
          max={200}
          min={10}
          step={5}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Distance */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Distanza Massima ({distance[0]} km)
        </Label>
        <Slider
          value={distance}
          onValueChange={setDistance}
          max={50}
          min={1}
          step={1}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Specializations for trainers */}
      {searchType === 'trainer' && (
        <div>
          <Label className="text-sm font-medium mb-3 block">Specializzazioni</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {trainerSpecializations.map((spec) => (
              <div key={spec} className="flex items-center space-x-2">
                <Checkbox
                  id={spec}
                  checked={specializations.includes(spec)}
                  onCheckedChange={(checked) =>
                    handleSpecializationChange(spec, checked as boolean)
                  }
                />
                <Label htmlFor={spec} className="text-sm">{spec}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facilities for gyms */}
      {searchType === 'gym' && (
        <div>
          <Label className="text-sm font-medium mb-3 block">Servizi</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {gymFacilities.map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={facility}
                  checked={facilities.includes(facility)}
                  onCheckedChange={(checked) =>
                    handleFacilityChange(facility, checked as boolean)
                  }
                />
                <Label htmlFor={facility} className="text-sm">{facility}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters} className="w-full">
          Applica Filtri
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Cancella Filtri
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
