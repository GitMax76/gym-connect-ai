import { isFirebaseConfigured } from '@/utils/env';
import { firebaseClientAdapter } from '@/integrations/firebase/adapter';
import { mockSupabaseClient } from './mockClient';

// Export the client facade. 
// If Firebase environment variables are set, use the Firebase Adapter.
// Otherwise, fallback to the Local Storage Mock (Demo Mode).
export const supabase = isFirebaseConfigured()
  ? (firebaseClientAdapter as any)
  : (mockSupabaseClient as any);