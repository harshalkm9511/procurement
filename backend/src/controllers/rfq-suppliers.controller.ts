import type { RequestHandler, Response } from 'express';
import { getSupabaseUserClient } from '../config/supabase.js';
import { HttpError } from '../middleware/errors.js';
import { assertOrganizationReferences, type RequestContext } from '../services/crud.service.js';

function contextFor(req: Parameters<RequestHandler>[0]): RequestContext {
  if (!req.auth || !req.profile) throw new HttpError(401, 'Authentication required', 'UNAUTHORIZED');
  return { accessToken: req.auth.accessToken, organizationId: req.profile.organizationId, userId: req.auth.userId };
}

function requiredParam(req: Parameters<RequestHandler>[0], name: string): string {
  const value = req.params[name];
  if (typeof value !== 'string') throw new HttpError(400, `Invalid ${name} parameter`, 'VALIDATION_ERROR');
  return value;
}

function success(res: Response, status: number, data: unknown): void {
  res.status(status).json({ success: true, data });
}

export const listRfqSuppliers: RequestHandler = async (req, res) => {
  const context = contextFor(req);
  const rfqId = requiredParam(req, 'id');
  await assertOrganizationReferences(context, [{ table: 'rfqs', id: rfqId, label: 'RFQ' }]);
  const { data, error } = await getSupabaseUserClient(context.accessToken)
    .from('rfq_suppliers').select('*, suppliers(*)').eq('rfq_id', rfqId).eq('organization_id', context.organizationId).order('invited_at', { ascending: false });
  if (error) throw new HttpError(500, 'Database operation failed', 'DATABASE_ERROR');
  success(res, 200, data ?? []);
};

export const addRfqSupplier: RequestHandler = async (req, res) => {
  const context = contextFor(req);
  const rfqId = requiredParam(req, 'id');
  const supplierId = req.body.supplier_id as string;
  await assertOrganizationReferences(context, [
    { table: 'rfqs', id: rfqId, label: 'RFQ' },
    { table: 'suppliers', id: supplierId, label: 'supplier' },
  ]);
  const { data, error } = await getSupabaseUserClient(context.accessToken)
    .from('rfq_suppliers').insert({ organization_id: context.organizationId, rfq_id: rfqId, supplier_id: supplierId }).select().single();
  if (error?.code === '23505') throw new HttpError(409, 'Supplier is already invited to this RFQ', 'CONFLICT');
  if (error) throw new HttpError(500, 'Database operation failed', 'DATABASE_ERROR');
  success(res, 201, data);
};

export const removeRfqSupplier: RequestHandler = async (req, res) => {
  const context = contextFor(req);
  const rfqId = requiredParam(req, 'id');
  const supplierId = requiredParam(req, 'supplierId');
  const { data, error } = await getSupabaseUserClient(context.accessToken)
    .from('rfq_suppliers').delete().eq('rfq_id', rfqId).eq('supplier_id', supplierId).eq('organization_id', context.organizationId).select('id').maybeSingle();
  if (error) throw new HttpError(500, 'Database operation failed', 'DATABASE_ERROR');
  if (!data) throw new HttpError(404, 'RFQ supplier relationship not found', 'NOT_FOUND');
  res.status(204).send();
};
