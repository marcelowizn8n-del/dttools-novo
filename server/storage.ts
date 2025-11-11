import { 
  type Project, type InsertProject,
  type EmpathyMap, type InsertEmpathyMap,
  type Persona, type InsertPersona,
  type Interview, type InsertInterview,
  type Observation, type InsertObservation,
  type PovStatement, type InsertPovStatement,
  type HmwQuestion, type InsertHmwQuestion,
  type Idea, type InsertIdea,
  type Prototype, type InsertPrototype,
  type TestPlan, type InsertTestPlan,
  type TestResult, type InsertTestResult,
  type UserProgress, type InsertUserProgress,
  type User, type InsertUser,
  type Article, type InsertArticle,
  type Testimonial, type InsertTestimonial,
  type VideoTutorial, type InsertVideoTutorial,
  type SubscriptionPlan, type InsertSubscriptionPlan,
  type UserSubscription, type InsertUserSubscription,
  type CanvasDrawing, type InsertCanvasDrawing,
  type PhaseCard, type InsertPhaseCard,
  type Benchmark, type InsertBenchmark,
  type BenchmarkAssessment, type InsertBenchmarkAssessment,
  type DvfAssessment, type InsertDvfAssessment,
  type LovabilityMetric, type InsertLovabilityMetric,
  type ProjectAnalytics, type InsertProjectAnalytics,
  type CompetitiveAnalysis, type InsertCompetitiveAnalysis,
  type ProjectBackup, type InsertProjectBackup,
  type HelpArticle, type InsertHelpArticle,
  type IndustrySector, type InsertIndustrySector,
  type SuccessCase, type InsertSuccessCase,
  type AiGeneratedAsset, type InsertAiGeneratedAsset,
  type AnalyticsEvent, type InsertAnalyticsEvent,
  type ProjectMember, type InsertProjectMember,
  type ProjectInvite, type InsertProjectInvite,
  type ProjectComment, type InsertProjectComment,
  type DoubleDiamondProject, type InsertDoubleDiamondProject,
  projects, empathyMaps, personas, interviews, observations,
  povStatements, hmwQuestions, ideas, prototypes, testPlans, testResults,
  userProgress, users, articles, testimonials, videoTutorials, subscriptionPlans, userSubscriptions,
  canvasDrawings, phaseCards, benchmarks, benchmarkAssessments,
  dvfAssessments, lovabilityMetrics, projectAnalytics, competitiveAnalysis,
  projectBackups, helpArticles, industrySectors, successCases, aiGeneratedAssets,
  analyticsEvents, projectMembers, projectInvites, projectComments, doubleDiamondProjects
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(userId: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: string, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject & { userId: string }): Promise<Project>;
  updateProject(id: string, userId: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string, userId: string): Promise<boolean>;

  // Phase 1: Empathize
  getEmpathyMaps(projectId: string): Promise<EmpathyMap[]>;
  createEmpathyMap(empathyMap: InsertEmpathyMap): Promise<EmpathyMap>;
  updateEmpathyMap(id: string, empathyMap: Partial<InsertEmpathyMap>): Promise<EmpathyMap | undefined>;
  deleteEmpathyMap(id: string): Promise<boolean>;

  getPersonas(projectId: string): Promise<Persona[]>;
  createPersona(persona: InsertPersona): Promise<Persona>;
  updatePersona(id: string, persona: Partial<InsertPersona>): Promise<Persona | undefined>;
  deletePersona(id: string): Promise<boolean>;

  getInterviews(projectId: string): Promise<Interview[]>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: string, interview: Partial<InsertInterview>): Promise<Interview | undefined>;
  deleteInterview(id: string): Promise<boolean>;

  getObservations(projectId: string): Promise<Observation[]>;
  createObservation(observation: InsertObservation): Promise<Observation>;
  updateObservation(id: string, observation: Partial<InsertObservation>): Promise<Observation | undefined>;
  deleteObservation(id: string): Promise<boolean>;

  // Phase 2: Define
  getPovStatements(projectId: string): Promise<PovStatement[]>;
  getPovStatement(id: string): Promise<PovStatement | undefined>;
  createPovStatement(pov: InsertPovStatement): Promise<PovStatement>;
  updatePovStatement(id: string, pov: Partial<InsertPovStatement>): Promise<PovStatement | undefined>;
  deletePovStatement(id: string): Promise<boolean>;

  getHmwQuestions(projectId: string): Promise<HmwQuestion[]>;
  getHmwQuestion(id: string): Promise<HmwQuestion | undefined>;
  createHmwQuestion(hmw: InsertHmwQuestion): Promise<HmwQuestion>;
  updateHmwQuestion(id: string, hmw: Partial<InsertHmwQuestion>): Promise<HmwQuestion | undefined>;
  deleteHmwQuestion(id: string): Promise<boolean>;

  // Phase 3: Ideate
  getIdeas(projectId: string): Promise<Idea[]>;
  createIdea(idea: InsertIdea): Promise<Idea>;
  updateIdea(id: string, idea: Partial<InsertIdea>): Promise<Idea | undefined>;
  deleteIdea(id: string): Promise<boolean>;

  // Phase 4: Prototype
  getPrototypes(projectId: string): Promise<Prototype[]>;
  createPrototype(prototype: InsertPrototype): Promise<Prototype>;
  updatePrototype(id: string, prototype: Partial<InsertPrototype>): Promise<Prototype | undefined>;
  deletePrototype(id: string): Promise<boolean>;

  // Phase 5: Test
  getTestPlans(projectId: string): Promise<TestPlan[]>;
  createTestPlan(testPlan: InsertTestPlan): Promise<TestPlan>;
  updateTestPlan(id: string, testPlan: Partial<InsertTestPlan>): Promise<TestPlan | undefined>;

  getTestResults(testPlanId: string): Promise<TestResult[]>;
  createTestResult(testResult: InsertTestResult): Promise<TestResult>;

  // User Progress
  getUserProgress(userId: string, projectId: string): Promise<UserProgress | undefined>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Analytics
  getProjectStats(projectId: string, userId: string): Promise<{
    totalTools: number;
    completedTools: number;
    currentPhase: number;
    completionRate: number;
  }>;

  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Articles
  getArticles(): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;

  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Canvas Drawings
  getCanvasDrawings(projectId: string): Promise<CanvasDrawing[]>;
  getCanvasDrawing(id: string): Promise<CanvasDrawing | undefined>;
  createCanvasDrawing(drawing: InsertCanvasDrawing): Promise<CanvasDrawing>;
  updateCanvasDrawing(id: string, drawing: Partial<InsertCanvasDrawing>): Promise<CanvasDrawing | undefined>;
  deleteCanvasDrawing(id: string): Promise<boolean>;

  // Phase Cards (Kanban)
  getPhaseCards(projectId: string): Promise<PhaseCard[]>;
  getPhaseCard(id: string): Promise<PhaseCard | undefined>;
  createPhaseCard(card: InsertPhaseCard): Promise<PhaseCard>;
  updatePhaseCard(id: string, card: Partial<InsertPhaseCard>): Promise<PhaseCard | undefined>;
  deletePhaseCard(id: string): Promise<boolean>;

  // Subscription Plans
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: string, plan: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined>;
  deleteSubscriptionPlan(id: string): Promise<boolean>;

  // User Subscriptions
  getUserSubscriptions(userId: string): Promise<UserSubscription[]>;
  getUserActiveSubscription(userId: string): Promise<UserSubscription | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(id: string, subscription: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined>;
  cancelUserSubscription(id: string): Promise<boolean>;

  // Benchmarking
  getBenchmarks(projectId: string): Promise<Benchmark[]>;
  getBenchmark(id: string): Promise<Benchmark | undefined>;
  createBenchmark(benchmark: InsertBenchmark): Promise<Benchmark>;
  updateBenchmark(id: string, benchmark: Partial<InsertBenchmark>): Promise<Benchmark | undefined>;
  deleteBenchmark(id: string): Promise<boolean>;

  getBenchmarkAssessments(benchmarkId: string): Promise<BenchmarkAssessment[]>;
  createBenchmarkAssessment(assessment: InsertBenchmarkAssessment): Promise<BenchmarkAssessment>;
  updateBenchmarkAssessment(id: string, assessment: Partial<InsertBenchmarkAssessment>): Promise<BenchmarkAssessment | undefined>;
  deleteBenchmarkAssessment(id: string): Promise<boolean>;

  // DVF Assessment - Desirability, Feasibility, Viability
  getDvfAssessments(projectId: string): Promise<DvfAssessment[]>;
  getDvfAssessment(id: string): Promise<DvfAssessment | undefined>;
  createDvfAssessment(assessment: InsertDvfAssessment): Promise<DvfAssessment>;
  updateDvfAssessment(id: string, assessment: Partial<InsertDvfAssessment>): Promise<DvfAssessment | undefined>;
  deleteDvfAssessment(id: string): Promise<boolean>;

  // Lovability Metrics
  getLovabilityMetrics(projectId: string): Promise<LovabilityMetric[]>;
  getLovabilityMetric(id: string): Promise<LovabilityMetric | undefined>;
  createLovabilityMetric(metric: InsertLovabilityMetric): Promise<LovabilityMetric>;
  updateLovabilityMetric(id: string, metric: Partial<InsertLovabilityMetric>): Promise<LovabilityMetric | undefined>;
  deleteLovabilityMetric(id: string): Promise<boolean>;

  // Project Analytics
  getProjectAnalytics(projectId: string): Promise<ProjectAnalytics | undefined>;
  createProjectAnalytics(analytics: InsertProjectAnalytics): Promise<ProjectAnalytics>;
  updateProjectAnalytics(id: string, analytics: Partial<InsertProjectAnalytics>): Promise<ProjectAnalytics | undefined>;

  // Competitive Analysis
  getCompetitiveAnalyses(projectId: string): Promise<CompetitiveAnalysis[]>;
  getCompetitiveAnalysis(id: string): Promise<CompetitiveAnalysis | undefined>;
  createCompetitiveAnalysis(analysis: InsertCompetitiveAnalysis): Promise<CompetitiveAnalysis>;
  updateCompetitiveAnalysis(id: string, analysis: Partial<InsertCompetitiveAnalysis>): Promise<CompetitiveAnalysis | undefined>;
  deleteCompetitiveAnalysis(id: string): Promise<boolean>;

  // Project Backups
  createProjectBackup(projectId: string, backupType: 'auto' | 'manual', description?: string): Promise<any>;
  getProjectBackups(projectId: string): Promise<any[]>;
  getProjectBackup(id: string): Promise<any | undefined>;
  restoreProjectBackup(backupId: string): Promise<boolean>;
  deleteProjectBackup(id: string): Promise<boolean>;

  // Help Articles
  getHelpArticles(): Promise<any[]>;
  getHelpArticleBySlug(slug: string): Promise<any | undefined>;
  searchHelpArticles(searchTerm: string): Promise<any[]>;
  incrementHelpArticleViews(id: string): Promise<any | undefined>;
  incrementHelpArticleHelpful(id: string): Promise<any | undefined>;
  createHelpArticle(article: any): Promise<any>;
  updateHelpArticle(id: string, article: any): Promise<any | undefined>;
  deleteHelpArticle(id: string): Promise<boolean>;

  // AI Automation: Industry Sectors
  getIndustrySectors(): Promise<IndustrySector[]>;
  getActiveIndustrySectors(): Promise<IndustrySector[]>;
  getIndustrySector(id: string): Promise<IndustrySector | undefined>;
  createIndustrySector(sector: InsertIndustrySector): Promise<IndustrySector>;
  updateIndustrySector(id: string, sector: Partial<InsertIndustrySector>): Promise<IndustrySector | undefined>;
  deleteIndustrySector(id: string): Promise<boolean>;

  // AI Automation: Success Cases
  getSuccessCases(): Promise<SuccessCase[]>;
  getActiveSuccessCases(): Promise<SuccessCase[]>;
  getSuccessCasesBySector(sectorId: string): Promise<SuccessCase[]>;
  getSuccessCase(id: string): Promise<SuccessCase | undefined>;
  createSuccessCase(successCase: InsertSuccessCase): Promise<SuccessCase>;
  updateSuccessCase(id: string, successCase: Partial<InsertSuccessCase>): Promise<SuccessCase | undefined>;
  deleteSuccessCase(id: string): Promise<boolean>;

  // AI Automation: Generated Assets
  getAiGeneratedAssets(projectId: string): Promise<AiGeneratedAsset[]>;
  getAiGeneratedAssetsByType(projectId: string, assetType: string): Promise<AiGeneratedAsset[]>;
  getAiGeneratedAsset(id: string): Promise<AiGeneratedAsset | undefined>;
  createAiGeneratedAsset(asset: InsertAiGeneratedAsset): Promise<AiGeneratedAsset>;
  updateAiGeneratedAsset(id: string, asset: Partial<InsertAiGeneratedAsset>): Promise<AiGeneratedAsset | undefined>;
  deleteAiGeneratedAsset(id: string): Promise<boolean>;

  // Analytics Events
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(filters?: { eventType?: string; userId?: string; startDate?: Date; endDate?: Date }): Promise<AnalyticsEvent[]>;
  getAnalyticsSummary(): Promise<{
    totalUsers: number;
    totalProjects: number;
    totalAiGenerations: number;
    newUsersThisMonth: number;
    projectsThisMonth: number;
    aiGenerationsThisMonth: number;
  }>;

  // Project Members (Teams)
  getProjectMembers(projectId: string): Promise<ProjectMember[]>;
  getProjectMember(projectId: string, userId: string): Promise<ProjectMember | undefined>;
  createProjectMember(member: InsertProjectMember): Promise<ProjectMember>;
  updateProjectMemberRole(id: string, role: string): Promise<ProjectMember | undefined>;
  deleteProjectMember(id: string): Promise<boolean>;
  getUserProjects(userId: string): Promise<string[]>; // Get all project IDs user has access to

  // Project Invites
  getProjectInvites(projectId: string): Promise<ProjectInvite[]>;
  getPendingInvitesByEmail(email: string): Promise<ProjectInvite[]>;
  getProjectInviteByToken(token: string): Promise<ProjectInvite | undefined>;
  createProjectInvite(invite: InsertProjectInvite): Promise<ProjectInvite>;
  updateProjectInviteStatus(id: string, status: string, respondedAt?: Date): Promise<ProjectInvite | undefined>;
  deleteProjectInvite(id: string): Promise<boolean>;

  // Project Comments
  getProjectComments(projectId: string): Promise<ProjectComment[]>;
  getEntityComments(projectId: string, entityType: string, entityId?: string): Promise<ProjectComment[]>;
  createProjectComment(comment: InsertProjectComment): Promise<ProjectComment>;
  updateProjectComment(id: string, comment: Partial<InsertProjectComment>): Promise<ProjectComment | undefined>;
  deleteProjectComment(id: string): Promise<boolean>;

  // Double Diamond
  getDoubleDiamondProjects(userId: string): Promise<DoubleDiamondProject[]>;
  getAllDoubleDiamondProjects(): Promise<DoubleDiamondProject[]>;
  getDoubleDiamondProject(id: string, userId: string): Promise<DoubleDiamondProject | undefined>;
  createDoubleDiamondProject(project: InsertDoubleDiamondProject): Promise<DoubleDiamondProject>;
  updateDoubleDiamondProject(id: string, userId: string, updates: Partial<InsertDoubleDiamondProject>): Promise<DoubleDiamondProject | undefined>;
  deleteDoubleDiamondProject(id: string, userId: string): Promise<boolean>;
  
  // Industry Sectors & Success Cases (for Double Diamond)
  listIndustrySectors(): Promise<IndustrySector[]>;
  getIndustrySector(id: string): Promise<IndustrySector | undefined>;
  listSuccessCases(): Promise<SuccessCase[]>;
}

