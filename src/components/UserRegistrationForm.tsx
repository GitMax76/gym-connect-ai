
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface UserRegistrationFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const UserRegistrationForm = ({ onSubmit, onBack }: UserRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    // Dati personali
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    
    // Dati fisici
    height: '',
    weight: '',
    
    // Esperienza e obiettivi
    fitnessLevel: '',
    goals: [] as string[],
    medicalConditions: '',
    
    // Disponibilità
    preferredDays: [] as string[],
    preferredTimes: '',
    location: '',
    budget: '',
    
    // Preferenze
    groupClassesInterest: false,
    personalTrainingInterest: false,
    gymOnly: false
  });

  const handleGoalChange = (goal: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      goals: checked 
        ? [...prev.goals, goal]
        : prev.goals.filter(g => g !== goal)
    }));
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferredDays: checked 
        ? [...prev.preferredDays, day]
        : prev.preferredDays.filter(d => d !== day)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Registrazione Utente</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dati Personali */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Dati Personali</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Cognome *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Data di Nascita</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Dati Fisici */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Dati Fisici</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Altezza (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="es. 175"
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="es. 70"
                />
              </div>
            </div>
          </div>

          {/* Esperienza e Obiettivi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Esperienza e Obiettivi</h3>
            
            <div>
              <Label htmlFor="fitnessLevel">Livello di Fitness</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona il tuo livello" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Principiante</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Obiettivi Principali</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {[
                  'Dimagrimento',
                  'Aumento massa muscolare',
                  'Miglioramento resistenza',
                  'Riabilitazione',
                  'Tonificazione',
                  'Preparazione atletica',
                  'Benessere generale',
                  'Riduzione stress'
                ].map(goal => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={formData.goals.includes(goal)}
                      onCheckedChange={(checked) => handleGoalChange(goal, !!checked)}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="medicalConditions">Condizioni Mediche / Infortuni Precedenti</Label>
              <Textarea
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                placeholder="Descrivi eventuali problemi di salute, infortuni o limitazioni fisiche..."
                className="min-h-20"
              />
            </div>
          </div>

          {/* Disponibilità */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Disponibilità e Preferenze</h3>
            
            <div>
              <Label>Giorni Preferiti</Label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
                {['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'].map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.preferredDays.includes(day)}
                      onCheckedChange={(checked) => handleDayChange(day, !!checked)}
                    />
                    <Label htmlFor={day} className="text-xs">{day.slice(0, 3)}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredTimes">Orari Preferiti</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTimes: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona orario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Mattina (6:00-12:00)</SelectItem>
                    <SelectItem value="afternoon">Pomeriggio (12:00-18:00)</SelectItem>
                    <SelectItem value="evening">Sera (18:00-22:00)</SelectItem>
                    <SelectItem value="flexible">Flessibile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="budget">Budget Mensile (€)</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50">0 - 50€</SelectItem>
                    <SelectItem value="50-100">50 - 100€</SelectItem>
                    <SelectItem value="100-200">100 - 200€</SelectItem>
                    <SelectItem value="200+">200€+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Zona di Interesse</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="es. Milano centro, Roma nord..."
              />
            </div>
          </div>

          {/* Preferenze Servizi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Preferenze Servizi</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="groupClasses"
                  checked={formData.groupClassesInterest}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, groupClassesInterest: !!checked }))}
                />
                <Label htmlFor="groupClasses">Interesse per corsi di gruppo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personalTraining"
                  checked={formData.personalTrainingInterest}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, personalTrainingInterest: !!checked }))}
                />
                <Label htmlFor="personalTraining">Interesse per personal training</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gymOnly"
                  checked={formData.gymOnly}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, gymOnly: !!checked }))}
                />
                <Label htmlFor="gymOnly">Solo accesso palestra (senza istruttore)</Label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Indietro
            </Button>
            <Button type="submit" className="flex-1 gradient-primary text-white">
              Completa Registrazione
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserRegistrationForm;
