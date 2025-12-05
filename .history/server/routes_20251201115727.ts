import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import passport from "./passport-config";
import { storage } from "./storage";
import { 
  insertProjectSchema,
  insertEmpathyMapSchema,
  insertPersonaSchema,
  insertInterviewSchema,
  insertObservationSchema,
  insertPovStatementSchema,
  insertHmwQuestionSchema,
  insertIdeaSchema,
  insertPrototypeSchema,
  insertTestPlanSchema,
  insertTestResultSchema,
  insertUserProgressSchema,
  insertUserSchema,
  insertArticleSchema,
  insertTestimonialSchema,
  insertVideoTutorialSchema,
  insertSubscriptionPlanSchema,
  insertUserSubscriptionSchema,
  insertCanvasDrawingSchema,
  insertPhaseCardSchema,
  insertBenchmarkSchema,
  insertBenchmarkAssessmentSchema,
  insertDvfAssessmentSchema,
  insertLovabilityMetricSchema,
  insertProjectAnalyticsSchema,
  insertCompetitiveAnalysisSchema,
  updateProfileSchema,
  insertHelpArticleSchema,
  insertIndustrySectorSchema,
  insertSuccessCaseSchema,
  insertAiGeneratedAssetSchema,
  insertDoubleDiamondProjectSchema,
  doubleDiamondExports
} from "../shared/schema";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { sql } from "drizzle-orm";
import { 
  loadUserSubscription, 
  checkProjectLimit, 
  checkPersonaLimit, 
  getSubscriptionInfo,
  checkCollaborationAccess
} from "./subscriptionMiddleware";
import { checkAiProjectLimits, incrementAiProjectsUsed } from "./middleware/checkAiProjectLimits";
import { checkDoubleDiamondLimit } from "./middleware/checkDoubleDiamondLimit";
import { designThinkingAI, type ChatMessage, type DesignThinkingContext } from "./aiService";
import { designThinkingGeminiAI } from "./geminiService";
import { PPTXService } from "./pptxService";
import { translateArticle, translateVideo, translateTestimonial } from "./translation";
import { 
  generateDiscoverPhase, 
  generateDefinePhase, 
  generateDevelopPhase, 
  generateDeliverPhase, 
  analyzeDFV 
} from "./double-diamond-ai";

// Initialize Stripe with secret key (optional for Railway deployment)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

if (!stripe) {
  console.warn('⚠️  STRIPE_SECRET_KEY not set - payment features will be disabled');
}

// Stripe Price IDs for add-ons (configured via environment variables)
const ADDON_PRICE_IDS: Record<string, { monthly?: string; yearly?: string }> = {
  double_diamond_pro: {
    monthly: process.env.STRIPE_PRICE_ADDON_DOUBLE_DIAMOND_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_DOUBLE_DIAMOND_PRO_YEARLY,
  },
  export_pro: {
    monthly: process.env.STRIPE_PRICE_ADDON_EXPORT_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_EXPORT_PRO_YEARLY,
  },
  ai_turbo: {
    monthly: process.env.STRIPE_PRICE_ADDON_AI_TURBO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_AI_TURBO_YEARLY,
  },
  collab_advanced: {
    monthly: process.env.STRIPE_PRICE_ADDON_COLLAB_ADVANCED_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_COLLAB_ADVANCED_YEARLY,
  },
  library_premium: {
    monthly: process.env.STRIPE_PRICE_ADDON_LIBRARY_PREMIUM_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_LIBRARY_PREMIUM_YEARLY,
  },
};

// Extend Request interface to include session user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      username: string;
      role: string;
      createdAt: Date;
    };
  }
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  // Set user data on request for easy access
  if (req.session.user) {
    req.user = req.session.user;
  }
  
  next();
}

// Admin authorization middleware  
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId || !req.session?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  // Set user data on request
  req.user = req.session.user;
  next();
}

// Project permission middleware
function requireProjectAccess(requiredRole: 'owner' | 'editor' | 'viewer' = 'viewer') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const projectId = req.params.projectId;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID required" });
    }

    try {
      const userId = req.session.userId!;

      // Check if the user is the project owner
      const ownerProject = await storage.getProject(projectId, userId);
      if (ownerProject) {
        // Owner always has full access regardless of requiredRole
        return next();
      }

      // If not owner, check if user is a project member
      const member = await storage.getProjectMember(projectId, userId);
      if (!member) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Check role permissions based on member role
      const roleHierarchy = { viewer: 1, editor: 2, owner: 3 };
      const userLevel = roleHierarchy[member.role as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[requiredRole];

      if (userLevel < requiredLevel) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "Failed to check permissions" });
    }
  };
}

// Configuração do multer para upload de arquivos
const storage_config = multer.memoryStorage();
const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit - increased to match express.json
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'));
    }
  },
});

// Função para garantir que o diretório de uploads existe
function ensureUploadDirectory() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

// Duplicate project prevention - tracks recent project creations per user
interface ProjectCreationRecord {
  name: string;
  userId: string;
  timestamp: number;
}

const recentProjectCreations = new Map<string, ProjectCreationRecord>();
const DUPLICATE_PREVENTION_WINDOW_MS = 3000; // 3 seconds

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(recentProjectCreations.entries());
  for (const [key, record] of entries) {
    if (now - record.timestamp > DUPLICATE_PREVENTION_WINDOW_MS) {
      recentProjectCreations.delete(key);
    }
  }
}, 5000); // Clean every 5 seconds

function isDuplicateProjectCreation(userId: string, projectName: string): boolean {
  const key = `${userId}:${projectName.trim().toLowerCase()}`;
  const existing = recentProjectCreations.get(key);
  
  if (!existing) {
    return false;
  }
  
  const now = Date.now();
  const timeSinceCreation = now - existing.timestamp;
  
  // If the same user created a project with same name recently, it's a duplicate
  return timeSinceCreation < DUPLICATE_PREVENTION_WINDOW_MS;
}

