import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// AI Automation: Industry Sectors (for AI-guided onboarding)
export const industrySectors = pgTable("industry_sectors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // English name (canonical)
  namePt: text("name_pt").notNull(), // Portuguese name
  nameEn: text("name_en"), // English translation
  nameEs: text("name_es"), // Spanish translation
  nameFr: text("name_fr"), // French translation
  description: text("description"),
  icon: text("icon"), // Lucide icon name
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// AI Automation: Success Cases (for AI-guided onboarding)
export const successCases = pgTable("success_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Case name (e.g., "Airbnb")
  company: text("company").notNull(), // Company name
  sectorId: varchar("sector_id").references(() => industrySectors.id),
  descriptionPt: text("description_pt"),
  descriptionEn: text("description_en"),
  descriptionEs: text("description_es"),
  descriptionFr: text("description_fr"),
  logoUrl: text("logo_url"),
  foundedYear: integer("founded_year"),
  keyInnovation: text("key_innovation"), // Main innovation/differentiator
  businessModel: text("business_model"), // 'marketplace', 'saas', 'freemium', etc.
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// AI Automation: Generated Assets (logos, landing pages, etc.)
export const aiGeneratedAssets = pgTable("ai_generated_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  assetType: text("asset_type").notNull(), // 'logo', 'landing_page', 'social_media', 'persona', 'idea', 'business_model'
  content: text("content"), // JSON or HTML depending on type
  metadata: jsonb("metadata"), // Extra information
  storageUrl: text("storage_url"), // If image/file stored in object storage
  generationCost: real("generation_cost"), // Cost in credits/tokens
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Core project entity
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("in_progress"), // in_progress, completed
  currentPhase: integer("current_phase").default(1), // 1-5 phases
  completionRate: real("completion_rate").default(0),
  // AI Automation fields
  sectorId: varchar("sector_id").references(() => industrySectors.id),
  successCaseId: varchar("success_case_id").references(() => successCases.id),
  userProblemDescription: text("user_problem_description"), // User's initial problem description
  aiGenerated: boolean("ai_generated").default(false), // Was this project AI-generated?
  generationTimestamp: timestamp("generation_timestamp"),
  businessModelBase: jsonb("business_model_base"), // AI-generated business model canvas
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Phase 1: Empathize - Empathy Maps
export const empathyMaps = pgTable("empathy_maps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  says: jsonb("says").default([]), // Array of strings
  thinks: jsonb("thinks").default([]),
  does: jsonb("does").default([]),
  feels: jsonb("feels").default([]),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Phase 1: Empathize - Personas
export const personas = pgTable("personas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  age: integer("age"),
  occupation: text("occupation"),
  bio: text("bio"),
  goals: jsonb("goals").default([]),
  frustrations: jsonb("frustrations").default([]),
  motivations: jsonb("motivations").default([]),
  techSavviness: text("tech_savviness"), // low, medium, high
  avatar: text("avatar"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Phase 1: Empathize - User Interviews
export const interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  participantName: text("participant_name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // minutes
  questions: jsonb("questions").default([]),
  responses: jsonb("responses").default([]),
  insights: text("insights"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 1: Empathize - Field Observations
export const observations = pgTable("observations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  location: text("location").notNull(),
  context: text("context").notNull(),
  behavior: text("behavior").notNull(),
  insights: text("insights"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 2: Define - POV Statements
export const povStatements = pgTable("pov_statements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  user: text("user").notNull(), // user description
  need: text("need").notNull(), // user need
  insight: text("insight").notNull(), // surprising insight
  statement: text("statement").notNull(), // complete POV statement
  priority: text("priority").default("medium"), // low, medium, high
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 2: Define - How Might We questions
export const hmwQuestions = pgTable("hmw_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  question: text("question").notNull(),
  context: text("context"),
  challenge: text("challenge"),
  scope: text("scope").default("product"), // feature, product, service, experience, process
  priority: text("priority").default("medium"), // low, medium, high
  category: text("category"), // categorization
  votes: integer("votes").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 3: Ideate - Ideas
export const ideas = pgTable("ideas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  // Legacy fields (kept for compatibility)
  feasibility: integer("feasibility"), // 1-5 scale - now maps to DVF Feasibility/Exequibilidade
  impact: integer("impact"), // 1-5 scale
  votes: integer("votes").default(0),
  // DVF (Desejabilidade, Viabilidade, Exequibilidade) System
  desirability: integer("desirability"), // 1-5 scale - user need satisfaction
  viability: integer("viability"), // 1-5 scale - business/profit potential  
  // feasibility already exists above - technical implementability
  confidenceLevel: integer("confidence_level"), // 1-5 scale - overall confidence
  dvfScore: real("dvf_score"), // Calculated: (desirability + viability + feasibility) / 3
  dvfAnalysis: text("dvf_analysis"), // Detailed justification for scores
  actionDecision: text("action_decision").default("evaluate"), // love_it, leave_it, change_it, evaluate
  // Priority and iteration fields
  priorityRank: integer("priority_rank"), // 1-n ranking based on DVF analysis
  iterationNotes: text("iteration_notes"), // Notes for "change_it" decisions
  status: text("status").default("idea"), // idea, selected, prototype, tested
  canvasData: jsonb("canvas_data"), // Fabric.js canvas data for drawings/sketches
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 4: Prototype - Prototypes
export const prototypes = pgTable("prototypes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  ideaId: varchar("idea_id").references(() => ideas.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // paper, digital, physical, storyboard, canvas
  description: text("description").notNull(),
  materials: jsonb("materials").default([]),
  images: jsonb("images").default([]),
  canvasData: jsonb("canvas_data"), // Konva.js canvas data for interactive prototypes
  version: integer("version").default(1),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Canvas Drawings - For reusable sketches across phases
export const canvasDrawings = pgTable("canvas_drawings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  phase: integer("phase").notNull(), // 1-5 phases where this drawing is used
  canvasType: text("canvas_type").notNull(), // fabric, konva
  canvasData: jsonb("canvas_data").notNull(), // Canvas library data (Fabric.js or Konva.js)
  thumbnailData: text("thumbnail_data"), // Base64 encoded thumbnail for preview
  tags: jsonb("tags").default([]), // Tags for categorization
  isTemplate: boolean("is_template").default(false), // Can be used as a template
  parentId: varchar("parent_id"), // For drawing iterations - will be set to reference same table later
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Phase 5: Test - Test Plans
export const testPlans = pgTable("test_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  prototypeId: varchar("prototype_id").references(() => prototypes.id),
  name: text("name").notNull(),
  objective: text("objective").notNull(),
  methodology: text("methodology").notNull(),
  participants: integer("participants").notNull(),
  duration: integer("duration"), // minutes
  tasks: jsonb("tasks").default([]),
  metrics: jsonb("metrics").default([]),
  status: text("status").default("planned"), // planned, running, completed
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Phase 5: Test - Test Results
export const testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testPlanId: varchar("test_plan_id").references(() => testPlans.id).notNull(),
  participantId: text("participant_id").notNull(),
  taskResults: jsonb("task_results").default([]),
  feedback: text("feedback"),
  successRate: real("success_rate"),
  completionTime: integer("completion_time"), // minutes
  insights: text("insights"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User Progress and Gamification
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  phase: integer("phase").notNull(), // 1-5
  completedTools: jsonb("completed_tools").default([]),
  badges: jsonb("badges").default([]),
  points: integer("points").default(0),
  timeSpent: integer("time_spent").default(0), // minutes
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Users for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password"), // hashed password - optional for OAuth users
  role: text("role").notNull().default("user"), // admin, user
  // OAuth fields
  provider: text("provider").default("local"), // 'local', 'google'
  googleId: text("google_id"), // Google OAuth ID
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
  subscriptionStatus: text("subscription_status").default("active"), // active, canceled, expired, trialing
  subscriptionEndDate: timestamp("subscription_end_date"),
  aiProjectsUsed: integer("ai_projects_used").default(0), // Track AI-generated projects used
  // Custom limits (override plan limits) - null = use plan limit
  customMaxProjects: integer("custom_max_projects"), // null = use plan limit
  customMaxDoubleDiamondProjects: integer("custom_max_double_diamond_projects"), // null = use plan limit
  customMaxDoubleDiamondExports: integer("custom_max_double_diamond_exports"), // null = use plan limit
  customAiChatLimit: integer("custom_ai_chat_limit"), // null = use plan limit
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  priceMonthly: integer("price_monthly").notNull(), // in cents
  priceYearly: integer("price_yearly").notNull(), // in cents
  stripePriceIdMonthly: text("stripe_price_id_monthly"),
  stripePriceIdYearly: text("stripe_price_id_yearly"),
  maxProjects: integer("max_projects"), // null for unlimited
  maxPersonasPerProject: integer("max_personas_per_project"), // null for unlimited
  maxUsersPerTeam: integer("max_users_per_team"), // null for unlimited
  maxAiProjects: integer("max_ai_projects"), // null for unlimited AI-generated projects
  includedUsers: integer("included_users"), // number of users included in base price (null if not applicable)
  pricePerAdditionalUser: integer("price_per_additional_user"), // price in cents for each additional user beyond includedUsers
  aiChatLimit: integer("ai_chat_limit"), // null for unlimited
  maxDoubleDiamondProjects: integer("max_double_diamond_projects"), // null for unlimited Double Diamond projects
  maxDoubleDiamondExports: integer("max_double_diamond_exports"), // null for unlimited exports to main system
  libraryArticlesCount: integer("library_articles_count"), // null for all articles
  features: jsonb("features").default([]), // Array of feature strings
  exportFormats: jsonb("export_formats").default([]), // Array of export formats (pdf, png, csv)
  hasCollaboration: boolean("has_collaboration").default(false),
  hasPermissionManagement: boolean("has_permission_management").default(false),
  hasSharedWorkspace: boolean("has_shared_workspace").default(false),
  hasCommentsAndFeedback: boolean("has_comments_and_feedback").default(false),
  hasSso: boolean("has_sso").default(false),
  hasCustomApi: boolean("has_custom_api").default(false),
  hasCustomIntegrations: boolean("has_custom_integrations").default(false),
  has24x7Support: boolean("has_24x7_support").default(false),
  order: integer("order").default(0), // for display ordering
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User Subscriptions History
export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => subscriptionPlans.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(), // active, canceled, expired, trialing, incomplete
  billingPeriod: text("billing_period").notNull(), // monthly, yearly
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// User Add-ons - per-feature upgrades (Double Diamond Pro, Export Pro, IA Turbo, etc.)
export const userAddons = pgTable("user_addons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  addonKey: text("addon_key").notNull(), // 'double_diamond_pro', 'export_pro', 'ai_turbo', etc.
  status: text("status").notNull().default("active"), // active, canceled, expired, trialing
  source: text("source").notNull().default("stripe"), // stripe, admin, manual
  stripeSubscriptionId: text("stripe_subscription_id"),
  billingPeriod: text("billing_period"), // monthly, yearly, null for one-time/unknown
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Articles for Design Thinking library
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(), // pt-BR (default)
  content: text("content").notNull(), // pt-BR (default)
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
  category: text("category").notNull(), // empathize, define, ideate, prototype, test
  author: text("author").notNull(),
  tags: jsonb("tags").default([]), // Array of tags
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Testimonials for landing page
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  // Testimonial text in different languages
  testimonialPt: text("testimonial_pt").notNull(), // Portuguese (default)
  testimonialEn: text("testimonial_en"),
  testimonialEs: text("testimonial_es"),
  testimonialFr: text("testimonial_fr"),
  avatarUrl: text("avatar_url"),
  rating: integer("rating").default(5), // 1-5 stars
  order: integer("order").default(0), // for display ordering
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Video Tutorials for learning Design Thinking
export const videoTutorials = pgTable("video_tutorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleEs: text("title_es"),
  titleFr: text("title_fr"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionEs: text("description_es"),
  descriptionFr: text("description_fr"),
  phase: text("phase").notNull(), // 'overview', 'empathize', 'define', 'ideate', 'prototype', 'test'
  duration: text("duration"), // e.g., '3-4 min'
  youtubeUrl: text("youtube_url"), // URL do vídeo no YouTube
  thumbnailUrl: text("thumbnail_url"),
  keywords: text("keywords").array().default(sql`'{}'::text[]`), // Array of SEO keywords
  tags: text("tags").array().default(sql`'{}'::text[]`), // User-facing category tags
  scriptId: text("script_id"), // Reference to script in markdown file
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmpathyMapSchema = createInsertSchema(empathyMaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPersonaSchema = createInsertSchema(personas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInterviewSchema = createInsertSchema(interviews, {
  questions: z.array(z.string()).optional(),
  responses: z.array(z.string()).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertObservationSchema = createInsertSchema(observations).omit({
  id: true,
  createdAt: true,
});

export const insertPovStatementSchema = createInsertSchema(povStatements).omit({
  id: true,
  createdAt: true,
});

export const insertHmwQuestionSchema = createInsertSchema(hmwQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
  createdAt: true,
});

export const insertPrototypeSchema = createInsertSchema(prototypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestPlanSchema = createInsertSchema(testPlans).omit({
  id: true,
  createdAt: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVideoTutorialSchema = createInsertSchema(videoTutorials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAddonSchema = createInsertSchema(userAddons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCanvasDrawingSchema = createInsertSchema(canvasDrawings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Profile update schema - excludes sensitive fields
export const updateProfileSchema = createInsertSchema(users).omit({
  id: true,
  username: true,
  password: true,
  role: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  subscriptionPlanId: true,
  subscriptionStatus: true,
  subscriptionEndDate: true,
  createdAt: true,
}).partial(); // Make all fields optional for partial updates

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type EmpathyMap = typeof empathyMaps.$inferSelect;
export type InsertEmpathyMap = z.infer<typeof insertEmpathyMapSchema>;

export type Persona = typeof personas.$inferSelect;
export type InsertPersona = z.infer<typeof insertPersonaSchema>;

export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;

export type Observation = typeof observations.$inferSelect;
export type InsertObservation = z.infer<typeof insertObservationSchema>;

export type PovStatement = typeof povStatements.$inferSelect;
export type InsertPovStatement = z.infer<typeof insertPovStatementSchema>;

export type HmwQuestion = typeof hmwQuestions.$inferSelect;
export type InsertHmwQuestion = z.infer<typeof insertHmwQuestionSchema>;

export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = z.infer<typeof insertIdeaSchema>;

export type Prototype = typeof prototypes.$inferSelect;
export type InsertPrototype = z.infer<typeof insertPrototypeSchema>;

export type TestPlan = typeof testPlans.$inferSelect;
export type InsertTestPlan = z.infer<typeof insertTestPlanSchema>;

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type VideoTutorial = typeof videoTutorials.$inferSelect;
export type InsertVideoTutorial = z.infer<typeof insertVideoTutorialSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;

export type UserAddon = typeof userAddons.$inferSelect;
export type InsertUserAddon = z.infer<typeof insertUserAddonSchema>;

export type CanvasDrawing = typeof canvasDrawings.$inferSelect;
export type InsertCanvasDrawing = z.infer<typeof insertCanvasDrawingSchema>;

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// AI Analysis Types
export interface ProjectAnalysisData {
  project: Project;
  empathyMaps: EmpathyMap[];
  personas: Persona[];
  interviews: Interview[];
  observations: Observation[];
  povStatements: PovStatement[];
  hmwQuestions: HmwQuestion[];
  ideas: Idea[];
  prototypes: Prototype[];
  testPlans: TestPlan[];
  testResults: TestResult[];
}

export interface PhaseAnalysis {
  phase: number;
  phaseName: string;
  completeness: number;
  quality: number;
  insights: string[];
  gaps: string[];
  recommendations: string[];
  strengths: string[];
}

export interface AIProjectAnalysis {
  executiveSummary: string;
  maturityScore: number;
  overallInsights: string[];
  attentionPoints: string[];
  priorityNextSteps: string[];
  phaseAnalyses: PhaseAnalysis[];
  consistency: {
    score: number;
    issues: string[];
    strengths: string[];
  };
  alignment: {
    problemSolutionAlignment: number;
    researchInsightsAlignment: number;
    comments: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

// Phase 2: Define - Guiding Criteria (Critérios Norteadores)
export const guidingCriteria = pgTable("guiding_criteria", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  importance: text("importance").default("medium"),
  tags: jsonb("tags").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Kanban Phase Cards - Cards that can move between project phases
export const phaseCards = pgTable("phase_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  phase: integer("phase").notNull().default(1), // 1-5 phases (Empatizar, Definir, Idear, Prototipar, Testar)
  status: text("status").default("todo"), // todo, in_progress, done
  priority: text("priority").default("medium"), // low, medium, high
  assignee: text("assignee"), // Optional assignee
  tags: jsonb("tags").default([]), // Array of tags for categorization
  dueDate: timestamp("due_date"),
  position: integer("position").default(0), // Order within the phase column
  color: text("color").default("blue"), // Card color for visual organization
  attachments: jsonb("attachments").default([]), // File attachments metadata
  comments: jsonb("comments").default([]), // Comments/notes
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Benchmarking - Compare Design Thinking maturity across organizations
export const benchmarks = pgTable("benchmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  industry: text("industry").notNull(), // tech, healthcare, finance, retail, etc.
  companySize: text("company_size").notNull(), // startup, small, medium, large, enterprise
  maturityScores: jsonb("maturity_scores").default({}), // { empathize: 4, define: 3, ideate: 5, prototype: 2, test: 3 }
  benchmarkType: text("benchmark_type").notNull().default("industry"), // industry, internal, custom
  targetScores: jsonb("target_scores").default({}), // Goals for each phase
  improvementAreas: jsonb("improvement_areas").default([]), // Array of focus areas
  recommendations: jsonb("recommendations").default([]), // AI-generated suggestions
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Individual benchmark assessments
export const benchmarkAssessments = pgTable("benchmark_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  benchmarkId: varchar("benchmark_id").references(() => benchmarks.id).notNull(),
  phase: integer("phase").notNull(), // 1-5 for DT phases
  criteria: text("criteria").notNull(), // What is being assessed
  currentScore: real("current_score").notNull(), // 1-5 rating
  targetScore: real("target_score").notNull(), // Goal score
  industryAverage: real("industry_average"), // Benchmark comparison
  evidence: text("evidence"), // Supporting evidence for the score
  improvementPlan: text("improvement_plan"), // How to improve
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Double Diamond Exports - Track exports from DD to main system
export const doubleDiamondExports = pgTable("double_diamond_exports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  doubleDiamondProjectId: varchar("double_diamond_project_id").references(() => doubleDiamondProjects.id, { onDelete: 'cascade' }).notNull(),
  exportedProjectId: varchar("exported_project_id").references(() => projects.id, { onDelete: 'cascade' }), // Created project in main system
  exportType: text("export_type").default("full"), // full, partial
  includedPhases: jsonb("included_phases").default([]), // Which phases were exported: empathize, define, ideate, prototype, test
  exportCost: real("export_cost").default(0), // Cost in credits
  status: text("status").default("completed"), // completed, failed, processing
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertDoubleDiamondExportSchema = createInsertSchema(doubleDiamondExports).omit({
  id: true,
  createdAt: true,
});

export type DoubleDiamondExport = typeof doubleDiamondExports.$inferSelect;
export type InsertDoubleDiamondExport = z.infer<typeof insertDoubleDiamondExportSchema>;

// Insert schemas for benchmarking
export const insertBenchmarkSchema = createInsertSchema(benchmarks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBenchmarkAssessmentSchema = createInsertSchema(benchmarkAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insert schemas for phase cards
export const insertPhaseCardSchema = createInsertSchema(phaseCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types for phase cards
export type PhaseCard = typeof phaseCards.$inferSelect;
export type InsertPhaseCard = z.infer<typeof insertPhaseCardSchema>;

// DVF Assessment - Desirability, Feasibility, Viability evaluation for ideas
export const dvfAssessments = pgTable("dvf_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  itemType: text("item_type").notNull(), // idea, prototype, solution, etc.
  itemId: varchar("item_id").notNull(), // Reference to the evaluated item
  itemName: text("item_name").notNull(),
  
  // Desirability - User desirability
  desirabilityScore: real("desirability_score").notNull().default(0), // 1-5 scale
  desirabilityEvidence: text("desirability_evidence"), // Supporting evidence
  userFeedback: text("user_feedback"), // Direct user feedback
  marketDemand: real("market_demand").default(0), // Market demand indicator
  
  // Feasibility - Technical feasibility  
  feasibilityScore: real("feasibility_score").notNull().default(0), // 1-5 scale
  feasibilityEvidence: text("feasibility_evidence"),
  technicalComplexity: text("technical_complexity"), // low, medium, high
  resourceRequirements: jsonb("resource_requirements").default([]), // Required resources
  timeToImplement: integer("time_to_implement"), // Estimated time in days
  
  // Viability - Economic viability
  viabilityScore: real("viability_score").notNull().default(0), // 1-5 scale  
  viabilityEvidence: text("viability_evidence"),
  businessModel: text("business_model"), // How it generates value
  costEstimate: real("cost_estimate"), // Implementation cost
  revenueProjection: real("revenue_projection"), // Expected revenue
  
  // Overall DVF analysis
  overallScore: real("overall_score").default(0), // Average of the three pillars
  recommendation: text("recommendation"), // proceed, modify, stop
  nextSteps: jsonb("next_steps").default([]), // Recommended actions
  risksIdentified: jsonb("risks_identified").default([]), // Potential risks
  
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Lovability Metrics - Emotional response and satisfaction tracking
export const lovabilityMetrics = pgTable("lovability_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  itemType: text("item_type").notNull(), // idea, prototype, solution
  itemId: varchar("item_id").notNull(), // Reference to the item being evaluated
  itemName: text("item_name").notNull(),
  
  // Core Metrics
  npsScore: real("nps_score").default(0), // -100 to 100
  satisfactionScore: real("satisfaction_score").default(0), // 0-10
  retentionRate: real("retention_rate").default(0), // 0-100%
  engagementTime: real("engagement_time").default(0), // minutes
  
  // Emotional Distribution
  emotionalDistribution: jsonb("emotional_distribution").default({}), // delight, satisfaction, neutral, frustration percentages
  
  // Feedback Analysis
  positiveComments: jsonb("positive_comments").default([]),
  negativeComments: jsonb("negative_comments").default([]),
  improvementSuggestions: jsonb("improvement_suggestions").default([]),
  
  // User Behavior
  userTestingSessions: integer("user_testing_sessions").default(0),
  completionRate: real("completion_rate").default(0), // 0-100%
  errorRate: real("error_rate").default(0), // 0-100%
  supportTickets: integer("support_tickets").default(0),
  
  // Qualitative Insights
  emotionalStory: text("emotional_story"),
  userPersonas: jsonb("user_personas").default([]),
  keyMoments: jsonb("key_moments").default([]),
  painPoints: jsonb("pain_points").default([]),
  
  // Overall Assessment
  lovabilityScore: real("lovability_score").default(0), // 0-10 calculated score
  recommendations: jsonb("recommendations").default([]),
  
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Project Analytics - Detailed usage and success metrics
export const projectAnalytics = pgTable("project_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  
  // Usage metrics
  totalTimeSpent: integer("total_time_spent").default(0), // minutes
  timePerPhase: jsonb("time_per_phase").default({}), // { phase1: 120, phase2: 90, ... }
  toolsUsed: jsonb("tools_used").default([]), // List of tools/features used
  toolUsageCount: jsonb("tool_usage_count").default({}), // Usage frequency per tool
  
  // Progress metrics
  completionRate: real("completion_rate").default(0), // 0-100%
  phasesCompleted: jsonb("phases_completed").default([]), // Which phases are done
  stageProgressions: integer("stage_progressions").default(0), // Times moved between phases
  iterationsCount: integer("iterations_count").default(0), // Number of iterations
  
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
  originalityScore: real("originality_score").default(0), // 1-10
  feasibilityScore: real("feasibility_score").default(0), // 1-10
  impactPotential: real("impact_potential").default(0), // 1-10
  marketFit: real("market_fit").default(0), // 1-10
  
  // Success metrics
  overallSuccess: real("overall_success").default(0), // 0-100%
  userSatisfaction: real("user_satisfaction").default(0), // 0-10
  goalAchievement: real("goal_achievement").default(0), // 0-100%
  innovationLevel: real("innovation_level").default(0), // 1-5
  
  // Key insights
  topPerformingTools: jsonb("top_performing_tools").default([]),
  timeBottlenecks: jsonb("time_bottlenecks").default([]),
  successFactors: jsonb("success_factors").default([]),
  improvementAreas: jsonb("improvement_areas").default([]),
  
  lastUpdated: timestamp("last_updated").default(sql`now()`),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Competitive Analysis - External benchmarking data
export const competitiveAnalysis = pgTable("competitive_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  
  // Competitor info
  competitorName: text("competitor_name").notNull(), // Miro, Figma, Notion, etc.
  competitorType: text("competitor_type").notNull(), // direct, indirect, substitute
  marketPosition: text("market_position"), // leader, challenger, niche
  
  // Feature comparison
  features: jsonb("features").default({}), // Feature matrix comparison
  functionalGaps: jsonb("functional_gaps").default([]), // What they lack
  functionalOverages: jsonb("functional_overages").default([]), // What they overdo
  
  // Pricing comparison
  pricingModel: text("pricing_model"), // freemium, subscription, one-time
  pricePoints: jsonb("price_points").default([]), // Their pricing tiers
  valueProposition: text("value_proposition"), // Their main value prop
  
  // Market gaps
  underservedOutcomes: jsonb("underserved_outcomes").default([]), // Market gaps
  overservedOutcomes: jsonb("overserved_outcomes").default([]), // Overcomplicated areas
  
  // Our positioning
  ourAdvantages: jsonb("our_advantages").default([]), // Where we're better
  ourDisadvantages: jsonb("our_disadvantages").default([]), // Where we lack
  recommendations: jsonb("recommendations").default([]), // Strategic recommendations
  
  analysisDate: timestamp("analysis_date").default(sql`now()`),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Project Backups - Automatic versioning and recovery
export const projectBackups = pgTable("project_backups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  
  // Backup metadata
  backupType: text("backup_type").notNull(), // auto, manual
  description: text("description"),
  
  // Project snapshot at backup time
  projectSnapshot: jsonb("project_snapshot").notNull(), // Complete project data
  
  // Statistics at backup time
  phaseSnapshot: integer("phase_snapshot"), // Current phase at backup
  completionSnapshot: real("completion_snapshot"), // Completion rate at backup
  itemCount: integer("item_count"), // Total items in backup
  
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Help/Wiki System - Knowledge base articles
export const helpArticles = pgTable("help_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly identifier
  content: text("content").notNull(), // Markdown content
  category: text("category").notNull(), // inicio-rapido, fases, exportacao, etc
  subcategory: text("subcategory"), // Optional subcategory
  phase: integer("phase"), // 1-5 if related to specific DT phase
  tags: jsonb("tags").default([]), // Array of searchable tags
  searchKeywords: jsonb("search_keywords").default([]), // Keywords for search
  featured: boolean("featured").default(false), // Show in main help
  author: text("author").notNull().default("DTTools Team"), // Article author
  viewCount: integer("view_count").default(0),
  helpful: integer("helpful").default(0), // Helpful votes
  order: integer("order").default(0), // Display order within category
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Insert schemas for new tables
export const insertDvfAssessmentSchema = createInsertSchema(dvfAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLovabilityMetricSchema = createInsertSchema(lovabilityMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectAnalyticsSchema = createInsertSchema(projectAnalytics).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertCompetitiveAnalysisSchema = createInsertSchema(competitiveAnalysis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  analysisDate: true,
});

// Export types for benchmarking
export type Benchmark = typeof benchmarks.$inferSelect;
export type InsertBenchmark = z.infer<typeof insertBenchmarkSchema>;

export type BenchmarkAssessment = typeof benchmarkAssessments.$inferSelect;
export type InsertBenchmarkAssessment = z.infer<typeof insertBenchmarkAssessmentSchema>;

// Export types for new benchmarking features
export type DvfAssessment = typeof dvfAssessments.$inferSelect;
export type InsertDvfAssessment = z.infer<typeof insertDvfAssessmentSchema>;

export type LovabilityMetric = typeof lovabilityMetrics.$inferSelect;
export type InsertLovabilityMetric = z.infer<typeof insertLovabilityMetricSchema>;

export type ProjectAnalytics = typeof projectAnalytics.$inferSelect;
export type InsertProjectAnalytics = z.infer<typeof insertProjectAnalyticsSchema>;

export type CompetitiveAnalysis = typeof competitiveAnalysis.$inferSelect;
export type InsertCompetitiveAnalysis = z.infer<typeof insertCompetitiveAnalysisSchema>;

export const insertProjectBackupSchema = createInsertSchema(projectBackups).omit({
  id: true,
  createdAt: true,
});

export type ProjectBackup = typeof projectBackups.$inferSelect;
export type InsertProjectBackup = z.infer<typeof insertProjectBackupSchema>;

export const insertHelpArticleSchema = createInsertSchema(helpArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  helpful: true,
});

export type HelpArticle = typeof helpArticles.$inferSelect;
export type InsertHelpArticle = z.infer<typeof insertHelpArticleSchema>;

// AI Automation schemas and types
export const insertIndustrySectorSchema = createInsertSchema(industrySectors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type IndustrySector = typeof industrySectors.$inferSelect;
export type InsertIndustrySector = z.infer<typeof insertIndustrySectorSchema>;

export const insertSuccessCaseSchema = createInsertSchema(successCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SuccessCase = typeof successCases.$inferSelect;
export type InsertSuccessCase = z.infer<typeof insertSuccessCaseSchema>;

export const insertAiGeneratedAssetSchema = createInsertSchema(aiGeneratedAssets).omit({
  id: true,
  createdAt: true,
});

export type AiGeneratedAsset = typeof aiGeneratedAssets.$inferSelect;
export type InsertAiGeneratedAsset = z.infer<typeof insertAiGeneratedAssetSchema>;

// Analytics Events - Track system-wide metrics
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(), // 'signup', 'login', 'project_created', 'ai_generation', 'export_pdf', etc.
  userId: varchar("user_id").references(() => users.id),
  projectId: varchar("project_id").references(() => projects.id),
  metadata: jsonb("metadata"), // Additional event data
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

// Project Members - Collaboration/Teams
export const projectMembers = pgTable("project_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").notNull().default("viewer"), // 'owner', 'editor', 'viewer'
  addedBy: varchar("added_by").references(() => users.id),
  addedAt: timestamp("added_at").default(sql`now()`),
});

export const insertProjectMemberSchema = createInsertSchema(projectMembers).omit({
  id: true,
  addedAt: true,
});

export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertProjectMember = z.infer<typeof insertProjectMemberSchema>;

// Project Invites - Pending team invitations
export const projectInvites = pgTable("project_invites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("viewer"), // 'editor', 'viewer'
  invitedBy: varchar("invited_by").references(() => users.id).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'declined', 'expired'
  token: text("token").notNull(), // Unique invite token
  expiresAt: timestamp("expires_at").notNull(),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertProjectInviteSchema = createInsertSchema(projectInvites).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
});

export type ProjectInvite = typeof projectInvites.$inferSelect;
export type InsertProjectInvite = z.infer<typeof insertProjectInviteSchema>;

// Project Comments - Team collaboration
export const projectComments = pgTable("project_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  entityType: text("entity_type").notNull(), // 'persona', 'pov', 'idea', 'prototype', 'project'
  entityId: varchar("entity_id"), // ID of the specific entity being commented on
  comment: text("comment").notNull(),
  parentCommentId: varchar("parent_comment_id"), // For threaded comments (no FK to avoid circular reference)
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertProjectCommentSchema = createInsertSchema(projectComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ProjectComment = typeof projectComments.$inferSelect;
export type InsertProjectComment = z.infer<typeof insertProjectCommentSchema>;

// Double Diamond - AI-Powered Design Thinking Framework
export const doubleDiamondProjects = pgTable("double_diamond_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  
  // Initial Setup (Minimal User Input)
  sectorId: varchar("sector_id").references(() => industrySectors.id),
  successCaseId: varchar("success_case_id").references(() => successCases.id), // Case to mirror (Airbnb, Uber, etc.)
  customSuccessCase: text("custom_success_case"), // User's custom success case (if not in list)
  customSuccessCaseUrl: text("custom_success_case_url"), // Optional URL with additional reference materials
  customSuccessCasePdfUrl: text("custom_success_case_pdf_url"), // Optional URL to a reference PDF
  targetAudience: text("target_audience"), // User's minimal description of audience
  problemStatement: text("problem_statement"), // User's initial problem description
  
  // Phase 1: Discover (Divergence) - Diamond 1
  discoverStatus: text("discover_status").default("pending"), // pending, in_progress, completed
  discoverPainPoints: jsonb("discover_pain_points"), // AI-generated list of pain points [{text, validated}]
  discoverInsights: jsonb("discover_insights"), // AI-generated insights from sector/case
  discoverUserNeeds: jsonb("discover_user_needs"), // AI-generated user needs
  discoverEmpathyMap: jsonb("discover_empathy_map"), // Auto-generated empathy map {says, thinks, does, feels}
  
  // Phase 2: Define (Convergence) - Diamond 1
  defineStatus: text("define_status").default("pending"),
  definePovStatements: jsonb("define_pov_statements"), // AI-generated POV statements [{user, need, insight, selected}]
  defineHmwQuestions: jsonb("define_hmw_questions"), // AI-generated HMW questions [{question, selected}]
  defineSelectedPov: text("define_selected_pov"), // User-selected POV statement
  defineSelectedHmw: text("define_selected_hmw"), // User-selected HMW question
  
  // Phase 3: Develop (Divergence) - Diamond 2
  developStatus: text("develop_status").default("pending"),
  developIdeas: jsonb("develop_ideas"), // AI-generated ideas [{title, description, category, score}]
  developCrossPollinatedIdeas: jsonb("develop_cross_pollinated_ideas"), // AI cross-domain ideas
  developSelectedIdeas: jsonb("develop_selected_ideas"), // User-selected ideas for prototyping
  
  // Phase 4: Deliver (Convergence) - Diamond 2
  deliverStatus: text("deliver_status").default("pending"),
  deliverMvpConcept: jsonb("deliver_mvp_concept"), // AI-generated MVP concept
  deliverLogoSuggestions: jsonb("deliver_logo_suggestions"), // AI-generated logo ideas [{description, style}]
  deliverLandingPage: jsonb("deliver_landing_page"), // AI-generated landing page structure {headline, sections, cta}
  deliverSocialMediaLines: jsonb("deliver_social_media_lines"), // AI-generated social media copy
  deliverTestPlan: jsonb("deliver_test_plan"), // AI-generated basic test plan
  
  // DFV Analysis (Desirability, Feasibility, Viability)
  dfvDesirabilityScore: integer("dfv_desirability_score"), // 0-100
  dfvFeasibilityScore: integer("dfv_feasibility_score"), // 0-100
  dfvViabilityScore: integer("dfv_viability_score"), // 0-100
  dfvAnalysis: jsonb("dfv_analysis"), // AI-generated analysis and recommendations
  dfvFeedback: text("dfv_feedback"), // AI-generated actionable feedback
  
  // Progress and Completion
  currentPhase: text("current_phase").default("discover"), // discover, define, develop, deliver
  completionPercentage: integer("completion_percentage").default(0),
  isCompleted: boolean("is_completed").default(false),
  
  // AI Generation Metadata
  totalAiCost: real("total_ai_cost").default(0), // Total cost in credits
  generationCount: integer("generation_count").default(0), // Number of AI calls made
  
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertDoubleDiamondProjectSchema = createInsertSchema(doubleDiamondProjects).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type DoubleDiamondProject = typeof doubleDiamondProjects.$inferSelect;
export type InsertDoubleDiamondProject = z.infer<typeof insertDoubleDiamondProjectSchema>;