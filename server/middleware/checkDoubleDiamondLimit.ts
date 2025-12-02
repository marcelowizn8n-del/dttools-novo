/**
 * Middleware to check if user has reached their Double Diamond project limit.
 * Regras:
 * - Admin: ilimitado
 * - Add-on "double_diamond_pro": ilimitado
 * - Se houver subscriptionPlan.maxDoubleDiamondProjects, usa esse valor (null/negativo = ilimitado)
 * - Se não houver plano ou for plano gratuito, usa FREE_PLAN_DOUBLE_DIAMOND_LIMIT
 * - customMaxDoubleDiamondProjects (campo do usuário) sobrescreve o limite do plano se não for null
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

    // Verificar add-ons ativos (Double Diamond Pro pode liberar limite)
    const activeAddons = await storage.getActiveUserAddons(userId);
    const addonKeys = new Set(activeAddons.map((a: any) => a.addonKey));
    const hasDoubleDiamondPro = addonKeys.has("double_diamond_pro");

    if (hasDoubleDiamondPro) {
      console.log(`✅ User ${userId} has Double Diamond Pro add-on - unlimited projects`);
      return next();
    }

    // Buscar plano de assinatura, se existir
    let planData: any | null = null;
    if (userData.subscriptionPlanId) {
      const plan = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.id, userData.subscriptionPlanId))
        .limit(1);
      planData = plan && plan.length > 0 ? plan[0] : null;
    }

    // Limite personalizado do usuário (se definido e >= 0, sobrescreve plano)
    const userCustomLimitRaw = (userData as any).customMaxDoubleDiamondProjects as number | null | undefined;
    const userCustomLimit = typeof userCustomLimitRaw === "number" && userCustomLimitRaw >= 0
      ? userCustomLimitRaw
      : null;

    // Limite vindo do plano (se houver)
    let planLimit: number | null = null;
    if (!planData) {
      // Sem plano: trata como gratuito
      planLimit = FREE_PLAN_DOUBLE_DIAMOND_LIMIT;
    } else if (typeof planData.maxDoubleDiamondProjects === "number") {
      // maxDoubleDiamondProjects < 0 ou null = ilimitado
      planLimit = planData.maxDoubleDiamondProjects < 0 ? null : planData.maxDoubleDiamondProjects;
    } else {
      const isFreePlan = planData.name === "free" || planData.priceMonthly === 0;
      planLimit = isFreePlan ? FREE_PLAN_DOUBLE_DIAMOND_LIMIT : null;
    }

    const effectiveLimit = userCustomLimit !== null ? userCustomLimit : planLimit;

    if (effectiveLimit !== null && currentUsage >= effectiveLimit) {
      return res.status(403).json({
        error: `Você atingiu o limite de ${effectiveLimit} projetos Double Diamond do seu plano. Faça upgrade ou adquira o add-on Double Diamond Pro para criar mais projetos.`,
        code: "DOUBLE_DIAMOND_LIMIT_REACHED",
        currentUsage,
        limit: effectiveLimit,
        planName: planData?.displayName ?? (userData.subscriptionPlanId ? "Plano atual" : "Gratuito"),
        upgradeUrl: "/pricing",
      });
    }

    // Usuário dentro do limite - permitir criação
    next();
  } catch (error) {
    console.error("Error checking Double Diamond limit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
