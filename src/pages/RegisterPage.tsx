import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import RoleSelector from '@/components/RoleSelector';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import GymRegistrationForm from '@/components/GymRegistrationForm';
import TrainerRegistrationForm from '@/components/TrainerRegistrationForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { UserRegistrationData, TrainerRegistrationData, GymRegistrationData } from '@/schemas/auth';

const RegisterPage = () => {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<'user' | 'instructor' | 'gym' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { profile, createUserProfile, createTrainerProfile, createGymProfile, loading } = useProfile();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check URL parameters first
    const roleParam = searchParams.get('role');
    if (roleParam && ['user', 'instructor', 'gym'].includes(roleParam)) {
      setSelectedRole(roleParam as 'user' | 'instructor' | 'gym');
      setStep('form');
      return;
    }

    // Redirect to dashboard if profile is fully complete
    if (user && profile?.user_type && (profile.first_name || profile.last_name)) {
      navigate('/dashboard');
      return;
    }

    // This block might be annoying if users want to create a new role? 
    // But for now keeping logic: if user has a type but incomplete profile, send to form.
    if (user && profile?.user_type && !profile.first_name) {
      const roleMapping = {
        'user': 'user',
        'trainer': 'instructor',
        'gym_owner': 'gym'
      } as const;

      // Only force if matches valid roles
      if (profile.user_type in roleMapping) {
        setSelectedRole(roleMapping[profile.user_type as keyof typeof roleMapping]);
        setStep('form');
      }
    }
  }, [user, profile, navigate, loading, searchParams]);

  const handleRoleSelect = (role: 'user' | 'instructor' | 'gym') => {
    setSelectedRole(role);
    setStep('form');
    // We do NOT save to DB yet. We wait for registration form submission.
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    console.log('Registration data:', { role: selectedRole, ...data });
    let currentUserId = user?.id;

    try {
      // 1. If no user, Sign Up first
      if (!currentUserId) {
        if (!data.email || !data.password) {
          toast({
            title: "Dati mancanti",
            description: "Email e Password sono richiesti per la registrazione.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }

        const userTypeMap = {
          'user': 'user',
          'instructor': 'trainer',
          'gym': 'gym_owner'
        };

        // Prepare metadata for the trigger to create initial profile
        const metadata = {
          user_type: userTypeMap[selectedRole],
          first_name: data.firstName || data.name?.split(' ')[0] || data.ownerName || '',
          last_name: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
        };

        const { data: authData, error: authError } = await signUp(data.email, data.password, metadata);

        if (authError || !authData?.user) {
          // Error is already toasted in signUp check if needed? 
          // signUp function in AuthContext toasts on error.
          setIsSubmitting(false);
          return;
        }

        currentUserId = authData.user.id;

        // If session is null (email verification required), we stop here?
        // We can try to create profile, but RLS might block.
        if (!authData.session) {
          // We can't proceed with profile creation without a session usually
          // But the Trigger likely created the basic profile row.
          // We return, as we can't complete the secondary profile tables.
          // toast in signUp likely already said "Check email".
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Create Specific Role Profile
      let error = null;
      let result = null;

      switch (selectedRole) {
        case 'user':
          const userData = data as UserRegistrationData;
          const userProfileData = {
            age: userData.age,
            weight: userData.weight,
            height: userData.height,
            fitness_level: userData.fitnessLevel,
            primary_goal: userData.goals,
            availability_hours_per_week: getHoursFromAvailability(userData.availability),
            budget_min: getBudgetRange(userData.budget).min,
            budget_max: getBudgetRange(userData.budget).max,
            preferred_location: userData.location,
            health_conditions: userData.healthConditions,
            experience_description: userData.goals
          };
          // Pass currentUserId explicitly
          result = await createUserProfile(userProfileData, currentUserId);
          break;

        case 'instructor':
          const trainerData = data as TrainerRegistrationData;
          const trainerProfileData = {
            date_of_birth: trainerData.dateOfBirth,
            bio: trainerData.bio,
            certifications: trainerData.certifications,
            specializations: trainerData.specializations,
            years_experience: trainerData.experience,
            languages: trainerData.languages,
            personal_rate_per_hour: trainerData.personalRate,
            group_rate_per_hour: trainerData.groupRate,
            preferred_areas: trainerData.preferredAreas,
            availability_schedule: { slots: trainerData.availability } // Wrap in object as expected by schema
          };
          result = await createTrainerProfile(trainerProfileData, currentUserId);
          break;

        case 'gym':
          const gymData = data as GymRegistrationData;
          const gymProfileData = {
            gym_name: gymData.gymName,
            business_email: gymData.email,
            address: gymData.address,
            city: gymData.city,
            postal_code: gymData.postalCode,
            description: gymData.description,
            facilities: gymData.facilities,
            specializations: gymData.specializations,
            opening_days: gymData.openingDays,
            opening_hours: gymData.openingHours,
            closing_hours: gymData.closingHours,
            member_capacity: gymData.memberCapacity,
            subscription_plans: gymData.subscriptionPlans as any
          };
          result = await createGymProfile(gymProfileData, currentUserId);
          break;
      }

      error = result?.error;

      if (error) {
        toast({
          title: "Errore",
          description: "Errore nel salvare il profilo: " + (typeof error === 'string' ? error : JSON.stringify(error)),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // 3. Success Feedback
      let welcomeMessage = '';
      let description = '';

      switch (selectedRole) {
        case 'user':
          welcomeMessage = "🎉 Benvenuto in GymConnect AI!";
          description = "Il tuo profilo atleta è stato creato. Preparati a scoprire il tuo match perfetto nel mondo del fitness!";
          break;
        case 'instructor':
          welcomeMessage = "💪 Benvenuto Coach!";
          description = "Il tuo profilo trainer è stato attivato. Inizia a costruire la tua community di atleti motivati!";
          break;
        case 'gym':
          welcomeMessage = "🏢 Palestra Registrata!";
          description = "La tua struttura è ora parte del network GymConnect. Attrai nuovi membri e ottimizza la gestione!";
          break;
      }

      toast({
        title: welcomeMessage,
        description: description,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      toast({
        title: "Errore Non Gestito",
        description: "Errore durante la registrazione",
        variant: "destructive"
      });
      setIsSubmitting(false); // Added setIsSubmitting(false) here
    }
  };

  const handleBack = () => {
    // If URL has param, maybe go home? But simple back to role is fine
    setStep('role');
    setSelectedRole('');
    // Optional: Clear URL param?
    navigate('/register');
  };

  // Helper functions
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'role' ? (
            <div className="text-center mb-12 animate-fade-in">
              <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
                GymConnect AI
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Trasforma la Tua
                <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-orange-500 bg-clip-text text-transparent">
                  Passione Fitness
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-4 max-w-4xl mx-auto leading-relaxed">
                Unisciti alla rivoluzione del fitness intelligente. Scegli il tuo ruolo e inizia a creare
                connessioni autentiche nel mondo del benessere e della forma fisica.
              </p>
              <p className="text-lg text-green-600 font-medium mb-8">
                ✨ Oltre 10.000 professionisti già connessi ✨
              </p>

              <div className="mb-12">
                <p className="text-slate-500 mb-2">Hai già un account?</p>
                <Button variant="outline" onClick={() => navigate('/login')} className="border-green-600 text-green-700 hover:bg-green-50">
                  Accedi qui
                </Button>
              </div>

              <RoleSelector onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
            </div>
          ) : (
            <div className="animate-slide-up">
              {selectedRole === 'user' && (
                <UserRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} isSubmitting={isSubmitting} />
              )}
              {selectedRole === 'instructor' && (
                <TrainerRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} isSubmitting={isSubmitting} />
              )}
              {selectedRole === 'gym' && (
                <GymRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} isSubmitting={isSubmitting} />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;

