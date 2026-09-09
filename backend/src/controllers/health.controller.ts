import type { RequestHandler } from 'express';
import { getSupabaseAdmin } from '../config/supabase.js';

export const healthCheck: RequestHandler = async (_req, res) => {
  try {
    const { error } = await getSupabaseAdmin().from('organizations').select('id', { head: true }).limit(1);
    if (error) throw error;
    res.status(200).json({ status: 'ok', api: 'running', supabase: { configured: true, database: 'available' } });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      api: 'running',
      supabase: { configured: false, database: 'unavailable' },
      error: error instanceof Error ? error.message : 'Supabase connectivity check failed',
    });
  }
};
