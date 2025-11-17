import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    user?: {
      id: string;
      email: string;
      role: string;
      subscriptionPlanId?: string | null;
      customMaxDoubleDiamondExports?: number | null;
    };
    // Outros campos da sessão, se necessário
  }
}
