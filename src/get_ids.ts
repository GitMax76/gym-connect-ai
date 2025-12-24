
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getIds() {
    console.log('Fetching Rome IDs...');

    const { data: users } = await supabase.from('profiles').select('id, first_name').eq('city', 'Roma').eq('user_type', 'user').limit(1);
    if (users && users.length > 0) console.log(`👉 TEST USER ID: ${users[0].id} (${users[0].first_name})`);

    const { data: trainers } = await supabase.from('profiles').select('id, first_name').eq('city', 'Roma').eq('user_type', 'trainer').limit(1);
    if (trainers && trainers.length > 0) console.log(`👉 TEST TRAINER ID: ${trainers[0].id} (${trainers[0].first_name})`);

    const { data: gyms } = await supabase.from('profiles').select('id, first_name').eq('city', 'Roma').eq('user_type', 'gym_owner').limit(1);
    if (gyms && gyms.length > 0) console.log(`👉 TEST GYM ID: ${gyms[0].id} (${gyms[0].first_name})`);
}

getIds();
