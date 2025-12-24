
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Award, MapPin, Clock, DollarSign, Users } from 'lucide-react';

interface TrainerRegistrationFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const TrainerRegistrationForm = ({ onSubmit, onBack }: TrainerRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    bio: '',
    certifications: [] as string[],
    specializations: [] as string[],
    experience: '',
    personalRate: '',
    groupRate: '',
    availability: [] as string[],
    preferredAreas: '',
    languages: [] as string[]
  });

  const certificationOptions = [
    'CONI', 'NASM', 'ACSM', 'ISSA', 'ACE', 'NSCA',
    'Laurea Scienze Motorie', 'Fisioterapista', 'Nutrizionista'
  ];

  const specializationOptions = [
    'Personal Training', 'Bodybuilding', 'Powerlifting', 'CrossFit',
    'Yoga', 'Pilates', 'Functional Training', 'Calisthenics',
    'Riabilitazione', 'Preparazione Atletica', 'Difesa Personale',
    'Danza Fitness', 'Aerobica', 'Spinning'
  ];

  const availabilityOptions = [
    'Lunedì Mattina', 'Lunedì Pomeriggio', 'Lunedì Sera',
    'Martedì Mattina', 'Martedì Pomeriggio', 'Martedì Sera',
    'Mercoledì Mattina', 'Mercoledì Pomeriggio', 'Mercoledì Sera',
    'Giovedì Mattina', 'Giovedì Pomeriggio', 'Giovedì Sera',
    'Venerdì Mattina', 'Venerdì Pomeriggio', 'Venerdì Sera',
    'Sabato Mattina', 'Sabato Pomeriggio', 'Domenica Mattina'
  ];

  const languageOptions = ['Italiano', 'Inglese', 'Francese', 'Spagnolo', 'Tedesco'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof typeof formData, value: string) => {
    const arrayField = formData[field] as string[];
    setFormData(prev => ({
      ...prev,
      [field]: arrayField.includes(value)
        ? arrayField.filter(item => item !== value)
        : [...arrayField, value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Dumbbell className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Diventa un <span className="text-green-600">Coach di Eccellenza</span>
        </h1>
        <p className="text-xl text-slate-600">
          💪 Trasforma la tua passione in una carriera di successo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informazioni Personali */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Informazioni Personali
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Il tuo nome"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Cognome *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Il tuo cognome"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="tua@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Password sicura"
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
              <div>
                <Label htmlFor="dateOfBirth">Data di Nascita</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Città di Operatività *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Milano"
                  required
                />
              </div>
              <div>
                <Label htmlFor="preferredAreas">Zone Preferite</Label>
                <Input
                  id="preferredAreas"
                  value={formData.preferredAreas}
                  onChange={(e) => handleInputChange('preferredAreas', e.target.value)}
                  placeholder="es. Centro, Porta Nuova, Navigli"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Qualifiche e Esperienza */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Qualifiche e Certificazioni
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Certificazioni e Titoli</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {certificationOptions.map((cert) => (
                  <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={() => handleArrayToggle('certifications', cert)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{cert}</span>
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

            <div>
              <Label htmlFor="experience">Anni di Esperienza</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="es. 5"
                min="0"
              />
            </div>

            <div>
              <Label>Lingue Parlate</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {languageOptions.map((lang) => (
                  <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={() => handleArrayToggle('languages', lang)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{lang}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disponibilità e Tariffe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Disponibilità e Tariffe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Disponibilità Settimanale</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-48 overflow-y-auto">
                {availabilityOptions.map((slot) => (
                  <label key={slot} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(slot)}
                      onChange={() => handleArrayToggle('availability', slot)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{slot}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="personalRate">Tariffa Personal Training (€/ora)</Label>
                <Input
                  id="personalRate"
                  type="number"
                  value={formData.personalRate}
                  onChange={(e) => handleInputChange('personalRate', e.target.value)}
                  placeholder="es. 50"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="groupRate">Tariffa Lezioni di Gruppo (€/ora)</Label>
                <Input
                  id="groupRate"
                  type="number"
                  value={formData.groupRate}
                  onChange={(e) => handleInputChange('groupRate', e.target.value)}
                  placeholder="es. 30"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biografia */}
        <Card>
          <CardContent className="pt-6">
            <div>
              <Label htmlFor="bio">Presentati ai Tuoi Futuri Clienti</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Racconta la tua storia, la tua filosofia di allenamento, i risultati che aiuti a raggiungere..."
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
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-lg transition-all"
          >
            🚀 Diventa Coach
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TrainerRegistrationForm;
