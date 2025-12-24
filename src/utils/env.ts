export const getEnvVar = (key: string): string => {
  // Try to get from import.meta.env (Vite)
  // Note: Vite requires VITE_ prefix for client-exposed envs, 
  // so we check both the raw key and VITE_ prefixed key if passed without it.
  const value = import.meta.env[key] || import.meta.env[`VITE_${key}`];
  
  if (!value) {
    console.error(`Missing environment variable: ${key}`);
    // In development we might want to crash or warn loudly
    if (import.meta.env.DEV) {
       console.warn(`Please set ${key} in your .env file.`);
    }
    // Return empty string to prevent immediate crash if not critical,
    // or throw error if it is critical. For Supabase config, it's critical.
    throw new Error(`Critical configuration missing: ${key}`);
  }
  return value;
};

export const SUPABASE_URL = getEnvVar('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_ANON_KEY');
