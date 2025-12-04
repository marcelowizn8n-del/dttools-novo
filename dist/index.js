var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  aiGeneratedAssets: () => aiGeneratedAssets,
  analyticsEvents: () => analyticsEvents,
  articles: () => articles,
  benchmarkAssessments: () => benchmarkAssessments,
  benchmarks: () => benchmarks,
  canvasDrawings: () => canvasDrawings,
  competitiveAnalysis: () => competitiveAnalysis,
  doubleDiamondExports: () => doubleDiamondExports,
  doubleDiamondProjects: () => doubleDiamondProjects,
  dvfAssessments: () => dvfAssessments,
  empathyMaps: () => empathyMaps,
  guidingCriteria: () => guidingCriteria,
  helpArticles: () => helpArticles,
  hmwQuestions: () => hmwQuestions,
  ideas: () => ideas,
  industrySectors: () => industrySectors,
  insertAiGeneratedAssetSchema: () => insertAiGeneratedAssetSchema,
  insertAnalyticsEventSchema: () => insertAnalyticsEventSchema,
  insertArticleSchema: () => insertArticleSchema,
  insertBenchmarkAssessmentSchema: () => insertBenchmarkAssessmentSchema,
  insertBenchmarkSchema: () => insertBenchmarkSchema,
  insertCanvasDrawingSchema: () => insertCanvasDrawingSchema,
  insertCompetitiveAnalysisSchema: () => insertCompetitiveAnalysisSchema,
  insertDoubleDiamondExportSchema: () => insertDoubleDiamondExportSchema,
  insertDoubleDiamondProjectSchema: () => insertDoubleDiamondProjectSchema,
  insertDvfAssessmentSchema: () => insertDvfAssessmentSchema,
  insertEmpathyMapSchema: () => insertEmpathyMapSchema,
  insertGuidingCriterionSchema: () => insertGuidingCriterionSchema,
  insertHelpArticleSchema: () => insertHelpArticleSchema,
  insertHmwQuestionSchema: () => insertHmwQuestionSchema,
  insertIdeaSchema: () => insertIdeaSchema,
  insertIndustrySectorSchema: () => insertIndustrySectorSchema,
  insertInterviewSchema: () => insertInterviewSchema,
  insertLovabilityMetricSchema: () => insertLovabilityMetricSchema,
  insertObservationSchema: () => insertObservationSchema,
  insertPersonaSchema: () => insertPersonaSchema,
  insertPhaseCardSchema: () => insertPhaseCardSchema,
  insertPovStatementSchema: () => insertPovStatementSchema,
  insertProjectAnalyticsSchema: () => insertProjectAnalyticsSchema,
  insertProjectBackupSchema: () => insertProjectBackupSchema,
  insertProjectCommentSchema: () => insertProjectCommentSchema,
  insertProjectInviteSchema: () => insertProjectInviteSchema,
  insertProjectMemberSchema: () => insertProjectMemberSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertPrototypeSchema: () => insertPrototypeSchema,
  insertSubscriptionPlanSchema: () => insertSubscriptionPlanSchema,
  insertSuccessCaseSchema: () => insertSuccessCaseSchema,
  insertTestPlanSchema: () => insertTestPlanSchema,
  insertTestResultSchema: () => insertTestResultSchema,
  insertTestimonialSchema: () => insertTestimonialSchema,
  insertUserAddonSchema: () => insertUserAddonSchema,
  insertUserProgressSchema: () => insertUserProgressSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserSubscriptionSchema: () => insertUserSubscriptionSchema,
  insertVideoTutorialSchema: () => insertVideoTutorialSchema,
  interviews: () => interviews,
  lovabilityMetrics: () => lovabilityMetrics,
  observations: () => observations,
  personas: () => personas,
  phaseCards: () => phaseCards,
  povStatements: () => povStatements,
  projectAnalytics: () => projectAnalytics,
  projectBackups: () => projectBackups,
  projectComments: () => projectComments,
  projectInvites: () => projectInvites,
  projectMembers: () => projectMembers,
  projects: () => projects,
  prototypes: () => prototypes,
  subscriptionPlans: () => subscriptionPlans,
  successCases: () => successCases,
  testPlans: () => testPlans,
  testResults: () => testResults,
  testimonials: () => testimonials,
  updateProfileSchema: () => updateProfileSchema,
  userAddons: () => userAddons,
  userProgress: () => userProgress,
  userSubscriptions: () => userSubscriptions,
  users: () => users,
  videoTutorials: () => videoTutorials
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var industrySectors, successCases, aiGeneratedAssets, projects, empathyMaps, personas, interviews, observations, povStatements, hmwQuestions, ideas, prototypes, canvasDrawings, testPlans, testResults, userProgress, users, subscriptionPlans, userSubscriptions, userAddons, articles, testimonials, videoTutorials, insertProjectSchema, insertEmpathyMapSchema, insertPersonaSchema, insertInterviewSchema, insertObservationSchema, insertPovStatementSchema, insertHmwQuestionSchema, insertIdeaSchema, insertPrototypeSchema, insertTestPlanSchema, insertTestResultSchema, insertUserProgressSchema, insertUserSchema, insertArticleSchema, insertTestimonialSchema, insertVideoTutorialSchema, insertSubscriptionPlanSchema, insertUserSubscriptionSchema, insertUserAddonSchema, insertCanvasDrawingSchema, updateProfileSchema, guidingCriteria, insertGuidingCriterionSchema, phaseCards, benchmarks, benchmarkAssessments, doubleDiamondExports, insertDoubleDiamondExportSchema, insertBenchmarkSchema, insertBenchmarkAssessmentSchema, insertPhaseCardSchema, dvfAssessments, lovabilityMetrics, projectAnalytics, competitiveAnalysis, projectBackups, helpArticles, insertDvfAssessmentSchema, insertLovabilityMetricSchema, insertProjectAnalyticsSchema, insertCompetitiveAnalysisSchema, insertProjectBackupSchema, insertHelpArticleSchema, insertIndustrySectorSchema, insertSuccessCaseSchema, insertAiGeneratedAssetSchema, analyticsEvents, insertAnalyticsEventSchema, projectMembers, insertProjectMemberSchema, projectInvites, insertProjectInviteSchema, projectComments, insertProjectCommentSchema, doubleDiamondProjects, insertDoubleDiamondProjectSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    industrySectors = pgTable("industry_sectors", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      // English name (canonical)
      namePt: text("name_pt").notNull(),
      // Portuguese name
      nameEn: text("name_en"),
      // English translation
      nameEs: text("name_es"),
      // Spanish translation
      nameFr: text("name_fr"),
      // French translation
      description: text("description"),
      icon: text("icon"),
      // Lucide icon name
      isActive: boolean("is_active").default(true),
      order: integer("order").default(0),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    successCases = pgTable("success_cases", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      // Case name (e.g., "Airbnb")
      company: text("company").notNull(),
      // Company name
      sectorId: varchar("sector_id").references(() => industrySectors.id),
      descriptionPt: text("description_pt"),
      descriptionEn: text("description_en"),
      descriptionEs: text("description_es"),
      descriptionFr: text("description_fr"),
      logoUrl: text("logo_url"),
      foundedYear: integer("founded_year"),
      keyInnovation: text("key_innovation"),
      // Main innovation/differentiator
      businessModel: text("business_model"),
      // 'marketplace', 'saas', 'freemium', etc.
      isActive: boolean("is_active").default(true),
      order: integer("order").default(0),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    aiGeneratedAssets = pgTable("ai_generated_assets", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      assetType: text("asset_type").notNull(),
      // 'logo', 'landing_page', 'social_media', 'persona', 'idea', 'business_model'
      content: text("content"),
      // JSON or HTML depending on type
      metadata: jsonb("metadata"),
      // Extra information
      storageUrl: text("storage_url"),
      // If image/file stored in object storage
      generationCost: real("generation_cost"),
      // Cost in credits/tokens
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    projects = pgTable("projects", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      name: text("name").notNull(),
      description: text("description"),
      status: text("status").notNull().default("in_progress"),
      // in_progress, completed
      currentPhase: integer("current_phase").default(1),
      // 1-5 phases
      completionRate: real("completion_rate").default(0),
      // AI Automation fields
      sectorId: varchar("sector_id").references(() => industrySectors.id),
      successCaseId: varchar("success_case_id").references(() => successCases.id),
      userProblemDescription: text("user_problem_description"),
      // User's initial problem description
      aiGenerated: boolean("ai_generated").default(false),
      // Was this project AI-generated?
      generationTimestamp: timestamp("generation_timestamp"),
      businessModelBase: jsonb("business_model_base"),
      // AI-generated business model canvas
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    empathyMaps = pgTable("empathy_maps", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      title: text("title").notNull(),
      says: jsonb("says").default([]),
      // Array of strings
      thinks: jsonb("thinks").default([]),
      does: jsonb("does").default([]),
      feels: jsonb("feels").default([]),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    personas = pgTable("personas", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      name: text("name").notNull(),
      age: integer("age"),
      occupation: text("occupation"),
      bio: text("bio"),
      goals: jsonb("goals").default([]),
      frustrations: jsonb("frustrations").default([]),
      motivations: jsonb("motivations").default([]),
      techSavviness: text("tech_savviness"),
      // low, medium, high
      avatar: text("avatar"),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    interviews = pgTable("interviews", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      participantName: text("participant_name").notNull(),
      date: timestamp("date").notNull(),
      duration: integer("duration"),
      // minutes
      questions: jsonb("questions").default([]),
      responses: jsonb("responses").default([]),
      insights: text("insights"),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    observations = pgTable("observations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      location: text("location").notNull(),
      context: text("context").notNull(),
      behavior: text("behavior").notNull(),
      insights: text("insights"),
      date: timestamp("date").notNull(),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    povStatements = pgTable("pov_statements", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      user: text("user").notNull(),
      // user description
      need: text("need").notNull(),
      // user need
      insight: text("insight").notNull(),
      // surprising insight
      statement: text("statement").notNull(),
      // complete POV statement
      priority: text("priority").default("medium"),
      // low, medium, high
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    hmwQuestions = pgTable("hmw_questions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      question: text("question").notNull(),
      context: text("context"),
      challenge: text("challenge"),
      scope: text("scope").default("product"),
      // feature, product, service, experience, process
      priority: text("priority").default("medium"),
      // low, medium, high
      category: text("category"),
      // categorization
      votes: integer("votes").default(0),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    ideas = pgTable("ideas", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      category: text("category"),
      // Legacy fields (kept for compatibility)
      feasibility: integer("feasibility"),
      // 1-5 scale - now maps to DVF Feasibility/Exequibilidade
      impact: integer("impact"),
      // 1-5 scale
      votes: integer("votes").default(0),
      // DVF (Desejabilidade, Viabilidade, Exequibilidade) System
      desirability: integer("desirability"),
      // 1-5 scale - user need satisfaction
      viability: integer("viability"),
      // 1-5 scale - business/profit potential  
      // feasibility already exists above - technical implementability
      confidenceLevel: integer("confidence_level"),
      // 1-5 scale - overall confidence
      dvfScore: real("dvf_score"),
      // Calculated: (desirability + viability + feasibility) / 3
      dvfAnalysis: text("dvf_analysis"),
      // Detailed justification for scores
      actionDecision: text("action_decision").default("evaluate"),
      // love_it, leave_it, change_it, evaluate
      // Priority and iteration fields
      priorityRank: integer("priority_rank"),
      // 1-n ranking based on DVF analysis
      iterationNotes: text("iteration_notes"),
      // Notes for "change_it" decisions
      status: text("status").default("idea"),
      // idea, selected, prototype, tested
      canvasData: jsonb("canvas_data"),
      // Fabric.js canvas data for drawings/sketches
      // Linked Guiding Criteria (Phase 2) - store array of guiding_criteria IDs
      guidingCriteriaIds: jsonb("guiding_criteria_ids").default([]),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    prototypes = pgTable("prototypes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      ideaId: varchar("idea_id").references(() => ideas.id),
      name: text("name").notNull(),
      type: text("type").notNull(),
      // paper, digital, physical, storyboard, canvas
      description: text("description").notNull(),
      materials: jsonb("materials").default([]),
      images: jsonb("images").default([]),
      canvasData: jsonb("canvas_data"),
      // Konva.js canvas data for interactive prototypes
      version: integer("version").default(1),
      feedback: text("feedback"),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    canvasDrawings = pgTable("canvas_drawings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      title: text("title").notNull(),
      description: text("description"),
      phase: integer("phase").notNull(),
      // 1-5 phases where this drawing is used
      canvasType: text("canvas_type").notNull(),
      // fabric, konva
      canvasData: jsonb("canvas_data").notNull(),
      // Canvas library data (Fabric.js or Konva.js)
      thumbnailData: text("thumbnail_data"),
      // Base64 encoded thumbnail for preview
      tags: jsonb("tags").default([]),
      // Tags for categorization
      isTemplate: boolean("is_template").default(false),
      // Can be used as a template
      parentId: varchar("parent_id"),
      // For drawing iterations - will be set to reference same table later
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    testPlans = pgTable("test_plans", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      prototypeId: varchar("prototype_id").references(() => prototypes.id),
      name: text("name").notNull(),
      objective: text("objective").notNull(),
      methodology: text("methodology").notNull(),
      participants: integer("participants").notNull(),
      duration: integer("duration"),
      // minutes
      tasks: jsonb("tasks").default([]),
      metrics: jsonb("metrics").default([]),
      status: text("status").default("planned"),
      // planned, running, completed
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    testResults = pgTable("test_results", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      testPlanId: varchar("test_plan_id").references(() => testPlans.id).notNull(),
      participantId: text("participant_id").notNull(),
      taskResults: jsonb("task_results").default([]),
      feedback: text("feedback"),
      successRate: real("success_rate"),
      completionTime: integer("completion_time"),
      // minutes
      insights: text("insights"),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    userProgress = pgTable("user_progress", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: text("user_id").notNull(),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      phase: integer("phase").notNull(),
      // 1-5
      completedTools: jsonb("completed_tools").default([]),
      badges: jsonb("badges").default([]),
      points: integer("points").default(0),
      timeSpent: integer("time_spent").default(0),
      // minutes
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      username: text("username").notNull().unique(),
      email: text("email").notNull().unique(),
      name: text("name").notNull(),
      password: text("password"),
      // hashed password - optional for OAuth users
      role: text("role").notNull().default("user"),
      // admin, user
      // OAuth fields
      provider: text("provider").default("local"),
      // 'local', 'google'
      googleId: text("google_id"),
      // Google OAuth ID
      // User profile fields
      company: text("company"),
      jobRole: text("job_role"),
      industry: text("industry"),
      experience: text("experience"),
      country: text("country"),
      state: text("state"),
      city: text("city"),
      zipCode: text("zip_code"),
      phone: text("phone"),
      bio: text("bio"),
      profilePicture: text("profile_picture"),
      interests: jsonb("interests").default([]),
      // Subscription fields
      stripeCustomerId: text("stripe_customer_id"),
      stripeSubscriptionId: text("stripe_subscription_id"),
      subscriptionPlanId: varchar("subscription_plan_id"),
      subscriptionStatus: text("subscription_status").default("active"),
      // active, canceled, expired, trialing
      subscriptionEndDate: timestamp("subscription_end_date"),
      aiProjectsUsed: integer("ai_projects_used").default(0),
      // Track AI-generated projects used
      // Custom limits (override plan limits) - null = use plan limit
      customMaxProjects: integer("custom_max_projects"),
      // null = use plan limit
      customMaxDoubleDiamondProjects: integer("custom_max_double_diamond_projects"),
      // null = use plan limit
      customMaxDoubleDiamondExports: integer("custom_max_double_diamond_exports"),
      // null = use plan limit
      customAiChatLimit: integer("custom_ai_chat_limit"),
      // null = use plan limit
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    subscriptionPlans = pgTable("subscription_plans", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      displayName: text("display_name").notNull(),
      description: text("description"),
      priceMonthly: integer("price_monthly").notNull(),
      // in cents
      priceYearly: integer("price_yearly").notNull(),
      // in cents
      stripePriceIdMonthly: text("stripe_price_id_monthly"),
      stripePriceIdYearly: text("stripe_price_id_yearly"),
      maxProjects: integer("max_projects"),
      // null for unlimited
      maxPersonasPerProject: integer("max_personas_per_project"),
      // null for unlimited
      maxUsersPerTeam: integer("max_users_per_team"),
      // null for unlimited
      maxAiProjects: integer("max_ai_projects"),
      // null for unlimited AI-generated projects
      includedUsers: integer("included_users"),
      // number of users included in base price (null if not applicable)
      pricePerAdditionalUser: integer("price_per_additional_user"),
      // price in cents for each additional user beyond includedUsers
      aiChatLimit: integer("ai_chat_limit"),
      // null for unlimited
      maxDoubleDiamondProjects: integer("max_double_diamond_projects"),
      // null for unlimited Double Diamond projects
      maxDoubleDiamondExports: integer("max_double_diamond_exports"),
      // null for unlimited exports to main system
      libraryArticlesCount: integer("library_articles_count"),
      // null for all articles
      features: jsonb("features").default([]),
      // Array of feature strings
      exportFormats: jsonb("export_formats").default([]),
      // Array of export formats (pdf, png, csv)
      hasCollaboration: boolean("has_collaboration").default(false),
      hasPermissionManagement: boolean("has_permission_management").default(false),
      hasSharedWorkspace: boolean("has_shared_workspace").default(false),
      hasCommentsAndFeedback: boolean("has_comments_and_feedback").default(false),
      hasSso: boolean("has_sso").default(false),
      hasCustomApi: boolean("has_custom_api").default(false),
      hasCustomIntegrations: boolean("has_custom_integrations").default(false),
      has24x7Support: boolean("has_24x7_support").default(false),
      order: integer("order").default(0),
      // for display ordering
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    userSubscriptions = pgTable("user_subscriptions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      planId: varchar("plan_id").references(() => subscriptionPlans.id).notNull(),
      stripeSubscriptionId: text("stripe_subscription_id"),
      status: text("status").notNull(),
      // active, canceled, expired, trialing, incomplete
      billingPeriod: text("billing_period").notNull(),
      // monthly, yearly
      currentPeriodStart: timestamp("current_period_start"),
      currentPeriodEnd: timestamp("current_period_end"),
      cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    userAddons = pgTable("user_addons", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      addonKey: text("addon_key").notNull(),
      // 'double_diamond_pro', 'export_pro', 'ai_turbo', etc.
      status: text("status").notNull().default("active"),
      // active, canceled, expired, trialing
      source: text("source").notNull().default("stripe"),
      // stripe, admin, manual
      stripeSubscriptionId: text("stripe_subscription_id"),
      billingPeriod: text("billing_period"),
      // monthly, yearly, null for one-time/unknown
      currentPeriodStart: timestamp("current_period_start"),
      currentPeriodEnd: timestamp("current_period_end"),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    articles = pgTable("articles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      // pt-BR (default)
      content: text("content").notNull(),
      // pt-BR (default)
      description: text("description"),
      // English translations
      titleEn: text("title_en"),
      contentEn: text("content_en"),
      descriptionEn: text("description_en"),
      // Spanish translations
      titleEs: text("title_es"),
      contentEs: text("content_es"),
      descriptionEs: text("description_es"),
      // French translations
      titleFr: text("title_fr"),
      contentFr: text("content_fr"),
      descriptionFr: text("description_fr"),
      category: text("category").notNull(),
      // empathize, define, ideate, prototype, test
      author: text("author").notNull(),
      tags: jsonb("tags").default([]),
      // Array of tags
      published: boolean("published").default(true),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    testimonials = pgTable("testimonials", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      role: text("role").notNull(),
      company: text("company").notNull(),
      // Testimonial text in different languages
      testimonialPt: text("testimonial_pt").notNull(),
      // Portuguese (default)
      testimonialEn: text("testimonial_en"),
      testimonialEs: text("testimonial_es"),
      testimonialFr: text("testimonial_fr"),
      avatarUrl: text("avatar_url"),
      rating: integer("rating").default(5),
      // 1-5 stars
      order: integer("order").default(0),
      // for display ordering
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    videoTutorials = pgTable("video_tutorials", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      titleEn: text("title_en"),
      titleEs: text("title_es"),
      titleFr: text("title_fr"),
      description: text("description"),
      descriptionEn: text("description_en"),
      descriptionEs: text("description_es"),
      descriptionFr: text("description_fr"),
      phase: text("phase").notNull(),
      // 'overview', 'empathize', 'define', 'ideate', 'prototype', 'test'
      duration: text("duration"),
      // e.g., '3-4 min'
      youtubeUrl: text("youtube_url"),
      // URL do vídeo no YouTube
      thumbnailUrl: text("thumbnail_url"),
      keywords: text("keywords").array().default(sql`'{}'::text[]`),
      // Array of SEO keywords
      tags: text("tags").array().default(sql`'{}'::text[]`),
      // User-facing category tags
      scriptId: text("script_id"),
      // Reference to script in markdown file
      order: integer("order").default(0),
      isActive: boolean("is_active").default(true),
      viewCount: integer("view_count").default(0),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    insertProjectSchema = createInsertSchema(projects).omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    });
    insertEmpathyMapSchema = createInsertSchema(empathyMaps).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPersonaSchema = createInsertSchema(personas).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertInterviewSchema = createInsertSchema(interviews, {
      questions: z.array(z.string()).optional(),
      responses: z.array(z.string()).optional()
    }).omit({
      id: true,
      createdAt: true
    });
    insertObservationSchema = createInsertSchema(observations).omit({
      id: true,
      createdAt: true
    });
    insertPovStatementSchema = createInsertSchema(povStatements).omit({
      id: true,
      createdAt: true
    });
    insertHmwQuestionSchema = createInsertSchema(hmwQuestions).omit({
      id: true,
      createdAt: true
    });
    insertIdeaSchema = createInsertSchema(ideas).omit({
      id: true,
      createdAt: true
    });
    insertPrototypeSchema = createInsertSchema(prototypes).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertTestPlanSchema = createInsertSchema(testPlans).omit({
      id: true,
      createdAt: true
    });
    insertTestResultSchema = createInsertSchema(testResults).omit({
      id: true,
      createdAt: true
    });
    insertUserProgressSchema = createInsertSchema(userProgress).omit({
      id: true,
      updatedAt: true
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true
    });
    insertArticleSchema = createInsertSchema(articles).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertTestimonialSchema = createInsertSchema(testimonials).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertVideoTutorialSchema = createInsertSchema(videoTutorials).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      viewCount: true
    });
    insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
      id: true,
      createdAt: true
    });
    insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertUserAddonSchema = createInsertSchema(userAddons).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCanvasDrawingSchema = createInsertSchema(canvasDrawings).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    updateProfileSchema = createInsertSchema(users).omit({
      id: true,
      username: true,
      password: true,
      role: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      subscriptionPlanId: true,
      subscriptionStatus: true,
      subscriptionEndDate: true,
      createdAt: true
    }).partial();
    guidingCriteria = pgTable("guiding_criteria", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      title: text("title").notNull(),
      description: text("description"),
      category: text("category"),
      importance: text("importance").default("medium"),
      tags: jsonb("tags").default([]),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    insertGuidingCriterionSchema = createInsertSchema(guidingCriteria).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    phaseCards = pgTable("phase_cards", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      title: text("title").notNull(),
      description: text("description"),
      phase: integer("phase").notNull().default(1),
      // 1-5 phases (Empatizar, Definir, Idear, Prototipar, Testar)
      status: text("status").default("todo"),
      // todo, in_progress, done
      priority: text("priority").default("medium"),
      // low, medium, high
      assignee: text("assignee"),
      // Optional assignee
      tags: jsonb("tags").default([]),
      // Array of tags for categorization
      dueDate: timestamp("due_date"),
      position: integer("position").default(0),
      // Order within the phase column
      color: text("color").default("blue"),
      // Card color for visual organization
      attachments: jsonb("attachments").default([]),
      // File attachments metadata
      comments: jsonb("comments").default([]),
      // Comments/notes
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    benchmarks = pgTable("benchmarks", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      name: text("name").notNull(),
      description: text("description"),
      industry: text("industry").notNull(),
      // tech, healthcare, finance, retail, etc.
      companySize: text("company_size").notNull(),
      // startup, small, medium, large, enterprise
      maturityScores: jsonb("maturity_scores").default({}),
      // { empathize: 4, define: 3, ideate: 5, prototype: 2, test: 3 }
      benchmarkType: text("benchmark_type").notNull().default("industry"),
      // industry, internal, custom
      targetScores: jsonb("target_scores").default({}),
      // Goals for each phase
      improvementAreas: jsonb("improvement_areas").default([]),
      // Array of focus areas
      recommendations: jsonb("recommendations").default([]),
      // AI-generated suggestions
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    benchmarkAssessments = pgTable("benchmark_assessments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      benchmarkId: varchar("benchmark_id").references(() => benchmarks.id).notNull(),
      phase: integer("phase").notNull(),
      // 1-5 for DT phases
      criteria: text("criteria").notNull(),
      // What is being assessed
      currentScore: real("current_score").notNull(),
      // 1-5 rating
      targetScore: real("target_score").notNull(),
      // Goal score
      industryAverage: real("industry_average"),
      // Benchmark comparison
      evidence: text("evidence"),
      // Supporting evidence for the score
      improvementPlan: text("improvement_plan"),
      // How to improve
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    doubleDiamondExports = pgTable("double_diamond_exports", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      doubleDiamondProjectId: varchar("double_diamond_project_id").references(() => doubleDiamondProjects.id, { onDelete: "cascade" }).notNull(),
      exportedProjectId: varchar("exported_project_id").references(() => projects.id, { onDelete: "cascade" }),
      // Created project in main system
      exportType: text("export_type").default("full"),
      // full, partial
      includedPhases: jsonb("included_phases").default([]),
      // Which phases were exported: empathize, define, ideate, prototype, test
      exportCost: real("export_cost").default(0),
      // Cost in credits
      status: text("status").default("completed"),
      // completed, failed, processing
      errorMessage: text("error_message"),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    insertDoubleDiamondExportSchema = createInsertSchema(doubleDiamondExports).omit({
      id: true,
      createdAt: true
    });
    insertBenchmarkSchema = createInsertSchema(benchmarks).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertBenchmarkAssessmentSchema = createInsertSchema(benchmarkAssessments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPhaseCardSchema = createInsertSchema(phaseCards).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    dvfAssessments = pgTable("dvf_assessments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      itemType: text("item_type").notNull(),
      // idea, prototype, solution, etc.
      itemId: varchar("item_id").notNull(),
      // Reference to the evaluated item
      itemName: text("item_name").notNull(),
      // Desirability - User desirability
      desirabilityScore: real("desirability_score").notNull().default(0),
      // 1-5 scale
      desirabilityEvidence: text("desirability_evidence"),
      // Supporting evidence
      userFeedback: text("user_feedback"),
      // Direct user feedback
      marketDemand: real("market_demand").default(0),
      // Market demand indicator
      // Feasibility - Technical feasibility  
      feasibilityScore: real("feasibility_score").notNull().default(0),
      // 1-5 scale
      feasibilityEvidence: text("feasibility_evidence"),
      technicalComplexity: text("technical_complexity"),
      // low, medium, high
      resourceRequirements: jsonb("resource_requirements").default([]),
      // Required resources
      timeToImplement: integer("time_to_implement"),
      // Estimated time in days
      // Viability - Economic viability
      viabilityScore: real("viability_score").notNull().default(0),
      // 1-5 scale  
      viabilityEvidence: text("viability_evidence"),
      businessModel: text("business_model"),
      // How it generates value
      costEstimate: real("cost_estimate"),
      // Implementation cost
      revenueProjection: real("revenue_projection"),
      // Expected revenue
      // Overall DVF analysis
      overallScore: real("overall_score").default(0),
      // Average of the three pillars
      recommendation: text("recommendation"),
      // proceed, modify, stop
      nextSteps: jsonb("next_steps").default([]),
      // Recommended actions
      risksIdentified: jsonb("risks_identified").default([]),
      // Potential risks
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    lovabilityMetrics = pgTable("lovability_metrics", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      itemType: text("item_type").notNull(),
      // idea, prototype, solution
      itemId: varchar("item_id").notNull(),
      // Reference to the item being evaluated
      itemName: text("item_name").notNull(),
      // Core Metrics
      npsScore: real("nps_score").default(0),
      // -100 to 100
      satisfactionScore: real("satisfaction_score").default(0),
      // 0-10
      retentionRate: real("retention_rate").default(0),
      // 0-100%
      engagementTime: real("engagement_time").default(0),
      // minutes
      // Emotional Distribution
      emotionalDistribution: jsonb("emotional_distribution").default({}),
      // delight, satisfaction, neutral, frustration percentages
      // Feedback Analysis
      positiveComments: jsonb("positive_comments").default([]),
      negativeComments: jsonb("negative_comments").default([]),
      improvementSuggestions: jsonb("improvement_suggestions").default([]),
      // User Behavior
      userTestingSessions: integer("user_testing_sessions").default(0),
      completionRate: real("completion_rate").default(0),
      // 0-100%
      errorRate: real("error_rate").default(0),
      // 0-100%
      supportTickets: integer("support_tickets").default(0),
      // Qualitative Insights
      emotionalStory: text("emotional_story"),
      userPersonas: jsonb("user_personas").default([]),
      keyMoments: jsonb("key_moments").default([]),
      painPoints: jsonb("pain_points").default([]),
      // Overall Assessment
      lovabilityScore: real("lovability_score").default(0),
      // 0-10 calculated score
      recommendations: jsonb("recommendations").default([]),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    projectAnalytics = pgTable("project_analytics", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      // Usage metrics
      totalTimeSpent: integer("total_time_spent").default(0),
      // minutes
      timePerPhase: jsonb("time_per_phase").default({}),
      // { phase1: 120, phase2: 90, ... }
      toolsUsed: jsonb("tools_used").default([]),
      // List of tools/features used
      toolUsageCount: jsonb("tool_usage_count").default({}),
      // Usage frequency per tool
      // Progress metrics
      completionRate: real("completion_rate").default(0),
      // 0-100%
      phasesCompleted: jsonb("phases_completed").default([]),
      // Which phases are done
      stageProgressions: integer("stage_progressions").default(0),
      // Times moved between phases
      iterationsCount: integer("iterations_count").default(0),
      // Number of iterations
      // Success indicators
      prototypesCreated: integer("prototypes_created").default(0),
      testsCompleted: integer("tests_completed").default(0),
      userFeedbackCollected: integer("user_feedback_collected").default(0),
      ideasGenerated: integer("ideas_generated").default(0),
      ideasImplemented: integer("ideas_implemented").default(0),
      // Team collaboration metrics
      teamSize: integer("team_size").default(1),
      collaborationEvents: integer("collaboration_events").default(0),
      meetingsHeld: integer("meetings_held").default(0),
      decisionsMade: integer("decisions_made").default(0),
      // Innovation metrics
      originalityScore: real("originality_score").default(0),
      // 1-10
      feasibilityScore: real("feasibility_score").default(0),
      // 1-10
      impactPotential: real("impact_potential").default(0),
      // 1-10
      marketFit: real("market_fit").default(0),
      // 1-10
      // Success metrics
      overallSuccess: real("overall_success").default(0),
      // 0-100%
      userSatisfaction: real("user_satisfaction").default(0),
      // 0-10
      goalAchievement: real("goal_achievement").default(0),
      // 0-100%
      innovationLevel: real("innovation_level").default(0),
      // 1-5
      // Key insights
      topPerformingTools: jsonb("top_performing_tools").default([]),
      timeBottlenecks: jsonb("time_bottlenecks").default([]),
      successFactors: jsonb("success_factors").default([]),
      improvementAreas: jsonb("improvement_areas").default([]),
      lastUpdated: timestamp("last_updated").default(sql`now()`),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    competitiveAnalysis = pgTable("competitive_analysis", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      // Competitor info
      competitorName: text("competitor_name").notNull(),
      // Miro, Figma, Notion, etc.
      competitorType: text("competitor_type").notNull(),
      // direct, indirect, substitute
      marketPosition: text("market_position"),
      // leader, challenger, niche
      // Feature comparison
      features: jsonb("features").default({}),
      // Feature matrix comparison
      functionalGaps: jsonb("functional_gaps").default([]),
      // What they lack
      functionalOverages: jsonb("functional_overages").default([]),
      // What they overdo
      // Pricing comparison
      pricingModel: text("pricing_model"),
      // freemium, subscription, one-time
      pricePoints: jsonb("price_points").default([]),
      // Their pricing tiers
      valueProposition: text("value_proposition"),
      // Their main value prop
      // Market gaps
      underservedOutcomes: jsonb("underserved_outcomes").default([]),
      // Market gaps
      overservedOutcomes: jsonb("overserved_outcomes").default([]),
      // Overcomplicated areas
      // Our positioning
      ourAdvantages: jsonb("our_advantages").default([]),
      // Where we're better
      ourDisadvantages: jsonb("our_disadvantages").default([]),
      // Where we lack
      recommendations: jsonb("recommendations").default([]),
      // Strategic recommendations
      analysisDate: timestamp("analysis_date").default(sql`now()`),
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    projectBackups = pgTable("project_backups", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      // Backup metadata
      backupType: text("backup_type").notNull(),
      // auto, manual
      description: text("description"),
      // Project snapshot at backup time
      projectSnapshot: jsonb("project_snapshot").notNull(),
      // Complete project data
      // Statistics at backup time
      phaseSnapshot: integer("phase_snapshot"),
      // Current phase at backup
      completionSnapshot: real("completion_snapshot"),
      // Completion rate at backup
      itemCount: integer("item_count"),
      // Total items in backup
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    helpArticles = pgTable("help_articles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      slug: text("slug").notNull().unique(),
      // URL-friendly identifier
      content: text("content").notNull(),
      // Markdown content
      category: text("category").notNull(),
      // inicio-rapido, fases, exportacao, etc
      subcategory: text("subcategory"),
      // Optional subcategory
      phase: integer("phase"),
      // 1-5 if related to specific DT phase
      tags: jsonb("tags").default([]),
      // Array of searchable tags
      searchKeywords: jsonb("search_keywords").default([]),
      // Keywords for search
      featured: boolean("featured").default(false),
      // Show in main help
      author: text("author").notNull().default("DTTools Team"),
      // Article author
      viewCount: integer("view_count").default(0),
      helpful: integer("helpful").default(0),
      // Helpful votes
      order: integer("order").default(0),
      // Display order within category
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    insertDvfAssessmentSchema = createInsertSchema(dvfAssessments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertLovabilityMetricSchema = createInsertSchema(lovabilityMetrics).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertProjectAnalyticsSchema = createInsertSchema(projectAnalytics).omit({
      id: true,
      createdAt: true,
      lastUpdated: true
    });
    insertCompetitiveAnalysisSchema = createInsertSchema(competitiveAnalysis).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      analysisDate: true
    });
    insertProjectBackupSchema = createInsertSchema(projectBackups).omit({
      id: true,
      createdAt: true
    });
    insertHelpArticleSchema = createInsertSchema(helpArticles).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      viewCount: true,
      helpful: true
    });
    insertIndustrySectorSchema = createInsertSchema(industrySectors).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSuccessCaseSchema = createInsertSchema(successCases).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertAiGeneratedAssetSchema = createInsertSchema(aiGeneratedAssets).omit({
      id: true,
      createdAt: true
    });
    analyticsEvents = pgTable("analytics_events", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      eventType: text("event_type").notNull(),
      // 'signup', 'login', 'project_created', 'ai_generation', 'export_pdf', etc.
      userId: varchar("user_id").references(() => users.id),
      projectId: varchar("project_id").references(() => projects.id),
      metadata: jsonb("metadata"),
      // Additional event data
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
      id: true,
      createdAt: true
    });
    projectMembers = pgTable("project_members", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      role: text("role").notNull().default("viewer"),
      // 'owner', 'editor', 'viewer'
      addedBy: varchar("added_by").references(() => users.id),
      addedAt: timestamp("added_at").default(sql`now()`)
    });
    insertProjectMemberSchema = createInsertSchema(projectMembers).omit({
      id: true,
      addedAt: true
    });
    projectInvites = pgTable("project_invites", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      email: text("email").notNull(),
      role: text("role").notNull().default("viewer"),
      // 'editor', 'viewer'
      invitedBy: varchar("invited_by").references(() => users.id).notNull(),
      status: text("status").notNull().default("pending"),
      // 'pending', 'accepted', 'declined', 'expired'
      token: text("token").notNull(),
      // Unique invite token
      expiresAt: timestamp("expires_at").notNull(),
      respondedAt: timestamp("responded_at"),
      createdAt: timestamp("created_at").default(sql`now()`)
    });
    insertProjectInviteSchema = createInsertSchema(projectInvites).omit({
      id: true,
      createdAt: true,
      respondedAt: true
    });
    projectComments = pgTable("project_comments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      entityType: text("entity_type").notNull(),
      // 'persona', 'pov', 'idea', 'prototype', 'project'
      entityId: varchar("entity_id"),
      // ID of the specific entity being commented on
      comment: text("comment").notNull(),
      parentCommentId: varchar("parent_comment_id"),
      // For threaded comments (no FK to avoid circular reference)
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    insertProjectCommentSchema = createInsertSchema(projectComments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    doubleDiamondProjects = pgTable("double_diamond_projects", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
      name: text("name").notNull(),
      description: text("description"),
      // Initial Setup (Minimal User Input)
      sectorId: varchar("sector_id").references(() => industrySectors.id),
      successCaseId: varchar("success_case_id").references(() => successCases.id),
      // Case to mirror (Airbnb, Uber, etc.)
      customSuccessCase: text("custom_success_case"),
      // User's custom success case (if not in list)
      customSuccessCaseUrl: text("custom_success_case_url"),
      // Optional URL with additional reference materials
      customSuccessCasePdfUrl: text("custom_success_case_pdf_url"),
      // Optional URL to a reference PDF
      targetAudience: text("target_audience"),
      // User's minimal description of audience
      problemStatement: text("problem_statement"),
      // User's initial problem description
      // Phase 1: Discover (Divergence) - Diamond 1
      discoverStatus: text("discover_status").default("pending"),
      // pending, in_progress, completed
      discoverPainPoints: jsonb("discover_pain_points"),
      // AI-generated list of pain points [{text, validated}]
      discoverInsights: jsonb("discover_insights"),
      // AI-generated insights from sector/case
      discoverUserNeeds: jsonb("discover_user_needs"),
      // AI-generated user needs
      discoverEmpathyMap: jsonb("discover_empathy_map"),
      // Auto-generated empathy map {says, thinks, does, feels}
      // Phase 2: Define (Convergence) - Diamond 1
      defineStatus: text("define_status").default("pending"),
      definePovStatements: jsonb("define_pov_statements"),
      // AI-generated POV statements [{user, need, insight, selected}]
      defineHmwQuestions: jsonb("define_hmw_questions"),
      // AI-generated HMW questions [{question, selected}]
      defineSelectedPov: text("define_selected_pov"),
      // User-selected POV statement
      defineSelectedHmw: text("define_selected_hmw"),
      // User-selected HMW question
      // Phase 3: Develop (Divergence) - Diamond 2
      developStatus: text("develop_status").default("pending"),
      developIdeas: jsonb("develop_ideas"),
      // AI-generated ideas [{title, description, category, score}]
      developCrossPollinatedIdeas: jsonb("develop_cross_pollinated_ideas"),
      // AI cross-domain ideas
      developSelectedIdeas: jsonb("develop_selected_ideas"),
      // User-selected ideas for prototyping
      // Phase 4: Deliver (Convergence) - Diamond 2
      deliverStatus: text("deliver_status").default("pending"),
      deliverMvpConcept: jsonb("deliver_mvp_concept"),
      // AI-generated MVP concept
      deliverLogoSuggestions: jsonb("deliver_logo_suggestions"),
      // AI-generated logo ideas [{description, style}]
      deliverLandingPage: jsonb("deliver_landing_page"),
      // AI-generated landing page structure {headline, sections, cta}
      deliverSocialMediaLines: jsonb("deliver_social_media_lines"),
      // AI-generated social media copy
      deliverTestPlan: jsonb("deliver_test_plan"),
      // AI-generated basic test plan
      // DFV Analysis (Desirability, Feasibility, Viability)
      dfvDesirabilityScore: integer("dfv_desirability_score"),
      // 0-100
      dfvFeasibilityScore: integer("dfv_feasibility_score"),
      // 0-100
      dfvViabilityScore: integer("dfv_viability_score"),
      // 0-100
      dfvAnalysis: jsonb("dfv_analysis"),
      // AI-generated analysis and recommendations
      dfvFeedback: text("dfv_feedback"),
      // AI-generated actionable feedback
      // Progress and Completion
      currentPhase: text("current_phase").default("discover"),
      // discover, define, develop, deliver
      completionPercentage: integer("completion_percentage").default(0),
      isCompleted: boolean("is_completed").default(false),
      // AI Generation Metadata
      totalAiCost: real("total_ai_cost").default(0),
      // Total cost in credits
      generationCount: integer("generation_count").default(0),
      // Number of AI calls made
      createdAt: timestamp("created_at").default(sql`now()`),
      updatedAt: timestamp("updated_at").default(sql`now()`)
    });
    insertDoubleDiamondProjectSchema = createInsertSchema(doubleDiamondProjects).omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool
});
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes("render.com") ? { rejectUnauthorized: false } : process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      // Performance optimizations for production
      max: 50,
      // Maximum 50 connections in pool (up from default 10)
      min: 5,
      // Minimum 5 idle connections (faster response time)
      idleTimeoutMillis: 3e4,
      // Close idle connections after 30s
      connectionTimeoutMillis: 5e3,
      // Connection timeout: 5s
      maxUses: 7500
      // Recycle connection after 7500 uses
    });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/storage.ts
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { eq as eq2, and, desc, sql as sql2, gte } from "drizzle-orm";
async function initializeDefaultData() {
  try {
    const adminUser = await storage.getUserByUsername("dttools.app@gmail.com");
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("Gulex0519!@", 10);
      await storage.createUser({
        username: "dttools.app@gmail.com",
        email: "dttools.app@gmail.com",
        name: "DTTools Admin",
        password: hashedPassword,
        role: "admin",
        company: "DTTools",
        jobRole: "Administrator",
        industry: "Design Thinking",
        experience: "expert",
        country: "Brasil",
        state: "SP",
        city: "S\xE3o Paulo"
      });
      console.log("\u2705 Admin user created successfully");
    }
    const existingPlans = await storage.getSubscriptionPlans();
    if (existingPlans.length === 0) {
      await storage.createSubscriptionPlan({
        name: "Free",
        displayName: "Plano Gratuito",
        description: "Plan gratuito com recursos b\xE1sicos",
        priceMonthly: 0,
        priceYearly: 0,
        features: ["3 projetos", "Ferramentas b\xE1sicas", "Suporte por email"],
        maxProjects: 3,
        isActive: true,
        order: 1
      });
      await storage.createSubscriptionPlan({
        name: "Pro",
        displayName: "Plano Individual",
        description: "Plan profissional com recursos avan\xE7ados",
        priceMonthly: 4e3,
        // R$ 40,00 in cents
        priceYearly: 43200,
        // R$ 432,00 in cents (10% discount)
        features: ["Projetos ilimitados", "Todas as ferramentas", "An\xE1lise AI", "Suporte priorit\xE1rio"],
        maxProjects: -1,
        // unlimited
        isActive: true,
        order: 2
      });
      await storage.createSubscriptionPlan({
        name: "Enterprise",
        displayName: "Plano Enterprise",
        description: "Plan empresarial com recursos completos (10 usu\xE1rios inclusos)",
        priceMonthly: 29900,
        // R$ 299,00 in cents
        priceYearly: 322920,
        // R$ 3.229,20 in cents (10% discount: 29900 * 12 * 0.9)
        features: ["Tudo do Pro", "10 usu\xE1rios inclusos", "Usu\xE1rios adicionais: R$ 29,90/usu\xE1rio", "Time ilimitado", "Suporte dedicado", "Treinamentos"],
        maxProjects: -1,
        // unlimited
        isActive: true,
        order: 3
      });
      console.log("\u2705 Subscription plans created");
    } else {
      await db.update(subscriptionPlans).set({ order: 1 }).where(eq2(subscriptionPlans.name, "Free"));
      await db.update(subscriptionPlans).set({ order: 2 }).where(eq2(subscriptionPlans.name, "Pro"));
      await db.update(subscriptionPlans).set({ order: 3 }).where(eq2(subscriptionPlans.name, "Enterprise"));
      console.log("\u2705 Subscription plan order updated");
    }
    const existingArticles = await storage.getArticles();
    const dtToolsArticles = existingArticles.filter((a) => a.author === "DTTools");
    if (dtToolsArticles.length === 0) {
      const defaultArticles = [
        {
          title: "Introdu\xE7\xE3o ao Design Thinking",
          slug: "introducao-design-thinking",
          category: "foundations",
          author: "DTTools",
          description: "Aprenda os fundamentos do Design Thinking e como aplicar em seus projetos",
          content: "# Introdu\xE7\xE3o ao Design Thinking\n\nDesign Thinking \xE9 uma abordagem centrada no ser humano para inova\xE7\xE3o...",
          tags: ["fundamentos", "iniciante", "conceitos"],
          readTime: 5,
          featured: true,
          published: true
        },
        {
          title: "Como criar Mapas de Empatia eficazes",
          slug: "mapas-empatia-eficazes",
          category: "empathize",
          author: "DTTools",
          description: "Guia completo para criar Mapas de Empatia que revelam insights profundos sobre seus usu\xE1rios",
          content: "# Mapas de Empatia\n\nMapas de Empatia s\xE3o ferramentas poderosas para entender seus usu\xE1rios...",
          tags: ["empatizar", "ferramentas", "usu\xE1rios"],
          readTime: 7,
          featured: true,
          published: true
        },
        {
          title: "Definindo Problemas com POV Statements",
          slug: "pov-statements-guia",
          category: "define",
          author: "DTTools",
          description: "Aprenda a estruturar Point of View statements para definir problemas de forma clara",
          content: "# POV Statements\n\nPoint of View statements ajudam a definir o problema certo...",
          tags: ["definir", "problema", "framework"],
          readTime: 6,
          featured: false,
          published: true
        },
        {
          title: "T\xE9cnicas de Brainstorming para Idea\xE7\xE3o",
          slug: "brainstorming-tecnicas",
          category: "ideate",
          author: "DTTools",
          description: "Descubra t\xE9cnicas criativas de brainstorming para gerar ideias inovadoras",
          content: "# Brainstorming Eficaz\n\nBrainstorming \xE9 mais do que simplesmente listar ideias...",
          tags: ["idear", "criatividade", "t\xE9cnicas"],
          readTime: 8,
          featured: true,
          published: true
        },
        {
          title: "Prototipagem R\xE1pida: Do Papel ao Digital",
          slug: "prototipagem-rapida",
          category: "prototype",
          author: "DTTools",
          description: "Aprenda a criar prot\xF3tipos r\xE1pidos para validar suas ideias",
          content: "# Prototipagem R\xE1pida\n\nProt\xF3tipos permitem testar ideias rapidamente...",
          tags: ["prototipar", "valida\xE7\xE3o", "pr\xE1tica"],
          readTime: 10,
          featured: false,
          published: true
        },
        {
          title: "Testes com Usu\xE1rios: Melhores Pr\xE1ticas",
          slug: "testes-usuarios-praticas",
          category: "test",
          author: "DTTools",
          description: "Guia completo para conduzir testes de usabilidade e coletar feedback valioso",
          content: "# Testes com Usu\xE1rios\n\nTestar com usu\xE1rios reais \xE9 essencial para validar solu\xE7\xF5es...",
          tags: ["testar", "feedback", "valida\xE7\xE3o"],
          readTime: 9,
          featured: true,
          published: true
        }
      ];
      for (const article of defaultArticles) {
        await storage.createArticle(article);
      }
      console.log("\u2705 Default articles created");
    }
    const existingHelpArticles = await storage.getHelpArticles();
    if (existingHelpArticles.length === 0) {
      const defaultHelpArticles = [
        {
          title: "Como come\xE7ar a usar o DTTools",
          slug: "como-comecar",
          category: "getting-started",
          content: "# Como come\xE7ar\n\nBem-vindo ao DTTools! Este guia vai te ajudar a dar os primeiros passos...",
          tags: ["iniciante", "tutorial", "primeiros-passos"],
          keywords: ["come\xE7ar", "iniciar", "primeiro projeto"],
          order: 1,
          published: true
        },
        {
          title: "Criando seu primeiro projeto",
          slug: "primeiro-projeto",
          category: "getting-started",
          content: "# Seu Primeiro Projeto\n\nCriar um projeto no DTTools \xE9 simples e r\xE1pido...",
          tags: ["projeto", "tutorial", "iniciante"],
          keywords: ["criar projeto", "novo projeto"],
          order: 2,
          published: true
        },
        {
          title: "Entendendo as 5 fases do Design Thinking",
          slug: "cinco-fases",
          category: "getting-started",
          content: "# As 5 Fases\n\nDesign Thinking \xE9 dividido em 5 fases: Empatizar, Definir, Idear, Prototipar e Testar...",
          tags: ["fases", "metodologia", "design thinking"],
          keywords: ["fases", "empatizar", "definir", "idear", "prototipar", "testar"],
          order: 3,
          published: true
        },
        {
          title: "Trabalhando em equipe",
          slug: "trabalho-equipe",
          category: "collaboration",
          content: "# Colabora\xE7\xE3o\n\nO DTTools facilita o trabalho em equipe com ferramentas de colabora\xE7\xE3o...",
          tags: ["equipe", "colabora\xE7\xE3o", "compartilhamento"],
          keywords: ["equipe", "time", "colaborar", "compartilhar"],
          order: 4,
          published: true
        },
        {
          title: "Exportando seus dados",
          slug: "exportar-dados",
          category: "features",
          content: "# Exporta\xE7\xE3o\n\nVoc\xEA pode exportar seus projetos em PDF, CSV e outros formatos...",
          tags: ["exportar", "pdf", "download"],
          keywords: ["exportar", "download", "pdf", "csv"],
          order: 5,
          published: true
        }
      ];
      for (const helpArticle of defaultHelpArticles) {
        await storage.createHelpArticle(helpArticle);
      }
      console.log("\u2705 Default help articles created");
    }
  } catch (error) {
    console.error("\u274C Error initializing default data:", error);
  }
}
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class {
      // Projects
      async getProjects(userId) {
        return await db.select().from(projects).where(eq2(projects.userId, userId)).orderBy(desc(projects.createdAt));
      }
      async getAllProjects() {
        return await db.select().from(projects).orderBy(desc(projects.createdAt));
      }
      async getProject(id, userId) {
        const [project] = await db.select().from(projects).where(and(eq2(projects.id, id), eq2(projects.userId, userId)));
        return project;
      }
      async createProject(project) {
        const [newProject] = await db.insert(projects).values(project).returning();
        return newProject;
      }
      async updateProject(id, userId, project) {
        const [updatedProject] = await db.update(projects).set({ ...project, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq2(projects.id, id), eq2(projects.userId, userId))).returning();
        return updatedProject;
      }
      async deleteProject(id, userId) {
        const deleteTable = async (tableName, deleteQuery) => {
          try {
            await deleteQuery();
            console.log(`[DELETE PROJECT] \u2713 Deleted from ${tableName}`);
          } catch (error) {
            console.log(`[DELETE PROJECT] \u26A0 Skipping ${tableName} (error code ${error?.code}):`, error?.message || error);
          }
        };
        await deleteTable("projectComments", () => db.delete(projectComments).where(eq2(projectComments.projectId, id)));
        await deleteTable("projectInvites", () => db.delete(projectInvites).where(eq2(projectInvites.projectId, id)));
        await deleteTable("projectMembers", () => db.delete(projectMembers).where(eq2(projectMembers.projectId, id)));
        await deleteTable("analyticsEvents", () => db.delete(analyticsEvents).where(eq2(analyticsEvents.projectId, id)));
        await deleteTable("aiGeneratedAssets", () => db.delete(aiGeneratedAssets).where(eq2(aiGeneratedAssets.projectId, id)));
        await deleteTable("empathyMaps", () => db.delete(empathyMaps).where(eq2(empathyMaps.projectId, id)));
        await deleteTable("personas", () => db.delete(personas).where(eq2(personas.projectId, id)));
        await deleteTable("interviews", () => db.delete(interviews).where(eq2(interviews.projectId, id)));
        await deleteTable("observations", () => db.delete(observations).where(eq2(observations.projectId, id)));
        await deleteTable("povStatements", () => db.delete(povStatements).where(eq2(povStatements.projectId, id)));
        await deleteTable("hmwQuestions", () => db.delete(hmwQuestions).where(eq2(hmwQuestions.projectId, id)));
        await deleteTable("guidingCriteria", () => db.delete(guidingCriteria).where(eq2(guidingCriteria.projectId, id)));
        await deleteTable("ideas", () => db.delete(ideas).where(eq2(ideas.projectId, id)));
        await deleteTable("prototypes", () => db.delete(prototypes).where(eq2(prototypes.projectId, id)));
        await deleteTable("testPlans", () => db.delete(testPlans).where(eq2(testPlans.projectId, id)));
        await deleteTable("testResults", () => db.delete(testResults).where(eq2(testResults.projectId, id)));
        await deleteTable("canvasDrawings", () => db.delete(canvasDrawings).where(eq2(canvasDrawings.projectId, id)));
        await deleteTable("phaseCards", () => db.delete(phaseCards).where(eq2(phaseCards.projectId, id)));
        await deleteTable("benchmarkAssessments", () => db.delete(benchmarkAssessments).where(eq2(benchmarkAssessments.projectId, id)));
        await deleteTable("dvfAssessments", () => db.delete(dvfAssessments).where(eq2(dvfAssessments.projectId, id)));
        await deleteTable("lovabilityMetrics", () => db.delete(lovabilityMetrics).where(eq2(lovabilityMetrics.projectId, id)));
        await deleteTable("projectAnalytics", () => db.delete(projectAnalytics).where(eq2(projectAnalytics.projectId, id)));
        await deleteTable("competitiveAnalysis", () => db.delete(competitiveAnalysis).where(eq2(competitiveAnalysis.projectId, id)));
        await deleteTable("projectBackups", () => db.delete(projectBackups).where(eq2(projectBackups.projectId, id)));
        await deleteTable("userProgress", () => db.delete(userProgress).where(eq2(userProgress.projectId, id)));
        await deleteTable("benchmarks", () => db.delete(benchmarks).where(eq2(benchmarks.projectId, id)));
        try {
          const result = await db.delete(projects).where(and(eq2(projects.id, id), eq2(projects.userId, userId)));
          const success = (result.rowCount || 0) > 0;
          console.log(`[DELETE PROJECT] \u2713 Final project deletion result: ${success}, rowCount: ${result.rowCount}`);
          return success;
        } catch (error) {
          console.error(`[DELETE PROJECT] \u2717 Final project deletion FAILED (error ${error?.code}):`, error?.message);
          throw error;
        }
      }
      // Users
      async getUsers() {
        return await db.select().from(users).orderBy(desc(users.createdAt));
      }
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq2(users.id, id));
        return user;
      }
      async getUserById(id) {
        return this.getUser(id);
      }
      async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq2(users.username, username));
        return user;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq2(users.email, email));
        return user;
      }
      async createUser(user) {
        const [newUser] = await db.insert(users).values(user).returning();
        return newUser;
      }
      async updateUser(id, user) {
        const [updatedUser] = await db.update(users).set(user).where(eq2(users.id, id)).returning();
        return updatedUser;
      }
      async deleteUser(id) {
        try {
          console.log(`[DELETE USER] Starting deletion for user ${id}`);
          try {
            console.log(`[DELETE USER] Step 1: Updating project memberships (addedBy \u2192 null)...`);
            const updated = await db.update(projectMembers).set({ addedBy: null }).where(eq2(projectMembers.addedBy, id));
            console.log(`[DELETE USER] \u2713 Updated ${updated.rowCount || 0} project memberships`);
          } catch (e) {
            console.log(`[DELETE USER] \u26A0 Skipping project_members update (table may not exist): ${e?.message}`);
          }
          try {
            console.log(`[DELETE USER] Step 2: Deleting analytics events...`);
            const deletedEvents = await db.delete(analyticsEvents).where(eq2(analyticsEvents.userId, id));
            console.log(`[DELETE USER] \u2713 Deleted ${deletedEvents.rowCount || 0} analytics events`);
          } catch (e) {
            console.log(`[DELETE USER] \u26A0 Skipping analytics_events (table may not exist): ${e?.message}`);
          }
          try {
            console.log(`[DELETE USER] Step 3: Deleting project comments...`);
            const deletedComments = await db.delete(projectComments).where(eq2(projectComments.userId, id));
            console.log(`[DELETE USER] \u2713 Deleted ${deletedComments.rowCount || 0} comments`);
          } catch (e) {
            console.log(`[DELETE USER] \u26A0 Skipping project_comments (table may not exist): ${e?.message}`);
          }
          try {
            console.log(`[DELETE USER] Step 4: Deleting project invites (invitedBy)...`);
            const deletedInvites = await db.delete(projectInvites).where(eq2(projectInvites.invitedBy, id));
            console.log(`[DELETE USER] \u2713 Deleted ${deletedInvites.rowCount || 0} invites`);
          } catch (e) {
            console.log(`[DELETE USER] \u26A0 Skipping project_invites (table may not exist): ${e?.message}`);
          }
          try {
            console.log(`[DELETE USER] Step 5: Deleting project memberships (userId)...`);
            const deletedMembers = await db.delete(projectMembers).where(eq2(projectMembers.userId, id));
            console.log(`[DELETE USER] \u2713 Deleted ${deletedMembers.rowCount || 0} memberships`);
          } catch (e) {
            console.log(`[DELETE USER] \u26A0 Skipping project_members (table may not exist): ${e?.message}`);
          }
          console.log(`[DELETE USER] Step 6: Deleting user subscriptions...`);
          const deletedSubs = await db.delete(userSubscriptions).where(eq2(userSubscriptions.userId, id));
          console.log(`[DELETE USER] \u2713 Deleted ${deletedSubs.rowCount || 0} subscriptions`);
          console.log(`[DELETE USER] Step 6b: Deleting user add-ons...`);
          const deletedAddons = await db.delete(userAddons).where(eq2(userAddons.userId, id));
          console.log(`[DELETE USER] \u2713 Deleted ${deletedAddons.rowCount || 0} add-ons`);
          console.log(`[DELETE USER] Step 6c: Deleting double diamond exports...`);
          const deletedDdExports = await db.delete(doubleDiamondExports).where(eq2(doubleDiamondExports.userId, id));
          console.log(`[DELETE USER] \u2713 Deleted ${deletedDdExports.rowCount || 0} double diamond exports`);
          console.log(`[DELETE USER] Step 6d: Deleting double diamond projects...`);
          const deletedDdProjects = await db.delete(doubleDiamondProjects).where(eq2(doubleDiamondProjects.userId, id));
          console.log(`[DELETE USER] \u2713 Deleted ${deletedDdProjects.rowCount || 0} double diamond projects`);
          console.log(`[DELETE USER] Step 7: Finding user's projects...`);
          const userProjects = await db.select({ id: projects.id }).from(projects).where(eq2(projects.userId, id));
          console.log(`[DELETE USER] \u2713 Found ${userProjects.length} projects`);
          if (userProjects.length > 0) {
            const projectIds = userProjects.map((p) => p.id);
            console.log(`[DELETE USER] Step 8: Deleting all project-related data for ${projectIds.length} projects...`);
            for (const projectId of projectIds) {
              try {
                await db.delete(aiGeneratedAssets).where(eq2(aiGeneratedAssets.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(analyticsEvents).where(eq2(analyticsEvents.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(projectComments).where(eq2(projectComments.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(projectInvites).where(eq2(projectInvites.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(projectMembers).where(eq2(projectMembers.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(empathyMaps).where(eq2(empathyMaps.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(personas).where(eq2(personas.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(interviews).where(eq2(interviews.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(observations).where(eq2(observations.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(povStatements).where(eq2(povStatements.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(hmwQuestions).where(eq2(hmwQuestions.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(guidingCriteria).where(eq2(guidingCriteria.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(ideas).where(eq2(ideas.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(prototypes).where(eq2(prototypes.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(testPlans).where(eq2(testPlans.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(testResults).where(eq2(testResults.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(canvasDrawings).where(eq2(canvasDrawings.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(phaseCards).where(eq2(phaseCards.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(benchmarkAssessments).where(eq2(benchmarkAssessments.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(dvfAssessments).where(eq2(dvfAssessments.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(lovabilityMetrics).where(eq2(lovabilityMetrics.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(projectAnalytics).where(eq2(projectAnalytics.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(competitiveAnalysis).where(eq2(competitiveAnalysis.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(projectBackups).where(eq2(projectBackups.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(userProgress).where(eq2(userProgress.projectId, projectId));
              } catch (e) {
              }
              try {
                await db.delete(benchmarks).where(eq2(benchmarks.projectId, projectId));
              } catch (e) {
              }
            }
            await db.delete(projects).where(eq2(projects.userId, id));
            console.log(`[DELETE USER] \u2713 Deleted all projects and related data`);
          }
          console.log(`[DELETE USER] Step 9: Deleting user progress...`);
          const deletedProgress = await db.delete(userProgress).where(eq2(userProgress.userId, id));
          console.log(`[DELETE USER] \u2713 Deleted ${deletedProgress.rowCount || 0} progress records`);
          console.log(`[DELETE USER] Step 10: FINAL - Deleting user from users table...`);
          const result = await db.delete(users).where(eq2(users.id, id));
          const success = (result.rowCount || 0) > 0;
          console.log(`[DELETE USER] ${success ? "\u2705 SUCCESS" : "\u274C FAILED"}: User deletion ${success ? "completed" : "failed"} (rowCount: ${result.rowCount})`);
          return success;
        } catch (error) {
          console.error(`[DELETE USER] \u274C EXCEPTION: Failed to delete user ${id}`);
          console.error(`[DELETE USER] Error code: ${error?.code}`);
          console.error(`[DELETE USER] Error message: ${error?.message}`);
          console.error(`[DELETE USER] Error detail: ${error?.detail}`);
          console.error(`[DELETE USER] Full error:`, error);
          throw error;
        }
      }
      // Articles
      async getArticles() {
        return await db.select().from(articles).orderBy(desc(articles.createdAt));
      }
      async getArticlesByCategory(category) {
        return await db.select().from(articles).where(eq2(articles.category, category)).orderBy(desc(articles.createdAt));
      }
      async getArticle(id) {
        const [article] = await db.select().from(articles).where(eq2(articles.id, id));
        return article;
      }
      async createArticle(article) {
        const [newArticle] = await db.insert(articles).values(article).returning();
        return newArticle;
      }
      async updateArticle(id, article) {
        const [updatedArticle] = await db.update(articles).set({ ...article, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(articles.id, id)).returning();
        return updatedArticle;
      }
      async deleteArticle(id) {
        const result = await db.delete(articles).where(eq2(articles.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Testimonials
      async getTestimonials() {
        return await db.select().from(testimonials).orderBy(testimonials.order, desc(testimonials.createdAt));
      }
      async getActiveTestimonials() {
        return await db.select().from(testimonials).where(eq2(testimonials.isActive, true)).orderBy(testimonials.order, desc(testimonials.createdAt));
      }
      async getTestimonial(id) {
        const [testimonial] = await db.select().from(testimonials).where(eq2(testimonials.id, id));
        return testimonial;
      }
      async createTestimonial(testimonial) {
        const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
        return newTestimonial;
      }
      async updateTestimonial(id, testimonial) {
        const [updatedTestimonial] = await db.update(testimonials).set({ ...testimonial, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(testimonials.id, id)).returning();
        return updatedTestimonial;
      }
      async deleteTestimonial(id) {
        const result = await db.delete(testimonials).where(eq2(testimonials.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Phase 1: Empathize
      async getEmpathyMaps(projectId) {
        return await db.select().from(empathyMaps).where(eq2(empathyMaps.projectId, projectId)).orderBy(desc(empathyMaps.createdAt));
      }
      async createEmpathyMap(empathyMap) {
        const [newMap] = await db.insert(empathyMaps).values(empathyMap).returning();
        return newMap;
      }
      async updateEmpathyMap(id, empathyMap) {
        const [updatedMap] = await db.update(empathyMaps).set({ ...empathyMap, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(empathyMaps.id, id)).returning();
        return updatedMap;
      }
      async deleteEmpathyMap(id) {
        const result = await db.delete(empathyMaps).where(eq2(empathyMaps.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getPersonas(projectId) {
        return await db.select().from(personas).where(eq2(personas.projectId, projectId)).orderBy(desc(personas.createdAt));
      }
      async createPersona(persona) {
        const [newPersona] = await db.insert(personas).values(persona).returning();
        return newPersona;
      }
      async updatePersona(id, persona) {
        const [updatedPersona] = await db.update(personas).set({ ...persona, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(personas.id, id)).returning();
        return updatedPersona;
      }
      async deletePersona(id) {
        const result = await db.delete(personas).where(eq2(personas.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getInterviews(projectId) {
        return await db.select().from(interviews).where(eq2(interviews.projectId, projectId)).orderBy(desc(interviews.createdAt));
      }
      async createInterview(interview) {
        const [newInterview] = await db.insert(interviews).values(interview).returning();
        return newInterview;
      }
      async updateInterview(id, interview) {
        const [updatedInterview] = await db.update(interviews).set(interview).where(eq2(interviews.id, id)).returning();
        return updatedInterview;
      }
      async deleteInterview(id) {
        const result = await db.delete(interviews).where(eq2(interviews.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getObservations(projectId) {
        return await db.select().from(observations).where(eq2(observations.projectId, projectId)).orderBy(desc(observations.createdAt));
      }
      async createObservation(observation) {
        const [newObservation] = await db.insert(observations).values(observation).returning();
        return newObservation;
      }
      async updateObservation(id, observation) {
        const [updatedObservation] = await db.update(observations).set(observation).where(eq2(observations.id, id)).returning();
        return updatedObservation;
      }
      async deleteObservation(id) {
        const result = await db.delete(observations).where(eq2(observations.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Phase 2: Define
      async getPovStatements(projectId) {
        return await db.select().from(povStatements).where(eq2(povStatements.projectId, projectId)).orderBy(desc(povStatements.createdAt));
      }
      async getPovStatement(id) {
        const [statement] = await db.select().from(povStatements).where(eq2(povStatements.id, id));
        return statement;
      }
      async createPovStatement(pov) {
        const [newStatement] = await db.insert(povStatements).values(pov).returning();
        return newStatement;
      }
      async updatePovStatement(id, pov) {
        const [updatedStatement] = await db.update(povStatements).set(pov).where(eq2(povStatements.id, id)).returning();
        return updatedStatement;
      }
      async deletePovStatement(id) {
        const result = await db.delete(povStatements).where(eq2(povStatements.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getHmwQuestions(projectId) {
        return await db.select().from(hmwQuestions).where(eq2(hmwQuestions.projectId, projectId)).orderBy(desc(hmwQuestions.createdAt));
      }
      async getHmwQuestion(id) {
        const [question] = await db.select().from(hmwQuestions).where(eq2(hmwQuestions.id, id));
        return question;
      }
      async createHmwQuestion(hmw) {
        const [newQuestion] = await db.insert(hmwQuestions).values(hmw).returning();
        return newQuestion;
      }
      async updateHmwQuestion(id, hmw) {
        const [updatedQuestion] = await db.update(hmwQuestions).set(hmw).where(eq2(hmwQuestions.id, id)).returning();
        return updatedQuestion;
      }
      async deleteHmwQuestion(id) {
        const result = await db.delete(hmwQuestions).where(eq2(hmwQuestions.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getGuidingCriteria(projectId) {
        return await db.select().from(guidingCriteria).where(eq2(guidingCriteria.projectId, projectId)).orderBy(desc(guidingCriteria.createdAt));
      }
      async getGuidingCriterion(id) {
        const [criterion] = await db.select().from(guidingCriteria).where(eq2(guidingCriteria.id, id));
        return criterion;
      }
      async createGuidingCriterion(criterion) {
        const [newCriterion] = await db.insert(guidingCriteria).values(criterion).returning();
        return newCriterion;
      }
      async updateGuidingCriterion(id, criterion) {
        const [updatedCriterion] = await db.update(guidingCriteria).set({ ...criterion, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(guidingCriteria.id, id)).returning();
        return updatedCriterion;
      }
      async deleteGuidingCriterion(id) {
        const result = await db.delete(guidingCriteria).where(eq2(guidingCriteria.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Phase 3: Ideate
      async getIdeas(projectId) {
        return await db.select().from(ideas).where(eq2(ideas.projectId, projectId)).orderBy(desc(ideas.createdAt));
      }
      async createIdea(idea) {
        const [newIdea] = await db.insert(ideas).values(idea).returning();
        return newIdea;
      }
      async updateIdea(id, idea) {
        const [updatedIdea] = await db.update(ideas).set(idea).where(eq2(ideas.id, id)).returning();
        return updatedIdea;
      }
      async deleteIdea(id) {
        const result = await db.delete(ideas).where(eq2(ideas.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Phase 4: Prototype
      async getPrototypes(projectId) {
        return await db.select().from(prototypes).where(eq2(prototypes.projectId, projectId)).orderBy(desc(prototypes.createdAt));
      }
      async createPrototype(prototype) {
        const [newPrototype] = await db.insert(prototypes).values(prototype).returning();
        return newPrototype;
      }
      async updatePrototype(id, prototype) {
        const [updatedPrototype] = await db.update(prototypes).set(prototype).where(eq2(prototypes.id, id)).returning();
        return updatedPrototype;
      }
      async deletePrototype(id) {
        const result = await db.delete(prototypes).where(eq2(prototypes.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Phase 5: Test
      async getTestPlans(projectId) {
        return await db.select().from(testPlans).where(eq2(testPlans.projectId, projectId)).orderBy(desc(testPlans.createdAt));
      }
      async createTestPlan(testPlan) {
        const [newPlan] = await db.insert(testPlans).values(testPlan).returning();
        return newPlan;
      }
      async updateTestPlan(id, testPlan) {
        const [updatedPlan] = await db.update(testPlans).set(testPlan).where(eq2(testPlans.id, id)).returning();
        return updatedPlan;
      }
      async getTestResults(testPlanId) {
        return await db.select().from(testResults).where(eq2(testResults.testPlanId, testPlanId)).orderBy(desc(testResults.createdAt));
      }
      async createTestResult(testResult) {
        const [newResult] = await db.insert(testResults).values(testResult).returning();
        return newResult;
      }
      // User Progress
      async getUserProgress(userId, projectId) {
        const [progress] = await db.select().from(userProgress).where(and(eq2(userProgress.userId, userId), eq2(userProgress.projectId, projectId)));
        return progress;
      }
      async updateUserProgress(progress) {
        const existing = await this.getUserProgress(progress.userId, progress.projectId);
        if (existing) {
          const [updated] = await db.update(userProgress).set({ ...progress, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq2(userProgress.userId, progress.userId), eq2(userProgress.projectId, progress.projectId))).returning();
          return updated;
        } else {
          const [created] = await db.insert(userProgress).values(progress).returning();
          return created;
        }
      }
      // Analytics
      async getProjectStats(projectId, userId) {
        const project = await this.getProject(projectId, userId);
        return {
          totalTools: 15,
          // Total tools across all 5 phases
          completedTools: 0,
          // Would count actual completed tools
          currentPhase: project?.currentPhase || 1,
          completionRate: project?.completionRate || 0
        };
      }
      // Canvas Drawings
      async getCanvasDrawings(projectId) {
        return await db.select().from(canvasDrawings).where(eq2(canvasDrawings.projectId, projectId)).orderBy(desc(canvasDrawings.createdAt));
      }
      async getCanvasDrawing(id) {
        const [drawing] = await db.select().from(canvasDrawings).where(eq2(canvasDrawings.id, id));
        return drawing;
      }
      async createCanvasDrawing(drawing) {
        const [newDrawing] = await db.insert(canvasDrawings).values(drawing).returning();
        return newDrawing;
      }
      async updateCanvasDrawing(id, drawing) {
        const [updatedDrawing] = await db.update(canvasDrawings).set({ ...drawing, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(canvasDrawings.id, id)).returning();
        return updatedDrawing;
      }
      async deleteCanvasDrawing(id) {
        const result = await db.delete(canvasDrawings).where(eq2(canvasDrawings.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Phase Cards (Kanban)
      async getPhaseCards(projectId) {
        return await db.select().from(phaseCards).where(eq2(phaseCards.projectId, projectId)).orderBy(desc(phaseCards.createdAt));
      }
      async getPhaseCard(id) {
        const [card] = await db.select().from(phaseCards).where(eq2(phaseCards.id, id));
        return card;
      }
      async createPhaseCard(card) {
        const [newCard] = await db.insert(phaseCards).values(card).returning();
        return newCard;
      }
      async updatePhaseCard(id, card) {
        const [updatedCard] = await db.update(phaseCards).set({ ...card, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(phaseCards.id, id)).returning();
        return updatedCard;
      }
      async deletePhaseCard(id) {
        const result = await db.delete(phaseCards).where(eq2(phaseCards.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Subscription Plans
      async getSubscriptionPlans() {
        return await db.select().from(subscriptionPlans).orderBy(subscriptionPlans.order);
      }
      async getSubscriptionPlan(id) {
        const [plan] = await db.select().from(subscriptionPlans).where(eq2(subscriptionPlans.id, id));
        return plan;
      }
      async getSubscriptionPlanByName(name) {
        const [plan] = await db.select().from(subscriptionPlans).where(sql2`${subscriptionPlans.name} ILIKE ${name}`).limit(1);
        return plan;
      }
      async createSubscriptionPlan(plan) {
        const [newPlan] = await db.insert(subscriptionPlans).values(plan).returning();
        return newPlan;
      }
      async updateSubscriptionPlan(id, plan) {
        const [updatedPlan] = await db.update(subscriptionPlans).set(plan).where(eq2(subscriptionPlans.id, id)).returning();
        return updatedPlan;
      }
      async deleteSubscriptionPlan(id) {
        const result = await db.delete(subscriptionPlans).where(eq2(subscriptionPlans.id, id));
        return (result.rowCount || 0) > 0;
      }
      // User Subscriptions
      async getUserSubscriptions(userId) {
        return await db.select().from(userSubscriptions).where(eq2(userSubscriptions.userId, userId)).orderBy(desc(userSubscriptions.createdAt));
      }
      async getUserActiveSubscription(userId) {
        const [subscription] = await db.select().from(userSubscriptions).where(and(
          eq2(userSubscriptions.userId, userId),
          eq2(userSubscriptions.status, "active")
        ));
        return subscription;
      }
      async createUserSubscription(subscription) {
        const [newSubscription] = await db.insert(userSubscriptions).values(subscription).returning();
        return newSubscription;
      }
      async updateUserSubscription(id, subscription) {
        const [updatedSubscription] = await db.update(userSubscriptions).set(subscription).where(eq2(userSubscriptions.id, id)).returning();
        return updatedSubscription;
      }
      async cancelUserSubscription(id) {
        const result = await db.update(userSubscriptions).set({ status: "cancelled" }).where(eq2(userSubscriptions.id, id));
        return (result.rowCount || 0) > 0;
      }
      // User Add-ons
      async getUserAddons(userId) {
        return await db.select().from(userAddons).where(eq2(userAddons.userId, userId)).orderBy(desc(userAddons.createdAt));
      }
      async getActiveUserAddons(userId) {
        return await db.select().from(userAddons).where(and(
          eq2(userAddons.userId, userId),
          eq2(userAddons.status, "active")
        )).orderBy(desc(userAddons.createdAt));
      }
      async createUserAddon(addon) {
        const [newAddon] = await db.insert(userAddons).values(addon).returning();
        return newAddon;
      }
      async updateUserAddon(id, addon) {
        const [updatedAddon] = await db.update(userAddons).set({ ...addon, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(userAddons.id, id)).returning();
        return updatedAddon;
      }
      async deleteUserAddon(id) {
        const result = await db.delete(userAddons).where(eq2(userAddons.id, id));
        return (result.rowCount || 0) > 0;
      }
      async updateUserAddonsByStripeSubscription(stripeSubscriptionId, addon) {
        const result = await db.update(userAddons).set({ ...addon, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(userAddons.stripeSubscriptionId, stripeSubscriptionId));
        return (result.rowCount || 0) > 0;
      }
      // Benchmarking
      async getBenchmarks(projectId) {
        return await db.select().from(benchmarks).where(eq2(benchmarks.projectId, projectId)).orderBy(desc(benchmarks.createdAt));
      }
      async getBenchmark(id) {
        const [benchmark] = await db.select().from(benchmarks).where(eq2(benchmarks.id, id));
        return benchmark;
      }
      async createBenchmark(benchmark) {
        const [newBenchmark] = await db.insert(benchmarks).values(benchmark).returning();
        return newBenchmark;
      }
      async updateBenchmark(id, benchmark) {
        const [updatedBenchmark] = await db.update(benchmarks).set(benchmark).where(eq2(benchmarks.id, id)).returning();
        return updatedBenchmark;
      }
      async deleteBenchmark(id) {
        const result = await db.delete(benchmarks).where(eq2(benchmarks.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getBenchmarkAssessments(benchmarkId) {
        return await db.select().from(benchmarkAssessments).where(eq2(benchmarkAssessments.benchmarkId, benchmarkId)).orderBy(desc(benchmarkAssessments.createdAt));
      }
      async createBenchmarkAssessment(assessment) {
        const [newAssessment] = await db.insert(benchmarkAssessments).values(assessment).returning();
        return newAssessment;
      }
      async updateBenchmarkAssessment(id, assessment) {
        const [updatedAssessment] = await db.update(benchmarkAssessments).set(assessment).where(eq2(benchmarkAssessments.id, id)).returning();
        return updatedAssessment;
      }
      async deleteBenchmarkAssessment(id) {
        const result = await db.delete(benchmarkAssessments).where(eq2(benchmarkAssessments.id, id));
        return (result.rowCount || 0) > 0;
      }
      // DVF Assessment - Desirability, Feasibility, Viability
      async getDvfAssessments(projectId) {
        return await db.select().from(dvfAssessments).where(eq2(dvfAssessments.projectId, projectId)).orderBy(desc(dvfAssessments.createdAt));
      }
      async getDvfAssessment(id) {
        const [assessment] = await db.select().from(dvfAssessments).where(eq2(dvfAssessments.id, id));
        return assessment;
      }
      async createDvfAssessment(assessment) {
        const [newAssessment] = await db.insert(dvfAssessments).values(assessment).returning();
        return newAssessment;
      }
      async updateDvfAssessment(id, assessment) {
        const [updatedAssessment] = await db.update(dvfAssessments).set({ ...assessment, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(dvfAssessments.id, id)).returning();
        return updatedAssessment;
      }
      async deleteDvfAssessment(id) {
        const result = await db.delete(dvfAssessments).where(eq2(dvfAssessments.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Lovability Metrics
      async getLovabilityMetrics(projectId) {
        return await db.select().from(lovabilityMetrics).where(eq2(lovabilityMetrics.projectId, projectId)).orderBy(desc(lovabilityMetrics.createdAt));
      }
      async getLovabilityMetric(id) {
        const [metric] = await db.select().from(lovabilityMetrics).where(eq2(lovabilityMetrics.id, id));
        return metric;
      }
      async createLovabilityMetric(metric) {
        const [newMetric] = await db.insert(lovabilityMetrics).values(metric).returning();
        return newMetric;
      }
      async updateLovabilityMetric(id, metric) {
        const [updatedMetric] = await db.update(lovabilityMetrics).set({ ...metric, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(lovabilityMetrics.id, id)).returning();
        return updatedMetric;
      }
      async deleteLovabilityMetric(id) {
        const result = await db.delete(lovabilityMetrics).where(eq2(lovabilityMetrics.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Project Analytics
      async getProjectAnalytics(projectId) {
        const [analytics] = await db.select().from(projectAnalytics).where(eq2(projectAnalytics.projectId, projectId));
        return analytics;
      }
      async createProjectAnalytics(analytics) {
        const [newAnalytics] = await db.insert(projectAnalytics).values(analytics).returning();
        return newAnalytics;
      }
      async updateProjectAnalytics(id, analytics) {
        const [updatedAnalytics] = await db.update(projectAnalytics).set({ ...analytics, lastUpdated: /* @__PURE__ */ new Date() }).where(eq2(projectAnalytics.id, id)).returning();
        return updatedAnalytics;
      }
      // Competitive Analysis
      async getCompetitiveAnalyses(projectId) {
        return await db.select().from(competitiveAnalysis).where(eq2(competitiveAnalysis.projectId, projectId)).orderBy(desc(competitiveAnalysis.createdAt));
      }
      async getCompetitiveAnalysis(id) {
        const [analysis] = await db.select().from(competitiveAnalysis).where(eq2(competitiveAnalysis.id, id));
        return analysis;
      }
      async createCompetitiveAnalysis(analysis) {
        const [newAnalysis] = await db.insert(competitiveAnalysis).values(analysis).returning();
        return newAnalysis;
      }
      async updateCompetitiveAnalysis(id, analysis) {
        const [updatedAnalysis] = await db.update(competitiveAnalysis).set({ ...analysis, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(competitiveAnalysis.id, id)).returning();
        return updatedAnalysis;
      }
      async deleteCompetitiveAnalysis(id) {
        const result = await db.delete(competitiveAnalysis).where(eq2(competitiveAnalysis.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Project Backups
      async createProjectBackup(projectId, userId, backupType, description) {
        const project = await this.getProject(projectId, userId);
        if (!project) {
          throw new Error("Project not found");
        }
        const [
          empathyMapsData,
          personasData,
          interviewsData,
          observationsData,
          povStatementsData,
          hmwQuestionsData,
          ideasData,
          prototypesData,
          testPlansData
        ] = await Promise.all([
          this.getEmpathyMaps(projectId),
          this.getPersonas(projectId),
          this.getInterviews(projectId),
          this.getObservations(projectId),
          this.getPovStatements(projectId),
          this.getHmwQuestions(projectId),
          this.getIdeas(projectId),
          this.getPrototypes(projectId),
          this.getTestPlans(projectId)
        ]);
        const projectSnapshot = {
          project,
          empathyMaps: empathyMapsData,
          personas: personasData,
          interviews: interviewsData,
          observations: observationsData,
          povStatements: povStatementsData,
          hmwQuestions: hmwQuestionsData,
          ideas: ideasData,
          prototypes: prototypesData,
          testPlans: testPlansData
        };
        const totalItems = empathyMapsData.length + personasData.length + interviewsData.length + observationsData.length + povStatementsData.length + hmwQuestionsData.length + ideasData.length + prototypesData.length + testPlansData.length;
        const [backup] = await db.insert(projectBackups).values({
          projectId,
          backupType,
          description,
          projectSnapshot,
          phaseSnapshot: project.currentPhase,
          completionSnapshot: project.completionRate,
          itemCount: totalItems
        }).returning();
        return backup;
      }
      async getProjectBackups(projectId) {
        return await db.select().from(projectBackups).where(eq2(projectBackups.projectId, projectId)).orderBy(desc(projectBackups.createdAt));
      }
      async getProjectBackup(id) {
        const [backup] = await db.select().from(projectBackups).where(eq2(projectBackups.id, id));
        return backup;
      }
      async restoreProjectBackup(backupId) {
        const backup = await this.getProjectBackup(backupId);
        if (!backup || !backup.projectSnapshot) {
          return false;
        }
        const snapshot = backup.projectSnapshot;
        const projectId = backup.projectId;
        await Promise.all([
          db.delete(empathyMaps).where(eq2(empathyMaps.projectId, projectId)),
          db.delete(personas).where(eq2(personas.projectId, projectId)),
          db.delete(interviews).where(eq2(interviews.projectId, projectId)),
          db.delete(observations).where(eq2(observations.projectId, projectId)),
          db.delete(povStatements).where(eq2(povStatements.projectId, projectId)),
          db.delete(hmwQuestions).where(eq2(hmwQuestions.projectId, projectId)),
          db.delete(ideas).where(eq2(ideas.projectId, projectId)),
          db.delete(prototypes).where(eq2(prototypes.projectId, projectId)),
          db.delete(testPlans).where(eq2(testPlans.projectId, projectId))
        ]);
        const userId = snapshot.project.userId;
        await this.updateProject(projectId, userId, {
          name: snapshot.project.name,
          description: snapshot.project.description,
          status: snapshot.project.status,
          currentPhase: snapshot.project.currentPhase,
          completionRate: snapshot.project.completionRate
        });
        if (snapshot.empathyMaps?.length > 0) {
          await db.insert(empathyMaps).values(
            snapshot.empathyMaps.map((em) => {
              const { id, createdAt, updatedAt, ...rest } = em;
              return rest;
            })
          );
        }
        if (snapshot.personas?.length > 0) {
          await db.insert(personas).values(
            snapshot.personas.map((p) => {
              const { id, createdAt, updatedAt, ...rest } = p;
              return rest;
            })
          );
        }
        if (snapshot.interviews?.length > 0) {
          await db.insert(interviews).values(
            snapshot.interviews.map((i) => {
              const { id, createdAt, ...rest } = i;
              return rest;
            })
          );
        }
        if (snapshot.observations?.length > 0) {
          await db.insert(observations).values(
            snapshot.observations.map((o) => {
              const { id, createdAt, ...rest } = o;
              return rest;
            })
          );
        }
        if (snapshot.povStatements?.length > 0) {
          await db.insert(povStatements).values(
            snapshot.povStatements.map((p) => {
              const { id, createdAt, ...rest } = p;
              return rest;
            })
          );
        }
        if (snapshot.hmwQuestions?.length > 0) {
          await db.insert(hmwQuestions).values(
            snapshot.hmwQuestions.map((h) => {
              const { id, createdAt, ...rest } = h;
              return rest;
            })
          );
        }
        if (snapshot.ideas?.length > 0) {
          await db.insert(ideas).values(
            snapshot.ideas.map((idea) => {
              const { id, createdAt, ...rest } = idea;
              return rest;
            })
          );
        }
        if (snapshot.prototypes?.length > 0) {
          await db.insert(prototypes).values(
            snapshot.prototypes.map((p) => {
              const { id, createdAt, ...rest } = p;
              return rest;
            })
          );
        }
        if (snapshot.testPlans?.length > 0) {
          await db.insert(testPlans).values(
            snapshot.testPlans.map((t) => {
              const { id, createdAt, ...rest } = t;
              return rest;
            })
          );
        }
        return true;
      }
      async deleteProjectBackup(id) {
        const result = await db.delete(projectBackups).where(eq2(projectBackups.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Help Articles
      async getHelpArticles() {
        return await db.select().from(helpArticles).orderBy(desc(helpArticles.order), desc(helpArticles.createdAt));
      }
      async getHelpArticleBySlug(slug) {
        const [article] = await db.select().from(helpArticles).where(eq2(helpArticles.slug, slug));
        return article;
      }
      async searchHelpArticles(searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const allArticles = await db.select().from(helpArticles);
        return allArticles.filter((article) => {
          const titleMatch = article.title.toLowerCase().includes(lowerSearch);
          const contentMatch = article.content.toLowerCase().includes(lowerSearch);
          const tagsMatch = article.tags && JSON.stringify(article.tags).toLowerCase().includes(lowerSearch);
          const keywordsMatch = article.searchKeywords && JSON.stringify(article.searchKeywords).toLowerCase().includes(lowerSearch);
          return titleMatch || contentMatch || tagsMatch || keywordsMatch;
        });
      }
      async incrementHelpArticleViews(id) {
        const [article] = await db.select().from(helpArticles).where(eq2(helpArticles.id, id));
        if (!article) return void 0;
        const [updated] = await db.update(helpArticles).set({ viewCount: (article.viewCount || 0) + 1 }).where(eq2(helpArticles.id, id)).returning();
        return updated;
      }
      async incrementHelpArticleHelpful(id) {
        const [article] = await db.select().from(helpArticles).where(eq2(helpArticles.id, id));
        if (!article) return void 0;
        const [updated] = await db.update(helpArticles).set({ helpful: (article.helpful || 0) + 1 }).where(eq2(helpArticles.id, id)).returning();
        return updated;
      }
      async createHelpArticle(article) {
        const [newArticle] = await db.insert(helpArticles).values(article).returning();
        return newArticle;
      }
      async updateHelpArticle(id, article) {
        const [updated] = await db.update(helpArticles).set({ ...article, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(helpArticles.id, id)).returning();
        return updated;
      }
      async deleteHelpArticle(id) {
        const result = await db.delete(helpArticles).where(eq2(helpArticles.id, id));
        return (result.rowCount || 0) > 0;
      }
      // AI Automation: Industry Sectors
      async getIndustrySectors() {
        return await db.select().from(industrySectors).orderBy(industrySectors.order, desc(industrySectors.createdAt));
      }
      async getActiveIndustrySectors() {
        return await db.select().from(industrySectors).where(eq2(industrySectors.isActive, true)).orderBy(industrySectors.order, desc(industrySectors.createdAt));
      }
      async getIndustrySector(id) {
        const [sector] = await db.select().from(industrySectors).where(eq2(industrySectors.id, id));
        return sector;
      }
      async createIndustrySector(sector) {
        const [newSector] = await db.insert(industrySectors).values(sector).returning();
        return newSector;
      }
      async updateIndustrySector(id, sector) {
        const [updated] = await db.update(industrySectors).set({ ...sector, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(industrySectors.id, id)).returning();
        return updated;
      }
      async deleteIndustrySector(id) {
        const result = await db.delete(industrySectors).where(eq2(industrySectors.id, id));
        return (result.rowCount || 0) > 0;
      }
      // AI Automation: Success Cases
      async getSuccessCases() {
        return await db.select().from(successCases).orderBy(successCases.order, desc(successCases.createdAt));
      }
      async getActiveSuccessCases() {
        return await db.select().from(successCases).where(eq2(successCases.isActive, true)).orderBy(successCases.order, desc(successCases.createdAt));
      }
      async getSuccessCasesBySector(sectorId) {
        return await db.select().from(successCases).where(and(eq2(successCases.sectorId, sectorId), eq2(successCases.isActive, true))).orderBy(successCases.order, desc(successCases.createdAt));
      }
      async getSuccessCase(id) {
        const [successCase] = await db.select().from(successCases).where(eq2(successCases.id, id));
        return successCase;
      }
      async createSuccessCase(caseData) {
        const [newCase] = await db.insert(successCases).values(caseData).returning();
        return newCase;
      }
      async updateSuccessCase(id, caseData) {
        const [updated] = await db.update(successCases).set({ ...caseData, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(successCases.id, id)).returning();
        return updated;
      }
      async deleteSuccessCase(id) {
        const result = await db.delete(successCases).where(eq2(successCases.id, id));
        return (result.rowCount || 0) > 0;
      }
      // AI Automation: Generated Assets
      async getAiGeneratedAssets(projectId) {
        return await db.select().from(aiGeneratedAssets).where(eq2(aiGeneratedAssets.projectId, projectId)).orderBy(desc(aiGeneratedAssets.createdAt));
      }
      async getAiGeneratedAssetsByType(projectId, assetType) {
        return await db.select().from(aiGeneratedAssets).where(and(
          eq2(aiGeneratedAssets.projectId, projectId),
          eq2(aiGeneratedAssets.assetType, assetType)
        )).orderBy(desc(aiGeneratedAssets.createdAt));
      }
      async getAiGeneratedAsset(id) {
        const [asset] = await db.select().from(aiGeneratedAssets).where(eq2(aiGeneratedAssets.id, id));
        return asset;
      }
      async createAiGeneratedAsset(asset) {
        const [newAsset] = await db.insert(aiGeneratedAssets).values(asset).returning();
        return newAsset;
      }
      async updateAiGeneratedAsset(id, asset) {
        const [updated] = await db.update(aiGeneratedAssets).set(asset).where(eq2(aiGeneratedAssets.id, id)).returning();
        return updated;
      }
      async deleteAiGeneratedAsset(id) {
        const result = await db.delete(aiGeneratedAssets).where(eq2(aiGeneratedAssets.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Analytics Events
      async createAnalyticsEvent(event) {
        const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
        return newEvent;
      }
      async getAnalyticsEvents(filters) {
        let query = db.select().from(analyticsEvents);
        const conditions = [];
        if (filters?.eventType) conditions.push(eq2(analyticsEvents.eventType, filters.eventType));
        if (filters?.userId) conditions.push(eq2(analyticsEvents.userId, filters.userId));
        if (filters?.startDate) conditions.push(sql2`${analyticsEvents.createdAt} >= ${filters.startDate}`);
        if (filters?.endDate) conditions.push(sql2`${analyticsEvents.createdAt} <= ${filters.endDate}`);
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        return await query.orderBy(desc(analyticsEvents.createdAt));
      }
      async getAnalyticsSummary() {
        const now = /* @__PURE__ */ new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalUsersResult] = await db.select({ count: sql2`count(*)::int` }).from(users);
        const [totalProjectsResult] = await db.select({ count: sql2`count(*)::int` }).from(projects);
        const [totalAiGenerationsResult] = await db.select({ count: sql2`count(*)::int` }).from(projects).where(eq2(projects.aiGenerated, true));
        const [newUsersThisMonthResult] = await db.select({ count: sql2`count(*)::int` }).from(users).where(sql2`${users.createdAt} >= ${firstDayOfMonth}`);
        const [projectsThisMonthResult] = await db.select({ count: sql2`count(*)::int` }).from(projects).where(sql2`${projects.createdAt} >= ${firstDayOfMonth}`);
        const [aiGenerationsThisMonthResult] = await db.select({ count: sql2`count(*)::int` }).from(projects).where(and(
          eq2(projects.aiGenerated, true),
          sql2`${projects.createdAt} >= ${firstDayOfMonth}`
        ));
        return {
          totalUsers: totalUsersResult?.count || 0,
          totalProjects: totalProjectsResult?.count || 0,
          totalAiGenerations: totalAiGenerationsResult?.count || 0,
          newUsersThisMonth: newUsersThisMonthResult?.count || 0,
          projectsThisMonth: projectsThisMonthResult?.count || 0,
          aiGenerationsThisMonth: aiGenerationsThisMonthResult?.count || 0
        };
      }
      // Project Members (Teams)
      async getProjectMembers(projectId) {
        return await db.select().from(projectMembers).where(eq2(projectMembers.projectId, projectId)).orderBy(projectMembers.addedAt);
      }
      async getProjectMember(projectId, userId) {
        const [member] = await db.select().from(projectMembers).where(and(
          eq2(projectMembers.projectId, projectId),
          eq2(projectMembers.userId, userId)
        ));
        return member;
      }
      async createProjectMember(member) {
        const [newMember] = await db.insert(projectMembers).values(member).returning();
        return newMember;
      }
      async updateProjectMemberRole(id, role) {
        const [updated] = await db.update(projectMembers).set({ role }).where(eq2(projectMembers.id, id)).returning();
        return updated;
      }
      async deleteProjectMember(id) {
        const result = await db.delete(projectMembers).where(eq2(projectMembers.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getUserProjects(userId) {
        const ownedProjects = await db.select({ id: projects.id }).from(projects).where(eq2(projects.userId, userId));
        const memberProjects = await db.select({ projectId: projectMembers.projectId }).from(projectMembers).where(eq2(projectMembers.userId, userId));
        const projectIds = [
          ...ownedProjects.map((p) => p.id),
          ...memberProjects.map((m) => m.projectId)
        ];
        return [...new Set(projectIds)];
      }
      // Project Invites
      async getProjectInvites(projectId) {
        return await db.select().from(projectInvites).where(eq2(projectInvites.projectId, projectId)).orderBy(desc(projectInvites.createdAt));
      }
      async getPendingInvitesByEmail(email) {
        return await db.select().from(projectInvites).where(and(
          eq2(projectInvites.email, email),
          eq2(projectInvites.status, "pending")
        )).orderBy(desc(projectInvites.createdAt));
      }
      async getProjectInviteByToken(token) {
        const [invite] = await db.select().from(projectInvites).where(eq2(projectInvites.token, token));
        return invite;
      }
      async createProjectInvite(invite) {
        const [newInvite] = await db.insert(projectInvites).values(invite).returning();
        return newInvite;
      }
      async updateProjectInvite(id, updates) {
        const [updated] = await db.update(projectInvites).set(updates).where(eq2(projectInvites.id, id)).returning();
        return updated;
      }
      async updateProjectInviteStatus(id, status, respondedAt) {
        const [updated] = await db.update(projectInvites).set({ status, respondedAt: respondedAt || /* @__PURE__ */ new Date() }).where(eq2(projectInvites.id, id)).returning();
        return updated;
      }
      async deleteProjectInvite(id) {
        const result = await db.delete(projectInvites).where(eq2(projectInvites.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Project Comments
      async getProjectComments(projectId) {
        return await db.select().from(projectComments).where(eq2(projectComments.projectId, projectId)).orderBy(desc(projectComments.createdAt));
      }
      async getEntityComments(projectId, entityType, entityId) {
        const conditions = [
          eq2(projectComments.projectId, projectId),
          eq2(projectComments.entityType, entityType)
        ];
        if (entityId) {
          conditions.push(eq2(projectComments.entityId, entityId));
        }
        return await db.select().from(projectComments).where(and(...conditions)).orderBy(projectComments.createdAt);
      }
      async createProjectComment(comment) {
        const [newComment] = await db.insert(projectComments).values(comment).returning();
        return newComment;
      }
      async updateProjectComment(id, comment) {
        const [updated] = await db.update(projectComments).set({ ...comment, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(projectComments.id, id)).returning();
        return updated;
      }
      async deleteProjectComment(id) {
        const result = await db.delete(projectComments).where(eq2(projectComments.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Video Tutorials
      async getVideoTutorials() {
        return await db.select().from(videoTutorials).where(eq2(videoTutorials.isActive, true)).orderBy(videoTutorials.order);
      }
      async getVideoTutorialsByPhase(phase) {
        return await db.select().from(videoTutorials).where(and(eq2(videoTutorials.phase, phase), eq2(videoTutorials.isActive, true))).orderBy(videoTutorials.order);
      }
      async getVideoTutorial(id) {
        const [video] = await db.select().from(videoTutorials).where(eq2(videoTutorials.id, id));
        return video;
      }
      async createVideoTutorial(video) {
        const [newVideo] = await db.insert(videoTutorials).values(video).returning();
        return newVideo;
      }
      async updateVideoTutorial(id, video) {
        const [updatedVideo] = await db.update(videoTutorials).set({ ...video, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(videoTutorials.id, id)).returning();
        return updatedVideo;
      }
      async deleteVideoTutorial(id) {
        const result = await db.delete(videoTutorials).where(eq2(videoTutorials.id, id));
        return (result.rowCount || 0) > 0;
      }
      async incrementVideoView(id) {
        await db.update(videoTutorials).set({ viewCount: sql2`${videoTutorials.viewCount} + 1` }).where(eq2(videoTutorials.id, id));
      }
      // Double Diamond
      async getDoubleDiamondProjects(userId) {
        return await db.select().from(doubleDiamondProjects).where(eq2(doubleDiamondProjects.userId, userId)).orderBy(desc(doubleDiamondProjects.createdAt));
      }
      async createDoubleDiamondExport(exportData) {
        const [exportRecord] = await db.insert(doubleDiamondExports).values({
          ...exportData,
          id: randomUUID(),
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return exportRecord;
      }
      async getDoubleDiamondExportsByMonth(userId) {
        const firstDay = /* @__PURE__ */ new Date();
        firstDay.setDate(1);
        firstDay.setHours(0, 0, 0, 0);
        return db.select().from(doubleDiamondExports).where(
          and(
            eq2(doubleDiamondExports.userId, userId),
            gte(doubleDiamondExports.createdAt, firstDay)
          )
        );
      }
      async getAllDoubleDiamondProjects() {
        return await db.select().from(doubleDiamondProjects).orderBy(desc(doubleDiamondProjects.createdAt));
      }
      async getDoubleDiamondProject(id, userId) {
        const [project] = await db.select().from(doubleDiamondProjects).where(and(
          eq2(doubleDiamondProjects.id, id),
          eq2(doubleDiamondProjects.userId, userId)
        ));
        return project;
      }
      async createDoubleDiamondProject(project) {
        const [newProject] = await db.insert(doubleDiamondProjects).values(project).returning();
        return newProject;
      }
      async updateDoubleDiamondProject(id, userId, updates) {
        const [updated] = await db.update(doubleDiamondProjects).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(
          eq2(doubleDiamondProjects.id, id),
          eq2(doubleDiamondProjects.userId, userId)
        )).returning();
        return updated;
      }
      async deleteDoubleDiamondProject(id, userId) {
        const result = await db.delete(doubleDiamondProjects).where(and(
          eq2(doubleDiamondProjects.id, id),
          eq2(doubleDiamondProjects.userId, userId)
        ));
        return (result.rowCount || 0) > 0;
      }
      // Industry Sectors & Success Cases
      async listIndustrySectors() {
        return await db.select().from(industrySectors).orderBy(industrySectors.name);
      }
      async listSuccessCases() {
        return await db.select().from(successCases).orderBy(successCases.company);
      }
      async updateUserLimits(userId, limits) {
        await db.update(users).set({
          customMaxProjects: limits.customMaxProjects,
          customMaxDoubleDiamondProjects: limits.customMaxDoubleDiamondProjects,
          customAiChatLimit: limits.customAiChatLimit
        }).where(eq2(users.id, userId));
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/geminiService.ts
var geminiService_exports = {};
__export(geminiService_exports, {
  DesignThinkingGeminiAI: () => DesignThinkingGeminiAI,
  designThinkingGeminiAI: () => designThinkingGeminiAI
});
import { GoogleGenAI } from "@google/genai";
var ai, DesignThinkingGeminiAI, designThinkingGeminiAI;
var init_geminiService = __esm({
  "server/geminiService.ts"() {
    "use strict";
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    DesignThinkingGeminiAI = class {
      model = "gemini-2.5-flash";
      async chat(message, context) {
        try {
          const systemPrompt = this.buildSystemPrompt(context);
          const prompt = `${systemPrompt}

User: ${message}

Assistant:`;
          const response = await ai.models.generateContent({
            model: this.model,
            contents: prompt
          });
          return response.text || "Desculpe, n\xE3o consegui processar sua mensagem no momento.";
        } catch (error) {
          console.error("Erro no chat da IA Gemini:", error);
          throw new Error("Erro ao processar sua mensagem. Verifique se a chave da API Gemini est\xE1 configurada corretamente.");
        }
      }
      async generateSuggestions(context) {
        try {
          const prompt = this.buildSuggestionsPrompt(context);
          const response = await ai.models.generateContent({
            model: this.model,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 5
                  }
                },
                required: ["suggestions"]
              }
            },
            contents: prompt
          });
          const result = JSON.parse(response.text || "{}");
          return result.suggestions || [
            "Como podemos entender melhor nossos usu\xE1rios?",
            "Que problemas estamos tentando resolver?",
            "Quais s\xE3o as principais necessidades identificadas?"
          ];
        } catch (error) {
          console.error("Erro ao gerar sugest\xF5es:", error);
          return [
            "Como podemos entender melhor nossos usu\xE1rios?",
            "Que problemas estamos tentando resolver?",
            "Quais s\xE3o as principais necessidades identificadas?"
          ];
        }
      }
      buildSystemPrompt(context) {
        const phaseNames = {
          1: "Empatizar",
          2: "Definir",
          3: "Idear",
          4: "Prototipar",
          5: "Testar"
        };
        const currentPhase = phaseNames[context.currentPhase] || "Desconhecida";
        return `Voc\xEA \xE9 um especialista em Design Thinking e facilitador de inova\xE7\xE3o. 
Voc\xEA est\xE1 ajudando com um projeto chamado "${context.projectName}" na fase de ${currentPhase}.

Contexto do projeto:
- Fase atual: ${currentPhase} (${context.currentPhase}/5)
- Descri\xE7\xE3o: ${context.projectDescription}
- Personas criadas: ${context.personas?.length || 0}
- Mapas de empatia: ${context.empathyMaps?.length || 0}  
- Ideias geradas: ${context.ideas?.length || 0}
- Prot\xF3tipos: ${context.prototypes?.length || 0}

Diretrizes:
- Seja pr\xE1tico e focado na metodologia de Design Thinking
- Fa\xE7a perguntas que estimulem o pensamento criativo
- Sugira atividades espec\xEDficas para a fase atual
- Mantenha o foco no usu\xE1rio final
- Responda em portugu\xEAs brasileiro
- Use uma linguagem acess\xEDvel e motivadora
- Limite respostas a 150 palavras quando poss\xEDvel`;
      }
      buildSuggestionsPrompt(context) {
        const phasePrompts = {
          1: "Gere 4 sugest\xF5es de perguntas para a fase Empatizar, focando em entender o usu\xE1rio:",
          2: "Gere 4 sugest\xF5es de perguntas para a fase Definir, focando em sintetizar insights:",
          3: "Gere 4 sugest\xF5es de perguntas para a fase Idear, focando em gerar solu\xE7\xF5es criativas:",
          4: "Gere 4 sugest\xF5es de perguntas para a fase Prototipar, focando em materializar ideias:",
          5: "Gere 4 sugest\xF5es de perguntas para a fase Testar, focando em validar solu\xE7\xF5es:"
        };
        const phasePrompt = phasePrompts[context.currentPhase] || phasePrompts[1];
        return `${phasePrompt}

Projeto: ${context.projectName || "Projeto de Design Thinking"}
Descri\xE7\xE3o: ${context.projectDescription || "Desenvolvimento de solu\xE7\xF5es centradas no usu\xE1rio"}

Retorne apenas um JSON com o array "suggestions" contendo 4 perguntas curtas e pr\xE1ticas em portugu\xEAs brasileiro.
Exemplo: {"suggestions": ["Como podemos...", "O que aconteceria se...", "Quais s\xE3o...", "Por que nossos usu\xE1rios..."]}`;
      }
      async generateBenchmarkingRecommendations(data) {
        try {
          const prompt = this.buildBenchmarkingPrompt(data);
          const response = await ai.models.generateContent({
            model: this.model,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  overallAssessment: { type: "string" },
                  keyInsights: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 5
                  },
                  actionableRecommendations: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 4,
                    maxItems: 6
                  },
                  competitiveAdvantages: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 2,
                    maxItems: 4
                  },
                  improvementAreas: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 2,
                    maxItems: 4
                  },
                  nextSteps: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 5
                  }
                },
                required: ["overallAssessment", "keyInsights", "actionableRecommendations", "competitiveAdvantages", "improvementAreas", "nextSteps"]
              }
            },
            contents: prompt
          });
          const result = JSON.parse(response.text || "{}");
          return result || this.getFallbackBenchmarkingRecommendations();
        } catch (error) {
          console.error("Erro ao gerar recomenda\xE7\xF5es de benchmarking:", error);
          return this.getFallbackBenchmarkingRecommendations();
        }
      }
      buildBenchmarkingPrompt(data) {
        const dvfAverage = data.dvfAssessments?.length ? data.dvfAssessments.reduce((acc, curr) => acc + curr.overallScore, 0) / data.dvfAssessments.length : 0;
        const lovabilityScore = data.lovabilityMetrics?.overallLovabilityScore || 0;
        const projectSuccess = data.projectAnalytics?.overallSuccess || 0;
        const competitivenessAverage = data.competitiveAnalysis?.length ? data.competitiveAnalysis.reduce((acc, curr) => acc + curr.competitivenessScore, 0) / data.competitiveAnalysis.length : 0;
        return `Voc\xEA \xE9 um consultor s\xEAnior especializado em Design Thinking e an\xE1lise competitiva. Analise os dados de benchmarking abaixo e forne\xE7a recomenda\xE7\xF5es estrat\xE9gicas personalizadas.

DADOS DO PROJETO:
Projeto: ${data.projectName}
Descri\xE7\xE3o: ${data.projectDescription || "N\xE3o informado"}
Ind\xFAstria: ${data.industry || "N\xE3o informado"}
Tamanho da empresa: ${data.companySize || "N\xE3o informado"}

AN\xC1LISE DVF (Desejabilidade, Viabilidade, Exequibilidade):
Score m\xE9dio: ${dvfAverage.toFixed(1)}/10
Avalia\xE7\xF5es realizadas: ${data.dvfAssessments?.length || 0}
${data.dvfAssessments?.map((a) => `- Score: ${a.overallScore}/10, Recomenda\xE7\xE3o: ${a.recommendation}`).join("\n") || "Nenhuma avalia\xE7\xE3o DVF"}

M\xC9TRICAS DE LOVABILITY:
Score geral: ${lovabilityScore.toFixed(1)}/10
NPS: ${data.lovabilityMetrics?.npsScore || 0}
Satisfa\xE7\xE3o: ${data.lovabilityMetrics?.satisfactionScore || 0}/10
Engajamento: ${data.lovabilityMetrics?.engagementRate || 0}%

ANALYTICS DO PROJETO:
Taxa de conclus\xE3o: ${data.projectAnalytics?.completionRate || 0}%
Tempo total investido: ${data.projectAnalytics?.totalTimeSpent || 0} horas
Tamanho da equipe: ${data.projectAnalytics?.teamSize || 1} pessoas
N\xEDvel de inova\xE7\xE3o: ${data.projectAnalytics?.innovationLevel || 0}/5
Success geral: ${projectSuccess}%
Ferramentas top: ${data.projectAnalytics?.topPerformingTools?.join(", ") || "Nenhuma"}
Gargalos de tempo: ${data.projectAnalytics?.timeBottlenecks?.join(", ") || "Nenhum"}

AN\xC1LISE COMPETITIVA:
Score m\xE9dio de competitividade: ${competitivenessAverage.toFixed(1)}/10
Concorrentes analisados: ${data.competitiveAnalysis?.length || 0}
${data.competitiveAnalysis?.map(
          (c) => `- ${c.competitorName} (${c.competitorType}, ${c.marketPosition}): Score ${c.competitivenessScore}/10`
        ).join("\n") || "Nenhuma an\xE1lise competitiva"}

INSTRU\xC7\xD5ES:
1. Fa\xE7a uma avalia\xE7\xE3o geral do estado do projeto considerando todos os aspectos
2. Identifique insights-chave baseados nos dados cruzados
3. Forne\xE7a recomenda\xE7\xF5es acion\xE1veis e espec\xEDficas
4. Liste vantagens competitivas identificadas
5. Destaque \xE1reas priorit\xE1rias de melhoria
6. Sugira pr\xF3ximos passos concretos

Foque em:
- Correla\xE7\xF5es entre m\xE9tricas
- Gaps de performance
- Oportunidades competitivas
- Recomenda\xE7\xF5es pr\xE1ticas e espec\xEDficas
- Pr\xF3ximos passos com timeframe

Responda em portugu\xEAs brasileiro, sendo direto e orientado a resultados.`;
      }
      getFallbackBenchmarkingRecommendations() {
        return {
          overallAssessment: "An\xE1lise de benchmarking em andamento. Dados insuficientes para avalia\xE7\xE3o completa.",
          keyInsights: [
            "Necess\xE1rio coletar mais dados de benchmarking",
            "Implementar avalia\xE7\xF5es DVF regulares",
            "Monitorar m\xE9tricas de lovability"
          ],
          actionableRecommendations: [
            "Conduzir avalia\xE7\xE3o DVF completa",
            "Implementar coleta sistem\xE1tica de feedback",
            "Realizar an\xE1lise competitiva detalhada",
            "Definir KPIs espec\xEDficos de projeto"
          ],
          competitiveAdvantages: [
            "Metodologia estruturada de Design Thinking",
            "Foco em dados e evid\xEAncias"
          ],
          improvementAreas: [
            "Coleta de dados mais robusta",
            "An\xE1lise competitiva regular"
          ],
          nextSteps: [
            "Completar avalia\xE7\xE3o DVF",
            "Implementar sistema de m\xE9tricas",
            "Agendar revis\xE3o mensal de benchmarks"
          ]
        };
      }
    };
    designThinkingGeminiAI = new DesignThinkingGeminiAI();
  }
});

// server/aiGenerationService.ts
var aiGenerationService_exports = {};
__export(aiGenerationService_exports, {
  AIGenerationService: () => AIGenerationService,
  aiGenerationService: () => aiGenerationService
});
import { GoogleGenAI as GoogleGenAI4 } from "@google/genai";
var gemini, AIGenerationService, aiGenerationService;
var init_aiGenerationService = __esm({
  "server/aiGenerationService.ts"() {
    "use strict";
    init_storage();
    gemini = new GoogleGenAI4({ apiKey: process.env.GEMINI_API_KEY || "" });
    console.log("\u2705 AI Service initialized with Google Gemini 2.0 Flash (100% Google AI)");
    AIGenerationService = class {
      /**
       * Helper function to clean JSON responses from Gemini
       * Removes markdown code blocks and other formatting
       */
      cleanJSONResponse(text2) {
        let cleaned = text2.trim();
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
        cleaned = cleaned.replace(/\s*```\s*$/, "");
        return cleaned.trim();
      }
      /**
       * Generate a complete business MVP based on sector, success case, and user problem
       */
      async generateCompleteMVP(userId, context) {
        const startTime = Date.now();
        console.log(`\u{1F916} Starting 100% Google AI MVP generation with Gemini 2.0 Flash for user ${userId}`);
        let textGenerationCost = 0;
        try {
          const projectCore = await this.generateProjectCore(context);
          textGenerationCost += 2e-3;
          const logoUrl = await this.generateLogo(context, projectCore.name);
          const personas2 = await this.generatePersonas(context, projectCore);
          textGenerationCost += 2e-3;
          const povStatements2 = await this.generatePOVStatements(context, personas2);
          textGenerationCost += 15e-4;
          const ideas2 = await this.generateIdeas(context, povStatements2);
          textGenerationCost += 2e-3;
          const landingPageContent = await this.generateLandingPage(context, projectCore);
          textGenerationCost += 2e-3;
          const socialMediaStrategy = await this.generateSocialMediaStrategy(context, projectCore);
          textGenerationCost += 15e-4;
          const businessModel = await this.generateBusinessModel(context, projectCore);
          textGenerationCost += 2e-3;
          const totalCost = textGenerationCost;
          const duration = Date.now() - startTime;
          console.log(`\u2705 100% Google AI MVP generation completed in ${duration}ms - Total cost: R$ ${totalCost.toFixed(4)} (Gemini 2.0 Flash only)`);
          return {
            project: {
              name: projectCore.name,
              description: projectCore.description,
              sectorId: context.sector.id,
              // Only include successCaseId if it's a valid database ID (not 'custom')
              successCaseId: context.successCase.id !== "custom" ? context.successCase.id : void 0,
              userProblemDescription: context.userProblemDescription,
              aiGenerated: true,
              businessModelBase: context.successCase.name
            },
            personas: personas2,
            povStatements: povStatements2,
            ideas: ideas2,
            landingPageContent,
            socialMediaStrategy,
            businessModel,
            logoUrl,
            generationCosts: {
              textGeneration: textGenerationCost,
              imageGeneration: 0,
              // No image generation cost (using free placeholder)
              total: totalCost
            }
          };
        } catch (error) {
          console.error("\u274C Error generating MVP:", error);
          throw new Error(`Failed to generate MVP: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      /**
       * Generate project core information (name, description, tagline)
       */
      async generateProjectCore(context) {
        const customInspirationText = context.customInspiration ? `- Additional User Inspirations: ${context.customInspiration}
` : "";
        const prompt = `You are an expert business consultant and Design Thinking facilitator.

Context:
- Industry Sector: ${context.sector.namePt}
- Success Case Inspiration: ${context.successCase.name} (${context.successCase.descriptionPt || context.successCase.descriptionEn || ""})
${customInspirationText}- User Problem: ${context.userProblemDescription}

Task: Generate a complete business project foundation inspired by the success case${context.customInspiration ? " and user-provided inspirations" : ""} but adapted to the user's specific problem.

Return ONLY a valid JSON object with this structure:
{
  "name": "Concise, memorable project name (2-3 words)",
  "tagline": "One-sentence value proposition",
  "description": "2-paragraph description explaining the solution, target audience, and unique value proposition"
}

Language: ${context.language === "pt" ? "Portuguese (Brazil)" : context.language === "en" ? "English" : context.language === "es" ? "Spanish" : "French"}

Be creative, professional, and market-ready. The name should be brandable and memorable.`;
        const response = await gemini.models.generateContent({
          model: "gemini-2.0-flash-001",
          contents: prompt,
          config: {
            temperature: 0.8,
            maxOutputTokens: 500
          }
        });
        const content = response.text || "{}";
        const cleanedContent = this.cleanJSONResponse(content);
        try {
          const parsed = JSON.parse(cleanedContent);
          return {
            name: parsed.name || "Unnamed Project",
            description: parsed.description || "No description available",
            tagline: parsed.tagline || ""
          };
        } catch (error) {
          console.error("Failed to parse project core JSON:", content);
          console.error("Cleaned content:", cleanedContent);
          return {
            name: "Unnamed Project",
            description: "No description available",
            tagline: ""
          };
        }
      }
      /**
       * Generate placeholder logo using UI Avatars API
       * This is a free service that creates professional-looking logos from initials
       * Note: When Google Imagen 3 becomes available in the SDK, we can switch to AI-generated logos
       */
      async generateLogo(context, projectName) {
        try {
          if (!projectName || projectName.trim().length === 0) {
            console.warn("\u26A0\uFE0F Empty project name, cannot generate logo");
            return null;
          }
          const words = projectName.trim().split(" ").filter((w) => w.length > 0);
          if (words.length === 0) {
            console.warn("\u26A0\uFE0F No valid words in project name");
            return null;
          }
          const initials = words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
          const logoText = initials.length > 0 ? initials : projectName.substring(0, 2).toUpperCase();
          const sectorColors = {
            "sector_tech": "6366f1",
            // Indigo
            "sector_ecommerce": "8b5cf6",
            // Purple
            "sector_health": "10b981",
            // Green
            "sector_education": "3b82f6",
            // Blue
            "sector_finance": "14b8a6",
            // Teal
            "sector_food": "f59e0b",
            // Amber
            "sector_entertainment": "ec4899",
            // Pink
            "sector_travel": "06b6d4"
            // Cyan
          };
          const color = sectorColors[context.sector.id] || "6366f1";
          const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(logoText)}&size=512&background=${color}&color=fff&bold=true&format=png`;
          console.log(`\u2705 Generated placeholder logo for "${projectName}" (${logoText}) - Color: #${color}`);
          return logoUrl;
        } catch (error) {
          console.error("\u26A0\uFE0F Error generating placeholder logo:", error);
          return null;
        }
      }
      /**
       * Generate 2-3 user personas based on the project
       */
      async generatePersonas(context, projectCore) {
        const customInspirationText = context.customInspiration ? `Additional Inspirations: ${context.customInspiration}
` : "";
        const prompt = `You are a UX researcher creating user personas.

Project: ${projectCore.name}
Description: ${projectCore.description}
Industry: ${context.sector.namePt}
Inspiration: ${context.successCase.name}
${customInspirationText}
Task: Create 2-3 detailed user personas representing the target audience.

Return ONLY a valid JSON array with this structure:
[
  {
    "name": "Full name",
    "age": 25-45,
    "occupation": "Job title",
    "bio": "2-sentence background and lifestyle",
    "goals": "What they want to achieve (2 sentences)",
    "frustrations": "Pain points and challenges (2 sentences)",
    "behaviors": "Habits, preferences, tech-savviness (2 sentences)"
  }
]

Language: ${context.language === "pt" ? "Portuguese (Brazil)" : "English"}`;
        const response = await gemini.models.generateContent({
          model: "gemini-2.0-flash-001",
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        });
        const content = response.text || "[]";
        const cleanedContent = this.cleanJSONResponse(content);
        try {
          const parsed = JSON.parse(cleanedContent);
          return parsed.map((p) => ({
            name: p.name,
            age: p.age,
            occupation: p.occupation,
            bio: p.bio,
            goals: p.goals,
            frustrations: p.frustrations,
            behaviors: p.behaviors,
            projectId: ""
            // Will be set after project creation
          }));
        } catch (error) {
          console.error("Failed to parse personas JSON:", content);
          console.error("Cleaned content:", cleanedContent);
          return [];
        }
      }
      /**
       * Generate POV (Point of View) statements from personas
       */
      async generatePOVStatements(context, personas2) {
        const personasText = personas2.map((p) => `${p.name} (${p.occupation}): Goals - ${p.goals}, Frustrations - ${p.frustrations}`).join("\n");
        const prompt = `You are a Design Thinking facilitator creating POV statements.

Personas:
${personasText}

Task: Create 2-3 POV statements using the format:
"[User] needs [need] because [insight]"

Return ONLY a valid JSON array:
[
  {
    "user": "Persona name or type",
    "need": "What they need",
    "insight": "Why they need it (the deeper insight)"
  }
]

Language: ${context.language === "pt" ? "Portuguese (Brazil)" : "English"}`;
        const response = await gemini.models.generateContent({
          model: "gemini-2.0-flash-001",
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 400
          }
        });
        const content = response.text || "[]";
        const cleanedContent = this.cleanJSONResponse(content);
        try {
          const parsed = JSON.parse(cleanedContent);
          return parsed.map((pov) => ({
            user: pov.user,
            need: pov.need,
            insight: pov.insight,
            statement: `${pov.user} needs ${pov.need} because ${pov.insight}`,
            // Complete POV statement
            projectId: ""
            // Will be set after project creation
          }));
        } catch (error) {
          console.error("Failed to parse POV statements JSON:", content);
          console.error("Cleaned content:", cleanedContent);
          return [];
        }
      }
      /**
       * Generate initial ideas for solutions
       */
      async generateIdeas(context, povStatements2) {
        const povText = povStatements2.map((p) => `${p.user} needs ${p.need} because ${p.insight}`).join("\n");
        const prompt = `You are an innovation consultant in an ideation session.

POV Statements:
${povText}

Success Case Inspiration: ${context.successCase.name}

Task: Generate 5-7 innovative solution ideas that address these needs.

Return ONLY a valid JSON array:
[
  {
    "title": "Concise idea name",
    "description": "2-3 sentence explanation of the idea and how it works",
    "category": "feature" or "service" or "product"
  }
]

Be creative and actionable. Mix quick wins with bold innovations.

Language: ${context.language === "pt" ? "Portuguese (Brazil)" : "English"}`;
        const response = await gemini.models.generateContent({
          model: "gemini-2.0-flash-001",
          contents: prompt,
          config: {
            temperature: 0.9,
            maxOutputTokens: 800
          }
        });
        const content = response.text || "[]";
        const cleanedContent = this.cleanJSONResponse(content);
        try {
          const parsed = JSON.parse(cleanedContent);
          return parsed.map((idea) => ({
            title: idea.title,
            description: idea.description,
            category: idea.category || "feature",
            projectId: ""
            // Will be set after project creation
          }));
        } catch (error) {
          console.error("Failed to parse ideas JSON:", content);
          console.error("Cleaned content:", cleanedContent);
          return [];
        }
      }
      /**
       * Generate landing page content
       */
      async generateLandingPage(context, projectCore) {
        console.log(`\u{1F3A8} Generating Landing Page for: ${projectCore.name}`);
        const customInspirationText = context.customInspiration ? `User References: ${context.customInspiration}
` : "";
        const prompt = `You are a conversion copywriter creating landing page content.

Project: ${projectCore.name}
Tagline: ${projectCore.tagline}
Description: ${projectCore.description}
${customInspirationText}
Task: Create compelling landing page sections.

Return ONLY a valid JSON object:
{
  "headline": "Powerful headline (6-10 words)",
  "subheadline": "Supporting subheadline (15-20 words)",
  "valueProposition": "Clear value prop paragraph (3-4 sentences)",
  "features": ["Feature 1 with benefit", "Feature 2 with benefit", "Feature 3 with benefit"],
  "ctaText": "Call-to-action button text"
}

Language: ${context.language === "pt" ? "Portuguese (Brazil)" : "English"}`;
        const response = await gemini.models.generateContent({
          model: "gemini-2.0-flash-001",
          contents: prompt,
          config: {
            temperature: 0.8,
            maxOutputTokens: 500
          }
        });
        const content = response.text || "{}";
        const cleanedContent = this.cleanJSONResponse(content);
        console.log(`\u{1F3A8} Landing Page raw response (first 200 chars):`, content.substring(0, 200));
        console.log(`\u{1F3A8} Landing Page cleaned (first 200 chars):`, cleanedContent.substring(0, 200));
        try {
          const parsed = JSON.parse(cleanedContent);
          console.log(`\u2705 Landing Page parsed successfully:`, Object.keys(parsed));
          return parsed;
        } catch (error) {
          console.error("\u274C Failed to parse landing page JSON:", content);
          console.error("\u274C Cleaned content:", cleanedContent);
          console.error("\u274C Error:", error);
          return {
            headline: "Welcome",
            subheadline: "Your solution awaits",
            valueProposition: "We provide value.",
            features: [],
            ctaText: "Get Started"
          };
        }
      }
      /**
       * Generate social media strategy
       */
      async generateSocialMediaStrategy(context, projectCore) {
        const prompt = `You are a social media strategist.

Project: ${projectCore.name}
Industry: ${context.sector.namePt}

Task: Create social media launch strategy for 3 platforms.

Return ONLY a valid JSON array:
[
  {
    "platform": "Instagram/LinkedIn/TikTok/etc",
    "contentIdeas": ["Post idea 1", "Post idea 2", "Post idea 3"],
    "postingFrequency": "e.g., 3x per week"
  }
]

Language: ${context.language === "pt" ? "Portuguese (Brazil)" : "English"}`;
        const response = await gemini.models.generateContent({
          model: "gemini-2.0-flash-001",
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 600
          }
        });
        const content = response.text || "[]";
        const cleanedContent = this.cleanJSONResponse(content);
        try {
          return JSON.parse(cleanedContent);
        } catch (error) {
          console.error("Failed to parse social media strategy JSON:", content);
          console.error("Cleaned content:", cleanedContent);
          return [];
        }
      }
      /**
       * Generate business model canvas
       */
      async generateBusinessModel(context, projectCore) {
        console.log(`\u{1F4B0} Generating Business Model for: ${projectCore.name}`);
        const customInspirationText = context.customInspiration ? `Additional References: ${context.customInspiration}
` : "";
        const prompt = `You are a business model consultant.

Project: ${projectCore.name}
Description: ${projectCore.description}
Inspired by: ${context.successCase.name}
${customInspirationText}
Task: Create a simplified business model canvas.

Return ONLY a valid JSON object:
{
  "revenueStreams": ["Revenue stream 1", "Revenue stream 2"],
  "keyResources": ["Key resource 1", "Key resource 2", "Key resource 3"],
  "keyActivities": ["Key activity 1", "Key activity 2", "Key activity 3"],
  "costStructure": ["Cost item 1", "Cost item 2", "Cost item 3"]
}

Language: ${context.language === "pt" ? "Portuguese (Brazil)" : "English"}`;
        const response = await gemini.models.generateContent({
          model: "gemini-2.0-flash-001",
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        });
        const content = response.text || "{}";
        const cleanedContent = this.cleanJSONResponse(content);
        console.log(`\u{1F4B0} Business Model raw response (first 200 chars):`, content.substring(0, 200));
        console.log(`\u{1F4B0} Business Model cleaned (first 200 chars):`, cleanedContent.substring(0, 200));
        try {
          const parsed = JSON.parse(cleanedContent);
          console.log(`\u2705 Business Model parsed successfully:`, Object.keys(parsed));
          return parsed;
        } catch (error) {
          console.error("\u274C Failed to parse business model JSON:", content);
          console.error("\u274C Cleaned content:", cleanedContent);
          console.error("\u274C Error:", error);
          return {
            revenueStreams: [],
            keyResources: [],
            keyActivities: [],
            costStructure: []
          };
        }
      }
      /**
       * Save generated assets to database with cost tracking
       */
      async saveGeneratedAssets(projectId, generatedData) {
        const assets = [];
        console.log(`\u{1F4E6} Preparing to save AI assets for project ${projectId}`);
        console.log(`\u{1F4E6} Landing Page Content:`, JSON.stringify(generatedData.landingPageContent).substring(0, 200));
        console.log(`\u{1F4E6} Business Model:`, JSON.stringify(generatedData.businessModel).substring(0, 200));
        console.log(`\u{1F4E6} Social Media Strategy:`, JSON.stringify(generatedData.socialMediaStrategy).substring(0, 200));
        if (generatedData.logoUrl) {
          assets.push({
            projectId,
            assetType: "logo",
            content: JSON.stringify({ url: generatedData.logoUrl }),
            generationCost: 0
            // Free placeholder logo
          });
          console.log(`\u2705 Logo asset prepared`);
        }
        const assetCostShare = generatedData.generationCosts.textGeneration / 3;
        const landingPageContent = JSON.stringify(generatedData.landingPageContent);
        assets.push({
          projectId,
          assetType: "landing_page",
          content: landingPageContent,
          generationCost: assetCostShare
        });
        console.log(`\u2705 Landing Page asset prepared (${landingPageContent.length} chars)`);
        const socialMediaContent = JSON.stringify(generatedData.socialMediaStrategy);
        assets.push({
          projectId,
          assetType: "social_media",
          content: socialMediaContent,
          generationCost: assetCostShare
        });
        console.log(`\u2705 Social Media asset prepared (${socialMediaContent.length} chars)`);
        const businessModelContent = JSON.stringify(generatedData.businessModel);
        assets.push({
          projectId,
          assetType: "business_model",
          content: businessModelContent,
          generationCost: assetCostShare
        });
        console.log(`\u2705 Business Model asset prepared (${businessModelContent.length} chars)`);
        console.log(`\u{1F4BE} Saving ${assets.length} assets to database...`);
        for (const asset of assets) {
          try {
            const savedAsset = await storage.createAiGeneratedAsset(asset);
            console.log(`\u2705 Saved asset type: ${asset.assetType} with ID: ${savedAsset.id}`);
          } catch (error) {
            console.error(`\u274C Failed to save asset type: ${asset.assetType}`, error);
            throw error;
          }
        }
        console.log(`\u{1F4BE} Successfully saved ${assets.length} AI-generated assets for project ${projectId}`);
      }
    };
    aiGenerationService = new AIGenerationService();
  }
});

// server/double-diamond-pdf.ts
var double_diamond_pdf_exports = {};
__export(double_diamond_pdf_exports, {
  generateDoubleDiamondPDF: () => generateDoubleDiamondPDF
});
import { jsPDF as jsPDF2 } from "jspdf";
async function generateDoubleDiamondPDF(project) {
  const doc = new jsPDF2();
  let yPos = 20;
  const checkPageBreak = (requiredSpace) => {
    if (yPos + requiredSpace > 270) {
      doc.addPage();
      yPos = 35;
    }
  };
  const addWrappedText = (text2, x, y, maxWidth, fontSize = 12) => {
    doc.setFontSize(fontSize);
    const splitText = doc.splitTextToSize(text2, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * (fontSize * 0.4);
  };
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Double Diamond Framework", 105, 80, { align: "center" });
  yPos = 100;
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text(project.name, 105, yPos, { align: "center" });
  yPos += 20;
  doc.setFontSize(12);
  if (project.description) {
    const descHeight = addWrappedText(project.description, 105 - 70, yPos, 140, 12);
    yPos += descHeight + 20;
  }
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")}`, 105, yPos, { align: "center" });
  doc.text("100% Automatizado com Google Gemini 2.0 Flash", 105, yPos + 8, { align: "center" });
  doc.setTextColor(0, 0, 0);
  doc.addPage();
  yPos = 35;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("1. Descobrir (Discover)", 20, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 15;
  if (project.discoverPainPoints && project.discoverPainPoints.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pain Points", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    project.discoverPainPoints.forEach((pain, idx) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.text(`${idx + 1}.`, 20, yPos);
      const painText = typeof pain === "string" ? pain : pain.text || pain;
      const painHeight = addWrappedText(painText, 30, yPos, 160, 11);
      yPos += Math.max(8, painHeight + 3);
    });
    yPos += 10;
  }
  if (project.discoverInsights && project.discoverInsights.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Insights", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    project.discoverInsights.forEach((insight, idx) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.text(`${idx + 1}.`, 20, yPos);
      const insightText = typeof insight === "string" ? insight : insight.text || insight;
      const insightHeight = addWrappedText(insightText, 30, yPos, 160, 11);
      yPos += Math.max(8, insightHeight + 3);
    });
    yPos += 10;
  }
  if (project.discoverUserNeeds && project.discoverUserNeeds.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Necessidades do Usu\xE1rio", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    project.discoverUserNeeds.forEach((need, idx) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.text(`${idx + 1}.`, 20, yPos);
      const needText = typeof need === "string" ? need : need.need || need;
      const needHeight = addWrappedText(needText, 30, yPos, 160, 11);
      yPos += Math.max(8, needHeight + 3);
    });
  }
  doc.addPage();
  yPos = 35;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("2. Definir (Define)", 20, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 15;
  if (project.definePovStatements && project.definePovStatements.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("POV Statements", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    project.definePovStatements.forEach((pov, idx) => {
      checkPageBreak(25);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`POV ${idx + 1}:`, 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 8;
      doc.setFontSize(11);
      const povHeight = addWrappedText(pov.fullStatement || pov, 25, yPos, 165, 11);
      yPos += povHeight + 10;
    });
    yPos += 10;
  }
  if (project.defineHmwQuestions && project.defineHmwQuestions.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("How Might We Questions", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    project.defineHmwQuestions.forEach((hmw, idx) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.text(`${idx + 1}.`, 20, yPos);
      const hmwText = hmw.question || hmw;
      const hmwHeight = addWrappedText(hmwText, 30, yPos, 160, 11);
      yPos += Math.max(8, hmwHeight + 3);
    });
  }
  doc.addPage();
  yPos = 35;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("3. Desenvolver (Develop)", 20, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 15;
  if (project.developIdeas && project.developIdeas.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Ideias Geradas", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    project.developIdeas.forEach((idea, idx) => {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. ${idea.title || idea}`, 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 8;
      if (idea.description) {
        doc.setFontSize(11);
        const ideaHeight = addWrappedText(idea.description, 25, yPos, 165, 10);
        yPos += ideaHeight + 5;
      }
      if (idea.category) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Categoria: ${idea.category}`, 25, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;
      }
      yPos += 8;
    });
  }
  doc.addPage();
  yPos = 35;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("4. Entregar (Deliver)", 20, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 15;
  if (project.deliverMvpConcept) {
    checkPageBreak(40);
    const mvpConcept = project.deliverMvpConcept;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Conceito do MVP", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    if (mvpConcept.name) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(mvpConcept.name, 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
    }
    if (mvpConcept.description) {
      doc.setFontSize(11);
      const descHeight = addWrappedText(mvpConcept.description, 20, yPos, 170, 11);
      yPos += descHeight + 15;
    }
    if (mvpConcept.coreFeatures && mvpConcept.coreFeatures.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Recursos Principais:", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 8;
      mvpConcept.coreFeatures.forEach((feature) => {
        checkPageBreak(10);
        doc.setFontSize(10);
        doc.text("\u2022", 25, yPos);
        const featureHeight = addWrappedText(feature, 32, yPos, 160, 10);
        yPos += Math.max(7, featureHeight + 2);
      });
      yPos += 10;
    }
  }
  if (project.deliverLogoSuggestions && project.deliverLogoSuggestions.length > 0) {
    checkPageBreak(50);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Sugest\xF5es de Logo", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    project.deliverLogoSuggestions.forEach((logo, idx) => {
      checkPageBreak(25);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Op\xE7\xE3o ${idx + 1}:`, 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 7;
      if (logo.concept) {
        const logoHeight = addWrappedText(logo.concept, 25, yPos, 165, 10);
        yPos += logoHeight + 3;
      }
      if (logo.colors) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Cores: ${logo.colors}`, 25, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;
      }
      yPos += 8;
    });
  }
  if (project.deliverLandingPage) {
    doc.addPage();
    yPos = 35;
    const landingPage = project.deliverLandingPage;
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Landing Page", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 15;
    if (landingPage.headline) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const headlineHeight = addWrappedText(landingPage.headline, 20, yPos, 170, 14);
      doc.setFont("helvetica", "normal");
      yPos += headlineHeight + 10;
    }
    if (landingPage.subheadline) {
      doc.setFontSize(12);
      const subHeight = addWrappedText(landingPage.subheadline, 20, yPos, 170, 12);
      yPos += subHeight + 15;
    }
    if (landingPage.sections && landingPage.sections.length > 0) {
      landingPage.sections.forEach((section) => {
        checkPageBreak(25);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(section.title, 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(10);
        const sectionHeight = addWrappedText(section.content, 25, yPos, 165, 10);
        yPos += sectionHeight + 10;
      });
    }
  }
  doc.addPage();
  yPos = 35;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("5. An\xE1lise DFV", 20, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 15;
  if (project.dfvDesirabilityScore !== null && project.dfvDesirabilityScore !== void 0 || project.dfvFeasibilityScore !== null && project.dfvFeasibilityScore !== void 0 || project.dfvViabilityScore !== null && project.dfvViabilityScore !== void 0) {
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Pontua\xE7\xF5es DFV", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 15;
    if (project.dfvDesirabilityScore !== null && project.dfvDesirabilityScore !== void 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Desirability (Desejabilidade):", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 138);
      doc.text(`${project.dfvDesirabilityScore}/100`, 120, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 20;
    }
    if (project.dfvFeasibilityScore !== null && project.dfvFeasibilityScore !== void 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Feasibility (Viabilidade T\xE9cnica):", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text(`${project.dfvFeasibilityScore}/100`, 120, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 20;
    }
    if (project.dfvViabilityScore !== null && project.dfvViabilityScore !== void 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Viability (Viabilidade de Neg\xF3cio):", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.setTextColor(139, 92, 246);
      doc.text(`${project.dfvViabilityScore}/100`, 120, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 25;
    }
  }
  if (project.dfvAnalysis) {
    const dfvData = project.dfvAnalysis;
    if (dfvData.desirability) {
      checkPageBreak(50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("An\xE1lise de Desirability (Desejabilidade)", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      if (dfvData.desirability.strengths && Array.isArray(dfvData.desirability.strengths) && dfvData.desirability.strengths.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Pontos Fortes:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        dfvData.desirability.strengths.forEach((strength) => {
          checkPageBreak(10);
          doc.text("\u2022", 25, yPos);
          const strengthHeight = addWrappedText(strength, 32, yPos, 160, 11);
          yPos += Math.max(7, strengthHeight + 2);
        });
        yPos += 5;
      }
      if (dfvData.desirability.concerns && Array.isArray(dfvData.desirability.concerns) && dfvData.desirability.concerns.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Preocupa\xE7\xF5es:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        dfvData.desirability.concerns.forEach((concern) => {
          checkPageBreak(10);
          doc.text("\u2022", 25, yPos);
          const concernHeight = addWrappedText(concern, 32, yPos, 160, 11);
          yPos += Math.max(7, concernHeight + 2);
        });
        yPos += 5;
      }
      if (dfvData.desirability.reasoning) {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Racioc\xEDnio:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        const reasoningHeight = addWrappedText(dfvData.desirability.reasoning, 20, yPos, 170, 11);
        yPos += reasoningHeight + 15;
      }
    }
    if (dfvData.feasibility) {
      checkPageBreak(50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("An\xE1lise de Feasibility (Viabilidade T\xE9cnica)", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      if (dfvData.feasibility.strengths && Array.isArray(dfvData.feasibility.strengths) && dfvData.feasibility.strengths.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Pontos Fortes:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        dfvData.feasibility.strengths.forEach((strength) => {
          checkPageBreak(10);
          doc.text("\u2022", 25, yPos);
          const strengthHeight = addWrappedText(strength, 32, yPos, 160, 11);
          yPos += Math.max(7, strengthHeight + 2);
        });
        yPos += 5;
      }
      if (dfvData.feasibility.concerns && Array.isArray(dfvData.feasibility.concerns) && dfvData.feasibility.concerns.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Preocupa\xE7\xF5es:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        dfvData.feasibility.concerns.forEach((concern) => {
          checkPageBreak(10);
          doc.text("\u2022", 25, yPos);
          const concernHeight = addWrappedText(concern, 32, yPos, 160, 11);
          yPos += Math.max(7, concernHeight + 2);
        });
        yPos += 5;
      }
      if (dfvData.feasibility.reasoning) {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Racioc\xEDnio:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        const reasoningHeight = addWrappedText(dfvData.feasibility.reasoning, 20, yPos, 170, 11);
        yPos += reasoningHeight + 15;
      }
    }
    if (dfvData.viability) {
      checkPageBreak(50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("An\xE1lise de Viability (Viabilidade de Neg\xF3cio)", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      if (dfvData.viability.strengths && Array.isArray(dfvData.viability.strengths) && dfvData.viability.strengths.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Pontos Fortes:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        dfvData.viability.strengths.forEach((strength) => {
          checkPageBreak(10);
          doc.text("\u2022", 25, yPos);
          const strengthHeight = addWrappedText(strength, 32, yPos, 160, 11);
          yPos += Math.max(7, strengthHeight + 2);
        });
        yPos += 5;
      }
      if (dfvData.viability.concerns && Array.isArray(dfvData.viability.concerns) && dfvData.viability.concerns.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Preocupa\xE7\xF5es:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        dfvData.viability.concerns.forEach((concern) => {
          checkPageBreak(10);
          doc.text("\u2022", 25, yPos);
          const concernHeight = addWrappedText(concern, 32, yPos, 160, 11);
          yPos += Math.max(7, concernHeight + 2);
        });
        yPos += 5;
      }
      if (dfvData.viability.reasoning) {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Racioc\xEDnio:", 20, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
        doc.setFontSize(11);
        const reasoningHeight = addWrappedText(dfvData.viability.reasoning, 20, yPos, 170, 11);
        yPos += reasoningHeight + 15;
      }
    }
    if (dfvData.recommendations && Array.isArray(dfvData.recommendations) && dfvData.recommendations.length > 0) {
      checkPageBreak(40);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Recomenda\xE7\xF5es", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      doc.setFontSize(11);
      dfvData.recommendations.forEach((rec, idx) => {
        checkPageBreak(10);
        doc.text(`${idx + 1}.`, 20, yPos);
        const recHeight = addWrappedText(rec, 30, yPos, 160, 11);
        yPos += Math.max(8, recHeight + 3);
      });
      yPos += 10;
    }
    if (dfvData.nextSteps && Array.isArray(dfvData.nextSteps) && dfvData.nextSteps.length > 0) {
      checkPageBreak(40);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Pr\xF3ximos Passos", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      doc.setFontSize(11);
      dfvData.nextSteps.forEach((step, idx) => {
        checkPageBreak(10);
        doc.text(`${idx + 1}.`, 20, yPos);
        const stepHeight = addWrappedText(step, 30, yPos, 160, 11);
        yPos += Math.max(8, stepHeight + 3);
      });
    }
  }
  if (project.dfvFeedback) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recomenda\xE7\xF5es", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    doc.setFontSize(11);
    const feedbackHeight = addWrappedText(project.dfvFeedback, 20, yPos, 170, 11);
    yPos += feedbackHeight + 15;
  }
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Design Thinking ", 20, 15);
    doc.setTextColor(16, 185, 129);
    doc.text("Tools", 72, 15);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235);
    doc.textWithLink("https://www.designthinkingtools.com", 105, 285, {
      url: "https://www.designthinkingtools.com",
      align: "center"
    });
    doc.setTextColor(107, 114, 128);
    doc.text(`P\xE1gina ${i} de ${totalPages}`, 180, 285);
    doc.setTextColor(0, 0, 0);
  }
  return Buffer.from(doc.output("arraybuffer"));
}
var init_double_diamond_pdf = __esm({
  "server/double-diamond-pdf.ts"() {
    "use strict";
  }
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          ),
          await import("@replit/vite-plugin-dev-banner").then(
            (m) => m.devBanner()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path2.resolve(import.meta.dirname, "client", "src"),
          "@shared": path2.resolve(import.meta.dirname, "shared"),
          "@assets": path2.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path2.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path2.resolve(import.meta.dirname, "client/dist"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}
var viteLogger;
var init_vite = __esm({
  async "server/vite.ts"() {
    "use strict";
    await init_vite_config();
    viteLogger = createLogger();
  }
});

// server/index.ts
import express2 from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import ConnectPgSimple from "connect-pg-simple";
import compression from "compression";
import rateLimit from "express-rate-limit";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// server/passport-config.ts
init_db();
init_schema();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { eq } from "drizzle-orm";
function setupPassport() {
  const hasGoogleCredentials = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  if (hasGoogleCredentials) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            const googleId = profile.id;
            const displayName = profile.displayName || email?.split("@")[0] || "User";
            const profilePicture = profile.photos?.[0]?.value;
            if (!email) {
              return done(
                new Error("No email found in Google profile"),
                void 0
              );
            }
            let [user] = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
            if (user) {
              return done(null, user);
            }
            [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
            if (user) {
              const [updatedUser] = await db.update(users).set({
                googleId,
                provider: "google",
                profilePicture: profilePicture || user.profilePicture
              }).where(eq(users.id, user.id)).returning();
              return done(null, updatedUser);
            }
            const allPlans = await db.select().from(subscriptionPlans);
            const freePlan = allPlans.find(
              (p) => p.name.toLowerCase() === "free"
            );
            if (!freePlan) {
              console.error("\u274C [Passport Google] Free plan not found!");
              console.error(
                "Available plans:",
                allPlans.map((p) => p.name).join(", ")
              );
              return done(new Error("System configuration error"), void 0);
            }
            const username = email.split("@")[0] + "_" + Math.random().toString(36).substring(7);
            const [newUser] = await db.insert(users).values({
              email,
              username,
              name: displayName,
              provider: "google",
              googleId,
              profilePicture,
              password: null,
              // No password for OAuth users
              role: "user",
              subscriptionPlanId: freePlan.id,
              // Automatically assign Free plan
              subscriptionStatus: "active"
            }).returning();
            console.log(
              `\u2705 [Passport Google] New user created with Free plan: ${newUser.email}`
            );
            return done(null, newUser);
          } catch (error) {
            console.error("[Passport Google] Error:", error);
            return done(error, void 0);
          }
        }
      )
    );
  } else {
    console.warn(
      "[Passport Google] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set - Google OAuth disabled"
    );
  }
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!user) {
        return done(new Error("User not found"), null);
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
var passport_config_default = passport;

// server/routes.ts
init_storage();
init_schema();
import bcrypt2 from "bcrypt";
import Stripe from "stripe";
import { sql as sql3 } from "drizzle-orm";

// server/subscriptionMiddleware.ts
init_storage();
function normalizeLimit(value) {
  if (value === null || value === void 0) return null;
  if (value < 0) return null;
  return value;
}
async function loadUserSubscription(req, res, next) {
  if (!req.user?.id) {
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
          hasCommentsAndFeedback: freePlan.hasCommentsAndFeedback ?? false
        },
        addons: {
          doubleDiamondPro: false,
          exportPro: false,
          aiTurbo: false,
          collabAdvanced: false,
          libraryPremium: false,
          raw: []
        }
      };
    }
    return next();
  }
  try {
    const userSubscription = await storage.getUserActiveSubscription(req.user.id);
    let plan;
    if (userSubscription) {
      plan = await storage.getSubscriptionPlan(userSubscription.planId);
    } else {
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
          hasCommentsAndFeedback
        },
        addons: {
          doubleDiamondPro: hasDoubleDiamondPro,
          exportPro: hasExportPro,
          aiTurbo: hasAiTurbo,
          collabAdvanced: hasCollabAdvanced,
          libraryPremium: hasLibraryPremium,
          raw: activeAddons
        }
      };
    }
    next();
  } catch (error) {
    console.error("Error loading user subscription:", error);
    next(error);
  }
}
async function checkProjectLimit(req, res, next) {
  if (!req.user?.id || !req.subscription?.limits) {
    return next();
  }
  const maxProjects = req.subscription.limits.maxProjects;
  if (maxProjects === null) {
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
async function checkPersonaLimit(req, res, next) {
  if (!req.user?.id || !req.subscription?.limits) {
    return next();
  }
  const maxPersonas = req.subscription.limits.maxPersonasPerProject;
  if (maxPersonas === null) {
    return next();
  }
  const projectId = req.params.projectId;
  if (!projectId) {
    return next();
  }
  try {
    const personas2 = await storage.getPersonas(projectId);
    if (personas2.length >= maxPersonas) {
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
async function checkCollaborationAccess(req, res, next) {
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
async function getSubscriptionInfo(req, res) {
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
        canExportPDF: Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("pdf") : false,
        canExportPNG: Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("png") : false,
        canExportCSV: Array.isArray(freePlan.exportFormats) ? freePlan.exportFormats.includes("csv") : false,
        hasPermissionManagement: freePlan.hasPermissionManagement ?? false,
        hasSharedWorkspace: freePlan.hasSharedWorkspace ?? false,
        hasCommentsAndFeedback: freePlan.hasCommentsAndFeedback ?? false
      } : null,
      addons: {
        doubleDiamondPro: false,
        exportPro: false,
        aiTurbo: false,
        collabAdvanced: false,
        libraryPremium: false,
        raw: []
      },
      usage: {
        projects: 0,
        aiChatThisMonth: 0
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
    const userProjects = await storage.getProjects(req.user.id);
    const user = await storage.getUser(req.user.id);
    const activeAddons = plan ? await storage.getActiveUserAddons(req.user.id) : [];
    let limits = null;
    let addonsInfo = null;
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
        hasCommentsAndFeedback
      };
      addonsInfo = {
        doubleDiamondPro: hasDoubleDiamondPro,
        exportPro: hasExportPro,
        aiTurbo: hasAiTurbo,
        collabAdvanced: hasCollabAdvanced,
        libraryPremium: hasLibraryPremium,
        raw: activeAddons
      };
    }
    res.json({
      plan,
      subscription: userSubscription,
      limits,
      addons: addonsInfo,
      usage: {
        projects: userProjects.length,
        aiChatThisMonth: 0
        // Placeholder
      }
    });
  } catch (error) {
    console.error("Error getting subscription info:", error);
    res.status(500).json({ error: "Failed to get subscription info" });
  }
}

// server/middleware/checkAiProjectLimits.ts
init_db();
init_schema();
import { eq as eq3 } from "drizzle-orm";
async function checkAiProjectLimits(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = user[0];
    if (userData.role === "admin") {
      console.log(`\u2705 Admin user ${userId} bypassing AI project limits`);
      return next();
    }
    if (!userData.subscriptionPlanId) {
      return res.status(403).json({
        error: "Voc\xEA precisa de um plano ativo para usar a gera\xE7\xE3o de projetos com IA.",
        code: "NO_SUBSCRIPTION_PLAN",
        currentUsage: userData.aiProjectsUsed || 0,
        limit: null,
        planName: "Nenhum",
        upgradeUrl: "/pricing"
      });
    }
    const plan = await db.select().from(subscriptionPlans).where(eq3(subscriptionPlans.id, userData.subscriptionPlanId)).limit(1);
    if (!plan || plan.length === 0) {
      return res.status(404).json({
        error: "Plano de assinatura n\xE3o encontrado",
        code: "PLAN_NOT_FOUND",
        currentUsage: userData.aiProjectsUsed || 0,
        limit: null,
        planName: "Desconhecido",
        upgradeUrl: "/pricing"
      });
    }
    const planData = plan[0];
    const currentUsage = userData.aiProjectsUsed || 0;
    const limit = planData.maxAiProjects;
    if (limit === null) {
      return next();
    }
    if (currentUsage >= limit) {
      return res.status(403).json({
        error: `Voc\xEA atingiu o limite de ${limit} projeto${limit > 1 ? "s" : ""} AI gerado${limit > 1 ? "s" : ""} do plano ${planData.displayName}. Fa\xE7a upgrade para gerar mais projetos.`,
        code: "AI_PROJECT_LIMIT_REACHED",
        currentUsage,
        limit,
        planName: planData.displayName,
        upgradeUrl: "/pricing"
      });
    }
    next();
  } catch (error) {
    console.error("Error checking AI project limits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function incrementAiProjectsUsed(userId) {
  try {
    const user = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
    if (user && user.length > 0) {
      const currentUsage = user[0].aiProjectsUsed || 0;
      await db.update(users).set({ aiProjectsUsed: currentUsage + 1 }).where(eq3(users.id, userId));
      console.log(`\u2705 Incremented AI projects used for user ${userId}: ${currentUsage} \u2192 ${currentUsage + 1}`);
    }
  } catch (error) {
    console.error("Error incrementing AI projects used:", error);
    throw error;
  }
}

// server/middleware/checkDoubleDiamondLimit.ts
init_storage();
init_db();
init_schema();
import { eq as eq4 } from "drizzle-orm";
var FREE_PLAN_DOUBLE_DIAMOND_LIMIT = 3;
async function checkDoubleDiamondLimit(req, res, next) {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await db.select().from(users).where(eq4(users.id, userId)).limit(1);
    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = user[0];
    if (userData.role === "admin") {
      console.log(`\u2705 Admin user ${userId} bypassing Double Diamond limits`);
      return next();
    }
    const userDoubleDiamondProjects = await storage.getDoubleDiamondProjects(userId);
    const currentUsage = userDoubleDiamondProjects.length;
    const activeAddons = await storage.getActiveUserAddons(userId);
    const addonKeys = new Set(activeAddons.map((a) => a.addonKey));
    const hasDoubleDiamondPro = addonKeys.has("double_diamond_pro");
    if (hasDoubleDiamondPro) {
      console.log(`\u2705 User ${userId} has Double Diamond Pro add-on - unlimited projects`);
      return next();
    }
    let planData = null;
    if (userData.subscriptionPlanId) {
      const plan = await db.select().from(subscriptionPlans).where(eq4(subscriptionPlans.id, userData.subscriptionPlanId)).limit(1);
      planData = plan && plan.length > 0 ? plan[0] : null;
    }
    const userCustomLimitRaw = userData.customMaxDoubleDiamondProjects;
    const userCustomLimit = typeof userCustomLimitRaw === "number" && userCustomLimitRaw >= 0 ? userCustomLimitRaw : null;
    let planLimit = null;
    if (!planData) {
      planLimit = FREE_PLAN_DOUBLE_DIAMOND_LIMIT;
    } else if (typeof planData.maxDoubleDiamondProjects === "number") {
      planLimit = planData.maxDoubleDiamondProjects < 0 ? null : planData.maxDoubleDiamondProjects;
    } else {
      const isFreePlan = planData.name === "free" || planData.priceMonthly === 0;
      planLimit = isFreePlan ? FREE_PLAN_DOUBLE_DIAMOND_LIMIT : null;
    }
    const effectiveLimit = userCustomLimit !== null ? userCustomLimit : planLimit;
    if (effectiveLimit !== null && currentUsage >= effectiveLimit) {
      return res.status(403).json({
        error: `Voc\xEA atingiu o limite de ${effectiveLimit} projetos Double Diamond do seu plano. Fa\xE7a upgrade ou adquira o add-on Double Diamond Pro para criar mais projetos.`,
        code: "DOUBLE_DIAMOND_LIMIT_REACHED",
        currentUsage,
        limit: effectiveLimit,
        planName: planData?.displayName ?? (userData.subscriptionPlanId ? "Plano atual" : "Gratuito"),
        upgradeUrl: "/pricing"
      });
    }
    next();
  } catch (error) {
    console.error("Error checking Double Diamond limit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// server/aiService.ts
var openai = null;
var DesignThinkingAI = class {
  getSystemPrompt(context) {
    const phaseGuides = {
      1: {
        name: "Empatizar",
        description: "compreender profundamente as necessidades dos usu\xE1rios",
        tools: "mapas de empatia, personas, entrevistas, observa\xE7\xF5es",
        questions: "Quem s\xE3o seus usu\xE1rios? Quais suas necessidades, desejos e frustra\xE7\xF5es?"
      },
      2: {
        name: "Definir",
        description: "sintetizar insights para definir o problema principal",
        tools: "declara\xE7\xF5es de ponto de vista (POV), perguntas 'Como Podemos' (HMW)",
        questions: "Qual \xE9 o problema real que precisamos resolver? Como podemos reformular este desafio?"
      },
      3: {
        name: "Idear",
        description: "gerar solu\xE7\xF5es criativas e inovadoras",
        tools: "brainstorming, brainwriting, m\xE9todo das piores ideias",
        questions: "Que solu\xE7\xF5es podemos imaginar? Como podemos pensar fora da caixa?"
      },
      4: {
        name: "Prototipar",
        description: "construir representa\xE7\xF5es r\xE1pidas e simples das ideias",
        tools: "prot\xF3tipos de papel, wireframes, mockups, modelos 3D",
        questions: "Como podemos tornar nossa ideia tang\xEDvel? Que vers\xE3o m\xEDnima podemos testar?"
      },
      5: {
        name: "Testar",
        description: "validar prot\xF3tipos com usu\xE1rios reais",
        tools: "planos de teste, testes de usabilidade, entrevistas de feedback",
        questions: "O que os usu\xE1rios pensam da nossa solu\xE7\xE3o? Que melhorias precisamos fazer?"
      }
    };
    const currentPhaseInfo = phaseGuides[context.currentPhase] || phaseGuides[1];
    return `Voc\xEA \xE9 um mentor experiente em Design Thinking, especializado em guiar equipes atrav\xE9s do processo de inova\xE7\xE3o centrada no usu\xE1rio.

CONTEXTO ATUAL:
- Fase atual: ${currentPhaseInfo.name} (Fase ${context.currentPhase}/5)
- Objetivo da fase: ${currentPhaseInfo.description}
- Ferramentas principais: ${currentPhaseInfo.tools}
- Perguntas-chave: ${currentPhaseInfo.questions}
- N\xEDvel do usu\xE1rio: ${context.userLevel === "beginner" ? "Iniciante" : context.userLevel === "intermediate" ? "Intermedi\xE1rio" : "Avan\xE7ado"}

SUAS RESPONSABILIDADES:
1. Fornecer orienta\xE7\xF5es pr\xE1ticas e espec\xEDficas para a fase atual
2. Sugerir m\xE9todos, ferramentas e exerc\xEDcios apropriados
3. Fazer perguntas instigantes que guiem o pensamento criativo
4. Oferecer exemplos concretos e aplic\xE1veis
5. Adaptar a linguagem ao n\xEDvel de experi\xEAncia do usu\xE1rio
6. Motivar e encorajar a experimenta\xE7\xE3o

ESTILO DE COMUNICA\xC7\xC3O:
- Use um tom amig\xE1vel, encorajador e profissional
- Seja conciso mas informativo
- Fa\xE7a perguntas abertas que estimulem a reflex\xE3o
- Ofere\xE7a sugest\xF5es pr\xE1ticas e acion\xE1veis
- Use exemplos do mundo real quando relevante

FOCO ESPECIAL: ${context.focusArea ? `Concentre-se especialmente em ${context.focusArea}` : "Mantenha foco na fase atual"}.

Responda sempre em portugu\xEAs brasileiro de forma clara e did\xE1tica.`;
  }
  async chat(messages, context) {
    if (!openai) {
      const phaseGuides = {
        1: {
          name: "Empatizar",
          guidance: "foque em entender profundamente seus usu\xE1rios atrav\xE9s de mapas de empatia, personas, entrevistas e observa\xE7\xF5es. Procure descobrir suas necessidades, desejos e frustra\xE7\xF5es."
        },
        2: {
          name: "Definir",
          guidance: "sintetize os insights coletados para definir claramente o problema principal. Use declara\xE7\xF5es de ponto de vista (POV) e perguntas 'Como Podemos' (HMW)."
        },
        3: {
          name: "Idear",
          guidance: "gere o m\xE1ximo de solu\xE7\xF5es criativas poss\xEDvel. Use brainstorming, brainwriting e outras t\xE9cnicas para explorar diferentes abordagens."
        },
        4: {
          name: "Prototipar",
          guidance: "construa vers\xF5es simples e r\xE1pidas das suas melhores ideias. Podem ser prot\xF3tipos de papel, wireframes ou mockups b\xE1sicos."
        },
        5: {
          name: "Testar",
          guidance: "valide seus prot\xF3tipos com usu\xE1rios reais. Colete feedback, observe comportamentos e identifique melhorias necess\xE1rias."
        }
      };
      const currentPhase = phaseGuides[context.currentPhase] || phaseGuides[1];
      return `Ol\xE1! Sou seu mentor de Design Thinking. No momento, as funcionalidades avan\xE7adas de IA est\xE3o indispon\xEDveis, mas posso te orientar com base na metodologia.

Voc\xEA est\xE1 na Fase ${context.currentPhase} - ${currentPhase.name}. Nesta etapa, ${currentPhase.guidance}

Algumas dicas pr\xE1ticas:
\u2022 Use as ferramentas dispon\xEDveis na plataforma para documentar seu progresso
\u2022 Mantenha sempre o foco no usu\xE1rio e suas necessidades
\u2022 N\xE3o tenha pressa - cada fase tem sua import\xE2ncia no processo
\u2022 Colabore com sua equipe e compartilhe insights

Para funcionalidades avan\xE7adas de IA, configure a chave da API OpenAI nos Secrets do Replit. Posso te ajudar com mais alguma orienta\xE7\xE3o sobre Design Thinking?`;
    }
    try {
      const systemPrompt = this.getSystemPrompt(context);
      const openaiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: openaiMessages,
        max_tokens: 1e3
      });
      return response.choices[0].message.content || "Desculpe, n\xE3o consegui gerar uma resposta. Tente novamente.";
    } catch (error) {
      console.error("Erro no chat da IA:", error);
      throw new Error("Erro ao processar sua mensagem. Verifique se a chave da API OpenAI est\xE1 configurada corretamente.");
    }
  }
  async generateSuggestions(context, currentTopic) {
    if (!openai) {
      return [
        "Como podemos entender melhor nossos usu\xE1rios?",
        "Que ferramentas seriam mais \xFAteis nesta fase?",
        "Qual seria o pr\xF3ximo passo mais importante?"
      ];
    }
    try {
      const prompt = `Baseado no contexto de Design Thinking na fase ${context.currentPhase} e no t\xF3pico "${currentTopic}", gere 3 sugest\xF5es pr\xE1ticas e espec\xEDficas de pr\xF3ximos passos ou perguntas relevantes. Responda em formato JSON com um array de strings chamado "suggestions".`;
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: this.getSystemPrompt(context) },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });
      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error("Erro ao gerar sugest\xF5es:", error);
      return [
        "Como podemos entender melhor nossos usu\xE1rios?",
        "Que ferramentas seriam mais \xFAteis nesta fase?",
        "Qual seria o pr\xF3ximo passo mais importante?"
      ];
    }
  }
  async analyzeProjectPhase(projectData, currentPhase) {
    try {
      const prompt = `Analise os dados do projeto de Design Thinking e forne\xE7a insights sobre a fase ${currentPhase}. 

      Dados do projeto: ${JSON.stringify(projectData, null, 2)}

      Forne\xE7a sua an\xE1lise em formato JSON com:
      - "insights": array de strings com insights sobre o progresso
      - "nextSteps": array de strings com pr\xF3ximos passos recomendados  
      - "completeness": n\xFAmero de 0 a 100 indicando o percentual de completude da fase`;
      if (!openai) {
        return {
          insights: ["An\xE1lise n\xE3o dispon\xEDvel no momento"],
          nextSteps: ["Continue trabalhando nas ferramentas da fase atual"],
          completeness: 0
        };
      }
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: this.getSystemPrompt({ currentPhase, userLevel: "intermediate" }) },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });
      const result = JSON.parse(response.choices[0].message.content || '{"insights": [], "nextSteps": [], "completeness": 0}');
      return {
        insights: result.insights || [],
        nextSteps: result.nextSteps || [],
        completeness: Math.max(0, Math.min(100, result.completeness || 0))
      };
    } catch (error) {
      console.error("Erro ao analisar fase do projeto:", error);
      return {
        insights: ["An\xE1lise n\xE3o dispon\xEDvel no momento"],
        nextSteps: ["Continue trabalhando nas ferramentas da fase atual"],
        completeness: 0
      };
    }
  }
  async analyzeCompleteProject(analysisData) {
    if (!openai) {
      return this.generateMockAnalysis(analysisData);
    }
    try {
      const prompt = `Como especialista em Design Thinking, analise este projeto completo e forne\xE7a uma an\xE1lise abrangente.

DADOS DO PROJETO:
${JSON.stringify(analysisData, null, 2)}

Forne\xE7a uma an\xE1lise completa em formato JSON com a seguinte estrutura:

{
  "executiveSummary": "Resumo executivo do projeto (2-3 frases)",
  "maturityScore": numero de 1-10 indicando maturidade geral do projeto,
  "overallInsights": ["insight geral 1", "insight geral 2", "..."],
  "attentionPoints": ["ponto que precisa aten\xE7\xE3o 1", "ponto que precisa aten\xE7\xE3o 2", "..."],
  "priorityNextSteps": ["pr\xF3ximo passo priorit\xE1rio 1", "pr\xF3ximo passo priorit\xE1rio 2", "..."],
  "phaseAnalyses": [
    {
      "phase": 1,
      "phaseName": "Empatizar",
      "completeness": numero 0-100,
      "quality": numero 0-100,
      "insights": ["insight espec\xEDfico da fase"],
      "gaps": ["gap ou oportunidade perdida"],
      "recommendations": ["recomenda\xE7\xE3o espec\xEDfica"],
      "strengths": ["ponto forte da fase"]
    },
    // ... para cada uma das 5 fases
  ],
  "consistency": {
    "score": numero 0-100,
    "issues": ["problema de consist\xEAncia"],
    "strengths": ["ponto forte de consist\xEAncia"]
  },
  "alignment": {
    "problemSolutionAlignment": numero 0-100,
    "researchInsightsAlignment": numero 0-100,
    "comments": ["coment\xE1rio sobre alinhamento"]
  },
  "recommendations": {
    "immediate": ["a\xE7\xE3o imediata"],
    "shortTerm": ["a\xE7\xE3o de curto prazo"],
    "longTerm": ["a\xE7\xE3o de longo prazo"]
  }
}

CRIT\xC9RIOS DE AN\xC1LISE:
1. Completeness: Verifique se cada fase tem ferramentas suficientes e bem desenvolvidas
2. Quality: Avalie a profundidade e relev\xE2ncia dos insights e dados coletados
3. Consistency: Analise se h\xE1 fluxo l\xF3gico e consist\xEAncia entre as fases
4. Alignment: Verifique se as solu\xE7\xF5es propostas realmente abordam os problemas identificados
5. Research Quality: Avalie se a pesquisa de usu\xE1rio foi robusta o suficiente
6. Innovation: Considere o n\xEDvel de criatividade e inova\xE7\xE3o das solu\xE7\xF5es
7. Feasibility: Analise a viabilidade das solu\xE7\xF5es propostas
8. User-Centricity: Verifique se o foco no usu\xE1rio \xE9 mantido consistentemente

Seja espec\xEDfico, construtivo e ofere\xE7a insights acion\xE1veis. Responda em portugu\xEAs brasileiro.`;
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `Voc\xEA \xE9 um especialista s\xEAnior em Design Thinking com 15+ anos de experi\xEAncia, conhecido por an\xE1lises profundas e insights transformadores. Analise projetos com rigor acad\xEAmico mas linguagem acess\xEDvel.`
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3e3
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        executiveSummary: result.executiveSummary || "An\xE1lise do projeto n\xE3o p\xF4de ser completada.",
        maturityScore: Math.max(1, Math.min(10, result.maturityScore || 5)),
        overallInsights: result.overallInsights || ["An\xE1lise detalhada n\xE3o dispon\xEDvel no momento."],
        attentionPoints: result.attentionPoints || ["Verificar dados do projeto."],
        priorityNextSteps: result.priorityNextSteps || ["Continuar desenvolvimento do projeto."],
        phaseAnalyses: result.phaseAnalyses || this.getDefaultPhaseAnalyses(),
        consistency: {
          score: Math.max(0, Math.min(100, result.consistency?.score || 50)),
          issues: result.consistency?.issues || ["Dados insuficientes para an\xE1lise de consist\xEAncia."],
          strengths: result.consistency?.strengths || ["Projeto em desenvolvimento."]
        },
        alignment: {
          problemSolutionAlignment: Math.max(0, Math.min(100, result.alignment?.problemSolutionAlignment || 50)),
          researchInsightsAlignment: Math.max(0, Math.min(100, result.alignment?.researchInsightsAlignment || 50)),
          comments: result.alignment?.comments || ["Necess\xE1rio mais dados para avaliar alinhamento."]
        },
        recommendations: {
          immediate: result.recommendations?.immediate || ["Continuar coletando dados de usu\xE1rio."],
          shortTerm: result.recommendations?.shortTerm || ["Desenvolver ferramentas das fases atuais."],
          longTerm: result.recommendations?.longTerm || ["Planejar testes com usu\xE1rios reais."]
        }
      };
    } catch (error) {
      console.error("Erro ao analisar projeto completo:", error);
      return {
        executiveSummary: "N\xE3o foi poss\xEDvel gerar an\xE1lise completa neste momento. Verifique a configura\xE7\xE3o da API OpenAI.",
        maturityScore: 5,
        overallInsights: ["An\xE1lise autom\xE1tica indispon\xEDvel. Continue desenvolvendo o projeto seguindo as melhores pr\xE1ticas de Design Thinking."],
        attentionPoints: ["Servi\xE7o de an\xE1lise IA temporariamente indispon\xEDvel."],
        priorityNextSteps: ["Revisar dados do projeto e tentar an\xE1lise novamente."],
        phaseAnalyses: this.getDefaultPhaseAnalyses(),
        consistency: {
          score: 50,
          issues: ["An\xE1lise de consist\xEAncia indispon\xEDvel."],
          strengths: ["Continue seguindo a metodologia Design Thinking."]
        },
        alignment: {
          problemSolutionAlignment: 50,
          researchInsightsAlignment: 50,
          comments: ["An\xE1lise de alinhamento indispon\xEDvel no momento."]
        },
        recommendations: {
          immediate: ["Verificar configura\xE7\xF5es do sistema."],
          shortTerm: ["Continuar desenvolvimento seguindo metodologia."],
          longTerm: ["Considerar an\xE1lise manual com especialista."]
        }
      };
    }
  }
  generateMockAnalysis(analysisData) {
    const empathyDataCount = (analysisData.empathyMaps?.length || 0) + (analysisData.personas?.length || 0) + (analysisData.interviews?.length || 0) + (analysisData.observations?.length || 0);
    const defineDataCount = analysisData.povStatements?.length || 0;
    const ideateDataCount = analysisData.ideas?.length || 0;
    const prototypeDataCount = analysisData.prototypes?.length || 0;
    const testDataCount = (analysisData.testPlans?.length || 0) + (analysisData.testResults?.length || 0);
    const maturityScore = Math.min(
      10,
      Math.round(2 + empathyDataCount * 0.5 + defineDataCount * 0.8 + ideateDataCount * 0.3 + prototypeDataCount * 1.2 + testDataCount * 1.5)
    );
    const rawLang = analysisData.language || "pt-BR";
    const lang = rawLang.startsWith("en") ? "en" : rawLang.startsWith("es") ? "es" : rawLang.startsWith("fr") ? "fr" : "pt-BR";
    const criteriaList = analysisData.guidingCriteria || [];
    const criteriaCount = criteriaList?.length || 0;
    let criteriaCoveredCount = 0;
    let ideasWithCriteriaCount = 0;
    if (criteriaCount > 0) {
      const criteriaIds = criteriaList.map((c) => c.id);
      const coveredCriteria = /* @__PURE__ */ new Set();
      for (const idea of analysisData.ideas || []) {
        const ideaCriteriaIds = Array.isArray(idea.guidingCriteriaIds) ? idea.guidingCriteriaIds : [];
        if (ideaCriteriaIds.length > 0) {
          ideasWithCriteriaCount++;
        }
        for (const id of ideaCriteriaIds) {
          if (criteriaIds.includes(id)) {
            coveredCriteria.add(id);
          }
        }
      }
      criteriaCoveredCount = coveredCriteria.size;
    }
    const criteriaCoverage = criteriaCount === 0 ? 0 : Math.round(criteriaCoveredCount / criteriaCount * 100);
    const ideasUsingCriteriaRatio = ideateDataCount === 0 ? 0 : Math.round(ideasWithCriteriaCount / ideateDataCount * 100);
    const problemSolutionAlignment = criteriaCount === 0 ? ideateDataCount > 0 ? 60 : 40 : Math.max(
      20,
      Math.min(
        100,
        Math.round(criteriaCoverage * 0.6 + ideasUsingCriteriaRatio * 0.4)
      )
    );
    const researchInsightsAlignment = defineDataCount > 0 || empathyDataCount > 0 ? Math.min(100, 40 + defineDataCount * 10 + empathyDataCount * 5) : 35;
    const alignmentComments = [];
    if (criteriaCount === 0) {
      if (lang === "en") {
        alignmentComments.push(
          "No guiding criteria have been defined yet. Creating clear criteria in Phase 2 helps guide idea generation and prioritization."
        );
      } else if (lang === "es") {
        alignmentComments.push(
          "Todav\xEDa no se han definido criterios orientadores. Definir criterios claros en la Fase 2 ayuda a guiar la generaci\xF3n y priorizaci\xF3n de ideas."
        );
      } else if (lang === "fr") {
        alignmentComments.push(
          "Aucun crit\xE8re directeur n'a encore \xE9t\xE9 d\xE9fini. D\xE9finir des crit\xE8res clairs \xE0 la Phase 2 aide \xE0 orienter la g\xE9n\xE9ration et la priorisation des id\xE9es."
        );
      } else {
        alignmentComments.push(
          "Nenhum crit\xE9rio norteador foi definido ainda. Criar crit\xE9rios claros na Fase 2 ajuda a orientar a gera\xE7\xE3o e a prioriza\xE7\xE3o de ideias."
        );
      }
    } else {
      if (lang === "en") {
        alignmentComments.push(
          `${criteriaCoveredCount} of ${criteriaCount} guiding criteria have at least one associated idea.`
        );
      } else if (lang === "es") {
        alignmentComments.push(
          `${criteriaCoveredCount} de ${criteriaCount} criterios orientadores tienen al menos una idea asociada.`
        );
      } else if (lang === "fr") {
        alignmentComments.push(
          `${criteriaCoveredCount} sur ${criteriaCount} crit\xE8res directeurs ont au moins une id\xE9e associ\xE9e.`
        );
      } else {
        alignmentComments.push(
          `${criteriaCoveredCount} de ${criteriaCount} crit\xE9rios norteadores t\xEAm pelo menos uma ideia associada.`
        );
      }
      if (criteriaCoverage < 60) {
        if (lang === "en") {
          alignmentComments.push(
            "Several guiding criteria still have no directly linked ideas. Consider generating new ideas focused on these uncovered criteria."
          );
        } else if (lang === "es") {
          alignmentComments.push(
            "Varios criterios orientadores a\xFAn no tienen ideas vinculadas directamente. Considera generar nuevas ideas centradas en estos criterios no cubiertos."
          );
        } else if (lang === "fr") {
          alignmentComments.push(
            "Plusieurs crit\xE8res directeurs n'ont pas encore d'id\xE9es directement li\xE9es. Envisagez de g\xE9n\xE9rer de nouvelles id\xE9es centr\xE9es sur ces crit\xE8res non couverts."
          );
        } else {
          alignmentComments.push(
            "V\xE1rios crit\xE9rios norteadores ainda n\xE3o possuem ideias diretamente ligadas. Considere gerar novas ideias focadas nesses crit\xE9rios descobertos."
          );
        }
      } else {
        if (lang === "en") {
          alignmentComments.push(
            "Most guiding criteria are already covered by ideas, indicating good alignment between problem definition and ideation."
          );
        } else if (lang === "es") {
          alignmentComments.push(
            "La mayor\xEDa de los criterios orientadores ya est\xE1n cubiertos por ideas, lo que indica un buen alineamiento entre definici\xF3n de problema e ideaci\xF3n."
          );
        } else if (lang === "fr") {
          alignmentComments.push(
            "La plupart des crit\xE8res directeurs sont d\xE9j\xE0 couverts par des id\xE9es, ce qui indique un bon alignement entre d\xE9finition du probl\xE8me et id\xE9ation."
          );
        } else {
          alignmentComments.push(
            "A maior parte dos crit\xE9rios norteadores j\xE1 est\xE1 coberta por ideias, indicando bom alinhamento entre defini\xE7\xE3o de problema e idea\xE7\xE3o."
          );
        }
      }
      if (ideateDataCount > 0 && ideasUsingCriteriaRatio < 50) {
        if (lang === "en") {
          alignmentComments.push(
            "A significant portion of ideas is not yet explicitly linked to guiding criteria. Link each idea to at least one relevant criterion to make prioritization easier."
          );
        } else if (lang === "es") {
          alignmentComments.push(
            "Una parte relevante de las ideas a\xFAn no est\xE1 expl\xEDcitamente vinculada a criterios orientadores. Relaciona cada idea con al menos un criterio relevante para facilitar la priorizaci\xF3n."
          );
        } else if (lang === "fr") {
          alignmentComments.push(
            "Une partie importante des id\xE9es n'est pas encore explicitement li\xE9e aux crit\xE8res directeurs. Reliez chaque id\xE9e \xE0 au moins un crit\xE8re pertinent pour faciliter la priorisation."
          );
        } else {
          alignmentComments.push(
            "Uma parcela relevante das ideias ainda n\xE3o est\xE1 explicitamente ligada a crit\xE9rios norteadores. Relacione cada ideia a pelo menos um crit\xE9rio relevante para facilitar prioriza\xE7\xE3o."
          );
        }
      }
    }
    if (alignmentComments.length === 0) {
      if (lang === "en") {
        alignmentComments.push(
          "The project shows understanding of the methodology.",
          "Keep deepening user research."
        );
      } else if (lang === "es") {
        alignmentComments.push(
          "El proyecto demuestra entendimiento de la metodolog\xEDa.",
          "Contin\xFAa profundizando la investigaci\xF3n con usuarios."
        );
      } else if (lang === "fr") {
        alignmentComments.push(
          "Le projet montre une bonne compr\xE9hension de la m\xE9thodologie.",
          "Continuez \xE0 approfondir la recherche avec les utilisateurs."
        );
      } else {
        alignmentComments.push(
          "Projeto demonstra entendimento da metodologia.",
          "Continue aprofundando pesquisa com usu\xE1rios."
        );
      }
    }
    const overallInsights = [];
    if (lang === "en") {
      overallInsights.push(
        empathyDataCount > 2 ? "Excellent work in the Empathize phase" : "Expanding empathy research will bring more insights",
        "Keep following the structured Design Thinking methodology",
        "The collected data shows potential for innovative solutions"
      );
      if (criteriaCount > 0) {
        overallInsights.push(
          `You defined ${criteriaCount} guiding criteria in the Define phase, with ${criteriaCoveredCount} already covered by ideas.`
        );
      }
    } else if (lang === "es") {
      overallInsights.push(
        empathyDataCount > 2 ? "Excelente trabajo en la fase de Empatizar" : "Ampliar la investigaci\xF3n emp\xE1tica traer\xE1 m\xE1s insights",
        "Sigue la metodolog\xEDa estructurada de Design Thinking",
        "Los datos recogidos demuestran potencial para soluciones innovadoras"
      );
      if (criteriaCount > 0) {
        overallInsights.push(
          `Se definieron ${criteriaCount} criterios orientadores en la fase Definir, con ${criteriaCoveredCount} de ellos ya cubiertos por ideas.`
        );
      }
    } else if (lang === "fr") {
      overallInsights.push(
        empathyDataCount > 2 ? "Excellent travail dans la phase Empathiser" : "Approfondir la recherche empathique apportera plus d'insights",
        "Continuez \xE0 suivre la m\xE9thodologie structur\xE9e de Design Thinking",
        "Les donn\xE9es collect\xE9es montrent un potentiel pour des solutions innovantes"
      );
      if (criteriaCount > 0) {
        overallInsights.push(
          `${criteriaCount} crit\xE8res directeurs ont \xE9t\xE9 d\xE9finis dans la phase D\xE9finir, dont ${criteriaCoveredCount} d\xE9j\xE0 couverts par des id\xE9es.`
        );
      }
    } else {
      overallInsights.push(
        empathyDataCount > 2 ? "Excelente trabalho na fase de Empatia" : "Ampliar pesquisa emp\xE1tica trar\xE1 mais insights",
        "Continue seguindo a metodologia estruturada do Design Thinking",
        "Dados coletados demonstram potencial para solu\xE7\xF5es inovadoras"
      );
      if (criteriaCount > 0) {
        overallInsights.push(
          `Foram definidos ${criteriaCount} crit\xE9rios norteadores na fase Definir, com ${criteriaCoveredCount} deles j\xE1 cobertos por ideias.`
        );
      }
    }
    const attentionPoints = [];
    if (lang === "en") {
      attentionPoints.push(
        empathyDataCount === 0 ? "More user data needs to be collected" : "Consider diversifying research methods",
        defineDataCount === 0 ? "Clearly define the core problem" : "Refine the problem definition",
        "To unlock full analysis, configure the OpenAI API key"
      );
      if (criteriaCount > 0 && criteriaCoverage < 70) {
        attentionPoints.push(
          "Not all guiding criteria have associated ideas. Check coverage gaps between criteria and ideation."
        );
      }
    } else if (lang === "es") {
      attentionPoints.push(
        empathyDataCount === 0 ? "Es necesario recoger m\xE1s datos de usuarios" : "Considera diversificar los m\xE9todos de investigaci\xF3n",
        defineDataCount === 0 ? "Definir claramente el problema central" : "Refinar la definici\xF3n del problema",
        "Para un an\xE1lisis completo, configura la clave de la API de OpenAI"
      );
      if (criteriaCount > 0 && criteriaCoverage < 70) {
        attentionPoints.push(
          "No todos los criterios orientadores tienen ideas asociadas. Eval\xFAa las brechas de cobertura entre criterios e ideaci\xF3n."
        );
      }
    } else if (lang === "fr") {
      attentionPoints.push(
        empathyDataCount === 0 ? "Il est n\xE9cessaire de collecter davantage de donn\xE9es utilisateurs" : "Envisagez de diversifier les m\xE9thodes de recherche",
        defineDataCount === 0 ? "D\xE9finir clairement le probl\xE8me central" : "Affiner la d\xE9finition du probl\xE8me",
        "Pour une analyse compl\xE8te, configurez la cl\xE9 d'API OpenAI"
      );
      if (criteriaCount > 0 && criteriaCoverage < 70) {
        attentionPoints.push(
          "Tous les crit\xE8res directeurs n'ont pas d'id\xE9es associ\xE9es. \xC9valuez les \xE9carts de couverture entre crit\xE8res et id\xE9ation."
        );
      }
    } else {
      attentionPoints.push(
        empathyDataCount === 0 ? "Necess\xE1rio coletar mais dados de usu\xE1rios" : "Considerar diversificar m\xE9todos de pesquisa",
        defineDataCount === 0 ? "Definir claramente o problema central" : "Refinar defini\xE7\xE3o do problema",
        "Para an\xE1lise completa, configure a chave da API OpenAI"
      );
      if (criteriaCount > 0 && criteriaCoverage < 70) {
        attentionPoints.push(
          "Nem todos os crit\xE9rios norteadores possuem ideias associadas. Avalie lacunas de cobertura entre crit\xE9rios e idea\xE7\xE3o."
        );
      }
    }
    const priorityNextSteps = [];
    if (lang === "en") {
      priorityNextSteps.push(
        analysisData.project?.currentPhase === 1 ? "Finish the tools of the Empathize phase" : "Move on to the next phase",
        "Document all collected insights",
        "Review progress with the team regularly"
      );
      if (criteriaCount > 0) {
        priorityNextSteps.push(
          "Map which guiding criteria still have no associated ideas and plan ideation sessions to cover them."
        );
      } else {
        priorityNextSteps.push(
          "Define 3 to 7 clear guiding criteria in Phase 2 to guide idea generation and prioritization."
        );
      }
    } else if (lang === "es") {
      priorityNextSteps.push(
        analysisData.project?.currentPhase === 1 ? "Finalizar las herramientas de la fase Empatizar" : "Avanzar a la siguiente fase",
        "Documentar todos los insights recogidos",
        "Revisar el progreso con el equipo regularmente"
      );
      if (criteriaCount > 0) {
        priorityNextSteps.push(
          "Mapear qu\xE9 criterios orientadores a\xFAn no tienen ideas asociadas y planear sesiones de ideaci\xF3n para cubrirlos."
        );
      } else {
        priorityNextSteps.push(
          "Definir de 3 a 7 criterios orientadores claros en la Fase 2 para guiar la generaci\xF3n y priorizaci\xF3n de ideas."
        );
      }
    } else if (lang === "fr") {
      priorityNextSteps.push(
        analysisData.project?.currentPhase === 1 ? "Finaliser les outils de la phase Empathiser" : "Passer \xE0 la phase suivante",
        "Documenter tous les insights collect\xE9s",
        "Revoir r\xE9guli\xE8rement l'avancement avec l'\xE9quipe"
      );
      if (criteriaCount > 0) {
        priorityNextSteps.push(
          "Identifier quels crit\xE8res directeurs n'ont pas encore d'id\xE9es associ\xE9es et planifier des sessions d'id\xE9ation cibl\xE9es pour les couvrir."
        );
      } else {
        priorityNextSteps.push(
          "D\xE9finir de 3 \xE0 7 crit\xE8res directeurs clairs \xE0 la Phase 2 pour guider la g\xE9n\xE9ration et la priorisation des id\xE9es."
        );
      }
    } else {
      priorityNextSteps.push(
        analysisData.project?.currentPhase === 1 ? "Finalizar ferramentas da fase Empatizar" : "Avan\xE7ar para pr\xF3xima fase",
        "Documentar todos os insights coletados",
        "Revisar progresso com equipe regularmente"
      );
      if (criteriaCount > 0) {
        priorityNextSteps.push(
          "Mapear quais crit\xE9rios norteadores ainda n\xE3o possuem ideias associadas e planejar sess\xF5es de idea\xE7\xE3o direcionadas para cobri-los."
        );
      } else {
        priorityNextSteps.push(
          "Definir de 3 a 7 crit\xE9rios norteadores claros na Fase 2 para orientar a gera\xE7\xE3o e prioriza\xE7\xE3o de ideias."
        );
      }
    }
    let executiveSummary;
    const projectName = analysisData.project?.name || "DTTools";
    const phase = analysisData.project?.currentPhase || 1;
    if (lang === "en") {
      const empathySentence = empathyDataCount > 0 ? "It shows a good basis of empathy research." : "It is recommended to expand user research.";
      executiveSummary = `Project ${projectName} is in phase ${phase} of the Design Thinking process. ${empathySentence} Analysis based on demonstration data.`;
    } else if (lang === "es") {
      const empathySentence = empathyDataCount > 0 ? "Demuestra una buena base de investigaci\xF3n emp\xE1tica." : "Se recomienda ampliar la investigaci\xF3n con usuarios.";
      executiveSummary = `El proyecto ${projectName} est\xE1 en la fase ${phase} del proceso de Design Thinking. ${empathySentence} An\xE1lisis basado en datos demostrativos.`;
    } else if (lang === "fr") {
      const empathySentence = empathyDataCount > 0 ? "Il montre une bonne base de recherche empathique." : "Il est recommand\xE9 d'approfondir la recherche avec les utilisateurs.";
      executiveSummary = `Le projet ${projectName} est \xE0 la phase ${phase} du processus de Design Thinking. ${empathySentence} Analyse bas\xE9e sur des donn\xE9es de d\xE9monstration.`;
    } else {
      const empathySentence = empathyDataCount > 0 ? "Demonstra boa base de pesquisa emp\xE1tica." : "Recomenda-se ampliar pesquisa com usu\xE1rios.";
      executiveSummary = `Projeto ${projectName} est\xE1 na fase ${phase} do Design Thinking. ${empathySentence} An\xE1lise baseada em dados demonstrativos.`;
    }
    let consistencyIssues;
    let consistencyStrengths;
    if (lang === "en") {
      consistencyIssues = empathyDataCount < 2 ? ["More empathy data is needed"] : ["Keep collecting feedback"];
      consistencyStrengths = ["Following the Design Thinking methodology", "Project structure is well organized"];
    } else if (lang === "es") {
      consistencyIssues = empathyDataCount < 2 ? ["Es necesario m\xE1s datos de empat\xEDa"] : ["Seguir recopilando feedback"];
      consistencyStrengths = ["Siguiendo la metodolog\xEDa de Design Thinking", "Estructura del proyecto bien organizada"];
    } else if (lang === "fr") {
      consistencyIssues = empathyDataCount < 2 ? ["Davantage de donn\xE9es d'empathie sont n\xE9cessaires"] : ["Continuer \xE0 collecter des retours"];
      consistencyStrengths = ["Suivi de la m\xE9thodologie Design Thinking", "Structure de projet bien organis\xE9e"];
    } else {
      consistencyIssues = empathyDataCount < 2 ? ["Necess\xE1rio mais dados de empatia"] : ["Continuar coletando feedback"];
      consistencyStrengths = ["Seguindo metodologia Design Thinking", "Estrutura de projeto bem organizada"];
    }
    let immediateRecommendations;
    let shortTermRecommendations;
    let longTermRecommendations;
    if (lang === "en") {
      immediateRecommendations = [
        empathyDataCount === 0 ? "Create empathy maps and personas" : "Analyze the data that has been collected",
        "Document key insights",
        criteriaCount > 0 ? "Review whether each guiding criterion has at least one associated idea." : "Create guiding criteria that reflect the main needs and objectives of the project."
      ];
      shortTermRecommendations = [
        "Move forward to the next Design Thinking phase",
        "Validate hypotheses with more users",
        "Use guiding criteria as a filter to prioritize ideas most aligned with the project strategy."
      ];
      longTermRecommendations = [
        "Implement a continuous feedback process",
        "Consider specialized consulting for advanced analyses",
        "Monitor over time whether new ideas remain aligned with the defined guiding criteria."
      ];
    } else if (lang === "es") {
      immediateRecommendations = [
        empathyDataCount === 0 ? "Crear mapas de empat\xEDa y personas" : "Analizar los datos recogidos",
        "Documentar los insights principales",
        criteriaCount > 0 ? "Revisar si cada criterio orientador tiene al menos una idea asociada." : "Crear criterios orientadores que reflejen las principales necesidades y objetivos del proyecto."
      ];
      shortTermRecommendations = [
        "Avanzar a la siguiente fase de Design Thinking",
        "Validar hip\xF3tesis con m\xE1s usuarios",
        "Usar los criterios orientadores como filtro para priorizar las ideas m\xE1s alineadas con la estrategia del proyecto."
      ];
      longTermRecommendations = [
        "Implementar un proceso continuo de feedback",
        "Considerar consultor\xEDa especializada para an\xE1lisis avanzados",
        "Monitorear a lo largo del tiempo si las nuevas ideas siguen alineadas con los criterios orientadores definidos."
      ];
    } else if (lang === "fr") {
      immediateRecommendations = [
        empathyDataCount === 0 ? "Cr\xE9er des cartes d'empathie et des personas" : "Analyser les donn\xE9es collect\xE9es",
        "Documenter les principaux insights",
        criteriaCount > 0 ? "V\xE9rifier si chaque crit\xE8re directeur a au moins une id\xE9e associ\xE9e." : "Cr\xE9er des crit\xE8res directeurs qui refl\xE8tent les principaux besoins et objectifs du projet."
      ];
      shortTermRecommendations = [
        "Avancer vers la prochaine phase du Design Thinking",
        "Valider les hypoth\xE8ses avec davantage d'utilisateurs",
        "Utiliser les crit\xE8res directeurs comme filtre pour prioriser les id\xE9es les plus align\xE9es sur la strat\xE9gie du projet."
      ];
      longTermRecommendations = [
        "Mettre en place un processus de feedback continu",
        "Envisager un accompagnement sp\xE9cialis\xE9 pour des analyses avanc\xE9es",
        "Suivre dans le temps si les nouvelles id\xE9es restent align\xE9es avec les crit\xE8res directeurs d\xE9finis."
      ];
    } else {
      immediateRecommendations = [
        empathyDataCount === 0 ? "Criar mapas de empatia e personas" : "Analisar dados coletados",
        "Documentar insights principais",
        criteriaCount > 0 ? "Revisar se cada crit\xE9rio norteador possui ao menos uma ideia associada." : "Criar crit\xE9rios norteadores que reflitam as principais necessidades e objetivos do projeto."
      ];
      shortTermRecommendations = [
        "Avan\xE7ar para pr\xF3xima fase do Design Thinking",
        "Validar hip\xF3teses com mais usu\xE1rios",
        "Usar os crit\xE9rios norteadores como filtro para priorizar ideias mais alinhadas \xE0 estrat\xE9gia do projeto."
      ];
      longTermRecommendations = [
        "Implementar processo cont\xEDnuo de feedback",
        "Considerar consultoria especializada para an\xE1lises avan\xE7adas",
        "Monitorar ao longo do tempo se novas ideias continuam alinhadas aos crit\xE9rios norteadores definidos."
      ];
    }
    return {
      executiveSummary,
      maturityScore,
      overallInsights,
      attentionPoints,
      priorityNextSteps,
      phaseAnalyses: this.generateSmartPhaseAnalyses(empathyDataCount, defineDataCount, ideateDataCount, prototypeDataCount, testDataCount, lang),
      consistency: {
        score: Math.min(100, 40 + empathyDataCount * 10 + defineDataCount * 15),
        issues: consistencyIssues,
        strengths: consistencyStrengths
      },
      alignment: {
        problemSolutionAlignment,
        researchInsightsAlignment,
        comments: alignmentComments
      },
      recommendations: {
        immediate: immediateRecommendations,
        shortTerm: shortTermRecommendations,
        longTerm: longTermRecommendations
      }
    };
  }
  generateSmartPhaseAnalyses(empathy, define, ideate, prototype, test, lang) {
    const phaseLang = lang === "en" || lang === "es" || lang === "fr" ? lang : "pt-BR";
    return [
      {
        phase: 1,
        phaseName: phaseLang === "en" ? "Empathize" : phaseLang === "es" ? "Empatizar" : phaseLang === "fr" ? "Empathiser" : "Empatizar",
        completeness: empathy === 0 ? 0 : Math.min(100, empathy * 25),
        quality: empathy === 0 ? 0 : empathy > 2 ? 85 : 65,
        insights: empathy > 0 ? [
          phaseLang === "en" ? `${empathy} empathy tools created` : phaseLang === "es" ? `${empathy} herramientas de empat\xEDa creadas` : phaseLang === "fr" ? `${empathy} outils d'empathie cr\xE9\xE9s` : `${empathy} ferramentas de empatia criadas`,
          phaseLang === "en" ? "Solid basis to understand users" : phaseLang === "es" ? "Base s\xF3lida para entender a los usuarios" : phaseLang === "fr" ? "Base solide pour comprendre les utilisateurs" : "Base s\xF3lida para entender usu\xE1rios"
        ] : [
          phaseLang === "en" ? "Phase started, keep collecting data" : phaseLang === "es" ? "Fase iniciada, seguir recopilando datos" : phaseLang === "fr" ? "Phase commenc\xE9e, continuer \xE0 collecter des donn\xE9es" : "Fase iniciada, continuar coletando dados"
        ],
        gaps: empathy < 2 ? [
          phaseLang === "en" ? "Expand empathy research methods" : phaseLang === "es" ? "Ampliar los m\xE9todos de investigaci\xF3n emp\xE1tica" : phaseLang === "fr" ? "D\xE9velopper les m\xE9thodes de recherche empathique" : "Ampliar m\xE9todos de pesquisa emp\xE1tica"
        ] : [
          phaseLang === "en" ? "Consider additional interviews" : phaseLang === "es" ? "Considerar entrevistas adicionales" : phaseLang === "fr" ? "Envisager des entretiens suppl\xE9mentaires" : "Considerar entrevistas adicionais"
        ],
        recommendations: empathy === 0 ? [
          phaseLang === "en" ? "Start with empathy maps" : phaseLang === "es" ? "Comenzar con mapas de empat\xEDa" : phaseLang === "fr" ? "Commencer par des cartes d'empathie" : "Come\xE7ar com mapas de empatia"
        ] : [
          phaseLang === "en" ? "Analyze patterns in collected data" : phaseLang === "es" ? "Analizar patrones en los datos recogidos" : phaseLang === "fr" ? "Analyser les motifs dans les donn\xE9es collect\xE9es" : "Analisar padr\xF5es nos dados coletados"
        ],
        strengths: empathy > 0 ? [
          phaseLang === "en" ? "Empathy data collected" : phaseLang === "es" ? "Datos emp\xE1ticos recogidos" : phaseLang === "fr" ? "Donn\xE9es empathiques collect\xE9es" : "Dados emp\xE1ticos coletados"
        ] : [
          phaseLang === "en" ? "Structure ready for research" : phaseLang === "es" ? "Estructura preparada para la investigaci\xF3n" : phaseLang === "fr" ? "Structure pr\xEAte pour la recherche" : "Estrutura preparada para pesquisa"
        ]
      },
      {
        phase: 2,
        phaseName: phaseLang === "en" ? "Define" : phaseLang === "es" ? "Definir" : phaseLang === "fr" ? "D\xE9finir" : "Definir",
        completeness: define === 0 ? 0 : Math.min(100, define * 30),
        quality: define === 0 ? 0 : 70,
        insights: define > 0 ? [
          phaseLang === "en" ? "The problem is starting to be defined" : phaseLang === "es" ? "El problema empieza a definirse" : phaseLang === "fr" ? "Le probl\xE8me commence \xE0 \xEAtre d\xE9fini" : "Problema come\xE7ando a ser definido"
        ] : [
          phaseLang === "en" ? "Waiting for problem definition" : phaseLang === "es" ? "A la espera de la definici\xF3n del problema" : phaseLang === "fr" ? "En attente de la d\xE9finition du probl\xE8me" : "Aguardando defini\xE7\xE3o do problema"
        ],
        gaps: define === 0 ? [
          phaseLang === "en" ? "Create POV statements" : phaseLang === "es" ? "Crear declaraciones POV" : phaseLang === "fr" ? "Cr\xE9er des d\xE9clarations POV" : "Criar declara\xE7\xF5es POV"
        ] : [
          phaseLang === "en" ? "Expand the problem definition" : phaseLang === "es" ? "Ampliar la definici\xF3n del problema" : phaseLang === "fr" ? "\xC9largir la d\xE9finition du probl\xE8me" : "Expandir defini\xE7\xE3o do problema"
        ],
        recommendations: [
          phaseLang === "en" ? "Synthesize insights from the previous phase" : phaseLang === "es" ? "Sintetizar los insights de la fase anterior" : phaseLang === "fr" ? "Synth\xE9tiser les insights de la phase pr\xE9c\xE9dente" : "Sintetizar insights da fase anterior"
        ],
        strengths: define > 0 ? [
          phaseLang === "en" ? "Definition process started" : phaseLang === "es" ? "Proceso de definici\xF3n iniciado" : phaseLang === "fr" ? "Processus de d\xE9finition lanc\xE9" : "Processo de defini\xE7\xE3o iniciado"
        ] : [
          phaseLang === "en" ? "Ready to define the problem" : phaseLang === "es" ? "Preparado para definir el problema" : phaseLang === "fr" ? "Pr\xEAt \xE0 d\xE9finir le probl\xE8me" : "Preparado para definir problema"
        ]
      },
      {
        phase: 3,
        phaseName: phaseLang === "en" ? "Ideate" : phaseLang === "es" ? "Idear" : phaseLang === "fr" ? "Id\xE9er" : "Idear",
        completeness: ideate === 0 ? 0 : Math.min(100, ideate * 20),
        quality: ideate === 0 ? 0 : 60,
        insights: ideate > 0 ? [
          phaseLang === "en" ? "Creative process started" : phaseLang === "es" ? "Proceso creativo iniciado" : phaseLang === "fr" ? "Processus cr\xE9atif lanc\xE9" : "Processo criativo iniciado"
        ] : [
          phaseLang === "en" ? "Waiting for ideation" : phaseLang === "es" ? "A la espera de ideaci\xF3n" : phaseLang === "fr" ? "En attente d'id\xE9ation" : "Aguardando idea\xE7\xE3o"
        ],
        gaps: ideate === 0 ? [
          phaseLang === "en" ? "Generate initial ideas" : phaseLang === "es" ? "Generar ideas iniciales" : phaseLang === "fr" ? "G\xE9n\xE9rer des id\xE9es initiales" : "Gerar ideias iniciais"
        ] : [
          phaseLang === "en" ? "Generate more diverse ideas" : phaseLang === "es" ? "Generar m\xE1s diversidad de ideas" : phaseLang === "fr" ? "G\xE9n\xE9rer davantage d'id\xE9es diverses" : "Gerar mais diversidade de ideias"
        ],
        recommendations: [
          phaseLang === "en" ? "Use brainstorming techniques" : phaseLang === "es" ? "Usar t\xE9cnicas de brainstorming" : phaseLang === "fr" ? "Utiliser des techniques de brainstorming" : "Usar t\xE9cnicas de brainstorming"
        ],
        strengths: ideate > 0 ? [
          phaseLang === "en" ? "Creativity applied" : phaseLang === "es" ? "Creatividad aplicada" : phaseLang === "fr" ? "Cr\xE9ativit\xE9 appliqu\xE9e" : "Criatividade aplicada"
        ] : [
          phaseLang === "en" ? "Creative potential" : phaseLang === "es" ? "Potencial creativo" : phaseLang === "fr" ? "Potentiel cr\xE9atif" : "Potencial criativo"
        ]
      },
      {
        phase: 4,
        phaseName: phaseLang === "en" ? "Prototype" : phaseLang === "es" ? "Prototipar" : phaseLang === "fr" ? "Prototyper" : "Prototipar",
        completeness: prototype === 0 ? 0 : Math.min(100, prototype * 25),
        quality: prototype === 0 ? 0 : 65,
        insights: prototype > 0 ? [
          phaseLang === "en" ? "Ideas are being materialized" : phaseLang === "es" ? "Las ideas est\xE1n siendo materializadas" : phaseLang === "fr" ? "Les id\xE9es sont en cours de mat\xE9rialisation" : "Ideias sendo materializadas"
        ] : [
          phaseLang === "en" ? "Waiting for prototyping" : phaseLang === "es" ? "A la espera de prototipado" : phaseLang === "fr" ? "En attente de prototypage" : "Aguardando prototipagem"
        ],
        gaps: prototype === 0 ? [
          phaseLang === "en" ? "Create first prototypes" : phaseLang === "es" ? "Crear los primeros prototipos" : phaseLang === "fr" ? "Cr\xE9er les premiers prototypes" : "Criar primeiros prot\xF3tipos"
        ] : [
          phaseLang === "en" ? "Create testable prototypes" : phaseLang === "es" ? "Crear prototipos que puedan probarse" : phaseLang === "fr" ? "Cr\xE9er des prototypes testables" : "Criar prot\xF3tipos test\xE1veis"
        ],
        recommendations: [
          phaseLang === "en" ? "Focus on quick prototypes" : phaseLang === "es" ? "Enfocarse en prototipos r\xE1pidos" : phaseLang === "fr" ? "Se concentrer sur des prototypes rapides" : "Focar em prot\xF3tipos r\xE1pidos"
        ],
        strengths: prototype > 0 ? [
          phaseLang === "en" ? "Tangible thinking" : phaseLang === "es" ? "Pensamiento tangible" : phaseLang === "fr" ? "Pens\xE9e tangible" : "Pensamento tang\xEDvel"
        ] : [
          phaseLang === "en" ? "Ready to prototype" : phaseLang === "es" ? "Preparado para prototipar" : phaseLang === "fr" ? "Pr\xEAt \xE0 prototyper" : "Preparado para prototipar"
        ]
      },
      {
        phase: 5,
        phaseName: phaseLang === "en" ? "Test" : phaseLang === "es" ? "Testar" : phaseLang === "fr" ? "Tester" : "Testar",
        completeness: test === 0 ? 0 : Math.min(100, test * 30),
        quality: test === 0 ? 0 : 70,
        insights: test > 0 ? [
          phaseLang === "en" ? "User testing has started" : phaseLang === "es" ? "Se ha iniciado la validaci\xF3n con usuarios" : phaseLang === "fr" ? "La validation avec des utilisateurs a commenc\xE9" : "Valida\xE7\xE3o com usu\xE1rios iniciada"
        ] : [
          phaseLang === "en" ? "Waiting for tests" : phaseLang === "es" ? "A la espera de pruebas" : phaseLang === "fr" ? "En attente de tests" : "Aguardando testes"
        ],
        gaps: test === 0 ? [
          phaseLang === "en" ? "Plan first user tests" : phaseLang === "es" ? "Planificar las primeras pruebas con usuarios" : phaseLang === "fr" ? "Planifier les premiers tests utilisateurs" : "Planejar primeiros testes com usu\xE1rios"
        ] : [
          phaseLang === "en" ? "Test with real users" : phaseLang === "es" ? "Probar con usuarios reales" : phaseLang === "fr" ? "Tester avec de vrais utilisateurs" : "Testar com usu\xE1rios reais"
        ],
        recommendations: [
          phaseLang === "en" ? "Plan testing sessions" : phaseLang === "es" ? "Planificar sesiones de prueba" : phaseLang === "fr" ? "Planifier des sessions de test" : "Planejar sess\xF5es de teste"
        ],
        strengths: test > 0 ? [
          phaseLang === "en" ? "Focus on validation" : phaseLang === "es" ? "Enfoque en la validaci\xF3n" : phaseLang === "fr" ? "Focus sur la validation" : "Foco na valida\xE7\xE3o"
        ] : [
          phaseLang === "en" ? "Structure ready for testing" : phaseLang === "es" ? "Estructura preparada para pruebas" : phaseLang === "fr" ? "Structure pr\xEAte pour les tests" : "Estrutura para testes"
        ]
      }
    ];
  }
  getDefaultPhaseAnalyses() {
    const phases = [
      { phase: 1, name: "Empatizar" },
      { phase: 2, name: "Definir" },
      { phase: 3, name: "Idear" },
      { phase: 4, name: "Prototipar" },
      { phase: 5, name: "Testar" }
    ];
    return phases.map((p) => ({
      phase: p.phase,
      phaseName: p.name,
      completeness: 50,
      quality: 50,
      insights: [`Fase ${p.name} em desenvolvimento.`],
      gaps: ["Dados insuficientes para an\xE1lise detalhada."],
      recommendations: [`Continue trabalhando nas ferramentas da fase ${p.name}.`],
      strengths: ["Seguindo metodologia correta."]
    }));
  }
};
var designThinkingAI = new DesignThinkingAI();

// server/routes.ts
init_geminiService();

// server/pptxService.ts
init_storage();
import pptxgen from "pptxgenjs";
import { jsPDF } from "jspdf";
var PPTXService = class {
  constructor() {
  }
  setupMasterSlide(pres) {
    pres.defineSlideMaster({
      title: "DTTools_MASTER",
      background: { color: "FFFFFF" },
      // White background
      objects: [
        // Header logo "Design Thinking Tools" no canto superior esquerdo
        {
          text: {
            text: "Design Thinking ",
            options: {
              x: 0.3,
              y: 0.2,
              w: 4,
              h: 0.4,
              color: "1E3A8A",
              // Azul escuro #1E3A8A
              fontSize: 16,
              fontFace: "Arial",
              bold: true
            }
          }
        },
        {
          text: {
            text: "Tools",
            options: {
              x: 2.2,
              y: 0.2,
              w: 1,
              h: 0.4,
              color: "10B981",
              // Verde #10B981
              fontSize: 16,
              fontFace: "Arial",
              bold: true
            }
          }
        },
        // Footer com link para o site (centralizado)
        {
          text: {
            text: "https://www.designthinkingtools.com",
            options: {
              x: 3,
              y: 7,
              w: 4,
              h: 0.3,
              color: "2563EB",
              // Azul link #2563EB
              fontSize: 10,
              fontFace: "Arial",
              align: "center"
            }
          }
        }
      ]
    });
  }
  addTitleSlide(pres, projectName, description = "") {
    const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
    slide.addText(projectName, {
      x: 1,
      y: 2,
      w: 8,
      h: 1.5,
      fontSize: 36,
      bold: true,
      color: "1E40AF",
      align: "center"
    });
    if (description) {
      slide.addText(description, {
        x: 1,
        y: 3.5,
        w: 8,
        h: 1,
        fontSize: 16,
        color: "333333",
        align: "center"
      });
    }
    slide.addText("Processo de Design Thinking", {
      x: 1,
      y: 4.5,
      w: 8,
      h: 0.8,
      fontSize: 14,
      color: "666666",
      align: "center",
      italic: true
    });
    const phases = ["Empatizar", "Definir", "Idear", "Prototipar", "Testar"];
    phases.forEach((phase, index) => {
      slide.addText(`${index + 1}. ${phase}`, {
        x: 1 + index * 1.6,
        y: 5.5,
        w: 1.5,
        h: 0.5,
        fontSize: 12,
        color: "1E40AF",
        align: "center",
        bold: true
      });
    });
  }
  addPhaseOverviewSlide(pres, phase, title, description) {
    const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
    slide.addText(`Fase ${phase}: ${title}`, {
      x: 1,
      y: 1.2,
      w: 8,
      h: 1,
      fontSize: 28,
      bold: true,
      color: "1E40AF"
    });
    slide.addText(description, {
      x: 1,
      y: 2.5,
      w: 8,
      h: 1.5,
      fontSize: 16,
      color: "333333"
    });
  }
  addEmpathyMapSlide(pres, empathyMap) {
    const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
    slide.addText(`Mapa de Empatia: ${empathyMap.title}`, {
      x: 1,
      y: 1.2,
      w: 8,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: "1E40AF"
    });
    const quadrants = [
      { title: "DIZ", data: empathyMap.says, x: 1, y: 2.2, color: "E8F4FA" },
      { title: "PENSA", data: empathyMap.thinks, x: 5, y: 2.2, color: "E2E6ED" },
      { title: "FAZ", data: empathyMap.does, x: 1, y: 4.7, color: "FFFBEB" },
      { title: "SENTE", data: empathyMap.feels, x: 5, y: 4.7, color: "FFF2EC" }
    ];
    quadrants.forEach((quadrant) => {
      slide.addShape("rect", {
        x: quadrant.x,
        y: quadrant.y,
        w: 3.5,
        h: 2.2,
        fill: { color: quadrant.color },
        line: { color: "CCCCCC", width: 1 }
      });
      slide.addText(quadrant.title, {
        x: quadrant.x,
        y: quadrant.y + 0.1,
        w: 3.5,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: "333333",
        align: "center"
      });
      const items = quadrant.data.slice(0, 3);
      items.forEach((item, index) => {
        slide.addText(`\u2022 ${item}`, {
          x: quadrant.x + 0.2,
          y: quadrant.y + 0.6 + index * 0.4,
          w: 3.1,
          h: 0.3,
          fontSize: 11,
          color: "333333"
        });
      });
    });
  }
  addPersonasSlide(pres, personas2) {
    const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
    slide.addText("Personas do Projeto", {
      x: 1,
      y: 1.2,
      w: 8,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: "1E40AF"
    });
    personas2.slice(0, 2).forEach((persona, index) => {
      const xPos = index === 0 ? 1 : 5;
      slide.addShape("rect", {
        x: xPos,
        y: 2.2,
        w: 3.5,
        h: 4,
        fill: { color: "F8F9FA" },
        line: { color: "CCCCCC", width: 1 }
      });
      slide.addText(persona.name, {
        x: xPos + 0.2,
        y: 2.4,
        w: 3.1,
        h: 0.5,
        fontSize: 16,
        bold: true,
        color: "1E40AF"
      });
      slide.addText(`${persona.age} anos \u2022 ${persona.occupation}`, {
        x: xPos + 0.2,
        y: 2.9,
        w: 3.1,
        h: 0.3,
        fontSize: 12,
        color: "666666"
      });
      if (persona.bio) {
        slide.addText(persona.bio.slice(0, 150) + "...", {
          x: xPos + 0.2,
          y: 3.3,
          w: 3.1,
          h: 1,
          fontSize: 10,
          color: "333333"
        });
      }
      if (persona.goals && Array.isArray(persona.goals) && persona.goals.length > 0) {
        slide.addText("Objetivos:", {
          x: xPos + 0.2,
          y: 4.5,
          w: 3.1,
          h: 0.3,
          fontSize: 11,
          bold: true,
          color: "1E40AF"
        });
        persona.goals.slice(0, 2).forEach((goal, goalIndex) => {
          slide.addText(`\u2022 ${goal}`, {
            x: xPos + 0.2,
            y: 4.8 + goalIndex * 0.3,
            w: 3.1,
            h: 0.25,
            fontSize: 9,
            color: "333333"
          });
        });
      }
    });
  }
  addIdeasSlide(pres, ideas2) {
    const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
    slide.addText("Ideias Geradas", {
      x: 1,
      y: 1.2,
      w: 8,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: "1E40AF"
    });
    const sortedIdeas = ideas2.sort((a, b) => (b.dvfScore || 0) - (a.dvfScore || 0)).slice(0, 5);
    sortedIdeas.forEach((idea, index) => {
      const yPos = 2.2 + index * 0.9;
      slide.addShape("rect", {
        x: 1,
        y: yPos,
        w: 8,
        h: 0.8,
        fill: { color: index < 3 ? "E8F5E8" : "F8F9FA" },
        line: { color: "CCCCCC", width: 1 }
      });
      slide.addText(idea.title, {
        x: 1.2,
        y: yPos + 0.1,
        w: 5,
        h: 0.3,
        fontSize: 12,
        bold: true,
        color: "1E40AF"
      });
      if (idea.dvfScore) {
        slide.addText(`DVF: ${idea.dvfScore.toFixed(1)}/5`, {
          x: 6.5,
          y: yPos + 0.1,
          w: 1.5,
          h: 0.3,
          fontSize: 11,
          bold: true,
          color: idea.dvfScore >= 3.5 ? "22C55E" : idea.dvfScore >= 2.5 ? "F59E0B" : "EF4444"
        });
      }
      if (idea.actionDecision && idea.actionDecision !== "evaluate") {
        const actionColors = {
          love_it: "22C55E",
          change_it: "F59E0B",
          leave_it: "EF4444"
        };
        const actionTexts = {
          love_it: "\u{1F49A} AMAR",
          change_it: "\u{1F504} MUDAR",
          leave_it: "\u274C DEIXAR"
        };
        slide.addText(actionTexts[idea.actionDecision] || "", {
          x: 8,
          y: yPos + 0.1,
          w: 1,
          h: 0.3,
          fontSize: 10,
          bold: true,
          color: actionColors[idea.actionDecision] || "666666"
        });
      }
      slide.addText(idea.description.slice(0, 80) + "...", {
        x: 1.2,
        y: yPos + 0.4,
        w: 6.6,
        h: 0.3,
        fontSize: 10,
        color: "333333"
      });
    });
  }
  addDVFAnalysisSlide(pres, ideas2) {
    const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
    slide.addText("An\xE1lise DVF - Benchmarking", {
      x: 1,
      y: 1.2,
      w: 8,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: "1E40AF"
    });
    const validIdeas = ideas2.filter((idea) => idea.dvfScore);
    if (validIdeas.length === 0) return;
    const avgDesirability = validIdeas.reduce((sum, idea) => sum + (idea.desirability || 0), 0) / validIdeas.length;
    const avgViability = validIdeas.reduce((sum, idea) => sum + (idea.viability || 0), 0) / validIdeas.length;
    const avgFeasibility = validIdeas.reduce((sum, idea) => sum + (idea.feasibility || 0), 0) / validIdeas.length;
    const avgDVF = validIdeas.reduce((sum, idea) => sum + (idea.dvfScore || 0), 0) / validIdeas.length;
    const metrics = [
      { label: "Desejabilidade", value: avgDesirability, color: "22C55E" },
      { label: "Viabilidade", value: avgViability, color: "3B82F6" },
      { label: "Exequibilidade", value: avgFeasibility, color: "8B5CF6" }
    ];
    slide.addText("M\xE9tricas M\xE9dias do Projeto:", {
      x: 1,
      y: 2.2,
      w: 8,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color: "333333"
    });
    metrics.forEach((metric, index) => {
      const yPos = 2.8 + index * 0.8;
      slide.addText(metric.label, {
        x: 1,
        y: yPos,
        w: 2,
        h: 0.4,
        fontSize: 14,
        color: "333333"
      });
      slide.addShape("rect", {
        x: 3.5,
        y: yPos + 0.05,
        w: 4,
        h: 0.3,
        fill: { color: "E5E7EB" },
        line: { color: "D1D5DB", width: 1 }
      });
      slide.addShape("rect", {
        x: 3.5,
        y: yPos + 0.05,
        w: metric.value / 5 * 4,
        h: 0.3,
        fill: { color: metric.color },
        line: { width: 0 }
      });
      slide.addText(`${metric.value.toFixed(1)}/5`, {
        x: 7.8,
        y: yPos,
        w: 1,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: metric.color
      });
    });
    slide.addText("Pontua\xE7\xE3o DVF Geral:", {
      x: 1,
      y: 5.5,
      w: 3,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color: "1E40AF"
    });
    slide.addText(`${avgDVF.toFixed(1)}/5`, {
      x: 4,
      y: 5.5,
      w: 1.5,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: avgDVF >= 3.5 ? "22C55E" : avgDVF >= 2.5 ? "F59E0B" : "EF4444"
    });
    slide.addText("vs. M\xE9dia da Ind\xFAstria: 3.2/5", {
      x: 6,
      y: 5.5,
      w: 2.5,
      h: 0.5,
      fontSize: 12,
      color: "666666"
    });
  }
  addSummarySlide(pres, project, data) {
    const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
    slide.addText("Resumo do Projeto", {
      x: 1,
      y: 1.2,
      w: 8,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: "1E40AF"
    });
    slide.addText(project.name, {
      x: 1,
      y: 2,
      w: 8,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: "333333"
    });
    if (project.description) {
      slide.addText(project.description, {
        x: 1,
        y: 2.6,
        w: 8,
        h: 0.6,
        fontSize: 12,
        color: "666666"
      });
    }
    const metrics = [
      { label: "Fase Atual", value: `${project.currentPhase}/5` },
      { label: "Progresso", value: `${project.completionRate || 0}%` },
      { label: "Mapas de Empatia", value: data.empathyMaps.length.toString() },
      { label: "Personas", value: data.personas.length.toString() },
      { label: "Entrevistas", value: data.interviews.length.toString() },
      { label: "Ideias", value: data.ideas.length.toString() },
      { label: "Prot\xF3tipos", value: data.prototypes.length.toString() },
      { label: "Testes", value: data.testResults.length.toString() }
    ];
    metrics.forEach((metric, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const xPos = 1 + col * 2;
      const yPos = 3.5 + row * 0.8;
      slide.addShape("rect", {
        x: xPos,
        y: yPos,
        w: 1.8,
        h: 0.6,
        fill: { color: "F8F9FA" },
        line: { color: "E5E7EB", width: 1 }
      });
      slide.addText(metric.value, {
        x: xPos + 0.1,
        y: yPos + 0.05,
        w: 1.6,
        h: 0.3,
        fontSize: 16,
        bold: true,
        color: "1E40AF",
        align: "center"
      });
      slide.addText(metric.label, {
        x: xPos + 0.1,
        y: yPos + 0.35,
        w: 1.6,
        h: 0.2,
        fontSize: 8,
        color: "666666",
        align: "center"
      });
    });
    if (data.ideas.length > 0) {
      const validIdeas = data.ideas.filter((idea) => idea.dvfScore);
      if (validIdeas.length > 0) {
        const avgDVF = validIdeas.reduce((sum, idea) => sum + (idea.dvfScore || 0), 0) / validIdeas.length;
        slide.addText("An\xE1lise DVF Geral:", {
          x: 1,
          y: 5.5,
          w: 3,
          h: 0.4,
          fontSize: 14,
          bold: true,
          color: "1E40AF"
        });
        slide.addText(`${avgDVF.toFixed(1)}/5`, {
          x: 4,
          y: 5.5,
          w: 1.5,
          h: 0.4,
          fontSize: 20,
          bold: true,
          color: avgDVF >= 3.5 ? "22C55E" : avgDVF >= 2.5 ? "F59E0B" : "EF4444"
        });
        slide.addText("vs. M\xE9dia da Ind\xFAstria: 3.2/5", {
          x: 6,
          y: 5.5,
          w: 2.5,
          h: 0.4,
          fontSize: 11,
          color: "666666"
        });
      }
    }
    slide.addText(`Gerado em: ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")} \xE0s ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}`, {
      x: 1,
      y: 6.2,
      w: 8,
      h: 0.3,
      fontSize: 10,
      color: "999999",
      italic: true
    });
  }
  addFinalControlsSlide(pres) {
    const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
    slide.addText("Apresenta\xE7\xE3o Conclu\xEDda", {
      x: 1,
      y: 2,
      w: 8,
      h: 1,
      fontSize: 32,
      bold: true,
      color: "1E40AF",
      align: "center"
    });
    slide.addText("Parab\xE9ns! Voc\xEA completou sua jornada de Design Thinking.", {
      x: 1,
      y: 3,
      w: 8,
      h: 0.6,
      fontSize: 16,
      color: "333333",
      align: "center"
    });
    slide.addText("Use os controles abaixo para salvar ou fechar esta apresenta\xE7\xE3o:", {
      x: 1,
      y: 3.8,
      w: 8,
      h: 0.4,
      fontSize: 12,
      color: "666666",
      align: "center"
    });
    slide.addShape("rect", {
      x: 2.5,
      y: 4.5,
      w: 2,
      h: 0.8,
      fill: { color: "22C55E" },
      line: { width: 0 }
    });
    slide.addText("\u{1F4BE} SALVAR", {
      x: 2.5,
      y: 4.7,
      w: 2,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: "FFFFFF",
      align: "center"
    });
    slide.addText("Baixar apresenta\xE7\xE3o", {
      x: 2.5,
      y: 5,
      w: 2,
      h: 0.3,
      fontSize: 10,
      color: "FFFFFF",
      align: "center"
    });
    slide.addShape("rect", {
      x: 5.5,
      y: 4.5,
      w: 2,
      h: 0.8,
      fill: { color: "EF4444" },
      line: { width: 0 }
    });
    slide.addText("\u2716\uFE0F FECHAR", {
      x: 5.5,
      y: 4.7,
      w: 2,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: "FFFFFF",
      align: "center"
    });
    slide.addText("Sair da apresenta\xE7\xE3o", {
      x: 5.5,
      y: 5,
      w: 2,
      h: 0.3,
      fontSize: 10,
      color: "FFFFFF",
      align: "center"
    });
    slide.addText("\u{1F4A1} Dica: Para usar os controles, clique nos bot\xF5es durante a apresenta\xE7\xE3o ou use as teclas de atalho.", {
      x: 1,
      y: 5.8,
      w: 8,
      h: 0.4,
      fontSize: 10,
      color: "666666",
      align: "center",
      italic: true
    });
    slide.addText("Pr\xF3ximos Passos:", {
      x: 1,
      y: 6.4,
      w: 8,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: "1E40AF",
      align: "center"
    });
    slide.addText("\u2022 Continue iterando suas ideias \u2022 Implemente os prot\xF3tipos \u2022 Colete mais feedback dos usu\xE1rios", {
      x: 1,
      y: 6.7,
      w: 8,
      h: 0.3,
      fontSize: 10,
      color: "333333",
      align: "center"
    });
  }
  async generateProjectPPTX(projectId, userId) {
    try {
      const pres = new pptxgen();
      this.setupMasterSlide(pres);
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        throw new Error("Project not found");
      }
      const empathyMaps2 = await storage.getEmpathyMaps(projectId);
      const personas2 = await storage.getPersonas(projectId);
      const interviews2 = await storage.getInterviews(projectId);
      const observations2 = await storage.getObservations(projectId);
      const povStatements2 = await storage.getPovStatements(projectId);
      const hmwQuestions2 = await storage.getHmwQuestions(projectId);
      const ideas2 = await storage.getIdeas(projectId);
      const prototypes2 = await storage.getPrototypes(projectId);
      const testPlans2 = await storage.getTestPlans(projectId);
      const testResults2 = await storage.getTestResults(projectId);
      this.addTitleSlide(pres, project.name, project.description || "");
      if (empathyMaps2.length > 0 || personas2.length > 0) {
        this.addPhaseOverviewSlide(pres, 1, "Empatizar", "Compreenda profundamente seus usu\xE1rios atrav\xE9s de pesquisas, entrevistas e observa\xE7\xF5es.");
        empathyMaps2.forEach((empathyMap) => {
          this.addEmpathyMapSlide(pres, empathyMap);
        });
        if (personas2.length > 0) {
          this.addPersonasSlide(pres, personas2);
        }
        if (interviews2.length > 0) {
          const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
          slide.addText("Entrevistas Realizadas", {
            x: 1,
            y: 1.2,
            w: 8,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: "1E40AF"
          });
          interviews2.slice(0, 3).forEach((interview, index) => {
            const yPos = 2.2 + index * 1.5;
            slide.addText(`${index + 1}. ${interview.participantName}`, {
              x: 1,
              y: yPos,
              w: 8,
              h: 0.4,
              fontSize: 14,
              bold: true,
              color: "1E40AF"
            });
            slide.addText(`Dura\xE7\xE3o: ${interview.duration || "N/A"} min`, {
              x: 1,
              y: yPos + 0.4,
              w: 8,
              h: 0.3,
              fontSize: 11,
              color: "666666"
            });
            if (interview.insights) {
              slide.addText(`Insights: ${interview.insights.slice(0, 100)}...`, {
                x: 1,
                y: yPos + 0.7,
                w: 8,
                h: 0.6,
                fontSize: 10,
                color: "333333"
              });
            }
          });
        }
        if (observations2.length > 0) {
          const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
          slide.addText("Observa\xE7\xF5es de Campo", {
            x: 1,
            y: 1.2,
            w: 8,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: "1E40AF"
          });
          observations2.slice(0, 4).forEach((observation, index) => {
            const yPos = 2.2 + index * 1.2;
            slide.addText(`${index + 1}. ${observation.location}`, {
              x: 1,
              y: yPos,
              w: 8,
              h: 0.4,
              fontSize: 14,
              bold: true,
              color: "1E40AF"
            });
            if (observation.behavior) {
              slide.addText(`Comportamento: ${observation.behavior.slice(0, 120)}...`, {
                x: 1,
                y: yPos + 0.4,
                w: 8,
                h: 0.6,
                fontSize: 10,
                color: "333333"
              });
            }
          });
        }
      }
      if (povStatements2.length > 0 || hmwQuestions2.length > 0) {
        this.addPhaseOverviewSlide(pres, 2, "Definir", "Defina claramente o problema e crie declara\xE7\xF5es de ponto de vista focadas.");
        if (povStatements2.length > 0) {
          const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
          slide.addText("Declara\xE7\xF5es POV", {
            x: 1,
            y: 1.2,
            w: 8,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: "1E40AF"
          });
          povStatements2.slice(0, 3).forEach((pov, index) => {
            const yPos = 2.2 + index * 1.5;
            slide.addText(pov.statement, {
              x: 1,
              y: yPos,
              w: 8,
              h: 1,
              fontSize: 12,
              color: "333333"
            });
          });
        }
        if (hmwQuestions2.length > 0) {
          const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
          slide.addText("Como Podemos (HMW)", {
            x: 1,
            y: 1.2,
            w: 8,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: "1E40AF"
          });
          hmwQuestions2.slice(0, 5).forEach((hmw, index) => {
            const yPos = 2.2 + index * 0.9;
            slide.addText(`${index + 1}. ${hmw.question}`, {
              x: 1,
              y: yPos,
              w: 8,
              h: 0.8,
              fontSize: 12,
              color: "333333"
            });
          });
        }
      }
      if (ideas2.length > 0) {
        this.addPhaseOverviewSlide(pres, 3, "Idear", "Gere uma ampla gama de ideias criativas atrav\xE9s de brainstorming estruturado.");
        this.addIdeasSlide(pres, ideas2);
        this.addDVFAnalysisSlide(pres, ideas2);
      }
      if (prototypes2.length > 0) {
        this.addPhaseOverviewSlide(pres, 4, "Prototipar", "Construa prot\xF3tipos r\xE1pidos e baratos para testar suas melhores ideias.");
        const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
        slide.addText("Prot\xF3tipos Criados", {
          x: 1,
          y: 1.2,
          w: 8,
          h: 0.8,
          fontSize: 24,
          bold: true,
          color: "1E40AF"
        });
        prototypes2.slice(0, 3).forEach((prototype, index) => {
          const yPos = 2.2 + index * 1.2;
          slide.addText(`${prototype.name} (${prototype.type})`, {
            x: 1,
            y: yPos,
            w: 8,
            h: 0.4,
            fontSize: 14,
            bold: true,
            color: "1E40AF"
          });
          if (prototype.description) {
            slide.addText(prototype.description.slice(0, 100) + "...", {
              x: 1,
              y: yPos + 0.4,
              w: 8,
              h: 0.6,
              fontSize: 11,
              color: "333333"
            });
          }
        });
      }
      if (testPlans2.length > 0 || testResults2.length > 0) {
        this.addPhaseOverviewSlide(pres, 5, "Testar", "Teste seus prot\xF3tipos com usu\xE1rios reais e colete feedback valioso.");
        if (testResults2.length > 0) {
          const slide = pres.addSlide({ masterName: "DTTools_MASTER" });
          slide.addText("Resultados dos Testes", {
            x: 1,
            y: 1.2,
            w: 8,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: "1E40AF"
          });
          testResults2.slice(0, 2).forEach((result, index) => {
            const yPos = 2.2 + index * 2;
            slide.addText(`Teste ID: ${result.participantId}`, {
              x: 1,
              y: yPos,
              w: 8,
              h: 0.4,
              fontSize: 14,
              bold: true,
              color: "1E40AF"
            });
            if (result.insights) {
              slide.addText(result.insights.slice(0, 150) + "...", {
                x: 1,
                y: yPos + 0.5,
                w: 8,
                h: 1,
                fontSize: 11,
                color: "333333"
              });
            }
          });
        }
      }
      this.addSummarySlide(pres, project, {
        empathyMaps: empathyMaps2,
        personas: personas2,
        interviews: interviews2,
        observations: observations2,
        povStatements: povStatements2,
        hmwQuestions: hmwQuestions2,
        ideas: ideas2,
        prototypes: prototypes2,
        testPlans: testPlans2,
        testResults: testResults2
      });
      this.addFinalControlsSlide(pres);
      const buffer = await pres.write({ outputType: "nodebuffer" });
      return buffer;
    } catch (error) {
      console.error("Error generating PPTX:", error);
      throw new Error("Failed to generate PPTX presentation");
    }
  }
  async generateProjectPDF(projectId, userId) {
    try {
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        throw new Error("Project not found");
      }
      const empathyMaps2 = await storage.getEmpathyMaps(projectId);
      const personas2 = await storage.getPersonas(projectId);
      const interviews2 = await storage.getInterviews(projectId);
      const observations2 = await storage.getObservations(projectId);
      const povStatements2 = await storage.getPovStatements(projectId);
      const hmwQuestions2 = await storage.getHmwQuestions(projectId);
      const ideas2 = await storage.getIdeas(projectId);
      const prototypes2 = await storage.getPrototypes(projectId);
      const testPlans2 = await storage.getTestPlans(projectId);
      const testResults2 = await storage.getTestResults(projectId);
      const doc = new jsPDF();
      let yPosition = 20;
      const addText = (text2, fontSize = 12, isBold = false) => {
        doc.setFontSize(fontSize);
        if (isBold) {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        const lines = doc.splitTextToSize(text2, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * (fontSize / 2.5) + 5;
      };
      const addSectionHeader = (title) => {
        yPosition += 10;
        addText(title, 16, true);
        yPosition += 5;
      };
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("DTTools - Design Thinking", 105, 20, { align: "center" });
      doc.setFontSize(18);
      doc.text(project.name, 105, 30, { align: "center" });
      doc.setTextColor(0, 0, 0);
      yPosition = 60;
      if (project.description) {
        addText(`Descri\xE7\xE3o: ${project.description}`, 14);
      }
      addText(`Data de cria\xE7\xE3o: ${project.createdAt ? new Date(project.createdAt).toLocaleDateString("pt-BR") : "N/A"}`, 12);
      addText(`Fase atual: ${project.currentPhase}/5`, 12);
      addText(`Progresso: ${project.completionRate || 0}%`, 12);
      if (empathyMaps2.length > 0 || personas2.length > 0 || interviews2.length > 0) {
        addSectionHeader("FASE 1: EMPATIZAR");
        addText("Compreenda profundamente seus usu\xE1rios atrav\xE9s de pesquisas, entrevistas e observa\xE7\xF5es.");
        if (empathyMaps2.length > 0) {
          addText("Mapas de Empatia:", 14, true);
          empathyMaps2.forEach((empathyMap, index) => {
            addText(`${index + 1}. ${empathyMap.title}`, 12, true);
            if (empathyMap.says && Array.isArray(empathyMap.says)) {
              addText(`Diz: ${empathyMap.says.join(", ")}`, 10);
            }
            if (empathyMap.thinks && Array.isArray(empathyMap.thinks)) {
              addText(`Pensa: ${empathyMap.thinks.join(", ")}`, 10);
            }
            if (empathyMap.does && Array.isArray(empathyMap.does)) {
              addText(`Faz: ${empathyMap.does.join(", ")}`, 10);
            }
            if (empathyMap.feels && Array.isArray(empathyMap.feels)) {
              addText(`Sente: ${empathyMap.feels.join(", ")}`, 10);
            }
            yPosition += 5;
          });
        }
        if (personas2.length > 0) {
          addText("Personas:", 14, true);
          personas2.forEach((persona, index) => {
            addText(`${index + 1}. ${persona.name}`, 12, true);
            addText(`${persona.age} anos \u2022 ${persona.occupation}`, 10);
            if (persona.bio) {
              addText(`Bio: ${persona.bio}`, 10);
            }
            if (persona.goals && Array.isArray(persona.goals)) {
              addText(`Objetivos: ${persona.goals.join(", ")}`, 10);
            }
            yPosition += 5;
          });
        }
        if (interviews2.length > 0) {
          addText("Entrevistas:", 14, true);
          interviews2.forEach((interview, index) => {
            addText(`${index + 1}. ${interview.participantName}`, 12, true);
            if (interview.insights) {
              addText(`Insights: ${interview.insights}`, 10);
            }
          });
        }
      }
      if (povStatements2.length > 0 || hmwQuestions2.length > 0) {
        addSectionHeader("FASE 2: DEFINIR");
        addText("Defina claramente o problema e crie declara\xE7\xF5es de ponto de vista focadas.");
        if (povStatements2.length > 0) {
          addText("Declara\xE7\xF5es POV:", 14, true);
          povStatements2.forEach((pov, index) => {
            addText(`${index + 1}. ${pov.statement}`, 10);
          });
        }
        if (hmwQuestions2.length > 0) {
          addText("Como Podemos (HMW):", 14, true);
          hmwQuestions2.forEach((hmw, index) => {
            addText(`${index + 1}. ${hmw.question}`, 10);
          });
        }
      }
      if (ideas2.length > 0) {
        addSectionHeader("FASE 3: IDEAR");
        addText("Gere uma ampla gama de ideias criativas atrav\xE9s de brainstorming estruturado.");
        const sortedIdeas = ideas2.sort((a, b) => (b.dvfScore || 0) - (a.dvfScore || 0));
        addText("Ideias Geradas:", 14, true);
        sortedIdeas.forEach((idea, index) => {
          addText(`${index + 1}. ${idea.title}`, 12, true);
          addText(`Descri\xE7\xE3o: ${idea.description}`, 10);
          if (idea.dvfScore) {
            addText(`Pontua\xE7\xE3o DVF: ${idea.dvfScore.toFixed(1)}/5`, 10);
            addText(`- Desejabilidade: ${idea.desirability || 0}/5`, 9);
            addText(`- Viabilidade: ${idea.viability || 0}/5`, 9);
            addText(`- Exequibilidade: ${idea.feasibility || 0}/5`, 9);
          }
          if (idea.actionDecision && idea.actionDecision !== "evaluate") {
            const actionTexts = {
              love_it: "\u{1F49A} AMAR",
              change_it: "\u{1F504} MUDAR",
              leave_it: "\u274C DEIXAR"
            };
            addText(`Decis\xE3o: ${actionTexts[idea.actionDecision] || idea.actionDecision}`, 10);
          }
          yPosition += 5;
        });
        const validIdeas = ideas2.filter((idea) => idea.dvfScore);
        if (validIdeas.length > 0) {
          addText("An\xE1lise DVF - M\xE9tricas do Projeto:", 14, true);
          const avgDesirability = validIdeas.reduce((sum, idea) => sum + (idea.desirability || 0), 0) / validIdeas.length;
          const avgViability = validIdeas.reduce((sum, idea) => sum + (idea.viability || 0), 0) / validIdeas.length;
          const avgFeasibility = validIdeas.reduce((sum, idea) => sum + (idea.feasibility || 0), 0) / validIdeas.length;
          const avgDVF = validIdeas.reduce((sum, idea) => sum + (idea.dvfScore || 0), 0) / validIdeas.length;
          addText(`Desejabilidade M\xE9dia: ${avgDesirability.toFixed(1)}/5`, 12);
          addText(`Viabilidade M\xE9dia: ${avgViability.toFixed(1)}/5`, 12);
          addText(`Exequibilidade M\xE9dia: ${avgFeasibility.toFixed(1)}/5`, 12);
          addText(`Pontua\xE7\xE3o DVF Geral: ${avgDVF.toFixed(1)}/5`, 12, true);
          addText(`vs. M\xE9dia da Ind\xFAstria: 3.2/5`, 10);
        }
      }
      if (prototypes2.length > 0) {
        addSectionHeader("FASE 4: PROTOTIPAR");
        addText("Construa prot\xF3tipos r\xE1pidos e baratos para testar suas melhores ideias.");
        addText("Prot\xF3tipos Criados:", 14, true);
        prototypes2.forEach((prototype, index) => {
          addText(`${index + 1}. ${prototype.name} (${prototype.type})`, 12, true);
          if (prototype.description) {
            addText(`Descri\xE7\xE3o: ${prototype.description}`, 10);
          }
          if (prototype.materials) {
            addText(`Materiais: ${prototype.materials}`, 10);
          }
          yPosition += 5;
        });
      }
      if (testPlans2.length > 0 || testResults2.length > 0) {
        addSectionHeader("FASE 5: TESTAR");
        addText("Teste seus prot\xF3tipos com usu\xE1rios reais e colete feedback valioso.");
        if (testPlans2.length > 0) {
          addText("Planos de Teste:", 14, true);
          testPlans2.forEach((plan, index) => {
            addText(`${index + 1}. ${plan.objective}`, 12, true);
            if (plan.methodology) {
              addText(`Metodologia: ${plan.methodology}`, 10);
            }
          });
        }
        if (testResults2.length > 0) {
          addText("Resultados dos Testes:", 14, true);
          testResults2.forEach((result, index) => {
            addText(`${index + 1}. Participante: ${result.participantId}`, 12, true);
            if (result.insights) {
              addText(`Insights: ${result.insights}`, 10);
            }
            if (result.feedback) {
              addText(`Feedback: ${result.feedback}`, 10);
            }
          });
        }
      }
      yPosition += 20;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setTextColor(100, 100, 100);
      addText("Gerado pelo DTTools \u2022 dttools.app", 10);
      addText(`Data de gera\xE7\xE3o: ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")}`, 10);
      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
      return pdfBuffer;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF document");
    }
  }
  async generateProjectMarkdown(projectId, userId) {
    try {
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        throw new Error("Project not found");
      }
      const empathyMaps2 = await storage.getEmpathyMaps(projectId);
      const personas2 = await storage.getPersonas(projectId);
      const interviews2 = await storage.getInterviews(projectId);
      const observations2 = await storage.getObservations(projectId);
      const povStatements2 = await storage.getPovStatements(projectId);
      const hmwQuestions2 = await storage.getHmwQuestions(projectId);
      const ideas2 = await storage.getIdeas(projectId);
      const prototypes2 = await storage.getPrototypes(projectId);
      const testPlans2 = await storage.getTestPlans(projectId);
      const testResults2 = await storage.getTestResults(projectId);
      let markdown = "";
      markdown += `# ${project.name}

`;
      markdown += `> **Projeto de Design Thinking**  
`;
      markdown += `> Gerado pelo [DTTools](https://dttools.app) \u2022 ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")}

`;
      markdown += `---

`;
      markdown += `## \u{1F4CB} Vis\xE3o Geral do Projeto

`;
      markdown += `**Descri\xE7\xE3o:** ${project.description}

`;
      markdown += `**Status:** ${project.status}

`;
      markdown += `**Fase atual:** ${project.currentPhase}

`;
      markdown += `**Taxa de conclus\xE3o:** ${project.completionRate}%

`;
      markdown += `---

`;
      markdown += `## \u{1F91D} Fase 1: Empatizar

`;
      if (empathyMaps2.length > 0) {
        markdown += `### \u{1F5FA}\uFE0F Mapas de Empatia

`;
        empathyMaps2.forEach((map, index) => {
          markdown += `#### ${index + 1}. ${map.title}

`;
          markdown += `**O que diz:**
`;
          if (Array.isArray(map.says)) {
            map.says.forEach((item) => markdown += `- ${item}
`);
          }
          markdown += `
**O que pensa:**
`;
          if (Array.isArray(map.thinks)) {
            map.thinks.forEach((item) => markdown += `- ${item}
`);
          }
          markdown += `
**O que faz:**
`;
          if (Array.isArray(map.does)) {
            map.does.forEach((item) => markdown += `- ${item}
`);
          }
          markdown += `
**O que sente:**
`;
          if (Array.isArray(map.feels)) {
            map.feels.forEach((item) => markdown += `- ${item}
`);
          }
          markdown += `
`;
        });
      }
      if (personas2.length > 0) {
        markdown += `### \u{1F464} Personas

`;
        personas2.forEach((persona, index) => {
          markdown += `#### ${index + 1}. ${persona.name}

`;
          markdown += `- **Idade:** ${persona.age} anos
`;
          markdown += `- **Ocupa\xE7\xE3o:** ${persona.occupation}
`;
          if (persona.bio) markdown += `- **Bio:** ${persona.bio}
`;
          if (persona.goals) markdown += `- **Objetivos:** ${persona.goals}
`;
          if (persona.frustrations) markdown += `- **Frustra\xE7\xF5es:** ${persona.frustrations}
`;
          if (persona.motivations) markdown += `- **Motiva\xE7\xF5es:** ${persona.motivations}
`;
          if (persona.techSavviness) markdown += `- **N\xEDvel t\xE9cnico:** ${persona.techSavviness}
`;
          markdown += `
`;
        });
      }
      if (interviews2.length > 0) {
        markdown += `### \u{1F3A4} Entrevistas

`;
        interviews2.forEach((interview, index) => {
          markdown += `#### ${index + 1}. ${interview.participantName}

`;
          markdown += `- **Data:** ${interview.date}
`;
          if (interview.duration) markdown += `- **Dura\xE7\xE3o:** ${interview.duration} minutos
`;
          if (interview.questions) markdown += `- **Perguntas:** ${interview.questions}
`;
          if (interview.responses) markdown += `- **Respostas:** ${interview.responses}
`;
          if (interview.insights) markdown += `- **Insights:** ${interview.insights}
`;
          markdown += `
`;
        });
      }
      if (observations2.length > 0) {
        markdown += `### \u{1F440} Observa\xE7\xF5es

`;
        observations2.forEach((obs, index) => {
          markdown += `#### ${index + 1}. ${obs.location}

`;
          markdown += `- **Data:** ${obs.date}
`;
          if (obs.context) markdown += `- **Contexto:** ${obs.context}
`;
          if (obs.behavior) markdown += `- **Comportamento:** ${obs.behavior}
`;
          if (obs.insights) markdown += `- **Insights:** ${obs.insights}
`;
          markdown += `
`;
        });
      }
      markdown += `## \u{1F3AF} Fase 2: Definir

`;
      if (povStatements2.length > 0) {
        markdown += `### \u{1F4DD} Declara\xE7\xF5es de Ponto de Vista (POV)

`;
        povStatements2.forEach((pov, index) => {
          markdown += `#### ${index + 1}. ${pov.user}

`;
          markdown += `> **${pov.user}** precisa **${pov.need}** porque **${pov.insight}**.

`;
        });
      }
      if (hmwQuestions2.length > 0) {
        markdown += `### \u2753 Perguntas "Como Podemos" (HMW)

`;
        hmwQuestions2.forEach((hmw, index) => {
          markdown += `${index + 1}. **${hmw.question}**`;
          if (hmw.category) markdown += ` *(${hmw.category})*`;
          markdown += `
`;
        });
        markdown += `
`;
      }
      markdown += `## \u{1F4A1} Fase 3: Idear

`;
      if (ideas2.length > 0) {
        markdown += `### \u{1F680} Ideias Geradas

`;
        ideas2.forEach((idea, index) => {
          markdown += `#### ${index + 1}. ${idea.title}

`;
          markdown += `${idea.description}

`;
          if (idea.category) markdown += `**Categoria:** ${idea.category}

`;
          if (idea.feasibility || idea.impact || idea.desirability) {
            markdown += `**Avalia\xE7\xE3o DVF:**
`;
            if (idea.desirability) markdown += `- Desejabilidade: ${idea.desirability}/10
`;
            if (idea.feasibility) markdown += `- Viabilidade: ${idea.feasibility}/10
`;
            if (idea.impact) markdown += `- Exequibilidade: ${idea.impact}/10
`;
            markdown += `
`;
          }
        });
      }
      markdown += `## \u{1F527} Fase 4: Prototipar

`;
      if (prototypes2.length > 0) {
        markdown += `### \u{1F6E0}\uFE0F Prot\xF3tipos Desenvolvidos

`;
        prototypes2.forEach((prototype, index) => {
          markdown += `#### ${index + 1}. ${prototype.name}

`;
          markdown += `${prototype.description}

`;
          if (prototype.type) markdown += `**Tipo:** ${prototype.type}

`;
          if (prototype.materials && Array.isArray(prototype.materials)) {
            markdown += `**Materiais:**
`;
            prototype.materials.forEach((material) => markdown += `- ${material}
`);
            markdown += `
`;
          }
          if (prototype.feedback) markdown += `**Feedback:** ${prototype.feedback}

`;
        });
      }
      markdown += `## \u{1F9EA} Fase 5: Testar

`;
      if (testPlans2.length > 0) {
        markdown += `### \u{1F4CB} Planos de Teste

`;
        testPlans2.forEach((plan, index) => {
          markdown += `#### ${index + 1}. ${plan.name}

`;
          if (plan.objective) markdown += `**Objetivo:** ${plan.objective}

`;
          if (plan.methodology) markdown += `**Metodologia:** ${plan.methodology}

`;
          if (plan.participants) markdown += `**Participantes:** ${plan.participants}

`;
          if (plan.duration) markdown += `**Dura\xE7\xE3o:** ${plan.duration} dias

`;
        });
      }
      if (testResults2.length > 0) {
        markdown += `### \u{1F4CA} Resultados dos Testes

`;
        testResults2.forEach((result, index) => {
          markdown += `#### ${index + 1}. ${result.participantId}

`;
          if (result.feedback) markdown += `**Feedback:** ${result.feedback}

`;
          if (result.insights) markdown += `**Insights:** ${result.insights}

`;
          if (result.successRate) markdown += `**Taxa de sucesso:** ${result.successRate}%

`;
        });
      }
      markdown += `---

`;
      markdown += `*Relat\xF3rio gerado pelo **DTTools** - Plataforma de Design Thinking*  
`;
      markdown += `*Acesse: [dttools.app](https://dttools.app)*  
`;
      markdown += `*Data: ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")} \xE0s ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}*
`;
      return markdown;
    } catch (error) {
      console.error("Error generating Markdown:", error);
      throw new Error("Failed to generate Markdown document");
    }
  }
};

// server/translation.ts
import { GoogleGenAI as GoogleGenAI2 } from "@google/genai";
var genAI = new GoogleGenAI2({
  apiKey: process.env.GEMINI_API_KEY || ""
});
async function translateText(portugueseText, context = "content") {
  if (!portugueseText || portugueseText.trim() === "") {
    return { en: "", es: "", fr: "" };
  }
  const contextInstructions = {
    title: "This is a title/heading. Keep it concise and impactful.",
    description: "This is a brief description or summary. Keep it clear and engaging.",
    content: "This is full content. Maintain formatting, tone, and all details."
  };
  const prompt = `You are a professional translator specializing in Design Thinking and business content.

${contextInstructions[context]}

Translate the following Portuguese text to English, Spanish, and French.
Maintain the exact same tone, style, and formatting.
For Design Thinking terms, use standard industry terminology.

PORTUGUESE TEXT:
${portugueseText}

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "en": "English translation here",
  "es": "Spanish translation here",
  "fr": "French translation here"
}`;
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    const text2 = response.text || "";
    if (!text2) {
      throw new Error("Empty response from AI");
    }
    const jsonMatch = text2.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }
    const translations = JSON.parse(jsonMatch[0]);
    return {
      en: translations.en || "",
      es: translations.es || "",
      fr: translations.fr || ""
    };
  } catch (error) {
    console.error("Translation error:", error);
    return {
      en: portugueseText,
      es: portugueseText,
      fr: portugueseText
    };
  }
}
async function translateLongContent(portugueseText) {
  const MAX_CHUNK_SIZE = 2500;
  if (!portugueseText || portugueseText.trim() === "") {
    return { en: "", es: "", fr: "" };
  }
  if (portugueseText.length <= MAX_CHUNK_SIZE) {
    return translateText(portugueseText, "content");
  }
  const chunks = [];
  let remaining = portugueseText;
  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHUNK_SIZE) {
      chunks.push(remaining);
      break;
    }
    let splitIndex = remaining.lastIndexOf("\n", MAX_CHUNK_SIZE);
    if (splitIndex <= 0) {
      splitIndex = MAX_CHUNK_SIZE;
    }
    const chunk = remaining.slice(0, splitIndex);
    chunks.push(chunk);
    remaining = remaining.slice(splitIndex);
  }
  const results = await Promise.all(
    chunks.map((chunk) => translateText(chunk, "content"))
  );
  return {
    en: results.map((r) => r.en).join(""),
    es: results.map((r) => r.es).join(""),
    fr: results.map((r) => r.fr).join("")
  };
}
async function translateArticle(article) {
  const [titleTranslations, descTranslations, contentTranslations] = await Promise.all([
    translateText(article.title, "title"),
    translateText(article.description, "description"),
    translateLongContent(article.content)
  ]);
  return {
    titleEn: titleTranslations.en,
    titleEs: titleTranslations.es,
    titleFr: titleTranslations.fr,
    descriptionEn: descTranslations.en,
    descriptionEs: descTranslations.es,
    descriptionFr: descTranslations.fr,
    contentEn: contentTranslations.en,
    contentEs: contentTranslations.es,
    contentFr: contentTranslations.fr
  };
}
async function translateVideo(video) {
  const [titleTranslations, descTranslations] = await Promise.all([
    translateText(video.title, "title"),
    translateText(video.description, "description")
  ]);
  return {
    titleEn: titleTranslations.en,
    titleEs: titleTranslations.es,
    titleFr: titleTranslations.fr,
    descriptionEn: descTranslations.en,
    descriptionEs: descTranslations.es,
    descriptionFr: descTranslations.fr
  };
}
async function translateTestimonial(testimonial) {
  const translations = await translateText(testimonial.testimonialPt, "content");
  return {
    testimonialEn: translations.en,
    testimonialEs: translations.es,
    testimonialFr: translations.fr
  };
}

// server/double-diamond-ai.ts
import { GoogleGenAI as GoogleGenAI3 } from "@google/genai";
var genAI2 = new GoogleGenAI3({
  apiKey: process.env.GEMINI_API_KEY || ""
});
async function generateDiscoverPhase(input) {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  const languageInstruction = isPortuguese ? "IMPORTANTE: Responda APENAS em PORTUGU\xCAS DO BRASIL. Todos os textos devem estar em portugu\xEAs." : isSpanish ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol." : isFrench ? "IMPORTANTE: Responda APENAS em FRANC\xCAS. Todos os textos devem estar em franc\xEAs." : "IMPORTANTE: Responda APENAS em INGL\xCAS. Todos os textos devem estar em ingl\xEAs.";
  const prompt = `Voc\xEA \xE9 um especialista em Design Thinking conduzindo a fase DISCOVER do framework Double Diamond.

${languageInstruction}

CONTEXTO:
- Setor: ${input.sector}
- Case de Sucesso de Refer\xEAncia: ${input.successCase || "Nenhum"}
- P\xFAblico-Alvo: ${input.targetAudience}
- Declara\xE7\xE3o do Problema: ${input.problemStatement}

Gere uma an\xE1lise de descoberta abrangente com:

1. **Pain Points** (8-12 itens): Identifique problemas espec\xEDficos, frustra\xE7\xF5es e desafios que o p\xFAblico-alvo enfrenta
   - Inclua categoria (operacional, emocional, financeiro, tecnol\xF3gico)
   - Classifique severidade 1-5 (5 = cr\xEDtico)

2. **Insights** (6-10 itens): Observa\xE7\xF5es-chave sobre comportamento do usu\xE1rio, tend\xEAncias de mercado ou padr\xF5es do setor
   - Marque fonte: 'setor', 'case' ou 'persona'

3. **Necessidades do Usu\xE1rio** (8-12 itens): Necessidades centrais que os usu\xE1rios est\xE3o tentando satisfazer
   - Priorize 1-5 (5 = essencial)

4. **Mapa de Empatia**: O que o usu\xE1rio Diz, Pensa, Faz e Sente (3-5 itens por quadrante)

Retorne APENAS um objeto JSON (sem markdown):
{
  "painPoints": [{"text": "...", "category": "...", "severity": 3}],
  "insights": [{"text": "...", "source": "sector"}],
  "userNeeds": [{"need": "...", "priority": 4}],
  "empathyMap": {
    "says": ["..."],
    "thinks": ["..."],
    "does": ["..."],
    "feels": ["..."]
  }
}`;
  try {
    const result = await genAI2.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    const text2 = result.text;
    if (!text2) throw new Error("Empty AI response");
    if (!text2) throw new Error("Empty AI response");
    const jsonMatch = text2.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Discover phase generation error:", error);
    throw error;
  }
}
async function generateDefinePhase(input) {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  const languageInstruction = isPortuguese ? "IMPORTANTE: Responda APENAS em PORTUGU\xCAS DO BRASIL. Todos os textos devem estar em portugu\xEAs." : isSpanish ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol." : isFrench ? "IMPORTANTE: Responda APENAS em FRANC\xCAS. Todos os textos devem estar em franc\xEAs." : "IMPORTANTE: Responda APENAS em INGL\xCAS. Todos os textos devem estar em ingl\xEAs.";
  const prompt = `Voc\xEA \xE9 um especialista em Design Thinking conduzindo a fase DEFINE do framework Double Diamond.

${languageInstruction}

Based on the DISCOVER phase findings, synthesize the problem:

PAIN POINTS:
${input.painPoints.map((p) => `- [${p.severity}/5] ${p.text}`).join("\n")}

USER NEEDS:
${input.userNeeds.map((n) => `- [${n.priority}/5] ${n.need}`).join("\n")}

INSIGHTS:
${input.insights.map((i) => `- ${i.text}`).join("\n")}

Generate:

1. **POV Statements** (3-5): Using formula: [User] needs [Need] because [Insight]
   - Focus on the most critical pain points and needs
   - Each POV should be specific and actionable

2. **HMW Questions** (8-12): "How Might We..." questions that open up solution space
   - Tag each with focus area: 'desirability', 'feasibility', or 'viability'
   - Avoid too broad or too narrow questions
   - Each HMW should be inspiring and solution-oriented

Return ONLY a JSON object (no markdown):
{
  "povStatements": [{
    "user": "busy professionals",
    "need": "quick healthy meals",
    "insight": "they have limited time but care about nutrition",
    "fullStatement": "Busy professionals need quick healthy meals because they have limited time but care about nutrition"
  }],
  "hmwQuestions": [{
    "question": "How might we make healthy eating as convenient as fast food?",
    "focusArea": "desirability"
  }]
}`;
  try {
    const result = await genAI2.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    const text2 = result.text;
    if (!text2) throw new Error("Empty AI response");
    const jsonMatch = text2.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Define phase generation error:", error);
    throw error;
  }
}
async function generateDevelopPhase(input) {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  const languageInstruction = isPortuguese ? "IMPORTANTE: Responda APENAS em PORTUGU\xCAS DO BRASIL. Todos os textos devem estar em portugu\xEAs." : isSpanish ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol." : isFrench ? "IMPORTANTE: Responda APENAS em FRANC\xCAS. Todos os textos devem estar em franc\xEAs." : "IMPORTANTE: Responda APENAS em INGL\xCAS. Todos os textos devem estar em ingl\xEAs.";
  const prompt = `Voc\xEA \xE9 um facilitador criativo de Design Thinking conduzindo a fase DEVELOP (Idea\xE7\xE3o).

${languageInstruction}

POV STATEMENT: ${input.selectedPov}
HMW QUESTION: ${input.selectedHmw}
SECTOR: ${input.sector}

Generate a LARGE quantity of diverse ideas:

1. **Regular Ideas** (15-20 ideas): Creative solutions to the HMW question
   - Categories: digital product, physical product, service, platform, hybrid
   - Rate innovation level 1-5 (1=incremental, 5=breakthrough)
   - Be bold and imaginative

2. **Cross-Pollinated Ideas** (5-8 ideas): Innovative solutions by combining concepts from different domains
   - Example: Combine "ride-sharing" (Uber) + "subscription model" (Netflix) + "social gaming" (TikTok)
   - Show which domains were combined
   - Rate uniqueness 1-5

Return ONLY a JSON object (no markdown):
{
  "ideas": [{
    "title": "AI-Powered Meal Planner",
    "description": "An app that creates personalized weekly meal plans based on dietary preferences, budget, and available time",
    "category": "digital product",
    "innovationLevel": 3
  }],
  "crossPollinatedIdeas": [{
    "title": "Netflix for Meal Kits",
    "description": "Subscription service that delivers ready-to-cook meal ingredients with recipe videos you can binge-watch",
    "domains": ["subscription model", "meal delivery", "video streaming"],
    "uniqueness": 4
  }]
}`;
  try {
    const result = await genAI2.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    const text2 = result.text;
    if (!text2) throw new Error("Empty AI response");
    const jsonMatch = text2.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Develop phase generation error:", error);
    throw error;
  }
}
async function generateDeliverPhase(input) {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  const languageInstruction = isPortuguese ? "IMPORTANTE: Responda APENAS em PORTUGU\xCAS DO BRASIL. Todos os textos devem estar em portugu\xEAs." : isSpanish ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol." : isFrench ? "IMPORTANTE: Responda APENAS em FRANC\xCAS. Todos os textos devem estar em franc\xEAs." : "IMPORTANTE: Responda APENAS em INGL\xCAS. Todos os textos devem estar em ingl\xEAs.";
  const ideaDescriptions = input.selectedIdeas.map(
    (idea) => `- ${idea.title}: ${idea.description}`
  ).join("\n");
  const prompt = `Voc\xEA \xE9 um especialista em Design Thinking conduzindo a fase DELIVER - criando um MVP funcional.

${languageInstruction}

POV: ${input.pov}
SECTOR: ${input.sector}

SELECTED IDEAS FOR MVP:
${ideaDescriptions}

Generate a complete MVP package:

1. **MVP Concept**: Name, tagline, 3-5 core features, value proposition

2. **Logo Suggestions** (3-4 options): Description, style, color palette, symbolism

3. **Landing Page Structure**:
   - Compelling headline and subheadline
   - 4-5 sections (hero, problem, solution, features, testimonials/social proof)
   - Final CTA (call to action)

4. **Social Media Lines** (3-4 per platform):
   - Twitter (concise, engaging)
   - LinkedIn (professional, value-focused)
   - Instagram (visual, aspirational)

5. **Test Plan**: Objectives, target users, key metrics, test methods

Return ONLY a JSON object (no markdown):
{
  "mvpConcept": {
    "name": "QuickBite",
    "tagline": "Healthy meals in minutes",
    "coreFeatures": ["AI meal planning", "15-min recipes", "Nutrition tracking"],
    "valueProposition": "..."
  },
  "logoSuggestions": [{
    "description": "Modern fork and clock combined",
    "style": "minimalist",
    "colors": ["#2ECC71", "#34495E"],
    "symbolism": "Speed meets nutrition"
  }],
  "landingPage": {
    "headline": "...",
    "subheadline": "...",
    "sections": [{"title": "...", "content": "...", "cta": "..."}],
    "finalCta": "Start Your Free Trial"
  },
  "socialMediaLines": {
    "twitter": ["..."],
    "linkedin": ["..."],
    "instagram": ["..."]
  },
  "testPlan": {
    "objectives": ["..."],
    "targetUsers": "...",
    "metrics": ["..."],
    "testMethods": ["..."]
  }
}`;
  try {
    const result = await genAI2.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    const text2 = result.text;
    if (!text2) throw new Error("Empty AI response");
    const jsonMatch = text2.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Deliver phase generation error:", error);
    throw error;
  }
}
async function analyzeDFV(input) {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  const languageInstruction = isPortuguese ? "IMPORTANTE: Responda APENAS em PORTUGU\xCAS DO BRASIL. Todos os textos devem estar em portugu\xEAs." : isSpanish ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol." : isFrench ? "IMPORTANTE: Responda APENAS em FRANC\xCAS. Todos os textos devem estar em franc\xEAs." : "IMPORTANTE: Responda APENAS em INGL\xCAS. Todos os textos devem estar em ingl\xEAs.";
  const prompt = `Voc\xEA \xE9 um estrategista de neg\xF3cios analisando um projeto de Design Thinking usando o framework DFV.

${languageInstruction}

POV: ${input.pov}
MVP: ${JSON.stringify(input.mvpConcept, null, 2)}
SETOR: ${input.sector}
IDEIAS: ${JSON.stringify(input.selectedIdeas, null, 2)}

Analise este projeto em tr\xEAs dimens\xF5es:

1. **DESIRABILITY (Desejabilidade)** (0-100): Os usu\xE1rios querem isso?
   - Resolve um problema real e validado?
   - A proposta de valor \xE9 convincente?
   - Os usu\xE1rios escolheriam isso ao inv\xE9s de alternativas?

2. **FEASIBILITY (Viabilidade T\xE9cnica)** (0-100): Conseguimos construir isso?
   - Complexidade t\xE9cnica
   - Requisitos de recursos
   - Tempo para mercado
   - Capacidades da equipe

3. **VIABILITY (Viabilidade de Neg\xF3cio)** (0-100): \xC9 um neg\xF3cio sustent\xE1vel?
   - Potencial de receita
   - Estrutura de custos
   - Vantagem competitiva
   - Tamanho do mercado

Para cada dimens\xE3o, forne\xE7a:
- Score (0-100)
- Pontos Fortes (2-3 pontos)
- Preocupa\xE7\xF5es (2-3 pontos)
- Racioc\xEDnio (1-2 frases explicando o score)

Depois forne\xE7a:
- Avalia\xE7\xE3o geral (overall assessment)
- Top 3-5 recomenda\xE7\xF5es
- Pr\xF3ximos passos (priorizados)

Retorne APENAS um objeto JSON (sem markdown):
{
  "desirabilityScore": 75,
  "feasibilityScore": 60,
  "viabilityScore": 80,
  "analysis": {
    "desirability": {
      "strengths": ["Resolve problema validado", "Proposta de valor clara"],
      "concerns": ["Mercado saturado", "Mudan\xE7a de comportamento do usu\xE1rio necess\xE1ria"],
      "reasoning": "Forte fit produto-mercado baseado no POV, mas o cen\xE1rio competitivo est\xE1 lotado"
    },
    "feasibility": {
      "strengths": ["Tecnologia dispon\xEDvel", "Equipe capacitada"],
      "concerns": ["Complexidade de integra\xE7\xE3o", "Recursos necess\xE1rios"],
      "reasoning": "Vi\xE1vel tecnicamente, mas requer investimento significativo em desenvolvimento"
    },
    "viability": {
      "strengths": ["Bom potencial de receita", "Modelo de neg\xF3cio claro"],
      "concerns": ["Custos iniciais altos", "Competi\xE7\xE3o intensa"],
      "reasoning": "Neg\xF3cio vi\xE1vel com potencial de crescimento, mas precisa de capital inicial"
    }
  },
  "overallAssessment": "Conceito promissor com forte viabilidade mas desafios moderados de viabilidade t\xE9cnica",
  "recommendations": ["Come\xE7ar com MVP", "Validar com 20 usu\xE1rios", "Buscar investimento inicial"],
  "nextSteps": ["Construir landing page", "Executar campanha pr\xE9-lan\xE7amento", "Montar equipe t\xE9cnica"]
}`;
  try {
    const result = await genAI2.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    const text2 = result.text;
    if (!text2) throw new Error("Empty AI response");
    const jsonMatch = text2.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("DFV analysis error:", error);
    throw error;
  }
}

// server/routes.ts
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil"
}) : null;
if (!stripe) {
  console.warn("\u26A0\uFE0F  STRIPE_SECRET_KEY not set - payment features will be disabled");
}
var ADDON_PRICE_IDS = {
  double_diamond_pro: {
    monthly: process.env.STRIPE_PRICE_ADDON_DOUBLE_DIAMOND_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_DOUBLE_DIAMOND_PRO_YEARLY
  },
  export_pro: {
    monthly: process.env.STRIPE_PRICE_ADDON_EXPORT_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_EXPORT_PRO_YEARLY
  },
  ai_turbo: {
    monthly: process.env.STRIPE_PRICE_ADDON_AI_TURBO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_AI_TURBO_YEARLY
  },
  collab_advanced: {
    monthly: process.env.STRIPE_PRICE_ADDON_COLLAB_ADVANCED_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_COLLAB_ADVANCED_YEARLY
  },
  library_premium: {
    monthly: process.env.STRIPE_PRICE_ADDON_LIBRARY_PREMIUM_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ADDON_LIBRARY_PREMIUM_YEARLY
  }
};
function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.session?.userId || !req.session?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  req.user = req.session.user;
  next();
}
function requireProjectAccess(requiredRole = "viewer") {
  return async (req, res, next) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const projectId = req.params.projectId;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID required" });
    }
    try {
      const userId = req.session.userId;
      const ownerProject = await storage.getProject(projectId, userId);
      if (ownerProject) {
        return next();
      }
      const member = await storage.getProjectMember(projectId, userId);
      if (!member) {
        return res.status(403).json({ error: "Access denied" });
      }
      const roleHierarchy = { viewer: 1, editor: 2, owner: 3 };
      const userLevel = roleHierarchy[member.role] || 0;
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
var storage_config = multer.memoryStorage();
var upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit - increased to match express.json
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos de imagem s\xE3o permitidos"));
    }
  }
});
var recentProjectCreations = /* @__PURE__ */ new Map();
var DUPLICATE_PREVENTION_WINDOW_MS = 3e3;
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(recentProjectCreations.entries());
  for (const [key, record] of entries) {
    if (now - record.timestamp > DUPLICATE_PREVENTION_WINDOW_MS) {
      recentProjectCreations.delete(key);
    }
  }
}, 5e3);
function isDuplicateProjectCreation(userId, projectName) {
  const key = `${userId}:${projectName.trim().toLowerCase()}`;
  const existing = recentProjectCreations.get(key);
  if (!existing) {
    return false;
  }
  const now = Date.now();
  const timeSinceCreation = now - existing.timestamp;
  return timeSinceCreation < DUPLICATE_PREVENTION_WINDOW_MS;
}
function recordProjectCreation(userId, projectName) {
  const key = `${userId}:${projectName.trim().toLowerCase()}`;
  recentProjectCreations.set(key, {
    name: projectName,
    userId,
    timestamp: Date.now()
  });
}
async function registerRoutes(app2) {
  const expressModule = await import("express");
  const expressRaw = expressModule.raw || expressModule.default && expressModule.default.raw;
  if (!expressRaw) {
    throw new Error("Failed to load express raw body parser");
  }
  app2.post(
    "/api/stripe-webhook",
    expressRaw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        if (process.env.NODE_ENV === "development") {
          event = req.body;
        } else {
          const rawBody = req.rawBody ?? req.body;
          event = stripe.webhooks.constructEvent(
            rawBody,
            sig ?? "",
            process.env.STRIPE_WEBHOOK_SECRET ?? ""
          );
        }
      } catch (err) {
        console.log("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session2 = event.data.object;
            const metadata = session2.metadata || {};
            const userId = metadata.userId;
            const planId = metadata.planId;
            const billingPeriod = metadata.billingPeriod;
            const addonKey = metadata.addonKey;
            if (!userId) {
              console.warn(
                "[Stripe webhook] checkout.session.completed without userId metadata"
              );
              break;
            }
            if (addonKey && !planId && billingPeriod) {
              await storage.createUserAddon({
                userId,
                addonKey,
                status: "active",
                source: "stripe",
                stripeSubscriptionId: session2.subscription,
                billingPeriod,
                currentPeriodStart: /* @__PURE__ */ new Date(),
                currentPeriodEnd: new Date(
                  Date.now() + (billingPeriod === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1e3
                )
              });
              console.log(
                `\u2705 Add-on ${addonKey} activated for user ${userId} (subscription ${session2.subscription})`
              );
            } else if (planId && billingPeriod) {
              await storage.createUserSubscription({
                userId,
                planId,
                stripeSubscriptionId: session2.subscription,
                status: "active",
                billingPeriod,
                currentPeriodStart: /* @__PURE__ */ new Date(),
                currentPeriodEnd: new Date(
                  Date.now() + (billingPeriod === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1e3
                )
              });
              await storage.updateUser(userId, {
                stripeSubscriptionId: session2.subscription,
                subscriptionPlanId: planId,
                subscriptionStatus: "active"
              });
              console.log(
                `\u2705 Subscription activated for user ${userId}, plan ${planId}`
              );
            }
            break;
          }
          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const subscription = event.data.object;
            const customer = await stripe.customers.retrieve(
              subscription.customer
            );
            if (customer.metadata?.userId) {
              const status = subscription.status === "active" ? "active" : subscription.status === "canceled" ? "canceled" : "expired";
              await storage.updateUser(customer.metadata.userId, {
                subscriptionStatus: status,
                subscriptionEndDate: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null
              });
              const userSub = await storage.getUserActiveSubscription(
                customer.metadata.userId
              );
              if (userSub) {
                await storage.updateUserSubscription(userSub.id, {
                  status,
                  currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null,
                  cancelAtPeriodEnd: subscription.cancel_at_period_end
                });
              }
              await storage.updateUserAddonsByStripeSubscription(
                subscription.id,
                {
                  status,
                  currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null
                }
              );
              console.log(
                `\u2705 Subscription ${status} for user ${customer.metadata.userId}`
              );
            }
            break;
          }
          case "invoice.payment_succeeded": {
            const invoice = event.data.object;
            if (invoice.subscription) {
              const sub = await stripe.subscriptions.retrieve(
                invoice.subscription
              );
              const cust = await stripe.customers.retrieve(
                sub.customer
              );
              if (cust.metadata?.userId) {
                await storage.updateUser(cust.metadata.userId, {
                  subscriptionStatus: "active"
                });
                const userSub = await storage.getUserActiveSubscription(
                  cust.metadata.userId
                );
                if (userSub) {
                  await storage.updateUserSubscription(userSub.id, {
                    status: "active",
                    currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1e3) : null
                  });
                }
                console.log(
                  `\u2705 Recurring payment succeeded for user ${cust.metadata.userId}`
                );
              }
            }
            break;
          }
          case "invoice.payment_failed": {
            const failedInvoice = event.data.object;
            if (failedInvoice.subscription) {
              const sub = await stripe.subscriptions.retrieve(
                failedInvoice.subscription
              );
              const cust = await stripe.customers.retrieve(
                sub.customer
              );
              if (cust.metadata?.userId) {
                await storage.updateUser(cust.metadata.userId, {
                  subscriptionStatus: "expired"
                });
                console.log(
                  `\u26A0\uFE0F Payment failed for user ${cust.metadata.userId}`
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
  app2.get("/api/health", async (_req, res) => {
    try {
      const db2 = (await Promise.resolve().then(() => (init_db(), db_exports))).db;
      await db2.execute(sql3`SELECT 1`);
      res.json({
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: "Database connection failed"
      });
    }
  });
  app2.get("/api/subscription-info", requireAuth, getSubscriptionInfo);
  app2.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const projects2 = await storage.getProjects(userId);
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const project = await storage.getProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });
  app2.get("/api/projects/:id/full", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const projectId = req.params.id;
      const [
        project,
        empathyMaps2,
        personas2,
        interviews2,
        observations2,
        povStatements2,
        hmwQuestions2,
        ideas2,
        prototypes2,
        testPlans2,
        canvasDrawings2,
        phaseCards2,
        benchmarks2,
        dvfAssessments2,
        lovabilityMetrics2,
        projectAnalytics2
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
      res.json({
        project,
        empathyMaps: empathyMaps2,
        personas: personas2,
        interviews: interviews2,
        observations: observations2,
        povStatements: povStatements2,
        hmwQuestions: hmwQuestions2,
        ideas: ideas2,
        prototypes: prototypes2,
        testPlans: testPlans2,
        canvasDrawings: canvasDrawings2,
        phaseCards: phaseCards2,
        benchmarks: benchmarks2,
        dvfAssessments: dvfAssessments2,
        lovabilityMetrics: lovabilityMetrics2,
        projectAnalytics: projectAnalytics2
      });
    } catch (error) {
      console.error("Failed to fetch full project data:", error);
      res.status(500).json({ error: "Failed to fetch project data" });
    }
  });
  app2.post("/api/projects", requireAuth, checkProjectLimit, async (req, res) => {
    try {
      console.log("Creating project - Request body:", req.body);
      console.log("User session:", req.session?.userId ? "authenticated" : "not authenticated");
      const validatedData = insertProjectSchema.parse(req.body);
      console.log("Data validated successfully:", validatedData);
      const userId = req.session.userId;
      if (isDuplicateProjectCreation(userId, validatedData.name)) {
        console.log(`Duplicate project creation attempt blocked for user ${userId}:`, validatedData.name);
        return res.status(409).json({
          error: "Projeto duplicado detectado",
          message: "Voc\xEA j\xE1 criou um projeto com este nome recentemente. Por favor, aguarde alguns segundos antes de tentar novamente."
        });
      }
      recordProjectCreation(userId, validatedData.name);
      const project = await storage.createProject({ ...validatedData, userId });
      console.log("Project created successfully:", project.id);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      if (error && typeof error === "object" && "issues" in error) {
        const validationError = error;
        return res.status(400).json({
          error: "Dados do projeto inv\xE1lidos",
          details: validationError.issues?.map((issue) => ({
            field: issue.path?.join("."),
            message: issue.message
          }))
        });
      }
      res.status(500).json({ error: "Erro interno do servidor. Tente novamente." });
    }
  });
  app2.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, userId, validatedData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      try {
        const existingBackups = await storage.getProjectBackups(req.params.id);
        const lastBackup = existingBackups[0];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
        if (!lastBackup || lastBackup.createdAt && new Date(lastBackup.createdAt) < oneHourAgo) {
          await storage.createProjectBackup(req.params.id, userId, "auto", "Backup autom\xE1tico ap\xF3s atualiza\xE7\xE3o");
        }
      } catch (backupError) {
        console.error("Error creating automatic backup:", backupError);
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });
  app2.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const isAdmin = req.session.user?.role === "admin";
      console.log("[DELETE PROJECT] Request:", {
        projectId: req.params.id,
        userId,
        isAdmin,
        userRole: req.session.user?.role
      });
      let success;
      if (isAdmin) {
        console.log("[DELETE PROJECT] Admin delete - fetching all projects");
        const allProjects = await storage.getAllProjects();
        const project = allProjects.find((p) => p.id === req.params.id);
        console.log("[DELETE PROJECT] Project found:", {
          found: !!project,
          projectUserId: project?.userId
        });
        if (!project) {
          console.log("[DELETE PROJECT] Project not found");
          return res.status(404).json({ error: "Project not found" });
        }
        console.log("[DELETE PROJECT] Calling deleteProject with:", {
          projectId: req.params.id,
          projectUserId: project.userId
        });
        success = await storage.deleteProject(req.params.id, project.userId);
        console.log("[DELETE PROJECT] Delete result:", success);
      } else {
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
  app2.get("/api/projects/:projectId/members", requireAuth, requireProjectAccess("viewer"), async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const members = await storage.getProjectMembers(projectId);
      const membersWithUser = await Promise.all(members.map(async (member) => {
        const user = await storage.getUserById(member.userId);
        return {
          ...member,
          user: user ? { id: user.id, username: user.username, email: user.email } : void 0
        };
      }));
      res.json(membersWithUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project members" });
    }
  });
  app2.post("/api/projects/:projectId/members/invite", requireAuth, loadUserSubscription, checkCollaborationAccess, requireProjectAccess("owner"), async (req, res) => {
    try {
      const { email, role } = req.body;
      const userId = req.session.userId;
      const projectId = req.params.projectId;
      if (!email || !role) {
        return res.status(400).json({ error: "Email and role are required" });
      }
      if (!["editor", "viewer"].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Must be 'editor' or 'viewer'" });
      }
      const limits = req.subscription?.limits;
      if (limits && limits.maxUsersPerTeam !== null && limits.maxUsersPerTeam !== void 0) {
        const project = await storage.getProject(projectId, userId);
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
        const members = await storage.getProjectMembers(projectId);
        const currentTeamSize = 1 + members.length;
        if (currentTeamSize >= limits.maxUsersPerTeam) {
          return res.status(403).json({
            error: "Team member limit reached",
            message: `Seu plano permite at\xE9 ${limits.maxUsersPerTeam} usu\xE1rios por equipe. Fa\xE7a upgrade do plano para adicionar mais membros.`,
            upgrade_required: true
          });
        }
      }
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
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
  app2.delete("/api/projects/:projectId/members/:userId", requireAuth, requireProjectAccess("owner"), async (req, res) => {
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
  app2.patch("/api/projects/:projectId/members/:userId/role", requireAuth, requireProjectAccess("owner"), async (req, res) => {
    try {
      const { role } = req.body;
      if (!role || !["editor", "viewer"].includes(role)) {
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
  app2.get("/api/invites", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
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
  app2.post("/api/invites/:token/accept", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
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
      if (invite.status !== "pending") {
        return res.status(400).json({ error: "Invite already processed" });
      }
      if (new Date(invite.expiresAt) < /* @__PURE__ */ new Date()) {
        await storage.updateProjectInvite(invite.id, { status: "expired" });
        return res.status(400).json({ error: "Invite has expired" });
      }
      await storage.createProjectMember({
        projectId: invite.projectId,
        userId,
        role: invite.role,
        invitedBy: invite.invitedBy
      });
      await storage.updateProjectInvite(invite.id, {
        status: "accepted",
        respondedAt: /* @__PURE__ */ new Date()
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to accept invite" });
    }
  });
  app2.post("/api/invites/:token/decline", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
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
        status: "declined",
        respondedAt: /* @__PURE__ */ new Date()
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to decline invite" });
    }
  });
  app2.get("/api/projects/:projectId/empathy-maps", requireAuth, async (req, res) => {
    try {
      const empathyMaps2 = await storage.getEmpathyMaps(req.params.projectId);
      res.json(empathyMaps2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch empathy maps" });
    }
  });
  app2.post("/api/projects/:projectId/empathy-maps", requireAuth, async (req, res) => {
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
  app2.put("/api/empathy-maps/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/empathy-maps/:id", requireAuth, async (req, res) => {
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
  app2.post("/api/upload/avatar", requireAuth, upload.single("avatar"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const optimizedBuffer = await sharp(req.file.buffer).resize(200, 200, {
        fit: "cover",
        position: "center"
      }).jpeg({
        quality: 85,
        progressive: true
      }).toBuffer();
      const base64Image = optimizedBuffer.toString("base64");
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      res.json({ url: dataUrl });
    } catch (error) {
      console.error("Erro no upload:", error);
      res.status(500).json({ error: "Erro ao processar upload" });
    }
  });
  app2.get("/api/projects/:projectId/personas", requireAuth, async (req, res) => {
    try {
      const personas2 = await storage.getPersonas(req.params.projectId);
      res.json(personas2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });
  app2.post("/api/projects/:projectId/personas", requireAuth, checkPersonaLimit, async (req, res) => {
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
  app2.put("/api/personas/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/personas/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/projects/:projectId/interviews", requireAuth, async (req, res) => {
    try {
      const interviews2 = await storage.getInterviews(req.params.projectId);
      res.json(interviews2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interviews" });
    }
  });
  app2.post("/api/projects/:projectId/interviews", requireAuth, async (req, res) => {
    try {
      console.log("Interview creation request:", {
        projectId: req.params.projectId,
        body: req.body
      });
      const questions = Array.isArray(req.body.questions) ? req.body.questions : [];
      const responses = Array.isArray(req.body.responses) ? req.body.responses : [];
      console.log("Questions/Responses:", { questions, responses });
      const validPairs = questions.map((q, i) => ({
        question: String(q || "").trim(),
        response: String(responses[i] || "").trim()
      })).filter((pair) => pair.question !== "");
      console.log("Valid pairs:", validPairs);
      const dataToValidate = {
        ...req.body,
        projectId: req.params.projectId,
        date: typeof req.body.date === "string" ? new Date(req.body.date) : req.body.date,
        questions: validPairs.map((p) => p.question),
        responses: validPairs.map((p) => p.response)
      };
      console.log("Data to validate:", dataToValidate);
      const validatedData = insertInterviewSchema.parse(dataToValidate);
      console.log("Data validated successfully");
      const interview = await storage.createInterview(validatedData);
      console.log("Interview created:", interview.id);
      res.status(201).json(interview);
    } catch (error) {
      console.error("Interview creation error:", error);
      res.status(400).json({
        error: "Invalid interview data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.put("/api/interviews/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/interviews/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/projects/:projectId/observations", requireAuth, async (req, res) => {
    try {
      const observations2 = await storage.getObservations(req.params.projectId);
      res.json(observations2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch observations" });
    }
  });
  app2.post("/api/projects/:projectId/observations", requireAuth, async (req, res) => {
    try {
      console.log("Creating observation - Request body:", JSON.stringify(req.body, null, 2));
      console.log("Project ID:", req.params.projectId);
      const dataToValidate = {
        ...req.body,
        projectId: req.params.projectId,
        // Converter string de data para Date object se necessário
        date: req.body.date ? new Date(req.body.date) : /* @__PURE__ */ new Date()
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
  app2.put("/api/observations/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/observations/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/projects/:projectId/pov-statements", requireAuth, async (req, res) => {
    try {
      const povStatements2 = await storage.getPovStatements(req.params.projectId);
      res.json(povStatements2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch POV statements" });
    }
  });
  app2.post("/api/projects/:projectId/pov-statements", requireAuth, async (req, res) => {
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
  app2.put("/api/pov-statements/:id", requireAuth, async (req, res) => {
    try {
      const existingPovStatement = await storage.getPovStatement(req.params.id);
      if (!existingPovStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      const validatedData = insertPovStatementSchema.omit({ projectId: true }).partial().parse(req.body);
      const povStatement = await storage.updatePovStatement(req.params.id, validatedData);
      if (!povStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      res.json(povStatement);
    } catch (error) {
      res.status(400).json({ error: "Invalid POV statement data" });
    }
  });
  app2.delete("/api/pov-statements/:id", requireAuth, async (req, res) => {
    try {
      const existingPovStatement = await storage.getPovStatement(req.params.id);
      if (!existingPovStatement) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      const success = await storage.deletePovStatement(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "POV statement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete POV statement" });
    }
  });
  app2.get("/api/projects/:projectId/hmw-questions", requireAuth, async (req, res) => {
    try {
      const hmwQuestions2 = await storage.getHmwQuestions(req.params.projectId);
      res.json(hmwQuestions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch HMW questions" });
    }
  });
  app2.post("/api/projects/:projectId/hmw-questions", requireAuth, async (req, res) => {
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
  app2.put("/api/hmw-questions/:id", requireAuth, async (req, res) => {
    try {
      const existingHmwQuestion = await storage.getHmwQuestion(req.params.id);
      if (!existingHmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      const validatedData = insertHmwQuestionSchema.omit({ projectId: true }).partial().parse(req.body);
      const hmwQuestion = await storage.updateHmwQuestion(req.params.id, validatedData);
      if (!hmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      res.json(hmwQuestion);
    } catch (error) {
      res.status(400).json({ error: "Invalid HMW question data" });
    }
  });
  app2.delete("/api/hmw-questions/:id", requireAuth, async (req, res) => {
    try {
      const existingHmwQuestion = await storage.getHmwQuestion(req.params.id);
      if (!existingHmwQuestion) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      const success = await storage.deleteHmwQuestion(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "HMW question not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete HMW question" });
    }
  });
  app2.get("/api/projects/:projectId/guiding-criteria", requireAuth, async (req, res) => {
    try {
      const criteria = await storage.getGuidingCriteria(req.params.projectId);
      res.json(criteria);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch guiding criteria" });
    }
  });
  app2.post("/api/projects/:projectId/guiding-criteria", requireAuth, async (req, res) => {
    try {
      const validatedData = insertGuidingCriterionSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const criterion = await storage.createGuidingCriterion(validatedData);
      res.status(201).json(criterion);
    } catch (error) {
      res.status(400).json({ error: "Invalid guiding criterion data" });
    }
  });
  app2.put("/api/guiding-criteria/:id", requireAuth, async (req, res) => {
    try {
      const existing = await storage.getGuidingCriterion(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Guiding criterion not found" });
      }
      const validatedData = insertGuidingCriterionSchema.omit({ projectId: true }).partial().parse(req.body);
      const criterion = await storage.updateGuidingCriterion(req.params.id, validatedData);
      if (!criterion) {
        return res.status(404).json({ error: "Guiding criterion not found" });
      }
      res.json(criterion);
    } catch (error) {
      res.status(400).json({ error: "Invalid guiding criterion data" });
    }
  });
  app2.delete("/api/guiding-criteria/:id", requireAuth, async (req, res) => {
    try {
      const existing = await storage.getGuidingCriterion(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Guiding criterion not found" });
      }
      const success = await storage.deleteGuidingCriterion(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Guiding criterion not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete guiding criterion" });
    }
  });
  app2.get("/api/projects/:projectId/ideas", requireAuth, async (req, res) => {
    try {
      const ideas2 = await storage.getIdeas(req.params.projectId);
      res.json(ideas2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ideas" });
    }
  });
  app2.post("/api/projects/:projectId/ideas", requireAuth, async (req, res) => {
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
  app2.put("/api/ideas/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/ideas/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/projects/:projectId/prototypes", requireAuth, async (req, res) => {
    try {
      const prototypes2 = await storage.getPrototypes(req.params.projectId);
      res.json(prototypes2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prototypes" });
    }
  });
  app2.post("/api/projects/:projectId/prototypes", requireAuth, async (req, res) => {
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
  app2.get("/api/projects/:projectId/test-plans", requireAuth, async (req, res) => {
    try {
      const testPlans2 = await storage.getTestPlans(req.params.projectId);
      res.json(testPlans2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test plans" });
    }
  });
  app2.post("/api/projects/:projectId/test-plans", requireAuth, async (req, res) => {
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
  app2.get("/api/test-plans/:testPlanId/results", requireAuth, async (req, res) => {
    try {
      const testResults2 = await storage.getTestResults(req.params.testPlanId);
      res.json(testResults2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });
  app2.post("/api/test-plans/:testPlanId/results", requireAuth, async (req, res) => {
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
  app2.get("/api/users/:userId/projects/:projectId/progress", requireAuth, async (req, res) => {
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
  app2.put("/api/users/:userId/projects/:projectId/progress", requireAuth, async (req, res) => {
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
  app2.get("/api/projects/:projectId/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const stats = await storage.getProjectStats(req.params.projectId, userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project stats" });
    }
  });
  app2.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const projects2 = await storage.getProjects(userId);
      const totalProjects = projects2.length;
      const activeProjects = projects2.filter((p) => p.status === "in_progress").length;
      const completedProjects = projects2.filter((p) => p.status === "completed").length;
      const avgCompletion = projects2.length > 0 ? projects2.reduce((sum, p) => sum + (p.completionRate || 0), 0) / projects2.length : 0;
      res.json({
        totalProjects,
        activeProjects,
        completedProjects,
        avgCompletion: Math.round(avgCompletion),
        recentProjects: projects2.slice(-3).reverse()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });
  app2.get("/api/articles", async (_req, res) => {
    try {
      const articles2 = await storage.getArticles();
      res.json(articles2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });
  app2.get("/api/articles/category/:category", async (req, res) => {
    try {
      const articles2 = await storage.getArticlesByCategory(req.params.category);
      res.json(articles2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by category" });
    }
  });
  app2.get("/api/articles/:id", async (req, res) => {
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
  app2.post("/api/articles", requireAdmin, async (req, res) => {
    try {
      let validatedData = insertArticleSchema.parse(req.body);
      if (!validatedData.titleEn || !validatedData.contentEn) {
        try {
          const translations = await translateArticle({
            title: validatedData.title,
            description: validatedData.description || "",
            content: validatedData.content
          });
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
            contentFr: validatedData.contentFr || translations.contentFr
          };
        } catch (translationError) {
          console.error("Auto-translation error (continuing without translation):", translationError);
        }
      }
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(400).json({ error: "Invalid article data" });
    }
  });
  app2.put("/api/articles/:id", requireAdmin, async (req, res) => {
    try {
      let validatedData = insertArticleSchema.partial().parse(req.body);
      if (validatedData.title || validatedData.description || validatedData.content) {
        const existingArticle = await storage.getArticle(req.params.id);
        if (existingArticle) {
          const needsTranslation = validatedData.title && !validatedData.titleEn || validatedData.description && !validatedData.descriptionEn || validatedData.content && !validatedData.contentEn;
          if (needsTranslation) {
            try {
              const translations = await translateArticle({
                title: validatedData.title || existingArticle.title,
                description: validatedData.description || existingArticle.description || "",
                content: validatedData.content || existingArticle.content
              });
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
                contentFr: validatedData.contentFr || existingArticle.contentFr || translations.contentFr
              };
            } catch (translationError) {
              console.error("Auto-translation error (continuing without translation):", translationError);
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
  app2.delete("/api/articles/:id", requireAdmin, async (req, res) => {
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
  app2.post("/api/admin/translate/article", requireAdmin, async (req, res) => {
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
  app2.post("/api/admin/translate/video", requireAdmin, async (req, res) => {
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
  app2.post("/api/admin/translate/testimonial", requireAdmin, async (req, res) => {
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
  app2.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials2 = await storage.getActiveTestimonials();
      res.json(testimonials2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });
  app2.get("/api/admin/testimonials", requireAdmin, async (_req, res) => {
    try {
      const testimonials2 = await storage.getTestimonials();
      res.json(testimonials2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });
  app2.get("/api/testimonials/:id", async (req, res) => {
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
  app2.post("/api/admin/testimonials", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ error: "Invalid testimonial data" });
    }
  });
  app2.put("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/video-tutorials", async (_req, res) => {
    try {
      const videos = await storage.getVideoTutorials();
      res.json(videos);
    } catch (error) {
      console.error("[ERROR] /api/video-tutorials failed:", error);
      res.status(500).json({ error: "Failed to fetch video tutorials" });
    }
  });
  app2.get("/api/video-tutorials/phase/:phase", async (req, res) => {
    try {
      const videos = await storage.getVideoTutorialsByPhase(req.params.phase);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video tutorials" });
    }
  });
  app2.get("/api/video-tutorials/:id", async (req, res) => {
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
  app2.post("/api/video-tutorials/:id/view", async (req, res) => {
    try {
      await storage.incrementVideoView(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment view" });
    }
  });
  app2.post("/api/admin/video-tutorials", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertVideoTutorialSchema.parse(req.body);
      const video = await storage.createVideoTutorial(validatedData);
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video tutorial:", error);
      res.status(400).json({ error: "Invalid video tutorial data" });
    }
  });
  app2.put("/api/admin/video-tutorials/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/admin/video-tutorials/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/sectors", async (_req, res) => {
    try {
      const sectors = await storage.getActiveIndustrySectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sectors" });
    }
  });
  app2.get("/api/admin/sectors", requireAdmin, async (_req, res) => {
    try {
      const sectors = await storage.getIndustrySectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sectors" });
    }
  });
  app2.post("/api/admin/sectors", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertIndustrySectorSchema.parse(req.body);
      const sector = await storage.createIndustrySector(validatedData);
      res.status(201).json(sector);
    } catch (error) {
      res.status(400).json({ error: "Invalid sector data" });
    }
  });
  app2.put("/api/admin/sectors/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/admin/sectors/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/cases", async (_req, res) => {
    try {
      const cases = await storage.getActiveSuccessCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch success cases" });
    }
  });
  app2.get("/api/cases/sector/:sectorId", async (req, res) => {
    try {
      const cases = await storage.getSuccessCasesBySector(req.params.sectorId);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch success cases" });
    }
  });
  app2.get("/api/admin/cases", requireAdmin, async (_req, res) => {
    try {
      const cases = await storage.getSuccessCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch success cases" });
    }
  });
  app2.post("/api/admin/cases", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSuccessCaseSchema.parse(req.body);
      const successCase = await storage.createSuccessCase(validatedData);
      res.status(201).json(successCase);
    } catch (error) {
      res.status(400).json({ error: "Invalid success case data" });
    }
  });
  app2.put("/api/admin/cases/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/admin/cases/:id", requireAdmin, async (req, res) => {
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
  app2.post("/api/ai/generate-project", requireAuth, loadUserSubscription, checkAiProjectLimits, async (req, res) => {
    try {
      const { sectorId, successCaseId, userProblemDescription, customInspiration, language = "pt" } = req.body;
      if (!sectorId || !userProblemDescription) {
        return res.status(400).json({ error: "Missing required fields: sectorId and userProblemDescription" });
      }
      if (userProblemDescription.length < 50 || userProblemDescription.length > 500) {
        return res.status(400).json({ error: "Problem description must be between 50 and 500 characters" });
      }
      if (customInspiration && customInspiration.length > 300) {
        return res.status(400).json({ error: "Custom inspiration must be under 300 characters" });
      }
      const sector = await storage.getIndustrySectors().then(
        (sectors) => sectors.find((s) => s.id === sectorId)
      );
      if (!sector) {
        return res.status(404).json({ error: "Sector not found" });
      }
      let successCase;
      if (successCaseId && successCaseId.trim()) {
        successCase = await storage.getSuccessCases().then(
          (cases) => cases.find((c) => c.id === successCaseId)
        );
        if (!successCase) {
          return res.status(404).json({ error: "Success case not found" });
        }
      } else {
        successCase = {
          id: "custom",
          name: customInspiration || "Inspira\xE7\xE3o Personalizada",
          company: "Custom",
          sectorId,
          descriptionPt: customInspiration || "Baseado em inspira\xE7\xF5es personalizadas do usu\xE1rio",
          descriptionEn: customInspiration || "Based on user custom inspirations",
          descriptionEs: customInspiration || "Basado en inspiraciones personalizadas del usuario",
          descriptionFr: customInspiration || "Bas\xE9 sur des inspirations personnalis\xE9es de l'utilisateur",
          industry: sector.namePt || "Custom",
          businessModel: "Custom model based on user input",
          targetAudience: "To be defined based on user needs",
          keyFeatures: [],
          successMetrics: "Custom metrics",
          createdAt: /* @__PURE__ */ new Date()
        };
      }
      const { aiGenerationService: aiGenerationService2 } = await Promise.resolve().then(() => (init_aiGenerationService(), aiGenerationService_exports));
      const generatedMVP = await aiGenerationService2.generateCompleteMVP(
        req.session.userId,
        {
          sector,
          successCase,
          userProblemDescription,
          customInspiration,
          language
        }
      );
      const project = await storage.createProject({
        ...generatedMVP.project,
        userId: req.session.userId
      });
      for (const persona of generatedMVP.personas) {
        await storage.createPersona({
          ...persona,
          projectId: project.id
        });
      }
      for (const pov of generatedMVP.povStatements) {
        await storage.createPovStatement({
          ...pov,
          projectId: project.id
        });
      }
      for (const idea of generatedMVP.ideas) {
        await storage.createIdea({
          ...idea,
          projectId: project.id
        });
      }
      console.log(`\u{1F4E6} About to save AI-generated assets for project ${project.id}`);
      try {
        await aiGenerationService2.saveGeneratedAssets(project.id, generatedMVP);
        console.log(`\u2705 AI-generated assets saved successfully for project ${project.id}`);
      } catch (assetError) {
        console.error(`\u274C CRITICAL: Failed to save AI-generated assets for project ${project.id}:`, assetError);
        console.error(`\u274C Asset Error Stack:`, assetError instanceof Error ? assetError.stack : "No stack");
      }
      await storage.updateUserProgress({
        userId: req.session.userId,
        projectId: project.id,
        // Link progress to the generated project
        phase: 5,
        // AI-generated MVP completes all 5 Design Thinking phases
        projectsCompleted: 1,
        totalPoints: 500,
        // Award points for AI-generated project
        badgesEarned: ["ai_pioneer"]
      });
      await incrementAiProjectsUsed(req.session.userId);
      res.json({
        project,
        generationCosts: generatedMVP.generationCosts,
        message: "MVP successfully generated"
      });
    } catch (error) {
      console.error("\u274C [AI Generation Error] Full error:", error);
      console.error("\u274C [AI Generation Error] Stack:", error instanceof Error ? error.stack : "No stack trace");
      console.error("\u274C [AI Generation Error] Message:", error instanceof Error ? error.message : error);
      res.status(500).json({
        error: "Failed to generate project",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error instanceof Error ? error.stack : void 0 : void 0
      });
    }
  });
  app2.get("/api/projects/:projectId/ai-assets", requireAuth, async (req, res) => {
    try {
      const isAdmin = req.session.user?.role === "admin";
      let project;
      if (isAdmin) {
        const allProjects = await storage.getAllProjects();
        project = allProjects.find((p) => p.id === req.params.projectId);
      } else {
        project = await storage.getProject(req.params.projectId, req.session.userId);
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
  app2.get("/api/projects/:projectId/ai-assets/:assetType", requireAuth, async (req, res) => {
    try {
      const isAdmin = req.session.user?.role === "admin";
      let project;
      if (isAdmin) {
        const allProjects = await storage.getAllProjects();
        project = allProjects.find((p) => p.id === req.params.projectId);
      } else {
        project = await storage.getProject(req.params.projectId, req.session.userId);
      }
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const assets = await storage.getAiGeneratedAssets(req.params.projectId);
      const asset = assets.find((a) => a.assetType === req.params.assetType);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI asset" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha s\xE3o obrigat\xF3rios" });
      }
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.getUserByUsername(email);
      }
      if (!user) {
        return res.status(401).json({ error: "Email ou senha inv\xE1lidos" });
      }
      const isValidPassword = await bcrypt2.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Email ou senha inv\xE1lidos" });
      }
      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      req.session.user = {
        id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        role: userWithoutPassword.role,
        createdAt: userWithoutPassword.createdAt || /* @__PURE__ */ new Date()
      };
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha s\xE3o obrigat\xF3rios" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email inv\xE1lido" });
      }
      const existingEmailUser = await storage.getUserByEmail(email);
      if (existingEmailUser) {
        return res.status(400).json({ error: "Este email j\xE1 est\xE1 em uso" });
      }
      const username = email;
      const hashedPassword = await bcrypt2.hash(password, 10);
      const allPlans = await storage.getSubscriptionPlans();
      const freePlan = allPlans.find((p) => p.name.toLowerCase() === "free");
      if (!freePlan) {
        console.error("\u274C Free plan not found in database!");
        console.error("Available plans:", allPlans.map((p) => p.name).join(", "));
        return res.status(500).json({ error: "Erro de configura\xE7\xE3o do sistema. Contate o suporte." });
      }
      const userData = {
        username,
        // Auto-generated from email
        email,
        name,
        // Display name provided by user
        password: hashedPassword,
        // Store hashed password
        role: "user",
        subscriptionPlanId: freePlan.id,
        // Automatically assign Free plan
        subscriptionStatus: "active"
      };
      const user = await storage.createUser(userData);
      console.log(`\u2705 User created successfully with Free plan: ${user.email}`);
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role || "user",
        createdAt: user.createdAt || /* @__PURE__ */ new Date()
      };
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error after signup:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, message: "Conta criada com sucesso!" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Erro ao criar conta. Tente novamente." });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie("dttools.session");
        res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  });
  app2.get("/api/auth/google", passport_config_default.authenticate("google", {
    scope: ["profile", "email"]
  }));
  app2.get(
    "/api/auth/google/callback",
    passport_config_default.authenticate("google", {
      failureRedirect: "/login?error=oauth_failed",
      failureMessage: true
    }),
    (req, res) => {
      if (req.user) {
        const user = req.user;
        req.session.userId = user.id;
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role || "user",
          createdAt: user.createdAt || /* @__PURE__ */ new Date()
        };
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.redirect("/login?error=session_failed");
          }
          res.redirect("/dashboard");
        });
      } else {
        res.redirect("/login?error=no_user");
      }
    }
  );
  app2.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId || !req.session?.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const freshUser = await storage.getUser(req.session.userId);
      if (!freshUser) {
        return res.status(401).json({ error: "User not found" });
      }
      if (freshUser.role !== req.session.user.role) {
        req.session.user = {
          id: freshUser.id,
          username: freshUser.username,
          role: freshUser.role,
          createdAt: freshUser.createdAt || /* @__PURE__ */ new Date()
        };
      }
      const { password: _, ...userWithoutPassword } = freshUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ error: "Failed to check authentication" });
    }
  });
  app2.get("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });
  app2.put("/api/users/profile", requireAuth, async (req, res) => {
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
      if (req.session?.user) {
        req.session.user = {
          ...req.session.user,
          username: user.email
          // Use email as username
        };
      }
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
  app2.get("/api/users", requireAdmin, async (_req, res) => {
    try {
      const users2 = await storage.getUsers();
      const usersWithoutPasswords = users2.map(({ password: _, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", requireAdmin, async (req, res) => {
    try {
      console.log("[Create User] Request body:", req.body);
      const validatedData = insertUserSchema.parse(req.body);
      console.log("[Create User] Validated data:", validatedData);
      if (!validatedData.password) {
        return res.status(400).json({ error: "Password is required" });
      }
      const hashedPassword = await bcrypt2.hash(validatedData.password, 10);
      const userDataWithHashedPassword = {
        ...validatedData,
        password: hashedPassword
      };
      const user = await storage.createUser(userDataWithHashedPassword);
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
  app2.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.put("/api/users/:id/limits", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { customMaxProjects, customMaxDoubleDiamondProjects, customAiChatLimit } = req.body;
      await storage.updateUserLimits(req.params.id, {
        customMaxProjects,
        customMaxDoubleDiamondProjects,
        customAiChatLimit
      });
      res.json({ message: "Limites atualizados com sucesso" });
    } catch (error) {
      console.error("Error updating user limits:", error);
      res.status(500).json({ error: "Failed to update limits" });
    }
  });
  app2.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      console.log(`[API DELETE USER] Starting deletion of user ${req.params.id}`);
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        console.log(`[API DELETE USER] User not found: ${req.params.id}`);
        return res.status(404).json({ error: "User not found" });
      }
      console.log(`[API DELETE USER] \u2705 Successfully deleted user ${req.params.id}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`[API DELETE USER] \u274C EXCEPTION:`, error);
      console.error(`[API DELETE USER] Error code: ${error?.code}`);
      console.error(`[API DELETE USER] Error message: ${error?.message}`);
      console.error(`[API DELETE USER] Error stack:`, error?.stack);
      res.status(500).json({
        error: "Failed to delete user",
        details: {
          message: error?.message,
          code: error?.code,
          constraint: error?.constraint,
          table: error?.table,
          detail: error?.detail,
          stack: error?.stack?.split("\n").slice(0, 5).join("\n")
        }
      });
    }
  });
  app2.get("/api/admin/users/:id/addons", requireAdmin, async (req, res) => {
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
          libraryPremium: addonKeys.has("library_premium")
        },
        raw: activeAddons
      });
    } catch (error) {
      console.error("Error fetching user addons:", error);
      res.status(500).json({ error: "Failed to fetch user addons" });
    }
  });
  app2.put("/api/admin/users/:id/addons", requireAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        doubleDiamondPro,
        exportPro,
        aiTurbo,
        collabAdvanced,
        libraryPremium
      } = req.body || {};
      const currentAddons = await storage.getUserAddons(userId);
      const updateAddon = async (addonKey, enabled) => {
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
              currentPeriodStart: /* @__PURE__ */ new Date(),
              currentPeriodEnd: null
            });
          }
        } else {
          if (activeForKey.length > 0) {
            await Promise.all(
              activeForKey.map(
                (addon) => storage.updateUserAddon(addon.id, { status: "canceled" })
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
        updateAddon("library_premium", libraryPremium)
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
          libraryPremium: addonKeys.has("library_premium")
        },
        raw: activeAddons
      });
    } catch (error) {
      console.error("Error updating user addons:", error);
      res.status(500).json({ error: "Failed to update user addons" });
    }
  });
  app2.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const users2 = await storage.getUsers();
      const projects2 = await storage.getAllProjects();
      const articles2 = await storage.getArticles();
      const doubleDiamondProjects2 = await storage.getAllDoubleDiamondProjects();
      const videos = await storage.getVideoTutorials();
      const testimonials2 = await storage.getTestimonials();
      const plans = await storage.getSubscriptionPlans();
      const stats = {
        totalUsers: users2.length,
        totalProjects: projects2.length,
        totalArticles: articles2.length,
        totalDoubleDiamondProjects: doubleDiamondProjects2.length,
        totalVideos: videos.length,
        totalTestimonials: testimonials2.length,
        totalPlans: plans.length,
        projectsByStatus: {
          in_progress: projects2.filter((p) => p.status === "in_progress").length,
          completed: projects2.filter((p) => p.status === "completed").length
        },
        projectsByPhase: {
          phase1: projects2.filter((p) => p.currentPhase === 1).length,
          phase2: projects2.filter((p) => p.currentPhase === 2).length,
          phase3: projects2.filter((p) => p.currentPhase === 3).length,
          phase4: projects2.filter((p) => p.currentPhase === 4).length,
          phase5: projects2.filter((p) => p.currentPhase === 5).length
        },
        doubleDiamondByPhase: {
          discover: doubleDiamondProjects2.filter((p) => p.currentPhase === "discover").length,
          define: doubleDiamondProjects2.filter((p) => p.currentPhase === "define").length,
          develop: doubleDiamondProjects2.filter((p) => p.currentPhase === "develop").length,
          deliver: doubleDiamondProjects2.filter((p) => p.currentPhase === "deliver").length,
          dfv: doubleDiamondProjects2.filter((p) => p.currentPhase === "dfv").length
        },
        doubleDiamondByStatus: {
          pending: doubleDiamondProjects2.filter((p) => p.discoverStatus === "pending").length,
          in_progress: doubleDiamondProjects2.filter((p) => p.discoverStatus === "in_progress" || p.defineStatus === "in_progress" || p.developStatus === "in_progress" || p.deliverStatus === "in_progress").length,
          completed: doubleDiamondProjects2.filter((p) => p.deliverStatus === "completed").length
        },
        usersByRole: {
          admin: users2.filter((u) => u.role === "admin").length,
          user: users2.filter((u) => u.role === "user").length
        },
        articlesByCategory: {
          empathize: articles2.filter((a) => a.category === "empathize").length,
          define: articles2.filter((a) => a.category === "define").length,
          ideate: articles2.filter((a) => a.category === "ideate").length,
          prototype: articles2.filter((a) => a.category === "prototype").length,
          test: articles2.filter((a) => a.category === "test").length
        },
        articlesWithTranslations: {
          withEnglish: articles2.filter((a) => a.titleEn && a.contentEn).length,
          withSpanish: articles2.filter((a) => a.titleEs && a.contentEs).length,
          withFrench: articles2.filter((a) => a.titleFr && a.contentFr).length,
          fullyTranslated: articles2.filter((a) => a.titleEn && a.contentEn && a.titleEs && a.contentEs && a.titleFr && a.contentFr).length
        }
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });
  app2.get("/api/admin/projects", requireAdmin, async (_req, res) => {
    try {
      const projects2 = await storage.getAllProjects();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });
  app2.get("/api/admin/analytics/summary", requireAdmin, async (_req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics summary" });
    }
  });
  app2.get("/api/admin/analytics/events", requireAdmin, async (req, res) => {
    try {
      const { eventType, userId, startDate, endDate } = req.query;
      const filters = {};
      if (eventType && typeof eventType === "string") filters.eventType = eventType;
      if (userId && typeof userId === "string") filters.userId = userId;
      if (startDate && typeof startDate === "string") filters.startDate = new Date(startDate);
      if (endDate && typeof endDate === "string") filters.endDate = new Date(endDate);
      const events = await storage.getAnalyticsEvents(filters);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics events" });
    }
  });
  app2.get("/api/subscription-plans", async (_req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plans" });
    }
  });
  app2.get("/api/subscription-plans/:id", async (req, res) => {
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
  app2.post("/api/subscription-plans", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSubscriptionPlanSchema.parse(req.body);
      const plan = await storage.createSubscriptionPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ error: "Invalid subscription plan data" });
    }
  });
  app2.put("/api/subscription-plans/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/user/subscription", requireAuth, async (req, res) => {
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
  app2.post("/api/addons/create-checkout-session", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment system not configured. Please contact support." });
      }
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const { addonKey, billingPeriod } = req.body;
      if (!addonKey || !billingPeriod) {
        return res.status(400).json({ error: "Addon key and billing period are required" });
      }
      const priceConfig = ADDON_PRICE_IDS[addonKey];
      const priceId = priceConfig ? billingPeriod === "yearly" ? priceConfig.yearly : priceConfig.monthly : void 0;
      if (!priceId) {
        return res.status(400).json({ error: "Add-on price not configured. Contact support." });
      }
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.username,
          metadata: {
            userId: user.id
          }
        });
        stripeCustomerId = customer.id;
        await storage.updateUser(user.id, { stripeCustomerId });
      }
      const createCheckoutSession = async (customerId) => {
        return await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceId,
              quantity: 1
            }
          ],
          mode: "subscription",
          success_url: `${req.headers.origin}/addons?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/addons`,
          metadata: {
            userId: user.id,
            addonKey,
            billingPeriod
          }
        });
      };
      let session2;
      try {
        session2 = await createCheckoutSession(stripeCustomerId);
      } catch (err) {
        const raw = err?.raw;
        if (raw?.code === "resource_missing" && raw?.param === "customer") {
          console.warn("[Stripe] Customer not found for current API key, recreating customer and retrying checkout...");
          const customer = await stripe.customers.create({
            email: user.username,
            metadata: {
              userId: user.id
            }
          });
          stripeCustomerId = customer.id;
          await storage.updateUser(user.id, { stripeCustomerId });
          session2 = await createCheckoutSession(stripeCustomerId);
        } else {
          throw err;
        }
      }
      res.json({ url: session2.url });
    } catch (error) {
      console.error("Error creating add-on checkout session:", error);
      res.status(500).json({ error: "Failed to create add-on checkout session" });
    }
  });
  app2.post("/api/addons/cancel-subscription", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Stripe not configured" });
      }
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const { addonKey } = req.body;
      if (!addonKey) {
        return res.status(400).json({ error: "Addon key is required" });
      }
      const activeAddons = await storage.getActiveUserAddons(req.user.id);
      const addonsForKey = activeAddons.filter(
        (addon) => addon.addonKey === addonKey && addon.source === "stripe" && addon.stripeSubscriptionId
      );
      if (addonsForKey.length === 0) {
        return res.status(400).json({
          error: "No active Stripe add-on subscription found for this key"
        });
      }
      const uniqueSubscriptions = Array.from(
        new Set(addonsForKey.map((a) => a.stripeSubscriptionId))
      );
      if (process.env.NODE_ENV === "development") {
        await Promise.all(
          uniqueSubscriptions.map(async (subId) => {
            await stripe.subscriptions.cancel(subId);
            await storage.updateUserAddonsByStripeSubscription(subId, {
              status: "canceled",
              currentPeriodEnd: /* @__PURE__ */ new Date()
            });
          })
        );
        return res.json({
          success: true,
          message: "Add-on cancelado imediatamente (ambiente de desenvolvimento)."
        });
      }
      await Promise.all(
        uniqueSubscriptions.map(
          (subId) => stripe.subscriptions.update(subId, { cancel_at_period_end: true })
        )
      );
      res.json({
        success: true,
        message: "Add-on cancelado com sucesso. Ele permanecer\xE1 ativo at\xE9 o fim do per\xEDodo atual de cobran\xE7a."
      });
    } catch (error) {
      console.error("Error canceling add-on subscription:", error);
      res.status(500).json({ error: "Failed to cancel add-on subscription" });
    }
  });
  app2.post("/api/cancel-subscription", requireAuth, async (req, res) => {
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
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
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
  app2.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { messages, context } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }
      if (!context || typeof context.currentPhase !== "number") {
        return res.status(400).json({ error: "Valid context with currentPhase is required" });
      }
      const lastMessage = messages[messages.length - 1];
      const response = await designThinkingGeminiAI.chat(lastMessage.content, context);
      res.json({ message: response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.json({ message: "Desculpe, houve um problema tempor\xE1rio. Tente novamente ou continue usando as ferramentas de Design Thinking dispon\xEDveis na plataforma." });
    }
  });
  app2.post("/api/chat/suggestions", requireAuth, async (req, res) => {
    try {
      const { context, topic } = req.body;
      if (!context || typeof context.currentPhase !== "number") {
        return res.status(400).json({ error: "Valid context with currentPhase is required" });
      }
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic is required" });
      }
      const suggestions = await designThinkingGeminiAI.generateSuggestions(context);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });
  app2.post("/api/projects/:projectId/analyze", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { currentPhase } = req.body;
      const userId = req.session.userId;
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const empathyMaps2 = await storage.getEmpathyMaps(projectId);
      const personas2 = await storage.getPersonas(projectId);
      const interviews2 = await storage.getInterviews(projectId);
      const observations2 = await storage.getObservations(projectId);
      const povStatements2 = await storage.getPovStatements(projectId);
      const hmwQuestions2 = await storage.getHmwQuestions(projectId);
      const ideas2 = await storage.getIdeas(projectId);
      const prototypes2 = await storage.getPrototypes(projectId);
      const testPlans2 = await storage.getTestPlans(projectId);
      const projectData = {
        project,
        empathyMaps: empathyMaps2,
        personas: personas2,
        interviews: interviews2,
        observations: observations2,
        povStatements: povStatements2,
        hmwQuestions: hmwQuestions2,
        ideas: ideas2,
        prototypes: prototypes2,
        testPlans: testPlans2
      };
      const analysis = await designThinkingAI.analyzeProjectPhase(projectData, currentPhase || project.currentPhase);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing project:", error);
      res.status(500).json({ error: "Failed to analyze project" });
    }
  });
  app2.post("/api/projects/:projectId/ai-analysis", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.session.userId;
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const empathyMaps2 = await storage.getEmpathyMaps(projectId);
      const personas2 = await storage.getPersonas(projectId);
      const interviews2 = await storage.getInterviews(projectId);
      const observations2 = await storage.getObservations(projectId);
      const povStatements2 = await storage.getPovStatements(projectId);
      const hmwQuestions2 = await storage.getHmwQuestions(projectId);
      const ideas2 = await storage.getIdeas(projectId);
      const prototypes2 = await storage.getPrototypes(projectId);
      const testPlans2 = await storage.getTestPlans(projectId);
      const testResults2 = [];
      for (const testPlan of testPlans2) {
        const results = await storage.getTestResults(testPlan.id);
        testResults2.push(...results);
      }
      const guidingCriteria2 = await storage.getGuidingCriteria(projectId);
      const analysisData = {
        project,
        empathyMaps: empathyMaps2,
        personas: personas2,
        interviews: interviews2,
        observations: observations2,
        povStatements: povStatements2,
        hmwQuestions: hmwQuestions2,
        ideas: ideas2,
        prototypes: prototypes2,
        testPlans: testPlans2,
        testResults: testResults2,
        guidingCriteria: guidingCriteria2,
        language: req.body?.language
      };
      const analysis = await designThinkingAI.analyzeCompleteProject(analysisData);
      res.json(analysis);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      if (error instanceof Error && error.message.includes("OpenAI")) {
        res.status(503).json({ error: "AI service temporarily unavailable. Please check API configuration." });
      } else {
        res.status(500).json({ error: "Failed to generate AI analysis" });
      }
    }
  });
  app2.get("/api/canvas-drawings/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const drawings = await storage.getCanvasDrawings(projectId);
      res.json(drawings);
    } catch (error) {
      console.error("Error fetching canvas drawings:", error);
      res.status(500).json({ error: "Failed to fetch canvas drawings" });
    }
  });
  app2.post("/api/canvas-drawings", requireAuth, async (req, res) => {
    try {
      const parsed = insertCanvasDrawingSchema.parse(req.body);
      const drawing = await storage.createCanvasDrawing(parsed);
      res.status(201).json(drawing);
    } catch (error) {
      console.error("Error creating canvas drawing:", error);
      res.status(500).json({ error: "Failed to create canvas drawing" });
    }
  });
  app2.put("/api/canvas-drawings/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/canvas-drawings/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/phase-cards/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const cards = await storage.getPhaseCards(projectId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching phase cards:", error);
      res.status(500).json({ error: "Failed to fetch phase cards" });
    }
  });
  app2.post("/api/phase-cards", requireAuth, async (req, res) => {
    try {
      const parsed = insertPhaseCardSchema.parse(req.body);
      const card = await storage.createPhaseCard(parsed);
      res.status(201).json(card);
    } catch (error) {
      console.error("Error creating phase card:", error);
      res.status(500).json({ error: "Failed to create phase card" });
    }
  });
  app2.put("/api/phase-cards/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/phase-cards/:id", requireAuth, async (req, res) => {
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
  app2.post("/api/projects/:projectId/backups", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { description } = req.body;
      const backup = await storage.createProjectBackup(projectId, "manual", description);
      res.status(201).json(backup);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ error: "Failed to create backup" });
    }
  });
  app2.get("/api/projects/:projectId/backups", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const backups = await storage.getProjectBackups(projectId);
      res.json(backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      res.status(500).json({ error: "Failed to fetch backups" });
    }
  });
  app2.get("/api/backups/:id", requireAuth, async (req, res) => {
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
  app2.post("/api/backups/:id/restore", requireAuth, async (req, res) => {
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
  app2.delete("/api/backups/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/benchmarks/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const benchmarks2 = await storage.getBenchmarks(projectId);
      res.json(benchmarks2);
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      res.status(500).json({ error: "Failed to fetch benchmarks" });
    }
  });
  app2.get("/api/benchmarks/detail/:id", requireAuth, async (req, res) => {
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
  app2.post("/api/benchmarks", requireAuth, async (req, res) => {
    try {
      const parsed = insertBenchmarkSchema.parse(req.body);
      const benchmark = await storage.createBenchmark(parsed);
      res.status(201).json(benchmark);
    } catch (error) {
      console.error("Error creating benchmark:", error);
      res.status(500).json({ error: "Failed to create benchmark" });
    }
  });
  app2.put("/api/benchmarks/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/benchmarks/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/benchmark-assessments/:benchmarkId", requireAuth, async (req, res) => {
    try {
      const { benchmarkId } = req.params;
      const assessments = await storage.getBenchmarkAssessments(benchmarkId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching benchmark assessments:", error);
      res.status(500).json({ error: "Failed to fetch benchmark assessments" });
    }
  });
  app2.post("/api/benchmark-assessments", requireAuth, async (req, res) => {
    try {
      const parsed = insertBenchmarkAssessmentSchema.parse(req.body);
      const assessment = await storage.createBenchmarkAssessment(parsed);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating benchmark assessment:", error);
      res.status(500).json({ error: "Failed to create benchmark assessment" });
    }
  });
  app2.put("/api/benchmark-assessments/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/benchmark-assessments/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/dvf-assessments/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const assessments = await storage.getDvfAssessments(projectId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching DVF assessments:", error);
      res.status(500).json({ error: "Failed to fetch DVF assessments" });
    }
  });
  app2.post("/api/dvf-assessments", requireAuth, async (req, res) => {
    try {
      const parsed = insertDvfAssessmentSchema.parse(req.body);
      const assessment = await storage.createDvfAssessment(parsed);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating DVF assessment:", error);
      res.status(500).json({ error: "Failed to create DVF assessment" });
    }
  });
  app2.put("/api/dvf-assessments/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/dvf-assessments/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/lovability-metrics/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const metrics = await storage.getLovabilityMetrics(projectId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching lovability metrics:", error);
      res.status(500).json({ error: "Failed to fetch lovability metrics" });
    }
  });
  app2.post("/api/lovability-metrics", requireAuth, async (req, res) => {
    try {
      const parsed = insertLovabilityMetricSchema.parse(req.body);
      const metric = await storage.createLovabilityMetric(parsed);
      res.status(201).json(metric);
    } catch (error) {
      console.error("Error creating lovability metric:", error);
      res.status(500).json({ error: "Failed to create lovability metric" });
    }
  });
  app2.put("/api/lovability-metrics/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/lovability-metrics/:id", requireAuth, async (req, res) => {
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
  app2.post("/api/project-analytics", requireAuth, async (req, res) => {
    try {
      const parsed = insertProjectAnalyticsSchema.parse(req.body);
      const analytics = await storage.createProjectAnalytics(parsed);
      res.status(201).json(analytics);
    } catch (error) {
      console.error("Error creating project analytics:", error);
      res.status(500).json({ error: "Failed to create project analytics" });
    }
  });
  app2.put("/api/project-analytics/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/competitive-analysis/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const analyses = await storage.getCompetitiveAnalyses(projectId);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching competitive analyses:", error);
      res.status(500).json({ error: "Failed to fetch competitive analyses" });
    }
  });
  app2.post("/api/competitive-analysis", requireAuth, async (req, res) => {
    try {
      const parsed = insertCompetitiveAnalysisSchema.parse(req.body);
      const analysis = await storage.createCompetitiveAnalysis(parsed);
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Error creating competitive analysis:", error);
      res.status(500).json({ error: "Failed to create competitive analysis" });
    }
  });
  app2.put("/api/competitive-analysis/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/competitive-analysis/:id", requireAuth, async (req, res) => {
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
  app2.post("/api/benchmarking/ai-recommendations/:projectId", requireAuth, async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.session.userId;
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const [dvfAssessments2, lovabilityMetrics2, projectAnalytics2, competitiveAnalyses] = await Promise.all([
        storage.getDvfAssessments(projectId),
        storage.getLovabilityMetrics(projectId),
        storage.getProjectAnalytics(projectId),
        storage.getCompetitiveAnalyses(projectId)
      ]);
      const benchmarkingData = {
        projectId: project.id,
        projectName: project.name,
        projectDescription: project.description || void 0,
        // DVF data with calculated scores
        dvfAssessments: dvfAssessments2.map((assessment) => ({
          desirabilityScore: assessment.desirabilityScore || 0,
          feasibilityScore: assessment.feasibilityScore || 0,
          viabilityScore: assessment.viabilityScore || 0,
          recommendation: assessment.recommendation || "modify",
          overallScore: Math.round(((assessment.desirabilityScore || 0) + (assessment.feasibilityScore || 0) + (assessment.viabilityScore || 0)) / 3 * 10) / 10
        })),
        // Lovability metrics
        lovabilityMetrics: lovabilityMetrics2.length > 0 ? {
          npsScore: lovabilityMetrics2[0]?.npsScore || 0,
          satisfactionScore: lovabilityMetrics2[0]?.satisfactionScore || 0,
          engagementRate: lovabilityMetrics2[0]?.engagementTime || 0,
          emotionalDistribution: lovabilityMetrics2[0]?.emotionalDistribution || {},
          overallLovabilityScore: lovabilityMetrics2[0]?.lovabilityScore || 0
        } : void 0,
        // Project analytics
        projectAnalytics: projectAnalytics2 ? {
          completionRate: projectAnalytics2.completionRate || 0,
          totalTimeSpent: projectAnalytics2.totalTimeSpent || 0,
          teamSize: projectAnalytics2.teamSize || 1,
          innovationLevel: projectAnalytics2.innovationLevel || 0,
          overallSuccess: projectAnalytics2.overallSuccess || 0,
          topPerformingTools: projectAnalytics2.topPerformingTools || [],
          timeBottlenecks: projectAnalytics2.timeBottlenecks || []
        } : void 0,
        // Competitive analysis
        competitiveAnalysis: competitiveAnalyses.map((analysis) => {
          const advantagesCount = Array.isArray(analysis.ourAdvantages) ? analysis.ourAdvantages.length : 0;
          const gapsCount = Array.isArray(analysis.functionalGaps) ? analysis.functionalGaps.length : 0;
          return {
            competitorName: analysis.competitorName || "",
            competitorType: analysis.competitorType || "direct",
            marketPosition: analysis.marketPosition || "challenger",
            ourAdvantages: analysis.ourAdvantages || [],
            functionalGaps: analysis.functionalGaps || [],
            competitivenessScore: Math.max(0, Math.min(10, advantagesCount * 2 - gapsCount * 0.5))
          };
        })
      };
      const { designThinkingGeminiAI: designThinkingGeminiAI2 } = await Promise.resolve().then(() => (init_geminiService(), geminiService_exports));
      const recommendations = await designThinkingGeminiAI2.generateBenchmarkingRecommendations(benchmarkingData);
      res.json({
        success: true,
        data: {
          projectInfo: {
            name: project.name,
            description: project.description
          },
          dataCollected: {
            dvfAssessments: dvfAssessments2.length,
            lovabilityMetrics: lovabilityMetrics2.length,
            projectAnalytics: projectAnalytics2 ? 1 : 0,
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
  app2.get("/api/projects/:id/export-pptx", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      console.log(`[PPTX Export] Starting export for project ${id}, user ${userId}`);
      const project = await storage.getProject(id, userId);
      if (!project) {
        console.log(`[PPTX Export] Project not found: ${id}`);
        return res.status(404).json({ error: "Project not found" });
      }
      console.log(`[PPTX Export] Generating PPTX for project: ${project.name}`);
      const pptxService = new PPTXService();
      const pptxBuffer = await pptxService.generateProjectPPTX(id, userId);
      console.log(`[PPTX Export] PPTX generated successfully, size: ${pptxBuffer.length} bytes`);
      const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_DTTools.pptx`;
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", pptxBuffer.length);
      res.end(pptxBuffer);
    } catch (error) {
      console.error("[PPTX Export] Error generating PPTX:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to generate PPTX presentation" });
      }
    }
  });
  app2.get("/api/projects/:id/export-pdf", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      console.log(`[PDF Export] Starting export for project ${id}, user ${userId}`);
      const project = await storage.getProject(id, userId);
      if (!project) {
        console.log(`[PDF Export] Project not found: ${id}`);
        return res.status(404).json({ error: "Project not found" });
      }
      console.log(`[PDF Export] Generating PDF for project: ${project.name}`);
      const pptxService = new PPTXService();
      const pdfBuffer = await pptxService.generateProjectPDF(id, userId);
      console.log(`[PDF Export] PDF generated successfully, size: ${pdfBuffer.length} bytes`);
      const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_DTTools.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (error) {
      console.error("[PDF Export] Error generating PDF:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to generate PDF document" });
      }
    }
  });
  app2.get("/api/projects/:id/export-markdown", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const project = await storage.getProject(id, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const pptxService = new PPTXService();
      const markdown = await pptxService.generateProjectMarkdown(id, userId);
      const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_DTTools.md`;
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", Buffer.byteLength(markdown, "utf8"));
      res.send(markdown);
    } catch (error) {
      console.error("Error generating Markdown:", error);
      res.status(500).json({ error: "Failed to generate Markdown document" });
    }
  });
  app2.get("/api/help", async (req, res) => {
    try {
      const { category, phase, featured } = req.query;
      let articles2 = await storage.getHelpArticles();
      if (category && typeof category === "string") {
        articles2 = articles2.filter((a) => a.category === category);
      }
      if (phase) {
        const phaseNum = parseInt(phase);
        articles2 = articles2.filter((a) => a.phase === phaseNum);
      }
      if (featured === "true") {
        articles2 = articles2.filter((a) => a.featured);
      }
      articles2.sort((a, b) => (a.order || 0) - (b.order || 0));
      res.json(articles2);
    } catch (error) {
      console.error("Error fetching help articles:", error);
      res.status(500).json({ error: "Failed to fetch help articles" });
    }
  });
  app2.get("/api/help/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search query required" });
      }
      const searchTerm = q.toLowerCase();
      const articles2 = await storage.searchHelpArticles(searchTerm);
      res.json(articles2);
    } catch (error) {
      console.error("Error searching help articles:", error);
      res.status(500).json({ error: "Failed to search help articles" });
    }
  });
  app2.get("/api/help/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getHelpArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: "Help article not found" });
      }
      const updatedArticle = await storage.incrementHelpArticleViews(article.id);
      res.json(updatedArticle || article);
    } catch (error) {
      console.error("Error fetching help article:", error);
      res.status(500).json({ error: "Failed to fetch help article" });
    }
  });
  app2.post("/api/help/:id/helpful", async (req, res) => {
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
  app2.get("/api/help/categories/list", async (req, res) => {
    try {
      const articles2 = await storage.getHelpArticles();
      const categorySet = /* @__PURE__ */ new Set();
      articles2.forEach((a) => categorySet.add(a.category));
      const categories = Array.from(categorySet);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching help categories:", error);
      res.status(500).json({ error: "Failed to fetch help categories" });
    }
  });
  app2.post("/api/help", requireAdmin, async (req, res) => {
    try {
      const articleData = req.body;
      const newArticle = await storage.createHelpArticle(articleData);
      res.json(newArticle);
    } catch (error) {
      console.error("Error creating help article:", error);
      res.status(500).json({ error: "Failed to create help article" });
    }
  });
  app2.put("/api/help/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/help/:id", requireAdmin, async (req, res) => {
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
  app2.get("/clear-cache.html", (_req, res) => {
    const clearCachePath = path.join(process.cwd(), "server", "public", "clear-cache.html");
    if (fs.existsSync(clearCachePath)) {
      res.sendFile(clearCachePath);
    } else {
      res.status(404).send("Clear cache page not found");
    }
  });
  app2.post("/api/admin/migrate-subscription-columns", requireAdmin, async (_req, res) => {
    try {
      const db2 = storage.db;
      try {
        await db2.execute(`
          ALTER TABLE subscription_plans 
          ADD COLUMN IF NOT EXISTS included_users INTEGER,
          ADD COLUMN IF NOT EXISTS price_per_additional_user INTEGER
        `);
      } catch (alterError) {
        if (!alterError.message?.includes("already exists")) {
          throw alterError;
        }
      }
      res.json({
        success: true,
        message: "Colunas de usu\xE1rios adicionais criadas com sucesso!"
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
  app2.get("/api/admin/check-subscription-columns", requireAdmin, async (_req, res) => {
    try {
      const db2 = storage.db;
      const result = await db2.execute(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'subscription_plans' 
        AND column_name IN ('included_users', 'price_per_additional_user')
      `);
      const existingColumns = result.rows.map((row) => row.column_name);
      const needsMigration = !existingColumns.includes("included_users") || !existingColumns.includes("price_per_additional_user");
      res.json({
        needsMigration,
        existingColumns,
        message: needsMigration ? "Migra\xE7\xE3o necess\xE1ria - execute /api/admin/migrate-subscription-columns" : "Colunas j\xE1 existem!"
      });
    } catch (error) {
      console.error("Error checking subscription columns:", error);
      res.status(500).json({ error: "Failed to check subscription columns" });
    }
  });
  app2.post("/api/admin/update-subscription-prices", requireAdmin, async (_req, res) => {
    try {
      const proPlan = await storage.getSubscriptionPlanByName("Pro");
      if (proPlan) {
        await storage.updateSubscriptionPlan(proPlan.id, {
          displayName: "Plano Individual",
          priceMonthly: 4e3,
          // R$ 40,00
          priceYearly: 43200
          // R$ 432,00 (10% discount)
        });
      }
      const enterprisePlan = await storage.getSubscriptionPlanByName("Enterprise");
      if (enterprisePlan) {
        await storage.updateSubscriptionPlan(enterprisePlan.id, {
          priceMonthly: 29900,
          // R$ 299,00
          priceYearly: 322920,
          // R$ 3.229,20 (10% discount)
          description: "Plan empresarial com recursos completos (10 usu\xE1rios inclusos)",
          features: ["Tudo do Pro", "10 usu\xE1rios inclusos", "Usu\xE1rios adicionais: R$ 29,90/usu\xE1rio", "Time ilimitado", "Suporte dedicado", "Treinamentos"]
        });
      }
      res.json({
        success: true,
        message: "Pre\xE7os atualizados com sucesso!",
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
  app2.post("/api/admin/create-prenatal-project", requireAdmin, async (req, res) => {
    try {
      const project = await storage.createProject({
        userId: req.session.userId,
        name: "Acesso ao Pr\xE9-Natal na UBS - Zona Leste SP",
        description: "Projeto de Design Thinking focado em melhorar a experi\xEAncia de gestantes ao agendar e realizar consultas de pr\xE9-natal na UBS da Zona Leste de S\xE3o Paulo. Baseado na jornada real de Manuela Oliveira, 26 anos, m\xE3e de uma menina de 5 anos.",
        status: "completed",
        currentPhase: 5,
        completionRate: 100
      });
      await storage.createEmpathyMap({
        projectId: project.id,
        title: "Mapa de Empatia - Manuela Oliveira (Gestante)",
        says: [
          '"Preciso confirmar minha gravidez na UBS"',
          '"N\xE3o consigo ligar, a linha sempre d\xE1 ocupado"',
          '"Preciso come\xE7ar o pr\xE9-natal logo"',
          '"A \xC2ngela me ajudou muito com o agendamento"',
          '"Espero que tudo corra bem com o beb\xEA"'
        ],
        thinks: [
          "Estou preocupada com a sa\xFAde do beb\xEA",
          "Preciso me organizar melhor com o trabalho e a Gabriela",
          "N\xE3o sei se minhas vacinas est\xE3o em dia",
          "Como vou conseguir tempo para todas as consultas?",
          "Preciso preparar o quarto do beb\xEA"
        ],
        does: [
          "Trabalha em loja de departamentos no shopping",
          "Cuida da filha Gabriela (5 anos)",
          "Tenta ligar para UBS v\xE1rias vezes",
          "Recebe visita da ACS em casa",
          "Vai at\xE9 a UBS para consulta"
        ],
        feels: [
          "Ansiosa pela confirma\xE7\xE3o da gravidez",
          "Aliviada quando a ACS a ajuda",
          "Acolhida pela recepcionista Daniela",
          "Confiante com orienta\xE7\xF5es da enfermeira Adriana",
          "Esperan\xE7osa com a chegada do beb\xEA"
        ]
      });
      await storage.createPersona({
        projectId: project.id,
        name: "Manuela Oliveira",
        age: 26,
        occupation: "Vendedora em Loja de Departamentos",
        bio: "Manuela tem 26 anos e mora na Zona Leste de S\xE3o Paulo. Trabalha em uma loja de departamentos em shopping center e \xE9 m\xE3e de Gabriela, de 5 anos. Descobriu recentemente que est\xE1 gr\xE1vida novamente e precisa acessar o pr\xE9-natal na UBS de seu bairro.",
        goals: [
          "Confirmar gravidez e iniciar pr\xE9-natal",
          "Garantir sa\xFAde do beb\xEA",
          "Atualizar vacinas",
          "Conciliar trabalho e consultas",
          "Preparar chegada do beb\xEA"
        ],
        frustrations: [
          "Telefone UBS sempre ocupado",
          "Falta de tempo",
          "N\xE3o saber se est\xE1 tudo bem",
          "Informa\xE7\xF5es confusas",
          "Medo de perder vaga"
        ],
        motivations: [
          "Sa\xFAde do beb\xEA",
          "Ser boa m\xE3e",
          "Apoio da ACS \xC2ngela",
          "Atendimento humanizado",
          "Fam\xEDlia saud\xE1vel"
        ],
        techSavviness: "medium"
      });
      await storage.createObservation({
        projectId: project.id,
        location: "UBS Zona Leste - S\xE3o Paulo",
        context: "Dia de consulta de pr\xE9-natal",
        behavior: "Manuela chega pontualmente, demonstra ansiedade na triagem, faz muitas perguntas para enfermeira, sai tranquila",
        insights: "Acolhimento humanizado \xE9 fundamental. ACS crucial como ponte entre comunidade e UBS",
        date: /* @__PURE__ */ new Date("2025-10-08")
      });
      await storage.createPovStatement({
        projectId: project.id,
        user: "Gestante trabalhadora da Zona Leste",
        need: "Agendar pr\xE9-natal r\xE1pido sem burocracia",
        insight: "Telefone UBS n\xE3o atende mas ACS resolve humanizadamente",
        statement: "Gestantes trabalhadoras precisam de sistema acess\xEDvel e apoio da ACS",
        priority: "high"
      });
      await storage.createHmwQuestion({
        projectId: project.id,
        question: "Como facilitar agendamento sem depender do telefone?",
        context: "Telefone UBS sempre ocupado",
        challenge: "Sistema de agendamento inadequado",
        scope: "service",
        priority: "high",
        category: "Acesso",
        votes: 8
      });
      await storage.createHmwQuestion({
        projectId: project.id,
        question: "Como ampliar papel das ACS no suporte \xE0s gestantes?",
        context: "ACS foi fundamental",
        challenge: "Potencializar agentes comunit\xE1rias",
        scope: "service",
        priority: "high",
        category: "Suporte",
        votes: 6
      });
      const idea1 = await storage.createIdea({
        projectId: project.id,
        title: "App/WhatsApp de Agendamento UBS",
        description: "Chatbot WhatsApp para agendamento de pr\xE9-natal. Gestante escolhe data/hora, recebe confirma\xE7\xE3o autom\xE1tica.",
        category: "Digital",
        desirability: 5,
        viability: 4,
        feasibility: 3,
        confidenceLevel: 4,
        dvfScore: 4,
        dvfAnalysis: "Alta desejabilidade, vi\xE1vel via WhatsApp Business, desafio \xE9 integra\xE7\xE3o com UBS",
        actionDecision: "love_it",
        priorityRank: 1,
        votes: 12
      });
      const idea2 = await storage.createIdea({
        projectId: project.id,
        title: "Capacita\xE7\xE3o e Equipamento para ACS",
        description: "Treinar ACS com tablets para agendamento durante visitas domiciliares.",
        category: "Capacita\xE7\xE3o",
        desirability: 4,
        viability: 4,
        feasibility: 4,
        confidenceLevel: 4,
        dvfScore: 4,
        dvfAnalysis: "Desej\xE1vel pois ACS tem confian\xE7a, vi\xE1vel com investimento",
        actionDecision: "love_it",
        priorityRank: 2,
        votes: 10
      });
      const proto1 = await storage.createPrototype({
        projectId: project.id,
        ideaId: idea1.id,
        name: "Prot\xF3tipo WhatsApp Bot - Agendamento Pr\xE9-Natal",
        type: "digital",
        description: "Fluxo de conversa\xE7\xE3o no WhatsApp. Bot solicita dados, mostra hor\xE1rios, confirma agendamento.",
        materials: ["WhatsApp Business API", "Chatbot platform", "Integra\xE7\xE3o UBS"],
        images: [],
        version: 1,
        feedback: "Gestantes acharam mais f\xE1cil. Solicitaram op\xE7\xE3o de reagendar."
      });
      await storage.createTestPlan({
        projectId: project.id,
        prototypeId: proto1.id,
        name: "Teste WhatsApp Bot",
        objective: "Validar agendamento aut\xF4nomo",
        methodology: "Teste com 10 gestantes Zona Leste",
        participants: 10,
        duration: 15,
        tasks: [
          "Iniciar conversa com bot",
          "Informar dados",
          "Escolher hor\xE1rio",
          "Confirmar agendamento"
        ],
        metrics: [
          "Taxa conclus\xE3o >90%",
          "Tempo <3min",
          "NPS >8"
        ],
        status: "completed"
      });
      res.json({
        success: true,
        message: "Projeto pr\xE9-natal criado com sucesso!",
        projectId: project.id
      });
    } catch (error) {
      console.error("Error creating prenatal project:", error);
      res.status(500).json({ error: "Failed to create prenatal project" });
    }
  });
  app2.get("/api/double-diamond", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const projects2 = await storage.getDoubleDiamondProjects(userId);
      res.json(projects2);
    } catch (error) {
      console.error("Error fetching Double Diamond projects:", error);
      res.status(500).json({ error: "Failed to fetch Double Diamond projects" });
    }
  });
  app2.get("/api/double-diamond/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
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
  app2.post("/api/double-diamond", requireAuth, checkDoubleDiamondLimit, async (req, res) => {
    try {
      const userId = req.session.userId;
      const validatedData = insertDoubleDiamondProjectSchema.parse(req.body);
      const cleanedData = {
        ...validatedData,
        sectorId: validatedData.sectorId && validatedData.sectorId.trim() !== "" ? validatedData.sectorId : void 0,
        successCaseId: validatedData.successCaseId && validatedData.successCaseId.trim() !== "" ? validatedData.successCaseId : void 0,
        customSuccessCase: validatedData.customSuccessCase && validatedData.customSuccessCase.trim() !== "" ? validatedData.customSuccessCase : void 0,
        description: validatedData.description && validatedData.description.trim() !== "" ? validatedData.description : void 0,
        userId
      };
      const project = await storage.createDoubleDiamondProject(cleanedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating Double Diamond project:", error);
      res.status(500).json({ error: "Failed to create Double Diamond project" });
    }
  });
  app2.patch("/api/double-diamond/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const updatesInput = req.body;
      const validatedUpdates = insertDoubleDiamondProjectSchema.partial().parse(updatesInput);
      const cleanedUpdates = {
        ...validatedUpdates,
        sectorId: validatedUpdates.sectorId && validatedUpdates.sectorId.trim() !== "" ? validatedUpdates.sectorId : void 0,
        successCaseId: validatedUpdates.successCaseId && validatedUpdates.successCaseId.trim() !== "" ? validatedUpdates.successCaseId : void 0,
        customSuccessCase: validatedUpdates.customSuccessCase && validatedUpdates.customSuccessCase.trim() !== "" ? validatedUpdates.customSuccessCase : void 0,
        description: validatedUpdates.description && validatedUpdates.description.trim() !== "" ? validatedUpdates.description : void 0
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
  app2.delete("/api/double-diamond/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
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
  app2.post("/api/double-diamond/:id/generate/discover", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
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
      const language = req.body.language || "pt-BR";
      const result = await generateDiscoverPhase({
        sector: sectorName,
        successCase: caseName,
        targetAudience: project.targetAudience || "",
        problemStatement: project.problemStatement || "",
        language
      });
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        discoverPainPoints: result.painPoints,
        discoverInsights: result.insights,
        discoverUserNeeds: result.userNeeds,
        discoverEmpathyMap: result.empathyMap,
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
  app2.post("/api/double-diamond/:id/generate/define", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
      if (!project.discoverPainPoints || !project.discoverUserNeeds || !project.discoverInsights) {
        return res.status(400).json({ error: "Discover phase must be completed first" });
      }
      const language = req.body.language || "pt-BR";
      const result = await generateDefinePhase({
        painPoints: project.discoverPainPoints,
        userNeeds: project.discoverUserNeeds,
        insights: project.discoverInsights,
        language
      });
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        definePovStatements: result.povStatements,
        defineHmwQuestions: result.hmwQuestions,
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
  app2.post("/api/double-diamond/:id/generate/develop", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
      if (!project.defineSelectedPov || !project.defineSelectedHmw) {
        return res.status(400).json({ error: "Define phase must be completed and POV/HMW selected" });
      }
      let sectorName = "General";
      if (project.sectorId) {
        const sector = await storage.getIndustrySector(project.sectorId);
        if (sector) sectorName = sector.name;
      }
      const language = req.body.language || "pt-BR";
      const result = await generateDevelopPhase({
        selectedPov: project.defineSelectedPov,
        selectedHmw: project.defineSelectedHmw,
        sector: sectorName,
        language
      });
      const topIdeas = result.ideas.slice(0, 3);
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        developIdeas: result.ideas,
        developCrossPollinatedIdeas: result.crossPollinatedIdeas,
        developSelectedIdeas: topIdeas,
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
  app2.post("/api/double-diamond/:id/generate/deliver", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      let project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
      if ((!project.developSelectedIdeas || project.developSelectedIdeas.length === 0) && project.developIdeas && project.developIdeas.length > 0) {
        console.log(`[AUTO-FIX] Auto-selecting top 3 ideas for project ${project.id}`);
        const topIdeas = project.developIdeas.slice(0, 3);
        project = await storage.updateDoubleDiamondProject(project.id, userId, {
          developSelectedIdeas: topIdeas
        });
      }
      if (!project.developSelectedIdeas || project.developSelectedIdeas.length === 0) {
        return res.status(400).json({ error: "Develop phase must be completed and ideas selected" });
      }
      let sectorName = "General";
      if (project.sectorId) {
        const sector = await storage.getIndustrySector(project.sectorId);
        if (sector) sectorName = sector.name;
      }
      const language = req.body.language || "pt-BR";
      const result = await generateDeliverPhase({
        selectedIdeas: project.developSelectedIdeas,
        pov: project.defineSelectedPov || "",
        sector: sectorName,
        language
      });
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        deliverMvpConcept: result.mvpConcept,
        deliverLogoSuggestions: result.logoSuggestions,
        deliverLandingPage: result.landingPage,
        deliverSocialMediaLines: result.socialMediaLines,
        deliverTestPlan: result.testPlan,
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
  app2.post("/api/double-diamond/:id/generate/dfv", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
      if (!project.deliverMvpConcept) {
        return res.status(400).json({ error: "Deliver phase must be completed first" });
      }
      let sectorName = "General";
      if (project.sectorId) {
        const sector = await storage.getIndustrySector(project.sectorId);
        if (sector) sectorName = sector.name;
      }
      const language = req.body.language || "pt-BR";
      const result = await analyzeDFV({
        pov: project.defineSelectedPov || "",
        mvpConcept: project.deliverMvpConcept,
        sector: sectorName,
        selectedIdeas: project.developSelectedIdeas || [],
        language
      });
      const fullAnalysis = {
        ...result.analysis,
        recommendations: result.recommendations || [],
        nextSteps: result.nextSteps || []
      };
      const updated = await storage.updateDoubleDiamondProject(project.id, userId, {
        dfvDesirabilityScore: result.desirabilityScore,
        dfvFeasibilityScore: result.feasibilityScore,
        dfvViabilityScore: result.viabilityScore,
        dfvAnalysis: fullAnalysis,
        dfvFeedback: result.overallAssessment,
        generationCount: (project.generationCount || 0) + 1
      });
      res.json(updated);
    } catch (error) {
      console.error("Error generating DFV analysis:", error);
      res.status(500).json({ error: "Failed to generate DFV analysis" });
    }
  });
  app2.get("/api/admin/double-diamond", requireAdmin, async (_req, res) => {
    try {
      const projects2 = await storage.getAllDoubleDiamondProjects();
      res.json(projects2);
    } catch (error) {
      console.error("Error fetching all Double Diamond projects:", error);
      res.status(500).json({ error: "Failed to fetch Double Diamond projects" });
    }
  });
  app2.delete("/api/admin/double-diamond/:id", requireAdmin, async (req, res) => {
    try {
      const allProjects = await storage.getAllDoubleDiamondProjects();
      const project = allProjects.find((p) => p.id === req.params.id);
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
  app2.patch("/api/admin/double-diamond/:id", requireAdmin, async (req, res) => {
    try {
      const allProjects = await storage.getAllDoubleDiamondProjects();
      const project = allProjects.find((p) => p.id === req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
      const updatesInput = req.body;
      const validatedUpdates = insertDoubleDiamondProjectSchema.partial().parse(updatesInput);
      const cleanedUpdates = {
        ...validatedUpdates,
        sectorId: validatedUpdates.sectorId && validatedUpdates.sectorId.trim() !== "" ? validatedUpdates.sectorId : void 0,
        successCaseId: validatedUpdates.successCaseId && validatedUpdates.successCaseId.trim() !== "" ? validatedUpdates.successCaseId : void 0,
        customSuccessCase: validatedUpdates.customSuccessCase && validatedUpdates.customSuccessCase.trim() !== "" ? validatedUpdates.customSuccessCase : void 0,
        description: validatedUpdates.description && validatedUpdates.description.trim() !== "" ? validatedUpdates.description : void 0
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
  app2.get("/api/industry-sectors", async (req, res) => {
    try {
      const sectors = await storage.listIndustrySectors();
      res.json(sectors);
    } catch (error) {
      console.error("Error fetching industry sectors:", error);
      res.status(500).json({ error: "Failed to fetch industry sectors" });
    }
  });
  app2.get("/api/success-cases", async (req, res) => {
    try {
      const successCases2 = await storage.listSuccessCases();
      res.json(successCases2);
    } catch (error) {
      console.error("Error fetching success cases:", error);
      res.status(500).json({ error: "Failed to fetch success cases" });
    }
  });
  app2.post("/api/double-diamond/:id/export", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { projectName } = req.body;
      const userId = req.session.userId;
      const project = await storage.getDoubleDiamondProject(id, userId);
      if (!project) {
        return res.status(404).json({ success: false, error: "Projeto n\xE3o encontrado" });
      }
      const user = await storage.getUserById(userId);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        const plan = user?.subscriptionPlanId ? await storage.getSubscriptionPlan(user.subscriptionPlanId) : null;
        const maxExports = user?.customMaxDoubleDiamondExports ?? plan?.maxDoubleDiamondExports;
        if (maxExports !== null && maxExports !== void 0) {
          const exportsThisMonth = await storage.getDoubleDiamondExportsByMonth(userId);
          if (exportsThisMonth.length >= maxExports) {
            return res.status(403).json({
              success: false,
              error: `Limite de ${maxExports} exporta\xE7\xF5es mensais atingido. Atualize seu plano para exportar mais projetos.`
            });
          }
        }
      }
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
        generationTimestamp: /* @__PURE__ */ new Date(),
        businessModelBase: null,
        userId
      };
      const createdProject = await storage.createProject(newProject);
      try {
        if (project.discoverEmpathyMap) {
          const em = project.discoverEmpathyMap;
          await storage.createEmpathyMap({
            projectId: createdProject.id,
            title: `Mapa de Empatia - ${project.name}`,
            says: Array.isArray(em.says) ? em.says : [],
            thinks: Array.isArray(em.thinks) ? em.thinks : [],
            does: Array.isArray(em.does) ? em.does : [],
            feels: Array.isArray(em.feels) ? em.feels : []
          });
        }
        if (project.definePovStatements && Array.isArray(project.definePovStatements)) {
          for (const item of project.definePovStatements) {
            await storage.createPovStatement({
              projectId: createdProject.id,
              user: item.user ?? "",
              need: item.need ?? "",
              insight: item.insight ?? "",
              statement: item.fullStatement ?? `${item.user ?? "Usu\xE1rio"} precisa ${item.need ?? "..."} porque ${item.insight ?? "..."}`
            });
          }
        }
        if (project.defineHmwQuestions && Array.isArray(project.defineHmwQuestions)) {
          for (const item of project.defineHmwQuestions) {
            await storage.createHmwQuestion({
              projectId: createdProject.id,
              question: item.question ?? "",
              context: null,
              challenge: null,
              scope: "product",
              priority: "medium",
              category: item.focusArea ?? null,
              votes: 0
            });
          }
        }
        if (project.developSelectedIdeas && Array.isArray(project.developSelectedIdeas)) {
          for (const idea of project.developSelectedIdeas) {
            await storage.createIdea({
              projectId: createdProject.id,
              title: idea.title ?? "Ideia",
              description: idea.description ?? "",
              category: idea.category ?? null
            });
          }
        }
        if (project.deliverMvpConcept) {
          const mvp = project.deliverMvpConcept;
          const descriptionParts = [];
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
            feedback: null
          });
        }
        if (project.deliverTestPlan) {
          const tp = project.deliverTestPlan;
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
            status: "planned"
          });
        }
      } catch (phaseError) {
        console.error("Erro ao mapear dados do Double Diamond para projeto principal:", phaseError);
      }
      try {
        if (project.dfvDesirabilityScore != null && project.dfvFeasibilityScore != null && project.dfvViabilityScore != null) {
          const desirability = Number(project.dfvDesirabilityScore) || 0;
          const feasibility = Number(project.dfvFeasibilityScore) || 0;
          const viability = Number(project.dfvViabilityScore) || 0;
          const desirabilityScore = Math.round(desirability / 20 * 10) / 10;
          const feasibilityScore = Math.round(feasibility / 20 * 10) / 10;
          const viabilityScore = Math.round(viability / 20 * 10) / 10;
          const overallScore = Math.round((desirabilityScore + feasibilityScore + viabilityScore) / 3 * 10) / 10;
          let recommendation = "modify";
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
            desirabilityEvidence: project.dfvAnalysis?.desirability?.reasoning || project.dfvFeedback || null,
            userFeedback: project.dfvFeedback || null,
            marketDemand: 0,
            feasibilityScore,
            feasibilityEvidence: project.dfvAnalysis?.feasibility?.reasoning || null,
            technicalComplexity: "medium",
            resourceRequirements: [],
            timeToImplement: 0,
            viabilityScore,
            viabilityEvidence: project.dfvAnalysis?.viability?.reasoning || null,
            businessModel: null,
            costEstimate: 0,
            revenueProjection: 0,
            overallScore,
            recommendation,
            nextSteps: project.dfvAnalysis?.recommendations || [],
            risksIdentified: []
          });
        }
      } catch (dfvError) {
        console.error("Erro ao criar avalia\xE7\xE3o DVF para projeto principal:", dfvError);
      }
      await storage.createDoubleDiamondExport({
        userId,
        doubleDiamondProjectId: id,
        exportedProjectId: createdProject.id,
        status: "completed",
        exportType: "full"
      });
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
  app2.get("/api/double-diamond/:id/export/pdf", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const project = await storage.getDoubleDiamondProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ error: "Double Diamond project not found" });
      }
      const { generateDoubleDiamondPDF: generateDoubleDiamondPDF2 } = await Promise.resolve().then(() => (init_double_diamond_pdf(), double_diamond_pdf_exports));
      const pdfBuffer = await generateDoubleDiamondPDF2(project);
      const fileName = `${project.name.replace(/[^a-z0-9]/gi, "_")}_DoubleDiamond.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating Double Diamond PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
init_storage();
import fsSync from "fs";
import path4 from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
var log2 = (...args) => {
  console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] - index.ts:18`, ...args);
};
var MemStore = MemoryStore(session);
var PgStore = ConnectPgSimple(session);
var app = express2();
app.set("trust proxy", 1);
var parseFrontendUrls = (envVar) => {
  if (!envVar) return [];
  return envVar.split(",").map((url) => url.trim()).filter((url) => {
    const isHttps = url.startsWith("https://");
    const isLocalhost = url.startsWith("http://localhost");
    const hasWildcard = url.includes("*");
    if (hasWildcard) {
      console.error(`[CORS] Invalid FRONTEND_URL  wildcards not allowed: ${url} - index.ts:57`);
      return false;
    }
    if (!isHttps && !isLocalhost) {
      console.error(`[CORS] Invalid FRONTEND_URL  must use HTTPS: ${url} - index.ts:62`);
      return false;
    }
    return true;
  }).map((url) => url.replace(/\/$/, ""));
};
var configuredFrontendUrls = parseFrontendUrls(process.env.FRONTEND_URL);
if (configuredFrontendUrls.length > 0) {
  console.log(`[CORS] Configured frontend URLs: ${configuredFrontendUrls.join(", ")} - index.ts:73`);
}
app.use((req, res, next) => {
  const origin = req.headers.origin?.replace(/\/$/, "");
  const allowedOrigins = [
    "https://designthinkingtools.com",
    "https://www.designthinkingtools.com",
    "https://dttools.app",
    "https://www.dttools.app",
    "http://localhost:5000",
    "http://localhost:5173",
    ...configuredFrontendUrls
  ];
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(compression({
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
  // Compression level (1-9, 6 is good balance)
}));
var apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // 100 requests per IP per window
  message: "Muitas requisi\xE7\xF5es. Tente novamente em 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 5,
  // Only 5 login attempts per window
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false
});
app.use(express2.json({
  limit: "50mb",
  verify: (req, res, buf, encoding) => {
    if (req.originalUrl === "/api/stripe-webhook") {
      req.rawBody = buf;
    }
  }
}));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}
var isProduction = process.env.NODE_ENV === "production";
var sessionStore = isProduction && process.env.DATABASE_URL ? new PgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  tableName: "user_sessions"
}) : new MemStore({
  checkPeriod: 864e5
  // prune expired entries every 24h
});
app.use(session({
  name: "dttools.session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: "auto",
    // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3,
    // 24 hours
    sameSite: "lax"
    // Lax for all environments to ensure cookies are accepted in local dev
  }
}));
setupPassport();
app.use(passport_config_default.initialize());
app.use(passport_config_default.session());
app.use("/uploads", express2.static("public/uploads"));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log2(logLine);
    }
  });
  next();
});
(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path4.dirname(__filename);
  const isProductionBuild = __filename.includes("/dist/index.js") || process.env.NODE_ENV === "production";
  if (process.env.DATABASE_URL) {
    log2("\u{1F527} [STARTUP] Ensuring database schema is correct...");
    try {
      const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      log2("\u{1F50D} [STARTUP] Verifying critical schema columns...");
      await db2.execute(`
        ALTER TABLE IF EXISTS subscription_plans 
        ADD COLUMN IF NOT EXISTS included_users INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS subscription_plans 
        ADD COLUMN IF NOT EXISTS price_per_additional_user INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS users 
        ADD COLUMN IF NOT EXISTS custom_max_projects INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS users 
        ADD COLUMN IF NOT EXISTS custom_max_double_diamond_projects INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS users 
        ADD COLUMN IF NOT EXISTS custom_max_double_diamond_exports INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS users 
        ADD COLUMN IF NOT EXISTS custom_ai_chat_limit INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS subscription_plans 
        ADD COLUMN IF NOT EXISTS max_double_diamond_projects INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS subscription_plans 
        ADD COLUMN IF NOT EXISTS max_double_diamond_exports INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS subscription_plans 
        ADD COLUMN IF NOT EXISTS max_double_diamond_exports INTEGER;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS users 
        ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'local';
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS users 
        ADD COLUMN IF NOT EXISTS google_id TEXT;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS users 
        ALTER COLUMN password DROP NOT NULL;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS title_en TEXT;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS title_es TEXT;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS title_fr TEXT;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS description_en TEXT;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS description_es TEXT;
      `);
      await db2.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS description_fr TEXT;
      `);
      log2("\u2705 [STARTUP] Schema columns verified and ready");
    } catch (schemaError) {
      log2("\u26A0\uFE0F  [STARTUP] Schema verification skipped (table may not exist yet):", String(schemaError).substring(0, 100));
    }
  }
  const server = await registerRoutes(app);
  if (process.env.DATABASE_URL) {
    (async () => {
      let migrationCompleted = false;
      const isProduction2 = process.env.NODE_ENV === "production" || process.env.RENDER === "true";
      if (!isProduction2) {
        try {
          log2("\u{1F527} Running database migration in background...");
          const migrationPromise = new Promise((resolve, reject) => {
            const migration = spawn("npm", ["run", "db:push"], {
              stdio: "inherit"
              // Inherit to avoid buffer issues
            });
            const timeoutId = setTimeout(() => {
              migration.kill("SIGTERM");
              reject(new Error("Migration timeout after 90s"));
            }, 9e4);
            migration.on("close", (code) => {
              clearTimeout(timeoutId);
              if (code === 0) {
                log2("\u2705 Database migration completed");
                resolve();
              } else {
                reject(new Error(`Migration exited with code ${code}`));
              }
            });
            migration.on("error", (error) => {
              clearTimeout(timeoutId);
              reject(error);
            });
          });
          await migrationPromise;
          migrationCompleted = true;
        } catch (error) {
          log2("\u26A0\uFE0F  Database migration error (may already be applied):", String(error).substring(0, 100));
        }
      } else {
        log2("\u23ED\uFE0F  Skipping db:push in production (schema should already be applied)");
      }
      try {
        await initializeDefaultData();
        log2("\u2705 Default data initialized");
      } catch (error) {
        log2("\u26A0\uFE0F  Default data initialization error:", String(error).substring(0, 100));
      }
    })();
  } else {
    try {
      await initializeDefaultData();
    } catch (error) {
      log2("\u26A0\uFE0F  Development initialization error:", String(error).substring(0, 100));
    }
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  const isDevelopment = process.env.NODE_ENV !== "production" && !isProductionBuild;
  log2(`Environment check: NODE_ENV=${process.env.NODE_ENV}, isDevelopment=${isDevelopment}, isProductionBuild=${isProductionBuild}`);
  if (isDevelopment) {
    log2("Setting up Vite development server");
    const { setupVite: setupVite2 } = await init_vite().then(() => vite_exports);
    await setupVite2(app, server);
  } else {
    log2("Setting up static file serving for production");
    const distPath = path4.join(__dirname, "..", "client", "dist");
    log2(`Serving static files from: ${distPath}`);
    if (!fsSync.existsSync(distPath)) {
      throw new Error(`Could not find the build directory: ${distPath}`);
    }
    app.use(express2.static(distPath, {
      etag: true,
      lastModified: true,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else if (filepath.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        } else if (filepath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css; charset=UTF-8");
        }
      }
    }));
    app.use("*", (req, res) => {
      if (req.originalUrl.includes(".")) {
        res.status(404).send("File not found");
      } else {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.sendFile(path4.resolve(distPath, "index.html"));
      }
    });
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0"
    },
    () => {
      log2(`serving on port ${port}`);
    }
  );
})();
