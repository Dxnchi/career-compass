import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Base project URL with NO trailing path or slash
const SUPABASE_URL = 'https://jmhabpynatzfvwylmbwy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6jL2AQzJukS_UHJVefCZAg_4sexd759';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
