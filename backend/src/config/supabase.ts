import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

let anonClient: SupabaseClient | undefined;
let adminClient: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
  anonClient ??= createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return anonClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  const serviceRoleKey = env.supabaseServiceRoleKey;
  if (!serviceRoleKey) throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY');
  adminClient ??= createClient(env.supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

/** Creates a request-scoped client so PostgREST applies the caller's JWT and RLS policies. */
export function getSupabaseUserClient(accessToken: string): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
