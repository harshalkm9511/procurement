import type { RequestHandler, Response } from 'express';
import { HttpError } from '../middleware/errors.js';
import { assertOrganizationReferences, CrudService, type RequestContext } from '../services/crud.service.js';

type RecordData = Record<string, unknown>;

export interface ResourceControllerDefinition {
  service: CrudService;
  references?: (body: RecordData) => Array<{ table: string; id: string | null | undefined; label: string }>;
  createFields?: (body: RecordData, context: RequestContext) => RecordData;
}

function contextFor(req: Parameters<RequestHandler>[0]): RequestContext {
  if (!req.auth || !req.profile) throw new HttpError(401, 'Authentication required', 'UNAUTHORIZED');
  return { accessToken: req.auth.accessToken, organizationId: req.profile.organizationId, userId: req.auth.userId };
}

function requiredParam(req: Parameters<RequestHandler>[0], name: string): string {
  const value = req.params[name];
  if (typeof value !== 'string') throw new HttpError(400, `Invalid ${name} parameter`, 'VALIDATION_ERROR');
  return value;
}

function success(res: Response, status: number, data: unknown, meta?: Record<string, unknown>): void {
  res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function createCrudController(definition: ResourceControllerDefinition) {
  const validateReferences = async (context: RequestContext, body: RecordData) => {
    if (definition.references) await assertOrganizationReferences(context, definition.references(body));
  };

  return {
    list: (async (req, res) => {
      const { page, limit, ...filters } = req.query as Record<string, string | number | undefined>;
      const result = await definition.service.list(contextFor(req), Number(page), Number(limit), filters);
      success(res, 200, result.records, { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages });
    }) as RequestHandler,
    get: (async (req, res) => success(res, 200, await definition.service.get(contextFor(req), requiredParam(req, 'id')))) as RequestHandler,
    create: (async (req, res) => {
      const context = contextFor(req);
      const body = req.body as RecordData;
      await validateReferences(context, body);
      success(res, 201, await definition.service.create(context, definition.createFields?.(body, context) ?? body));
    }) as RequestHandler,
    update: (async (req, res) => {
      const context = contextFor(req);
      const body = req.body as RecordData;
      await validateReferences(context, body);
      success(res, 200, await definition.service.update(context, requiredParam(req, 'id'), body));
    }) as RequestHandler,
    delete: (async (req, res) => {
      await definition.service.delete(contextFor(req), requiredParam(req, 'id'));
      res.status(204).send();
    }) as RequestHandler,
  };
}
