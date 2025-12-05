import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Helper to normalize numeric limits: null/undefined or negative values become null (unlimited)
function normalizeLimit(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (value < 0) return null;
  return value;
}

// Extend Request interface to include subscription info
declare module 'express-serve-static-core' {
  interface Request {
    subscription?: {
      plan: any;
      limits: {
        maxProjects: number | null;
        maxPersonasPerProject: number | null;
        maxUsersPerTeam: number | null;
        aiChatLimit: number | null;
        libraryArticlesCount: number | null;
        maxDoubleDiamondProjects: number | null;
        maxDoubleDiamondExports: number | null;
        canCollaborate: boolean;
        canExportPDF: boolean;
        canExportPNG: boolean;
        canExportCSV: boolean;
        hasPermissionManagement: boolean;
        hasSharedWorkspace: boolean;
        hasCommentsAndFeedback: boolean;
      };
      addons?: {
        doubleDiamondPro: boolean;
        exportPro: boolean;
        aiTurbo: boolean;
        collabAdvanced: boolean;
        libraryPremium: boolean;
        raw: any[];
      };
    };
  }
}

// Middleware to load user subscription and enforce limits
export async function loadUserSubscription(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.id) {
    // User not authenticated - apply free plan limits
    const freePlan = await storage.getSubscriptionPlanByName("free");
    if (freePlan) {
      const planMaxProjects = normalizeLimit(freePlan.maxProjects);
      const planMaxPersonas = normalizeLimit(freePlan.maxPersonasPerProject);
      const planMaxUsers = normalizeLimit(freePlan.maxUsersPerTeam);
      const planAiChat = normalizeLimit(freePlan.aiChatLimit);
      const planLibraryArticles = normalizeLimit(freePlan.libraryArticlesCount);
      const planMaxDoubleDiamondProjects = normalizeLimit(freePlan.maxDoubleDiamondProjects);
      const planMaxDoubleDiamondExports = normalizeLimit(freePlan.maxDoubleDiamondExports);
      const exportFormats = Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats : [];

      req.subscription = {
        plan: freePlan,
        limits: {
          maxProjects: planMaxProjects,
          maxPersonasPerProject: planMaxPersonas,
          maxUsersPerTeam: planMaxUsers,
          aiChatLimit: planAiChat,
          libraryArticlesCount: planLibraryArticles,
          maxDoubleDiamondProjects: planMaxDoubleDiamondProjects,
          maxDoubleDiamondExports: planMaxDoubleDiamondExports,
          canCollaborate: freePlan.hasCollaboration ?? false,
          canExportPDF: exportFormats.includes("pdf"),
          canExportPNG: exportFormats.includes("png"),
          canExportCSV: exportFormats.includes("csv"),
          hasPermissionManagement: freePlan.hasPermissionManagement ?? false,
          hasSharedWorkspace: freePlan.hasSharedWorkspace ?? false,
          hasCommentsAndFeedback: freePlan.hasCommentsAndFeedback ?? false,
        },
        addons: {
          doubleDiamondPro: false,
          exportPro: false,
          aiTurbo: false,
          collabAdvanced: false,
          libraryPremium: false,
          raw: [],
        },
      };
    }
    return next();
  }

  try {
    // Get user's active subscription
    const userSubscription = await storage.getUserActiveSubscription(req.user.id);
    let plan;

    if (userSubscription) {
      plan = await storage.getSubscriptionPlan(userSubscription.planId);
    } else {
      // No active subscription - default to free plan
      plan = await storage.getSubscriptionPlanByName("free");
    }

    if (plan) {
      const user = await storage.getUser(req.user.id);

      const planMaxProjects = normalizeLimit(plan.maxProjects);
      const planMaxPersonas = normalizeLimit(plan.maxPersonasPerProject);
      const planMaxUsers = normalizeLimit(plan.maxUsersPerTeam);
      const planAiChat = normalizeLimit(plan.aiChatLimit);
      const planLibraryArticles = normalizeLimit(plan.libraryArticlesCount);
      const planMaxDoubleDiamondProjects = normalizeLimit(plan.maxDoubleDiamondProjects);
      const planMaxDoubleDiamondExports = normalizeLimit(plan.maxDoubleDiamondExports);

      const userMaxProjects = normalizeLimit(user?.customMaxProjects ?? null);
      const userAiChatLimit = normalizeLimit(user?.customAiChatLimit ?? null);
      const userMaxDoubleDiamondProjects = normalizeLimit(user?.customMaxDoubleDiamondProjects ?? null);
      const userMaxDoubleDiamondExports = normalizeLimit(user?.customMaxDoubleDiamondExports ?? null);

      const activeAddons = await storage.getActiveUserAddons(req.user.id);
      const addonKeys = new Set(activeAddons.map((a) => a.addonKey));

      const hasDoubleDiamondPro = addonKeys.has("double_diamond_pro");
      const hasExportPro = addonKeys.has("export_pro");
      const hasAiTurbo = addonKeys.has("ai_turbo");
      const hasCollabAdvanced = addonKeys.has("collab_advanced");
      const hasLibraryPremium = addonKeys.has("library_premium");

      let maxProjects = userMaxProjects !== null ? userMaxProjects : planMaxProjects;
      let aiChatLimit = userAiChatLimit !== null ? userAiChatLimit : planAiChat;
      let maxDoubleDiamondProjects = userMaxDoubleDiamondProjects !== null ? userMaxDoubleDiamondProjects : planMaxDoubleDiamondProjects;
      let maxDoubleDiamondExports = userMaxDoubleDiamondExports !== null ? userMaxDoubleDiamondExports : planMaxDoubleDiamondExports;
      let libraryArticlesCount = planLibraryArticles;

      // Apply add-on effects
      if (hasAiTurbo) {
        // Extra 300 AI messages; null continues to mean unlimited
        aiChatLimit = aiChatLimit !== null ? aiChatLimit + 300 : null;
      }

      if (hasDoubleDiamondPro) {
        // Unlimited Double Diamond projects/exports for this add-on
        maxDoubleDiamondProjects = null;
        maxDoubleDiamondExports = null;
      }

      if (hasLibraryPremium) {
        // Full access to library
        libraryArticlesCount = null;
      }

      const exportFormats = Array.isArray(plan.exportFormats) ? plan.exportFormats : [];
      let canExportPDF = exportFormats.includes("pdf");
      let canExportPNG = exportFormats.includes("png");
      let canExportCSV = exportFormats.includes("csv");

      if (hasExportPro || hasDoubleDiamondPro) {
        canExportPDF = true;
        canExportPNG = true;
        canExportCSV = true;
      }

      const canCollaborate = (plan.hasCollaboration ?? false) || hasCollabAdvanced;
      const hasSharedWorkspace = (plan.hasSharedWorkspace ?? false) || hasCollabAdvanced;
      const hasCommentsAndFeedback = (plan.hasCommentsAndFeedback ?? false) || hasCollabAdvanced;
      const hasPermissionManagement = plan.hasPermissionManagement ?? false;

      req.subscription = {
        plan,
        limits: {
          maxProjects,
          maxPersonasPerProject: planMaxPersonas,
          maxUsersPerTeam: planMaxUsers,
          aiChatLimit,
          libraryArticlesCount,
          maxDoubleDiamondProjects,
          maxDoubleDiamondExports,
          canCollaborate,
          canExportPDF,
          canExportPNG,
          canExportCSV,
          hasPermissionManagement,
          hasSharedWorkspace,
          hasCommentsAndFeedback,
        },
        addons: {
          doubleDiamondPro: hasDoubleDiamondPro,
          exportPro: hasExportPro,
          aiTurbo: hasAiTurbo,
          collabAdvanced: hasCollabAdvanced,
          libraryPremium: hasLibraryPremium,
          raw: activeAddons,
        },
      };
    }

    next();
  } catch (error) {
    console.error("Error loading user subscription:", error);
    next(error);
  }
}

