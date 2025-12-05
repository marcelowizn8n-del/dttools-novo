/**
 * Middleware to check if user has reached their Double Diamond project limit
 * Free users: 3 projects max
 * Paid users: unlimited
 */

import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { users, subscriptionPlans } from "../../shared/schema";
import { eq } from "drizzle-orm";

export interface DoubleDiamondLimitError {
  error: string;
  code: "DOUBLE_DIAMOND_LIMIT_REACHED" | "NO_SUBSCRIPTION_PLAN" | "PLAN_NOT_FOUND";
  currentUsage: number;
  limit: number | null;
  planName: string;
  upgradeUrl: string;
}

const FREE_PLAN_DOUBLE_DIAMOND_LIMIT = 3;

export async function checkDoubleDiamondLimit(
  req: Request,
  res: Response<DoubleDiamondLimitError | any>,
  next: NextFunction
) {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user with subscription info
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = user[0];

    // ADMINS have unlimited access - skip all checks
    if (userData.role === 'admin') {
      console.log(`✅ Admin user ${userId} bypassing Double Diamond limits`);
      return next();
    }

    // Count user's Double Diamond projects
    const userDoubleDiamondProjects = await storage.getDoubleDiamondProjects(userId);
    const currentUsage = userDoubleDiamondProjects.length;

    // Check if user has a subscription plan
    if (!userData.subscriptionPlanId) {
      // Free user - check limit of 3
      if (currentUsage >= FREE_PLAN_DOUBLE_DIAMOND_LIMIT) {
        return res.status(403).json({
          error: `Você atingiu o limite de ${FREE_PLAN_DOUBLE_DIAMOND_LIMIT} projetos Double Diamond do plano gratuito. Faça upgrade para criar projetos ilimitados.`,
          code: "DOUBLE_DIAMOND_LIMIT_REACHED",
          currentUsage,
          limit: FREE_PLAN_DOUBLE_DIAMOND_LIMIT,
          planName: "Gratuito",
          upgradeUrl: "/pricing",
        });
      }
      // User is within free limit - allow
      return next();
    }

    // Get subscription plan details
    const plan = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, userData.subscriptionPlanId))
      .limit(1);

    if (!plan || plan.length === 0) {
      // Plan not found - treat as free user
      if (currentUsage >= FREE_PLAN_DOUBLE_DIAMOND_LIMIT) {
        return res.status(403).json({
          error: `Você atingiu o limite de ${FREE_PLAN_DOUBLE_DIAMOND_LIMIT} projetos Double Diamond. Faça upgrade para criar projetos ilimitados.`,
          code: "DOUBLE_DIAMOND_LIMIT_REACHED",
          currentUsage,
          limit: FREE_PLAN_DOUBLE_DIAMOND_LIMIT,
          planName: "Gratuito",
          upgradeUrl: "/pricing",
        });
      }
      return next();
    }

    const planData = plan[0];
    
    // Check if plan has maxDoubleDiamondProjects field (if we add it later)
    // For now, paid plans = unlimited, free = 3
    const isFreePlan = planData.name === "free" || planData.priceMonthly === 0;
    
    if (isFreePlan) {
      // Free plan - limit of 3
      if (currentUsage >= FREE_PLAN_DOUBLE_DIAMOND_LIMIT) {
        return res.status(403).json({
          error: `Você atingiu o limite de ${FREE_PLAN_DOUBLE_DIAMOND_LIMIT} projetos Double Diamond do plano ${planData.displayName}. Faça upgrade para criar projetos ilimitados.`,
          code: "DOUBLE_DIAMOND_LIMIT_REACHED",
          currentUsage,
          limit: FREE_PLAN_DOUBLE_DIAMOND_LIMIT,
          planName: planData.displayName,
          upgradeUrl: "/pricing",
        });
      }
    }
    // Paid plans have unlimited Double Diamond projects

    // User is within limits - allow
    next();
  } catch (error) {
    console.error("Error checking Double Diamond limit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

