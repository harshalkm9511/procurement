import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseUserClient } from '../config/supabase.js';
import { HttpError } from '../middleware/errors.js';

type RecordData = Record<string, unknown>;
type FilterValue = string | number | undefined;

export interface RequestContext {
  accessToken: string;
  organizationId: string;
  userId: string;
}

export interface CrudDefinition {
  table: string;
  orderBy?: string;
  organizationScopedReads?: boolean;
  deleteGuards?: Array<{ table: string; column: string; message: string }>;
}

function databaseError(error: { code?: string } | null): HttpError {
  if (error?.code === '23505') return new HttpError(409, 'A record with these unique fields already exists', 'CONFLICT');
  if (error?.code === '23503') return new HttpError(409, 'This record is still referenced by related business data', 'CONFLICT');
  return new HttpError(500, 'Database operation failed', 'DATABASE_ERROR');
}

function sanitizeSearch(value: string): string {
  return value.replace(/[,%()]/g, '');
}

export class CrudService {
  constructor(private readonly definition: CrudDefinition) {}

  private client(context: RequestContext): SupabaseClient {
    return getSupabaseUserClient(context.accessToken);
  }

  async list(context: RequestContext, page: number, limit: number, filters: Record<string, FilterValue>) {
    const client = this.client(context);
    let query = client.from(this.definition.table).select('*', { count: 'exact' });
    if (this.definition.organizationScopedReads !== false) query = query.eq('organization_id', context.organizationId);
    for (const [column, value] of Object.entries(filters)) {
      if (value === undefined || column === 'search' || column === 'period_start' || column === 'period_end') continue;
      query = query.eq(column, value);
    }
    if (filters.search && this.definition.table === 'suppliers') {
      const term = sanitizeSearch(String(filters.search));
      query = query.or(`name.ilike.%${term}%,category.ilike.%${term}%,location.ilike.%${term}%`);
    }
    if (filters.period_start) query = query.gte('period_start', String(filters.period_start));
    if (filters.period_end) query = query.lte('period_end', String(filters.period_end));
    const from = (page - 1) * limit;
    const { data, error, count } = await query.order(this.definition.orderBy ?? 'created_at', { ascending: false }).range(from, from + limit - 1);
    if (error) throw databaseError(error);
    return { records: data ?? [], page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) };
  }

  async get(context: RequestContext, id: string): Promise<RecordData> {
    let query = this.client(context).from(this.definition.table).select('*').eq('id', id);
    if (this.definition.organizationScopedReads !== false) query = query.eq('organization_id', context.organizationId);
    const { data, error } = await query.maybeSingle();
    if (error) throw databaseError(error);
    if (!data) throw new HttpError(404, 'Record not found', 'NOT_FOUND');
    return data as RecordData;
  }

  async create(context: RequestContext, input: RecordData): Promise<RecordData> {
    const { data, error } = await this.client(context).from(this.definition.table).insert({ ...input, organization_id: context.organizationId }).select().single();
    if (error) throw databaseError(error);
    return data as RecordData;
  }

  async update(context: RequestContext, id: string, input: RecordData): Promise<RecordData> {
    const { data, error } = await this.client(context).from(this.definition.table).update(input).eq('id', id).eq('organization_id', context.organizationId).select().maybeSingle();
    if (error) throw databaseError(error);
    if (!data) throw new HttpError(404, 'Record not found', 'NOT_FOUND');
    return data as RecordData;
  }

  async delete(context: RequestContext, id: string): Promise<void> {
    const client = this.client(context);
    const { data, error: lookupError } = await client.from(this.definition.table).select('id').eq('id', id).eq('organization_id', context.organizationId).maybeSingle();
    if (lookupError) throw databaseError(lookupError);
    if (!data) throw new HttpError(404, 'Record not found', 'NOT_FOUND');
    for (const guard of this.definition.deleteGuards ?? []) {
      const { count, error } = await client.from(guard.table).select('id', { count: 'exact', head: true }).eq(guard.column, id).eq('organization_id', context.organizationId);
      if (error) throw databaseError(error);
      if ((count ?? 0) > 0) throw new HttpError(409, guard.message, 'CONFLICT');
    }
    const { error } = await client.from(this.definition.table).delete().eq('id', id).eq('organization_id', context.organizationId);
    if (error) throw databaseError(error);
  }
}

export async function assertOrganizationReferences(context: RequestContext, references: Array<{ table: string; id: string | null | undefined; label: string }>): Promise<void> {
  const client = getSupabaseUserClient(context.accessToken);
  for (const reference of references) {
    if (!reference.id) continue;
    const { data, error } = await client.from(reference.table).select('id').eq('id', reference.id).eq('organization_id', context.organizationId).maybeSingle();
    if (error) throw databaseError(error);
    if (!data) throw new HttpError(400, `Invalid ${reference.label}`, 'INVALID_REFERENCE');
  }
}
