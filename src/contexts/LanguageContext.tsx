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

        // Trainer Dashboard
        'trainer.welcome': { IT: 'Ciao, Trainer', EN: 'Hello, Trainer' },
        'trainer.pro': { IT: 'Professionista', EN: 'Professional' },
        'trainer.subtitle': { IT: 'Gestisci i tuoi clienti e le tue sessioni', EN: 'Manage your clients and sessions' },
        'trainer.stats.active_clients': { IT: 'Clienti Attivi', EN: 'Active Clients' },
        'trainer.stats.monthly_growth': { IT: '+2 questo mese', EN: '+2 this month' },
        'trainer.stats.hourly_rate': { IT: 'Tariffa Oraria', EN: 'Hourly Rate' },
        'trainer.stats.rate_desc': { IT: 'Sessioni individuali', EN: 'Individual sessions' },
        'trainer.stats.rating': { IT: 'Valutazione', EN: 'Rating' },
        'trainer.stats.reviews': { IT: 'recensioni', EN: 'reviews' },
        'trainer.stats.experience': { IT: 'Esperienza', EN: 'Experience' },
        'trainer.stats.experience_desc': { IT: 'Anni di esperienza', EN: 'Years of experience' },
        'trainer.profile.title': { IT: 'Il Tuo Profilo Trainer', EN: 'Your Trainer Profile' },
        'trainer.profile.specializations': { IT: 'Specializzazioni', EN: 'Specializations' },
        'trainer.profile.no_specializations': { IT: 'Nessuna specializzazione', EN: 'No specializations' },
        'trainer.profile.certifications': { IT: 'Certificazioni', EN: 'Certifications' },
        'trainer.profile.no_certifications': { IT: 'Nessuna certificazione', EN: 'No certifications' },
        'trainer.profile.bio': { IT: 'Bio', EN: 'Bio' },
        'trainer.profile.incomplete': { IT: 'Completa il tuo profilo trainer', EN: 'Complete your trainer profile' },
        'trainer.profile.complete_btn': { IT: 'Completa Profilo', EN: 'Complete Profile' },
        'trainer.profile.edit_btn': { IT: 'Modifica Profilo', EN: 'Edit Profile' },
        'trainer.actions.title': { IT: 'Azioni Rapide', EN: 'Quick Actions' },
        'trainer.actions.my_clients': { IT: 'I Miei Clienti', EN: 'My Clients' },
        'trainer.actions.today_bookings': { IT: 'Prenotazioni Oggi', EN: 'Bookings Today' },
        'trainer.actions.earnings': { IT: 'Guadagni', EN: 'Earnings' },
        'trainer.schedule.today': { IT: 'Programma di Oggi', EN: 'Today\'s Schedule' },
        'trainer.schedule.pt': { IT: 'Allenamento Personal Training', EN: 'Personal Training Workout' },
        'trainer.schedule.yoga': { IT: 'Sessione di Yoga', EN: 'Yoga Session' },
        'trainer.status.confirmed': { IT: 'Confermato', EN: 'Confirmed' },
        'trainer.status.pending': { IT: 'In attesa', EN: 'Pending' },
        'trainer.coaching.requests': { IT: 'Richieste di Schede (Remote Coaching)', EN: 'Workout Plan Requests (Remote Coaching)' },
        'trainer.coaching.no_requests': { IT: 'Nessuna richiesta pending.', EN: 'No pending requests.' },
        'trainer.coaching.goal': { IT: 'Obiettivo', EN: 'Goal' },
        'trainer.coaching.days_per_week': { IT: 'giorni/settimana', EN: 'days/week' },
        'trainer.coming_soon.title': { IT: 'In arrivo', EN: 'Coming soon' },
        'trainer.coming_soon.desc': { IT: 'Questa funzionalità sarà presto disponibile!', EN: 'This feature will be available soon!' },

        // Gym Dashboard
        'gym.welcome': { IT: 'La Tua Palestra', EN: 'Your Gym' },
        'gym.edit_profile': { IT: 'Modifica Profilo', EN: 'Edit Profile' },
        'gym.tabs.overview': { IT: 'Panoramica', EN: 'Overview' },
        'gym.tabs.members': { IT: 'Membri', EN: 'Members' },
        'gym.tabs.bookings': { IT: 'Prenotazioni', EN: 'Bookings' },
        'gym.tabs.promotions': { IT: 'Promozioni', EN: 'Promotions' },
        'gym.stats.active_members': { IT: 'Membri Attivi', EN: 'Active Members' },
        'gym.stats.wallet_balance': { IT: 'Saldo Wallet', EN: 'Wallet Balance' },
        'gym.stats.today_bookings': { IT: 'Prenotazioni Oggi', EN: 'Bookings Today' },
        'gym.stats.avg_rating': { IT: 'Rating Medio', EN: 'Average Rating' },
        'gym.stats.new_leads': { IT: 'Nuovi Leads', EN: 'New Leads' },
        'gym.actions.title': { IT: 'Azioni Rapide', EN: 'Quick Actions' },
        'gym.actions.subtitle': { IT: 'Gestisci la tua attività', EN: 'Manage your business' },
        'gym.actions.search': { IT: 'Cerca Trainer/Atleti', EN: 'Search Trainers/Athletes' },
        'gym.actions.wallet': { IT: 'Il mio Portafoglio', EN: 'My Wallet' },
        'gym.actions.manage_members': { IT: 'Gestisci Membri', EN: 'Manage Members' },
        'gym.actions.bookings': { IT: 'Prenotazioni', EN: 'Bookings' },
        'gym.actions.manage_facilities': { IT: 'Gestisci Strutture', EN: 'Manage Facilities' },
        'gym.actions.pricing_plans': { IT: 'Piani Abbonamento', EN: 'Subscription Plans' },
        'gym.actions.manage_promotions': { IT: 'Gestisci Promozioni', EN: 'Manage Promotions' },
        'gym.stats.usage_title': { IT: 'Statistiche Utilizzo (Stimate)', EN: 'Usage Statistics (Estimated)' },
        'gym.stats.peak_hours': { IT: 'Ore di punta (18:00-20:00)', EN: 'Peak hours (18:00-20:00)' },
        'gym.stats.morning': { IT: 'Mattina (08:00-12:00)', EN: 'Morning (08:00-12:00)' },
        'gym.stats.afternoon': { IT: 'Pomeriggio (14:00-17:00)', EN: 'Afternoon (14:00-17:00)' },
        'gym.stats.usage_footer': { IT: 'Dati basati sulla capacità dichiarata e prenotazioni medie.', EN: 'Data based on declared capacity and average bookings.' },

        // Wallet Page
        'wallet.title': { IT: 'Il mio Portafoglio', EN: 'My Wallet' },
        'wallet.balance_available': { IT: 'Saldo Disponibile', EN: 'Available Balance' },
        'wallet.balance_subtitle': { IT: 'FitCoin utilizzabili per prenotazioni', EN: 'FitCoins available for bookings' },
        'wallet.account_status': { IT: 'Stato Account', EN: 'Account Status' },
        'wallet.account_active': { IT: 'Account Attivo', EN: 'Account Active' },
        'wallet.account_desc': { IT: 'Usa i tuoi crediti per prenotare sessioni con i migliori trainer.', EN: 'Use your credits to book sessions with the best trainers.' },
        'wallet.history': { IT: 'Cronologia Transazioni', EN: 'Transaction History' },
        'wallet.no_transactions': { IT: 'Nessuna transazione recente.', EN: 'No recent transactions.' },
        'wallet.transaction': { IT: 'Transazione', EN: 'Transaction' },
        'wallet.topup_title': { IT: 'Ricarica FitCoin', EN: 'Top-Up FitCoins' },
        'wallet.starter_desc': { IT: 'per iniziare', EN: 'to get started' },
        'wallet.buy': { IT: 'Acquista', EN: 'Buy' },
        'wallet.best_value': { IT: 'Miglior Valore', EN: 'Best Value' },
        'wallet.active_bonus': { IT: '+10% Bonus', EN: '+10% Bonus' },
        'wallet.pro_bonus': { IT: '+15% Bonus', EN: '+15% Bonus' },
        'wallet.elite_bonus': { IT: '+20% Bonus', EN: '+20% Bonus' },
        'wallet.partner_reward': { IT: 'Premio Partner', EN: 'Partner Reward' },
        'wallet.vip_reward': { IT: 'Premio VIP', EN: 'VIP Reward' },
        'wallet.myprotein_reward': { IT: 'Regalo MyProtein 25€', EN: 'MyProtein €25 Gift' },
        'wallet.welcome_kit_reward': { IT: 'Kit Benvenuto {brandName}', EN: '{brandName} Welcome Kit' },
        'wallet.elite_btn': { IT: 'Diventa Elite', EN: 'Go Elite' },

        // Bookings Page & List
        'bookings.title': { IT: 'Le Mie Prenotazioni', EN: 'My Bookings' },
        'bookings.subtitle': { IT: 'Gestisci le tue sessioni di allenamento', EN: 'Manage your workout sessions' },
        'bookings.tabs.all': { IT: 'Tutte', EN: 'All' },
        'bookings.tabs.pending': { IT: 'In attesa', EN: 'Pending' },
        'bookings.tabs.confirmed': { IT: 'Confermate', EN: 'Confirmed' },
        'bookings.tabs.completed': { IT: 'Completate', EN: 'Completed' },
        'bookings.loading': { IT: 'Caricamento prenotazioni...', EN: 'Loading bookings...' },
        'bookings.empty': { IT: 'Nessuna prenotazione trovata in questa sezione.', EN: 'No bookings found in this section.' },
        'bookings.session.personal': { IT: 'Personal Training', EN: 'Personal Training' },
        'bookings.session.group': { IT: 'Sessione di Gruppo', EN: 'Group Session' },
        'bookings.status.confirmed': { IT: 'Confermata', EN: 'Confirmed' },
        'bookings.status.pending': { IT: 'In attesa', EN: 'Pending' },
        'bookings.status.cancelled': { IT: 'Cancellata', EN: 'Cancelled' },
        'bookings.status.completed': { IT: 'Completata', EN: 'Completed' },
        'bookings.action.decline': { IT: 'Rifiuta', EN: 'Decline' },
        'bookings.action.confirm': { IT: 'Conferma', EN: 'Confirm' },
        'bookings.action.cancel_request': { IT: 'Cancella Richiesta', EN: 'Cancel Request' },
        'bookings.action.complete': { IT: 'Segna come Completata', EN: 'Mark as Completed' },
        'bookings.toast.error_status': { IT: 'Errore nell\'aggiornamento dello stato', EN: 'Error updating status' },
        'bookings.toast.confirmed': { IT: 'Prenotazione confermata', EN: 'Booking confirmed' },
        'bookings.toast.cancelled': { IT: 'Prenotazione cancellata', EN: 'Booking cancelled' },
        'bookings.toast.completed': { IT: 'Prenotazione segnata come completata', EN: 'Booking marked as completed' },

        // Workout Plans Page
        'workout.back_to_dashboard': { IT: 'Torna alla Dashboard', EN: 'Back to Dashboard' },
        'workout.title': { IT: 'I Miei Piani di Allenamento', EN: 'My Workout Plans' },
        'workout.subtitle': { IT: 'Visualizza e sblocca i programmi dei tuoi trainer', EN: 'View and unlock programs from your trainers' },
        'workout.empty_title': { IT: 'Nessun piano attivo', EN: 'No active plans' },
        'workout.empty_desc': { IT: 'Non hai ancora ricevuto nessun piano di allenamento. Contatta un trainer o prenota una sessione per iniziare!', EN: 'You haven\'t received any workout plans yet. Contact a trainer or book a session to get started!' },
        'workout.find_trainer_btn': { IT: 'Trova un Trainer', EN: 'Find a Trainer' },
        'workout.status.pending': { IT: 'In attesa di pagamento', EN: 'Awaiting Payment' },
        'workout.status.active': { IT: 'In Corso', EN: 'In Progress' },
        'workout.status.completed': { IT: 'Completato', EN: 'Completed' },
        'workout.mark_completed': { IT: 'Segna Completato', EN: 'Mark Completed' },
        'workout.unlock_btn': { IT: 'Sblocca per {price} FC', EN: 'Unlock for {price} FC' },
        'workout.duration': { IT: 'Durata Programma', EN: 'Program Duration' },
        'workout.start': { IT: 'Inizio', EN: 'Start' },
        'workout.end': { IT: 'Scadenza', EN: 'Deadline' },
        'workout.details_title': { IT: 'Scheda Allenamento', EN: 'Workout Schedule Details' },
        'workout.locked_title': { IT: 'Contenuto Bloccato', EN: 'Content Locked' },
        'workout.locked_desc': { IT: 'Acquista la scheda per visualizzare i dettagli', EN: 'Purchase the plan to view details' },
        'workout.no_details': { IT: 'Nessun dettaglio fornito.', EN: 'No details provided.' },
        'workout.toast.purchase_completed': { IT: 'Acquisto completato!', EN: 'Purchase completed!' },
        'workout.toast.unlocked_desc': { IT: 'La scheda è ora sbloccata.', EN: 'The plan has been unlocked.' },
        'workout.toast.payment_error': { IT: 'Errore pagamento', EN: 'Payment error' },
        'workout.toast.insufficient_funds': { IT: 'Credito insufficiente.', EN: 'Insufficient funds.' },
        'workout.toast.error': { IT: 'Errore', EN: 'Error' },
        'workout.toast.payment_failed': { IT: 'Si è verificato un errore durante il pagamento.', EN: 'An error occurred during payment.' },

        // Register Page
        'register.missing_data': { IT: 'Dati mancanti', EN: 'Missing data' },
        'register.missing_credentials': { IT: 'Email e Password sono richiesti per la registrazione.', EN: 'Email and Password are required for registration.' },
        'register.error_saving': { IT: 'Errore nel salvare il profilo: ', EN: 'Error saving profile: ' },
        'register.unhandled_error': { IT: 'Errore Non Gestito', EN: 'Unhandled Error' },
        'register.error_generic': { IT: 'Errore durante la registrazione', EN: 'Error during registration' },
        'register.already_have_account': { IT: 'Hai già un account?', EN: 'Already have an account?' },
        'register.login_here': { IT: 'Accedi qui', EN: 'Login here' },
        'register.transform_passion': { IT: 'Trasforma la Tua\nPassione Fitness', EN: 'Transform Your\nFitness Passion' },
        'register.revolution_desc': { IT: 'Unisciti alla rivoluzione del fitness intelligente. Scegli il tuo ruolo e inizia a creare connessioni autentiche nel mondo del benessere e della forma fisica.', EN: 'Join the intelligent fitness revolution. Choose your role and start creating authentic connections in the world of wellness and fitness.' },
        'register.professionals_connected': { IT: '✨ Oltre 10.000 professionisti già connessi ✨', EN: '✨ Over 10,000 professionals already connected ✨' },

        // Login Page
        'login.enter_credentials': { IT: 'Per favore inserisci email e password', EN: 'Please enter your email and password' },
        'login.invalid_credentials': { IT: 'Credenziali non valide. Controlla email e password.', EN: 'Invalid credentials. Please check your email and password.' },
        'login.error_generic': { IT: 'Si è verificato un errore durante l\'accesso. Riprova.', EN: 'An error occurred during login. Please try again.' },
        'login.welcome_back': { IT: 'Bentornato!', EN: 'Welcome back!' },
        'login.subtitle': { IT: 'Accedi al tuo account {brandName}', EN: 'Log in to your {brandName} account' },
        'login.title': { IT: 'Accedi', EN: 'Login' },
        'login.email_placeholder': { IT: 'inserisci la tua email', EN: 'enter your email' },
        'login.password_placeholder': { IT: 'inserisci la tua password', EN: 'enter your password' },
        'login.loading': { IT: 'Accesso in corso...', EN: 'Logging in...' },
        'login.or': { IT: 'oppure', EN: 'or' },
        'login.no_account': { IT: 'Non hai ancora un account? ', EN: 'Don\'t have an account yet? ' },
        'login.register_here': { IT: 'Registrati qui', EN: 'Register here' },
        'login.manage_gym': { IT: 'Gestisci una palestra? ', EN: 'Managing a gym? ' },
        'login.register_gym': { IT: 'Registra la tua struttura', EN: 'Register your facility' },
        'login.back_home': { IT: '← Torna alla homepage', EN: '← Back to homepage' },
        'login.footer': { IT: '© 2026 {brandName}. Tutti i diritti riservati.', EN: '© 2026 {brandName}. All rights reserved.' },

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
