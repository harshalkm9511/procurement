import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { HttpError } from './errors.js';

export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new HttpError(
          400,
          result.error.issues.map((issue) => issue.message).join(', '),
          'VALIDATION_ERROR'
        )
      );
    }

    req.body = result.data;
    next();
  };
}

export function validateParams(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return next(
        new HttpError(
          400,
          result.error.issues.map((issue) => issue.message).join(', '),
          'VALIDATION_ERROR'
        )
      );
    }

    req.params = result.data as typeof req.params;
    next();
  };
}

export function validateQuery(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(
        new HttpError(
          400,
          result.error.issues.map((issue) => issue.message).join(', '),
          'VALIDATION_ERROR'
        )
      );
    }

    // Do not assign to req.query.
    // Express treats req.query as a read-only property.
    next();
  };
}