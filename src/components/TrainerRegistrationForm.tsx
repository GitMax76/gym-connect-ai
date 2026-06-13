import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Award, Clock, Users } from 'lucide-react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainerRegistrationSchema, TrainerRegistrationData } from "@/schemas/auth";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrainerRegistrationFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const TrainerRegistrationForm = ({ onSubmit, onBack, isSubmitting = false }: TrainerRegistrationFormProps) => {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isValid }
  } = useForm<TrainerRegistrationData>({
    resolver: zodResolver(trainerRegistrationSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+39 ",
      password: "",
      city: "",
      bio: "",
      experience: undefined, // Number inputs prefer undefined or empty string, handled by coercion
      personalRate: undefined,
      groupRate: undefined,
      certifications: [],
      specializations: [],
      languages: [],
      availability: [],
      preferredAreas: "Nord"
    }
  });

  const passwordValue = watch("password") || "";
  const watchedCertifications = watch("certifications") || [];
  const watchedSpecializations = watch("specializations") || [];
  const watchedLanguages = watch("languages") || [];
  const watchedAvailability = watch("availability") || [];

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

  const handleArrayToggle = (field: keyof TrainerRegistrationData, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    setValue(field, newValues as any, { shouldValidate: true });
  };

  const onSubmitForm = (data: TrainerRegistrationData) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Dumbbell className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          <span className="text-blue-600">{t('form.submit.trainer')}</span>
        </h1>
        <p className="text-xl text-slate-600">
          💪 Trasforma la tua passione in una carriera di successo
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
        {/* Informazioni Personali */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Informazioni Personali
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t('form.firstName')} *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Il tuo nome"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">{t('form.lastName')} *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Il tuo cognome"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">{t('form.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="tua@email.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">{t('form.password')} *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Password sicura"
                  className={errors.password ? "border-red-500" : ""}
                />
                <PasswordRequirements password={passwordValue} />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">{t('form.phone')} *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+39 123 456 7890"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Data di Nascita</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Città di Operatività *</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Milano"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="preferredAreas">Zona Preferita *</Label>
                <Controller
                  name="preferredAreas"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={errors.preferredAreas ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleziona zona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nord">Nord</SelectItem>
                        <SelectItem value="Sud">Sud</SelectItem>
                        <SelectItem value="Centro">Centro</SelectItem>
                        <SelectItem value="Est">Est</SelectItem>
                        <SelectItem value="Ovest">Ovest</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.preferredAreas && <p className="text-sm text-red-500 mt-1">{errors.preferredAreas.message}</p>}
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
              <Label className={errors.certifications ? "text-red-500" : ""}>Certificazioni e Titoli *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {certificationOptions.map((cert) => (
                  <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedCertifications?.includes(cert)}
                      onChange={() => handleArrayToggle('certifications', cert, watchedCertifications)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{cert}</span>
                  </label>
                ))}
              </div>
              {errors.certifications && <p className="text-sm text-red-500 mt-1">{errors.certifications.message}</p>}
            </div>

            <div>
              <Label className={errors.specializations ? "text-red-500" : ""}>Specializzazioni *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {specializationOptions.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedSpecializations?.includes(spec)}
                      onChange={() => handleArrayToggle('specializations', spec, watchedSpecializations)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
              {errors.specializations && <p className="text-sm text-red-500 mt-1">{errors.specializations.message}</p>}
            </div>

            <div>
              <Label htmlFor="experience">Anni di Esperienza</Label>
              <Input
                id="experience"
                type="number"
                {...register("experience")}
                placeholder="es. 5"
                min="0"
                className={errors.experience ? "border-red-500" : ""}
              />
              {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>}
            </div>

            <div>
              <Label className={errors.languages ? "text-red-500" : ""}>Lingue Parlate *</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {languageOptions.map((lang) => (
                  <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedLanguages?.includes(lang)}
                      onChange={() => handleArrayToggle('languages', lang, watchedLanguages)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{lang}</span>
                  </label>
                ))}
              </div>
              {errors.languages && <p className="text-sm text-red-500 mt-1">{errors.languages.message}</p>}
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
              <Label className={errors.availability ? "text-red-500" : ""}>Disponibilità Settimanale *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-48 overflow-y-auto">
                {availabilityOptions.map((slot) => (
                  <label key={slot} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedAvailability?.includes(slot)}
                      onChange={() => handleArrayToggle('availability', slot, watchedAvailability)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{slot}</span>
                  </label>
                ))}
              </div>
              {errors.availability && <p className="text-sm text-red-500 mt-1">{errors.availability.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="personalRate">Tariffa Personal Training (€/ora)</Label>
                <Input
                  id="personalRate"
                  type="number"
                  {...register("personalRate")}
                  placeholder="es. 50"
                  min="0"
                  className={errors.personalRate ? "border-red-500" : ""}
                />
                {errors.personalRate && <p className="text-sm text-red-500 mt-1">{errors.personalRate.message}</p>}
              </div>
              <div>
                <Label htmlFor="groupRate">Tariffa Lezioni di Gruppo (€/ora)</Label>
                <Input
                  id="groupRate"
                  type="number"
                  {...register("groupRate")}
                  placeholder="es. 30"
                  min="0"
                  className={errors.groupRate ? "border-red-500" : ""}
                />
                {errors.groupRate && <p className="text-sm text-red-500 mt-1">{errors.groupRate.message}</p>}
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
                {...register("bio")}
                placeholder="Racconta la tua storia, la tua filosofia di allenamento, i risultati che aiuti a raggiungere..."
                rows={4}
                className={errors.bio ? "border-red-500" : ""}
              />
              {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
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
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Wait...
              </>
            ) : (
              <>🚀 {t('form.submit.trainer')}</>
            )}
          </Button>
        </div>
        {!isValid && (
          <p className="text-center text-red-500 text-sm mt-2">
            {t('form.error.required')}
          </p>
        )}
      </form>
    </div>
  );
};

export default TrainerRegistrationForm;
