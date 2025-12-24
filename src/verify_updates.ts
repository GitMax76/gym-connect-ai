import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyUpdates() {
    console.log('Starting Update Verification...');

    // 1. Verify Trainer Update
    console.log('\n--- Verifying Trainer Update ---');
    const trainerEmail = 'rome_trainer_1@test.com';
    const trainerPassword = 'password123';

    console.log(`Logging in as ${trainerEmail}...`);
    const { data: trainerAuth, error: trainerLoginError } = await supabase.auth.signInWithPassword({
        email: trainerEmail,
        password: trainerPassword,
    });

    if (trainerLoginError) {
        console.error('Trainer Login failed:', trainerLoginError);
        process.exit(1);
    }

    console.log('Trainer logged in. Updating profile...');
    const newBio = `Bio updated via script at ${new Date().toISOString()}`;
    const { error: updateError } = await supabase
        .from('trainer_profiles')
        .update({ bio: newBio })
        .eq('id', trainerAuth.user.id);

    if (updateError) {
        console.error('Trainer update failed:', updateError);
    } else {
        console.log('Trainer update command sent. Verifying...');
        const { data: trainerData } = await supabase
            .from('trainer_profiles')
            .select('bio')
            .eq('id', trainerAuth.user.id)
            .single();

        if (trainerData?.bio === newBio) {
            console.log('✅ Trainer Bio updated successfully!');
        } else {
            console.error('❌ Trainer Bio mismatch:', trainerData?.bio);
        }
    }

    // 2. Verify Gym Manager Update
    console.log('\n--- Verifying Gym Manager Update ---');
    const gymEmail = 'rome_gym_1@test.com';
    const gymPassword = 'password123';

    console.log(`Logging in as ${gymEmail}...`);
    const { data: gymAuth, error: gymLoginError } = await supabase.auth.signInWithPassword({
        email: gymEmail,
        password: gymPassword,
    });

    if (gymLoginError) {
        console.error('Gym Login failed:', gymLoginError);
        process.exit(1);
    }

    console.log('Gym Manager logged in. Updating profile...');
    const newDescription = `Description updated via script at ${new Date().toISOString()}`;
    const { error: gymUpdateError } = await supabase
        .from('gym_profiles')
        .update({ description: newDescription })
        .eq('id', gymAuth.user.id);

    if (gymUpdateError) {
        console.error('Gym update failed:', gymUpdateError);
    } else {
        console.log('Gym update command sent. Verifying...');
        const { data: gymData } = await supabase
            .from('gym_profiles')
            .select('description')
            .eq('id', gymAuth.user.id)
            .single();

        if (gymData?.description === newDescription) {
            console.log('✅ Gym Description updated successfully!');
        } else {
            console.error('❌ Gym Description mismatch:', gymData?.description);
        }
    }
}

verifyUpdates().catch(console.error);
