
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import RoleSelector from '@/components/RoleSelector';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import TrainerRegistrationForm from '@/components/TrainerRegistrationForm';
import GymRegistrationForm from '@/components/GymRegistrationForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

type Role = 'user' | 'instructor' | 'gym' | '';

const AuthPage = () => {
  const location = useLocation();
  const [step, setStep] = useState<'select-role' | 'register'>('select-role');
  const [selectedRole, setSelectedRole] = useState<Role>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const { updateProfile, createUserProfile, createTrainerProfile, createGymProfile } = useProfile();
  const [loading, setLoading] = useState(false);

  // Check for role in URL on mount
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get('role');
    if (roleParam && (roleParam === 'user' || roleParam === 'instructor' || roleParam === 'gym')) {
      setSelectedRole(roleParam as Role);
      setStep('register');
    }
  }, [location]);

  // Step 1: handle role select
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep('register');
  };

  // Handle going back to role selection
  const handleBack = () => {
    setStep('select-role');
    setSelectedRole('');
  };

  // Step 2: handle registration depending on selected role
  const handleRegister = async (data: any) => {
    setLoading(true);

    try {
      let userType = selectedRole === 'instructor' ? 'trainer'
        : selectedRole === 'gym' ? 'gym_owner'
          : 'user';

      // 1. Creazione utente (Supabase signUp)
      const { data: authData, error } = await signUp(
        data.email,
        data.password,
        {
          first_name: data.firstName || data.ownerName || data.name?.split(' ')[0],
          last_name: data.lastName || data.name?.split(' ').slice(1).join(' '),
          user_type: userType as 'user' | 'trainer' | 'gym_owner'
        }
      );

      if (error) {
        toast({
          title: "Errore durante la registrazione",
          description: error.message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Check if email confirmation is required (session is null)
      if (authData.user && !authData.session) {
        toast({
          title: "Registrazione avvenuta!",
          description: "Controlla la tua email per confermare l'account prima di accedere.",
          variant: "default",
          duration: 6000
        });
        navigate('/'); // Redirect to home/login
        setLoading(false);
        return;
      }

      const newUserId = authData.user?.id;
      if (!newUserId) {
        throw new Error("ID utente non ricevuto dopo la registrazione");
      }

      // 2. Aggiorna il profilo di base
      await updateProfile({
        first_name: data.firstName || data.ownerName || data.name?.split(' ')[0],
        last_name: data.lastName || data.name?.split(' ').slice(1).join(' '),
        phone: data.phone,
        city: data.city,
        user_type: userType as 'user' | 'trainer' | 'gym_owner'
      }, newUserId);

      // 3. Crea il profilo specifico del tipo utente
      let errorProfile = null;
      if (selectedRole === 'user') {
        const userProfileData = {
          age: data.age ? parseInt(data.age) : undefined,
          weight: data.weight ? parseFloat(data.weight) : undefined,
          height: data.height ? parseInt(data.height) : undefined,
          fitness_level: data.fitnessLevel,
          primary_goal: data.goals,
          availability_hours_per_week: getHoursFromAvailability(data.availability),
          budget_min: getBudgetRange(data.budget).min,
          budget_max: getBudgetRange(data.budget).max,
          preferred_location: data.location,
          health_conditions: data.healthConditions,
          experience_description: data.goals
        };
        const result = await createUserProfile(userProfileData, newUserId);
        errorProfile = result.error;
      } else if (selectedRole === 'instructor') {
        const trainerProfileData = {
          date_of_birth: data.dateOfBirth,
          bio: data.bio,
          certifications: data.certifications,
          specializations: data.specializations,
          years_experience: data.experience ? parseInt(data.experience) : undefined,
          languages: data.languages,
          personal_rate_per_hour: data.personalRate ? parseFloat(data.personalRate) : undefined,
          group_rate_per_hour: data.groupRate ? parseFloat(data.groupRate) : undefined,
          preferred_areas: data.preferredAreas,
          availability_schedule: { slots: data.availability }
        };
        const result = await createTrainerProfile(trainerProfileData, newUserId);
        errorProfile = result.error;
      } else if (selectedRole === 'gym') {
        const gymProfileData = {
          gym_name: data.gymName,
          business_email: data.email,
          address: data.address,
          city: data.city,
          postal_code: data.postalCode,
          description: data.description,
          facilities: data.facilities,
          specializations: data.specializations,
          opening_days: data.openingDays,
          opening_hours: data.openingHours,
          closing_hours: data.closingHours,
          member_capacity: data.memberCapacity ? parseInt(data.memberCapacity) : undefined,
          subscription_plans: data.subscriptionPlans as any
        };
        const result = await createGymProfile(gymProfileData, newUserId);
        errorProfile = result.error;
      }

      if (errorProfile) {
        console.error("Profile creation error:", errorProfile);
        toast({
          title: "Attenzione",
          description: "Profilo creato parzialmente. Potrai completare i dati nella dashboard.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Benvenuto!",
          description: "Registrazione completata con successo.",
          variant: "default"
        });
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Errore imprevisto",
        description: err.message || "Riprova più tardi.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  // Google (opzionale, potenzia solo l'accesso base senza profilazione avanzata)
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  // helper
  const getHoursFromAvailability = (availability: string) => {
    const mapping: { [key: string]: number } = {
      '1-2-hours': 1.5,
      '3-4-hours': 3.5,
      '5-6-hours': 5.5,
      '7-plus-hours': 8
    };
    return mapping[availability] || 0;
  };
  const getBudgetRange = (budget: string) => {
    const mapping: { [key: string]: { min: number, max: number } } = {
      '50-100': { min: 50, max: 100 },
      '100-200': { min: 100, max: 200 },
      '200-300': { min: 200, max: 300 },
      '300-plus': { min: 300, max: 500 }
    };
    return mapping[budget] || { min: 0, max: 100 };
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center py-12">
        <div className="max-w-4xl w-full mx-auto px-4">
          {step === 'select-role' ? (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Scegli il tuo profilo
              </h1>
              <p className="text-xl text-slate-600 mb-2">
                Prima di completare la registrazione, seleziona il tipo di account che desideri creare
              </p>
              <p className="text-lg text-green-600 font-medium mb-8">
                Potrai modificare questa scelta in seguito nelle impostazioni del profilo
              </p>
              <RoleSelector onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
            </div>
          ) : (
            <div>
              {/* Mostra il form relativo */}
              {selectedRole === 'user' && (
                <UserRegistrationForm onSubmit={handleRegister} onBack={handleBack} />
              )}
              {selectedRole === 'instructor' && (
                <TrainerRegistrationForm onSubmit={handleRegister} onBack={handleBack} />
              )}
              {selectedRole === 'gym' && (
                <GymRegistrationForm onSubmit={handleRegister} onBack={handleBack} />
              )}
              <div className="text-center mt-6">
                <button
                  className="text-slate-600 underline text-sm"
                  onClick={handleBack}
                >
                  ← Torna alla selezione profilo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