// Database implementation using PostgreSQL via Drizzle ORM
export class DatabaseStorage implements IStorage {
  // Projects
  async getProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: string, userId: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return project;
  }

  async createProject(project: InsertProject & { userId: string }): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: string, userId: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db.update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    // Delete all related records manually (in case cascade delete is not configured in DB)
    // Wrapped in try-catch to ignore ALL errors (tables that don't exist, FK constraints, etc.)
    
    const deleteTable = async (tableName: string, deleteQuery: () => Promise<any>) => {
      try {
        await deleteQuery();
        console.log(`[DELETE PROJECT] ✓ Deleted from ${tableName}`);
      } catch (error: any) {
        // Ignore ALL errors: 42P01 (table doesn't exist), 23503 (FK violation), etc.
        console.log(`[DELETE PROJECT] ⚠ Skipping ${tableName} (error code ${error?.code}):`, error?.message || error);
      }
    };
    
    // Delete collaboration tables FIRST (new tables from Teams feature)
    await deleteTable('projectComments', () => db.delete(projectComments).where(eq(projectComments.projectId, id)));
    await deleteTable('projectInvites', () => db.delete(projectInvites).where(eq(projectInvites.projectId, id)));
    await deleteTable('projectMembers', () => db.delete(projectMembers).where(eq(projectMembers.projectId, id)));
    
    // Delete analytics events for this project
    await deleteTable('analyticsEvents', () => db.delete(analyticsEvents).where(eq(analyticsEvents.projectId, id)));
    
    // Delete AI generated assets
    await deleteTable('aiGeneratedAssets', () => db.delete(aiGeneratedAssets).where(eq(aiGeneratedAssets.projectId, id)));
    
    // Delete empathy maps
    await deleteTable('empathyMaps', () => db.delete(empathyMaps).where(eq(empathyMaps.projectId, id)));
    
    // Delete personas
    await deleteTable('personas', () => db.delete(personas).where(eq(personas.projectId, id)));
    
    // Delete interviews
    await deleteTable('interviews', () => db.delete(interviews).where(eq(interviews.projectId, id)));
    
    // Delete observations
    await deleteTable('observations', () => db.delete(observations).where(eq(observations.projectId, id)));
    
    // Delete POV statements
    await deleteTable('povStatements', () => db.delete(povStatements).where(eq(povStatements.projectId, id)));
    
    // Delete HMW questions
    await deleteTable('hmwQuestions', () => db.delete(hmwQuestions).where(eq(hmwQuestions.projectId, id)));
    
    // Delete ideas
    await deleteTable('ideas', () => db.delete(ideas).where(eq(ideas.projectId, id)));
    
    // Delete prototypes
    await deleteTable('prototypes', () => db.delete(prototypes).where(eq(prototypes.projectId, id)));
    
    // Delete test plans
    await deleteTable('testPlans', () => db.delete(testPlans).where(eq(testPlans.projectId, id)));
    
    // Delete test results
    await deleteTable('testResults', () => db.delete(testResults).where(eq(testResults.projectId, id)));
    
    // Delete canvas drawings
    await deleteTable('canvasDrawings', () => db.delete(canvasDrawings).where(eq(canvasDrawings.projectId, id)));
    
    // Delete phase cards
    await deleteTable('phaseCards', () => db.delete(phaseCards).where(eq(phaseCards.projectId, id)));
    
    // Delete benchmark assessments
    await deleteTable('benchmarkAssessments', () => db.delete(benchmarkAssessments).where(eq(benchmarkAssessments.projectId, id)));
    
    // Delete DVF assessments
    await deleteTable('dvfAssessments', () => db.delete(dvfAssessments).where(eq(dvfAssessments.projectId, id)));
    
    // Delete lovability metrics
    await deleteTable('lovabilityMetrics', () => db.delete(lovabilityMetrics).where(eq(lovabilityMetrics.projectId, id)));
    
    // Delete project analytics
    await deleteTable('projectAnalytics', () => db.delete(projectAnalytics).where(eq(projectAnalytics.projectId, id)));
    
    // Delete competitive analysis
    await deleteTable('competitiveAnalysis', () => db.delete(competitiveAnalysis).where(eq(competitiveAnalysis.projectId, id)));
    
    // Delete project backups
    await deleteTable('projectBackups', () => db.delete(projectBackups).where(eq(projectBackups.projectId, id)));
    
    // Delete user progress
    await deleteTable('userProgress', () => db.delete(userProgress).where(eq(userProgress.projectId, id)));
    
    // Delete benchmarks
    await deleteTable('benchmarks', () => db.delete(benchmarks).where(eq(benchmarks.projectId, id)));
    
    // Finally, delete the project itself
    // We've already cleaned up all child records, so this should succeed
    try {
      const result = await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
      const success = (result.rowCount || 0) > 0;
      console.log(`[DELETE PROJECT] ✓ Final project deletion result: ${success}, rowCount: ${result.rowCount}`);
      return success;
    } catch (error: any) {
      // If the final delete fails, it means there's still a FK constraint blocking it
      console.error(`[DELETE PROJECT] ✗ Final project deletion FAILED (error ${error?.code}):`, error?.message);
      throw error; // Re-throw so the API returns proper error
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      console.log(`[DELETE USER] Starting deletion for user ${id}`);
      
      // 1. Update project memberships where user was addedBy (IGNORE if table doesn't exist)
      try {
        console.log(`[DELETE USER] Step 1: Updating project memberships (addedBy → null)...`);
        const updated = await db.update(projectMembers)
          .set({ addedBy: null })
          .where(eq(projectMembers.addedBy, id));
        console.log(`[DELETE USER] ✓ Updated ${updated.rowCount || 0} project memberships`);
      } catch (e: any) {
        console.log(`[DELETE USER] ⚠ Skipping project_members update (table may not exist): ${e?.message}`);
      }
      
      // 2. Delete analytics events (IGNORE if table doesn't exist)
      try {
        console.log(`[DELETE USER] Step 2: Deleting analytics events...`);
        const deletedEvents = await db.delete(analyticsEvents).where(eq(analyticsEvents.userId, id));
        console.log(`[DELETE USER] ✓ Deleted ${deletedEvents.rowCount || 0} analytics events`);
      } catch (e: any) {
        console.log(`[DELETE USER] ⚠ Skipping analytics_events (table may not exist): ${e?.message}`);
      }
      
      // 3. Delete project comments by this user (IGNORE if table doesn't exist)
      try {
        console.log(`[DELETE USER] Step 3: Deleting project comments...`);
        const deletedComments = await db.delete(projectComments).where(eq(projectComments.userId, id));
        console.log(`[DELETE USER] ✓ Deleted ${deletedComments.rowCount || 0} comments`);
      } catch (e: any) {
        console.log(`[DELETE USER] ⚠ Skipping project_comments (table may not exist): ${e?.message}`);
      }
      
      // 4. Delete project invites where user is the inviter (IGNORE if table doesn't exist)
      try {
        console.log(`[DELETE USER] Step 4: Deleting project invites (invitedBy)...`);
        const deletedInvites = await db.delete(projectInvites).where(eq(projectInvites.invitedBy, id));
        console.log(`[DELETE USER] ✓ Deleted ${deletedInvites.rowCount || 0} invites`);
      } catch (e: any) {
        console.log(`[DELETE USER] ⚠ Skipping project_invites (table may not exist): ${e?.message}`);
      }
      
      // 5. Delete project memberships (userId) (IGNORE if table doesn't exist)
      try {
        console.log(`[DELETE USER] Step 5: Deleting project memberships (userId)...`);
        const deletedMembers = await db.delete(projectMembers).where(eq(projectMembers.userId, id));
        console.log(`[DELETE USER] ✓ Deleted ${deletedMembers.rowCount || 0} memberships`);
      } catch (e: any) {
        console.log(`[DELETE USER] ⚠ Skipping project_members (table may not exist): ${e?.message}`);
      }
      
      // 6. Delete user subscriptions
      console.log(`[DELETE USER] Step 6: Deleting user subscriptions...`);
      const deletedSubs = await db.delete(userSubscriptions).where(eq(userSubscriptions.userId, id));
      console.log(`[DELETE USER] ✓ Deleted ${deletedSubs.rowCount || 0} subscriptions`);
      
      // 7. Get all projects owned by this user
      console.log(`[DELETE USER] Step 7: Finding user's projects...`);
      const userProjects = await db.select({ id: projects.id })
        .from(projects)
        .where(eq(projects.userId, id));
      console.log(`[DELETE USER] ✓ Found ${userProjects.length} projects`);
      
      // 8. Delete ALL project-related data (instead of calling deleteProject which may fail)
      if (userProjects.length > 0) {
        const projectIds = userProjects.map(p => p.id);
        console.log(`[DELETE USER] Step 8: Deleting all project-related data for ${projectIds.length} projects...`);
        
        // Delete all project-related records using IN clause (much faster than loop)
        for (const projectId of projectIds) {
          // Use try-catch to ignore errors (some tables might not have data)
          try { await db.delete(aiGeneratedAssets).where(eq(aiGeneratedAssets.projectId, projectId)); } catch (e) {}
          try { await db.delete(analyticsEvents).where(eq(analyticsEvents.projectId, projectId)); } catch (e) {}
          try { await db.delete(projectComments).where(eq(projectComments.projectId, projectId)); } catch (e) {}
          try { await db.delete(projectInvites).where(eq(projectInvites.projectId, projectId)); } catch (e) {}
          try { await db.delete(projectMembers).where(eq(projectMembers.projectId, projectId)); } catch (e) {}
          try { await db.delete(empathyMaps).where(eq(empathyMaps.projectId, projectId)); } catch (e) {}
          try { await db.delete(personas).where(eq(personas.projectId, projectId)); } catch (e) {}
          try { await db.delete(interviews).where(eq(interviews.projectId, projectId)); } catch (e) {}
          try { await db.delete(observations).where(eq(observations.projectId, projectId)); } catch (e) {}
          try { await db.delete(povStatements).where(eq(povStatements.projectId, projectId)); } catch (e) {}
          try { await db.delete(hmwQuestions).where(eq(hmwQuestions.projectId, projectId)); } catch (e) {}
          try { await db.delete(ideas).where(eq(ideas.projectId, projectId)); } catch (e) {}
          try { await db.delete(prototypes).where(eq(prototypes.projectId, projectId)); } catch (e) {}
          try { await db.delete(testPlans).where(eq(testPlans.projectId, projectId)); } catch (e) {}
          try { await db.delete(testResults).where(eq(testResults.projectId, projectId)); } catch (e) {}
          try { await db.delete(canvasDrawings).where(eq(canvasDrawings.projectId, projectId)); } catch (e) {}
          try { await db.delete(phaseCards).where(eq(phaseCards.projectId, projectId)); } catch (e) {}
          try { await db.delete(benchmarkAssessments).where(eq(benchmarkAssessments.projectId, projectId)); } catch (e) {}
          try { await db.delete(dvfAssessments).where(eq(dvfAssessments.projectId, projectId)); } catch (e) {}
          try { await db.delete(lovabilityMetrics).where(eq(lovabilityMetrics.projectId, projectId)); } catch (e) {}
          try { await db.delete(projectAnalytics).where(eq(projectAnalytics.projectId, projectId)); } catch (e) {}
          try { await db.delete(competitiveAnalysis).where(eq(competitiveAnalysis.projectId, projectId)); } catch (e) {}
          try { await db.delete(projectBackups).where(eq(projectBackups.projectId, projectId)); } catch (e) {}
          try { await db.delete(userProgress).where(eq(userProgress.projectId, projectId)); } catch (e) {}
          try { await db.delete(benchmarks).where(eq(benchmarks.projectId, projectId)); } catch (e) {}
        }
        
        // Now delete all projects
        await db.delete(projects).where(eq(projects.userId, id));
        console.log(`[DELETE USER] ✓ Deleted all projects and related data`);
      }
      
      // 9. Delete user progress (if any remaining - no FK constraint)
      console.log(`[DELETE USER] Step 9: Deleting user progress...`);
      const deletedProgress = await db.delete(userProgress).where(eq(userProgress.userId, id));
      console.log(`[DELETE USER] ✓ Deleted ${deletedProgress.rowCount || 0} progress records`);
      
      // 10. Finally, delete the user
      console.log(`[DELETE USER] Step 10: FINAL - Deleting user from users table...`);
      const result = await db.delete(users).where(eq(users.id, id));
      const success = (result.rowCount || 0) > 0;
      
      console.log(`[DELETE USER] ${success ? '✅ SUCCESS' : '❌ FAILED'}: User deletion ${success ? 'completed' : 'failed'} (rowCount: ${result.rowCount})`);
      return success;
    } catch (error: any) {
      console.error(`[DELETE USER] ❌ EXCEPTION: Failed to delete user ${id}`);
      console.error(`[DELETE USER] Error code: ${error?.code}`);
      console.error(`[DELETE USER] Error message: ${error?.message}`);
      console.error(`[DELETE USER] Error detail: ${error?.detail}`);
      console.error(`[DELETE USER] Full error:`, error);
      throw error;
    }
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(desc(articles.createdAt));
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return await db.select().from(articles)
      .where(eq(articles.category, category))
      .orderBy(desc(articles.createdAt));
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const [updatedArticle] = await db.update(articles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.order, desc(testimonials.createdAt));
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(testimonials.order, desc(testimonials.createdAt));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db.update(testimonials)
      .set({ ...testimonial, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return updatedTestimonial;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Phase 1: Empathize
  async getEmpathyMaps(projectId: string): Promise<EmpathyMap[]> {
    return await db.select().from(empathyMaps)
      .where(eq(empathyMaps.projectId, projectId))
      .orderBy(desc(empathyMaps.createdAt));
  }

  async createEmpathyMap(empathyMap: InsertEmpathyMap): Promise<EmpathyMap> {
    const [newMap] = await db.insert(empathyMaps).values(empathyMap).returning();
    return newMap;
  }

  async updateEmpathyMap(id: string, empathyMap: Partial<InsertEmpathyMap>): Promise<EmpathyMap | undefined> {
    const [updatedMap] = await db.update(empathyMaps)
      .set({ ...empathyMap, updatedAt: new Date() })
      .where(eq(empathyMaps.id, id))
      .returning();
    return updatedMap;
  }

  async deleteEmpathyMap(id: string): Promise<boolean> {
    const result = await db.delete(empathyMaps).where(eq(empathyMaps.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getPersonas(projectId: string): Promise<Persona[]> {
    return await db.select().from(personas)
      .where(eq(personas.projectId, projectId))
      .orderBy(desc(personas.createdAt));
  }

  async createPersona(persona: InsertPersona): Promise<Persona> {
    const [newPersona] = await db.insert(personas).values(persona).returning();
    return newPersona;
  }

  async updatePersona(id: string, persona: Partial<InsertPersona>): Promise<Persona | undefined> {
    const [updatedPersona] = await db.update(personas)
      .set({ ...persona, updatedAt: new Date() })
      .where(eq(personas.id, id))
      .returning();
    return updatedPersona;
  }

  async deletePersona(id: string): Promise<boolean> {
    const result = await db.delete(personas).where(eq(personas.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getInterviews(projectId: string): Promise<Interview[]> {
    return await db.select().from(interviews)
      .where(eq(interviews.projectId, projectId))
      .orderBy(desc(interviews.createdAt));
  }

  async createInterview(interview: InsertInterview): Promise<Interview> {
    const [newInterview] = await db.insert(interviews).values(interview).returning();
    return newInterview;
  }

  async updateInterview(id: string, interview: Partial<InsertInterview>): Promise<Interview | undefined> {
    const [updatedInterview] = await db.update(interviews)
      .set(interview)
      .where(eq(interviews.id, id))
      .returning();
    return updatedInterview;
  }

  async deleteInterview(id: string): Promise<boolean> {
    const result = await db.delete(interviews).where(eq(interviews.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getObservations(projectId: string): Promise<Observation[]> {
    return await db.select().from(observations)
      .where(eq(observations.projectId, projectId))
      .orderBy(desc(observations.createdAt));
  }

  async createObservation(observation: InsertObservation): Promise<Observation> {
    const [newObservation] = await db.insert(observations).values(observation).returning();
    return newObservation;
  }

  async updateObservation(id: string, observation: Partial<InsertObservation>): Promise<Observation | undefined> {
    const [updatedObservation] = await db.update(observations)
      .set(observation)
      .where(eq(observations.id, id))
      .returning();
    return updatedObservation;
  }

  async deleteObservation(id: string): Promise<boolean> {
    const result = await db.delete(observations).where(eq(observations.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Phase 2: Define
  async getPovStatements(projectId: string): Promise<PovStatement[]> {
    return await db.select().from(povStatements)
      .where(eq(povStatements.projectId, projectId))
      .orderBy(desc(povStatements.createdAt));
  }

  async getPovStatement(id: string): Promise<PovStatement | undefined> {
    const [statement] = await db.select().from(povStatements).where(eq(povStatements.id, id));
    return statement;
  }

  async createPovStatement(pov: InsertPovStatement): Promise<PovStatement> {
    const [newStatement] = await db.insert(povStatements).values(pov).returning();
    return newStatement;
  }

  async updatePovStatement(id: string, pov: Partial<InsertPovStatement>): Promise<PovStatement | undefined> {
    const [updatedStatement] = await db.update(povStatements)
      .set(pov)
      .where(eq(povStatements.id, id))
      .returning();
    return updatedStatement;
  }

  async deletePovStatement(id: string): Promise<boolean> {
    const result = await db.delete(povStatements).where(eq(povStatements.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getHmwQuestions(projectId: string): Promise<HmwQuestion[]> {
    return await db.select().from(hmwQuestions)
      .where(eq(hmwQuestions.projectId, projectId))
      .orderBy(desc(hmwQuestions.createdAt));
  }

  async getHmwQuestion(id: string): Promise<HmwQuestion | undefined> {
    const [question] = await db.select().from(hmwQuestions).where(eq(hmwQuestions.id, id));
    return question;
  }

  async createHmwQuestion(hmw: InsertHmwQuestion): Promise<HmwQuestion> {
    const [newQuestion] = await db.insert(hmwQuestions).values(hmw).returning();
    return newQuestion;
  }

  async updateHmwQuestion(id: string, hmw: Partial<InsertHmwQuestion>): Promise<HmwQuestion | undefined> {
    const [updatedQuestion] = await db.update(hmwQuestions)
      .set(hmw)
      .where(eq(hmwQuestions.id, id))
      .returning();
    return updatedQuestion;
  }

  async deleteHmwQuestion(id: string): Promise<boolean> {
    const result = await db.delete(hmwQuestions).where(eq(hmwQuestions.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Phase 3: Ideate
  async getIdeas(projectId: string): Promise<Idea[]> {
    return await db.select().from(ideas)
      .where(eq(ideas.projectId, projectId))
      .orderBy(desc(ideas.createdAt));
  }

  async createIdea(idea: InsertIdea): Promise<Idea> {
    const [newIdea] = await db.insert(ideas).values(idea).returning();
    return newIdea;
  }

  async updateIdea(id: string, idea: Partial<InsertIdea>): Promise<Idea | undefined> {
    const [updatedIdea] = await db.update(ideas)
      .set(idea)
      .where(eq(ideas.id, id))
      .returning();
    return updatedIdea;
  }

  async deleteIdea(id: string): Promise<boolean> {
    const result = await db.delete(ideas).where(eq(ideas.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Phase 4: Prototype
  async getPrototypes(projectId: string): Promise<Prototype[]> {
    return await db.select().from(prototypes)
      .where(eq(prototypes.projectId, projectId))
      .orderBy(desc(prototypes.createdAt));
  }

  async createPrototype(prototype: InsertPrototype): Promise<Prototype> {
    const [newPrototype] = await db.insert(prototypes).values(prototype).returning();
    return newPrototype;
  }

  async updatePrototype(id: string, prototype: Partial<InsertPrototype>): Promise<Prototype | undefined> {
    const [updatedPrototype] = await db.update(prototypes)
      .set(prototype)
      .where(eq(prototypes.id, id))
      .returning();
    return updatedPrototype;
  }

  async deletePrototype(id: string): Promise<boolean> {
    const result = await db.delete(prototypes).where(eq(prototypes.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Phase 5: Test
  async getTestPlans(projectId: string): Promise<TestPlan[]> {
    return await db.select().from(testPlans)
      .where(eq(testPlans.projectId, projectId))
      .orderBy(desc(testPlans.createdAt));
  }

  async createTestPlan(testPlan: InsertTestPlan): Promise<TestPlan> {
    const [newPlan] = await db.insert(testPlans).values(testPlan).returning();
    return newPlan;
  }

  async updateTestPlan(id: string, testPlan: Partial<InsertTestPlan>): Promise<TestPlan | undefined> {
    const [updatedPlan] = await db.update(testPlans)
      .set(testPlan)
      .where(eq(testPlans.id, id))
      .returning();
    return updatedPlan;
  }

  async getTestResults(testPlanId: string): Promise<TestResult[]> {
    return await db.select().from(testResults)
      .where(eq(testResults.testPlanId, testPlanId))
      .orderBy(desc(testResults.createdAt));
  }

  async createTestResult(testResult: InsertTestResult): Promise<TestResult> {
    const [newResult] = await db.insert(testResults).values(testResult).returning();
    return newResult;
  }

  // User Progress
  async getUserProgress(userId: string, projectId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.projectId, projectId)));
    return progress;
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserProgress(progress.userId, progress.projectId);
    if (existing) {
      const [updated] = await db.update(userProgress)
        .set({ ...progress, updatedAt: new Date() })
        .where(and(eq(userProgress.userId, progress.userId), eq(userProgress.projectId, progress.projectId)))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(userProgress).values(progress).returning();
      return created;
    }
  }

  // Analytics
  async getProjectStats(projectId: string, userId: string): Promise<{
    totalTools: number;
    completedTools: number;
    currentPhase: number;
    completionRate: number;
  }> {
    // Basic implementation - can be enhanced with more sophisticated logic
    const project = await this.getProject(projectId, userId);
    return {
      totalTools: 15, // Total tools across all 5 phases
      completedTools: 0, // Would count actual completed tools
      currentPhase: project?.currentPhase || 1,
      completionRate: project?.completionRate || 0,
    };
  }

  // Canvas Drawings
  async getCanvasDrawings(projectId: string): Promise<CanvasDrawing[]> {
    return await db.select().from(canvasDrawings)
      .where(eq(canvasDrawings.projectId, projectId))
      .orderBy(desc(canvasDrawings.createdAt));
  }

  async getCanvasDrawing(id: string): Promise<CanvasDrawing | undefined> {
    const [drawing] = await db.select().from(canvasDrawings).where(eq(canvasDrawings.id, id));
    return drawing;
  }

  async createCanvasDrawing(drawing: InsertCanvasDrawing): Promise<CanvasDrawing> {
    const [newDrawing] = await db.insert(canvasDrawings).values(drawing).returning();
    return newDrawing;
  }

  async updateCanvasDrawing(id: string, drawing: Partial<InsertCanvasDrawing>): Promise<CanvasDrawing | undefined> {
    const [updatedDrawing] = await db.update(canvasDrawings)
      .set({ ...drawing, updatedAt: new Date() })
      .where(eq(canvasDrawings.id, id))
      .returning();
    return updatedDrawing;
  }

  async deleteCanvasDrawing(id: string): Promise<boolean> {
    const result = await db.delete(canvasDrawings).where(eq(canvasDrawings.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Phase Cards (Kanban)
  async getPhaseCards(projectId: string): Promise<PhaseCard[]> {
    return await db.select().from(phaseCards)
      .where(eq(phaseCards.projectId, projectId))
      .orderBy(desc(phaseCards.createdAt));
  }

  async getPhaseCard(id: string): Promise<PhaseCard | undefined> {
    const [card] = await db.select().from(phaseCards).where(eq(phaseCards.id, id));
    return card;
  }

  async createPhaseCard(card: InsertPhaseCard): Promise<PhaseCard> {
    const [newCard] = await db.insert(phaseCards).values(card).returning();
    return newCard;
  }

  async updatePhaseCard(id: string, card: Partial<InsertPhaseCard>): Promise<PhaseCard | undefined> {
    const [updatedCard] = await db.update(phaseCards)
      .set({ ...card, updatedAt: new Date() })
      .where(eq(phaseCards.id, id))
      .returning();
    return updatedCard;
  }

  async deletePhaseCard(id: string): Promise<boolean> {
    const result = await db.delete(phaseCards).where(eq(phaseCards.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).orderBy(subscriptionPlans.order);
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan;
  }

  async getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.name, name));
    return plan;
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [newPlan] = await db.insert(subscriptionPlans).values(plan).returning();
    return newPlan;
  }

  async updateSubscriptionPlan(id: string, plan: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const [updatedPlan] = await db.update(subscriptionPlans)
      .set(plan)
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return updatedPlan;
  }

  async deleteSubscriptionPlan(id: string): Promise<boolean> {
    const result = await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return (result.rowCount || 0) > 0;
  }

  // User Subscriptions
  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    return await db.select().from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(desc(userSubscriptions.createdAt));
  }

  async getUserActiveSubscription(userId: string): Promise<UserSubscription | undefined> {
    const [subscription] = await db.select().from(userSubscriptions)
      .where(and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, 'active')
      ));
    return subscription;
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const [newSubscription] = await db.insert(userSubscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateUserSubscription(id: string, subscription: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined> {
    const [updatedSubscription] = await db.update(userSubscriptions)
      .set(subscription)
      .where(eq(userSubscriptions.id, id))
      .returning();
    return updatedSubscription;
  }

  async cancelUserSubscription(id: string): Promise<boolean> {
    const result = await db.update(userSubscriptions)
      .set({ status: 'cancelled' })
      .where(eq(userSubscriptions.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Benchmarking
  async getBenchmarks(projectId: string): Promise<Benchmark[]> {
    return await db.select().from(benchmarks)
      .where(eq(benchmarks.projectId, projectId))
      .orderBy(desc(benchmarks.createdAt));
  }

  async getBenchmark(id: string): Promise<Benchmark | undefined> {
    const [benchmark] = await db.select().from(benchmarks).where(eq(benchmarks.id, id));
    return benchmark;
  }

  async createBenchmark(benchmark: InsertBenchmark): Promise<Benchmark> {
    const [newBenchmark] = await db.insert(benchmarks).values(benchmark).returning();
    return newBenchmark;
  }

  async updateBenchmark(id: string, benchmark: Partial<InsertBenchmark>): Promise<Benchmark | undefined> {
    const [updatedBenchmark] = await db.update(benchmarks)
      .set(benchmark)
      .where(eq(benchmarks.id, id))
      .returning();
    return updatedBenchmark;
  }

  async deleteBenchmark(id: string): Promise<boolean> {
    const result = await db.delete(benchmarks).where(eq(benchmarks.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getBenchmarkAssessments(benchmarkId: string): Promise<BenchmarkAssessment[]> {
    return await db.select().from(benchmarkAssessments)
      .where(eq(benchmarkAssessments.benchmarkId, benchmarkId))
      .orderBy(desc(benchmarkAssessments.createdAt));
  }

  async createBenchmarkAssessment(assessment: InsertBenchmarkAssessment): Promise<BenchmarkAssessment> {
    const [newAssessment] = await db.insert(benchmarkAssessments).values(assessment).returning();
    return newAssessment;
  }

  async updateBenchmarkAssessment(id: string, assessment: Partial<InsertBenchmarkAssessment>): Promise<BenchmarkAssessment | undefined> {
    const [updatedAssessment] = await db.update(benchmarkAssessments)
      .set(assessment)
      .where(eq(benchmarkAssessments.id, id))
      .returning();
    return updatedAssessment;
  }

  async deleteBenchmarkAssessment(id: string): Promise<boolean> {
    const result = await db.delete(benchmarkAssessments).where(eq(benchmarkAssessments.id, id));
    return (result.rowCount || 0) > 0;
  }

  // DVF Assessment - Desirability, Feasibility, Viability
  async getDvfAssessments(projectId: string): Promise<DvfAssessment[]> {
    return await db.select().from(dvfAssessments)
      .where(eq(dvfAssessments.projectId, projectId))
      .orderBy(desc(dvfAssessments.createdAt));
  }

  async getDvfAssessment(id: string): Promise<DvfAssessment | undefined> {
    const [assessment] = await db.select().from(dvfAssessments).where(eq(dvfAssessments.id, id));
    return assessment;
  }

  async createDvfAssessment(assessment: InsertDvfAssessment): Promise<DvfAssessment> {
    const [newAssessment] = await db.insert(dvfAssessments).values(assessment).returning();
    return newAssessment;
  }

  async updateDvfAssessment(id: string, assessment: Partial<InsertDvfAssessment>): Promise<DvfAssessment | undefined> {
    const [updatedAssessment] = await db.update(dvfAssessments)
      .set({ ...assessment, updatedAt: new Date() })
      .where(eq(dvfAssessments.id, id))
      .returning();
    return updatedAssessment;
  }

  async deleteDvfAssessment(id: string): Promise<boolean> {
    const result = await db.delete(dvfAssessments).where(eq(dvfAssessments.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Lovability Metrics
  async getLovabilityMetrics(projectId: string): Promise<LovabilityMetric[]> {
    return await db.select().from(lovabilityMetrics)
      .where(eq(lovabilityMetrics.projectId, projectId))
      .orderBy(desc(lovabilityMetrics.createdAt));
  }

  async getLovabilityMetric(id: string): Promise<LovabilityMetric | undefined> {
    const [metric] = await db.select().from(lovabilityMetrics).where(eq(lovabilityMetrics.id, id));
    return metric;
  }

  async createLovabilityMetric(metric: InsertLovabilityMetric): Promise<LovabilityMetric> {
    const [newMetric] = await db.insert(lovabilityMetrics).values(metric).returning();
    return newMetric;
  }

  async updateLovabilityMetric(id: string, metric: Partial<InsertLovabilityMetric>): Promise<LovabilityMetric | undefined> {
    const [updatedMetric] = await db.update(lovabilityMetrics)
      .set({ ...metric, updatedAt: new Date() })
      .where(eq(lovabilityMetrics.id, id))
      .returning();
    return updatedMetric;
  }

  async deleteLovabilityMetric(id: string): Promise<boolean> {
    const result = await db.delete(lovabilityMetrics).where(eq(lovabilityMetrics.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Project Analytics
  async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics | undefined> {
    const [analytics] = await db.select().from(projectAnalytics)
      .where(eq(projectAnalytics.projectId, projectId));
    return analytics;
  }

  async createProjectAnalytics(analytics: InsertProjectAnalytics): Promise<ProjectAnalytics> {
    const [newAnalytics] = await db.insert(projectAnalytics).values(analytics).returning();
    return newAnalytics;
  }

  async updateProjectAnalytics(id: string, analytics: Partial<InsertProjectAnalytics>): Promise<ProjectAnalytics | undefined> {
    const [updatedAnalytics] = await db.update(projectAnalytics)
      .set({ ...analytics, lastUpdated: new Date() })
      .where(eq(projectAnalytics.id, id))
      .returning();
    return updatedAnalytics;
  }

  // Competitive Analysis
  async getCompetitiveAnalyses(projectId: string): Promise<CompetitiveAnalysis[]> {
    return await db.select().from(competitiveAnalysis)
      .where(eq(competitiveAnalysis.projectId, projectId))
      .orderBy(desc(competitiveAnalysis.createdAt));
  }

  async getCompetitiveAnalysis(id: string): Promise<CompetitiveAnalysis | undefined> {
    const [analysis] = await db.select().from(competitiveAnalysis).where(eq(competitiveAnalysis.id, id));
    return analysis;
  }

  async createCompetitiveAnalysis(analysis: InsertCompetitiveAnalysis): Promise<CompetitiveAnalysis> {
    const [newAnalysis] = await db.insert(competitiveAnalysis).values(analysis).returning();
    return newAnalysis;
  }

  async updateCompetitiveAnalysis(id: string, analysis: Partial<InsertCompetitiveAnalysis>): Promise<CompetitiveAnalysis | undefined> {
    const [updatedAnalysis] = await db.update(competitiveAnalysis)
      .set({ ...analysis, updatedAt: new Date() })
      .where(eq(competitiveAnalysis.id, id))
      .returning();
    return updatedAnalysis;
  }

  async deleteCompetitiveAnalysis(id: string): Promise<boolean> {
    const result = await db.delete(competitiveAnalysis).where(eq(competitiveAnalysis.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Project Backups
  async createProjectBackup(projectId: string, userId: string, backupType: 'auto' | 'manual', description?: string): Promise<ProjectBackup> {
    const project = await this.getProject(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Get all project data
    const [empathyMapsData, personasData, interviewsData, observationsData, 
           povStatementsData, hmwQuestionsData, ideasData, prototypesData, 
           testPlansData] = await Promise.all([
      this.getEmpathyMaps(projectId),
      this.getPersonas(projectId),
      this.getInterviews(projectId),
      this.getObservations(projectId),
      this.getPovStatements(projectId),
      this.getHmwQuestions(projectId),
      this.getIdeas(projectId),
      this.getPrototypes(projectId),
      this.getTestPlans(projectId),
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
      testPlans: testPlansData,
    };

    const totalItems = empathyMapsData.length + personasData.length + interviewsData.length + 
                      observationsData.length + povStatementsData.length + hmwQuestionsData.length +
                      ideasData.length + prototypesData.length + testPlansData.length;

    const [backup] = await db.insert(projectBackups).values({
      projectId,
      backupType,
      description,
      projectSnapshot,
      phaseSnapshot: project.currentPhase,
      completionSnapshot: project.completionRate,
      itemCount: totalItems,
    }).returning();

    return backup;
  }

  async getProjectBackups(projectId: string): Promise<ProjectBackup[]> {
    return await db.select().from(projectBackups)
      .where(eq(projectBackups.projectId, projectId))
      .orderBy(desc(projectBackups.createdAt));
  }

  async getProjectBackup(id: string): Promise<ProjectBackup | undefined> {
    const [backup] = await db.select().from(projectBackups).where(eq(projectBackups.id, id));
    return backup;
  }

  async restoreProjectBackup(backupId: string): Promise<boolean> {
    const backup = await this.getProjectBackup(backupId);
    if (!backup || !backup.projectSnapshot) {
      return false;
    }

    const snapshot = backup.projectSnapshot as any;
    const projectId = backup.projectId;

    // Delete existing project data
    await Promise.all([
      db.delete(empathyMaps).where(eq(empathyMaps.projectId, projectId)),
      db.delete(personas).where(eq(personas.projectId, projectId)),
      db.delete(interviews).where(eq(interviews.projectId, projectId)),
      db.delete(observations).where(eq(observations.projectId, projectId)),
      db.delete(povStatements).where(eq(povStatements.projectId, projectId)),
      db.delete(hmwQuestions).where(eq(hmwQuestions.projectId, projectId)),
      db.delete(ideas).where(eq(ideas.projectId, projectId)),
      db.delete(prototypes).where(eq(prototypes.projectId, projectId)),
      db.delete(testPlans).where(eq(testPlans.projectId, projectId)),
    ]);

    // Restore project data (use userId from backup's project)
    const userId = snapshot.project.userId;
    await this.updateProject(projectId, userId, {
      name: snapshot.project.name,
      description: snapshot.project.description,
      status: snapshot.project.status,
      currentPhase: snapshot.project.currentPhase,
      completionRate: snapshot.project.completionRate,
    });

    // Restore all data (remove IDs to let DB generate new ones)
    if (snapshot.empathyMaps?.length > 0) {
      await db.insert(empathyMaps).values(
        snapshot.empathyMaps.map((em: any) => {
          const { id, createdAt, updatedAt, ...rest } = em;
          return rest;
        })
      );
    }
    if (snapshot.personas?.length > 0) {
      await db.insert(personas).values(
        snapshot.personas.map((p: any) => {
          const { id, createdAt, updatedAt, ...rest } = p;
          return rest;
        })
      );
    }
    if (snapshot.interviews?.length > 0) {
      await db.insert(interviews).values(
        snapshot.interviews.map((i: any) => {
          const { id, createdAt, ...rest } = i;
          return rest;
        })
      );
    }
    if (snapshot.observations?.length > 0) {
      await db.insert(observations).values(
        snapshot.observations.map((o: any) => {
          const { id, createdAt, ...rest } = o;
          return rest;
        })
      );
    }
    if (snapshot.povStatements?.length > 0) {
      await db.insert(povStatements).values(
        snapshot.povStatements.map((p: any) => {
          const { id, createdAt, ...rest } = p;
          return rest;
        })
      );
    }
    if (snapshot.hmwQuestions?.length > 0) {
      await db.insert(hmwQuestions).values(
        snapshot.hmwQuestions.map((h: any) => {
          const { id, createdAt, ...rest } = h;
          return rest;
        })
      );
    }
    if (snapshot.ideas?.length > 0) {
      await db.insert(ideas).values(
        snapshot.ideas.map((idea: any) => {
          const { id, createdAt, ...rest } = idea;
          return rest;
        })
      );
    }
    if (snapshot.prototypes?.length > 0) {
      await db.insert(prototypes).values(
        snapshot.prototypes.map((p: any) => {
          const { id, createdAt, ...rest } = p;
          return rest;
        })
      );
    }
    if (snapshot.testPlans?.length > 0) {
      await db.insert(testPlans).values(
        snapshot.testPlans.map((t: any) => {
          const { id, createdAt, ...rest } = t;
          return rest;
        })
      );
    }

    return true;
  }

  async deleteProjectBackup(id: string): Promise<boolean> {
    const result = await db.delete(projectBackups).where(eq(projectBackups.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Help Articles
  async getHelpArticles(): Promise<HelpArticle[]> {
    return await db.select().from(helpArticles).orderBy(desc(helpArticles.order), desc(helpArticles.createdAt));
  }

  async getHelpArticleBySlug(slug: string): Promise<HelpArticle | undefined> {
    const [article] = await db.select().from(helpArticles).where(eq(helpArticles.slug, slug));
    return article;
  }

  async searchHelpArticles(searchTerm: string): Promise<HelpArticle[]> {
    const lowerSearch = searchTerm.toLowerCase();
    const allArticles = await db.select().from(helpArticles);
    
    // Filter articles by title, content, tags, or keywords
    return allArticles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(lowerSearch);
      const contentMatch = article.content.toLowerCase().includes(lowerSearch);
      const tagsMatch = article.tags && JSON.stringify(article.tags).toLowerCase().includes(lowerSearch);
      const keywordsMatch = article.searchKeywords && JSON.stringify(article.searchKeywords).toLowerCase().includes(lowerSearch);
      
      return titleMatch || contentMatch || tagsMatch || keywordsMatch;
    });
  }

  async incrementHelpArticleViews(id: string): Promise<HelpArticle | undefined> {
    const [article] = await db.select().from(helpArticles).where(eq(helpArticles.id, id));
    if (!article) return undefined;
    
    const [updated] = await db.update(helpArticles)
      .set({ viewCount: (article.viewCount || 0) + 1 })
      .where(eq(helpArticles.id, id))
      .returning();
    
    return updated;
  }

  async incrementHelpArticleHelpful(id: string): Promise<HelpArticle | undefined> {
    const [article] = await db.select().from(helpArticles).where(eq(helpArticles.id, id));
    if (!article) return undefined;
    
    const [updated] = await db.update(helpArticles)
      .set({ helpful: (article.helpful || 0) + 1 })
      .where(eq(helpArticles.id, id))
      .returning();
    
    return updated;
  }

  async createHelpArticle(article: any): Promise<HelpArticle> {
    const [newArticle] = await db.insert(helpArticles).values(article).returning();
    return newArticle;
  }

  async updateHelpArticle(id: string, article: any): Promise<HelpArticle | undefined> {
    const [updated] = await db.update(helpArticles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(helpArticles.id, id))
      .returning();
    return updated;
  }

  async deleteHelpArticle(id: string): Promise<boolean> {
    const result = await db.delete(helpArticles).where(eq(helpArticles.id, id));
    return (result.rowCount || 0) > 0;
  }

  // AI Automation: Industry Sectors
  async getIndustrySectors(): Promise<IndustrySector[]> {
    return await db.select().from(industrySectors).orderBy(industrySectors.order, desc(industrySectors.createdAt));
  }

  async getActiveIndustrySectors(): Promise<IndustrySector[]> {
    return await db.select().from(industrySectors)
      .where(eq(industrySectors.isActive, true))
      .orderBy(industrySectors.order, desc(industrySectors.createdAt));
  }

  async getIndustrySector(id: string): Promise<IndustrySector | undefined> {
    const [sector] = await db.select().from(industrySectors).where(eq(industrySectors.id, id));
    return sector;
  }

  async createIndustrySector(sector: InsertIndustrySector): Promise<IndustrySector> {
    const [newSector] = await db.insert(industrySectors).values(sector).returning();
    return newSector;
  }

  async updateIndustrySector(id: string, sector: Partial<InsertIndustrySector>): Promise<IndustrySector | undefined> {
    const [updated] = await db.update(industrySectors)
      .set({ ...sector, updatedAt: new Date() })
      .where(eq(industrySectors.id, id))
      .returning();
    return updated;
  }

  async deleteIndustrySector(id: string): Promise<boolean> {
    const result = await db.delete(industrySectors).where(eq(industrySectors.id, id));
    return (result.rowCount || 0) > 0;
  }

  // AI Automation: Success Cases
  async getSuccessCases(): Promise<SuccessCase[]> {
    return await db.select().from(successCases).orderBy(successCases.order, desc(successCases.createdAt));
  }

  async getActiveSuccessCases(): Promise<SuccessCase[]> {
    return await db.select().from(successCases)
      .where(eq(successCases.isActive, true))
      .orderBy(successCases.order, desc(successCases.createdAt));
  }

  async getSuccessCasesBySector(sectorId: string): Promise<SuccessCase[]> {
    return await db.select().from(successCases)
      .where(and(eq(successCases.sectorId, sectorId), eq(successCases.isActive, true)))
      .orderBy(successCases.order, desc(successCases.createdAt));
  }

  async getSuccessCase(id: string): Promise<SuccessCase | undefined> {
    const [successCase] = await db.select().from(successCases).where(eq(successCases.id, id));
    return successCase;
  }

  async createSuccessCase(caseData: InsertSuccessCase): Promise<SuccessCase> {
    const [newCase] = await db.insert(successCases).values(caseData).returning();
    return newCase;
  }

  async updateSuccessCase(id: string, caseData: Partial<InsertSuccessCase>): Promise<SuccessCase | undefined> {
    const [updated] = await db.update(successCases)
      .set({ ...caseData, updatedAt: new Date() })
      .where(eq(successCases.id, id))
      .returning();
    return updated;
  }

  async deleteSuccessCase(id: string): Promise<boolean> {
    const result = await db.delete(successCases).where(eq(successCases.id, id));
    return (result.rowCount || 0) > 0;
  }

  // AI Automation: Generated Assets
  async getAiGeneratedAssets(projectId: string): Promise<AiGeneratedAsset[]> {
    return await db.select().from(aiGeneratedAssets)
      .where(eq(aiGeneratedAssets.projectId, projectId))
      .orderBy(desc(aiGeneratedAssets.createdAt));
  }

  async getAiGeneratedAssetsByType(projectId: string, assetType: string): Promise<AiGeneratedAsset[]> {
    return await db.select().from(aiGeneratedAssets)
      .where(and(
        eq(aiGeneratedAssets.projectId, projectId),
        eq(aiGeneratedAssets.assetType, assetType)
      ))
      .orderBy(desc(aiGeneratedAssets.createdAt));
  }

  async getAiGeneratedAsset(id: string): Promise<AiGeneratedAsset | undefined> {
    const [asset] = await db.select().from(aiGeneratedAssets).where(eq(aiGeneratedAssets.id, id));
    return asset;
  }

  async createAiGeneratedAsset(asset: InsertAiGeneratedAsset): Promise<AiGeneratedAsset> {
    const [newAsset] = await db.insert(aiGeneratedAssets).values(asset).returning();
    return newAsset;
  }

  async updateAiGeneratedAsset(id: string, asset: Partial<InsertAiGeneratedAsset>): Promise<AiGeneratedAsset | undefined> {
    const [updated] = await db.update(aiGeneratedAssets)
      .set(asset)
      .where(eq(aiGeneratedAssets.id, id))
      .returning();
    return updated;
  }

  async deleteAiGeneratedAsset(id: string): Promise<boolean> {
    const result = await db.delete(aiGeneratedAssets).where(eq(aiGeneratedAssets.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Analytics Events
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
    return newEvent;
  }

  async getAnalyticsEvents(filters?: { eventType?: string; userId?: string; startDate?: Date; endDate?: Date }): Promise<AnalyticsEvent[]> {
    let query = db.select().from(analyticsEvents);
    
    const conditions = [];
    if (filters?.eventType) conditions.push(eq(analyticsEvents.eventType, filters.eventType));
    if (filters?.userId) conditions.push(eq(analyticsEvents.userId, filters.userId));
    if (filters?.startDate) conditions.push(sql`${analyticsEvents.createdAt} >= ${filters.startDate}`);
    if (filters?.endDate) conditions.push(sql`${analyticsEvents.createdAt} <= ${filters.endDate}`);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(analyticsEvents.createdAt));
  }

  async getAnalyticsSummary(): Promise<{
    totalUsers: number;
    totalProjects: number;
    totalAiGenerations: number;
    newUsersThisMonth: number;
    projectsThisMonth: number;
    aiGenerationsThisMonth: number;
  }> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [totalProjectsResult] = await db.select({ count: sql<number>`count(*)::int` }).from(projects);
    const [totalAiGenerationsResult] = await db.select({ count: sql<number>`count(*)::int` })
      .from(projects).where(eq(projects.aiGenerated, true));
    
    const [newUsersThisMonthResult] = await db.select({ count: sql<number>`count(*)::int` })
      .from(users).where(sql`${users.createdAt} >= ${firstDayOfMonth}`);
    
    const [projectsThisMonthResult] = await db.select({ count: sql<number>`count(*)::int` })
      .from(projects).where(sql`${projects.createdAt} >= ${firstDayOfMonth}`);
    
    const [aiGenerationsThisMonthResult] = await db.select({ count: sql<number>`count(*)::int` })
      .from(projects).where(and(
        eq(projects.aiGenerated, true),
        sql`${projects.createdAt} >= ${firstDayOfMonth}`
      ));

    return {
      totalUsers: totalUsersResult?.count || 0,
      totalProjects: totalProjectsResult?.count || 0,
      totalAiGenerations: totalAiGenerationsResult?.count || 0,
      newUsersThisMonth: newUsersThisMonthResult?.count || 0,
      projectsThisMonth: projectsThisMonthResult?.count || 0,
      aiGenerationsThisMonth: aiGenerationsThisMonthResult?.count || 0,
    };
  }

  // Project Members (Teams)
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    return await db.select().from(projectMembers)
      .where(eq(projectMembers.projectId, projectId))
      .orderBy(projectMembers.addedAt);
  }

  async getProjectMember(projectId: string, userId: string): Promise<ProjectMember | undefined> {
    const [member] = await db.select().from(projectMembers)
      .where(and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId)
      ));
    return member;
  }

  async createProjectMember(member: InsertProjectMember): Promise<ProjectMember> {
    const [newMember] = await db.insert(projectMembers).values(member).returning();
    return newMember;
  }

  async updateProjectMemberRole(id: string, role: string): Promise<ProjectMember | undefined> {
    const [updated] = await db.update(projectMembers)
      .set({ role })
      .where(eq(projectMembers.id, id))
      .returning();
    return updated;
  }

  async deleteProjectMember(id: string): Promise<boolean> {
    const result = await db.delete(projectMembers).where(eq(projectMembers.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserProjects(userId: string): Promise<string[]> {
    // Get projects owned by user
    const ownedProjects = await db.select({ id: projects.id })
      .from(projects)
      .where(eq(projects.userId, userId));
    
    // Get projects where user is a member
    const memberProjects = await db.select({ projectId: projectMembers.projectId })
      .from(projectMembers)
      .where(eq(projectMembers.userId, userId));
    
    const projectIds = [
      ...ownedProjects.map(p => p.id),
      ...memberProjects.map(m => m.projectId)
    ];
    
    return [...new Set(projectIds)]; // Remove duplicates
  }

  // Project Invites
  async getProjectInvites(projectId: string): Promise<ProjectInvite[]> {
    return await db.select().from(projectInvites)
      .where(eq(projectInvites.projectId, projectId))
      .orderBy(desc(projectInvites.createdAt));
  }

  async getPendingInvitesByEmail(email: string): Promise<ProjectInvite[]> {
    return await db.select().from(projectInvites)
      .where(and(
        eq(projectInvites.email, email),
        eq(projectInvites.status, 'pending')
      ))
      .orderBy(desc(projectInvites.createdAt));
  }

  async getProjectInviteByToken(token: string): Promise<ProjectInvite | undefined> {
    const [invite] = await db.select().from(projectInvites)
      .where(eq(projectInvites.token, token));
    return invite;
  }

  async createProjectInvite(invite: InsertProjectInvite): Promise<ProjectInvite> {
    const [newInvite] = await db.insert(projectInvites).values(invite).returning();
    return newInvite;
  }

  async updateProjectInvite(id: string, updates: Partial<InsertProjectInvite>): Promise<ProjectInvite | undefined> {
    const [updated] = await db.update(projectInvites)
      .set(updates)
      .where(eq(projectInvites.id, id))
      .returning();
    return updated;
  }

  async updateProjectInviteStatus(id: string, status: string, respondedAt?: Date): Promise<ProjectInvite | undefined> {
    const [updated] = await db.update(projectInvites)
      .set({ status, respondedAt: respondedAt || new Date() })
      .where(eq(projectInvites.id, id))
      .returning();
    return updated;
  }

  async deleteProjectInvite(id: string): Promise<boolean> {
    const result = await db.delete(projectInvites).where(eq(projectInvites.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Project Comments
  async getProjectComments(projectId: string): Promise<ProjectComment[]> {
    return await db.select().from(projectComments)
      .where(eq(projectComments.projectId, projectId))
      .orderBy(desc(projectComments.createdAt));
  }

  async getEntityComments(projectId: string, entityType: string, entityId?: string): Promise<ProjectComment[]> {
    const conditions = [
      eq(projectComments.projectId, projectId),
      eq(projectComments.entityType, entityType)
    ];
    
    if (entityId) {
      conditions.push(eq(projectComments.entityId, entityId));
    }
    
    return await db.select().from(projectComments)
      .where(and(...conditions))
      .orderBy(projectComments.createdAt);
  }

  async createProjectComment(comment: InsertProjectComment): Promise<ProjectComment> {
    const [newComment] = await db.insert(projectComments).values(comment).returning();
    return newComment;
  }

  async updateProjectComment(id: string, comment: Partial<InsertProjectComment>): Promise<ProjectComment | undefined> {
    const [updated] = await db.update(projectComments)
      .set({ ...comment, updatedAt: new Date() })
      .where(eq(projectComments.id, id))
      .returning();
    return updated;
  }

  async deleteProjectComment(id: string): Promise<boolean> {
    const result = await db.delete(projectComments).where(eq(projectComments.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Video Tutorials
  async getVideoTutorials(): Promise<VideoTutorial[]> {
    return await db.select().from(videoTutorials)
      .where(eq(videoTutorials.isActive, true))
      .orderBy(videoTutorials.order);
  }

  async getVideoTutorialsByPhase(phase: string): Promise<VideoTutorial[]> {
    return await db.select().from(videoTutorials)
      .where(and(eq(videoTutorials.phase, phase), eq(videoTutorials.isActive, true)))
      .orderBy(videoTutorials.order);
  }

  async getVideoTutorial(id: string): Promise<VideoTutorial | undefined> {
    const [video] = await db.select().from(videoTutorials).where(eq(videoTutorials.id, id));
    return video;
  }

  async createVideoTutorial(video: InsertVideoTutorial): Promise<VideoTutorial> {
    const [newVideo] = await db.insert(videoTutorials).values(video).returning();
    return newVideo;
  }

  async updateVideoTutorial(id: string, video: Partial<InsertVideoTutorial>): Promise<VideoTutorial> {
    const [updatedVideo] = await db.update(videoTutorials)
      .set({ ...video, updatedAt: new Date() })
      .where(eq(videoTutorials.id, id))
      .returning();
    return updatedVideo;
  }

  async deleteVideoTutorial(id: string): Promise<boolean> {
    const result = await db.delete(videoTutorials).where(eq(videoTutorials.id, id));
    return (result.rowCount || 0) > 0;
  }

  async incrementVideoView(id: string): Promise<void> {
    await db.update(videoTutorials)
      .set({ viewCount: sql`${videoTutorials.viewCount} + 1` })
      .where(eq(videoTutorials.id, id));
  }

  // Double Diamond
  async getDoubleDiamondProjects(userId: string): Promise<DoubleDiamondProject[]> {
    return await db.select().from(doubleDiamondProjects)
      .where(eq(doubleDiamondProjects.userId, userId))
      .orderBy(desc(doubleDiamondProjects.createdAt));
  }

  async getAllDoubleDiamondProjects(): Promise<DoubleDiamondProject[]> {
    return await db.select().from(doubleDiamondProjects)
      .orderBy(desc(doubleDiamondProjects.createdAt));
  }

  async getDoubleDiamondProject(id: string, userId: string): Promise<DoubleDiamondProject | undefined> {
    const [project] = await db.select().from(doubleDiamondProjects)
      .where(and(
        eq(doubleDiamondProjects.id, id),
        eq(doubleDiamondProjects.userId, userId)
      ));
    return project;
  }

  async createDoubleDiamondProject(project: InsertDoubleDiamondProject): Promise<DoubleDiamondProject> {
    const [newProject] = await db.insert(doubleDiamondProjects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateDoubleDiamondProject(
    id: string, 
    userId: string, 
    updates: Partial<InsertDoubleDiamondProject>
  ): Promise<DoubleDiamondProject | undefined> {
    const [updated] = await db.update(doubleDiamondProjects)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(doubleDiamondProjects.id, id),
        eq(doubleDiamondProjects.userId, userId)
      ))
      .returning();
    return updated;
  }

  async deleteDoubleDiamondProject(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(doubleDiamondProjects)
      .where(and(
        eq(doubleDiamondProjects.id, id),
        eq(doubleDiamondProjects.userId, userId)
      ));
    return (result.rowCount || 0) > 0;
  }

  // Industry Sectors & Success Cases
  async listIndustrySectors(): Promise<IndustrySector[]> {
    return await db.select().from(industrySectors).orderBy(industrySectors.name);
  }

  async listSuccessCases(): Promise<SuccessCase[]> {
    return await db.select().from(successCases).orderBy(successCases.company);
  }
}

// Use DatabaseStorage in production, keep reference to blueprint:javascript_database integration
export const storage = new DatabaseStorage();

// Initialize default admin user and sample data
export async function initializeDefaultData() {
  try {
    // Check if admin user exists
    const adminUser = await storage.getUserByUsername('dttools.app@gmail.com');
    
    if (!adminUser) {
      // Create admin user with proper password hash
      const hashedPassword = await bcrypt.hash('Gulex0519!@', 10);
      await storage.createUser({
        username: 'dttools.app@gmail.com',
        email: 'dttools.app@gmail.com',
        name: 'DTTools Admin',
        password: hashedPassword,
        role: 'admin',
        company: 'DTTools',
        jobRole: 'Administrator',
        industry: 'Design Thinking',
        experience: 'expert',
        country: 'Brasil',
        state: 'SP',
        city: 'São Paulo'
      });
      console.log('✅ Admin user created successfully');
    }

    // Initialize subscription plans
    const existingPlans = await storage.getSubscriptionPlans();
    if (existingPlans.length === 0) {
      await storage.createSubscriptionPlan({
        name: 'Free',
        displayName: 'Plano Gratuito',
        description: 'Plan gratuito com recursos básicos',
        priceMonthly: 0,
        priceYearly: 0,
        features: ['3 projetos', 'Ferramentas básicas', 'Suporte por email'],
        maxProjects: 3,
        isActive: true,
        order: 1
      });

      await storage.createSubscriptionPlan({
        name: 'Pro',
        displayName: 'Plano Individual',
        description: 'Plan profissional com recursos avançados',
        priceMonthly: 4000, // R$ 40,00 in cents
        priceYearly: 43200, // R$ 432,00 in cents (10% discount)
        features: ['Projetos ilimitados', 'Todas as ferramentas', 'Análise AI', 'Suporte prioritário'],
        maxProjects: -1, // unlimited
        isActive: true,
        order: 2
      });

      await storage.createSubscriptionPlan({
        name: 'Enterprise',
        displayName: 'Plano Enterprise',
        description: 'Plan empresarial com recursos completos (10 usuários inclusos)',
        priceMonthly: 29900, // R$ 299,00 in cents
        priceYearly: 322920, // R$ 3.229,20 in cents (10% discount: 29900 * 12 * 0.9)
        features: ['Tudo do Pro', '10 usuários inclusos', 'Usuários adicionais: R$ 29,90/usuário', 'Time ilimitado', 'Suporte dedicado', 'Treinamentos'],
        maxProjects: -1, // unlimited
        isActive: true,
        order: 3
      });
      console.log('✅ Subscription plans created');
    } else {
      // ALWAYS update plan order even if they exist
      await db.update(subscriptionPlans).set({ order: 1 }).where(eq(subscriptionPlans.name, 'Free'));
      await db.update(subscriptionPlans).set({ order: 2 }).where(eq(subscriptionPlans.name, 'Pro'));
      await db.update(subscriptionPlans).set({ order: 3 }).where(eq(subscriptionPlans.name, 'Enterprise'));
      console.log('✅ Subscription plan order updated');
    }

    // Initialize default articles for Library
    const existingArticles = await storage.getArticles();
    const dtToolsArticles = existingArticles.filter(a => a.author === 'DTTools');
    if (dtToolsArticles.length === 0) {
      const defaultArticles = [
        {
          title: 'Introdução ao Design Thinking',
          slug: 'introducao-design-thinking',
          category: 'foundations',
          author: 'DTTools',
          description: 'Aprenda os fundamentos do Design Thinking e como aplicar em seus projetos',
          content: '# Introdução ao Design Thinking\n\nDesign Thinking é uma abordagem centrada no ser humano para inovação...',
          tags: ['fundamentos', 'iniciante', 'conceitos'],
          readTime: 5,
          featured: true,
          published: true
        },
        {
          title: 'Como criar Mapas de Empatia eficazes',
          slug: 'mapas-empatia-eficazes',
          category: 'empathize',
          author: 'DTTools',
          description: 'Guia completo para criar Mapas de Empatia que revelam insights profundos sobre seus usuários',
          content: '# Mapas de Empatia\n\nMapas de Empatia são ferramentas poderosas para entender seus usuários...',
          tags: ['empatizar', 'ferramentas', 'usuários'],
          readTime: 7,
          featured: true,
          published: true
        },
        {
          title: 'Definindo Problemas com POV Statements',
          slug: 'pov-statements-guia',
          category: 'define',
          author: 'DTTools',
          description: 'Aprenda a estruturar Point of View statements para definir problemas de forma clara',
          content: '# POV Statements\n\nPoint of View statements ajudam a definir o problema certo...',
          tags: ['definir', 'problema', 'framework'],
          readTime: 6,
          featured: false,
          published: true
        },
        {
          title: 'Técnicas de Brainstorming para Ideação',
          slug: 'brainstorming-tecnicas',
          category: 'ideate',
          author: 'DTTools',
          description: 'Descubra técnicas criativas de brainstorming para gerar ideias inovadoras',
          content: '# Brainstorming Eficaz\n\nBrainstorming é mais do que simplesmente listar ideias...',
          tags: ['idear', 'criatividade', 'técnicas'],
          readTime: 8,
          featured: true,
          published: true
        },
        {
          title: 'Prototipagem Rápida: Do Papel ao Digital',
          slug: 'prototipagem-rapida',
          category: 'prototype',
          author: 'DTTools',
          description: 'Aprenda a criar protótipos rápidos para validar suas ideias',
          content: '# Prototipagem Rápida\n\nProtótipos permitem testar ideias rapidamente...',
          tags: ['prototipar', 'validação', 'prática'],
          readTime: 10,
          featured: false,
          published: true
        },
        {
          title: 'Testes com Usuários: Melhores Práticas',
          slug: 'testes-usuarios-praticas',
          category: 'test',
          author: 'DTTools',
          description: 'Guia completo para conduzir testes de usabilidade e coletar feedback valioso',
          content: '# Testes com Usuários\n\nTestar com usuários reais é essencial para validar soluções...',
          tags: ['testar', 'feedback', 'validação'],
          readTime: 9,
          featured: true,
          published: true
        }
      ];

      for (const article of defaultArticles) {
        await storage.createArticle(article as any);
      }
      console.log('✅ Default articles created');
    }

    // Initialize default help articles for Help Center
    const existingHelpArticles = await storage.getHelpArticles();
    if (existingHelpArticles.length === 0) {
      const defaultHelpArticles = [
        {
          title: 'Como começar a usar o DTTools',
          slug: 'como-comecar',
          category: 'getting-started',
          content: '# Como começar\n\nBem-vindo ao DTTools! Este guia vai te ajudar a dar os primeiros passos...',
          tags: ['iniciante', 'tutorial', 'primeiros-passos'],
          keywords: ['começar', 'iniciar', 'primeiro projeto'],
          order: 1,
          published: true
        },
        {
          title: 'Criando seu primeiro projeto',
          slug: 'primeiro-projeto',
          category: 'getting-started',
          content: '# Seu Primeiro Projeto\n\nCriar um projeto no DTTools é simples e rápido...',
          tags: ['projeto', 'tutorial', 'iniciante'],
          keywords: ['criar projeto', 'novo projeto'],
          order: 2,
          published: true
        },
        {
          title: 'Entendendo as 5 fases do Design Thinking',
          slug: 'cinco-fases',
          category: 'getting-started',
          content: '# As 5 Fases\n\nDesign Thinking é dividido em 5 fases: Empatizar, Definir, Idear, Prototipar e Testar...',
          tags: ['fases', 'metodologia', 'design thinking'],
          keywords: ['fases', 'empatizar', 'definir', 'idear', 'prototipar', 'testar'],
          order: 3,
          published: true
        },
        {
          title: 'Trabalhando em equipe',
          slug: 'trabalho-equipe',
          category: 'collaboration',
          content: '# Colaboração\n\nO DTTools facilita o trabalho em equipe com ferramentas de colaboração...',
          tags: ['equipe', 'colaboração', 'compartilhamento'],
          keywords: ['equipe', 'time', 'colaborar', 'compartilhar'],
          order: 4,
          published: true
        },
        {
          title: 'Exportando seus dados',
          slug: 'exportar-dados',
          category: 'features',
          content: '# Exportação\n\nVocê pode exportar seus projetos em PDF, CSV e outros formatos...',
          tags: ['exportar', 'pdf', 'download'],
          keywords: ['exportar', 'download', 'pdf', 'csv'],
          order: 5,
          published: true
        }
      ];

      for (const helpArticle of defaultHelpArticles) {
        await storage.createHelpArticle(helpArticle);
      }
      console.log('✅ Default help articles created');
    }

    // Sample project creation removed - real projects already exist in production

  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  
  async updateUserLimits(userId: string, limits: {
    customMaxProjects: number | null;
    customMaxDoubleDiamondProjects: number | null;
    customAiChatLimit: number | null;
  }): Promise<void> {
    await db.update(users)
      .set({
        customMaxProjects: limits.customMaxProjects,
        customMaxDoubleDiamondProjects: limits.customMaxDoubleDiamondProjects,
        customAiChatLimit: limits.customAiChatLimit,
      })
      .where(eq(users.id, userId));
  }


  async updateUserLimits(userId: string, limits: {
    customMaxProjects: number | null;
    customMaxDoubleDiamondProjects: number | null;
    customAiChatLimit: number | null;
  }): Promise<void> {
    await db.update(users)
      .set({
        customMaxProjects: limits.customMaxProjects,
        customMaxDoubleDiamondProjects: limits.customMaxDoubleDiamondProjects,
        customAiChatLimit: limits.customAiChatLimit,
      })
      .where(eq(users.id, userId));
  }

}
}