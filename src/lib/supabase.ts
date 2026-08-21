import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase para o MatchPet
// A chave anon pública do Supabase é projetada para uso seguro no frontend com políticas RLS
const DEFAULT_SUPABASE_URL = 'https://lfueqadcdsmujufekifo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdWVxYWRjZHNtdWp1ZmVraWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxODc3MzgsImV4cCI6MjEwMjc2MzczOH0.mRAGUWzqPa14jJWbtmCdaPDWn7UU8XOhE75gr0TnWpg';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    }
  }
});
