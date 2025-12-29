import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Clock, Users, Dumbbell, Calendar, Plus, Trash2 } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

interface GymRegistrationFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const GymRegistrationForm = ({ onSubmit, onBack }: GymRegistrationFormProps) => {
  const { user } = useAuth();

  // Initialize with empty defaults, will populate email from auth
  const [formData, setFormData] = useState({
    gymName: '',
    ownerName: '',
    email: user?.email || '',
    password: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    description: '',
    facilities: [] as string[],
    openingDays: [] as string[],
    openingHours: '07:00',
    closingHours: '22:00',
    memberCapacity: '',
    specializations: [] as string[],
    subscriptionPlans: [] as { title: string; price: string; duration: string; description: string }[]
  });

  const [newPlan, setNewPlan] = useState({ title: '', price: '', duration: 'Mensile', description: '' });

  const facilityOptions = [
    'Sala Pesi', 'Cardio Area', 'Sala Corsi', 'Piscina', 'Sauna',
    'Bagno Turco', 'Spogliatoi', 'Parcheggio', 'WiFi Gratuito',
    'Personal Training', 'Nutrizione', 'Fisioterapia'
  ];

  const specializationOptions = [
    'Bodybuilding', 'Fitness Funzionale', 'Yoga', 'Pilates', 'CrossFit',
    'Arti Marziali', 'Danza', 'Riabilitazione', 'Sport Acquatici', 'Calisthenics'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  // Generator for time slots (every 30 mins)
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 5; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'facilities' | 'specializations' | 'openingDays', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const addSubscriptionPlan = () => {
    if (newPlan.title && newPlan.price) {
      setFormData(prev => ({
        ...prev,
        subscriptionPlans: [...prev.subscriptionPlans, newPlan]
      }));
      setNewPlan({ title: '', price: '', duration: 'Mensile', description: '' });
    }
  };

  const removePlan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subscriptionPlans: prev.subscriptionPlans.filter((_, i) => i !== index)
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

            {!user && (
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Password sicura"
                  required
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">La password per accedere al tuo account GymConnect.</p>
              </div>
            )}
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
                  <label key={facility} className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() => handleArrayToggle('facilities', facility)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                  <label key={spec} className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec)}
                      onChange={() => handleArrayToggle('specializations', spec)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
              Operatività
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-2 block">Giorni di Apertura</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <div
                    key={day}
                    onClick={() => handleArrayToggle('openingDays', day)}
                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.openingDays.includes(day)
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openingHours">Orario Apertura</Label>
                <Select
                  value={formData.openingHours}
                  onValueChange={(val) => handleInputChange('openingHours', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona orario" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={`open-${time}`} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="closingHours">Orario Chiusura</Label>
                <Select
                  value={formData.closingHours}
                  onValueChange={(val) => handleInputChange('closingHours', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona orario" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={`close-${time}`} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="memberCapacity">Capacità Massima Iscritti (Stimata)</Label>
              <Input
                id="memberCapacity"
                type="number"
                value={formData.memberCapacity}
                onChange={(e) => handleInputChange('memberCapacity', e.target.value)}
                placeholder="es. 200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Piani Abbonamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Piani di Abbonamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-medium mb-3 text-sm text-slate-700">Aggiungi un nuovo piano</h4>
              <div className="grid md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-4">
                  <Label className="text-xs">Nome Piano</Label>
                  <Input
                    placeholder="es. Annuale Full"
                    value={newPlan.title}
                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  />
                </div>
                <div className="md:col-span-3">
                  <Label className="text-xs">Prezzo (€)</Label>
                  <Input
                    type="number"
                    placeholder="es. 450"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                  />
                </div>
                <div className="md:col-span-3">
                  <Label className="text-xs">Durata</Label>
                  <Select
                    value={newPlan.duration}
                    onValueChange={(val) => setNewPlan({ ...newPlan, duration: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mensile">Mensile</SelectItem>
                      <SelectItem value="Trimestrale">Trimestrale</SelectItem>
                      <SelectItem value="Semestrale">Semestrale</SelectItem>
                      <SelectItem value="Annuale">Annuale</SelectItem>
                      <SelectItem value="Ingresso">Ingresso Singolo</SelectItem>
                      <SelectItem value="Pacchetto">Pacchetto Ingressi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="button"
                    onClick={addSubscriptionPlan}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!newPlan.title || !newPlan.price}
                  >
                    <Plus className="h-4 w-4" /> Aggiungi
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Piani Inseriti</Label>
              {formData.subscriptionPlans.length === 0 ? (
                <div className="text-center py-6 text-slate-500 italic bg-gray-50 rounded-md border border-dashed">
                  Nessun piano inserito. Aggiungi almeno un piano base.
                </div>
              ) : (
                <div className="grid gap-3">
                  {formData.subscriptionPlans.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                      <div>
                        <div className="font-semibold text-slate-800">{plan.title}</div>
                        <div className="text-sm text-slate-500">{plan.duration} • €{plan.price}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePlan(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
            disabled={formData.subscriptionPlans.length === 0}
          >
            🚀 Registra la Palestra
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GymRegistrationForm;
