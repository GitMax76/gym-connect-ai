import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile, GymProfile } from '@/hooks/useProfile';
import { useToast } from "@/hooks/use-toast";
import { Pencil, Save, ExternalLink, Plus, Trash2, Calendar, Clock } from 'lucide-react';

interface GymProfileEditDialogProps {
    currentProfile: GymProfile | null;
    defaultTab?: string;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSwitchToTab?: (tab: string) => void; // Callback to switch dashboard tabs
}

const facilityOptions = [
    'Sala Pesi', 'Cardio Area', 'Sala Corsi', 'Piscina', 'Sauna',
    'Bagno Turco', 'Spogliatoi', 'Parcheggio', 'WiFi Gratuito',
    'Personal Training', 'Nutrizione', 'Fisioterapia'
];

const GymProfileEditDialog = ({
    currentProfile: propProfile,
    defaultTab = "details",
    trigger,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    onSwitchToTab
}: GymProfileEditDialogProps) => {
    const { updateGymProfile, updateProfile, profile, gymProfile: hookGymProfile } = useProfile();
    const currentProfile = propProfile || hookGymProfile;
    const { toast } = useToast();

    const [internalOpen, setInternalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(defaultTab);

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen : setInternalOpen;

    // Form State
    const [gymName, setGymName] = useState(currentProfile?.gym_name || '');
    const [city, setCity] = useState(profile?.city || '');
    const [address, setAddress] = useState(currentProfile?.address || '');
    const [description, setDescription] = useState(currentProfile?.description || '');
    const [facilities, setFacilities] = useState<string[]>(currentProfile?.facilities || []);

    // New Fields
    const [openingDays, setOpeningDays] = useState<string[]>(currentProfile?.opening_days || []);
    const [openingHours, setOpeningHours] = useState(currentProfile?.opening_hours || '07:00');
    const [closingHours, setClosingHours] = useState(currentProfile?.closing_hours || '22:00');

    // Subscription Plans
    const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>(currentProfile?.subscription_plans as any[] || []);
    const [newPlan, setNewPlan] = useState({ title: '', price: '', duration: 'Mensile', description: '' });
    const [memberCapacity, setMemberCapacity] = useState(currentProfile?.member_capacity?.toString() || '');

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

    // Reset/Init form when opening
    useEffect(() => {
        if (isOpen) {
            setActiveTab(defaultTab);
            if (currentProfile) {
                setGymName(currentProfile.gym_name || '');
                setAddress(currentProfile.address || '');
                setDescription(currentProfile.description || '');
                setFacilities(currentProfile.facilities || []);
                setMemberCapacity(currentProfile.member_capacity?.toString() || '');

                // New fields init
                setOpeningDays(currentProfile.opening_days || []);
                setOpeningHours(currentProfile.opening_hours || '07:00');
                setClosingHours(currentProfile.closing_hours || '22:00');
                setSubscriptionPlans(currentProfile.subscription_plans as any[] || []);
            }
            if (profile) {
                setCity(profile.city || '');
            }
        }
    }, [isOpen, currentProfile, profile, defaultTab]);

    const handleFacilityToggle = (facility: string) => {
        setFacilities(prev =>
            prev.includes(facility)
                ? prev.filter(f => f !== facility)
                : [...prev, facility]
        );
    };

    const handleDayToggle = (day: string) => {
        setOpeningDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const addSubscriptionPlan = () => {
        if (newPlan.title && newPlan.price) {
            setSubscriptionPlans(prev => [...prev, newPlan]);
            setNewPlan({ title: '', price: '', duration: 'Mensile', description: '' });
        }
    };

    const removePlan = (index: number) => {
        setSubscriptionPlans(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Update Base Profile (City)
        const { error: profileError } = await updateProfile({ city });

        if (profileError) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile aggiornare la città.",
            });
            setLoading(false);
            return;
        }

        const updates = {
            gym_name: gymName,
            address,
            description,
            facilities,
            member_capacity: parseInt(memberCapacity) || 0,
            opening_days: openingDays,
            opening_hours: openingHours,
            closing_hours: closingHours,
            subscription_plans: subscriptionPlans,
            // Fallback for types not yet updated or legacy components
            monthly_fee: subscriptionPlans.length > 0 ? parseFloat(subscriptionPlans[0].price) : 0
        };

        const { error } = await updateGymProfile(updates);

        if (error) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Impossibile aggiornare il profilo palestra.",
            });
        } else {
            toast({
                title: "Successo",
                description: "Profilo aggiornato con successo!",
            });
            if (setOpen) setOpen(false);
        }
        setLoading(false);
    };

    const handleRedirectToPromotions = () => {
        if (onSwitchToTab) {
            onSwitchToTab('promotions');
            if (setOpen) setOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {/* Only render Trigger if trigger prop is present or NOT controlled */}
            {(!isControlled || trigger) && (
                <DialogTrigger asChild>
                    {trigger || (
                        <Button variant="outline" size="sm" className="ml-auto">
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifica Profilo
                        </Button>
                    )}
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifica Profilo Palestra</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="details">Dettagli</TabsTrigger>
                            <TabsTrigger value="facilities">Strutture</TabsTrigger>
                            <TabsTrigger value="pricing">Abbonamenti</TabsTrigger>
                            <TabsTrigger value="promotions">Promozioni</TabsTrigger>
                        </TabsList>

                        {/* TAB: DETTAGLI */}
                        <TabsContent value="details" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="gymName">Nome Palestra</Label>
                                <Input id="gymName" value={gymName} onChange={e => setGymName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Città</Label>
                                    <Input id="city" value={city} onChange={e => setCity(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Indirizzo</Label>
                                    <Input id="address" value={address} onChange={e => setAddress(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Orari di Apertura</Label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {daysOfWeek.map(day => (
                                        <div
                                            key={day}
                                            onClick={() => handleDayToggle(day)}
                                            className={`cursor-pointer px-3 py-1 rounded-md text-xs font-medium border transition-colors ${openingDays.includes(day)
                                                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                                }`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select value={openingHours} onValueChange={setOpeningHours}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Apertura" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map(time => (
                                                <SelectItem key={`open-${time}`} value={time}>{time}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={closingHours} onValueChange={setClosingHours}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chiusura" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map(time => (
                                                <SelectItem key={`close-${time}`} value={time}>{time}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrizione</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </TabsContent>

                        {/* TAB: STRUTTURE */}
                        <TabsContent value="facilities" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="mb-2 block">Servizi e Attrezzature</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {facilityOptions.map((facility) => (
                                        <div key={facility} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`facility-${facility}`}
                                                checked={facilities.includes(facility)}
                                                onChange={() => handleFacilityToggle(facility)}
                                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <label htmlFor={`facility-${facility}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {facility}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: PIANI ABBONAMENTO */}
                        <TabsContent value="pricing" className="space-y-4 pt-4">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm text-slate-700">Gestisci Piani</h4>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div className="md:col-span-2">
                                        <Input
                                            placeholder="Nome Piano (es. Annuale)"
                                            value={newPlan.title}
                                            onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                                            className="h-9"
                                        />
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-500 text-xs">€</span>
                                            <Input
                                                type="number"
                                                placeholder="Prezzo"
                                                value={newPlan.price}
                                                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                                className="pl-7 h-9"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Select
                                            value={newPlan.duration}
                                            onValueChange={(val) => setNewPlan({ ...newPlan, duration: val })}
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Mensile">Mensile</SelectItem>
                                                <SelectItem value="Trimestrale">Trimestrale</SelectItem>
                                                <SelectItem value="Semestrale">Semestrale</SelectItem>
                                                <SelectItem value="Annuale">Annuale</SelectItem>
                                                <SelectItem value="Ingresso">Ingresso Singolo</SelectItem>
                                                <SelectItem value="Pacchetto">Pacchetto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Button
                                            type="button"
                                            onClick={addSubscriptionPlan}
                                            size="sm"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            disabled={!newPlan.title || !newPlan.price}
                                        >
                                            <Plus className="h-3 w-3 mr-2" /> Aggiungi Piano
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Piani Attivi</Label>
                                <div className="space-y-2 max-h-[200px] overflow-yscroll">
                                    {subscriptionPlans.length === 0 ? (
                                        <p className="text-sm text-slate-500 italic text-center py-4 border rounded bg-gray-50">Nessun piano inserito.</p>
                                    ) : (
                                        subscriptionPlans.map((plan, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                                                <div>
                                                    <div className="font-semibold text-sm text-slate-800">{plan.title}</div>
                                                    <div className="text-xs text-slate-500">{plan.duration} • €{plan.price}</div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removePlan(index)}
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacità Membri Totale</Label>
                                    <Input id="capacity" type="number" value={memberCapacity} onChange={e => setMemberCapacity(e.target.value)} />
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: PROMOZIONI (Redirect) */}
                        <TabsContent value="promotions" className="space-y-4 pt-4">
                            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <ExternalLink className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Gestione Promozioni Avanzata</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mt-1">
                                        Le promozioni vengono gestite in una sezione dedicata della tua Dashboard per offrirti più strumenti di controllo.
                                    </p>
                                </div>
                                <Button type="button" onClick={handleRedirectToPromotions} variant="default" className="bg-green-600 hover:bg-green-700">
                                    Vai a Gestione Promozioni
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                        {loading ? (
                            <>Salvataggio...</>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Salva Modifiche
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default GymProfileEditDialog;
