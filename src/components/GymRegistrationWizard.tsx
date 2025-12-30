import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Building2, MapPin, Clock, Dumbbell, Calendar, Plus, Trash2,
    ArrowRight, ArrowLeft, Check, Mail, Lock, Phone, User, Info
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface GymRegistrationWizardProps {
    onSubmit: (data: any) => void;
    onBack: () => void;
}

// Italian city to postal code mapping (major cities)
const cityPostalCodes: Record<string, string> = {
    'roma': '00100',
    'milano': '20100',
    'napoli': '80100',
    'torino': '10100',
    'palermo': '90100',
    'genova': '16100',
    'bologna': '40100',
    'firenze': '50100',
    'bari': '70100',
    'catania': '95100',
    'venezia': '30100',
    'verona': '37100',
    'messina': '98100',
    'padova': '35100',
    'trieste': '34100',
    'brescia': '25100',
    'parma': '43100',
    'modena': '41100',
    'reggio calabria': '89100',
    'reggio emilia': '42100',
    'perugia': '06100',
    'livorno': '57100',
    'ravenna': '48100',
    'cagliari': '09100',
    'foggia': '71100',
    'rimini': '47900',
    'salerno': '84100',
    'ferrara': '44100',
    'sassari': '07100',
    'latina': '04100',
    'monza': '20900',
    'siracusa': '96100',
    'bergamo': '24100',
    'pescara': '65100',
    'trento': '38100',
    'forlì': '47121',
    'vicenza': '36100',
    'terni': '05100',
    'bolzano': '39100',
    'novara': '28100',
    'piacenza': '29100',
    'ancona': '60100',
    'andria': '76123',
    'arezzo': '52100',
    'udine': '33100',
    'cesena': '47521',
    'lecce': '73100'
};

const STEPS = [
    { id: 1, title: 'Account', icon: Mail, description: 'Email e Password' },
    { id: 2, title: 'Palestra', icon: Building2, description: 'Info di base' },
    { id: 3, title: 'Posizione', icon: MapPin, description: 'Indirizzo' },
    { id: 4, title: 'Servizi', icon: Dumbbell, description: 'Attrezzature' },
    { id: 5, title: 'Orari', icon: Clock, description: 'Operatività' },
];

