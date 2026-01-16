import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'IT' | 'EN';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('IT');

    const translations: Record<string, Record<Language, string>> = {
        'nav.home': { IT: 'Home', EN: 'Home' },
        'nav.dashboard': { IT: 'Dashboard', EN: 'Dashboard' },
        'nav.search': { IT: 'Cerca', EN: 'Search' },
        'nav.bookings': { IT: 'Prenotazioni', EN: 'Bookings' },
        'nav.login': { IT: 'Accedi', EN: 'Login' },
        'nav.register': { IT: 'Registrati', EN: 'Register' },
        'nav.vision': { IT: 'Vision', EN: 'Vision' },
        'nav.contact': { IT: 'Contatti', EN: 'Contact' },
        'nav.investors': { IT: 'Investitori', EN: 'Investors' },
        'nav.privacy': { IT: 'Privacy', EN: 'Privacy' },
        'nav.terms': { IT: 'Termini', EN: 'Terms' },
        'footer.created_by': { IT: 'Creato da', EN: 'Created by' },

        // Home Page
        'hero.title': { IT: 'Il Futuro del Fitness è Qui', EN: 'The Future of Fitness is Here' },
        'hero.subtitle': { IT: 'Connetti. Allenati. Cresci.', EN: 'Connect. Train. Grow.' },
        'hero.cta.user': { IT: 'Inizia match gratuito', EN: 'Start Free Match' },
        'hero.cta.trainer': { IT: 'Unisciti come Pro', EN: 'Join as Pro' },
        'hero.cta.gym': { IT: 'Registra Palestra', EN: 'Register Gym' },

        // Sections
        'section.athlete.title': { IT: 'Per Atleti', EN: 'For Athletes' },
        'section.athlete.heading': { IT: 'Non cerchi, trovi.', EN: 'Don\'t search, find.' },
        'section.athlete.desc': { IT: 'L’AI abbina il tuo stile con trainer verificati e palestre vicine.', EN: 'AI matches your style with verified trainers and nearby gyms.' },

        'section.trainer.title': { IT: 'Per Trainer', EN: 'For Trainers' },
        'section.trainer.heading': { IT: 'Da Freelance a CEO.', EN: 'From Freelance to CEO.' },
        'section.trainer.desc': { IT: 'Lead pronti, pagamenti protetti, CRM integrato.', EN: 'Ready leads, secure payments, integrated CRM.' },

        'section.gym.title': { IT: 'Per Palestre', EN: 'For Gyms' },
        'section.gym.heading': { IT: 'Hub Liquido.', EN: 'Liquid Hub.' },
        'section.gym.desc': { IT: 'Monetizza spazi off-peak con PT esterni e utenti profilati.', EN: 'Monetize off-peak spaces with external PTs and profiled users.' },

        // Forms
        'form.firstName': { IT: 'Nome', EN: 'First Name' },
        'form.lastName': { IT: 'Cognome', EN: 'Last Name' },
        'form.email': { IT: 'Email', EN: 'Email' },
        'form.password': { IT: 'Password', EN: 'Password' },
        'form.phone': { IT: 'Telefono', EN: 'Phone' },
        'form.dateOfBirth': { IT: 'Data di Nascita', EN: 'Date of Birth' },
        'form.city': { IT: 'Città', EN: 'City' },
        'form.preferredAreas': { IT: 'Zona Preferita', EN: 'Preferred Area' },
        'form.submit.trainer': { IT: 'Diventa Coach', EN: 'Become a Coach' },
        'form.submit.user': { IT: 'Inizia il Tuo Percorso', EN: 'Start Your Journey' },
        'form.submit.gym': { IT: 'Registra la Palestra', EN: 'Register Gym' },
        'form.error.required': { IT: 'Compila tutti i campi obbligatori', EN: 'Fill all required fields' },

    };

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }
        }>
            {children}
        </LanguageContext.Provider >
    );
};
