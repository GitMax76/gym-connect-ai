import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Dumbbell, Activity } from 'lucide-react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegistrationSchema, UserRegistrationData } from "@/schemas/auth";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserRegistrationFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const UserRegistrationForm = ({ onSubmit, onBack }: UserRegistrationFormProps) => {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid }
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
    mode: "onChange",

    defaultValues: {
      location: "",
      password: "",
      referralCode: "",
      healthConditions: ""
    }
  });

  const passwordValue = watch("password");

  const onSubmitForm = (data: UserRegistrationData) => {
    onSubmit(data);
  };

  const fitnessGoals = [
    { value: 'weight-loss', label: '🔥 Perdita di peso e tonificazione' },
    { value: 'muscle-gain', label: '💪 Aumento massa muscolare' },
    { value: 'endurance', label: '🏃‍♂️ Miglioramento resistenza' },
    { value: 'strength', label: '🏋️‍♀️ Aumento forza e potenza' },
    { value: 'flexibility', label: '🧘‍♀️ Flessibilità e mobilità' },
    { value: 'rehabilitation', label: '🩺 Riabilitazione e recupero' },
    { value: 'wellness', label: '✨ Benessere generale' }
  ];

  const fitnessLevels = [
    { value: 'beginner', label: '🌱 Principiante - Nuovo al fitness' },
    { value: 'intermediate', label: '💚 Intermedio - Qualche esperienza' },
    { value: 'advanced', label: '🏆 Avanzato - Esperienza consolidata' },
    { value: 'expert', label: '⭐ Esperto - Atleta/Competitivo' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header motivazionale */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-red-500 mr-2" />
          <h1 className="text-3xl font-bold text-slate-900">Il Tuo Viaggio Fitness Inizia Qui</h1>
          <Dumbbell className="w-8 h-8 text-green-600 ml-2" />
        </div>
        <p className="text-xl text-slate-600">
          Raccontaci di te per creare il match perfetto con il tuo futuro istruttore
        </p>
      </div>

      <Card className="shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-2xl text-center text-slate-900 flex items-center">
              <Activity className="w-6 h-6 text-green-600 mr-2" />
              Crea il Tuo Profilo Fitness
            </CardTitle>
            <div className="w-10"></div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
            {/* Sezione Informazioni Personali */}
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                👤 Informazioni Personali
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">{t('form.firstName')}</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Il tuo nome"
                    className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="la.tua@email.com"
                    className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <PasswordRequirements password={passwordValue} />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <Label htmlFor="age">Età</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register("age")}
                    placeholder="Es. 28"
                    className={`mt-1 ${errors.age ? 'border-red-500' : ''}`}
                  />
                  {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="referralCode" className="text-blue-600 font-bold">Hai un codice amico? (Opzionale)</Label>
                  <Input
                    id="referralCode"
                    {...register("referralCode")}
                    placeholder="Inserisci il codice per 15 FC bonus"
                    className="mt-1 border-blue-200 bg-blue-50"
                  />
                </div>
              </div>
            </div>

            {/* Sezione Dati Fisici */}
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                📊 Dati Fisici & Salute
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    {...register("weight")}
                    placeholder="Es. 70"
                    className={`mt-1 ${errors.weight ? 'border-red-500' : ''}`}
                  />
                  {errors.weight && <p className="text-sm text-red-500 mt-1">{errors.weight.message}</p>}
                </div>
                <div>
                  <Label htmlFor="height">Altezza (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    {...register("height")}
                    placeholder="Es. 175"
                    className={`mt-1 ${errors.height ? 'border-red-500' : ''}`}
                  />
                  {errors.height && <p className="text-sm text-red-500 mt-1">{errors.height.message}</p>}
                </div>
                <div>
                  <Label htmlFor="fitnessLevel">Livello di Fitness</Label>
                  <Controller
                    name="fitnessLevel"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`mt-1 ${errors.fitnessLevel ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Seleziona livello" />
                        </SelectTrigger>
                        <SelectContent>
                          {fitnessLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.fitnessLevel && <p className="text-sm text-red-500 mt-1">{errors.fitnessLevel.message}</p>}
                </div>
              </div>
              <div className="mt-6">
                <Label htmlFor="healthConditions">Condizioni di Salute o Infortuni Passati</Label>
                <Textarea
                  id="healthConditions"
                  {...register("healthConditions")}
                  placeholder="Es. Mal di schiena, problemi al ginocchio, allergie... (opzionale)"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Sezione Obiettivi Fitness */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                🎯 I Tuoi Obiettivi Fitness
              </h3>
              <div>
                <Label htmlFor="goals">Obiettivo Principale</Label>
                <Controller
                  name="goals"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={`mt-1 ${errors.goals ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Cosa vuoi raggiungere?" />
                      </SelectTrigger>
                      <SelectContent>
                        {fitnessGoals.map((goal) => (
                          <SelectItem key={goal.value} value={goal.value}>
                            {goal.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.goals && <p className="text-sm text-red-500 mt-1">{errors.goals.message}</p>}
              </div>
            </div>

            {/* Sezione Preferenze */}
            <div className="bg-orange-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                ⚙️ Preferenze di Allenamento
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="availability">Disponibilità Settimanale</Label>
                  <Controller
                    name="availability"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`mt-1 ${errors.availability ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Quanto tempo puoi dedicare?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2-hours">🕐 1-2 ore/settimana</SelectItem>
                          <SelectItem value="3-4-hours">⏰ 3-4 ore/settimana</SelectItem>
                          <SelectItem value="5-6-hours">⏳ 5-6 ore/settimana</SelectItem>
                          <SelectItem value="7-plus-hours">💪 7+ ore/settimana</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.availability && <p className="text-sm text-red-500 mt-1">{errors.availability.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Mensile (FC)</Label>
                  <Controller
                    name="budget"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`mt-1 ${errors.budget ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Il tuo budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50-100">💰 50-100 FC/mese</SelectItem>
                          <SelectItem value="100-200">💎 100-200 FC/mese</SelectItem>
                          <SelectItem value="200-300">🌟 200-300 FC/mese</SelectItem>
                          <SelectItem value="300-plus">👑 300+ FC/mese</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.budget && <p className="text-sm text-red-500 mt-1">{errors.budget.message}</p>}
                </div>
              </div>
              <div className="mt-6">
                <Label htmlFor="location">Zona Preferita</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Es. Milano Centro, Roma Prati, Napoli Vomero..."
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white text-lg py-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isValid}
            >
              🚀 {t('form.submit.user')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegistrationForm;
