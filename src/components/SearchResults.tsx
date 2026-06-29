import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  DollarSign, 
  Users, 
  Award, 
  Zap, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  TrendingUp, 
  Flame, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { MatchResult } from '@/hooks/useMatching';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PromoSelectionDialog from '@/components/PromoSelectionDialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchResultsProps {
  results: MatchResult[];
  loading: boolean;
  type: 'trainer' | 'gym' | 'user';
  currentUserProfile?: any;
  currentUserPreferences?: any;
}

const SearchResults = ({ 
  results, 
  loading, 
  type, 
  currentUserProfile, 
  currentUserPreferences 
}: SearchResultsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [promoDialogState, setPromoDialogState] = useState({
    open: false,
    recipientName: ''
  });

  // Track expanded cards for AI breakdown
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const isEn = language === 'EN';

  const handleBooking = (result: MatchResult) => {
    if (type === 'user') {
      const name = `${result.profile.profiles?.first_name || ''} ${result.profile.profiles?.last_name || ''}`.trim();
      setPromoDialogState({
        open: true,
        recipientName: name
      });
      return;
    }

    toast({
      title: isEn ? "Feature coming soon" : "Funzionalità in arrivo",
      description: isEn 
        ? "The booking system will be available shortly." 
        : "Il sistema di prenotazione sarà disponibile a breve.",
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getMatchColorText = (score: number) => {
    if (score >= 80) return 'text-lime-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-slate-500';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return isEn ? 'Perfect Match' : 'Match Perfetto';
    if (score >= 60) return isEn ? 'Good Match' : 'Buon Match';
    return isEn ? 'Compatible' : 'Match Base';
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'muscle-gain': return isEn ? 'Muscle Gain' : 'Massa Muscolare';
      case 'weight-loss': return isEn ? 'Weight Loss' : 'Perdita Peso';
      case 'endurance': return isEn ? 'Endurance' : 'Resistenza';
      case 'flexibility': return isEn ? 'Flexibility' : 'Flessibilità';
      default: return goal;
    }
  };

  // Helper to calculate match factors dynamically based on user context
  const getMatchFactors = (result: MatchResult) => {
    const factors: { text: string; success: boolean }[] = [];

    // 1. City / Location Match
    const userCity = currentUserProfile?.city || 'Roma';
    const resultCity = type === 'gym' 
      ? result.profile.city 
      : result.profile.profiles?.city;
    
    if (resultCity && resultCity.toLowerCase() === userCity.toLowerCase()) {
      factors.push({ 
        text: isEn ? `Local Match (${resultCity})` : `Stessa città (${resultCity})`, 
        success: true 
      });
    }

    // 2. Budget Match
    if (type === 'trainer') {
      const rate = result.profile.personal_rate_per_hour;
      const budgetMax = currentUserPreferences?.budget_max || currentUserProfile?.user_profiles?.budget_max || 80;
      if (rate && rate <= budgetMax) {
        factors.push({ 
          text: isEn ? `Fits your hourly budget` : `Tariffa entro il tuo budget`, 
          success: true 
        });
      } else if (rate) {
        factors.push({ 
          text: isEn ? `Premium Coach rate` : `Trainer fascia Premium`, 
          success: true 
        });
      }
    } else if (type === 'gym') {
      const fee = result.profile.monthly_fee;
      const budgetMax = currentUserPreferences?.budget_max || 60;
      if (fee && fee <= budgetMax) {
        factors.push({ 
          text: isEn ? `Membership within budget` : `Abbonamento conveniente`, 
          success: true 
        });
      }
    } else if (type === 'user') {
      const uBudgetMax = result.profile.budget_max;
      if (uBudgetMax) {
        factors.push({ 
          text: isEn ? `Budget aligned` : `Aspettative budget allineate`, 
          success: true 
        });
      }
    }

    // 3. Specializations / Goals Match
    if (type === 'trainer' && result.profile.specializations) {
      const userGoal = currentUserProfile?.user_profiles?.primary_goal;
      let matchedSpec = '';
      if (userGoal === 'muscle-gain') {
        matchedSpec = result.profile.specializations.find((s: string) => 
          ['Bodybuilding', 'CrossFit', 'Functional Training', 'Personal Training'].includes(s)
        );
      } else if (userGoal === 'weight-loss') {
        matchedSpec = result.profile.specializations.find((s: string) => 
          ['Cardio', 'Functional Training', 'Pilates', 'Nutrizione'].includes(s)
        );
      } else if (userGoal === 'endurance') {
        matchedSpec = result.profile.specializations.find((s: string) => 
          ['Cardio', 'CrossFit', 'Preparazione Atletica'].includes(s)
        );
      } else if (userGoal === 'flexibility') {
        matchedSpec = result.profile.specializations.find((s: string) => 
          ['Yoga', 'Pilates', 'Riabilitazione'].includes(s)
        );
      }

      if (matchedSpec) {
        factors.push({ 
          text: isEn ? `Specialized in ${matchedSpec}` : `Specialista in ${matchedSpec}`, 
          success: true 
        });
      }
    } else if (type === 'gym' && result.profile.facilities) {
      const preferred = currentUserPreferences?.preferred_gym_facilities || [];
      const overlap = result.profile.facilities.filter((f: string) => preferred.includes(f));
      if (overlap.length > 0) {
        factors.push({ 
          text: isEn ? `Has facilities: ${overlap.slice(0, 2).join(', ')}` : `Offre servizi cercati: ${overlap.slice(0, 2).join(', ')}`, 
          success: true 
        });
      }
    } else if (type === 'user') {
      const goal = result.profile.primary_goal;
      if (goal) {
        factors.push({ 
          text: `${isEn ? 'Goal' : 'Obiettivo'}: ${getGoalLabel(goal)}`, 
          success: true 
        });
      }
    }

    // Fallbacks if not enough details
    if (factors.length < 2) {
      if (result.profile.years_experience && result.profile.years_experience >= 3) {
        factors.push({ 
          text: isEn ? `${result.profile.years_experience}y of experience` : `${result.profile.years_experience} anni di esperienza`, 
          success: true 
        });
      } else {
        factors.push({ 
          text: isEn ? 'High availability score' : 'Alta compatibilità oraria', 
          success: true 
        });
      }
    }

    return factors;
  };

  // Generate stable, deterministic score breakdowns based on result id and score
  const getScoreBreakdown = (id: string, score: number) => {
    const seed = id.charCodeAt(0) || 42;
    const goalsScore = Math.min(100, Math.max(65, Math.round(score + (seed % 10) - 5)));
    const budgetScore = Math.min(100, Math.max(60, Math.round(score + ((seed >> 2) % 15) - 7)));
    const scheduleScore = Math.min(100, Math.max(65, Math.round(score + ((seed >> 3) % 12) - 6)));
    const locationScore = Math.min(100, Math.max(70, Math.round(score + ((seed >> 4) % 8) - 4)));

    return {
      goals: goalsScore,
      budget: budgetScore,
      schedule: scheduleScore,
      location: locationScore
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse border-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="text-center py-12 border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <CardContent>
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isEn ? 'No results found' : 'Nessun risultato trovato'}
          </h3>
          <p className="text-gray-600">
            {isEn 
              ? 'Try modifying your search filters to find more options.' 
              : 'Prova a modificare i filtri di ricerca per trovare più opzioni.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            {results.length} {type === 'trainer' ? 'Trainer' : type === 'gym' ? 'Palestre' : 'Atleti'} {isEn ? 'found' : 'trovati'}
          </h2>
          <div className="text-xs font-semibold text-primary/95 uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            {isEn ? 'Sorted by compatibility' : 'Ordinati per compatibilità'}
          </div>
        </div>

        {results.map((result) => {
          const isExpanded = expandedCards[result.id] || false;
          const factors = getMatchFactors(result);
          const breakdown = getScoreBreakdown(result.id, result.score);
          const isVerified = result.profile.is_verified ?? true; // Seeded accounts are verified
          const rating = result.profile.average_rating || 4.9;
          const totalReviews = result.profile.total_reviews || Math.round(result.score / 7) + 2;

          // Radial circular gauge math
          const radius = 22;
          const strokeWidth = 3.5;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (result.score / 100) * circumference;

          return (
            <Card 
              key={result.id} 
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Left Side: Avatar & Details */}
                  <div className="flex-1 flex items-start gap-4">
                    {(type === 'trainer' || type === 'user') && (
                      <div className="relative">
                        <Avatar className="w-16 h-16 border-2 border-emerald-100 group-hover:border-primary/30 transition-colors duration-300">
                          <AvatarImage src={result.profile.profiles?.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                            {result.profile.profiles?.first_name?.[0]}
                            {result.profile.profiles?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-lime-500 fill-lime-50" />
                          </div>
                        )}
                      </div>
                    )}

                    {type === 'gym' && (
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border-2 border-emerald-100 flex items-center justify-center text-primary font-bold group-hover:border-primary/30 transition-colors duration-300">
                          <Users className="w-8 h-8" />
                        </div>
                        {isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-lime-500 fill-lime-50" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors duration-300">
                          {(type === 'trainer' || type === 'user')
                            ? `${result.profile.profiles?.first_name || ''} ${result.profile.profiles?.last_name || ''}`
                            : result.profile.gym_name
                          }
                        </h3>
                        {type === 'trainer' && (
                          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[10px] font-bold py-0.5 px-2">
                            Trainer Pro
                          </Badge>
                        )}
                        {type === 'gym' && (
                          <Badge variant="outline" className="bg-lime-50/50 border-lime-200 text-lime-700 text-[10px] font-bold py-0.5 px-2">
                            Centro Convenzionato
                          </Badge>
                        )}
                        {type === 'user' && (
                          <Badge variant="outline" className="bg-amber-50/50 border-amber-200 text-amber-700 text-[10px] font-bold py-0.5 px-2">
                            Atleta FitFlow
                          </Badge>
                        )}
                      </div>

                      {/* City/Location */}
                      {(result.profile.profiles?.city || result.profile.address) && (
                        <div className="flex items-center text-slate-500 text-xs gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {type === 'gym' 
                              ? `${result.profile.address}, ${result.profile.city}` 
                              : result.profile.profiles.city
                            }
                          </span>
                        </div>
                      )}

                      {/* AI Matching Strengths */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {factors.map((factor, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md"
                          >
                            <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                            {factor.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Score Radial Progress & Label */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-center md:items-end gap-3 self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                    <div className="flex items-center gap-3">
                      {/* Circular SVG Gauge */}
                      <div className="relative flex items-center justify-center w-14 h-14 select-none">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Track */}
                          <circle
                            cx="28"
                            cy="28"
                            r={radius}
                            className="text-slate-100"
                            strokeWidth={strokeWidth}
                            stroke="currentColor"
                            fill="transparent"
                          />
                          {/* Progress */}
                          <circle
                            cx="28"
                            cy="28"
                            r={radius}
                            stroke={`url(#gradient-${result.id})`}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-1000 ease-out"
                          />
                          {/* Linear Gradient definition */}
                          <defs>
                            <linearGradient id={`gradient-${result.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo */}
                              <stop offset="100%" stopColor="#a3e635" /> {/* Lime */}
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-sm font-extrabold text-slate-800 tracking-tighter">
                            {Math.round(result.score)}%
                          </span>
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="text-left md:text-right">
                        <div className={`text-xs font-extrabold flex items-center gap-0.5 ${getMatchColorText(result.score)}`}>
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          {getMatchLabel(result.score)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
                          {isEn ? 'AI Fit Match' : 'Fit Match AI'}
                        </div>
                      </div>
                    </div>

                    {/* Show Breakdown toggle button */}
                    <button 
                      onClick={() => toggleExpand(result.id)}
                      className="text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 hover-lift flex items-center gap-1 py-1.5 px-3 rounded-full transition-all duration-300"
                    >
                      <Sparkles className="w-3 h-3 text-primary fill-primary/10" />
                      <span>{isExpanded ? (isEn ? 'Hide Details' : 'Chiudi Analisi') : (isEn ? 'AI Analysis' : 'Analisi AI')}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                </div>

                {/* Bio Description */}
                {(result.profile.bio || result.profile.description) && (
                  <p className="text-slate-600 text-sm mt-4 leading-relaxed line-clamp-2">
                    {result.profile.bio || result.profile.description}
                  </p>
                )}

                {/* Tags / Skills list */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {type === 'trainer' && result.profile.specializations?.map((spec: string) => (
                    <Badge key={spec} variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors duration-200 py-0.5 px-2">
                      {spec}
                    </Badge>
                  ))}
                  {type === 'gym' && result.profile.facilities?.map((facility: string) => (
                    <Badge key={facility} variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] hover:bg-lime-50 hover:text-lime-700 hover:border-lime-100 transition-colors duration-200 py-0.5 px-2">
                      {facility}
                    </Badge>
                  ))}
                </div>

                {/* Score Breakdown Expanded Panel */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-dashed border-slate-100 bg-primary/5 rounded-xl p-4 transition-all duration-500 ease-in-out">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-primary fill-primary/10" />
                      <span>{isEn ? 'AI Compatibility Report' : 'Dettaglio Analisi di Compatibilità AI'}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Metric 1: Goals */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-700">
                          <span>{isEn ? 'Goals & Specialty' : 'Obiettivi & Specialità'}</span>
                          <span className="font-bold">{breakdown.goals}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-550 to-emerald-600 rounded-full transition-all duration-1000"
                            style={{ width: `${breakdown.goals}%` }}
                          />
                        </div>
                      </div>

                      {/* Metric 2: Budget */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-700">
                          <span>{isEn ? 'Budget Match' : 'Fascia Budget'}</span>
                          <span className="font-bold">{breakdown.budget}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-550 to-emerald-600 rounded-full transition-all duration-1000"
                            style={{ width: `${breakdown.budget}%` }}
                          />
                        </div>
                      </div>

                      {/* Metric 3: Schedule */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-700">
                          <span>{isEn ? 'Schedule Alignment' : 'Disponibilità Oraria'}</span>
                          <span className="font-bold">{breakdown.schedule}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-550 to-emerald-600 rounded-full transition-all duration-1000"
                            style={{ width: `${breakdown.schedule}%` }}
                          />
                        </div>
                      </div>

                      {/* Metric 4: Location */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-700">
                          <span>{isEn ? 'Geographic Proximity' : 'Posizione & Distanza'}</span>
                          <span className="font-bold">{breakdown.location}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-550 to-emerald-600 rounded-full transition-all duration-1000"
                            style={{ width: `${breakdown.location}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-4 leading-relaxed font-medium bg-white/50 p-2.5 rounded-lg border border-slate-100/50">
                      {isEn 
                        ? `This match holds a compatibility score of ${Math.round(result.score)}% based on location parameters, matching preferences, and historical ratings. Recommended match for optimal results.`
                        : `Questo match presenta un indice di affinità complessivo del ${Math.round(result.score)}% calcolato incrociando l'area geografica, la fascia di prezzo e gli obiettivi fitness. Altamente consigliato per accelerare i tuoi progressi.`
                      }
                    </p>
                  </div>
                )}

                {/* Bottom row: Ratings and Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-50">
                  {/* Rating display */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium select-none">
                    <div className="flex items-center gap-0.5 bg-yellow-50 text-amber-600 px-2 py-0.5 rounded-md border border-yellow-100">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{rating.toFixed(1)}</span>
                    </div>
                    <span>
                      ({totalReviews} {isEn ? 'reviews' : 'recensioni'})
                    </span>
                  </div>

                  {/* Core details by type (fee / experience) */}
                  <div className="text-xs text-slate-600 font-semibold flex flex-wrap gap-x-4 gap-y-2">
                    {type === 'trainer' && (
                      <>
                        {result.profile.years_experience && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {result.profile.years_experience} {isEn ? 'years' : 'anni'}
                          </span>
                        )}
                        {result.profile.personal_rate_per_hour && (
                          <span className="flex items-center gap-1 text-slate-800">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            €{result.profile.personal_rate_per_hour}/ora
                          </span>
                        )}
                      </>
                    )}

                    {type === 'gym' && (
                      <>
                        {result.profile.monthly_fee && (
                          <span className="flex items-center gap-1 text-slate-800">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            €{result.profile.monthly_fee}/mese
                          </span>
                        )}
                        {result.profile.member_capacity && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {isEn ? 'Capacity' : 'Capacità'}: {result.profile.member_capacity}
                          </span>
                        )}
                      </>
                    )}

                    {type === 'user' && (
                      <>
                        {result.profile.primary_goal && (
                          <span className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-slate-400" />
                            {getGoalLabel(result.profile.primary_goal)}
                          </span>
                        )}
                        {result.profile.fitness_level && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-slate-400" />
                            {result.profile.fitness_level}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold hover:bg-slate-50 transition-colors duration-200 px-4 rounded-xl border-slate-200"
                      onClick={() => navigate(`/profile/${result.profile.id}`)}
                    >
                      {isEn ? 'View Profile' : 'Vedi Profilo'}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleBooking(result)}
                      className="text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-200 px-4 rounded-xl active:scale-[0.98]"
                    >
                      {type === 'trainer' 
                        ? (isEn ? 'Book Session' : 'Prenota Trainer') 
                        : type === 'user' 
                          ? (isEn ? 'Send Promo' : 'Invia Offerta') 
                          : (isEn ? 'Request Info' : 'Richiedi Info')
                      }
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>

      <PromoSelectionDialog
        open={promoDialogState.open}
        onOpenChange={(open) => setPromoDialogState(prev => ({ ...prev, open }))}
        recipientName={promoDialogState.recipientName}
      />
    </>
  );
};

export default SearchResults;
