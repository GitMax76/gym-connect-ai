import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ContactPage = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, type: 'athlete' | 'trainer' | 'gym') => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
            type: type,
        };

        try {
            // @ts-ignore - leads table added via migration, types not yet updated
            const { error } = await supabase
                .from('leads')
                .insert([data]);

            if (error) throw error;

            toast.success("Messaggio inviato con successo! Ti contatteremo presto.");
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error("Errore nell'invio del messaggio. Riprova più tardi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header content */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
                        Contattaci & Risorse
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Scegli il tuo profilo per scaricare la brochure dedicata e metterti in contatto con il nostro team.
                    </p>
                </div>

                <Tabs defaultValue="athlete" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
                        <TabsTrigger value="athlete" className="py-3 text-base md:text-lg rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                            Atleta / Appassionato
                        </TabsTrigger>
                        <TabsTrigger value="trainer" className="py-3 text-base md:text-lg rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                            Personal Trainer
                        </TabsTrigger>
                        <TabsTrigger value="gym" className="py-3 text-base md:text-lg rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                            Palestra / Centro
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-8">
                        <TabsContent value="athlete">
                            <ContactSection
                                title="Per Atleti e Appassionati"
                                subtitle="Scarica la guida per scoprire come l'IA può trasformare il tuo allenamento."
                                brochureLink="/User Brochure.pdf"
                                brochureName="User Brochure.pdf"
                                type="athlete"
                                onSubmit={handleSubmit}
                                loading={loading}
                            />
                        </TabsContent>

                        <TabsContent value="trainer">
                            <ContactSection
                                title="Per Personal Trainer"
                                subtitle="Scopri come espandere la tua clientela e ottimizzare il tuo lavoro con i nostri strumenti."
                                brochureLink="/Trainer Brochure.pdf"
                                brochureName="Trainer Brochure.pdf"
                                type="trainer"
                                onSubmit={handleSubmit}
                                loading={loading}
                            />
                        </TabsContent>

                        <TabsContent value="gym">
                            <ContactSection
                                title="Per Gestori di Palestre"
                                subtitle="Digitalizza la tua struttura e attrai nuovi iscritti con la potenza del nostro ecosistema."
                                brochureLink="/GymOwner Brochure.pdf"
                                brochureName="GymOwner Brochure.pdf"
                                type="gym"
                                onSubmit={handleSubmit}
                                loading={loading}
                            />
                        </TabsContent>
                    </div>
                </Tabs>

            </div>
        </div>
    );
};

interface ContactSectionProps {
    title: string;
    subtitle: string;
    brochureLink: string;
    brochureName: string;
    type: 'athlete' | 'trainer' | 'gym';
    onSubmit: (e: React.FormEvent<HTMLFormElement>, type: 'athlete' | 'trainer' | 'gym') => void;
    loading: boolean;
}

const ContactSection = ({ title, subtitle, brochureLink, brochureName, type, onSubmit, loading }: ContactSectionProps) => {
    return (
        <div
            className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            {/* Download Card */}
            <Card className="h-full border-muted-foreground/10 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Download className="h-6 w-6 text-primary" />
                        Scarica Brochure
                    </CardTitle>
                    <CardDescription className="text-base">{subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <Download className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">{brochureName}</h4>
                            <p className="text-sm text-muted-foreground">PDF Document</p>
                        </div>
                        <Button asChild className="w-full sm:w-auto" size="lg">
                            <a href={brochureLink} download>
                                Scarica PDF
                            </a>
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Approfondimenti dettagliati
                        </p>
                        <p className="flex items-center gap-2 mt-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Roadmap delle funzionalità
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Form Card */}
            <Card className="h-full border-muted-foreground/10 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Send className="h-6 w-6 text-primary" />
                        Contattaci
                    </CardTitle>
                    <CardDescription className="text-base">Hai domande specifiche? Scrivici direttamente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => onSubmit(e, type)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`name-${type}`}>Nome & Cognome</Label>
                            <Input id={`name-${type}`} name="name" required placeholder="Mario Rossi" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`email-${type}`}>Email</Label>
                            <Input id={`email-${type}`} name="email" type="email" required placeholder="mario@example.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`message-${type}`}>Messaggio</Label>
                            <Textarea
                                id={`message-${type}`}
                                name="message"
                                required
                                placeholder="Vorrei avere maggiori informazioni su..."
                                className="min-h-[120px]"
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? "Invio in corso..." : "Invia Messaggio"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactPage;