// Middleware to check project creation limits
export async function checkProjectLimit(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.id || !req.subscription?.limits) {
    return next();
  }

  const maxProjects = req.subscription.limits.maxProjects;
  if (maxProjects === null) {
    // Unlimited projects
    return next();
  }

  try {
    const userProjects = await storage.getProjects(req.user.id);

    if (userProjects.length >= maxProjects) {
      return res.status(403).json({
        error: "Project limit reached",
        message: `Your plan allows up to ${maxProjects} projects. Upgrade to create more projects.`,
        upgrade_required: true
      });
    }

    next();
  } catch (error) {
    console.error("Error checking project limit:", error);
    next(error);
  }
}

// Middleware to check persona creation limits
export async function checkPersonaLimit(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.id || !req.subscription?.limits) {
    return next();
  }

  const maxPersonas = req.subscription.limits.maxPersonasPerProject;
  if (maxPersonas === null) {
    // Unlimited personas
    return next();
  }

  const projectId = req.params.projectId;
  if (!projectId) {
    return next();
  }

  try {
    const personas = await storage.getPersonas(projectId);

    if (personas.length >= maxPersonas) {
      return res.status(403).json({
        error: "Persona limit reached",
        message: `Your plan allows up to ${maxPersonas} personas per project. Upgrade to create more personas.`,
        upgrade_required: true
      });
    }

    next();
  } catch (error) {
    console.error("Error checking persona limit:", error);
    next(error);
  }
}

