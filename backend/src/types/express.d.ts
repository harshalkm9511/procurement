import type { organization_role } from './profiles.js';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; email?: string; accessToken: string };
      profile?: { organizationId: string; role: organization_role };
    }
  }
}

export {};
