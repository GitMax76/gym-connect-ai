
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Dumbbell, Activity } from 'lucide-react';

interface UserRegistrationFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const UserRegistrationForm = ({ onSubmit, onBack }: UserRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    fitnessLevel: '',
    goals: '',
    availability: '',
    budget: '',
    location: '',
    healthConditions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sezione Informazioni Personali */}
            <div className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                👤 Informazioni Personali
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Il tuo nome"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="la.tua@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Età</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Es. 28"
                    className="mt-1"
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
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="Es. 70"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Altezza (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    placeholder="Es. 175"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fitnessLevel">Livello di Fitness</Label>
                  <Select value={formData.fitnessLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleziona il tuo livello" />
                    </SelectTrigger>
                    <SelectContent>
                      {fitnessLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <Label htmlFor="healthConditions">Condizioni di Salute o Infortuni Passati</Label>
                <Textarea
                  id="healthConditions"
                  value={formData.healthConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthConditions: e.target.value }))}
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
                <Select value={formData.goals} onValueChange={(value) => setFormData(prev => ({ ...prev, goals: value }))}>
                  <SelectTrigger className="mt-1">
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
                  <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Quanto tempo puoi dedicare?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2-hours">🕐 1-2 ore/settimana</SelectItem>
                      <SelectItem value="3-4-hours">⏰ 3-4 ore/settimana</SelectItem>
                      <SelectItem value="5-6-hours">⏳ 5-6 ore/settimana</SelectItem>
                      <SelectItem value="7-plus-hours">💪 7+ ore/settimana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget Mensile (€)</Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Il tuo budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50-100">💰 €50-100/mese</SelectItem>
                      <SelectItem value="100-200">💎 €100-200/mese</SelectItem>
                      <SelectItem value="200-300">🌟 €200-300/mese</SelectItem>
                      <SelectItem value="300-plus">👑 €300+/mese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <Label htmlFor="location">Zona Preferita</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Es. Milano Centro, Roma Prati, Napoli Vomero..."
                  className="mt-1"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary text-white text-lg py-4 rounded-xl hover:scale-105 transition-transform"
            >
              🚀 Inizia il Tuo Percorso Fitness
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegistrationForm;