function recordProjectCreation(userId: string, projectName: string): void {
  const key = `${userId}:${projectName.trim().toLowerCase()}`;
  recentProjectCreations.set(key, {
    name: projectName,
    userId: userId,
    timestamp: Date.now()
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // IMPORTANT: Stripe webhook needs raw body for signature verification
  // This must be BEFORE express.json() middleware
    const expressModule = await import("express");
  const expressRaw =
    (expressModule as any).raw ||
    (expressModule.default && (expressModule.default as any).raw);

  if (!expressRaw) {
    throw new Error("Failed to load express raw body parser");
  }

  app.post(
    "/api/stripe-webhook",
    expressRaw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig ?? "",
          process.env.STRIPE_WEBHOOK_SECRET ?? ""
        );
      } catch (err: any) {
        console.log("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const metadata = session.metadata || {};
            const userId = (metadata as any).userId as string | undefined;
            const planId = (metadata as any).planId as string | undefined;
            const billingPeriod = (metadata as any).billingPeriod as
              | "monthly"
              | "yearly"
              | undefined;
            const addonKey = (metadata as any).addonKey as string | undefined;

            if (!userId) {
              console.warn(
                "[Stripe webhook] checkout.session.completed without userId metadata"
              );
              break;
            }

            // If addonKey is present, this is an add-on checkout
            if (addonKey && !planId && billingPeriod) {
              await storage.createUserAddon({
                userId,
                addonKey,
                status: "active",
                source: "stripe",
                stripeSubscriptionId: session.subscription as string,
                billingPeriod,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(
                  Date.now() +
                    (billingPeriod === "yearly" ? 365 : 30) *
                      24 *
                      60 *
                      60 *
                      1000
                ),
              });

              console.log(
                `✅ Add-on ${addonKey} activated for user ${userId} (subscription ${session.subscription})`
              );
            }
            // Otherwise, treat as main subscription plan checkout
            else if (planId && billingPeriod) {
              await storage.createUserSubscription({
                userId,
                planId,
                stripeSubscriptionId: session.subscription as string,
                status: "active",
                billingPeriod,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(
                  Date.now() +
                    (billingPeriod === "yearly" ? 365 : 30) *
                      24 *
                      60 *
                      60 *
                      1000
                ),
              });

              await storage.updateUser(userId, {
                stripeSubscriptionId: session.subscription as string,
                subscriptionPlanId: planId,
                subscriptionStatus: "active",
              });

              console.log(
                `✅ Subscription activated for user ${userId}, plan ${planId}`
              );
            }
            break;
          }

          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const customer = (await stripe.customers.retrieve(
              subscription.customer as string
            )) as Stripe.Customer;

            if (customer.metadata?.userId) {
              const status =
                subscription.status === "active"
                  ? "active"
                  : subscription.status === "canceled"
                  ? "canceled"
                  : "expired";

              await storage.updateUser(customer.metadata.userId, {
                subscriptionStatus: status,
                subscriptionEndDate: subscription.current_period_end
                  ? new Date(subscription.current_period_end * 1000)
                  : null,
              });

              const userSub = await storage.getUserActiveSubscription(
                customer.metadata.userId
              );
              if (userSub) {
                await storage.updateUserSubscription(userSub.id, {
                  status,
                  currentPeriodEnd: subscription.current_period_end
                    ? new Date(subscription.current_period_end * 1000)
                    : null,
                  cancelAtPeriodEnd: subscription.cancel_at_period_end,
                });
              }

              // Update any user add-ons linked to this Stripe subscription
              await storage.updateUserAddonsByStripeSubscription(
                subscription.id,
                {
                  status,
                  currentPeriodEnd: subscription.current_period_end
                    ? new Date(subscription.current_period_end * 1000)
                    : null,
                }
              );

              console.log(
                `✅ Subscription ${status} for user ${customer.metadata.userId}`
              );
            }
            break;
          }

          case "invoice.payment_succeeded": {
            const invoice = event.data.object as Stripe.Invoice;
            if (invoice.subscription) {
              const sub = await stripe.subscriptions.retrieve(
                invoice.subscription as string
              );
              const cust = (await stripe.customers.retrieve(
                sub.customer as string
              )) as Stripe.Customer;

              if (cust.metadata?.userId) {
                await storage.updateUser(cust.metadata.userId, {
                  subscriptionStatus: "active",
                });

                const userSub = await storage.getUserActiveSubscription(
                  cust.metadata.userId
                );
                if (userSub) {
                  await storage.updateUserSubscription(userSub.id, {
                    status: "active",
                    currentPeriodEnd: sub.current_period_end
                      ? new Date(sub.current_period_end * 1000)
                      : null,
                  });
                }

                console.log(
                  `✅ Recurring payment succeeded for user ${cust.metadata.userId}`
                );
              }
            }
            break;
          }

          case "invoice.payment_failed": {
            const failedInvoice = event.data.object as Stripe.Invoice;
            if (failedInvoice.subscription) {
              const sub = await stripe.subscriptions.retrieve(
                failedInvoice.subscription as string
              );
              const cust = (await stripe.customers.retrieve(
                sub.customer as string
              )) as Stripe.Customer;

              if (cust.metadata?.userId) {
                await storage.updateUser(cust.metadata.userId, {
                  subscriptionStatus: "expired",
                });

                console.log(
                  `⚠️ Payment failed for user ${cust.metadata.userId}`
                );
              }
            }
            break;
          }

          default:
            console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
      } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ error: "Webhook processing failed" });
      }
    }
  );

  // Health check endpoint for monitoring
  app.get("/api/health", async (_req, res) => {
    try {
      // Lightweight database connection check (no expensive queries)
      const db = (await import('./db')).db;
      await db.execute(sql`SELECT 1`);
      
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: "MB"
        }
      });
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed"
      });
    }
  });

  // Subscription info endpoint
  app.get("/api/subscription-info", requireAuth, getSubscriptionInfo);

  // Projects routes
  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const project = await storage.getProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Optimized endpoint: Fetch project with ALL related data in single request
  app.get("/api/projects/:id/full", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const projectId = req.params.id;
      
      // Fetch all data in parallel for maximum performance
      const [
        project,
        empathyMaps,
        personas,
        interviews,
        observations,
        povStatements,
        hmwQuestions,
        ideas,
        prototypes,
        testPlans,
        canvasDrawings,
        phaseCards,
        benchmarks,
        dvfAssessments,
        lovabilityMetrics,
        projectAnalytics
      ] = await Promise.all([
        storage.getProject(projectId, userId),
        storage.getEmpathyMaps(projectId),
        storage.getPersonas(projectId),
        storage.getInterviews(projectId),
        storage.getObservations(projectId),
        storage.getPovStatements(projectId),
        storage.getHmwQuestions(projectId),
        storage.getIdeas(projectId),
        storage.getPrototypes(projectId),
        storage.getTestPlans(projectId),
        storage.getCanvasDrawings(projectId),
        storage.getPhaseCards(projectId),
        storage.getBenchmarks(projectId),
        storage.getDvfAssessments(projectId),
        storage.getLovabilityMetrics(projectId),
        storage.getProjectAnalytics(projectId)
      ]);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Return everything in one response
      res.json({
        project,
        empathyMaps,
        personas,
        interviews,
        observations,
        povStatements,
        hmwQuestions,
        ideas,
        prototypes,
        testPlans,
        canvasDrawings,
        phaseCards,
        benchmarks,
        dvfAssessments,
        lovabilityMetrics,
        projectAnalytics
      });
    } catch (error) {
      console.error("Failed to fetch full project data:", error);
      res.status(500).json({ error: "Failed to fetch project data" });
    }
  });

  app.post("/api/projects", requireAuth, checkProjectLimit, async (req, res) => {
    try {
      console.log("Creating project - Request body:", req.body);
      console.log("User session:", req.session?.userId ? "authenticated" : "not authenticated");
      
      const validatedData = insertProjectSchema.parse(req.body);
      console.log("Data validated successfully:", validatedData);
      
      // Check for duplicate creation attempts (per user)
      const userId = req.session!.userId!;
      if (isDuplicateProjectCreation(userId, validatedData.name)) {
        console.log(`Duplicate project creation attempt blocked for user ${userId}:`, validatedData.name);
        return res.status(409).json({ 
          error: "Projeto duplicado detectado",
          message: "Você já criou um projeto com este nome recentemente. Por favor, aguarde alguns segundos antes de tentar novamente."
        });
      }
      
      // Record this creation attempt
      recordProjectCreation(userId, validatedData.name);
      
      const project = await storage.createProject({ ...validatedData, userId });
      console.log("Project created successfully:", project.id);
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      
      // Handle validation errors specifically
      if (error && typeof error === 'object' && 'issues' in error) {
        const validationError = error as any;
        return res.status(400).json({ 
          error: "Dados do projeto inválidos", 
          details: validationError.issues?.map((issue: any) => ({
            field: issue.path?.join('.'),
            message: issue.message
          }))
        });
      }
      
      // Handle other errors
      res.status(500).json({ error: "Erro interno do servidor. Tente novamente." });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, userId, validatedData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Create automatic backup after significant project update
      try {
        const existingBackups = await storage.getProjectBackups(req.params.id);
        const lastBackup = existingBackups[0];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        // Only create auto backup if last one was > 1 hour ago
        if (!lastBackup || (lastBackup.createdAt && new Date(lastBackup.createdAt) < oneHourAgo)) {
          await storage.createProjectBackup(req.params.id, userId, 'auto', 'Backup automático após atualização');
        }
      } catch (backupError) {
        console.error('Error creating automatic backup:', backupError);
      }
      
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const isAdmin = req.session.user?.role === "admin";
      
      console.log("[DELETE PROJECT] Request:", {
        projectId: req.params.id,
        userId,
        isAdmin,
        userRole: req.session.user?.role
      });
      
      // Admin can delete any project, users can only delete their own
      let success;
      if (isAdmin) {
        console.log("[DELETE PROJECT] Admin delete - fetching all projects");
        // Admin: Delete without userId restriction by finding the project first
        const allProjects = await storage.getAllProjects();
        const project = allProjects.find(p => p.id === req.params.id);
        
        console.log("[DELETE PROJECT] Project found:", { 
          found: !!project, 
          projectUserId: project?.userId 
        });
        
        if (!project) {
          console.log("[DELETE PROJECT] Project not found");
          return res.status(404).json({ error: "Project not found" });
        }
        
        // Delete using the project's actual userId
        console.log("[DELETE PROJECT] Calling deleteProject with:", {
          projectId: req.params.id,
          projectUserId: project.userId
        });
        success = await storage.deleteProject(req.params.id, project.userId);
        console.log("[DELETE PROJECT] Delete result:", success);
      } else {
        // Regular user: Delete only their own projects
        console.log("[DELETE PROJECT] Regular user delete");
        success = await storage.deleteProject(req.params.id, userId);
        console.log("[DELETE PROJECT] Delete result:", success);
      }
      
      if (!success) {
        console.log("[DELETE PROJECT] Delete failed - returning 404");
        return res.status(404).json({ error: "Project not found" });
      }
      
      console.log("[DELETE PROJECT] Delete successful");
      res.json({ success: true });
    } catch (error) {
      console.error("[DELETE PROJECT] Error:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Project Members and Team Collaboration routes
  app.get("/api/projects/:projectId/members", requireAuth, requireProjectAccess('viewer'), async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const members = await storage.getProjectMembers(projectId);

      const membersWithUser = await Promise.all(members.map(async (member) => {
        const user = await storage.getUserById(member.userId);
        return {
          ...member,
          user: user
            ? { id: user.id, username: user.username, email: user.email }
            : undefined,
        };
      }));

      res.json(membersWithUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project members" });
    }
  });

  app.post("/api/projects/:projectId/members/invite", requireAuth, loadUserSubscription, checkCollaborationAccess, requireProjectAccess('owner'), async (req, res) => {
    try {
      const { email, role } = req.body;
      const userId = req.session!.userId!;
      const projectId = req.params.projectId;
      
      if (!email || !role) {
        return res.status(400).json({ error: "Email and role are required" });
      }

      if (!['editor', 'viewer'].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Must be 'editor' or 'viewer'" });
      }

      const limits = req.subscription?.limits;
      if (limits && limits.maxUsersPerTeam !== null && limits.maxUsersPerTeam !== undefined) {
        const project = await storage.getProject(projectId, userId);
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }

        const members = await storage.getProjectMembers(projectId);
        const currentTeamSize = 1 + members.length;

        if (currentTeamSize >= limits.maxUsersPerTeam) {
          return res.status(403).json({
            error: "Team member limit reached",
            message: `Seu plano permite até ${limits.maxUsersPerTeam} usuários por equipe. Faça upgrade do plano para adicionar mais membros.`,
            upgrade_required: true,
          });
        }
      }

      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const invite = await storage.createProjectInvite({
        projectId,
        email,
        role,
        invitedBy: userId,
        token,
        expiresAt
      });

      res.status(201).json(invite);
    } catch (error) {
      res.status(500).json({ error: "Failed to create invite" });
    }
  });

  app.delete("/api/projects/:projectId/members/:userId", requireAuth, requireProjectAccess('owner'), async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const userId = req.params.userId;

      const member = await storage.getProjectMember(projectId, userId);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      const success = await storage.deleteProjectMember(member.id);
      if (!success) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove member" });
    }
  });

  app.patch("/api/projects/:projectId/members/:userId/role", requireAuth, requireProjectAccess('owner'), async (req, res) => {
    try {
      const { role } = req.body;
      if (!role || !['editor', 'viewer'].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const projectId = req.params.projectId;
      const userId = req.params.userId;

      const existing = await storage.getProjectMember(projectId, userId);
      if (!existing) {
        return res.status(404).json({ error: "Member not found" });
      }

      const updated = await storage.updateProjectMemberRole(existing.id, role);
      if (!updated) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update member role" });
    }
  });

  app.get("/api/invites", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUserById(userId);
      if (!user?.email) {
        return res.status(400).json({ error: "User email not found" });
      }

      const invites = await storage.getPendingInvitesByEmail(user.email);
      res.json(invites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invites" });
    }
  });

  app.post("/api/invites/:token/accept", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUserById(userId);
      if (!user?.email) {
        return res.status(400).json({ error: "User email not found" });
      }

      const invite = await storage.getProjectInviteByToken(req.params.token);
      if (!invite) {
        return res.status(404).json({ error: "Invite not found" });
      }

      if (invite.email !== user.email) {
        return res.status(403).json({ error: "This invite is not for you" });
      }

      if (invite.status !== 'pending') {
        return res.status(400).json({ error: "Invite already processed" });
      }

      if (new Date(invite.expiresAt) < new Date()) {
        await storage.updateProjectInvite(invite.id, { status: 'expired' });
        return res.status(400).json({ error: "Invite has expired" });
      }

      await storage.createProjectMember({
        projectId: invite.projectId,
        userId: userId,
        role: invite.role,
        invitedBy: invite.invitedBy
      });

      await storage.updateProjectInvite(invite.id, { 
        status: 'accepted',
        respondedAt: new Date()
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to accept invite" });
    }
  });

  app.post("/api/invites/:token/decline", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUserById(userId);
      if (!user?.email) {
        return res.status(400).json({ error: "User email not found" });
      }

      const invite = await storage.getProjectInviteByToken(req.params.token);
      if (!invite) {
        return res.status(404).json({ error: "Invite not found" });
      }

      if (invite.email !== user.email) {
        return res.status(403).json({ error: "This invite is not for you" });
      }

      await storage.updateProjectInvite(invite.id, { 
        status: 'declined',
        respondedAt: new Date()
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to decline invite" });
    }
  });

  // Phase 1: Empathize - Empathy Maps
  app.get("/api/projects/:projectId/empathy-maps", requireAuth, async (req, res) => {
    try {
      const empathyMaps = await storage.getEmpathyMaps(req.params.projectId);
      res.json(empathyMaps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch empathy maps" });
    }
  });

  app.post("/api/projects/:projectId/empathy-maps", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEmpathyMapSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const empathyMap = await storage.createEmpathyMap(validatedData);
      res.status(201).json(empathyMap);
    } catch (error) {
      res.status(400).json({ error: "Invalid empathy map data" });
    }
  });

  app.put("/api/empathy-maps/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEmpathyMapSchema.omit({ projectId: true }).partial().parse(req.body);
      const empathyMap = await storage.updateEmpathyMap(req.params.id, validatedData);
      if (!empathyMap) {
        return res.status(404).json({ error: "Empathy map not found" });
      }
      res.json(empathyMap);
    } catch (error) {
      res.status(400).json({ error: "Invalid empathy map data" });
    }
  });

  app.delete("/api/empathy-maps/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteEmpathyMap(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Empathy map not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete empathy map" });
    }
  });

  // Endpoint para upload de imagens - Salva como base64 no banco (Railway-safe)
  app.post("/api/upload/avatar", requireAuth, upload.single('avatar'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      // Redimensionar e otimizar a imagem usando Sharp
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize(200, 200, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ 
          quality: 85,
          progressive: true
        })
        .toBuffer();

      // Converter para base64 e criar data URL
      const base64Image = optimizedBuffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      
      // Retornar data URL (salvo diretamente no banco, não em arquivo)
      res.json({ url: dataUrl });

    } catch (error: any) {
      console.error("Erro no upload:", error);
      res.status(500).json({ error: "Erro ao processar upload" });
    }
  });

  // Phase 1: Empathize - Personas
  app.get("/api/projects/:projectId/personas", requireAuth, async (req, res) => {
    try {
      const personas = await storage.getPersonas(req.params.projectId);
      res.json(personas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });

  app.post("/api/projects/:projectId/personas", requireAuth, checkPersonaLimit, async (req, res) => {
    try {
      const validatedData = insertPersonaSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const persona = await storage.createPersona(validatedData);
      res.status(201).json(persona);
    } catch (error) {
      res.status(400).json({ error: "Invalid persona data" });
    }
  });

  app.put("/api/personas/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPersonaSchema.omit({ projectId: true }).partial().parse(req.body);
      const persona = await storage.updatePersona(req.params.id, validatedData);
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      res.json(persona);
    } catch (error) {
      res.status(400).json({ error: "Invalid persona data" });
    }
  });

  app.delete("/api/personas/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePersona(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Persona not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete persona" });
    }
  });

  // Phase 1: Empathize - Interviews
  app.get("/api/projects/:projectId/interviews", requireAuth, async (req, res) => {
    try {
      const interviews = await storage.getInterviews(req.params.projectId);
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interviews" });
    }
  });

  app.post("/api/projects/:projectId/interviews", requireAuth, async (req, res) => {
    try {
      console.log('Interview creation request:', {
        projectId: req.params.projectId,
        body: req.body
      });
      
      // Converter string de data para objeto Date se necessário
      const questions = Array.isArray(req.body.questions) ? req.body.questions : [];
      const responses = Array.isArray(req.body.responses) ? req.body.responses : [];
      
      console.log('Questions/Responses:', { questions, responses });
      
      // Filtrar e alinhar pares pergunta/resposta
      const validPairs = questions
        .map((q: string, i: number) => ({ 
          question: String(q || '').trim(), 
          response: String(responses[i] || '').trim() 
        }))
        .filter((pair: { question: string; response: string }) => pair.question !== '');
      
      console.log('Valid pairs:', validPairs);
      
      const dataToValidate = {
        ...req.body,
        projectId: req.params.projectId,
        date: typeof req.body.date === 'string' ? new Date(req.body.date) : req.body.date,
        questions: validPairs.map((p: { question: string; response: string }) => p.question),
        responses: validPairs.map((p: { question: string; response: string }) => p.response),
      };
      
      console.log('Data to validate:', dataToValidate);
      
      const validatedData = insertInterviewSchema.parse(dataToValidate);
      console.log('Data validated successfully');
      
      const interview = await storage.createInterview(validatedData);
      console.log('Interview created:', interview.id);
      
      res.status(201).json(interview);
    } catch (error) {
      console.error('Interview creation error:', error);
      res.status(400).json({ 
        error: "Invalid interview data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.put("/api/interviews/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertInterviewSchema.omit({ projectId: true }).partial().parse(req.body);
      const interview = await storage.updateInterview(req.params.id, validatedData);
      if (!interview) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      res.status(400).json({ error: "Invalid interview data" });
    }
  });

  app.delete("/api/interviews/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteInterview(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete interview" });
    }
  });

  // Phase 1: Empathize - Observations
  app.get("/api/projects/:projectId/observations", requireAuth, async (req, res) => {
    try {
      const observations = await storage.getObservations(req.params.projectId);
      res.json(observations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch observations" });
    }
  });

  app.post("/api/projects/:projectId/observations", requireAuth, async (req, res) => {
    try {
      console.log("Creating observation - Request body:", JSON.stringify(req.body, null, 2));
      console.log("Project ID:", req.params.projectId);
      
      const dataToValidate = {
        ...req.body,
        projectId: req.params.projectId,
        // Converter string de data para Date object se necessário
        date: req.body.date ? new Date(req.body.date) : new Date(),
      };
      console.log("Data to validate:", JSON.stringify(dataToValidate, null, 2));
      
      const validatedData = insertObservationSchema.parse(dataToValidate);
      console.log("Data validated successfully:", JSON.stringify(validatedData, null, 2));
      
      const observation = await storage.createObservation(validatedData);
      res.status(201).json(observation);
    } catch (error) {
      console.error("Observation validation error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        res.status(400).json({ error: "Invalid observation data", details: error.message });
      } else {
        res.status(400).json({ error: "Invalid observation data" });
      }
    }
  });

  app.put("/api/observations/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertObservationSchema.omit({ projectId: true }).partial().parse(req.body);
      const observation = await storage.updateObservation(req.params.id, validatedData);
      if (!observation) {
        return res.status(404).json({ error: "Observation not found" });
      }
      res.json(observation);
    } catch (error) {
      res.status(400).json({ error: "Invalid observation data" });
    }
  });

  app.delete("/api/observations/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteObservation(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Observation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete observation" });
    }
  });

  // Phase 2: Define - POV Statements
  app.get("/api/projects/:projectId/pov-statements", requireAuth, async (req, res) => {
    try {
      const povStatements = await storage.getPovStatements(req.params.projectId);
      res.json(povStatements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch POV statements" });
    }
  });

  app.post("/api/projects/:projectId/pov-statements", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPovStatementSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const povStatement = await storage.createPovStatement(validatedData);
      res.status(201).json(povStatement);
    } catch (error) {
      res.status(400).json({ error: "Invalid POV statement data" });
    }
  });

  app.put("/api/pov-statements/:id", requireAuth, async (req, res) => {
    try {
      // First, check if the POV statement exists
      const existingPovStatement = await storage.getPovStatement(req.params.id);
      if (!existingPovStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }

      // Validate the update data
      const validatedData = insertPovStatementSchema.omit({ projectId: true }).partial().parse(req.body);
      
      // Perform the update
      const povStatement = await storage.updatePovStatement(req.params.id, validatedData);
      if (!povStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      res.json(povStatement);
    } catch (error) {
      res.status(400).json({ error: "Invalid POV statement data" });
    }
  });

  app.delete("/api/pov-statements/:id", requireAuth, async (req, res) => {
    try {
      // First, check if the POV statement exists
      const existingPovStatement = await storage.getPovStatement(req.params.id);
      if (!existingPovStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }

      // Perform the deletion
      const success = await storage.deletePovStatement(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete POV statement" });
    }
  });

  // Phase 2: Define - HMW Questions
  app.get("/api/projects/:projectId/hmw-questions", requireAuth, async (req, res) => {
    try {
      const hmwQuestions = await storage.getHmwQuestions(req.params.projectId);
      res.json(hmwQuestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch HMW questions" });
    }
  });

  app.post("/api/projects/:projectId/hmw-questions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertHmwQuestionSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const hmwQuestion = await storage.createHmwQuestion(validatedData);
      res.status(201).json(hmwQuestion);
    } catch (error) {
      res.status(400).json({ error: "Invalid HMW question data" });
    }
  });

  app.put("/api/hmw-questions/:id", requireAuth, async (req, res) => {
    try {
      // First, check if the HMW question exists
      const existingHmwQuestion = await storage.getHmwQuestion(req.params.id);
      if (!existingHmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }

      // Validate the update data
      const validatedData = insertHmwQuestionSchema.omit({ projectId: true }).partial().parse(req.body);
      
      // Perform the update
      const hmwQuestion = await storage.updateHmwQuestion(req.params.id, validatedData);
      if (!hmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      res.json(hmwQuestion);
    } catch (error) {
      res.status(400).json({ error: "Invalid HMW question data" });
    }
  });

  app.delete("/api/hmw-questions/:id", requireAuth, async (req, res) => {
    try {
      // First, check if the HMW question exists
      const existingHmwQuestion = await storage.getHmwQuestion(req.params.id);
      if (!existingHmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }

      // Perform the deletion
      const success = await storage.deleteHmwQuestion(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete HMW question" });
    }
  });

  // Phase 3: Ideate - Ideas
  app.get("/api/projects/:projectId/ideas", requireAuth, async (req, res) => {
    try {
      const ideas = await storage.getIdeas(req.params.projectId);
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ideas" });
    }
  });

  app.post("/api/projects/:projectId/ideas", requireAuth, async (req, res) => {
    try {
      const validatedData = insertIdeaSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const idea = await storage.createIdea(validatedData);
      res.status(201).json(idea);
    } catch (error) {
      res.status(400).json({ error: "Invalid idea data" });
    }
  });

  app.put("/api/ideas/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertIdeaSchema.omit({ projectId: true }).partial().parse(req.body);
      const idea = await storage.updateIdea(req.params.id, validatedData);
      if (!idea) {
        return res.status(404).json({ error: "Idea not found" });
      }
      res.json(idea);
    } catch (error) {
      res.status(400).json({ error: "Invalid idea data" });
    }
  });

  app.delete("/api/ideas/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteIdea(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Idea not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete idea" });
    }
  });

  // Phase 4: Prototype - Prototypes
  app.get("/api/projects/:projectId/prototypes", requireAuth, async (req, res) => {
    try {
      const prototypes = await storage.getPrototypes(req.params.projectId);
      res.json(prototypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prototypes" });
    }
  });

  app.post("/api/projects/:projectId/prototypes", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPrototypeSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const prototype = await storage.createPrototype(validatedData);
      res.status(201).json(prototype);
    } catch (error) {
      res.status(400).json({ error: "Invalid prototype data" });
    }
  });

  // Phase 5: Test - Test Plans
  app.get("/api/projects/:projectId/test-plans", requireAuth, async (req, res) => {
    try {
      const testPlans = await storage.getTestPlans(req.params.projectId);
      res.json(testPlans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test plans" });
    }
  });

  app.post("/api/projects/:projectId/test-plans", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTestPlanSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const testPlan = await storage.createTestPlan(validatedData);
      res.status(201).json(testPlan);
    } catch (error) {
      res.status(400).json({ error: "Invalid test plan data" });
    }
  });

  // Phase 5: Test - Test Results
  app.get("/api/test-plans/:testPlanId/results", requireAuth, async (req, res) => {
    try {
      const testResults = await storage.getTestResults(req.params.testPlanId);
      res.json(testResults);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });

  app.post("/api/test-plans/:testPlanId/results", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTestResultSchema.parse({
        ...req.body,
        testPlanId: req.params.testPlanId
      });
      const testResult = await storage.createTestResult(validatedData);
      res.status(201).json(testResult);
    } catch (error) {
      res.status(400).json({ error: "Invalid test result data" });
    }
  });

  // User Progress routes
  app.get("/api/users/:userId/projects/:projectId/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId, req.params.projectId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  app.put("/api/users/:userId/projects/:projectId/progress", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse({
        ...req.body,
        userId: req.params.userId,
        projectId: req.params.projectId
      });
      const progress = await storage.updateUserProgress(validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  // Analytics routes
  app.get("/api/projects/:projectId/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const stats = await storage.getProjectStats(req.params.projectId, userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project stats" });
    }
  });

  // Dashboard summary route
  app.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const projects = await storage.getProjects(userId);
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status === "in_progress").length;
      const completedProjects = projects.filter(p => p.status === "completed").length;
      
      // Get average completion rate
      const avgCompletion = projects.length > 0 
        ? projects.reduce((sum, p) => sum + (p.completionRate || 0), 0) / projects.length 
        : 0;

      res.json({
        totalProjects,
        activeProjects, 
        completedProjects,
        avgCompletion: Math.round(avgCompletion),
        recentProjects: projects.slice(-3).reverse()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (_req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/category/:category", async (req, res) => {
    try {
      const articles = await storage.getArticlesByCategory(req.params.category);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by category" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", requireAdmin, async (req, res) => {
    try {
      let validatedData = insertArticleSchema.parse(req.body);
      
      // Auto-translate if translations are missing
      if (!validatedData.titleEn || !validatedData.contentEn) {
        try {
          const translations = await translateArticle({
            title: validatedData.title,
            description: validatedData.description || "",
            content: validatedData.content
          });
          
          // Merge translations with existing data (don't overwrite if already exists)
          validatedData = {
            ...validatedData,
            titleEn: validatedData.titleEn || translations.titleEn,
            descriptionEn: validatedData.descriptionEn || translations.descriptionEn,
            contentEn: validatedData.contentEn || translations.contentEn,
            titleEs: validatedData.titleEs || translations.titleEs,
            descriptionEs: validatedData.descriptionEs || translations.descriptionEs,
            contentEs: validatedData.contentEs || translations.contentEs,
            titleFr: validatedData.titleFr || translations.titleFr,
            descriptionFr: validatedData.descriptionFr || translations.descriptionFr,
            contentFr: validatedData.contentFr || translations.contentFr,
          };
        } catch (translationError) {
          console.error("Auto-translation error (continuing without translation):", translationError);
          // Continue without translation if it fails
        }
      }
      
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(400).json({ error: "Invalid article data" });
    }
  });

  app.put("/api/articles/:id", requireAdmin, async (req, res) => {
    try {
      let validatedData = insertArticleSchema.partial().parse(req.body);
      
      // Auto-translate if Portuguese content changed and translations are missing
      if (validatedData.title || validatedData.description || validatedData.content) {
        const existingArticle = await storage.getArticle(req.params.id);
        if (existingArticle) {
          const needsTranslation = 
            (validatedData.title && !validatedData.titleEn) ||
            (validatedData.description && !validatedData.descriptionEn) ||
            (validatedData.content && !validatedData.contentEn);
          
          if (needsTranslation) {
            try {
              const translations = await translateArticle({
                title: validatedData.title || existingArticle.title,
                description: validatedData.description || existingArticle.description || "",
                content: validatedData.content || existingArticle.content
              });
              
              // Only update translations if they're missing
              validatedData = {
                ...validatedData,
                titleEn: validatedData.titleEn || existingArticle.titleEn || translations.titleEn,
                descriptionEn: validatedData.descriptionEn || existingArticle.descriptionEn || translations.descriptionEn,
                contentEn: validatedData.contentEn || existingArticle.contentEn || translations.contentEn,
                titleEs: validatedData.titleEs || existingArticle.titleEs || translations.titleEs,
                descriptionEs: validatedData.descriptionEs || existingArticle.descriptionEs || translations.descriptionEs,
                contentEs: validatedData.contentEs || existingArticle.contentEs || translations.contentEs,
                titleFr: validatedData.titleFr || existingArticle.titleFr || translations.titleFr,
                descriptionFr: validatedData.descriptionFr || existingArticle.descriptionFr || translations.descriptionFr,
                contentFr: validatedData.contentFr || existingArticle.contentFr || translations.contentFr,
              };
            } catch (translationError) {
              console.error("Auto-translation error (continuing without translation):", translationError);
              // Continue without translation if it fails
            }
          }
        }
      }
      
      const article = await storage.updateArticle(req.params.id, validatedData);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(400).json({ error: "Invalid article data" });
    }
  });

  app.delete("/api/articles/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteArticle(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Auto-translation routes
  app.post("/api/admin/translate/article", requireAdmin, async (req, res) => {
    try {
      const { title, description, content } = req.body;
      
      if (!title || !description || !content) {
        return res.status(400).json({ error: "Title, description, and content are required" });
      }

      const translations = await translateArticle({ title, description, content });
      res.json(translations);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate article" });
    }
  });

  app.post("/api/admin/translate/video", requireAdmin, async (req, res) => {
    try {
      const { title, description } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }

      const translations = await translateVideo({ title, description });
      res.json(translations);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate video" });
    }
  });

  app.post("/api/admin/translate/testimonial", requireAdmin, async (req, res) => {
    try {
      const { testimonialPt } = req.body;
      
      if (!testimonialPt) {
        return res.status(400).json({ error: "Portuguese testimonial text is required" });
      }

      const translations = await translateTestimonial({ testimonialPt });
      res.json(translations);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate testimonial" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getActiveTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/admin/testimonials", requireAdmin, async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const testimonial = await storage.getTestimonial(req.params.id);
      if (!testimonial || !testimonial.isActive) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonial" });
    }
  });

  app.post("/api/admin/testimonials", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ error: "Invalid testimonial data" });
    }
  });

  app.put("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, validatedData);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(400).json({ error: "Invalid testimonial data" });
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteTestimonial(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Video Tutorials routes
  app.get("/api/video-tutorials", async (_req, res) => {
    try {
      const videos = await storage.getVideoTutorials();
      res.json(videos);
    } catch (error) {
      console.error("[ERROR] /api/video-tutorials failed:", error);
      res.status(500).json({ error: "Failed to fetch video tutorials" });
    }
  });

  app.get("/api/video-tutorials/phase/:phase", async (req, res) => {
    try {
      const videos = await storage.getVideoTutorialsByPhase(req.params.phase);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video tutorials" });
    }
  });

  app.get("/api/video-tutorials/:id", async (req, res) => {
    try {
      const video = await storage.getVideoTutorial(req.params.id);
      if (!video) {
        return res.status(404).json({ error: "Video tutorial not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video tutorial" });
    }
  });

  app.post("/api/video-tutorials/:id/view", async (req, res) => {
    try {
      await storage.incrementVideoView(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment view" });
    }
  });

  // Admin routes for video tutorials
  app.post("/api/admin/video-tutorials", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertVideoTutorialSchema.parse(req.body);
      const video = await storage.createVideoTutorial(validatedData);
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video tutorial:", error);
      res.status(400).json({ error: "Invalid video tutorial data" });
    }
  });

  app.put("/api/admin/video-tutorials/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertVideoTutorialSchema.partial().parse(req.body);
      const video = await storage.updateVideoTutorial(req.params.id, validatedData);
      if (!video) {
        return res.status(404).json({ error: "Video tutorial not found" });
      }
      res.json(video);
    } catch (error) {
      console.error("Error updating video tutorial:", error);
      res.status(400).json({ error: "Invalid video tutorial data" });
    }
  });

  app.delete("/api/admin/video-tutorials/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteVideoTutorial(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Video tutorial not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete video tutorial" });
    }
  });

  // AI Automation: Industry Sectors routes
  // Public routes
  app.get("/api/sectors", async (_req, res) => {
    try {
      const sectors = await storage.getActiveIndustrySectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sectors" });
    }
  });

  // Admin routes
  app.get("/api/admin/sectors", requireAdmin, async (_req, res) => {
    try {
      const sectors = await storage.getIndustrySectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sectors" });
    }
  });

  app.post("/api/admin/sectors", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertIndustrySectorSchema.parse(req.body);
      const sector = await storage.createIndustrySector(validatedData);
      res.status(201).json(sector);
    } catch (error) {
      res.status(400).json({ error: "Invalid sector data" });
    }
  });

  app.put("/api/admin/sectors/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertIndustrySectorSchema.partial().parse(req.body);
      const sector = await storage.updateIndustrySector(req.params.id, validatedData);
      if (!sector) {
        return res.status(404).json({ error: "Sector not found" });
      }
      res.json(sector);
    } catch (error) {
      res.status(400).json({ error: "Invalid sector data" });
    }
  });

  app.delete("/api/admin/sectors/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteIndustrySector(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Sector not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete sector" });
    }
  });

  // AI Automation: Success Cases routes
  // Public routes
  app.get("/api/cases", async (_req, res) => {
    try {
      const cases = await storage.getActiveSuccessCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch success cases" });
    }
  });

  app.get("/api/cases/sector/:sectorId", async (req, res) => {
    try {
      const cases = await storage.getSuccessCasesBySector(req.params.sectorId);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch success cases" });
    }
  });

  // Admin routes
  app.get("/api/admin/cases", requireAdmin, async (_req, res) => {
    try {
      const cases = await storage.getSuccessCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch success cases" });
    }
  });

  app.post("/api/admin/cases", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSuccessCaseSchema.parse(req.body);
      const successCase = await storage.createSuccessCase(validatedData);
      res.status(201).json(successCase);
    } catch (error) {
      res.status(400).json({ error: "Invalid success case data" });
    }
  });

  app.put("/api/admin/cases/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSuccessCaseSchema.partial().parse(req.body);
      const successCase = await storage.updateSuccessCase(req.params.id, validatedData);
      if (!successCase) {
        return res.status(404).json({ error: "Success case not found" });
      }
      res.json(successCase);
    } catch (error) {
      res.status(400).json({ error: "Invalid success case data" });
    }
  });

  app.delete("/api/admin/cases/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteSuccessCase(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Success case not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete success case" });
    }
  });

  // AI Generation: Generate complete MVP
  app.post("/api/ai/generate-project", requireAuth, loadUserSubscription, checkAiProjectLimits, async (req, res) => {
    try {
      const { sectorId, successCaseId, userProblemDescription, customInspiration, language = 'pt' } = req.body;
      
      // Success case is now optional - only sector and problem description are required
      if (!sectorId || !userProblemDescription) {
        return res.status(400).json({ error: "Missing required fields: sectorId and userProblemDescription" });
      }
      
      if (userProblemDescription.length < 50 || userProblemDescription.length > 500) {
        return res.status(400).json({ error: "Problem description must be between 50 and 500 characters" });
      }
      
      // Validate custom inspiration if provided
      if (customInspiration && customInspiration.length > 300) {
        return res.status(400).json({ error: "Custom inspiration must be under 300 characters" });
      }
      
      // Get sector
      const sector = await storage.getIndustrySectors().then(sectors => 
        sectors.find(s => s.id === sectorId)
      );
      
      if (!sector) {
        return res.status(404).json({ error: "Sector not found" });
      }
      
      // Get success case if provided, otherwise create a generic one
      let successCase;
      if (successCaseId && successCaseId.trim()) {
        successCase = await storage.getSuccessCases().then(cases => 
          cases.find(c => c.id === successCaseId)
        );
        
        if (!successCase) {
          return res.status(404).json({ error: "Success case not found" });
        }
      } else {
        // Create a generic success case based on custom inspiration
        successCase = {
          id: 'custom',
          name: customInspiration || 'Inspiração Personalizada',
          company: 'Custom',
          sectorId: sectorId,
          descriptionPt: customInspiration || 'Baseado em inspirações personalizadas do usuário',
          descriptionEn: customInspiration || 'Based on user custom inspirations',
          descriptionEs: customInspiration || 'Basado en inspiraciones personalizadas del usuario',
          descriptionFr: customInspiration || 'Basé sur des inspirations personnalisées de l\'utilisateur',
          industry: sector.namePt || 'Custom',
          businessModel: 'Custom model based on user input',
          targetAudience: 'To be defined based on user needs',
          keyFeatures: [],
          successMetrics: 'Custom metrics',
          createdAt: new Date(),
        };
      }
      
      // Import AI service dynamically
      const { aiGenerationService } = await import("./aiGenerationService");
      
      // Generate complete MVP (this takes 5-10 minutes)
      const generatedMVP = await aiGenerationService.generateCompleteMVP(
        req.session.userId!,
        {
          sector,
          successCase,
          userProblemDescription,
          customInspiration,
          language,
        }
      );
      
      // Create project
      const project = await storage.createProject({
        ...generatedMVP.project,
        userId: req.session.userId!,
      });
      
      // Create personas
      for (const persona of generatedMVP.personas) {
        await storage.createPersona({
          ...persona,
          projectId: project.id,
        });
      }
      
      // Create POV statements
      for (const pov of generatedMVP.povStatements) {
        await storage.createPovStatement({
          ...pov,
          projectId: project.id,
        });
      }
      
      // Create ideas
      for (const idea of generatedMVP.ideas) {
        await storage.createIdea({
          ...idea,
          projectId: project.id,
        });
      }
      
      // Save AI-generated assets
      console.log(`📦 About to save AI-generated assets for project ${project.id}`);
      try {
        await aiGenerationService.saveGeneratedAssets(project.id, generatedMVP);
        console.log(`✅ AI-generated assets saved successfully for project ${project.id}`);
      } catch (assetError) {
        console.error(`❌ CRITICAL: Failed to save AI-generated assets for project ${project.id}:`, assetError);
        console.error(`❌ Asset Error Stack:`, assetError instanceof Error ? assetError.stack : 'No stack');
        // Don't throw - let the MVP creation continue even if assets fail
      }
      
      // Update user progress
      await storage.updateUserProgress({
        userId: req.session.userId!,
        projectId: project.id, // Link progress to the generated project
        phase: 5, // AI-generated MVP completes all 5 Design Thinking phases
        projectsCompleted: 1,
        totalPoints: 500, // Award points for AI-generated project
        badgesEarned: ["ai_pioneer"],
      });
      
      // Increment AI projects used counter
      await incrementAiProjectsUsed(req.session.userId!);
      
      res.json({
        project,
        generationCosts: generatedMVP.generationCosts,
        message: "MVP successfully generated",
      });
      
    } catch (error) {
      console.error("❌ [AI Generation Error] Full error:", error);
      console.error("❌ [AI Generation Error] Stack:", error instanceof Error ? error.stack : 'No stack trace');
      console.error("❌ [AI Generation Error] Message:", error instanceof Error ? error.message : error);
      
      res.status(500).json({ 
        error: "Failed to generate project",
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      });
    }
  });

  // Get AI-generated assets for a project
  app.get("/api/projects/:projectId/ai-assets", requireAuth, async (req, res) => {
    try {
      // Admin can access all projects, users can only access their own
      const isAdmin = req.session.user?.role === "admin";
      let project;
      
      if (isAdmin) {
        // Admin: get project without userId restriction
        const allProjects = await storage.getAllProjects();
        project = allProjects.find(p => p.id === req.params.projectId);
      } else {
        // Regular user: get project with userId restriction
        project = await storage.getProject(req.params.projectId, req.session.userId!);
      }
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const assets = await storage.getAiGeneratedAssets(req.params.projectId);
      res.json(assets);
      
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI assets" });
    }
  });

  // Get specific AI-generated asset by type
  app.get("/api/projects/:projectId/ai-assets/:assetType", requireAuth, async (req, res) => {
    try {
      // Admin can access all projects, users can only access their own
      const isAdmin = req.session.user?.role === "admin";
      let project;
      
      if (isAdmin) {
        // Admin: get project without userId restriction
        const allProjects = await storage.getAllProjects();
        project = allProjects.find(p => p.id === req.params.projectId);
      } else {
        // Regular user: get project with userId restriction
        project = await storage.getProject(req.params.projectId, req.session.userId!);
      }
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const assets = await storage.getAiGeneratedAssets(req.params.projectId);
      const asset = assets.find(a => a.assetType === req.params.assetType);
      
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      
      res.json(asset);
      
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI asset" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      // Try to find user by email first, then by username (backwards compatibility)
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Try username for backwards compatibility with old accounts
        user = await storage.getUserByUsername(email);
      }
      
      if (!user) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      // Create session
      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      req.session.user = {
        id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        role: userWithoutPassword.role,
        createdAt: userWithoutPassword.createdAt || new Date()
      };

      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Signup route
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }

      // Check if email already exists
      const existingEmailUser = await storage.getUserByEmail(email);
      if (existingEmailUser) {
        return res.status(400).json({ error: "Este email já está em uso" });
      }

      // Use email as username (simpler and already unique)
      const username = email;

      // CRITICAL: Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      // Get Free plan to assign to new users (case-insensitive search)
      const allPlans = await storage.getSubscriptionPlans();
      const freePlan = allPlans.find(p => p.name.toLowerCase() === "free");
      
      if (!freePlan) {
        console.error("❌ Free plan not found in database!");
        console.error("Available plans:", allPlans.map(p => p.name).join(", "));
        return res.status(500).json({ error: "Erro de configuração do sistema. Contate o suporte." });
      }

      // Create new user with Free plan automatically assigned
      const userData = {
        username, // Auto-generated from email
        email,
        name, // Display name provided by user
        password: hashedPassword, // Store hashed password
        role: "user",
        subscriptionPlanId: freePlan.id, // Automatically assign Free plan
        subscriptionStatus: "active" as const,
      };

      const user = await storage.createUser(userData);
      console.log(`✅ User created successfully with Free plan: ${user.email}`);
      
      // Create session after signup (auto-login)
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role || "user",
        createdAt: user.createdAt || new Date()
      };
      
      // Save session before sending response
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error after signup:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, message: "Conta criada com sucesso!" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Erro ao criar conta. Tente novamente." });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie('dttools.session');
        res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", passport.authenticate("google", { 
    scope: ["profile", "email"] 
  }));

  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { 
      failureRedirect: "/login?error=oauth_failed",
      failureMessage: true 
    }),
    (req, res) => {
      // Successful authentication
      if (req.user) {
        const user = req.user as any;
        
        // Create session
        req.session.userId = user.id;
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role || "user",
          createdAt: user.createdAt || new Date()
        };
        
        // Save session and redirect
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.redirect("/login?error=session_failed");
          }
          // Redirect to dashboard after successful login
          res.redirect("/dashboard");
        });
      } else {
        res.redirect("/login?error=no_user");
      }
    }
  );

  // Check current session/user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId || !req.session?.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Always fetch fresh user data from database to include all fields like profilePicture
      const freshUser = await storage.getUser(req.session.userId);
      if (!freshUser) {
        return res.status(401).json({ error: "User not found" });
      }
      
      // Update session with latest role if it changed
      if (freshUser.role !== req.session.user.role) {
        req.session.user = {
          id: freshUser.id,
          username: freshUser.username,
          role: freshUser.role,
          createdAt: freshUser.createdAt || new Date()
        };
      }
      
      // Return complete user data (without password)
      const { password: _, ...userWithoutPassword } = freshUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ error: "Failed to check authentication" });
    }
  });

  // User profile routes
  app.get("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove password from response
      const { password: _, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  app.put("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      console.log("[Profile Update] User ID:", req.user.id);
      console.log("[Profile Update] Received fields:", Object.keys(req.body));
      console.log("[Profile Update] Has profile_picture:", !!req.body.profile_picture);
      if (req.body.profile_picture) {
        console.log("[Profile Update] profile_picture size:", req.body.profile_picture.length, "chars");
      }

      const validatedData = updateProfileSchema.parse(req.body);
      console.log("[Profile Update] Validated fields:", Object.keys(validatedData));
      console.log("[Profile Update] Has profilePicture after validation:", !!validatedData.profilePicture);
      
      const user = await storage.updateUser(req.user.id, validatedData);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log("[Profile Update] User updated. Has profilePicture:", !!user.profilePicture);
      if (user.profilePicture) {
        console.log("[Profile Update] Saved profilePicture size:", user.profilePicture.length, "chars");
      }

      // Update session user data  
      if (req.session?.user) {
        req.session.user = {
          ...req.session.user,
          username: user.email, // Use email as username
        };
      }

      // Remove password from response
      const { password: _, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      console.error("[Profile Update] Error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to update user profile" });
      }
    }
  });

  // User management routes (admin only)
  app.get("/api/users", requireAdmin, async (_req, res) => {
    try {
      const users = await storage.getUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      console.log("[Create User] Request body:", req.body);
      const validatedData = insertUserSchema.parse(req.body);
      console.log("[Create User] Validated data:", validatedData);
      
      // Ensure password exists
      if (!validatedData.password) {
        return res.status(400).json({ error: "Password is required" });
      }
      
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const userDataWithHashedPassword = {
        ...validatedData,
        password: hashedPassword
      };
      
      const user = await storage.createUser(userDataWithHashedPassword);
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("[Create User] Error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid user data" });
      }
    }
  });

  app.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Update user custom limits (admin only)
  app.put("/api/users/:id/limits", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { customMaxProjects, customMaxDoubleDiamondProjects, customAiChatLimit } = req.body;
      
      await storage.updateUserLimits(req.params.id, {
        customMaxProjects,
        customMaxDoubleDiamondProjects,
        customAiChatLimit,
      });
      
      res.json({ message: "Limites atualizados com sucesso" });
    } catch (error) {
      console.error("Error updating user limits:", error);
      res.status(500).json({ error: "Failed to update limits" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      console.log(`[API DELETE USER] Starting deletion of user ${req.params.id}`);
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        console.log(`[API DELETE USER] User not found: ${req.params.id}`);
        return res.status(404).json({ error: "User not found" });
      }
      console.log(`[API DELETE USER] ✅ Successfully deleted user ${req.params.id}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error(`[API DELETE USER] ❌ EXCEPTION:`, error);
      console.error(`[API DELETE USER] Error code: ${error?.code}`);
      console.error(`[API DELETE USER] Error message: ${error?.message}`);
      console.error(`[API DELETE USER] Error stack:`, error?.stack);
      
      // Return detailed error to help debug
      res.status(500).json({ 
        error: "Failed to delete user", 
        details: {
          message: error?.message,
          code: error?.code,
          constraint: error?.constraint,
          table: error?.table,
          detail: error?.detail,
          stack: error?.stack?.split('\n').slice(0, 5).join('\n')
        }
      });
    }
  });

  // Admin: manage per-user add-ons (Double Diamond Pro, Export Pro, IA Turbo, etc.)
  app.get("/api/admin/users/:id/addons", requireAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const activeAddons = await storage.getActiveUserAddons(userId);

      const addonKeys = new Set(activeAddons.map((addon) => addon.addonKey));

      res.json({
        addons: {
          doubleDiamondPro: addonKeys.has("double_diamond_pro"),
          exportPro: addonKeys.has("export_pro"),
          aiTurbo: addonKeys.has("ai_turbo"),
          collabAdvanced: addonKeys.has("collab_advanced"),
          libraryPremium: addonKeys.has("library_premium"),
        },
        raw: activeAddons,
      });
    } catch (error) {
      console.error("Error fetching user addons:", error);
      res.status(500).json({ error: "Failed to fetch user addons" });
    }
  });

  app.put("/api/admin/users/:id/addons", requireAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        doubleDiamondPro,
        exportPro,
        aiTurbo,
        collabAdvanced,
        libraryPremium,
      } = req.body || {};

      const currentAddons = await storage.getUserAddons(userId);

      const updateAddon = async (addonKey: string, enabled: boolean | undefined) => {
        if (typeof enabled !== "boolean") return;

        const existingForKey = currentAddons.filter((addon) => addon.addonKey === addonKey);
        const activeForKey = existingForKey.filter((addon) => addon.status === "active");

        if (enabled) {
          if (activeForKey.length === 0) {
            await storage.createUserAddon({
              userId,
              addonKey,
              status: "active",
              source: "admin",
              billingPeriod: null,
              stripeSubscriptionId: null,
              currentPeriodStart: new Date(),
              currentPeriodEnd: null,
            });
          }
        } else {
          if (activeForKey.length > 0) {
            await Promise.all(
              activeForKey.map((addon) =>
                storage.updateUserAddon(addon.id, { status: "canceled" })
              )
            );
          }
        }
      };

      await Promise.all([
        updateAddon("double_diamond_pro", doubleDiamondPro),
        updateAddon("export_pro", exportPro),
        updateAddon("ai_turbo", aiTurbo),
        updateAddon("collab_advanced", collabAdvanced),
        updateAddon("library_premium", libraryPremium),
      ]);

      const activeAddons = await storage.getActiveUserAddons(userId);
      const addonKeys = new Set(activeAddons.map((addon) => addon.addonKey));

      res.json({
        message: "Add-ons atualizados com sucesso",
        addons: {
          doubleDiamondPro: addonKeys.has("double_diamond_pro"),
          exportPro: addonKeys.has("export_pro"),
          aiTurbo: addonKeys.has("ai_turbo"),
          collabAdvanced: addonKeys.has("collab_advanced"),
          libraryPremium: addonKeys.has("library_premium"),
        },
        raw: activeAddons,
      });
    } catch (error) {
      console.error("Error updating user addons:", error);
      res.status(500).json({ error: "Failed to update user addons" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const users = await storage.getUsers();
      const projects = await storage.getAllProjects();
      const articles = await storage.getArticles();
      const doubleDiamondProjects = await storage.getAllDoubleDiamondProjects();
      const videos = await storage.getVideoTutorials();
      const testimonials = await storage.getTestimonials();
      const plans = await storage.getSubscriptionPlans();
      // ... (rest of the code remains the same)
      
      const stats = {
        totalUsers: users.length,
        totalProjects: projects.length,
        totalArticles: articles.length,
        totalDoubleDiamondProjects: doubleDiamondProjects.length,
        totalVideos: videos.length,
        totalTestimonials: testimonials.length,
        totalPlans: plans.length,
        projectsByStatus: {
          in_progress: projects.filter(p => p.status === 'in_progress').length,
          completed: projects.filter(p => p.status === 'completed').length,
        },
        projectsByPhase: {
          phase1: projects.filter(p => p.currentPhase === 1).length,
          phase2: projects.filter(p => p.currentPhase === 2).length,
          phase3: projects.filter(p => p.currentPhase === 3).length,
          phase4: projects.filter(p => p.currentPhase === 4).length,
          phase5: projects.filter(p => p.currentPhase === 5).length,
        },
        doubleDiamondByPhase: {
          discover: doubleDiamondProjects.filter(p => p.currentPhase === 'discover').length,
          define: doubleDiamondProjects.filter(p => p.currentPhase === 'define').length,
          develop: doubleDiamondProjects.filter(p => p.currentPhase === 'develop').length,
          deliver: doubleDiamondProjects.filter(p => p.currentPhase === 'deliver').length,
          dfv: doubleDiamondProjects.filter(p => p.currentPhase === 'dfv').length,
        },
        doubleDiamondByStatus: {
          pending: doubleDiamondProjects.filter(p => p.discoverStatus === 'pending').length,
          in_progress: doubleDiamondProjects.filter(p => p.discoverStatus === 'in_progress' || p.defineStatus === 'in_progress' || p.developStatus === 'in_progress' || p.deliverStatus === 'in_progress').length,
          completed: doubleDiamondProjects.filter(p => p.deliverStatus === 'completed').length,
        },
        usersByRole: {
          admin: users.filter(u => u.role === 'admin').length,
          user: users.filter(u => u.role === 'user').length,
        },
        articlesByCategory: {
          empathize: articles.filter(a => a.category === 'empathize').length,
          define: articles.filter(a => a.category === 'define').length,
          ideate: articles.filter(a => a.category === 'ideate').length,
          prototype: articles.filter(a => a.category === 'prototype').length,
          test: articles.filter(a => a.category === 'test').length,
        },
        articlesWithTranslations: {
          withEnglish: articles.filter(a => a.titleEn && a.contentEn).length,
          withSpanish: articles.filter(a => a.titleEs && a.contentEs).length,
          withFrench: articles.filter(a => a.titleFr && a.contentFr).length,
          fullyTranslated: articles.filter(a => a.titleEn && a.contentEn && a.titleEs && a.contentEs && a.titleFr && a.contentFr).length,
        }
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  // Admin route to get ALL projects (not filtered by user)
  app.get("/api/admin/projects", requireAdmin, async (_req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Analytics routes
  app.get("/api/admin/analytics/summary", requireAdmin, async (_req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics summary" });
    }
  });

  app.get("/api/admin/analytics/events", requireAdmin, async (req, res) => {
    try {
      const { eventType, userId, startDate, endDate } = req.query;
      const filters: any = {};
      
      if (eventType && typeof eventType === 'string') filters.eventType = eventType;
      if (userId && typeof userId === 'string') filters.userId = userId;
      if (startDate && typeof startDate === 'string') filters.startDate = new Date(startDate);
      if (endDate && typeof endDate === 'string') filters.endDate = new Date(endDate);
      
      const events = await storage.getAnalyticsEvents(filters);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics events" });
    }
  });

  // Subscription Plans routes
  app.get("/api/subscription-plans", async (_req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plans" });
    }
  });

  app.get("/api/subscription-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getSubscriptionPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plan" });
    }
  });

  // Admin routes for subscription plans
  app.post("/api/subscription-plans", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSubscriptionPlanSchema.parse(req.body);
      const plan = await storage.createSubscriptionPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ error: "Invalid subscription plan data" });
    }
  });

  app.put("/api/subscription-plans/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSubscriptionPlanSchema.partial().parse(req.body);
      const plan = await storage.updateSubscriptionPlan(req.params.id, validatedData);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: "Invalid subscription plan data" });
    }
  });

  // User Subscription routes
  app.get("/api/user/subscription", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const subscription = await storage.getUserActiveSubscription(req.user.id);
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user subscription" });
    }
  });

  // Create Stripe Checkout Session
  app.post("/api/create-checkout-session", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { planId, billingPeriod } = req.body;
      
      if (!planId || !billingPeriod) {
        return res.status(400).json({ error: "Plan ID and billing period are required" });
      }

      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }

      // Free plan doesn't need Stripe
      if (plan.name === "free") {
        const subscription = await storage.createUserSubscription({
          userId: req.user.id,
          planId: plan.id,
          status: "active",
          billingPeriod: "monthly"
        });
        return res.json({ subscription });
      }

      // Paid plans require Stripe
      if (!stripe) {
        return res.status(503).json({ error: "Payment system not configured. Please contact support." });
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.username,
          metadata: {
            userId: user.id,
          },
        });
        stripeCustomerId = customer.id;
        
        // Update user with stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId });
      }

      const price = billingPeriod === "yearly" ? plan.priceYearly : plan.priceMonthly;
      
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: plan.displayName,
                description: plan.description || undefined,
              },
              unit_amount: price,
              recurring: {
                interval: billingPeriod === "yearly" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        metadata: {
          userId: req.user.id,
          planId: plan.id,
          billingPeriod,
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Note: Stripe webhook is now defined at the top of registerRoutes (before express.json middleware)
  // to ensure raw body is available for signature verification

  // Cancel subscription
  app.post("/api/cancel-subscription", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Stripe not configured" });
      }
      
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user?.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found" });
      }

      // Cancel the subscription at period end
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update local subscription
      const userSub = await storage.getUserActiveSubscription(req.user.id);
      if (userSub) {
        await storage.cancelUserSubscription(userSub.id);
      }

      res.json({ success: true, message: "Subscription will be canceled at the end of the billing period" });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // AI Chat routes
  app.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { messages, context }: { messages: ChatMessage[], context: DesignThinkingContext } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      if (!context || typeof context.currentPhase !== 'number') {
        return res.status(400).json({ error: "Valid context with currentPhase is required" });
      }

      // Use Gemini AI instead of OpenAI for cost efficiency
      const lastMessage = messages[messages.length - 1];
      const response = await designThinkingGeminiAI.chat(lastMessage.content, context);
      res.json({ message: response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      // Always return 200 with helpful message, since chat() method now handles fallbacks gracefully
      res.json({ message: "Desculpe, houve um problema temporário. Tente novamente ou continue usando as ferramentas de Design Thinking disponíveis na plataforma." });
    }
  });

  app.post("/api/chat/suggestions", requireAuth, async (req, res) => {
    try {
      const { context, topic }: { context: DesignThinkingContext, topic: string } = req.body;
      
      if (!context || typeof context.currentPhase !== 'number') {
        return res.status(400).json({ error: "Valid context with currentPhase is required" });
      }

      if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ error: "Topic is required" });
      }

      // Use Gemini AI instead of OpenAI for cost efficiency
      const suggestions = await designThinkingGeminiAI.generateSuggestions(context);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  app.post("/api/projects/:projectId/analyze", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { currentPhase } = req.body;
      const userId = req.session!.userId!;
      
      // Get project data
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Get phase-specific data
      const empathyMaps = await storage.getEmpathyMaps(projectId);
      const personas = await storage.getPersonas(projectId);
      const interviews = await storage.getInterviews(projectId);
      const observations = await storage.getObservations(projectId);
      const povStatements = await storage.getPovStatements(projectId);
      const hmwQuestions = await storage.getHmwQuestions(projectId);
      const ideas = await storage.getIdeas(projectId);
      const prototypes = await storage.getPrototypes(projectId);
      const testPlans = await storage.getTestPlans(projectId);

      const projectData = {
        project,
        empathyMaps,
        personas,
        interviews,
        observations,
        povStatements,
        hmwQuestions,
        ideas,
        prototypes,
        testPlans
      };

      const analysis = await designThinkingAI.analyzeProjectPhase(projectData, currentPhase || project.currentPhase);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing project:", error);
      res.status(500).json({ error: "Failed to analyze project" });
    }
  });

  // Comprehensive AI Analysis endpoint
  app.post("/api/projects/:projectId/ai-analysis", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.session!.userId!;
      
      // Get project data
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Get all project data across all phases
      const empathyMaps = await storage.getEmpathyMaps(projectId);
      const personas = await storage.getPersonas(projectId);
      const interviews = await storage.getInterviews(projectId);
      const observations = await storage.getObservations(projectId);
      const povStatements = await storage.getPovStatements(projectId);
      const hmwQuestions = await storage.getHmwQuestions(projectId);
      const ideas = await storage.getIdeas(projectId);
      const prototypes = await storage.getPrototypes(projectId);
      const testPlans = await storage.getTestPlans(projectId);

      // Get test results for all test plans
      const testResults: any[] = [];
      for (const testPlan of testPlans) {
        const results = await storage.getTestResults(testPlan.id);
        testResults.push(...results);
      }

      const analysisData = {
        project,
        empathyMaps,
        personas,
        interviews,
        observations,
        povStatements,
        hmwQuestions,
        ideas,
        prototypes,
        testPlans,
        testResults
      };

      const analysis = await designThinkingAI.analyzeCompleteProject(analysisData);
      res.json(analysis);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      if (error instanceof Error && error.message.includes('OpenAI')) {
        res.status(503).json({ error: "AI service temporarily unavailable. Please check API configuration." });
      } else {
        res.status(500).json({ error: "Failed to generate AI analysis" });
      }
    }
  });

  // Canvas Drawings Routes
  // GET /api/canvas-drawings/:projectId
  app.get("/api/canvas-drawings/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const drawings = await storage.getCanvasDrawings(projectId);
      res.json(drawings);
    } catch (error) {
      console.error("Error fetching canvas drawings:", error);
      res.status(500).json({ error: "Failed to fetch canvas drawings" });
    }
  });

  // POST /api/canvas-drawings
  app.post("/api/canvas-drawings", requireAuth, async (req, res) => {
    try {
      const parsed = insertCanvasDrawingSchema.parse(req.body);
      const drawing = await storage.createCanvasDrawing(parsed);
      res.status(201).json(drawing);
    } catch (error) {
      console.error("Error creating canvas drawing:", error);
      res.status(500).json({ error: "Failed to create canvas drawing" });
    }
  });

  // PUT /api/canvas-drawings/:id
  app.put("/api/canvas-drawings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertCanvasDrawingSchema.partial().parse(req.body);
      const drawing = await storage.updateCanvasDrawing(id, parsed);
      
      if (!drawing) {
        return res.status(404).json({ error: "Canvas drawing not found" });
      }
      
      res.json(drawing);
    } catch (error) {
      console.error("Error updating canvas drawing:", error);
      res.status(500).json({ error: "Failed to update canvas drawing" });
    }
  });

  // DELETE /api/canvas-drawings/:id
  app.delete("/api/canvas-drawings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCanvasDrawing(id);
      
      if (!success) {
        return res.status(404).json({ error: "Canvas drawing not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting canvas drawing:", error);
      res.status(500).json({ error: "Failed to delete canvas drawing" });
    }
  });

  // Phase Cards (Kanban) Routes
  // GET /api/phase-cards/:projectId
  app.get("/api/phase-cards/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const cards = await storage.getPhaseCards(projectId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching phase cards:", error);
      res.status(500).json({ error: "Failed to fetch phase cards" });
    }
  });

  // POST /api/phase-cards
  app.post("/api/phase-cards", requireAuth, async (req, res) => {
    try {
      const parsed = insertPhaseCardSchema.parse(req.body);
      const card = await storage.createPhaseCard(parsed);
      res.status(201).json(card);
    } catch (error) {
      console.error("Error creating phase card:", error);
      res.status(500).json({ error: "Failed to create phase card" });
    }
  });

  // PUT /api/phase-cards/:id
  app.put("/api/phase-cards/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertPhaseCardSchema.partial().parse(req.body);
      const card = await storage.updatePhaseCard(id, parsed);
      
      if (!card) {
        return res.status(404).json({ error: "Phase card not found" });
      }
      
      res.json(card);
    } catch (error) {
      console.error("Error updating phase card:", error);
      res.status(500).json({ error: "Failed to update phase card" });
    }
  });

  // DELETE /api/phase-cards/:id
  app.delete("/api/phase-cards/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePhaseCard(id);
      
      if (!success) {
        return res.status(404).json({ error: "Phase card not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting phase card:", error);
      res.status(500).json({ error: "Failed to delete phase card" });
    }
  });

  // Project Backup Routes
  // POST /api/projects/:projectId/backups - Create manual backup
  app.post("/api/projects/:projectId/backups", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { description } = req.body;
      
      const backup = await storage.createProjectBackup(projectId, 'manual', description);
      res.status(201).json(backup);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ error: "Failed to create backup" });
    }
  });

  // GET /api/projects/:projectId/backups - List all backups for a project
  app.get("/api/projects/:projectId/backups", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const backups = await storage.getProjectBackups(projectId);
      res.json(backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      res.status(500).json({ error: "Failed to fetch backups" });
    }
  });

  // GET /api/backups/:id - Get specific backup details
  app.get("/api/backups/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const backup = await storage.getProjectBackup(id);
      
      if (!backup) {
        return res.status(404).json({ error: "Backup not found" });
      }
      
      res.json(backup);
    } catch (error) {
      console.error("Error fetching backup:", error);
      res.status(500).json({ error: "Failed to fetch backup" });
    }
  });

  // POST /api/backups/:id/restore - Restore project from backup
  app.post("/api/backups/:id/restore", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.restoreProjectBackup(id);
      
      if (!success) {
        return res.status(404).json({ error: "Backup not found or restore failed" });
      }
      
      res.json({ success: true, message: "Project restored successfully" });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({ error: "Failed to restore backup" });
    }
  });

  // DELETE /api/backups/:id - Delete a backup
  app.delete("/api/backups/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProjectBackup(id);
      
      if (!success) {
        return res.status(404).json({ error: "Backup not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting backup:", error);
      res.status(500).json({ error: "Failed to delete backup" });
    }
  });

  // Benchmarking Routes
  // GET /api/benchmarks/:projectId
  app.get("/api/benchmarks/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const benchmarks = await storage.getBenchmarks(projectId);
      res.json(benchmarks);
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      res.status(500).json({ error: "Failed to fetch benchmarks" });
    }
  });

  // GET /api/benchmarks/detail/:id
  app.get("/api/benchmarks/detail/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const benchmark = await storage.getBenchmark(id);
      
      if (!benchmark) {
        return res.status(404).json({ error: "Benchmark not found" });
      }
      
      res.json(benchmark);
    } catch (error) {
      console.error("Error fetching benchmark:", error);
      res.status(500).json({ error: "Failed to fetch benchmark" });
    }
  });

  // POST /api/benchmarks
  app.post("/api/benchmarks", requireAuth, async (req, res) => {
    try {
      const parsed = insertBenchmarkSchema.parse(req.body);
      const benchmark = await storage.createBenchmark(parsed);
      res.status(201).json(benchmark);
    } catch (error) {
      console.error("Error creating benchmark:", error);
      res.status(500).json({ error: "Failed to create benchmark" });
    }
  });

  // PUT /api/benchmarks/:id
  app.put("/api/benchmarks/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertBenchmarkSchema.partial().parse(req.body);
      const benchmark = await storage.updateBenchmark(id, parsed);
      
      if (!benchmark) {
        return res.status(404).json({ error: "Benchmark not found" });
      }
      
      res.json(benchmark);
    } catch (error) {
      console.error("Error updating benchmark:", error);
      res.status(500).json({ error: "Failed to update benchmark" });
    }
  });

  // DELETE /api/benchmarks/:id
  app.delete("/api/benchmarks/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBenchmark(id);
      
      if (!success) {
        return res.status(404).json({ error: "Benchmark not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting benchmark:", error);
      res.status(500).json({ error: "Failed to delete benchmark" });
    }
  });

  // Benchmark Assessment Routes
  // GET /api/benchmark-assessments/:benchmarkId
  app.get("/api/benchmark-assessments/:benchmarkId", requireAuth, async (req, res) => {
    try {
      const { benchmarkId } = req.params;
      const assessments = await storage.getBenchmarkAssessments(benchmarkId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching benchmark assessments:", error);
      res.status(500).json({ error: "Failed to fetch benchmark assessments" });
    }
  });

  // POST /api/benchmark-assessments
  app.post("/api/benchmark-assessments", requireAuth, async (req, res) => {
    try {
      const parsed = insertBenchmarkAssessmentSchema.parse(req.body);
      const assessment = await storage.createBenchmarkAssessment(parsed);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating benchmark assessment:", error);
      res.status(500).json({ error: "Failed to create benchmark assessment" });
    }
  });

  // PUT /api/benchmark-assessments/:id
  app.put("/api/benchmark-assessments/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertBenchmarkAssessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateBenchmarkAssessment(id, parsed);
      
      if (!assessment) {
        return res.status(404).json({ error: "Benchmark assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error("Error updating benchmark assessment:", error);
      res.status(500).json({ error: "Failed to update benchmark assessment" });
    }
  });

  // DELETE /api/benchmark-assessments/:id
  app.delete("/api/benchmark-assessments/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBenchmarkAssessment(id);
      
      if (!success) {
        return res.status(404).json({ error: "Benchmark assessment not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting benchmark assessment:", error);
      res.status(500).json({ error: "Failed to delete benchmark assessment" });
    }
  });

  // DVF Assessment Routes (Desirability, Feasibility, Viability)
  // GET /api/dvf-assessments/:projectId
  app.get("/api/dvf-assessments/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const assessments = await storage.getDvfAssessments(projectId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching DVF assessments:", error);
      res.status(500).json({ error: "Failed to fetch DVF assessments" });
    }
  });

  // POST /api/dvf-assessments
  app.post("/api/dvf-assessments", requireAuth, async (req, res) => {
    try {
      const parsed = insertDvfAssessmentSchema.parse(req.body);
      const assessment = await storage.createDvfAssessment(parsed);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating DVF assessment:", error);
      res.status(500).json({ error: "Failed to create DVF assessment" });
    }
  });

  // PUT /api/dvf-assessments/:id
  app.put("/api/dvf-assessments/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertDvfAssessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateDvfAssessment(id, parsed);
      
      if (!assessment) {
        return res.status(404).json({ error: "DVF assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error("Error updating DVF assessment:", error);
      res.status(500).json({ error: "Failed to update DVF assessment" });
    }
  });

  // DELETE /api/dvf-assessments/:id
  app.delete("/api/dvf-assessments/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDvfAssessment(id);
      
      if (!success) {
        return res.status(404).json({ error: "DVF assessment not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting DVF assessment:", error);
      res.status(500).json({ error: "Failed to delete DVF assessment" });
    }
  });

  // Lovability Metrics Routes
  // GET /api/lovability-metrics/:projectId
  app.get("/api/lovability-metrics/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const metrics = await storage.getLovabilityMetrics(projectId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching lovability metrics:", error);
      res.status(500).json({ error: "Failed to fetch lovability metrics" });
    }
  });

  // POST /api/lovability-metrics
  app.post("/api/lovability-metrics", requireAuth, async (req, res) => {
    try {
      const parsed = insertLovabilityMetricSchema.parse(req.body);
      const metric = await storage.createLovabilityMetric(parsed);
      res.status(201).json(metric);
    } catch (error) {
      console.error("Error creating lovability metric:", error);
      res.status(500).json({ error: "Failed to create lovability metric" });
    }
  });

  // PUT /api/lovability-metrics/:id
  app.put("/api/lovability-metrics/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertLovabilityMetricSchema.partial().parse(req.body);
      const metric = await storage.updateLovabilityMetric(id, parsed);
      
      if (!metric) {
        return res.status(404).json({ error: "Lovability metric not found" });
      }
      
      res.json(metric);
    } catch (error) {
      console.error("Error updating lovability metric:", error);
      res.status(500).json({ error: "Failed to update lovability metric" });
    }
  });

  // DELETE /api/lovability-metrics/:id
  app.delete("/api/lovability-metrics/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteLovabilityMetric(id);
      
      if (!success) {
        return res.status(404).json({ error: "Lovability metric not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting lovability metric:", error);
      res.status(500).json({ error: "Failed to delete lovability metric" });
    }
  });

  // Project Analytics Routes
  // GET /api/project-analytics/:projectId
  app.get("/api/project-analytics/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const analytics = await storage.getProjectAnalytics(projectId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching project analytics:", error);
      res.status(500).json({ error: "Failed to fetch project analytics" });
    }
  });

  // POST /api/project-analytics
  app.post("/api/project-analytics", requireAuth, async (req, res) => {
    try {
      const parsed = insertProjectAnalyticsSchema.parse(req.body);
      const analytics = await storage.createProjectAnalytics(parsed);
      res.status(201).json(analytics);
    } catch (error) {
      console.error("Error creating project analytics:", error);
      res.status(500).json({ error: "Failed to create project analytics" });
    }
  });

  // PUT /api/project-analytics/:id
  app.put("/api/project-analytics/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertProjectAnalyticsSchema.partial().parse(req.body);
      const analytics = await storage.updateProjectAnalytics(id, parsed);
      
      if (!analytics) {
        return res.status(404).json({ error: "Project analytics not found" });
      }
      
      res.json(analytics);
    } catch (error) {
      console.error("Error updating project analytics:", error);
      res.status(500).json({ error: "Failed to update project analytics" });
    }
  });

  // Competitive Analysis Routes
  // GET /api/competitive-analysis/:projectId
  app.get("/api/competitive-analysis/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const analyses = await storage.getCompetitiveAnalyses(projectId);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching competitive analyses:", error);
      res.status(500).json({ error: "Failed to fetch competitive analyses" });
    }
  });

  // POST /api/competitive-analysis
  app.post("/api/competitive-analysis", requireAuth, async (req, res) => {
    try {
      const parsed = insertCompetitiveAnalysisSchema.parse(req.body);
      const analysis = await storage.createCompetitiveAnalysis(parsed);
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Error creating competitive analysis:", error);
      res.status(500).json({ error: "Failed to create competitive analysis" });
    }
  });

  // PUT /api/competitive-analysis/:id
  app.put("/api/competitive-analysis/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = insertCompetitiveAnalysisSchema.partial().parse(req.body);
      const analysis = await storage.updateCompetitiveAnalysis(id, parsed);
      
      if (!analysis) {
        return res.status(404).json({ error: "Competitive analysis not found" });
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Error updating competitive analysis:", error);
      res.status(500).json({ error: "Failed to update competitive analysis" });
    }
  });

  // DELETE /api/competitive-analysis/:id
  app.delete("/api/competitive-analysis/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCompetitiveAnalysis(id);
      
      if (!success) {
        return res.status(404).json({ error: "Competitive analysis not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting competitive analysis:", error);
      res.status(500).json({ error: "Failed to delete competitive analysis" });
    }
  });

  // AI Benchmarking Recommendations Route
  // POST /api/benchmarking/ai-recommendations/:projectId
  app.post("/api/benchmarking/ai-recommendations/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.session!.userId!;
      
      // Verify project ownership
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Collect all benchmarking data
      const [dvfAssessments, lovabilityMetrics, projectAnalytics, competitiveAnalyses] = await Promise.all([
        storage.getDvfAssessments(projectId),
        storage.getLovabilityMetrics(projectId),
        storage.getProjectAnalytics(projectId),
        storage.getCompetitiveAnalyses(projectId)
      ]);

      // Transform data for AI analysis
      const benchmarkingData = {
        projectId: project.id,
        projectName: project.name,
        projectDescription: project.description || undefined,
        
        // DVF data with calculated scores
        dvfAssessments: dvfAssessments.map((assessment: any) => ({
          desirabilityScore: assessment.desirabilityScore || 0,
          feasibilityScore: assessment.feasibilityScore || 0,
          viabilityScore: assessment.viabilityScore || 0,
          recommendation: assessment.recommendation || 'modify',
          overallScore: Math.round(((assessment.desirabilityScore || 0) + 
                                   (assessment.feasibilityScore || 0) + 
                                   (assessment.viabilityScore || 0)) / 3 * 10) / 10
        })),
        
        // Lovability metrics
        lovabilityMetrics: lovabilityMetrics.length > 0 ? {
          npsScore: lovabilityMetrics[0]?.npsScore || 0,
          satisfactionScore: lovabilityMetrics[0]?.satisfactionScore || 0,
          engagementRate: lovabilityMetrics[0]?.engagementTime || 0,
          emotionalDistribution: (lovabilityMetrics[0]?.emotionalDistribution as Record<string, number>) || {},
          overallLovabilityScore: lovabilityMetrics[0]?.lovabilityScore || 0
        } : undefined,
        
        // Project analytics
        projectAnalytics: projectAnalytics ? {
          completionRate: projectAnalytics.completionRate || 0,
          totalTimeSpent: projectAnalytics.totalTimeSpent || 0,
          teamSize: projectAnalytics.teamSize || 1,
          innovationLevel: projectAnalytics.innovationLevel || 0,
          overallSuccess: projectAnalytics.overallSuccess || 0,
          topPerformingTools: (projectAnalytics.topPerformingTools as string[]) || [],
          timeBottlenecks: (projectAnalytics.timeBottlenecks as string[]) || []
        } : undefined,
        
        // Competitive analysis
        competitiveAnalysis: competitiveAnalyses.map((analysis: any) => {
          const advantagesCount = Array.isArray(analysis.ourAdvantages) ? analysis.ourAdvantages.length : 0;
          const gapsCount = Array.isArray(analysis.functionalGaps) ? analysis.functionalGaps.length : 0;
          
          return {
            competitorName: analysis.competitorName || '',
            competitorType: analysis.competitorType || 'direct',
            marketPosition: analysis.marketPosition || 'challenger',
            ourAdvantages: (analysis.ourAdvantages as string[]) || [],
            functionalGaps: (analysis.functionalGaps as string[]) || [],
            competitivenessScore: Math.max(0, Math.min(10, (advantagesCount * 2) - (gapsCount * 0.5)))
          };
        })
      };

      // Import Gemini service
      const { designThinkingGeminiAI } = await import("./geminiService");
      
      // Generate AI recommendations
      const recommendations = await designThinkingGeminiAI.generateBenchmarkingRecommendations(benchmarkingData);
      
      res.json({
        success: true,
        data: {
          projectInfo: {
            name: project.name,
            description: project.description
          },
          dataCollected: {
            dvfAssessments: dvfAssessments.length,
            lovabilityMetrics: lovabilityMetrics.length,
            projectAnalytics: projectAnalytics ? 1 : 0,
            competitiveAnalyses: competitiveAnalyses.length
          },
          recommendations
        }
      });
      
    } catch (error) {
      console.error("Error generating AI benchmarking recommendations:", error);
      res.status(500).json({ 
        error: "Failed to generate AI recommendations",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ===== EXPORT ENDPOINTS (PPTX, PDF, MARKDOWN) =====
  
  // GET /api/projects/:id/export-pptx - Export project as PPTX
  app.get("/api/projects/:id/export-pptx", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session!.userId!;
      
      console.log(`[PPTX Export] Starting export for project ${id}, user ${userId}`);
      
      // Verify project ownership
      const project = await storage.getProject(id, userId);
      if (!project) {
        console.log(`[PPTX Export] Project not found: ${id}`);
        return res.status(404).json({ error: "Project not found" });
      }

      console.log(`[PPTX Export] Generating PPTX for project: ${project.name}`);
      
      // Generate PPTX with new brand template
      const pptxService = new PPTXService();
      const pptxBuffer = await pptxService.generateProjectPPTX(id, userId);
      
      console.log(`[PPTX Export] PPTX generated successfully, size: ${pptxBuffer.length} bytes`);
      
      // Set response headers for file download
      const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_DTTools.pptx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pptxBuffer.length);
      
      // CRITICAL: End the response properly without calling next()
      res.end(pptxBuffer);
      
    } catch (error) {
      console.error("[PPTX Export] Error generating PPTX:", error);
      // Return JSON error, not HTML
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to generate PPTX presentation" });
      }
    }
  });

  // GET /api/projects/:id/export-pdf - Export project as PDF
  app.get("/api/projects/:id/export-pdf", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session!.userId!;
      
      console.log(`[PDF Export] Starting export for project ${id}, user ${userId}`);
      
      // Verify project ownership
      const project = await storage.getProject(id, userId);
      if (!project) {
        console.log(`[PDF Export] Project not found: ${id}`);
        return res.status(404).json({ error: "Project not found" });
      }

      console.log(`[PDF Export] Generating PDF for project: ${project.name}`);
      
      // Generate PDF using PPTX service
      const pptxService = new PPTXService();
      const pdfBuffer = await pptxService.generateProjectPDF(id, userId);
      
      console.log(`[PDF Export] PDF generated successfully, size: ${pdfBuffer.length} bytes`);
      
      // Set response headers for file download
      const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_DTTools.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // CRITICAL: End the response properly without calling next()
      res.end(pdfBuffer);
      
    } catch (error) {
      console.error("[PDF Export] Error generating PDF:", error);
      // Return JSON error, not HTML
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to generate PDF document" });
      }
    }
  });

  // GET /api/projects/:id/export-markdown - Export project as Markdown
  app.get("/api/projects/:id/export-markdown", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session!.userId!;
      
      // Verify project ownership
      const project = await storage.getProject(id, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Generate Markdown
      const pptxService = new PPTXService();
      const markdown = await pptxService.generateProjectMarkdown(id, userId);
      
      // Set response headers for file download
      const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_DTTools.md`;
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(markdown, 'utf8'));
      
      // Send the markdown content
      res.send(markdown);
      
    } catch (error) {
      console.error("Error generating Markdown:", error);
      res.status(500).json({ error: "Failed to generate Markdown document" });
    }
  });

  // ===== HELP/WIKI SYSTEM ROUTES =====

  // GET /api/help - List all help articles
  app.get("/api/help", async (req, res) => {
    try {
      const { category, phase, featured } = req.query;
      let articles = await storage.getHelpArticles();
      
      // Filter by category if provided
      if (category && typeof category === 'string') {
        articles = articles.filter(a => a.category === category);
      }
      
      // Filter by phase if provided
      if (phase) {
        const phaseNum = parseInt(phase as string);
        articles = articles.filter(a => a.phase === phaseNum);
      }
      
      // Filter by featured if provided
      if (featured === 'true') {
        articles = articles.filter(a => a.featured);
      }
      
      // Sort by order
      articles.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      res.json(articles);
    } catch (error) {
      console.error("Error fetching help articles:", error);
      res.status(500).json({ error: "Failed to fetch help articles" });
    }
  });

  // GET /api/help/search - Search help articles
  app.get("/api/help/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query required" });
      }
      
      const searchTerm = q.toLowerCase();
      const articles = await storage.searchHelpArticles(searchTerm);
      
      res.json(articles);
    } catch (error) {
      console.error("Error searching help articles:", error);
      res.status(500).json({ error: "Failed to search help articles" });
    }
  });

  // GET /api/help/:slug - Get specific help article by slug
  app.get("/api/help/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getHelpArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ error: "Help article not found" });
      }
      
      // Increment view count and return updated article
      const updatedArticle = await storage.incrementHelpArticleViews(article.id);
      
      res.json(updatedArticle || article);
    } catch (error) {
      console.error("Error fetching help article:", error);
      res.status(500).json({ error: "Failed to fetch help article" });
    }
  });

  // POST /api/help/:id/helpful - Mark article as helpful
  app.post("/api/help/:id/helpful", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.incrementHelpArticleHelpful(id);
      
      if (!article) {
        return res.status(404).json({ error: "Help article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error marking article helpful:", error);
      res.status(500).json({ error: "Failed to mark article as helpful" });
    }
  });

  // GET /api/help/categories/list - Get list of all categories
  app.get("/api/help/categories/list", async (req, res) => {
    try {
      const articles = await storage.getHelpArticles();
      const categorySet = new Set<string>();
      articles.forEach(a => categorySet.add(a.category));
      const categories = Array.from(categorySet);
      
      res.json(categories);
    } catch (error) {
      console.error("Error fetching help categories:", error);
      res.status(500).json({ error: "Failed to fetch help categories" });
    }
  });

  // POST /api/help - Create new help article (Admin only)
  app.post("/api/help", requireAdmin, async (req, res) => {
    try {
      const articleData = req.body;
      const newArticle = await storage.createHelpArticle(articleData);
      res.json(newArticle);
    } catch (error) {
      console.error("Error creating help article:", error);
      res.status(500).json({ error: "Failed to create help article" });
    }
  });

  // PUT /api/help/:id - Update help article (Admin only)
  app.put("/api/help/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const articleData = req.body;
      const updatedArticle = await storage.updateHelpArticle(id, articleData);
      
      if (!updatedArticle) {
        return res.status(404).json({ error: "Help article not found" });
      }
      
      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating help article:", error);
      res.status(500).json({ error: "Failed to update help article" });
    }
  });

  // DELETE /api/help/:id - Delete help article (Admin only)
  app.delete("/api/help/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteHelpArticle(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Help article not found" });
      }
      
      res.json({ success: true, message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting help article:", error);
      res.status(500).json({ error: "Failed to delete help article" });
    }
  });

  // POST /api/help/seed - Seed initial help articles (Admin only)
  // Disabled: seed script not available
  // app.post("/api/help/seed", requireAdmin, async (req, res) => {
  //   res.status(501).json({ error: "Seed functionality not implemented" });
  // });

  // Serve clear-cache.html page directly from backend
  app.get("/clear-cache.html", (_req, res) => {
    const clearCachePath = path.join(process.cwd(), 'server', 'public', 'clear-cache.html');
    if (fs.existsSync(clearCachePath)) {
      res.sendFile(clearCachePath);
    } else {
      res.status(404).send("Clear cache page not found");
    }
  });

  // Admin endpoint to add subscription plan columns for additional users
  app.post("/api/admin/migrate-subscription-columns", requireAdmin, async (_req, res) => {
    try {
      // Add columns using Drizzle's execute method
      const db = (storage as any).db;
      
      // Try to add the columns
      try {
        await db.execute(`
          ALTER TABLE subscription_plans 
          ADD COLUMN IF NOT EXISTS included_users INTEGER,
          ADD COLUMN IF NOT EXISTS price_per_additional_user INTEGER
        `);
      } catch (alterError: any) {
        // If column already exists, that's ok
        if (!alterError.message?.includes('already exists')) {
          throw alterError;
        }
      }

      res.json({ 
        success: true, 
        message: 'Colunas de usuários adicionais criadas com sucesso!'
      });
    } catch (error) {
      console.error("Error migrating subscription columns:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to migrate subscription columns",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Check if migration is needed
  app.get("/api/admin/check-subscription-columns", requireAdmin, async (_req, res) => {
    try {
      const db = (storage as any).db;
      const result = await db.execute(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'subscription_plans' 
        AND column_name IN ('included_users', 'price_per_additional_user')
      `);
      
      const existingColumns = result.rows.map((row: any) => row.column_name);
      const needsMigration = !existingColumns.includes('included_users') || 
                             !existingColumns.includes('price_per_additional_user');
      
      res.json({ 
        needsMigration,
        existingColumns,
        message: needsMigration ? 
          'Migração necessária - execute /api/admin/migrate-subscription-columns' : 
          'Colunas já existem!'
      });
    } catch (error) {
      console.error("Error checking subscription columns:", error);
      res.status(500).json({ error: "Failed to check subscription columns" });
    }
  });

  // TEMPORARY: Create prenatal project for demo (Admin only)
  // Admin endpoint to update subscription plan prices
  app.post("/api/admin/update-subscription-prices", requireAdmin, async (_req, res) => {
    try {
      // Update Pro/Individual plan pricing
      const proPlan = await storage.getSubscriptionPlanByName('Pro');
      if (proPlan) {
        await storage.updateSubscriptionPlan(proPlan.id, {
          displayName: 'Plano Individual',
          priceMonthly: 4000, // R$ 40,00
          priceYearly: 43200, // R$ 432,00 (10% discount)
        });
      }

      // Update Enterprise plan pricing
      const enterprisePlan = await storage.getSubscriptionPlanByName('Enterprise');
      if (enterprisePlan) {
        await storage.updateSubscriptionPlan(enterprisePlan.id, {
          priceMonthly: 29900, // R$ 299,00
          priceYearly: 322920, // R$ 3.229,20 (10% discount)
          description: 'Plan empresarial com recursos completos (10 usuários inclusos)',
          features: ['Tudo do Pro', '10 usuários inclusos', 'Usuários adicionais: R$ 29,90/usuário', 'Time ilimitado', 'Suporte dedicado', 'Treinamentos'],
        });
      }

      res.json({ 
        success: true, 
        message: 'Preços atualizados com sucesso!',
        updated: {
          pro: !!proPlan,
          enterprise: !!enterprisePlan
        }
      });
    } catch (error) {
      console.error("Error updating subscription prices:", error);
      res.status(500).json({ error: "Failed to update subscription prices" });
    }
  });

  app.post("/api/admin/create-prenatal-project", requireAdmin, async (req, res) => {
    try {
      // Create project
      const project = await storage.createProject({
        userId: req.session!.userId!,
        name: 'Acesso ao Pré-Natal na UBS - Zona Leste SP',
        description: 'Projeto de Design Thinking focado em melhorar a experiência de gestantes ao agendar e realizar consultas de pré-natal na UBS da Zona Leste de São Paulo. Baseado na jornada real de Manuela Oliveira, 26 anos, mãe de uma menina de 5 anos.',
        status: 'completed',
        currentPhase: 5,
        completionRate: 100
      });

      // Empathy Map
      await storage.createEmpathyMap({
        projectId: project.id,
        title: 'Mapa de Empatia - Manuela Oliveira (Gestante)',
        says: [
          '"Preciso confirmar minha gravidez na UBS"',
          '"Não consigo ligar, a linha sempre dá ocupado"',
          '"Preciso começar o pré-natal logo"',
          '"A Ângela me ajudou muito com o agendamento"',
          '"Espero que tudo corra bem com o bebê"'
        ],
        thinks: [
          'Estou preocupada com a saúde do bebê',
          'Preciso me organizar melhor com o trabalho e a Gabriela',
          'Não sei se minhas vacinas estão em dia',
          'Como vou conseguir tempo para todas as consultas?',
          'Preciso preparar o quarto do bebê'
        ],
        does: [
          'Trabalha em loja de departamentos no shopping',
          'Cuida da filha Gabriela (5 anos)',
          'Tenta ligar para UBS várias vezes',
          'Recebe visita da ACS em casa',
          'Vai até a UBS para consulta'
        ],
        feels: [
          'Ansiosa pela confirmação da gravidez',
          'Aliviada quando a ACS a ajuda',
          'Acolhida pela recepcionista Daniela',
          'Confiante com orientações da enfermeira Adriana',
          'Esperançosa com a chegada do bebê'
        ]
      });

      // Persona
      await storage.createPersona({
        projectId: project.id,
        name: 'Manuela Oliveira',
        age: 26,
        occupation: 'Vendedora em Loja de Departamentos',
        bio: 'Manuela tem 26 anos e mora na Zona Leste de São Paulo. Trabalha em uma loja de departamentos em shopping center e é mãe de Gabriela, de 5 anos. Descobriu recentemente que está grávida novamente e precisa acessar o pré-natal na UBS de seu bairro.',
        goals: [
          'Confirmar gravidez e iniciar pré-natal',
          'Garantir saúde do bebê',
          'Atualizar vacinas',
          'Conciliar trabalho e consultas',
          'Preparar chegada do bebê'
        ],
        frustrations: [
          'Telefone UBS sempre ocupado',
          'Falta de tempo',
          'Não saber se está tudo bem',
          'Informações confusas',
          'Medo de perder vaga'
        ],
        motivations: [
          'Saúde do bebê',
          'Ser boa mãe',
          'Apoio da ACS Ângela',
          'Atendimento humanizado',
          'Família saudável'
        ],
        techSavviness: 'medium'
      });

      // Observation
      await storage.createObservation({
        projectId: project.id,
        location: 'UBS Zona Leste - São Paulo',
        context: 'Dia de consulta de pré-natal',
        behavior: 'Manuela chega pontualmente, demonstra ansiedade na triagem, faz muitas perguntas para enfermeira, sai tranquila',
        insights: 'Acolhimento humanizado é fundamental. ACS crucial como ponte entre comunidade e UBS',
        date: new Date('2025-10-08')
      });

      // POV Statement
      await storage.createPovStatement({
        projectId: project.id,
        user: 'Gestante trabalhadora da Zona Leste',
        need: 'Agendar pré-natal rápido sem burocracia',
        insight: 'Telefone UBS não atende mas ACS resolve humanizadamente',
        statement: 'Gestantes trabalhadoras precisam de sistema acessível e apoio da ACS',
        priority: 'high'
      });

      // HMW Questions
      await storage.createHmwQuestion({
        projectId: project.id,
        question: 'Como facilitar agendamento sem depender do telefone?',
        context: 'Telefone UBS sempre ocupado',
        challenge: 'Sistema de agendamento inadequado',
        scope: 'service',
        priority: 'high',
        category: 'Acesso',
        votes: 8
      });

      await storage.createHmwQuestion({
        projectId: project.id,
        question: 'Como ampliar papel das ACS no suporte às gestantes?',
        context: 'ACS foi fundamental',
        challenge: 'Potencializar agentes comunitárias',
        scope: 'service',
        priority: 'high',
        category: 'Suporte',
        votes: 6
      });

      // Ideas
      const idea1 = await storage.createIdea({
        projectId: project.id,
        title: 'App/WhatsApp de Agendamento UBS',
        description: 'Chatbot WhatsApp para agendamento de pré-natal. Gestante escolhe data/hora, recebe confirmação automática.',
        category: 'Digital',
        desirability: 5,
        viability: 4,
        feasibility: 3,
        confidenceLevel: 4,
        dvfScore: 4.0,
        dvfAnalysis: 'Alta desejabilidade, viável via WhatsApp Business, desafio é integração com UBS',
        actionDecision: 'love_it',
        priorityRank: 1,
        votes: 12
      });

      const idea2 = await storage.createIdea({
        projectId: project.id,
        title: 'Capacitação e Equipamento para ACS',
        description: 'Treinar ACS com tablets para agendamento durante visitas domiciliares.',
        category: 'Capacitação',
        desirability: 4,
        viability: 4,
        feasibility: 4,
        confidenceLevel: 4,
        dvfScore: 4.0,
        dvfAnalysis: 'Desejável pois ACS tem confiança, viável com investimento',
        actionDecision: 'love_it',
        priorityRank: 2,
        votes: 10
      });

      // Prototypes
      const proto1 = await storage.createPrototype({
        projectId: project.id,
        ideaId: idea1.id,
        name: 'Protótipo WhatsApp Bot - Agendamento Pré-Natal',
        type: 'digital',
        description: 'Fluxo de conversação no WhatsApp. Bot solicita dados, mostra horários, confirma agendamento.',
        materials: ['WhatsApp Business API', 'Chatbot platform', 'Integração UBS'],
        images: [],
        version: 1,
        feedback: 'Gestantes acharam mais fácil. Solicitaram opção de reagendar.'
      });

      // Test Plan
      await storage.createTestPlan({
        projectId: project.id,
        prototypeId: proto1.id,
        name: 'Teste WhatsApp Bot',
        objective: 'Validar agendamento autônomo',
        methodology: 'Teste com 10 gestantes Zona Leste',
        participants: 10,
        duration: 15,
        tasks: [
          'Iniciar conversa com bot',
          'Informar dados',
          'Escolher horário',
          'Confirmar agendamento'
        ],
        metrics: [
          'Taxa conclusão >90%',
          'Tempo <3min',
          'NPS >8'
        ],
        status: 'completed'
      });

      res.json({ 
        success: true, 
        message: 'Projeto pré-natal criado com sucesso!',
        projectId: project.id
      });
    } catch (error) {
      console.error("Error creating prenatal project:", error);
      res.status(500).json({ error: "Failed to create prenatal project" });
    }
  });

  // ===== DOUBLE DIAMOND ROUTES =====

  // GET /api/double-diamond - Lista projetos Double Diamond do usuário
  app.get("/api/double-diamond", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const projects = await storage.getDoubleDiamondProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching Double Diamond projects:", error);
      res.status(500).json({ error: "Failed to fetch Double Diamond projects" });
    }
  });

  // GET /api/double-diamond/:id - Busca um projeto Double Diamond específico
  // Usuário comum: só acessa projetos próprios
  // Admin: pode acessar qualquer projeto
  app.get("/api/double-diamond/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUserById(userId);

      let project;

      if (user?.role === "admin") {
        const allProjects = await storage.getAllDoubleDiamondProjects();
        project = allProjects.find((p) => p.id === req.params.id);
      } else {
        project = await storage.getDoubleDiamondProject(req.params.id, userId);
      }

      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching Double Diamond project:", error);
      res.status(500).json({ error: "Failed to fetch Double Diamond project" });
    }
  });

  // POST /api/double-diamond - Cria novo projeto Double Diamond
  app.post("/api/double-diamond", requireAuth, checkDoubleDiamondLimit, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const validatedData = insertDoubleDiamondProjectSchema.parse(req.body);
      
      // Transform empty strings to undefined for optional FK fields
      const cleanedData = {
        ...validatedData,
        sectorId: validatedData.sectorId && validatedData.sectorId.trim() !== '' ? validatedData.sectorId : undefined,
        successCaseId: validatedData.successCaseId && validatedData.successCaseId.trim() !== '' ? validatedData.successCaseId : undefined,
        customSuccessCase: validatedData.customSuccessCase && validatedData.customSuccessCase.trim() !== '' ? validatedData.customSuccessCase : undefined,
        description: validatedData.description && validatedData.description.trim() !== '' ? validatedData.description : undefined,
        userId
      };
      
      const project = await storage.createDoubleDiamondProject(cleanedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating Double Diamond project:", error);
      res.status(500).json({ error: "Failed to create Double Diamond project" });
    }
  });

  // PATCH /api/double-diamond/:id - Atualiza projeto Double Diamond
  app.patch("/api/double-diamond/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      // Validar e limpar payload para evitar erros de FK com strings vazias
      const updatesInput = req.body;

      const validatedUpdates = insertDoubleDiamondProjectSchema
        .partial()
        .parse(updatesInput);

      const cleanedUpdates = {
        ...validatedUpdates,
        sectorId:
          validatedUpdates.sectorId && validatedUpdates.sectorId.trim() !== ""
            ? validatedUpdates.sectorId
            : undefined,
        successCaseId:
          validatedUpdates.successCaseId &&
          validatedUpdates.successCaseId.trim() !== ""
            ? validatedUpdates.successCaseId
            : undefined,
        customSuccessCase:
          validatedUpdates.customSuccessCase &&
          validatedUpdates.customSuccessCase.trim() !== ""
            ? validatedUpdates.customSuccessCase
            : undefined,
        description:
          validatedUpdates.description &&
          validatedUpdates.description.trim() !== ""
            ? validatedUpdates.description
            : undefined,
      };

      const updated = await storage.updateDoubleDiamondProject(
        req.params.id,
        userId,
        cleanedUpdates
      );
      if (!updated) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating Double Diamond project:", error);
      res.status(500).json({ error: "Failed to update Double Diamond project" });
    }
  });

  // DELETE /api/double-diamond/:id - Deleta projeto Double Diamond
  app.delete("/api/double-diamond/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const success = await storage.deleteDoubleDiamondProject(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting Double Diamond project:", error);
      res.status(500).json({ error: "Failed to delete Double Diamond project" });
    }
  });

  // POST /api/double-diamond/:id/generate/discover - Gera Fase 1: Discover com IA
  app.post("/api/double-diamond/:id/generate/discover", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      // Buscar setor e case se necessário
      let sectorName = req.body.sector || "General";
      let caseName = req.body.successCase;

      if (project.sectorId && !req.body.sector) {
        const sector = await storage.getIndustrySector(project.sectorId);
        if (sector) sectorName = sector.name;
      }

      if (project.successCaseId && !req.body.successCase) {
        const successCase = await storage.getSuccessCase(project.successCaseId);
        if (successCase) caseName = successCase.name;
      }

      // Get language from request body or default to pt-BR
      const language = req.body.language || "pt-BR";

      // Gerar fase Discover com IA
      const result = await generateDiscoverPhase({
        sector: sectorName,
        successCase: caseName,
        targetAudience: project.targetAudience || "",
        problemStatement: project.problemStatement || "",
        language
      });

      // Atualizar projeto com dados gerados
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        discoverPainPoints: result.painPoints as any,
        discoverInsights: result.insights as any,
        discoverUserNeeds: result.userNeeds as any,
        discoverEmpathyMap: result.empathyMap as any,
        discoverStatus: "completed",
        currentPhase: "define",
        completionPercentage: 25,
        generationCount: (project.generationCount || 0) + 1
      });

      res.json(updated);
    } catch (error) {
      console.error("Error generating Discover phase:", error);
      res.status(500).json({ error: "Failed to generate Discover phase" });
    }
  });

  // POST /api/double-diamond/:id/generate/define - Gera Fase 2: Define com IA
  app.post("/api/double-diamond/:id/generate/define", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      if (!project.discoverPainPoints || !project.discoverUserNeeds || !project.discoverInsights) {
        return res.status(400).json({ error: "Discover phase must be completed first" });
      }

      // Get language from request body or default to pt-BR
      const language = req.body.language || "pt-BR";

      // Gerar fase Define com IA
      const result = await generateDefinePhase({
        painPoints: project.discoverPainPoints as any,
        userNeeds: project.discoverUserNeeds as any,
        insights: project.discoverInsights as any,
        language
      });

      // Atualizar projeto - auto-selecionar primeiro POV e HMW
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        definePovStatements: result.povStatements as any,
        defineHmwQuestions: result.hmwQuestions as any,
        defineSelectedPov: result.povStatements[0]?.fullStatement || "",
        defineSelectedHmw: result.hmwQuestions[0]?.question || "",
        defineStatus: "completed",
        currentPhase: "develop",
        completionPercentage: 50,
        generationCount: (project.generationCount || 0) + 1
      });

      res.json(updated);
    } catch (error) {
      console.error("Error generating Define phase:", error);
      res.status(500).json({ error: "Failed to generate Define phase" });
    }
  });

  // POST /api/double-diamond/:id/generate/develop - Gera Fase 3: Develop com IA
  app.post("/api/double-diamond/:id/generate/develop", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      if (!project.defineSelectedPov || !project.defineSelectedHmw) {
        return res.status(400).json({ error: "Define phase must be completed and POV/HMW selected" });
      }

      // Buscar setor
      let sectorName = "General";
      if (project.sectorId) {
        const sector = await storage.getIndustrySector(project.sectorId);
        if (sector) sectorName = sector.name;
      }

      // Get language from request body or default to pt-BR
      const language = req.body.language || "pt-BR";

      // Gerar fase Develop com IA
      const result = await generateDevelopPhase({
        selectedPov: project.defineSelectedPov,
        selectedHmw: project.defineSelectedHmw,
        sector: sectorName,
        language
      });

      // Atualizar projeto - auto-selecionar as 3 melhores ideias
      const topIdeas = result.ideas.slice(0, 3);
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        developIdeas: result.ideas as any,
        developCrossPollinatedIdeas: result.crossPollinatedIdeas as any,
        developSelectedIdeas: topIdeas as any,
        developStatus: "completed",
        currentPhase: "deliver",
        completionPercentage: 75,
        generationCount: (project.generationCount || 0) + 1
      });

      res.json(updated);
    } catch (error) {
      console.error("Error generating Develop phase:", error);
      res.status(500).json({ error: "Failed to generate Develop phase" });
    }
  });

  // POST /api/double-diamond/:id/generate/deliver - Gera Fase 4: Deliver com IA
  app.post("/api/double-diamond/:id/generate/deliver", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      let project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      // AUTO-FIX: Se o projeto não tem ideias selecionadas mas tem ideias geradas, auto-seleciona as 3 melhores
      if ((!project.developSelectedIdeas || (project.developSelectedIdeas as any).length === 0) && project.developIdeas && (project.developIdeas as any).length > 0) {
        console.log(`[AUTO-FIX] Auto-selecting top 3 ideas for project ${project.id}`);
        const topIdeas = (project.developIdeas as any).slice(0, 3);
        project = await storage.updateDoubleDiamondProject(project.id, userId, {
          developSelectedIdeas: topIdeas as any
        });
      }

      if (!project.developSelectedIdeas || (project.developSelectedIdeas as any).length === 0) {
        return res.status(400).json({ error: "Develop phase must be completed and ideas selected" });
      }

      // Buscar setor
      let sectorName = "General";
      if (project.sectorId) {
        const sector = await storage.getIndustrySector(project.sectorId);
        if (sector) sectorName = sector.name;
      }

      // Get language from request body or default to pt-BR
      const language = req.body.language || "pt-BR";

      // Gerar fase Deliver com IA
      const result = await generateDeliverPhase({
        selectedIdeas: project.developSelectedIdeas as any,
        pov: project.defineSelectedPov || "",
        sector: sectorName,
        language
      });

      // Atualizar projeto
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        deliverMvpConcept: result.mvpConcept as any,
        deliverLogoSuggestions: result.logoSuggestions as any,
        deliverLandingPage: result.landingPage as any,
        deliverSocialMediaLines: result.socialMediaLines as any,
        deliverTestPlan: result.testPlan as any,
        deliverStatus: "completed",
        completionPercentage: 100,
        isCompleted: true,
        generationCount: (project.generationCount || 0) + 1
      });

      res.json(updated);
    } catch (error) {
      console.error("Error generating Deliver phase:", error);
      res.status(500).json({ error: "Failed to generate Deliver phase" });
    }
  });

  // POST /api/double-diamond/:id/generate/dfv - Gera análise DFV com IA
  app.post("/api/double-diamond/:id/generate/dfv", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      if (!project.deliverMvpConcept) {
        return res.status(400).json({ error: "Deliver phase must be completed first" });
      }

      // Buscar setor
      let sectorName = "General";
      if (project.sectorId) {
        const sector = await storage.getIndustrySector(project.sectorId);
        if (sector) sectorName = sector.name;
      }

      // Get language from request body or default to pt-BR
      const language = req.body.language || "pt-BR";

      // Gerar análise DFV com IA
      const result = await analyzeDFV({
        pov: project.defineSelectedPov || "",
        mvpConcept: project.deliverMvpConcept,
        sector: sectorName,
        selectedIdeas: project.developSelectedIdeas || [],
        language
      });

      // Atualizar projeto - incluir recommendations e nextSteps na análise
      const fullAnalysis = {
        ...result.analysis,
        recommendations: result.recommendations || [],
        nextSteps: result.nextSteps || []
      };

      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        dfvDesirabilityScore: result.desirabilityScore,
        dfvFeasibilityScore: result.feasibilityScore,
        dfvViabilityScore: result.viabilityScore,
        dfvAnalysis: fullAnalysis as any,
        dfvFeedback: result.overallAssessment,
        generationCount: (project.generationCount || 0) + 1
      });

      res.json(updated);
    } catch (error) {
      console.error("Error generating DFV analysis:", error);
      res.status(500).json({ error: "Failed to generate DFV analysis" });
    }
  });

  // ===== ADMIN ROUTES FOR DOUBLE DIAMOND =====
  
  // GET /api/admin/double-diamond - Lista todos os projetos Double Diamond (admin only)
  app.get("/api/admin/double-diamond", requireAdmin, async (_req, res) => {
    try {
      const projects = await storage.getAllDoubleDiamondProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching all Double Diamond projects:", error);
      res.status(500).json({ error: "Failed to fetch Double Diamond projects" });
    }
  });

  // DELETE /api/admin/double-diamond/:id - Deleta projeto Double Diamond (admin only)
  app.delete("/api/admin/double-diamond/:id", requireAdmin, async (req, res) => {
    try {
      // Admin pode deletar qualquer projeto, então buscamos todos e filtramos por ID
      const allProjects = await storage.getAllDoubleDiamondProjects();
      const project = allProjects.find(p => p.id === req.params.id);
      
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      const success = await storage.deleteDoubleDiamondProject(req.params.id, project.userId);
      if (!success) {
        return res.status(404).json({ error: "Failed to delete project" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting Double Diamond project:", error);
      res.status(500).json({ error: "Failed to delete Double Diamond project" });
    }
  });

  // PATCH /api/admin/double-diamond/:id - Atualiza projeto Double Diamond (admin only)
  app.patch("/api/admin/double-diamond/:id", requireAdmin, async (req, res) => {
    try {
      // Admin pode atualizar qualquer projeto, então buscamos todos e filtramos por ID
      const allProjects = await storage.getAllDoubleDiamondProjects();
      const project = allProjects.find(p => p.id === req.params.id);
      
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      // Admin pode atualizar qualquer campo, mas limpamos strings vazias em FKs opcionais
      const updatesInput = req.body;

      const validatedUpdates = insertDoubleDiamondProjectSchema
        .partial()
        .parse(updatesInput);

      const cleanedUpdates = {
        ...validatedUpdates,
        sectorId:
          validatedUpdates.sectorId && validatedUpdates.sectorId.trim() !== ""
            ? validatedUpdates.sectorId
            : undefined,
        successCaseId:
          validatedUpdates.successCaseId &&
          validatedUpdates.successCaseId.trim() !== ""
            ? validatedUpdates.successCaseId
            : undefined,
        customSuccessCase:
          validatedUpdates.customSuccessCase &&
          validatedUpdates.customSuccessCase.trim() !== ""
            ? validatedUpdates.customSuccessCase
            : undefined,
        description:
          validatedUpdates.description &&
          validatedUpdates.description.trim() !== ""
            ? validatedUpdates.description
            : undefined,
      };

      const updated = await storage.updateDoubleDiamondProject(
        req.params.id,
        project.userId,
        cleanedUpdates
      );
      
      if (!updated) {
        return res.status(404).json({ error: "Failed to update project" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating Double Diamond project:", error);
      res.status(500).json({ error: "Failed to update Double Diamond project" });
    }
  });

  // GET /api/industry-sectors - Lista setores/indústrias para o Double Diamond
  app.get("/api/industry-sectors", async (req, res) => {
    try {
      const sectors = await storage.listIndustrySectors();
      res.json(sectors);
    } catch (error) {
      console.error("Error fetching industry sectors:", error);
      res.status(500).json({ error: "Failed to fetch industry sectors" });
    }
  });

  // GET /api/success-cases - Lista cases de sucesso para o Double Diamond
  app.get("/api/success-cases", async (req, res) => {
    try {
      const successCases = await storage.listSuccessCases();
      res.json(successCases);
    } catch (error) {
      console.error("Error fetching success cases:", error);
      res.status(500).json({ error: "Failed to fetch success cases" });
    }
  });

  // POST /api/double-diamond/:id/export - Exporta projeto Double Diamond para o sistema principal
  app.post("/api/double-diamond/:id/export", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { projectName } = req.body;
      const userId = req.session.userId!;

      // 1. Verificar se o projeto existe e pertence ao usuário
      const project = await storage.getDoubleDiamondProject(id, userId);
      if (!project) {
        return res.status(404).json({ success: false, error: "Projeto não encontrado" });
      }

      // 2. Verificar limite de exportações do usuário (exceto admin, que é ilimitado)
      const user = await storage.getUserById(userId);
      const isAdmin = user?.role === "admin";

      if (!isAdmin) {
        const plan = user?.subscriptionPlanId ? await storage.getSubscriptionPlan(user.subscriptionPlanId) : null;
        const maxExports = user?.customMaxDoubleDiamondExports ?? plan?.maxDoubleDiamondExports;
        
        if (maxExports !== null && maxExports !== undefined) {
          const exportsThisMonth = await storage.getDoubleDiamondExportsByMonth(userId);
          if (exportsThisMonth.length >= maxExports) {
            return res.status(403).json({ 
              success: false, 
              error: `Limite de ${maxExports} exportações mensais atingido. Atualize seu plano para exportar mais projetos.` 
            });
          }
        }
      }

      // 3. Converter o projeto Double Diamond para um projeto principal
      const newProject = {
        name: projectName || `${project.name} (Exportado)`,
        description: project.description || `Projeto exportado do Double Diamond: ${project.name}`,
        status: "in_progress",
        currentPhase: 1,
        completionRate: 0,
        sectorId: project.sectorId || null,
        successCaseId: project.successCaseId || null,
        userProblemDescription: project.problemStatement || null,
        aiGenerated: true,
        generationTimestamp: new Date(),
        businessModelBase: null,
        userId: userId
      };

      // 4. Salvar o novo projeto
      const createdProject = await storage.createProject(newProject);

      // 4.1 Mapear dados do Double Diamond para as 5 fases do projeto principal (best-effort)
      try {
        // Fase 1: Empatizar - Mapa de Empatia a partir do Discover
        if (project.discoverEmpathyMap) {
          const em = project.discoverEmpathyMap as any;
          await storage.createEmpathyMap({
            projectId: createdProject.id,
            title: `Mapa de Empatia - ${project.name}`,
            says: Array.isArray(em.says) ? em.says : [],
            thinks: Array.isArray(em.thinks) ? em.thinks : [],
            does: Array.isArray(em.does) ? em.does : [],
            feels: Array.isArray(em.feels) ? em.feels : [],
          });
        }

        // Fase 2: Definir - POV Statements
        if (project.definePovStatements && Array.isArray(project.definePovStatements)) {
          for (const item of project.definePovStatements as any[]) {
            await storage.createPovStatement({
              projectId: createdProject.id,
              user: item.user ?? "",
              need: item.need ?? "",
              insight: item.insight ?? "",
              statement: item.fullStatement ?? `${item.user ?? "Usuário"} precisa ${item.need ?? "..."} porque ${item.insight ?? "..."}`,
            });
          }
        }

        // Fase 2: Definir - HMW Questions
        if (project.defineHmwQuestions && Array.isArray(project.defineHmwQuestions)) {
          for (const item of project.defineHmwQuestions as any[]) {
            await storage.createHmwQuestion({
              projectId: createdProject.id,
              question: item.question ?? "",
              context: null,
              challenge: null,
              scope: "product",
              priority: "medium",
              category: item.focusArea ?? null,
              votes: 0,
            });
          }
        }

        // Fase 3: Idear - Ideias selecionadas em Develop
        if (project.developSelectedIdeas && Array.isArray(project.developSelectedIdeas)) {
          for (const idea of project.developSelectedIdeas as any[]) {
            await storage.createIdea({
              projectId: createdProject.id,
              title: idea.title ?? "Ideia",
              description: idea.description ?? "",
              category: idea.category ?? null,
            });
          }
        }

        // Fase 4: Prototipar - Protótipo a partir do MVP Concept
        if (project.deliverMvpConcept) {
          const mvp = project.deliverMvpConcept as any;
          const descriptionParts: string[] = [];
          if (mvp.description) {
            descriptionParts.push(mvp.description);
          }
          if (Array.isArray(mvp.coreFeatures) && mvp.coreFeatures.length > 0) {
            descriptionParts.push("Recursos principais: " + mvp.coreFeatures.join("; "));
          }

          await storage.createPrototype({
            projectId: createdProject.id,
            ideaId: null,
            name: mvp.name || `MVP - ${project.name}`,
            type: "digital",
            description: descriptionParts.join("\n\n") || "MVP gerado a partir do Double Diamond.",
            materials: [],
            images: [],
            canvasData: null,
            version: 1,
            feedback: null,
          });
        }

        // Fase 5: Testar - Plano de Testes a partir do Deliver
        if (project.deliverTestPlan) {
          const tp = project.deliverTestPlan as any;
          const objectivesText = Array.isArray(tp.objectives) ? tp.objectives.join("; ") : "";
          const methodsText = Array.isArray(tp.testMethods) ? tp.testMethods.join("; ") : "";
          const participants = typeof tp.participants === "number" ? tp.participants : 5;
          const duration = typeof tp.duration === "number" ? tp.duration : 60;

          await storage.createTestPlan({
            projectId: createdProject.id,
            prototypeId: null,
            name: `Plano de Testes - ${project.name}`,
            objective: objectivesText || "Plano de testes gerado a partir do Double Diamond.",
            methodology: methodsText || "Metodologia derivada da fase Deliver do Double Diamond.",
            participants,
            duration,
            tasks: Array.isArray(tp.tasks) ? tp.tasks : [],
            metrics: Array.isArray(tp.metrics) ? tp.metrics : [],
            status: "planned",
          });
        }
      } catch (phaseError) {
        console.error("Erro ao mapear dados do Double Diamond para projeto principal:", phaseError);
      }

      // 4.2 Criar registro DVF vinculado ao projeto principal (best-effort)
      try {
        if (
          project.dfvDesirabilityScore != null &&
          project.dfvFeasibilityScore != null &&
          project.dfvViabilityScore != null
        ) {
          const desirability = Number(project.dfvDesirabilityScore) || 0;
          const feasibility = Number(project.dfvFeasibilityScore) || 0;
          const viability = Number(project.dfvViabilityScore) || 0;

          // Converter escala 0-100 para 0-5 (mantendo uma casa decimal)
          const desirabilityScore = Math.round((desirability / 20) * 10) / 10;
          const feasibilityScore = Math.round((feasibility / 20) * 10) / 10;
          const viabilityScore = Math.round((viability / 20) * 10) / 10;

          const overallScore = Math.round(((desirabilityScore + feasibilityScore + viabilityScore) / 3) * 10) / 10;

          // Heurística simples de recomendação
          let recommendation: "proceed" | "modify" | "stop" = "modify";
          if (overallScore >= 4) {
            recommendation = "proceed";
          } else if (overallScore < 2.5) {
            recommendation = "stop";
          }

          await storage.createDvfAssessment({
            projectId: createdProject.id,
            itemType: "solution",
            itemId: "double-diamond-export",
            itemName: createdProject.name,
            desirabilityScore,
            desirabilityEvidence: (project.dfvAnalysis as any)?.desirability?.reasoning || project.dfvFeedback || null,
            userFeedback: project.dfvFeedback || null,
            marketDemand: 0,
            feasibilityScore,
            feasibilityEvidence: (project.dfvAnalysis as any)?.feasibility?.reasoning || null,
            technicalComplexity: "medium",
            resourceRequirements: [],
            timeToImplement: 0,
            viabilityScore,
            viabilityEvidence: (project.dfvAnalysis as any)?.viability?.reasoning || null,
            businessModel: null,
            costEstimate: 0,
            revenueProjection: 0,
            overallScore,
            recommendation,
            nextSteps: (project.dfvAnalysis as any)?.recommendations || [],
            risksIdentified: [],
          } as any);
        }
      } catch (dfvError) {
        console.error("Erro ao criar avaliação DVF para projeto principal:", dfvError);
      }

      // 5. Registrar a exportação
      await storage.createDoubleDiamondExport({
        userId,
        doubleDiamondProjectId: id,
        exportedProjectId: createdProject.id,
        status: 'completed',
        exportType: 'full'
      });

      // 6. Retornar sucesso
      return res.json({ 
        success: true, 
        projectId: createdProject.id 
      });

    } catch (error) {
      console.error("Erro ao exportar projeto:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Erro interno ao exportar projeto" 
      });
    }
  });

  // GET /api/double-diamond/:id/export/pdf - Exporta projeto Double Diamond em PDF
  app.get("/api/double-diamond/:id/export/pdf", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }

      const { generateDoubleDiamondPDF } = await import("./double-diamond-pdf");
      const pdfBuffer = await generateDoubleDiamondPDF(project);
      
      const fileName = `${project.name.replace(/[^a-z0-9]/gi, '_')}_DoubleDiamond.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating Double Diamond PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
