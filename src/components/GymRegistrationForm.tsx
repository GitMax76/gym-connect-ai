import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Clock, Dumbbell, Calendar, Plus, Trash2 } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gymRegistrationSchema, GymRegistrationData } from "@/schemas/auth";
import PasswordRequirements from "@/components/auth/PasswordRequirements";

interface GymRegistrationFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const GymRegistrationForm = ({ onSubmit, onBack }: GymRegistrationFormProps) => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<GymRegistrationData>({
    resolver: zodResolver(gymRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      email: user?.email || '',
      facilities: [],
      openingDays: [],
      specializations: [], // Added initialization
      subscriptionPlans: [],
      openingHours: '07:00',
      closingHours: '22:00'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subscriptionPlans"
  });

  const passwordValue = watch("password");
  const watchedFacilities = watch("facilities");
  const watchedOpeningDays = watch("openingDays");
  const watchedSpecializations = watch("specializations");
  const watchedSubscriptionPlans = watch("subscriptionPlans");

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

  const handleArrayToggle = (field: 'facilities' | 'specializations' | 'openingDays', value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    setValue(field, newValues as any, { shouldValidate: true });
  };

  const addSubscriptionPlan = () => {
    if (newPlan.title && newPlan.price) {
      append(newPlan);
      setNewPlan({ title: '', price: '', duration: 'Mensile', description: '' });
    }
  };

  const onSubmitForm = (data: GymRegistrationData) => {
    onSubmit(data);
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

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
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
                  {...register("gymName")}
                  placeholder="es. FitZone Premium"
                  className={errors.gymName ? "border-red-500" : ""}
                />
                {errors.gymName && <p className="text-sm text-red-500 mt-1">{errors.gymName.message}</p>}
              </div>
              <div>
                <Label htmlFor="ownerName">Nome Proprietario/Manager *</Label>
                <Input
                  id="ownerName"
                  {...register("ownerName")}
                  placeholder="Il tuo nome"
                  className={errors.ownerName ? "border-red-500" : ""}
                />
                {errors.ownerName && <p className="text-sm text-red-500 mt-1">{errors.ownerName.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Aziendale *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="info@tuapalestra.it"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Telefono *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+39 123 456 7890"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {!user && (
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Password sicura"
                  className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                />
                <PasswordRequirements password={passwordValue} />
                <p className="text-xs text-slate-500 mt-1">La password per accedere al tuo account GymConnect.</p>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
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
                {...register("address")}
                placeholder="Via Roma 123"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Città *</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Milano"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">CAP *</Label>
                <Input
                  id="postalCode"
                  {...register("postalCode")}
                  placeholder="20121"
                  className={errors.postalCode ? "border-red-500" : ""}
                />
                {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>}
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
              <Label className={errors.facilities ? "text-red-500" : ""}>Strutture Disponibili *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {facilityOptions.map((facility) => (
                  <label key={facility} className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={watchedFacilities?.includes(facility)}
                      onChange={() => handleArrayToggle('facilities', facility, watchedFacilities)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">{facility}</span>
                  </label>
                ))}
              </div>
              {errors.facilities && <p className="text-sm text-red-500 mt-1">{errors.facilities.message}</p>}
            </div>

            <div>
              <Label>Specializzazioni</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {specializationOptions.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={watchedSpecializations?.includes(spec)}
                      onChange={() => handleArrayToggle('specializations', spec, watchedSpecializations)}
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
              <Label className={`mb-2 block ${errors.openingDays ? "text-red-500" : ""}`}>Giorni di Apertura *</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <div
                    key={day}
                    onClick={() => handleArrayToggle('openingDays', day, watchedOpeningDays)}
                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors ${watchedOpeningDays?.includes(day)
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              {errors.openingDays && <p className="text-sm text-red-500 mt-1">{errors.openingDays.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openingHours">Orario Apertura</Label>
                <Controller
                  name="openingHours"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona orario" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={`open-${time}`} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="closingHours">Orario Chiusura</Label>
                <Controller
                  name="closingHours"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona orario" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={`close-${time}`} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="memberCapacity">Capacità Massima Iscritti (Stimata)</Label>
              <Input
                id="memberCapacity"
                type="number"
                {...register("memberCapacity")}
                placeholder="es. 200"
                className={errors.memberCapacity ? "border-red-500" : ""}
              />
              {errors.memberCapacity && <p className="text-sm text-red-500 mt-1">{errors.memberCapacity.message}</p>}
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
              <Label className={errors.subscriptionPlans ? "text-red-500" : ""}>Piani Inseriti *</Label>
              {fields.length === 0 ? (
                <div className="text-center py-6 text-slate-500 italic bg-gray-50 rounded-md border border-dashed">
                  Nessun piano inserito. Aggiungi almeno un piano base.
                </div>
              ) : (
                <div className="grid gap-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                      <div>
                        <div className="font-semibold text-slate-800">{watchedSubscriptionPlans[index]?.title}</div>
                        <div className="text-sm text-slate-500">{watchedSubscriptionPlans[index]?.duration} • €{watchedSubscriptionPlans[index]?.price}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {errors.subscriptionPlans && <p className="text-sm text-red-500 mt-1">{errors.subscriptionPlans.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Descrizione */}
        <Card>
          <CardContent className="pt-6">
            <div>
              <Label htmlFor="description">Descrizione della Struttura *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Racconta cosa rende speciale la tua palestra, i tuoi punti di forza, l'atmosfera che crei..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
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
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || fields.length === 0}
          >
            🚀 Registra la Palestra
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GymRegistrationForm;

