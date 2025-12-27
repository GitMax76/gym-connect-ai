import React, { useState, useEffect } from 'react';
import {
    Users,
    Dumbbell,
    Building2,
    ArrowRight,
    ChevronRight,
    ChevronLeft,
    TrendingUp,
    Clock,
    CheckCircle,
    DollarSign,
    Search,
    Zap,
    Target,
    LucideIcon
} from 'lucide-react';

// Interfaces for props
interface SlideContainerProps {
    children?: React.ReactNode;
    active: boolean;
    className?: string;
}

interface CardProps {
    title: string;
    icon: LucideIcon;
    description: string;
    color: string;
    delay: number;
}

interface DeepDiveSlideProps {
    active: boolean;
}

interface SimulationSlideProps {
    active: boolean;
}

// Componenti di utilità per le slide
const SlideContainer = ({ children, active, className = "" }: SlideContainerProps) => {
    if (!active) return null;
    return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-8 animate-fadeIn ${className}`}>
            {children}
        </div>
    );
};

const Card = ({ title, icon: Icon, description, color, delay }: CardProps) => (
    <div
        className={`bg-white p-6 rounded-xl shadow-lg border-l-4 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl opacity-0 animate-slideUp`}
        style={{ borderLeftColor: color, animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className="flex items-center mb-4">
            <div className="p-3 rounded-full mr-4 text-white" style={{ backgroundColor: color }}>
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

// Sub-componente per Deep Dive (Tabs)
const DeepDiveSlide = ({ active }: DeepDiveSlideProps) => {
    const [tab, setTab] = useState(0);
    const tabs = [
        {
            id: 0,
            label: "Per l'Atleta",
            title: "Dal 'Cercare' al 'Trovare'",
            color: "bg-red-500",
            icon: Users,
            points: [
                "Matching intelligente basato su budget e obiettivi.",
                "Fiducia garantita: solo profili verificati.",
                "Roadmap: Smart Alert per disponibilità istantanee."
            ]
        },
        {
            id: 1,
            label: "Per il Trainer",
            title: "Imprenditori di Se Stessi",
            color: "bg-amber-500",
            icon: Dumbbell,
            points: [
                "Acquisizione clienti automatica (Zero ad-spend).",
                "Riempimento slot 'morti' per massimizzare il reddito.",
                "Networking diretto con strutture senza vincoli."
            ]
        },
        {
            id: 2,
            label: "Per la Struttura",
            title: "Asset Monetization",
            color: "bg-blue-500",
            icon: Building2,
            points: [
                "Trasformare sale vuote in centri di profitto.",
                "Cross-Referral: i trainer portano nuovi clienti.",
                "Aumento della retention grazie all'effetto rete."
            ]
        }
    ];

    if (!active) return null;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Analisi del Valore (Deep Dive)</h2>

            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[500px]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-1/3 bg-gray-100 p-2 flex flex-col gap-2">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`p-4 rounded-xl text-left transition-all flex items-center ${tab === t.id ? 'bg-white shadow-md ring-2 ring-blue-100' : 'hover:bg-gray-200'}`}
                        >
                            <div className={`p-2 rounded-lg text-white mr-3 ${t.color}`}>
                                <t.icon size={20} />
                            </div>
                            <span className={`font-semibold ${tab === t.id ? 'text-gray-900' : 'text-gray-500'}`}>{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="w-full md:w-2/3 p-8 flex flex-col justify-center bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        {React.createElement(tabs[tab].icon, { size: 200 })}
                    </div>

                    <div className="relative z-10 animate-slideUp" key={tab}>
                        <h3 className={`text-2xl font-bold mb-2 ${tabs[tab].color.replace('bg-', 'text-')}`}>
                            {tabs[tab].title}
                        </h3>
                        <div className="h-1 w-20 bg-gray-200 mb-6 rounded-full">
                            <div className={`h-full rounded-full ${tabs[tab].color} w-1/2`} />
                        </div>

                        <ul className="space-y-4">
                            {tabs[tab].points.map((point, idx) => (
                                <li key={idx} className="flex items-start">
                                    <div className={`mt-1 mr-3 min-w-[20px] h-5 rounded-full flex items-center justify-center text-white text-xs ${tabs[tab].color}`}>
                                        <CheckCircle size={12} />
                                    </div>
                                    <p className="text-gray-600 text-lg">{point}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-componente per Simulazione (Use Case)
const SimulationSlide = ({ active }: SimulationSlideProps) => {
    const [step, setStep] = useState(0);

    const resetSimulation = () => setStep(0);
    const nextStep = () => { if (step < 4) setStep(s => s + 1); };

    if (!active) {
        if (step !== 0) setStep(0); // Reset when leaving slide
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50 animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Use Case: "Palestra di Quartiere"</h2>
                <p className="text-gray-500">Clicca sul pulsante per vedere l'ecosistema in azione.</p>
            </div>

            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative min-h-[500px]">

                {/* Environment Layer */}
                <div className="absolute top-4 right-4 flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <Clock className="mr-2 text-gray-500" />
                    <span className="font-mono font-bold text-gray-700">
                        {step === 0 ? "09:00" : "10:00 (Fascia Morta)"}
                    </span>
                </div>

                <div className="flex justify-between items-center h-full pt-12">

                    {/* ZONE 1: UTENTI */}
                    <div className={`flex flex-col items-center transition-all duration-700 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-20 -translate-x-10 blur-sm'}`}>
                        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 w-48 text-center relative">
                            {step >= 1 && <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold animate-bounce">Domanda!</div>}
                            <div className="grid grid-cols-3 gap-2 mb-2 justify-center">
                                {[1, 2, 3, 4, 5].map(i => <Users key={i} size={24} className="text-red-400" />)}
                            </div>
                            <p className="font-bold text-red-800">5 Atleti</p>
                            <p className="text-xs text-red-600">Cercano Pilates</p>
                        </div>
                    </div>

                    {/* ARROW 1 */}
                    <div className="flex-1 flex justify-center">
                        {step >= 2 && (
                            <div className="h-1 bg-gray-200 w-full relative overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 h-full bg-blue-500 animate-slideRight w-full" />
                            </div>
                        )}
                    </div>

                    {/* ZONE 2: TRAINER */}
                    <div className={`flex flex-col items-center transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-20 scale-90 blur-sm'}`}>
                        <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-100 w-48 text-center relative z-10 shadow-lg">
                            {step >= 2 && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white rounded-full px-2 py-1 text-xs font-bold">Matching!</div>}
                            <Dumbbell size={48} className="text-amber-500 mx-auto mb-2" />
                            <p className="font-bold text-amber-800">Trainer Marco</p>
                            <p className="text-xs text-amber-600">Libero alle 10:00</p>
                            {step >= 4 && <div className="mt-2 text-green-600 font-bold flex items-center justify-center"><DollarSign size={14} /> Pagato</div>}
                        </div>
                    </div>

                    {/* ARROW 2 */}
                    <div className="flex-1 flex justify-center">
                        {step >= 3 && (
                            <div className="h-1 bg-gray-200 w-full relative overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 h-full bg-blue-500 animate-slideRight w-full" />
                            </div>
                        )}
                    </div>

                    {/* ZONE 3: PALESTRA */}
                    <div className={`flex flex-col items-center transition-all duration-700 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-10 blur-sm'}`}>
                        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 w-48 text-center">
                            {step >= 3 && <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold">Prenotato!</div>}
                            <Building2 size={48} className="text-blue-500 mx-auto mb-2" />
                            <p className="font-bold text-blue-800">Palestra FitZone</p>
                            <p className="text-xs text-blue-600">Sala Vuota</p>
                            {step >= 4 && <div className="mt-2 text-green-600 font-bold flex items-center justify-center"><DollarSign size={14} /> Monetizzato</div>}
                        </div>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="absolute bottom-8 left-0 w-full flex justify-center">
                    <button
                        onClick={step >= 4 ? resetSimulation : nextStep}
                        className={`flex items-center space-x-2 px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg transform hover:scale-105 ${step >= 4 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-500'}`}
                    >
                        {step === 0 && <span>Avvia Scenario</span>}
                        {step === 1 && <span>Trova Trainer</span>}
                        {step === 2 && <span>Trova Struttura</span>}
                        {step === 3 && <span>Genera Valore</span>}
                        {step === 4 && <span>Riavvia Demo</span>}
                        <Target size={18} />
                    </button>
                </div>

                {/* WIN MESSAGE */}
                {step === 4 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl animate-bounce z-50 text-xl font-bold flex items-center">
                        <CheckCircle className="mr-2" /> Win-Win-Win!
                    </div>
                )}
            </div>

            <style>{`
         @keyframes slideRight { from { width: 0; } to { width: 100%; } }
         .animate-slideRight { animation: slideRight 1s ease-out forwards; }
      `}</style>
        </div>
    );
};

export default function PitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 6;

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) setCurrentSlide(curr => curr + 1);
    };

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
    };

    // Navigazione tastiera
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    return (
        <div className="w-full h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden relative">

            {/* Header/Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 z-50">
                <div
                    className="h-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
            </div>

            {/* Main Content Area */}
            <div className="w-full h-full relative">

                {/* SLIDE 1: VISIONE */}
                <SlideContainer active={currentSlide === 0} className="bg-gradient-to-br from-blue-900 to-slate-900 text-white text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 inline-block px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 text-blue-200 text-sm font-semibold tracking-wider uppercase animate-pulse">
                            Strategic Pitch Deck
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                            Oltre la Directory. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                                Ecosistema Fitness Intelligente
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
                            Connettiamo <span className="text-white font-semibold">Atleti</span>, <span className="text-white font-semibold">Trainer</span> e <span className="text-white font-semibold">Strutture</span> in tempo reale per eliminare le inefficienze del mercato.
                        </p>
                        <button
                            onClick={nextSlide}
                            className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center mx-auto"
                        >
                            Scopri la Visione
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Decorative floating elements */}
                    <div className="absolute top-20 left-20 opacity-20 animate-float-slow"><Users size={64} /></div>
                    <div className="absolute bottom-20 right-20 opacity-20 animate-float-slow" style={{ animationDelay: '1s' }}><Building2 size={80} /></div>
                </SlideContainer>

                {/* SLIDE 2: IL PROBLEMA (THE GAP) */}
                <SlideContainer active={currentSlide === 1}>
                    <div className="max-w-6xl mx-auto w-full">
                        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">L'Inefficienza del Mercato Attuale</h2>
                        <p className="text-center text-gray-500 mb-12 text-xl">Tre attori disconnessi, tre problemi strutturali.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card
                                title="Atleti (La Domanda)"
                                icon={Search}
                                color="#EF4444"
                                delay={100}
                                description="Frustrati dalla ricerca manuale. Si adattano a orari scomodi e offerte generiche. Perdono tempo cercando la qualità."
                            />
                            <Card
                                title="Trainer (L'Offerta)"
                                icon={Dumbbell}
                                color="#F59E0B"
                                delay={300}
                                description="Alti costi di marketing per trovare clienti. Soffrono di 'orari morti' non retribuiti durante la giornata."
                            />
                            <Card
                                title="Strutture (L'Asset)"
                                icon={Building2}
                                color="#3B82F6"
                                delay={500}
                                description="Sale vuote nelle fasce off-peak (mattina/pomeriggio). Costi fissi elevati (affitto, luce) non coperti da entrate costanti."
                            />
                        </div>
                    </div>
                </SlideContainer>

                {/* SLIDE 3: LA SOLUZIONE (CORE VALUE) */}
                <SlideContainer active={currentSlide === 2} className="bg-slate-50">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-12 text-gray-900">Il Motore di Matching a Triplo Vantaggio</h2>

                        <div className="relative w-full max-w-2xl mx-auto h-[500px] flex items-center justify-center">
                            {/* Central Hub */}
                            <div className="absolute z-20 bg-white w-40 h-40 rounded-full shadow-2xl flex flex-col items-center justify-center border-4 border-blue-500 animate-pulse-slow">
                                <Zap size={48} className="text-blue-600 mb-2" />
                                <span className="font-bold text-gray-800">L'APP</span>
                                <span className="text-xs text-gray-500">Matching Engine</span>
                            </div>

                            {/* Connecting Lines (SVG) */}
                            <svg className="absolute w-full h-full z-0 animate-spin-slow-static opacity-30" viewBox="0 0 400 400">
                                <circle cx="200" cy="200" r="140" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="10 10" />
                            </svg>

                            {/* Nodes */}
                            <div className="absolute top-0 transform -translate-y-4 animate-float">
                                <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg text-center w-64">
                                    <h4 className="font-bold text-red-600 mb-1">Soluzione su Misura</h4>
                                    <p className="text-sm text-gray-600">Per gli Atleti</p>
                                </div>
                            </div>

                            <div className="absolute bottom-10 left-0 transform -translate-x-4 animate-float" style={{ animationDelay: '0.5s' }}>
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-lg text-center w-64">
                                    <h4 className="font-bold text-amber-600 mb-1">Zero Costi Marketing</h4>
                                    <p className="text-sm text-gray-600">Per i Trainer</p>
                                </div>
                            </div>

                            <div className="absolute bottom-10 right-0 transform translate-x-4 animate-float" style={{ animationDelay: '1s' }}>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-lg text-center w-64">
                                    <h4 className="font-bold text-blue-600 mb-1">Asset Monetization</h4>
                                    <p className="text-sm text-gray-600">Per le Strutture</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SlideContainer>

                {/* SLIDE 4: DEEP DIVE INTERATTIVO */}
                <DeepDiveSlide active={currentSlide === 3} />

                {/* SLIDE 5: SIMULAZIONE (USE CASE) */}
                <SimulationSlide active={currentSlide === 4} />

                {/* SLIDE 6: CONCLUSIONE */}
                <SlideContainer active={currentSlide === 5} className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="mb-8">
                            <TrendingUp size={64} className="mx-auto text-green-400 mb-4" />
                            <h2 className="text-5xl font-bold mb-6">Il Futuro del Fitness è Connesso.</h2>
                            <p className="text-xl text-gray-300 mb-12">
                                Abbiamo la tecnologia. Abbiamo la visione. <br />
                                Ora stiamo costruendo l'ecosistema definitivo.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold mb-4">Prossimi Step</h3>
                            <div className="flex flex-col md:flex-row justify-center gap-6 text-left">
                                <div className="flex items-center">
                                    <CheckCircle className="text-green-400 mr-3" />
                                    <span>Sviluppo MVP (Completato)</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="text-blue-400 mr-3" />
                                    <span>Beta Testing Strutture (Q3)</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="text-purple-400 mr-3" />
                                    <span>Lancio Nazionale (Q4)</span>
                                </div>
                            </div>
                        </div>

                        <button className="mt-12 bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all transform hover:-translate-y-1">
                            Unisciti all'Ecosistema
                        </button>
                    </div>
                </SlideContainer>

            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 right-8 flex space-x-4 z-50">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={`p-4 rounded-full bg-white shadow-lg transition-all ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 text-blue-600'}`}
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    disabled={currentSlide === totalSlides - 1}
                    className={`p-4 rounded-full bg-blue-600 text-white shadow-lg transition-all ${currentSlide === totalSlides - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
        </div>
    );
}