// Middleware to check AI chat limits
export async function checkAIChatLimit(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.id || !req.subscription?.limits) {
    return next();
  }

  const aiChatLimit = req.subscription.limits.aiChatLimit;
  if (aiChatLimit === null) {
    // Unlimited AI chat
    return next();
  }

  try {
    // Note: In a real app, you'd track AI chat usage per month
    // For now, we'll just proceed - implement actual tracking in production
    const currentMonthUsage = 0; // Placeholder

    if (currentMonthUsage >= aiChatLimit) {
      return res.status(403).json({
        error: "AI chat limit reached",
        message: `Your plan allows up to ${aiChatLimit} AI messages per month. Upgrade for unlimited access.`,
        upgrade_required: true
      });
    }

    next();
  } catch (error) {
    console.error("Error checking AI chat limit:", error);
    next(error);
  }
}

// Middleware to check export feature access
export function checkExportAccess(format: 'pdf' | 'png' | 'csv') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.subscription?.limits) {
      return next();
    }

    const canExport = format === 'pdf' ? req.subscription.limits.canExportPDF :
                      format === 'png' ? req.subscription.limits.canExportPNG :
                      format === 'csv' ? req.subscription.limits.canExportCSV : false;

    if (!canExport) {
      return res.status(403).json({
        error: "Export feature not available",
        message: `${format.toUpperCase()} export is not available in your current plan. Upgrade to access this feature.`,
        upgrade_required: true
      });
    }

    next();
  };
}

// Middleware to check collaboration features
export async function checkCollaborationAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.subscription?.limits) {
    return next();
  }

  if (!req.subscription.limits.canCollaborate) {
    return res.status(403).json({
      error: "Collaboration not available",
      message: "Real-time collaboration is not available in your current plan. Upgrade to Team or Enterprise plan.",
      upgrade_required: true
    });
  }

  next();
}

