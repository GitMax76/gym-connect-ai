
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

const RegisterPage = () => {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<'user' | 'instructor' | 'gym' | ''>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, createUserProfile, createTrainerProfile, createGymProfile } = useProfile();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // If user already has a profile with user_type, redirect to dashboard
    if (profile?.user_type) {
      navigate('/dashboard');
    }
  }, [user, profile, navigate]);

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
          // Transform form data to match database schema
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
          
          const userResult = await createUserProfile(userProfileData);
          error = userResult.error;
          break;

        case 'instructor':
          // Transform form data to match database schema
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
          
          const trainerResult = await createTrainerProfile(trainerProfileData);
          error = trainerResult.error;
          break;

        case 'gym':
          // Transform form data to match database schema
          const gymProfileData = {
            gym_name: data.gymName,
            business_email: data.email,
            address: data.address,
            postal_code: data.postalCode,
            description: data.description,
            facilities: data.facilities,
            specializations: data.specializations,
            opening_hours: data.openingHours,
            closing_hours: data.closingHours,
            member_capacity: data.memberCapacity ? parseInt(data.memberCapacity) : undefined,
            monthly_fee: data.monthlyFee ? parseFloat(data.monthlyFee) : undefined,
            day_pass_fee: data.dayPassFee ? parseFloat(data.dayPassFee) : undefined
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
      await updateProfile({
        first_name: data.firstName || data.ownerName || data.name?.split(' ')[0],
        last_name: data.lastName || data.name?.split(' ').slice(1).join(' '),
        phone: data.phone,
        city: data.city
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'role' ? (
            <div className="text-center mb-12 animate-fade-in">
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
