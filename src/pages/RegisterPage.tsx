import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, createUserProfile, createTrainerProfile, createGymProfile, loading } = useProfile();

  useEffect(() => {
    // if (!user) {
    //   navigate('/auth');
    //   return;
    // }

    // Se l'utente ha già completato la profilazione, vai alla dashboard
    if (profile?.user_type && (profile.first_name || profile.last_name)) {
      navigate('/dashboard');
      return;
    }

    // Se l'utente ha già un tipo ma non ha completato il profilo, vai direttamente al form
    if (profile?.user_type) {
      const roleMapping = {
        'user': 'user',
        'trainer': 'instructor',
        'gym_owner': 'gym'
      } as const;

      setSelectedRole(roleMapping[profile.user_type]);
      setStep('form');
    }
  }, [user, profile, navigate, loading]);

  const handleRoleSelect = async (role: 'user' | 'instructor' | 'gym') => {
    const userType = role === 'instructor' ? 'trainer' : role === 'gym' ? 'gym_owner' : 'user';

    // Update the base profile with the selected user type
    const { error } = await updateProfile({ user_type: userType });

    if (error) {
      toast({
        title: "Errore",
        description: "Errore nel salvare il tipo di utente",
        variant: "destructive"
      });
      return;
    }

    setSelectedRole(role);
    setStep('form');
  };

  const handleFormSubmit = async (data: any) => {
    console.log('Registration data:', { role: selectedRole, ...data });

    try {
      let error = null;

      switch (selectedRole) {
        case 'user':
          const userData = data as UserRegistrationData;
          // Transform form data to match database schema
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

          const userResult = await createUserProfile(userProfileData);
          error = userResult.error;
          break;

        case 'instructor':
          const trainerData = data as TrainerRegistrationData;
          // Transform form data to match database schema
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

          const trainerResult = await createTrainerProfile(trainerProfileData);
          error = trainerResult.error;
          break;

        case 'gym':
          const gymData = data as GymRegistrationData;
          // Transform form data to match database schema
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

          const gymResult = await createGymProfile(gymProfileData);
          error = gymResult.error;
          break;
      }

      if (error) {
        toast({
          title: "Errore",
          description: "Errore nel salvare il profilo",
          variant: "destructive"
        });
        return;
      }

      // Update base profile with additional info
      // Handle the diversity of data keys safely
      const firstName = 'firstName' in data ? data.firstName :
        'ownerName' in data ? data.ownerName :
          'name' in data ? data.name?.split(' ')[0] : '';

      const lastName = 'lastName' in data ? data.lastName :
        'name' in data ? data.name?.split(' ').slice(1).join(' ') : '';

      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone: data.phone,
        city: data.city || data.location // Use location for user if city not present
      });

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
        title: "Errore",
        description: "Errore durante la registrazione",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole('');
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
              <p className="text-lg text-green-600 font-medium mb-12">
                ✨ Oltre 10.000 professionisti già connessi ✨
              </p>
              <RoleSelector onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
            </div>
          ) : (
            <div className="animate-slide-up">
              {selectedRole === 'user' && (
                <UserRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} />
              )}
              {selectedRole === 'instructor' && (
                <TrainerRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} />
              )}
              {selectedRole === 'gym' && (
                <GymRegistrationForm onSubmit={handleFormSubmit} onBack={handleBack} />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;

