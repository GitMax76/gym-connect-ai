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

        // Home Page & Hero
        'hero.tagline': { IT: 'L\'Ecosistema del Fitness 3.0', EN: 'The Fitness 3.0 Ecosystem' },
        'hero.title': { IT: 'Trova il tuo trainer perfetto,\nnella palestra giusta, subito.', EN: 'Find your perfect trainer,\nin the right gym, right now.' },
        'hero.cta.user': { IT: 'Inizia match gratuito', EN: 'Start Free Match' },
        'hero.cta.trainer': { IT: 'Unisciti come Pro', EN: 'Join as Pro' },
        'hero.cta.gym': { IT: 'Registra Palestra', EN: 'Register Gym' },
        
        // Choice Matrix Cards
        'hero.choice.athlete.title': { IT: 'Atleta / Appassionato', EN: 'Athlete / Enthusiast' },
        'hero.choice.athlete.desc': { IT: 'Match perfetto: trainer + palestra + orario libero.', EN: 'Perfect match: trainer + gym + free slot.' },
        'hero.choice.athlete.cta': { IT: 'Prova il match AI', EN: 'Try AI Match' },
        
        'hero.choice.trainer.title': { IT: 'Trainer / Coach', EN: 'Trainer / Coach' },
        'hero.choice.trainer.desc': { IT: 'Clienti qualificati, agenda piena, zero burocrazia.', EN: 'Qualified clients, full agenda, zero bureaucracy.' },
        'hero.choice.trainer.cta': { IT: 'Iscriviti Pro', EN: 'Join Pro' },

        'hero.choice.gym.title': { IT: 'Gestore Palestra', EN: 'Gym Manager' },
        'hero.choice.gym.desc': { IT: 'Riempi ore vuote, revenue extra da utenza esterna.', EN: 'Fill empty hours, extra revenue from external users.' },
        'hero.choice.gym.cta': { IT: 'Ottimizza spazi', EN: 'Optimize Spaces' },

        'hero.choice.sponsor.title': { IT: 'Sponsor / Brand', EN: 'Sponsor / Brand' },
        'hero.choice.sponsor.desc': { IT: 'Pubblicità nel momento post-allenamento, alta conversione.', EN: 'Ads at the post-workout moment, high conversion.' },
        'hero.choice.sponsor.cta': { IT: 'Marketing mirato', EN: 'Targeted Marketing' },

        // Sections
        'section.athlete.title': { IT: 'Per Atleti', EN: 'For Athletes' },
        'section.athlete.heading': { IT: 'Non cerchi, trovi.', EN: 'Don\'t search, find.' },
        'section.athlete.desc': { IT: 'L’AI abbina il tuo stile con trainer verificati e palestre vicine.', EN: 'AI matches your style with verified trainers and nearby gyms.' },
        'section.athlete.feat1': { IT: 'Match Istantaneo con IA', EN: 'Instant Match with AI' },
        'section.athlete.feat2': { IT: 'Paghi solo le sessioni reali', EN: 'Pay only for real sessions' },
        'section.athlete.feat3': { IT: 'Accesso a palestre premium', EN: 'Access to premium gyms' },

        'section.trainer.title': { IT: 'Per Trainer', EN: 'For Trainers' },
        'section.trainer.heading': { IT: 'Da Freelance a CEO.', EN: 'From Freelance to CEO.' },
        'section.trainer.desc': { IT: 'Lead pronti, pagamenti protetti, CRM integrato. Dimentica la vendita e concentrati sull\'allenamento.', EN: 'Ready leads, secure payments, integrated CRM. Forget sales and focus on training.' },
        'section.trainer.stat1.val': { IT: '+10h', EN: '+10h' },
        'section.trainer.stat1.label': { IT: 'Recuperate/settimana', EN: 'Recovered/week' },
        'section.trainer.stat2.val': { IT: 'Zero', EN: 'Zero' },
        'section.trainer.stat2.label': { IT: 'Costi fissi mensili', EN: 'Monthly fixed costs' },

        'section.gym.title': { IT: 'Per Palestre', EN: 'For Gyms' },
        'section.gym.heading': { IT: 'Hub Liquido.', EN: 'Liquid Hub.' },
        'section.gym.desc': { IT: 'Monetizza spazi off-peak con PT esterni e utenti profilati. Trasforma i costi fissi in ricavi dinamici.', EN: 'Monetize off-peak spaces with external PTs and profiled users. Turn fixed costs into dynamic revenue.' },
        'section.gym.stat.val': { IT: '80%', EN: '80%' },
        'section.gym.stat.label': { IT: 'Utilizzo medio sale (vs 35% standard)', EN: 'Average room usage (vs 35% standard)' },

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

        // User Dashboard
        'dashboard.loading': { IT: 'Caricamento dashboard...', EN: 'Loading dashboard...' },
        'dashboard.welcome': { IT: 'Ciao', EN: 'Hello' },
        'dashboard.subtitle.user': { IT: 'Benvenuto nella tua dashboard personale', EN: 'Welcome to your personal dashboard' },
        'dashboard.logout': { IT: 'Esci', EN: 'Logout' },
        'dashboard.profile.title': { IT: 'Il Tuo Profilo', EN: 'Your Profile' },
        'dashboard.profile.age': { IT: 'Età', EN: 'Age' },
        'dashboard.profile.weight': { IT: 'Peso', EN: 'Weight' },
        'dashboard.profile.height': { IT: 'Altezza', EN: 'Height' },
        'dashboard.profile.level': { IT: 'Livello', EN: 'Level' },
        'dashboard.profile.exp': { IT: 'Esperienza', EN: 'Experience' },
        'dashboard.profile.incomplete': { IT: 'Completa il tuo profilo per iniziare', EN: 'Complete your profile to start' },
        'dashboard.profile.complete_btn': { IT: 'Completa Profilo', EN: 'Complete Profile' },
        'dashboard.profile.not_specified': { IT: 'Non specificato', EN: 'Not specified' },
        'dashboard.profile.not_set': { IT: 'Non impostato', EN: 'Not set' },
        'dashboard.profile.not_defined': { IT: 'Non specificata', EN: 'Not defined' },
        'dashboard.stats.goal': { IT: 'Obiettivo Fitness', EN: 'Fitness Goal' },
        'dashboard.stats.budget': { IT: 'Budget', EN: 'Budget' },
        'dashboard.stats.budget_label': { IT: 'Budget mensile', EN: 'Monthly budget' },
        'dashboard.stats.availability': { IT: 'Disponibilità', EN: 'Availability' },
        'dashboard.stats.availability_label': { IT: 'Ore a settimana', EN: 'Hours per week' },
        'dashboard.actions.title': { IT: 'Azioni Rapide', EN: 'Quick Actions' },
        'dashboard.actions.find_trainer': { IT: 'Trova Trainer', EN: 'Find Trainer' },
        'dashboard.actions.search_gyms': { IT: 'Cerca Palestre', EN: 'Search Gyms' },
        'dashboard.actions.bookings': { IT: 'Le Mie Prenotazioni', EN: 'My Bookings' },
        'dashboard.actions.workout_plans': { IT: 'Piano di Allenamento', EN: 'Workout Plan' },
        'dashboard.referral.title': { IT: 'Invita Amici', EN: 'Invite Friends' },
        'dashboard.referral.desc': { IT: 'Guadagna 15 FC per ogni amico che si iscrive col tuo codice!', EN: 'Earn 15 FC for each friend signing up with your code!' },
        'dashboard.referral.copy': { IT: 'Copia Codice', EN: 'Copy Code' },
        'dashboard.activity.title': { IT: 'Attività Recente', EN: 'Recent Activity' },
        'dashboard.activity.empty': { IT: 'Nessuna attività recente', EN: 'No recent activity' },
        'dashboard.activity.desc': { IT: 'Le tue prenotazioni e sessioni appariranno qui', EN: 'Your bookings and sessions will appear here' },

        // Sponsor & Welfare
        'section.gym.cta': { IT: 'Richiedi Analisi Rendimento', EN: 'Request Performance Analysis' },
        'section.sponsor.title': { IT: 'PER BRAND & PARTNER', EN: 'FOR BRANDS & PARTNERS' },
        'section.sponsor.heading': { IT: 'Own the Moment.', EN: 'Own the Moment.' },
        'section.sponsor.desc': { IT: 'Inserisci il tuo brand nel momento di massima endorfina: il post-workout. Ads contestuali, reward sbloccabili, zero sprechi.', EN: 'Insert your brand at the moment of maximum endorphins: post-workout. Contextual ads, unlockable rewards, zero waste.' },
        'section.sponsor.mock.title': { IT: 'Protein Power', EN: 'Protein Power' },
        'section.sponsor.mock.label': { IT: 'Sponsor Premium', EN: 'Premium Sponsor' },
        'section.sponsor.mock.desc': { IT: '"Hai bruciato 600kcal! Riscatta la tua barretta gratuita ora."', EN: '"You burned 600kcal! Redeem your free bar now."' },
        'section.sponsor.mock.ad': { IT: '[Ad Visual: Shake Gratuito]', EN: '[Ad Visual: Free Shake]' },
        'section.sponsor.cta': { IT: 'Diventa Partner', EN: 'Become a Partner' },
        'section.final.title': { IT: 'Non sai da dove iniziare?', EN: 'Don\'t know where to start?' },
        'section.final.cta': { IT: 'Avvia Tour Interattivo (AI)', EN: 'Start Interactive Tour (AI)' },
        'section.final.welfare': { IT: 'Scopri il Welfare Sportivo Digitale', EN: 'Discover Digital Sports Welfare' },
        'section.final.welfare_prefix': { IT: 'Anche per Enti Pubblici:', EN: 'Also for Public Entities:' },

        // Interactive Tour (driver.js)
        'tour.welcome.title': { IT: 'Benvenuto in FitFlow AI', EN: 'Welcome to FitFlow AI' },
        'tour.welcome.desc': { IT: 'La piattaforma universale che connette l\'intero ecosistema del fitness in pochi click.', EN: 'The universal platform connecting the entire fitness ecosystem in a few clicks.' },
        'tour.athlete.title': { IT: 'Sei un Atleta?', EN: 'Are you an Athlete?' },
        'tour.athlete.desc': { IT: 'Trova il trainer perfetto e la palestra ideale. L\'AI analizza il tuo stile e ti propone i match migliori.', EN: 'Find the perfect trainer and the ideal gym. AI analyzes your style and suggests the best matches.' },
        'tour.trainer.title': { IT: 'Sei un Trainer?', EN: 'Are you a Trainer?' },
        'tour.trainer.desc': { IT: 'Gestisci i tuoi clienti, ricevi pagamenti sicuri e aumenta le tue entrate senza costi fissi.', EN: 'Manage your clients, receive secure payments and increase your income with zero fixed costs.' },
        'tour.gym.title': { IT: 'Gestisci una Palestra?', EN: 'Are you managing a Gym?' },
        'tour.gym.desc': { IT: 'Monetizza gli orari morti ospitando trainer esterni e utenti occasionali.', EN: 'Monetize off-peak hours by hosting external trainers and occasional users.' },
        'tour.sponsor.title': { IT: 'Sei un Brand?', EN: 'Are you a Brand?' },
        'tour.sponsor.desc': { IT: 'Inserisci i tuoi prodotti nel momento perfetto: il post-workout reward.', EN: 'Insert your products at the perfect moment: the post-workout reward.' },
        'tour.start.title': { IT: 'Pronto a iniziare?', EN: 'Ready to start?' },
        'tour.start.desc': { IT: 'Scegli la tua categoria qui sopra e inizia la rivoluzione fitness!', EN: 'Choose your category above and start the fitness revolution!' },
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
