import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  get supabaseUrl() { return required('SUPABASE_URL'); },
  get supabaseAnonKey() { return required('SUPABASE_ANON_KEY'); },
  get supabaseServiceRoleKey() { return process.env.SUPABASE_SERVICE_ROLE_KEY; },
  get port() { return Number(process.env.PORT ?? 3001); },
};
