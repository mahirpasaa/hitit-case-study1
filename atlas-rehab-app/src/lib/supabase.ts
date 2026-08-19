import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Bunlar "publishable / anon" anahtarlardır — Supabase'in Row Level Security
// (RLS) kuralları veriyi zaten koruduğu için mobil uygulama içine gömülmeleri
// güvenlidir (bkz. supabase/schema.sql).
const SUPABASE_URL = 'https://sfxdtbrbmuqqlqevyvpo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZXTnyDuVzzzfss2ztdbDzg_duXfSR88';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
