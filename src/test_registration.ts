// Mock localStorage for Node.js environment
const store = new Map<string, string>();
global.localStorage = {
  getItem: (key: string) => store.get(key) || null,
  setItem: (key: string, val: string) => { store.set(key, val); },
  removeItem: (key: string) => { store.delete(key); },
  clear: () => { store.clear(); },
  length: 0,
  key: (index: number) => null
} as any;

import { mockSupabaseClient } from './integrations/supabase/mockClient';

async function testReg() {
  console.log("Testing Mock Registration...");
  try {
    const res = await mockSupabaseClient.auth.signUp({
      email: `test_user_${Date.now()}@test.com`,
      password: 'password123',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          user_type: 'user'
        }
      }
    });
    console.log("Auth Sign Up Result:", JSON.stringify(res));
    
    if (res.error) {
      console.error("Sign up error:", res.error);
      return;
    }
    
    const userId = res.data.user.id;
    console.log("Created user ID:", userId);
    
    // Now let's try updating profiles table
    const profileRes = await mockSupabaseClient
      .from('profiles')
      .update({
        first_name: 'Test',
        last_name: 'User',
        phone: '123456',
        city: 'Roma',
        user_type: 'user'
      })
      .eq('id', userId);
      
    console.log("Profiles update result:", JSON.stringify(profileRes));

    // Let's try inserting into user_profiles
    const userProfileRes = await mockSupabaseClient
      .from('user_profiles')
      .upsert({
        id: userId,
        age: 25,
        fitness_level: 'beginner'
      });
      
    console.log("User profiles upsert result:", JSON.stringify(userProfileRes));

  } catch (e) {
    console.error("Test crashed:", e);
  }
}

testReg();
