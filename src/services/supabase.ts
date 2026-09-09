import { createClient, type Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigError = supabaseUrl && supabaseAnonKey
  ? null
  : 'Frontend Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signIn(email: string, password: string): Promise<Session> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is unavailable');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw error ?? new Error('Authentication did not return a session');
  return data.session;
}

export async function signUp(email: string, password: string, metadata: { full_name: string; organization_name: string }): Promise<Session | null> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is unavailable');
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
  if (error) throw error;
  return data.session;
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
