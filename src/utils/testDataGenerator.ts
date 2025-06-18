
import { supabase } from '@/integrations/supabase/client';

export const generateTrainerTestData = async (userId: string, city: string = 'Milano') => {
  const trainerData = {
    bio: 'Personal trainer appassionato con esperienza nell\'aiutare i clienti a raggiungere i loro obiettivi di fitness.',
    specializations: ['Fitness Funzionale', 'Perdita Peso', 'Forza'],
    years_experience: Math.floor(Math.random() * 10) + 2,
    personal_rate_per_hour: 40 + Math.floor(Math.random() * 20),
    group_rate_per_hour: 25 + Math.floor(Math.random() * 15),
    certifications: ['ISSA Certified Personal Trainer'],
    languages: ['Italiano', 'Inglese'],
    is_verified: true
  };

  await supabase
    .from('trainer_profiles')
    .insert({ id: userId, ...trainerData });

  // Add some availability
  const availabilityData = [
    { trainer_id: userId, day_of_week: 1, start_time: '09:00', end_time: '18:00', is_available: true },
    { trainer_id: userId, day_of_week: 3, start_time: '09:00', end_time: '18:00', is_available: true },
    { trainer_id: userId, day_of_week: 5, start_time: '09:00', end_time: '18:00', is_available: true }
  ];

  await supabase
    .from('trainer_availability')
    .insert(availabilityData);
};

export const generateGymTestData = async (userId: string, gymName: string, city: string = 'Milano') => {
  const gymData = {
    gym_name: gymName,
    business_email: `info@${gymName.toLowerCase().replace(/\s+/g, '')}.com`,
    address: `Via Test 123, ${city}`,
    description: 'Palestra moderna con attrezzature all\'avanguardia e staff qualificato.',
    facilities: ['Sala Pesi', 'Cardio', 'Spogliatoi'],
    specializations: ['Fitness', 'Bodybuilding'],
    monthly_fee: 70 + Math.floor(Math.random() * 30),
    day_pass_fee: 10 + Math.floor(Math.random() * 10),
    is_verified: true
  };

  await supabase
    .from('gym_profiles')
    .insert({ id: userId, ...gymData });
};

export const generateUserTestData = async (userId: string) => {
  const userData = {
    age: 25 + Math.floor(Math.random() * 20),
    weight: 60 + Math.floor(Math.random() * 30),
    height: 160 + Math.floor(Math.random() * 30),
    fitness_level: ['Principiante', 'Intermedio', 'Avanzato'][Math.floor(Math.random() * 3)],
    primary_goal: ['Perdita Peso', 'Tonificazione', 'Forza'][Math.floor(Math.random() * 3)],
    secondary_goals: ['Benessere', 'Flessibilità'],
    budget_min: 30,
    budget_max: 60,
    preferred_location: 'Milano'
  };

  await supabase
    .from('user_profiles')
    .insert({ id: userId, ...userData });
};