// Get current subscription info for frontend
export async function getSubscriptionInfo(req: Request, res: Response) {
  if (!req.user?.id) {
    const freePlan = await storage.getSubscriptionPlanByName("free");
    return res.json({
      plan: freePlan,
      limits: freePlan ? {
        maxProjects: normalizeLimit(freePlan.maxProjects),
        maxPersonasPerProject: normalizeLimit(freePlan.maxPersonasPerProject),
        maxUsersPerTeam: normalizeLimit(freePlan.maxUsersPerTeam),
        aiChatLimit: normalizeLimit(freePlan.aiChatLimit),
        libraryArticlesCount: normalizeLimit(freePlan.libraryArticlesCount),
        maxDoubleDiamondProjects: normalizeLimit(freePlan.maxDoubleDiamondProjects),
        maxDoubleDiamondExports: normalizeLimit(freePlan.maxDoubleDiamondExports),
        canCollaborate: freePlan.hasCollaboration ?? false,
        canExportPDF: (Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("pdf") : false),
        canExportPNG: (Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("png") : false),
        canExportCSV: (Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("csv") : false),
        hasPermissionManagement: freePlan.hasPermissionManagement ?? false,
        hasSharedWorkspace: freePlan.hasSharedWorkspace ?? false,
        hasCommentsAndFeedback: freePlan.hasCommentsAndFeedback ?? false,
      } : null,
      addons: {
        doubleDiamondPro: false,
        exportPro: false,
        aiTurbo: false,
        collabAdvanced: false,
        libraryPremium: false,
        raw: [],
      },
      usage: {
        projects: 0,
        aiChatThisMonth: 0,
      }
    });
  }

  try {
    const userSubscription = await storage.getUserActiveSubscription(req.user.id);
    let plan;

    if (userSubscription) {
      plan = await storage.getSubscriptionPlan(userSubscription.planId);
    } else {
      plan = await storage.getSubscriptionPlanByName("free");
    }

    // Calculate current usage
    const userProjects = await storage.getProjects(req.user.id);
    const user = await storage.getUser(req.user.id);
    const activeAddons = plan ? await storage.getActiveUserAddons(req.user.id) : [];

    let limits: any = null;
    let addonsInfo: any = null;

    if (plan) {
      const planMaxProjects = normalizeLimit(plan.maxProjects);
      const planMaxPersonas = normalizeLimit(plan.maxPersonasPerProject);
      const planMaxUsers = normalizeLimit(plan.maxUsersPerTeam);
      const planAiChat = normalizeLimit(plan.aiChatLimit);
      const planLibraryArticles = normalizeLimit(plan.libraryArticlesCount);
      const planMaxDoubleDiamondProjects = normalizeLimit(plan.maxDoubleDiamondProjects);
      const planMaxDoubleDiamondExports = normalizeLimit(plan.maxDoubleDiamondExports);

      const userMaxProjects = normalizeLimit(user?.customMaxProjects ?? null);
      const userAiChatLimit = normalizeLimit(user?.customAiChatLimit ?? null);
      const userMaxDoubleDiamondProjects = normalizeLimit(user?.customMaxDoubleDiamondProjects ?? null);
      const userMaxDoubleDiamondExports = normalizeLimit(user?.customMaxDoubleDiamondExports ?? null);

      const addonKeys = new Set(activeAddons.map((a: any) => a.addonKey));

      const hasDoubleDiamondPro = addonKeys.has("double_diamond_pro");
      const hasExportPro = addonKeys.has("export_pro");
      const hasAiTurbo = addonKeys.has("ai_turbo");
      const hasCollabAdvanced = addonKeys.has("collab_advanced");
      const hasLibraryPremium = addonKeys.has("library_premium");

      let maxProjects = userMaxProjects !== null ? userMaxProjects : planMaxProjects;
      let aiChatLimit = userAiChatLimit !== null ? userAiChatLimit : planAiChat;
      let maxDoubleDiamondProjects = userMaxDoubleDiamondProjects !== null ? userMaxDoubleDiamondProjects : planMaxDoubleDiamondProjects;
      let maxDoubleDiamondExports = userMaxDoubleDiamondExports !== null ? userMaxDoubleDiamondExports : planMaxDoubleDiamondExports;
      let libraryArticlesCount = planLibraryArticles;

      if (hasAiTurbo) {
        aiChatLimit = aiChatLimit !== null ? aiChatLimit + 300 : null;
      }

      if (hasDoubleDiamondPro) {
        maxDoubleDiamondProjects = null;
        maxDoubleDiamondExports = null;
      }

      if (hasLibraryPremium) {
        libraryArticlesCount = null;
      }

      const exportFormats = Array.isArray(plan.exportFormats) ? plan.exportFormats : [];
      let canExportPDF = exportFormats.includes("pdf");
      let canExportPNG = exportFormats.includes("png");
      let canExportCSV = exportFormats.includes("csv");

      if (hasExportPro || hasDoubleDiamondPro) {
        canExportPDF = true;
        canExportPNG = true;
        canExportCSV = true;
      }

      const canCollaborate = (plan.hasCollaboration ?? false) || hasCollabAdvanced;
      const hasSharedWorkspace = (plan.hasSharedWorkspace ?? false) || hasCollabAdvanced;
      const hasCommentsAndFeedback = (plan.hasCommentsAndFeedback ?? false) || hasCollabAdvanced;
      const hasPermissionManagement = plan.hasPermissionManagement ?? false;

      limits = {
        maxProjects,
        maxPersonasPerProject: planMaxPersonas,
        maxUsersPerTeam: planMaxUsers,
        aiChatLimit,
        libraryArticlesCount,
        maxDoubleDiamondProjects,
        maxDoubleDiamondExports,
        canCollaborate,
        canExportPDF,
        canExportPNG,
        canExportCSV,
        hasPermissionManagement,
        hasSharedWorkspace,
        hasCommentsAndFeedback,
      };

      addonsInfo = {
        doubleDiamondPro: hasDoubleDiamondPro,
        exportPro: hasExportPro,
        aiTurbo: hasAiTurbo,
        collabAdvanced: hasCollabAdvanced,
        libraryPremium: hasLibraryPremium,
        raw: activeAddons,
      };
    }

    res.json({
      plan,
      subscription: userSubscription,
      limits,
      addons: addonsInfo,
      usage: {
        projects: userProjects.length,
        aiChatThisMonth: 0, // Placeholder
      }
    });
  } catch (error) {
    console.error("Error getting subscription info:", error);
    res.status(500).json({ error: "Failed to get subscription info" });
  }
}