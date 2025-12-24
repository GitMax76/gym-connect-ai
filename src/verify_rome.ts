
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Fix for __dirname in ESM
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
    console.log('Verifying Rome Scenario Data...');

    // Authenticate
    console.log('Authenticating as rome_user_1@test.com...');
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'rome_user_1@test.com',
        password: 'password123'
    });


    if (authError) {
        console.error('❌ Authentication failed:', authError.message);
        console.warn('Continuing as unauthenticated...');
    } else {
        console.log('✅ Authenticated successfully.');
        console.log('User ID:', session.user.id);
    }

    // Debug: Check total profiles count (any city, any user)
    // Using simple count to see if we can see *anything*
    const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });


    if (countError) {
        console.error('❌ Error counting profiles:', countError.message);
    } else {
        console.log(`📊 Total Profiles visible in DB (select count(*)): ${count}`);

        // Debug: Dump some cities
        const { data: cityData } = await supabase
            .from('profiles')
            .select('city, first_name')
            .limit(20);

        console.log('--- City Sample ---');
        cityData?.forEach(p => console.log(`City: "${p.city}", Name: ${p.first_name}`));
        console.log('-------------------');
    }

    // Check Users



    // Check Users
    const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, first_name, city')
        .eq('city', 'Roma')
        .eq('user_type', 'user');

    if (userError) {
        console.error('Error fetching users:', userError);
    } else {
        console.log(`Found ${users?.length} Users in Rome (Visible to current user)`);
        // users?.forEach(u => console.log(` - User: ${u.first_name}`));
    }

    // Check Trainers 
    const { data: trainers, error: trainerError } = await supabase
        .from('profiles')
        .select('id, first_name, city')
        .eq('city', 'Roma')
        .eq('user_type', 'trainer');

    if (trainerError) {
        console.error('Error fetching trainers:', trainerError);
    } else {
        console.log(`Found ${trainers?.length} Trainers in Rome (Visible to current user)`);
        trainers?.forEach(t => console.log(` - Trainer: ${t.first_name}`));
    }

    // Check Gyms
    const { data: gyms, error: gymError } = await supabase
        .from('profiles')
        .select('id, first_name, city')
        .eq('city', 'Roma')
        .eq('user_type', 'gym_owner');

    if (gymError) {
        console.error('Error fetching gyms:', gymError);
    } else {
        console.log(`Found ${gyms?.length} Gyms in Rome (Visible to current user)`);
        gyms?.forEach(g => console.log(` - Gym: ${g.first_name}`));
    }
}

verify();
