
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Clock, Users, Wifi, Car, Dumbbell } from 'lucide-react';

interface GymRegistrationFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const GymRegistrationForm = ({ onSubmit, onBack }: GymRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    gymName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    description: '',
    facilities: [] as string[],
    openingHours: '',
    closingHours: '',
    memberCapacity: '',
    monthlyFee: '',
    dayPassFee: '',
    specializations: [] as string[]
  });

  const facilityOptions = [
    'Sala Pesi', 'Cardio Area', 'Sala Corsi', 'Piscina', 'Sauna', 
    'Bagno Turco', 'Spogliatoi', 'Parcheggio', 'WiFi Gratuito', 
    'Personal Training', 'Nutrizione', 'Fisioterapia'
  ];

  const specializationOptions = [
    'Bodybuilding', 'Fitness Funzionale', 'Yoga', 'Pilates', 'CrossFit',
    'Arti Marziali', 'Danza', 'Riabilitazione', 'Sport Acquatici', 'Calisthenics'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'facilities' | 'specializations', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-400 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Building2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Registra la Tua <span className="text-orange-600">Palestra</span>
        </h1>
        <p className="text-xl text-slate-600">
          🏢 Trasforma la tua struttura nel punto di riferimento del fitness locale
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informazioni Base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              Informazioni della Struttura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gymName">Nome Palestra/Centro *</Label>
                <Input
                  id="gymName"
                  value={formData.gymName}
                  onChange={(e) => handleInputChange('gymName', e.target.value)}
                  placeholder="es. FitZone Premium"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ownerName">Nome Proprietario/Manager *</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  placeholder="Il tuo nome"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Aziendale *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@tuapalestra.it"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+39 123 456 7890"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localizzazione */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Posizione e Contatti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Indirizzo Completo *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Via Roma 123"
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Città *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Milano"
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">CAP *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="20121"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Servizi e Strutture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-green-600" />
              Servizi e Attrezzature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Strutture Disponibili</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {facilityOptions.map((facility) => (
                  <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() => handleArrayToggle('facilities', facility)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Specializzazioni</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {specializationOptions.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec)}
                      onChange={() => handleArrayToggle('specializations', spec)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operatività e Prezzi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Operatività e Tariffe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openingHours">Orario Apertura</Label>
                <Input
                  id="openingHours"
                  type="time"
                  value={formData.openingHours}
                  onChange={(e) => handleInputChange('openingHours', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="closingHours">Orario Chiusura</Label>
                <Input
                  id="closingHours"
                  type="time"
                  value={formData.closingHours}
                  onChange={(e) => handleInputChange('closingHours', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="memberCapacity">Capacità Massima</Label>
                <Input
                  id="memberCapacity"
                  type="number"
                  value={formData.memberCapacity}
                  onChange={(e) => handleInputChange('memberCapacity', e.target.value)}
                  placeholder="es. 200"
                />
              </div>
              <div>
                <Label htmlFor="monthlyFee">Abbonamento Mensile (€)</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                  placeholder="es. 49"
                />
              </div>
              <div>
                <Label htmlFor="dayPassFee">Ingresso Giornaliero (€)</Label>
                <Input
                  id="dayPassFee"
                  type="number"
                  value={formData.dayPassFee}
                  onChange={(e) => handleInputChange('dayPassFee', e.target.value)}
                  placeholder="es. 15"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Descrizione */}
        <Card>
          <CardContent className="pt-6">
            <div>
              <Label htmlFor="description">Descrizione della Struttura</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Racconta cosa rende speciale la tua palestra, i tuoi punti di forza, l'atmosfera che crei..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="px-8 py-3"
          >
            ← Indietro
          </Button>
          <Button 
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white hover:shadow-lg transition-all"
          >
            🚀 Registra la Palestra
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GymRegistrationForm;
