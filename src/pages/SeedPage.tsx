
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { generateRandomUser, generateRandomTrainer, generateRandomGym, generateRomeUser, generateRomeTrainer, generateRomeGym, generateSalernoUser, generateSalernoTrainer, generateSalernoGym } from '@/utils/seedData';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SeedPage = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const { signUp } = useAuth();
    const { createUserProfile, createTrainerProfile, createGymProfile, updateProfile } = useProfile();

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

    const runSeed = async () => {
        setLoading(true);
        setLogs([]);
        addLog("Starting standard seeding process...");
        try {
            // 1. Create 30 Athletes
            for (let i = 1; i <= 30; i++) {
                // Add longer delay to avoid aggressive rate limits (6s)
                await new Promise(r => setTimeout(r, 6000));

                const data = generateRandomUser(i);
                addLog(`Creating User ${i}: ${data.email}`);

                const { error: authError } = await signUp(data.email, data.password, {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    user_type: 'user'
                });

                if (authError) {
                    addLog(`❌ Error creating user ${i}: ${authError.message}`);
                    continue;
                }

                await new Promise(r => setTimeout(r, 500));

                await updateProfile({
                    city: data.city,
                    user_type: 'user',
                    first_name: data.firstName,
                    last_name: data.lastName
                });

                await createUserProfile({
                    age: data.age,
                    fitness_level: data.fitnessLevel,
                    primary_goal: data.goal,
                    budget_min: data.budget_min,
                    budget_max: data.budget_max,
                    preferred_location: data.city,
                    availability_hours_per_week: data.availability
                });
            }

            // 2. Create 20 Trainers
            for (let i = 1; i <= 20; i++) {
                await new Promise(r => setTimeout(r, 6000));
                const data = generateRandomTrainer(i);
                addLog(`Creating Trainer ${i}: ${data.email}`);

                const { error: authError } = await signUp(data.email, data.password, {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    user_type: 'trainer'
                });

                if (authError) {
                    addLog(`❌ Error creating trainer ${i}: ${authError.message}`);
                    continue;
                }

                await new Promise(r => setTimeout(r, 500));

                await updateProfile({
                    city: data.city,
                    user_type: 'trainer',
                    first_name: data.firstName,
                    last_name: data.lastName
                });

                await createTrainerProfile({
                    bio: data.bio,
                    years_experience: data.yearsExperience,
                    specializations: data.specializations,
                    personal_rate_per_hour: data.hourlyRate,
                    preferred_areas: data.city
                });
            }

            // 3. Create 10 Gyms
            for (let i = 1; i <= 10; i++) {
                await new Promise(r => setTimeout(r, 6000));
                const data = generateRandomGym(i);
                addLog(`Creating Gym ${i}: ${data.email}`);

                const { error: authError } = await signUp(data.email, data.password, {
                    first_name: data.gymName,
                    last_name: data.ownerName,
                    user_type: 'gym_owner'
                });

                if (authError) {
                    addLog(`❌ Error creating gym ${i}: ${authError.message}`);
                    continue;
                }

                await new Promise(r => setTimeout(r, 500));

                await updateProfile({
                    city: data.city,
                    user_type: 'gym_owner',
                    first_name: data.gymName,
                    last_name: data.ownerName
                });

                await createGymProfile({
                    gym_name: data.gymName,
                    address: data.address,
                    city: data.city,
                    postal_code: data.postalCode,
                    description: data.description,
                    facilities: data.facilities,
                    monthly_fee: data.monthlyFee
                });
            }

            addLog("Seeding Complete!");
        } catch (e: any) {
            addLog(`Error: ${e.message}`);
        }
        setLoading(false);
    };

    const runRomeScenario = async () => {
        setLoading(true);
        setLogs([]);
        addLog("🏛️ Starting ROME SCENARIO seeding...");

        try {
            // 1. Create 10 Rome Users
            for (let i = 1; i <= 10; i++) {
                await new Promise(r => setTimeout(r, 2000));
                const data = generateRomeUser(i);
                addLog(`Processing Rome User ${i}: ${data.email}`);

                let userId = null;

                // Try SignUp
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            first_name: data.firstName,
                            last_name: data.lastName,
                            user_type: 'user'
                        }
                    }
                });

                if (authError) {
                    // Check if user already exists
                    if (authError.message.includes('already registered') || authError.status === 400 || authError.status === 422) {
                        addLog(`User exists, logging in to update...`);
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email: data.email,
                            password: data.password
                        });

                        if (signInError) {
                            addLog(`❌ Failed to login existing user: ${signInError.message}`);
                            continue;
                        }
                        userId = signInData.user?.id;
                    } else {
                        addLog(`❌ Error: ${authError.message}`);
                        continue;
                    }
                } else {
                    userId = authData.user?.id;
                }

                if (!userId) {
                    addLog(`⚠️ No User ID obtained for ${data.email}`);
                    continue;
                }

                await new Promise(r => setTimeout(r, 500));

                // Directly update profiles
                const { error: updateError } = await supabase.from('profiles').update({
                    city: 'Roma',
                    user_type: 'user',
                    first_name: data.firstName,
                    last_name: data.lastName
                }).eq('id', userId);

                if (updateError) addLog(`Update Error: ${updateError.message}`);

                await supabase.from('user_profiles').upsert({
                    id: userId,
                    age: data.age,
                    fitness_level: data.fitnessLevel,
                    primary_goal: data.goal,
                    budget_min: data.budget_min,
                    budget_max: data.budget_max,
                    preferred_location: 'Roma',
                    availability_hours_per_week: data.availability
                });
            }

            // 2. Create 5 Rome Trainers
            for (let i = 1; i <= 5; i++) {
                await new Promise(r => setTimeout(r, 2000));
                const data = generateRomeTrainer(i);
                addLog(`Processing Rome Trainer ${i}: ${data.email}`);

                let userId = null;

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            first_name: data.firstName,
                            last_name: data.lastName,
                            user_type: 'trainer'
                        }
                    }
                });

                if (authError) {
                    if (authError.message.includes('already registered') || authError.status === 400 || authError.status === 422) {
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email: data.email,
                            password: data.password
                        });
                        if (!signInError) userId = signInData.user?.id;
                    }
                } else {
                    userId = authData.user?.id;
                }

                if (!userId) continue;

                await new Promise(r => setTimeout(r, 500));

                await supabase.from('profiles').update({
                    city: 'Roma',
                    user_type: 'trainer',
                    first_name: data.firstName,
                    last_name: data.lastName
                }).eq('id', userId);

                await supabase.from('trainer_profiles').upsert({
                    id: userId,
                    bio: data.bio,
                    years_experience: data.yearsExperience,
                    specializations: data.specializations,
                    personal_rate_per_hour: data.hourlyRate,
                    preferred_areas: 'Roma'
                });
            }

            // 3. Create 3 Rome Gyms
            for (let i = 1; i <= 3; i++) {
                await new Promise(r => setTimeout(r, 2000));
                const data = generateRomeGym(i);
                addLog(`Processing Rome Gym ${i}: ${data.email}`);

                let userId = null;

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            first_name: data.gymName,
                            last_name: data.ownerName,
                            user_type: 'gym_owner'
                        }
                    }
                });

                if (authError) {
                    if (authError.message.includes('already registered') || authError.status === 400 || authError.status === 422) {
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email: data.email,
                            password: data.password
                        });
                        if (!signInError) userId = signInData.user?.id;
                    }
                } else {
                    userId = authData.user?.id;
                }

                if (!userId) continue;

                await new Promise(r => setTimeout(r, 500));

                await supabase.from('profiles').update({
                    city: 'Roma',
                    user_type: 'gym_owner',
                    first_name: data.gymName,
                    last_name: data.ownerName
                }).eq('id', userId);

                await supabase.from('gym_profiles').upsert({
                    id: userId,
                    gym_name: data.gymName,
                    address: data.address,
                    city: 'Roma',
                    postal_code: data.postalCode,
                    description: data.description,
                    facilities: data.facilities,
                    monthly_fee: data.monthlyFee
                });
            }

            addLog("✅ Rome Scenario Complete! Login as rome_user_1@test.com / password123 to test.");

        } catch (e: any) {
            addLog(`❌ Fatal Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const runSalernoScenario = async () => {
        setLoading(true);
        setLogs([]);
        addLog("🍕 Starting SALERNO SCENARIO seeding...");

        try {
            // 1. Create 6 Salerno Users
            for (let i = 1; i <= 6; i++) {
                await new Promise(r => setTimeout(r, 2000));
                const data = generateSalernoUser(i);
                addLog(`Processing Salerno User ${i}: ${data.email}`);

                let userId = null;

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            first_name: data.firstName,
                            last_name: data.lastName,
                            user_type: 'user'
                        }
                    }
                });

                if (authError) {
                    if (authError.message.includes('already registered') || authError.status === 400 || authError.status === 422) {
                        addLog(`User exists, logging in to update...`);
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email: data.email,
                            password: data.password
                        });
                        if (!signInError) userId = signInData.user?.id;
                    }
                } else {
                    userId = authData.user?.id;
                }

                if (!userId) continue;

                await new Promise(r => setTimeout(r, 500));

                await supabase.from('profiles').update({
                    city: 'Salerno',
                    user_type: 'user',
                    first_name: data.firstName,
                    last_name: data.lastName
                }).eq('id', userId);

                await supabase.from('user_profiles').upsert({
                    id: userId,
                    age: data.age,
                    fitness_level: data.fitnessLevel,
                    primary_goal: data.goal,
                    budget_min: data.budget_min,
                    budget_max: data.budget_max,
                    preferred_location: 'Salerno',
                    availability_hours_per_week: data.availability
                });
            }

            // 2. Create 4 Salerno Trainers
            for (let i = 1; i <= 4; i++) {
                await new Promise(r => setTimeout(r, 2000));
                const data = generateSalernoTrainer(i);
                addLog(`Processing Salerno Trainer ${i}: ${data.email}`);

                let userId = null;

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            first_name: data.firstName,
                            last_name: data.lastName,
                            user_type: 'trainer'
                        }
                    }
                });

                if (authError) {
                    if (authError.message.includes('already registered') || authError.status === 400 || authError.status === 422) {
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email: data.email,
                            password: data.password
                        });
                        if (!signInError) userId = signInData.user?.id;
                    }
                } else {
                    userId = authData.user?.id;
                }

                if (!userId) continue;

                await new Promise(r => setTimeout(r, 500));

                await supabase.from('profiles').update({
                    city: 'Salerno',
                    user_type: 'trainer',
                    first_name: data.firstName,
                    last_name: data.lastName
                }).eq('id', userId);

                await supabase.from('trainer_profiles').upsert({
                    id: userId,
                    bio: data.bio,
                    years_experience: data.yearsExperience,
                    specializations: data.specializations,
                    personal_rate_per_hour: data.hourlyRate,
                    preferred_areas: 'Salerno'
                });
            }

            // 3. Create 2 Salerno Gyms
            for (let i = 1; i <= 2; i++) {
                await new Promise(r => setTimeout(r, 2000));
                const data = generateSalernoGym(i);
                addLog(`Processing Salerno Gym ${i}: ${data.email}`);

                let userId = null;

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            first_name: data.gymName,
                            last_name: data.ownerName,
                            user_type: 'gym_owner'
                        }
                    }
                });

                if (authError) {
                    if (authError.message.includes('already registered') || authError.status === 400 || authError.status === 422) {
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email: data.email,
                            password: data.password
                        });
                        if (!signInError) userId = signInData.user?.id;
                    }
                } else {
                    userId = authData.user?.id;
                }

                if (!userId) continue;

                await new Promise(r => setTimeout(r, 500));

                await supabase.from('profiles').update({
                    city: 'Salerno',
                    user_type: 'gym_owner',
                    first_name: data.gymName,
                    last_name: data.ownerName
                }).eq('id', userId);

                await supabase.from('gym_profiles').upsert({
                    id: userId,
                    gym_name: data.gymName,
                    address: data.address,
                    city: 'Salerno',
                    postal_code: data.postalCode,
                    description: data.description,
                    facilities: data.facilities,
                    monthly_fee: data.monthlyFee
                });
            }

            addLog("✅ Salerno Scenario Complete! Login as salerno_user_1@test.com / password123 to test.");

        } catch (e: any) {
            addLog(`❌ Fatal Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Database Seeder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border rounded-md bg-white">
                        <h3 className="font-bold mb-2">Standard Seed (Random)</h3>
                        <p className="text-sm text-slate-600 mb-4">Creates 30 Users, 20 Trainers, 10 Gyms (Random Cities)</p>
                        <Button onClick={runSeed} disabled={loading} variant="outline" className="w-full">
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Generate Standard Data
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
                            <h3 className="font-bold mb-2 text-blue-800">🏛️ Rome Scenario</h3>
                            <p className="text-sm text-blue-600 mb-4">Users, Trainers, Gyms in Rome</p>
                            <Button onClick={runRomeScenario} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                                Generate Rome
                            </Button>
                        </div>

                        <div className="p-4 border rounded-md bg-green-50 border-green-200">
                            <h3 className="font-bold mb-2 text-green-800">🍕 Salerno Scenario</h3>
                            <p className="text-sm text-green-600 mb-4">Test Matching in Salerno</p>
                            <Button onClick={runSalernoScenario} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                                Generate Salerno
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-900 text-green-400 font-mono p-4 rounded-lg h-96 overflow-y-auto text-sm">
                        {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                        {logs.length === 0 && <span className="text-slate-600">Ready to start...</span>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SeedPage;
