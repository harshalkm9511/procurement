import type { ErrorRequestHandler, RequestHandler } from 'express';

export class HttpError extends Error {
  constructor(public readonly statusCode: number, message: string, public readonly code = 'REQUEST_ERROR') {
    super(message);
  }
}

export const notFound: RequestHandler = (_req, _res, next) => next(new HttpError(404, 'Route not found', 'NOT_FOUND'));

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error instanceof HttpError ? error.statusCode : 500;
  if (status === 500) console.error(error);
  res.status(status).json({
    success: false,
    error: {
      message: error instanceof HttpError ? error.message : 'Internal server error',
      code: error instanceof HttpError ? error.code : 'INTERNAL_ERROR',
    },
  });
};
