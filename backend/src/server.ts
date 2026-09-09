import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, '0.0.0.0', () => {
  console.log(`ProcureAI API listening on 0.0.0.0:${env.port}`);
});