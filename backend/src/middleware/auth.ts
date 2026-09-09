import type { RequestHandler } from 'express';
import { getSupabaseAdmin, getSupabaseClient } from '../config/supabase.js';
import { HttpError } from './errors.js';
import type { organization_role } from '../types/profiles.js';

export const requireAuthentication: RequestHandler = async (req, _res, next) => {
  const [scheme, accessToken] = req.header('authorization')?.split(' ') ?? [];
  if (scheme?.toLowerCase() !== 'bearer' || !accessToken) return next(new HttpError(401, 'Missing bearer token', 'UNAUTHORIZED'));

  const { data, error } = await getSupabaseClient().auth.getUser(accessToken);
  if (error || !data.user) return next(new HttpError(401, 'Invalid or expired session', 'UNAUTHORIZED'));
  req.auth = { userId: data.user.id, email: data.user.email, accessToken };
  next();
};

export const loadProfile: RequestHandler = async (req, _res, next) => {
  if (!req.auth) return next(new HttpError(401, 'Authentication required', 'UNAUTHORIZED'));
  const { data, error } = await getSupabaseAdmin()
    .from('profiles')
    .select('organization_id, role')
    .eq('id', req.auth.userId)
    .single();
  if (error || !data) return next(new HttpError(403, 'No organization profile found', 'FORBIDDEN'));
  req.profile = { organizationId: data.organization_id, role: data.role as organization_role };
  next();
};

export function requireRoles(...roles: organization_role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.profile) return next(new HttpError(403, 'Organization profile required', 'FORBIDDEN'));
    if (!roles.includes(req.profile.role)) return next(new HttpError(403, 'Insufficient role', 'FORBIDDEN'));
    next();
  };
}
