import express from 'express';
import { errorHandler, notFound } from './middleware/errors.js';
import { healthRouter } from './routes/health.routes.js';
import { procurementRouter } from './routes/procurement.routes.js';

export const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use('/api', healthRouter);
app.use('/api', procurementRouter);
app.use(notFound);
app.use(errorHandler);
