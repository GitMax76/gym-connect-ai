import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import RoleSelector from '@/components/RoleSelector';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import GymRegistrationForm from '@/components/GymRegistrationForm';
import TrainerRegistrationForm from '@/components/TrainerRegistrationForm';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { UserRegistrationData, TrainerRegistrationData, GymRegistrationData } from '@/schemas/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

const RegisterPage = () => {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<'user' | 'instructor' | 'gym' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { profile, createUserProfile, createTrainerProfile, createGymProfile, loading } = useProfile();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { brandNameFull } = useBranding();

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
            title: t('register.missing_data'),
            description: t('register.missing_credentials'),
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
          setIsSubmitting(false);
          return;
        }

        currentUserId = authData.user.id;

        if (!authData.session) {
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
            availability_schedule: { slots: trainerData.availability } 
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
        // Safe stringification to prevent circular reference HTMLInputElement fiber crashes
        const errorMsg = error?.message || (typeof error === 'string' ? error : (error?.error || String(error)));
        toast({
          title: t('register.unhandled_error'),
          description: t('register.error_saving') + errorMsg,
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
          welcomeMessage = `🎉 Welcome to ${brandNameFull}!`;
          description = "Your athlete profile has been created. Get ready to find your perfect fitness match!";
          break;
        case 'instructor':
          welcomeMessage = "💪 Welcome Coach!";
          description = "Your trainer profile is active. Start building your client network today!";
          break;
        case 'gym':
          welcomeMessage = "🏢 Gym Registered!";
          description = `Your gym is now part of the ${brandNameFull} network. Attract new members and optimize schedules!`;
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
        title: t('register.unhandled_error'),
        description: t('register.error_generic'),
        variant: "destructive"
      });
      setIsSubmitting(false); 
    }
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole('');
    navigate('/register');
  };

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {step === 'role' ? (
            <div className="text-center mb-12 animate-fade-in max-w-3xl mx-auto">
              <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 mb-4 uppercase tracking-wider">
                {brandNameFull}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-none mb-6">
                {t('register.transform_passion').split('\n')[0]}
                <span className="block bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  {t('register.transform_passion').split('\n')[1] || ''}
                </span>
              </h1>
              <p className="text-base text-slate-500 mb-6 leading-relaxed">
                {t('register.revolution_desc')}
              </p>
              <p className="text-sm text-indigo-600 font-semibold mb-8">
                {t('register.professionals_connected')}
              </p>

              <div className="mb-12 bg-white rounded-xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
                <p className="text-slate-400 text-sm mb-3 font-medium">{t('register.already_have_account')}</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')} 
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 w-full transition-all active:scale-98 font-semibold"
                >
                  {t('register.login_here')}
                </Button>
              </div>

              <RoleSelector onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
            </div>
          ) : (
            <div className="animate-slide-up">
              <ErrorBoundary>
                {selectedRole === 'user' && (
                  <UserRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} isSubmitting={isSubmitting} />
                )}
                {selectedRole === 'instructor' && (
                  <TrainerRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} isSubmitting={isSubmitting} />
                )}
                {selectedRole === 'gym' && (
                  <GymRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} isSubmitting={isSubmitting} />
                )}
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;

