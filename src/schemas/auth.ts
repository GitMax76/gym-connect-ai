import { z } from "zod";

// Shared validation rules
const phoneRegex = /^\+?[0-9\s-]{5,}$/;
const passwordValidation = z
    .string()
    .min(8, "La password deve essere di almeno 8 caratteri")
    .regex(/[A-Z]/, "La password deve contenere almeno una lettera maiuscola")
    .regex(/[a-z]/, "La password deve contenere almeno una lettera minuscola")
    .regex(/[0-9]/, "La password deve contenere almeno un numero");

export const userRegistrationSchema = z.object({
    name: z.string().min(2, "Il nome deve essere di almeno 2 caratteri"),
    email: z.string().email("Inserisci un indirizzo email valido"),
    password: passwordValidation,
    age: z.coerce.number().min(14, "Devi avere almeno 14 anni").max(100, "Età non valida"),
    weight: z.coerce.number().min(30, "Peso non valido").max(300, "Peso non valido").optional(),
    height: z.coerce.number().min(100, "Altezza non valida").max(250, "Altezza non valida").optional(),
    fitnessLevel: z.string().min(1, "Seleziona il tuo livello di fitness"),
    goals: z.string().min(1, "Seleziona un obiettivo principale"),
    availability: z.string().min(1, "Seleziona la tua disponibilità"),
    budget: z.string().min(1, "Seleziona il tuo budget"),
    location: z.string().optional(),
    healthConditions: z.string().optional(),
    referralCode: z.string().optional(),
});

export const trainerRegistrationSchema = z.object({
    firstName: z.string().min(2, "Il nome deve essere di almeno 2 caratteri"),
    lastName: z.string().min(2, "Il cognome deve essere di almeno 2 caratteri"),
    email: z.string().email("Inserisci un indirizzo email valido"),
    password: passwordValidation,
    phone: z.string().regex(phoneRegex, "Numero di telefono non valido"),
    dateOfBirth: z.string().refine((date) => new Date(date) < new Date(), "Data di nascita non valida"),
    city: z.string().min(2, "Inserisci una città valida"),
    bio: z.string().min(10, "La bio deve essere di almeno 10 caratteri").max(500, "La bio non può superare i 500 caratteri"),
    certifications: z.array(z.string()).min(1, "Seleziona almeno una certificazione"),
    specializations: z.array(z.string()).min(1, "Seleziona almeno una specializzazione"),
    experience: z.coerce.number().min(0, "L'esperienza non può essere negativa"),
    personalRate: z.coerce.number().min(1, "La tariffa deve essere maggiore di 0"),
    groupRate: z.coerce.number().min(1, "La tariffa deve essere maggiore di 0"),
    availability: z.array(z.string()).min(1, "Seleziona almeno una disponibilità"),
    preferredAreas: z.enum(["Nord", "Sud", "Centro", "Est", "Ovest"], {
        required_error: "Seleziona una zona preferita",
    }),
    languages: z.array(z.string()).min(1, "Seleziona almeno una lingua"),
});

export const gymRegistrationSchema = z.object({
    gymName: z.string().min(2, "Il nome della palestra deve essere di almeno 2 caratteri"),
    ownerName: z.string().min(2, "Il nome del proprietario deve essere di almeno 2 caratteri"),
    email: z.string().email("Inserisci un indirizzo email valido"),
    password: passwordValidation.optional().or(z.literal('')), // Optional for existing users logic
    phone: z.string().regex(phoneRegex, "Numero di telefono non valido"),
    address: z.string().min(5, "Indirizzo troppo breve"),
    city: z.string().min(2, "Inserisci una città valida"),
    postalCode: z.string().min(5, "CAP non valido"),
    description: z.string().min(20, "La descrizione deve essere di almeno 20 caratteri"),
    facilities: z.array(z.string()).min(1, "Seleziona almeno un servizio"),
    openingDays: z.array(z.string()).min(1, "Seleziona almeno un giorno di apertura"),
    openingHours: z.string().min(1, "Seleziona orario apertura"),
    closingHours: z.string().min(1, "Seleziona orario chiusura"),
    memberCapacity: z.coerce.number().min(1, "Capacità non valida"),
    specializations: z.array(z.string()).optional(),
    subscriptionPlans: z.array(
        z.object({
            title: z.string().min(1, "Titolo richiesto"),
            price: z.string().min(1, "Prezzo richiesto"),
            duration: z.string(),
            description: z.string().optional()
        })
    ).min(1, "Aggiungi almeno un piano di abbonamento"),
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type TrainerRegistrationData = z.infer<typeof trainerRegistrationSchema>;
export type GymRegistrationData = z.infer<typeof gymRegistrationSchema>;
