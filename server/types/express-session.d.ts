import 'express-session';
import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
      createdAt: Date;
      subscriptionPlanId?: string | null;
      customMaxDoubleDiamondExports?: number | null;
    };
  }
}

declare module 'stripe' {
  interface Subscription {
    current_period_end: number;
  }

  interface Invoice {
    subscription: string | Stripe.Subscription | Stripe.SubscriptionItem;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & {
        userId: string;
        user?: {
          id: string;
          username: string;
          email: string;
          role: string;
          createdAt: Date;
          subscriptionPlanId?: string | null;
          customMaxDoubleDiamondExports?: number | null;
        };
      };
    }
  }
}