const GymRegistrationWizard = ({ onSubmit, onBack }: GymRegistrationWizardProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1 - Account
        email: '',
        password: '',
        // Step 2 - Gym Info
        gymName: '',
        ownerName: '',
        phone: '+39 ',
        // Step 3 - Location (city first, then address)
        city: '',
        address: '',
        postalCode: '',
        // Step 4 - Services
        facilities: [] as string[],
        specializations: [] as string[],
        description: '',
        // Step 5 - Operations
        openingDays: [] as string[],
        openingHours: '07:00', // default for days without specific schedule
        closingHours: '22:00', // default for days without specific schedule
        openingHoursMap: {} as Record<string, { open: string; close: string }>,
        memberCapacity: '',
        subscriptionPlans: [] as { title: string; price: string; duration: string }[]
    });

    const [newPlan, setNewPlan] = useState({ title: '', price: '', duration: 'Mensile' });
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    // Auto-fill postal code when city changes
    // Auto-fill postal code when both city and address are set (city first)
    const handleCityChange = useCallback((value: string) => {
        handleInputChange('city', value);
        // Recalculate postal code if possible
        const normalizedCity = value.toLowerCase().trim();
        const postalCode = cityPostalCodes[normalizedCity];
        if (postalCode) {
            handleInputChange('postalCode', postalCode);
        }
    }, [handleInputChange]);

    const handleAddressChange = useCallback((value: string) => {
        handleInputChange('address', value);
        // No extra logic for postal code here; city drives the code
    }, [handleInputChange]);

    const handleArrayToggle = (field: 'facilities' | 'specializations' | 'openingDays', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    // Helper to set opening hours for a specific day
    const setDayHours = (day: string, open: string, close: string) => {
        setFormData(prev => ({
            ...prev,
            openingHoursMap: {
                ...prev.openingHoursMap,
                [day]: { open, close }
            }
        }));
    };

    const addSubscriptionPlan = () => {
        if (newPlan.title && newPlan.price) {
            setFormData(prev => ({
                ...prev,
                subscriptionPlans: [...prev.subscriptionPlans, newPlan]
            }));
            setNewPlan({ title: '', price: '', duration: 'Mensile' });
        }
    };

    const removePlan = (index: number) => {
        setFormData(prev => ({
            ...prev,
            subscriptionPlans: prev.subscriptionPlans.filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.email) newErrors.email = 'Email richiesta';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Email non valida';
                }
                if (!formData.password) newErrors.password = 'Password richiesta';
                else if (formData.password.length < 6) {
                    newErrors.password = 'Minimo 6 caratteri';
                }
                break;
            case 2:
                if (!formData.gymName) newErrors.gymName = 'Nome palestra richiesto';
                if (!formData.ownerName) newErrors.ownerName = 'Nome proprietario richiesto';
                if (!formData.phone || formData.phone === '+39 ') newErrors.phone = 'Telefono richiesto';
                break;
            case 3:
                if (!formData.city) newErrors.city = 'Città richiesta';
                if (!formData.address) newErrors.address = 'Indirizzo richiesto';
                if (!formData.postalCode) newErrors.postalCode = 'CAP richiesto';
                break;
            case 4:
                // Services are optional
                break;
            case 5:
                if (formData.subscriptionPlans.length === 0) {
                    newErrors.subscriptionPlans = 'Aggiungi almeno un piano';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        // Validate all steps before submission
        for (let i = 1; i <= STEPS.length; i++) {
            if (!validateStep(i)) {
                setCurrentStep(i);
                return;
            }
        }

        // Build openingHoursMap from selected days if not manually set
        const finalOpeningHoursMap = { ...formData.openingHoursMap };
        formData.openingDays.forEach(day => {
            if (!finalOpeningHoursMap[day]) {
                finalOpeningHoursMap[day] = { open: formData.openingHours, close: formData.closingHours };
            }
        });

        // Prepare data for submission, include the map
        const submissionData = {
            ...formData,
            openingHoursMap: finalOpeningHoursMap
        };
        onSubmit(submissionData);
    };

    const FieldTooltip = ({ content }: { content: string }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-flex items-center ml-1 cursor-help">
                        <Info className="h-4 w-4 text-slate-400 hover:text-blue-500" />
                    </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Crea il tuo Account</h2>
                            <p className="text-slate-600 mt-2">Iniziamo con le credenziali di accesso</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="flex items-center">
                                    Email Aziendale *
                                    <FieldTooltip content="Usa un'email professionale per ricevere notifiche e comunicazioni dai clienti." />
                                </Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="info@tuapalestra.it"
                                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password" className="flex items-center">
                                    Password *
                                    <FieldTooltip content="Scegli una password sicura: minimo 6 caratteri. Consigliamo di includere numeri e simboli speciali (!@#$%)." />
                                </Label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="••••••••"
                                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-md">
                                    💡 <strong>Suggerimento:</strong> Usa almeno 6 caratteri con numeri e simboli per una password sicura.
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">La Tua Palestra</h2>
                            <p className="text-slate-600 mt-2">Informazioni di base sulla tua struttura</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="gymName" className="flex items-center">
                                    Nome Palestra/Centro *
                                    <FieldTooltip content="Il nome con cui i clienti troveranno la tua palestra." />
                                </Label>
                                <Input
                                    id="gymName"
                                    value={formData.gymName}
                                    onChange={(e) => handleInputChange('gymName', e.target.value)}
                                    placeholder="es. FitZone Premium"
                                    className={`mt-1 ${errors.gymName ? 'border-red-500' : ''}`}
                                />
                                {errors.gymName && <p className="text-red-500 text-sm mt-1">{errors.gymName}</p>}
                            </div>

                            <div>
                                <Label htmlFor="ownerName" className="flex items-center">
                                    Nome Proprietario/Manager *
                                    <FieldTooltip content="Chi gestisce la palestra - sarà visibile nella sezione contatti." />
                                </Label>
                                <div className="relative mt-1">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="ownerName"
                                        value={formData.ownerName}
                                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                                        placeholder="Mario Rossi"
                                        className={`pl-10 ${errors.ownerName ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                            </div>

                            <div>
                                <Label htmlFor="phone" className="flex items-center">
                                    Telefono *
                                    <FieldTooltip content="Numero di telefono per le prenotazioni e le informazioni." />
                                </Label>
                                <div className="relative mt-1">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+39 123 456 7890"
                                        className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Dove Ti Trovi?</h2>
                            <p className="text-slate-600 mt-2">Aiuta i clienti a trovarti facilmente</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city" className="flex items-center">
                                        Città *
                                        <FieldTooltip content="Inserisci la città e il CAP verrà compilato automaticamente." />
                                    </Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleCityChange(e.target.value)}
                                        placeholder="Milano"
                                        className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="postalCode" className="flex items-center">
                                        CAP *
                                        <FieldTooltip content="Compilato automaticamente in base alla città. Puoi modificarlo se necessario." />
                                    </Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                        placeholder="20121"
                                        className={`mt-1 ${errors.postalCode ? 'border-red-500' : ''}`}
                                    />
                                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="address">Indirizzo Completo *</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleAddressChange(e.target.value)}
                                    placeholder="Via Roma 123"
                                    className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Dumbbell className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Cosa Offri?</h2>
                            <p className="text-slate-600 mt-2">Seleziona servizi e specializzazioni (opzionale)</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <Label className="text-base font-semibold">Strutture Disponibili</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                                    {facilityOptions.map((facility) => (
                                        <label
                                            key={facility}
                                            className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg transition-all ${formData.facilities.includes(facility)
                                                ? 'bg-green-50 border-green-500 text-green-700'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
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
                                <Label className="text-base font-semibold">Specializzazioni</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                                    {specializationOptions.map((spec) => (
                                        <label
                                            key={spec}
                                            className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg transition-all ${formData.specializations.includes(spec)
                                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.specializations.includes(spec)}
                                                onChange={() => handleArrayToggle('specializations', spec)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm">{spec}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Descrizione (opzionale)</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Racconta cosa rende speciale la tua palestra..."
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Orari e Abbonamenti</h2>
                            <p className="text-slate-600 mt-2">Definisci quando sei aperto e i tuoi piani</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <Label className="text-base font-semibold mb-3 block">Giorni di Apertura</Label>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map(day => (
                                        <div
                                            key={day}
                                            onClick={() => handleArrayToggle('openingDays', day)}
                                            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.openingDays.includes(day)
                                                ? 'bg-purple-600 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {formData.openingDays.length > 0 ? (
                                <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
                                    <Label className="font-semibold text-slate-700">Orari per giorno</Label>
                                    {formData.openingDays.map(day => (
                                        <div key={day} className="flex items-center justify-between gap-4">
                                            <span className="w-12 font-medium">{day}</span>
                                            <div className="flex items-center gap-2 flex-1">
                                                <div className="flex-1">
                                                    <Select
                                                        value={formData.openingHoursMap?.[day]?.open || formData.openingHours}
                                                        onValueChange={(val) => setDayHours(day, val, formData.openingHoursMap?.[day]?.close || formData.closingHours)}
                                                    >
                                                        <SelectTrigger className="h-8">
                                                            <SelectValue placeholder="Apertura" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeSlots.map(time => (
                                                                <SelectItem key={`open-${day}-${time}`} value={time}>{time}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <span>-</span>
                                                <div className="flex-1">
                                                    <Select
                                                        value={formData.openingHoursMap?.[day]?.close || formData.closingHours}
                                                        onValueChange={(val) => setDayHours(day, formData.openingHoursMap?.[day]?.open || formData.openingHours, val)}
                                                    >
                                                        <SelectTrigger className="h-8">
                                                            <SelectValue placeholder="Chiusura" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeSlots.map(time => (
                                                                <SelectItem key={`close-${day}-${time}`} value={time}>{time}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">Seleziona i giorni di apertura per configurare gli orari.</p>
                            )}
                        </div>

                        <div>
                            <Label className="text-base font-semibold flex items-center">
                                Piani di Abbonamento *
                                <FieldTooltip content="Aggiungi almeno un piano. Potrai modificarli in seguito dalla dashboard." />
                            </Label>

                            <div className="bg-slate-50 p-4 rounded-lg border mt-3">
                                <div className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-5">
                                        <Label className="text-xs">Nome Piano</Label>
                                        <Input
                                            placeholder="es. Mensile Base"
                                            value={newPlan.title}
                                            onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-xs">Prezzo (€)</Label>
                                        <Input
                                            type="number"
                                            placeholder="50"
                                            value={newPlan.price}
                                            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
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
                                                <SelectItem value="Trimestrale">3 Mesi</SelectItem>
                                                <SelectItem value="Semestrale">6 Mesi</SelectItem>
                                                <SelectItem value="Annuale">Annuale</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Button
                                            type="button"
                                            onClick={addSubscriptionPlan}
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            disabled={!newPlan.title || !newPlan.price}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {errors.subscriptionPlans && (
                                <p className="text-red-500 text-sm mt-2">{errors.subscriptionPlans}</p>
                            )}

                            {formData.subscriptionPlans.length > 0 && (
                                <div className="space-y-2 mt-3">
                                    {formData.subscriptionPlans.map((plan, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                            <div>
                                                <span className="font-medium">{plan.title}</span>
                                                <span className="text-slate-500 ml-2">€{plan.price}/{plan.duration}</span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removePlan(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {STEPS.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentStep > step.id
                                    ? 'bg-green-500 text-white'
                                    : currentStep === step.id
                                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                                        : 'bg-slate-200 text-slate-500'
                                    }`}>
                                    {currentStep > step.id ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <step.icon className="h-5 w-5" />
                                    )}
                                </div>
                                <span className={`text-xs mt-1 hidden sm:block ${currentStep === step.id ? 'text-blue-600 font-medium' : 'text-slate-500'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 rounded ${currentStep > step.id ? 'bg-green-500' : 'bg-slate-200'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <Card className="shadow-lg border-0">
                <CardContent className="pt-6">
                    {renderStep()}
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={currentStep === 1 ? onBack : prevStep}
                    className="px-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {currentStep === 1 ? 'Cambia Profilo' : 'Indietro'}
                </Button>

                {currentStep < STEPS.length ? (
                    <Button
                        type="button"
                        onClick={nextStep}
                        className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                        Avanti
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                        🚀 Registra Palestra
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GymRegistrationWizard;
