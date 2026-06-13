export const getEnvVar = (key: string): string => {
  // Try to get from import.meta.env (Vite)
  // Note: Vite requires VITE_ prefix for client-exposed envs, 
  // so we check both the raw key and VITE_ prefixed key if passed without it.
  const value = import.meta.env[key] || import.meta.env[`VITE_${key}`];
  
  if (!value) {
    console.warn(`Environment variable ${key} is missing.`);
    return '';
  }
  return value;
};

// Supabase
export const SUPABASE_URL = getEnvVar('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_ANON_KEY');

// Firebase Environment Variables
export const FIREBASE_API_KEY = getEnvVar('FIREBASE_API_KEY');
export const FIREBASE_AUTH_DOMAIN = getEnvVar('FIREBASE_AUTH_DOMAIN');
export const FIREBASE_PROJECT_ID = getEnvVar('FIREBASE_PROJECT_ID');
export const FIREBASE_STORAGE_BUCKET = getEnvVar('FIREBASE_STORAGE_BUCKET');
export const FIREBASE_MESSAGING_SENDER_ID = getEnvVar('FIREBASE_MESSAGING_SENDER_ID');
export const FIREBASE_APP_ID = getEnvVar('FIREBASE_APP_ID');

export const isSupabaseConfigured = (): boolean => {
  return (
    !!SUPABASE_URL &&
    !!SUPABASE_ANON_KEY &&
    SUPABASE_URL !== 'your_project_url' &&
    SUPABASE_ANON_KEY !== 'your_anon_key' &&
    !SUPABASE_URL.includes('placeholder')
  );
};

export const isFirebaseConfigured = (): boolean => {
  return (
    !!FIREBASE_API_KEY &&
    !!FIREBASE_PROJECT_ID &&
    FIREBASE_API_KEY !== 'your_api_key' &&
    !FIREBASE_API_KEY.includes('placeholder')
  );
};

export const HIDE_DEMO_BANNER = getEnvVar('HIDE_DEMO_BANNER') === 'true';
