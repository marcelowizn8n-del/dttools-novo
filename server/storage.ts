import { 
  type Project, type InsertProject,
  type EmpathyMap, type InsertEmpathyMap,
  type Persona, type InsertPersona,
  type Interview, type InsertInterview,
  type Observation, type InsertObservation,
  type ProjectInsight, type InsertProjectInsight,
  type PovStatement, type InsertPovStatement,
  type HmwQuestion, type InsertHmwQuestion,
  type Journey, type InsertJourney,
  type JourneyStage, type InsertJourneyStage,
  type JourneyTouchpoint, type InsertJourneyTouchpoint,
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
  type UserAddon, type InsertUserAddon,
  type CanvasDrawing, type InsertCanvasDrawing,
  type GuidingCriterion, type InsertGuidingCriterion,
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
  type DoubleDiamondExport, type InsertDoubleDiamondExport,
  type BpmnDiagram, type InsertBpmnDiagram,
  projects, empathyMaps, personas, interviews, observations,
  projectInsights,
  povStatements, hmwQuestions, journeys, journeyStages, journeyTouchpoints,
  ideas, prototypes, testPlans, testResults,
  userProgress, users, articles, testimonials, videoTutorials, subscriptionPlans, userSubscriptions,
  userAddons,
  canvasDrawings, phaseCards, benchmarks, benchmarkAssessments,
  dvfAssessments, lovabilityMetrics, projectAnalytics, competitiveAnalysis, guidingCriteria,
  projectBackups, helpArticles, industrySectors, successCases, aiGeneratedAssets,
  analyticsEvents, projectMembers, projectInvites, projectComments, 
  doubleDiamondProjects, doubleDiamondExports, bpmnDiagrams
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, and, desc, sql, gte } from "drizzle-orm";

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

  getProjectInsights(projectId: string): Promise<ProjectInsight[]>;
  getProjectInsight(id: string): Promise<ProjectInsight | undefined>;
  createProjectInsight(insight: InsertProjectInsight): Promise<ProjectInsight>;
  updateProjectInsight(id: string, insight: Partial<InsertProjectInsight>): Promise<ProjectInsight | undefined>;
  deleteProjectInsight(id: string): Promise<boolean>;

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

  getGuidingCriteria(projectId: string): Promise<GuidingCriterion[]>;
  getGuidingCriterion(id: string): Promise<GuidingCriterion | undefined>;
  createGuidingCriterion(criterion: InsertGuidingCriterion): Promise<GuidingCriterion>;
  updateGuidingCriterion(id: string, criterion: Partial<InsertGuidingCriterion>): Promise<GuidingCriterion | undefined>;
  deleteGuidingCriterion(id: string): Promise<boolean>;

  // User Journeys (Journey Maps)
  getJourneys(projectId: string): Promise<Journey[]>;
  getJourney(id: string): Promise<Journey | undefined>;
  createJourney(journey: InsertJourney): Promise<Journey>;
  updateJourney(id: string, journey: Partial<InsertJourney>): Promise<Journey | undefined>;
  deleteJourney(id: string): Promise<boolean>;

  getJourneyStages(journeyId: string): Promise<JourneyStage[]>;
  getJourneyStage(id: string): Promise<JourneyStage | undefined>;
  createJourneyStage(stage: InsertJourneyStage): Promise<JourneyStage>;
  updateJourneyStage(id: string, stage: Partial<InsertJourneyStage>): Promise<JourneyStage | undefined>;
  deleteJourneyStage(id: string): Promise<boolean>;

  getJourneyTouchpoints(stageId: string): Promise<JourneyTouchpoint[]>;
  getJourneyTouchpoint(id: string): Promise<JourneyTouchpoint | undefined>;
  createJourneyTouchpoint(touchpoint: InsertJourneyTouchpoint): Promise<JourneyTouchpoint>;
  updateJourneyTouchpoint(id: string, touchpoint: Partial<InsertJourneyTouchpoint>): Promise<JourneyTouchpoint | undefined>;
  deleteJourneyTouchpoint(id: string): Promise<boolean>;

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

  updateUserLimits(userId: string, limits: {
    customMaxProjects: number | null;
    customMaxDoubleDiamondProjects: number | null;
    customMaxDoubleDiamondExports: number | null;
    customAiChatLimit: number | null;
    customLimitsTrialEndDate?: Date | null;
  }): Promise<void>;

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

  // User Add-ons
  getUserAddons(userId: string): Promise<UserAddon[]>;
  getActiveUserAddons(userId: string): Promise<UserAddon[]>;
  createUserAddon(addon: InsertUserAddon): Promise<UserAddon>;
  updateUserAddon(id: string, addon: Partial<InsertUserAddon>): Promise<UserAddon | undefined>;
  deleteUserAddon(id: string): Promise<boolean>;
  updateUserAddonsByStripeSubscription(stripeSubscriptionId: string, addon: Partial<InsertUserAddon>): Promise<boolean>;

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
  getBpmnDiagramsByProject(projectId: string): Promise<BpmnDiagram[]>;
  getBpmnDiagram(id: string): Promise<BpmnDiagram | undefined>;
  createBpmnDiagram(diagram: InsertBpmnDiagram): Promise<BpmnDiagram>;
  updateBpmnDiagram(id: string, diagram: Partial<InsertBpmnDiagram>): Promise<BpmnDiagram | undefined>;
  deleteBpmnDiagram(id: string): Promise<boolean>;
  
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

    await deleteTable('projectInsights', () => db.delete(projectInsights).where(eq(projectInsights.projectId, id)));
    
    // Delete observations
    await deleteTable('observations', () => db.delete(observations).where(eq(observations.projectId, id)));
    
    // Delete POV statements
    await deleteTable('povStatements', () => db.delete(povStatements).where(eq(povStatements.projectId, id)));
    
    // Delete HMW questions
    await deleteTable('hmwQuestions', () => db.delete(hmwQuestions).where(eq(hmwQuestions.projectId, id)));

    // Delete guiding criteria
    await deleteTable('guidingCriteria', () => db.delete(guidingCriteria).where(eq(guidingCriteria.projectId, id)));
    
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
      
      console.log(`[DELETE USER] Step 6b: Deleting user add-ons...`);
      const deletedAddons = await db.delete(userAddons).where(eq(userAddons.userId, id));
      console.log(`[DELETE USER] ✓ Deleted ${deletedAddons.rowCount || 0} add-ons`);
      
      console.log(`[DELETE USER] Step 6c: Deleting double diamond exports...`);
      const deletedDdExports = await db.delete(doubleDiamondExports).where(eq(doubleDiamondExports.userId, id));
      console.log(`[DELETE USER] ✓ Deleted ${deletedDdExports.rowCount || 0} double diamond exports`);
      
      console.log(`[DELETE USER] Step 6d: Deleting double diamond projects...`);
      const deletedDdProjects = await db.delete(doubleDiamondProjects).where(eq(doubleDiamondProjects.userId, id));
      console.log(`[DELETE USER] ✓ Deleted ${deletedDdProjects.rowCount || 0} double diamond projects`);
      
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
          try { await db.delete(guidingCriteria).where(eq(guidingCriteria.projectId, projectId)); } catch (e) {}
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

  async getProjectInsights(projectId: string): Promise<ProjectInsight[]> {
    return await db.select().from(projectInsights)
      .where(eq(projectInsights.projectId, projectId))
      .orderBy(desc(projectInsights.createdAt));
  }

  async getProjectInsight(id: string): Promise<ProjectInsight | undefined> {
    const [insight] = await db.select().from(projectInsights).where(eq(projectInsights.id, id));
    return insight;
  }

  async createProjectInsight(insight: InsertProjectInsight): Promise<ProjectInsight> {
    const [newInsight] = await db.insert(projectInsights)
      .values(insight)
      .returning();
    return newInsight;
  }

  async updateProjectInsight(id: string, insight: Partial<InsertProjectInsight>): Promise<ProjectInsight | undefined> {
    const [updatedInsight] = await db.update(projectInsights)
      .set({ ...insight, updatedAt: new Date() })
      .where(eq(projectInsights.id, id))
      .returning();
    return updatedInsight;
  }

  async deleteProjectInsight(id: string): Promise<boolean> {
    const result = await db.delete(projectInsights).where(eq(projectInsights.id, id));
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

  async getGuidingCriteria(projectId: string): Promise<GuidingCriterion[]> {
    return await db.select().from(guidingCriteria)
      .where(eq(guidingCriteria.projectId, projectId))
      .orderBy(desc(guidingCriteria.createdAt));
  }

  async getGuidingCriterion(id: string): Promise<GuidingCriterion | undefined> {
    const [criterion] = await db.select().from(guidingCriteria).where(eq(guidingCriteria.id, id));
    return criterion;
  }

  async createGuidingCriterion(criterion: InsertGuidingCriterion): Promise<GuidingCriterion> {
    const [newCriterion] = await db.insert(guidingCriteria).values(criterion).returning();
    return newCriterion;
  }

  async updateGuidingCriterion(id: string, criterion: Partial<InsertGuidingCriterion>): Promise<GuidingCriterion | undefined> {
    const [updatedCriterion] = await db.update(guidingCriteria)
      .set({ ...criterion, updatedAt: new Date() })
      .where(eq(guidingCriteria.id, id))
      .returning();
    return updatedCriterion;
  }

  async deleteGuidingCriterion(id: string): Promise<boolean> {
    const result = await db.delete(guidingCriteria).where(eq(guidingCriteria.id, id));
    return (result.rowCount || 0) > 0;
  }

  // User Journeys (Journey Maps)
  async getJourneys(projectId: string): Promise<Journey[]> {
    return await db
      .select()
      .from(journeys)
      .where(eq(journeys.projectId, projectId))
      .orderBy(desc(journeys.createdAt));
  }

  async getJourney(id: string): Promise<Journey | undefined> {
    const [journey] = await db.select().from(journeys).where(eq(journeys.id, id));
    return journey;
  }

  async createJourney(journey: InsertJourney): Promise<Journey> {
    const [newJourney] = await db.insert(journeys).values(journey).returning();
    return newJourney;
  }

  async updateJourney(id: string, journey: Partial<InsertJourney>): Promise<Journey | undefined> {
    const [updatedJourney] = await db
      .update(journeys)
      .set({ ...journey, updatedAt: new Date() })
      .where(eq(journeys.id, id))
      .returning();
    return updatedJourney;
  }

  async deleteJourney(id: string): Promise<boolean> {
    const result = await db.delete(journeys).where(eq(journeys.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Journey Stages
  async getJourneyStages(journeyId: string): Promise<JourneyStage[]> {
    return await db
      .select()
      .from(journeyStages)
      .where(eq(journeyStages.journeyId, journeyId))
      .orderBy(journeyStages.order, journeyStages.createdAt);
  }

  async getJourneyStage(id: string): Promise<JourneyStage | undefined> {
    const [stage] = await db
      .select()
      .from(journeyStages)
      .where(eq(journeyStages.id, id));
    return stage;
  }

  async createJourneyStage(stage: InsertJourneyStage): Promise<JourneyStage> {
    const [newStage] = await db.insert(journeyStages).values(stage).returning();
    return newStage;
  }

  async updateJourneyStage(
    id: string,
    stage: Partial<InsertJourneyStage>,
  ): Promise<JourneyStage | undefined> {
    const [updatedStage] = await db
      .update(journeyStages)
      .set({ ...stage, updatedAt: new Date() })
      .where(eq(journeyStages.id, id))
      .returning();
    return updatedStage;
  }

  async deleteJourneyStage(id: string): Promise<boolean> {
    const result = await db.delete(journeyStages).where(eq(journeyStages.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Journey Touchpoints
  async getJourneyTouchpoints(stageId: string): Promise<JourneyTouchpoint[]> {
    return await db
      .select()
      .from(journeyTouchpoints)
      .where(eq(journeyTouchpoints.stageId, stageId))
      .orderBy(journeyTouchpoints.order, journeyTouchpoints.createdAt);
  }

  async getJourneyTouchpoint(id: string): Promise<JourneyTouchpoint | undefined> {
    const [touchpoint] = await db
      .select()
      .from(journeyTouchpoints)
      .where(eq(journeyTouchpoints.id, id));
    return touchpoint;
  }

  async createJourneyTouchpoint(
    touchpoint: InsertJourneyTouchpoint,
  ): Promise<JourneyTouchpoint> {
    const [newTouchpoint] = await db
      .insert(journeyTouchpoints)
      .values(touchpoint)
      .returning();
    return newTouchpoint;
  }

  async updateJourneyTouchpoint(
    id: string,
    touchpoint: Partial<InsertJourneyTouchpoint>,
  ): Promise<JourneyTouchpoint | undefined> {
    const [updatedTouchpoint] = await db
      .update(journeyTouchpoints)
      .set({ ...touchpoint, updatedAt: new Date() })
      .where(eq(journeyTouchpoints.id, id))
      .returning();
    return updatedTouchpoint;
  }

  async deleteJourneyTouchpoint(id: string): Promise<boolean> {
    const result = await db
      .delete(journeyTouchpoints)
      .where(eq(journeyTouchpoints.id, id));
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
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(sql`${subscriptionPlans.name} ILIKE ${name}`)
      .limit(1);
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

  // User Add-ons
  async getUserAddons(userId: string): Promise<UserAddon[]> {
    return await db.select().from(userAddons)
      .where(eq(userAddons.userId, userId))
      .orderBy(desc(userAddons.createdAt));
  }

  async getActiveUserAddons(userId: string): Promise<UserAddon[]> {
    const now = new Date();
    return await db.select().from(userAddons)
      .where(and(
        eq(userAddons.userId, userId),
        eq(userAddons.status, 'active'),
        sql`(${userAddons.currentPeriodEnd} IS NULL OR ${userAddons.currentPeriodEnd} > ${now})`
      ))
      .orderBy(desc(userAddons.createdAt));
  }

  async createUserAddon(addon: InsertUserAddon): Promise<UserAddon> {
    const [newAddon] = await db.insert(userAddons).values(addon).returning();
    return newAddon;
  }

  async updateUserAddon(id: string, addon: Partial<InsertUserAddon>): Promise<UserAddon | undefined> {
    const [updatedAddon] = await db.update(userAddons)
      .set({ ...addon, updatedAt: new Date() })
      .where(eq(userAddons.id, id))
      .returning();
    return updatedAddon;
  }

  async deleteUserAddon(id: string): Promise<boolean> {
    const result = await db.delete(userAddons).where(eq(userAddons.id, id));
    return (result.rowCount || 0) > 0;
  }

  async updateUserAddonsByStripeSubscription(stripeSubscriptionId: string, addon: Partial<InsertUserAddon>): Promise<boolean> {
    const result = await db.update(userAddons)
      .set({ ...addon, updatedAt: new Date() })
      .where(eq(userAddons.stripeSubscriptionId, stripeSubscriptionId));
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
    return await db
      .select()
      .from(doubleDiamondProjects)
      .where(eq(doubleDiamondProjects.userId, userId))
      .orderBy(desc(doubleDiamondProjects.createdAt));
  }

  async createDoubleDiamondExport(exportData: InsertDoubleDiamondExport): Promise<DoubleDiamondExport> {
    const [exportRecord] = await db
      .insert(doubleDiamondExports)
      .values({
        ...exportData,
        id: randomUUID(),
        createdAt: new Date(),
      })
      .returning();
    return exportRecord;
  }

  async getDoubleDiamondExportsByMonth(userId: string): Promise<any[]> {
    const firstDay = new Date();
    firstDay.setDate(1);
    firstDay.setHours(0, 0, 0, 0);

    return db
      .select()
      .from(doubleDiamondExports)
      .where(
        and(
          eq(doubleDiamondExports.userId, userId),
          gte(doubleDiamondExports.createdAt, firstDay)
        )
      );
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

  async getBpmnDiagramsByProject(projectId: string): Promise<BpmnDiagram[]> {
    return await db.select().from(bpmnDiagrams)
      .where(eq(bpmnDiagrams.projectId, projectId));
  }

  async getBpmnDiagram(id: string): Promise<BpmnDiagram | undefined> {
    const [diagram] = await db.select().from(bpmnDiagrams)
      .where(eq(bpmnDiagrams.id, id));
    return diagram;
  }

  async createBpmnDiagram(diagram: InsertBpmnDiagram): Promise<BpmnDiagram> {
    const [newDiagram] = await db.insert(bpmnDiagrams)
      .values(diagram)
      .returning();
    return newDiagram;
  }

  async updateBpmnDiagram(id: string, diagram: Partial<InsertBpmnDiagram>): Promise<BpmnDiagram | undefined> {
    const [updated] = await db.update(bpmnDiagrams)
      .set({ ...diagram, updatedAt: new Date() })
      .where(eq(bpmnDiagrams.id, id))
      .returning();
    return updated;
  }

  async deleteBpmnDiagram(id: string): Promise<boolean> {
    const result = await db.delete(bpmnDiagrams)
      .where(eq(bpmnDiagrams.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Industry Sectors & Success Cases
  async listIndustrySectors(): Promise<IndustrySector[]> {
    return await db.select().from(industrySectors).orderBy(industrySectors.name);
  }

  async listSuccessCases(): Promise<SuccessCase[]> {
    return await db.select().from(successCases).orderBy(successCases.company);
  }

  async updateUserLimits(userId: string, limits: {
    customMaxProjects: number | null;
    customMaxDoubleDiamondProjects: number | null;
    customMaxDoubleDiamondExports: number | null;
    customAiChatLimit: number | null;
    customLimitsTrialEndDate?: Date | null;
  }): Promise<void> {
    const updateData: any = {
      customMaxProjects: limits.customMaxProjects,
      customMaxDoubleDiamondProjects: limits.customMaxDoubleDiamondProjects,
      customMaxDoubleDiamondExports: limits.customMaxDoubleDiamondExports,
      customAiChatLimit: limits.customAiChatLimit,
    };

    if (Object.prototype.hasOwnProperty.call(limits, "customLimitsTrialEndDate")) {
      updateData.customLimitsTrialEndDate = limits.customLimitsTrialEndDate;
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, userId));
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
    const defaultHelpArticles = [
      {
        title: 'Como começar a usar o DTTools',
        slug: 'como-comecar',
        category: 'inicio-rapido',
        author: 'DTTools Team',
        content: `# Como começar a usar o DTTools

Bem-vindo ao **DTTools**. A plataforma te ajuda a organizar seu processo de **Design Thinking** (e também projetos no **Double Diamond**) de um jeito prático, com ferramentas, templates e um fluxo guiado.

## 1) Faça login e entenda o que você vai ver

Ao entrar, você normalmente terá acesso a:

- **Dashboard**: um resumo do que está acontecendo.
- **Projetos**: onde você cria e gerencia seus projetos de Design Thinking.
- **Biblioteca**: conteúdos e referências para apoiar as decisões.
- **Central de Ajuda**: artigos para te orientar (esta área).

## 2) Crie seu primeiro projeto

1. Vá em **Projetos**
2. Clique em **Criar novo projeto**
3. Defina:
   - **Nome**: curto e específico
   - **Descrição**: 2–5 linhas (qual o desafio, contexto e objetivo)

## 3) Trabalhe fase a fase (Design Thinking)

O DTTools estrutura o trabalho em fases:

1. **Empatizar**
2. **Definir**
3. **Idear**
4. **Prototipar**
5. **Testar**

Em cada fase, foque em:

- Preencher os campos com **evidências e decisões** (não só texto “bonito”).
- Registrar aprendizados e hipóteses.
- Avançar quando houver material suficiente para sustentar a próxima etapa.

## 4) Use a IA (se estiver habilitada)

Quando disponível, a IA pode ajudar a:

- rascunhar textos
- sugerir alternativas
- sintetizar informações

Boas práticas:

- Dê contexto (público, problema, restrições).
- Revise o resultado: use como **assistente**, não como “verdade final”.

## 5) Onde buscar ajuda (e como encontrar rápido)

- Acesse a **Central de Ajuda** em `/help`.
- Use a busca por palavras-chave (ex.: “persona”, “HMW”, “teste”, “exportar”).
- Navegue pelas categorias:
  - **Início rápido**
  - **Fases**
  - **Colaboração**
  - **Exportação**
  - **Double Diamond**
  - **IA**
  - **Problemas**

## Checklist de configuração (2 minutos)

- Você consegue entrar no **Dashboard**
- Você consegue criar um projeto
- Você consegue abrir `/help` e ver artigos

Se quiser, siga para o próximo artigo: **“Criando seu primeiro projeto”**.` ,
        tags: ['iniciante', 'tutorial', 'primeiros-passos'],
        searchKeywords: ['começar', 'iniciar', 'primeiro projeto', 'dashboard', 'ajuda'],
        order: 1,
        featured: true,
      },
      {
        title: 'Criando seu primeiro projeto',
        slug: 'primeiro-projeto',
        category: 'inicio-rapido',
        author: 'DTTools Team',
        content: `# Criando seu primeiro projeto

Este guia te ajuda a criar um projeto bem configurado para você ganhar velocidade (e evitar retrabalho nas fases).

## 1) Acesse Projetos

No menu principal, clique em **Projetos**.

## 2) Clique em “Criar novo projeto”

Você vai preencher os campos iniciais. Sugestão prática:

- **Nome**: use o formato “Público + objetivo + contexto”
  - Ex.: “Onboarding — novos usuários — reduzir abandono no cadastro”
- **Descrição**: responda em 2–5 linhas
  - Qual é o desafio?
  - Quem é afetado?
  - O que significa “dar certo”?

## 3) Defina o escopo mínimo

Antes de aprofundar, vale alinhar:

- **Público-alvo** (quem)
- **Contexto** (onde/quando)
- **Resultado esperado** (métrica ou evidência)
- **Restrições** (prazo, tecnologia, orçamento)

Isso deixa suas fases muito mais objetivas.

## 4) Trabalhe fase a fase

O DTTools te guia pelas fases. Uma sequência recomendada:

1. **Empatizar**: pesquisa, entrevistas, observações, personas.
2. **Definir**: síntese, POV, HMW, recorte do problema.
3. **Idear**: volume de ideias + priorização.
4. **Prototipar**: protótipos simples e hipóteses.
5. **Testar**: roteiro, público, evidências, ajustes.

## 5) Como saber se você pode avançar

Avance quando você tiver:

- evidências (dados/insights) suficientes
- uma decisão clara do que será testado
- um próximo passo definido

Se você “travou” em alguma fase, procure os artigos específicos em **Fases**.

## Dicas de organização

- Evite textos longos sem estrutura: prefira bullet points e seções.
- Escreva hipóteses como: “Acreditamos que… se… então…”.
- Registre links e referências na Biblioteca.

Próximo passo recomendado: **“Entendendo as 5 fases do Design Thinking”**.` ,
        tags: ['projeto', 'tutorial', 'iniciante'],
        searchKeywords: ['criar projeto', 'novo projeto', 'iniciar projeto', 'projeto'],
        order: 2,
        featured: true,
      },
      {
        title: 'Entendendo as 5 fases do Design Thinking',
        slug: 'cinco-fases',
        category: 'fases',
        author: 'DTTools Team',
        content: `# Entendendo as 5 fases do Design Thinking

O **Design Thinking** é um processo iterativo para entender problemas reais, explorar soluções e validar rapidamente.

No DTTools, você trabalha em 5 fases:

1. **Empatizar**: entender usuários, contexto e necessidades.
2. **Definir**: sintetizar insights e formular o problema.
3. **Idear**: gerar e priorizar ideias.
4. **Prototipar**: tornar ideias tangíveis rapidamente.
5. **Testar**: validar com usuários e iterar.

## Como o DTTools te ajuda

Em cada fase você vai:

- registrar **evidências** (o que você viu/mediu)
- consolidar **insights** (o que isso significa)
- tomar **decisões** (o que vai fazer a seguir)

O objetivo é reduzir decisões baseadas em achismo.

## O que sai de cada fase (entregáveis sugeridos)

### Empatizar

- personas (ou perfis)
- mapa de empatia
- lista de necessidades e dores
- principais evidências (quotes, observações, dados)

### Definir

- insights priorizados
- POV (Point of View)
- perguntas HMW (How Might We)
- recorte do problema (o que entra e o que não entra)

### Idear

- muitas ideias (divergência)
- agrupamentos por tema
- priorização (impacto x esforço, etc.)
- shortlist (1–3 ideias para prototipar)

### Prototipar

- protótipo(s) de baixa/média fidelidade
- hipóteses (o que você quer aprender)
- critérios de sucesso

### Testar

- plano de teste (público, roteiro, tarefas)
- evidências (o que aconteceu)
- aprendizado (o que muda)
- próximos passos (iterar, pivotar, escalar)

## Erros comuns (e como evitar)

- **Pular a pesquisa**: sem Empatizar, o problema costuma estar errado.
- **Definir “solução” como problema**: o POV deve focar no usuário e necessidade.
- **Idear com pouca divergência**: gerar 10 ideias quase iguais não é divergência.
- **Prototipar “produto final”**: protótipo é para aprender, não para entregar.
- **Testar opinião em vez de comportamento**: prefira tarefas e observação.

## Dica importante: o processo é iterativo

Você pode (e deve) voltar fases quando necessário. O DTTools facilita esse ciclo registrando o histórico e os aprendizados.

Se quiser aprofundar, leia os guias por fase:

- **Fase 1 — Empatizar**
- **Fase 2 — Definir**
- **Fase 3 — Idear**
- **Fase 4 — Prototipar**
- **Fase 5 — Testar**` ,
        tags: ['fases', 'metodologia', 'design thinking'],
        searchKeywords: ['fases', 'empatizar', 'definir', 'idear', 'prototipar', 'testar', 'metodologia'],
        order: 3,
        featured: true,
      },
      {
        title: 'Fase 1 — Empatizar: como conduzir no DTTools',
        slug: 'fase-1-empatizar',
        category: 'fases',
        subcategory: 'Empatizar',
        phase: 1,
        author: 'DTTools Team',
        content: `# Fase 1 — Empatizar

Objetivo: **entender profundamente** quem é o usuário, em que contexto ele está e quais necessidades reais existem antes de pensar em solução.

## O que fazer nesta fase

Você está tentando responder perguntas como:

- Quem é a pessoa (ou grupo) que vive o problema?
- Quais tarefas ela tenta concluir?
- O que ela sente, pensa e faz?
- Onde estão as fricções, dores e oportunidades?

## Como conduzir no DTTools

Sugestão de fluxo prático:

1. **Defina o objetivo da pesquisa**
2. **Colete evidências** (entrevistas, observação, dados existentes)
3. **Organize padrões** (temas, comportamentos, necessidades)
4. **Crie personas** (ou perfis) e registre insights

## Métodos recomendados

Você pode usar (não precisa usar todos):

- **Entrevistas** (sem vender ideia; foque em histórias reais)
- **Observação** (como a pessoa realmente faz)
- **Diário de uso** (quando o problema se estende por dias)
- **Pesquisa rápida** (para validar volume/tendências)

## Como escrever boas evidências

- Prefira:
  - quotes (“Eu desisti porque…”)
  - fatos (“levou 7 minutos para…”) 
  - comportamento (“clicou 3 vezes e voltou…”) 
- Evite:
  - interpretações sem evidência (“o usuário é preguiçoso”)

## Checklist antes de avançar

- Você tem evidências suficientes (não só opinião)?
- Existem 3–7 padrões claros (temas)?
- Você consegue descrever necessidades e dores com clareza?

## Próximo passo

Quando tiver padrões claros, avance para a **Fase 2 — Definir** para transformar dados em um problema bem formulado.` ,
        tags: ['fases', 'empatizar', 'pesquisa', 'personas'],
        searchKeywords: ['fase 1', 'empatizar', 'pesquisa', 'entrevistas', 'persona', 'insights'],
        order: 9,
        featured: false,
      },
      {
        title: 'Fase 2 — Definir: problema, POV e foco',
        slug: 'fase-2-definir',
        category: 'fases',
        subcategory: 'Definir',
        phase: 2,
        author: 'DTTools Team',
        content: `# Fase 2 — Definir

Objetivo: transformar os dados da pesquisa em um **problema bem definido** e um foco claro para a ideação.

## O que você precisa sair desta fase

- um recorte de problema que faça sentido
- uma descrição centrada no usuário (não na solução)
- oportunidades de exploração (perguntas HMW)

## Como fazer no DTTools

1. **Sistematize os insights**
   - selecione os achados mais relevantes
   - agrupe por tema
2. **Formule um POV (Point of View)**
3. **Gere HMW (How Might We)**

## Template de POV (recomendado)

Um bom POV costuma seguir esta lógica:

> Um(a) [usuário/persona] precisa de [necessidade] porque [insight]

Exemplo:

> Um novo usuário precisa entender rapidamente o valor do produto porque se sente inseguro(a) e abandona o cadastro quando não vê benefício imediato.

## Como escrever bons HMW

Boas práticas:

- HMW deve abrir possibilidades, não fechar em uma solução.
- Evite “Como podemos criar um app…”. Prefira “Como podemos ajudar…”.

Exemplos:

- “Como podemos reduzir a insegurança no primeiro acesso?”
- “Como podemos tornar o próximo passo óbvio?”

## Checklist antes de avançar

- Seu problema não contém solução embutida?
- Está claro quem é o usuário e qual necessidade?
- Você consegue explicar o foco em 1–2 frases?
- Você tem pelo menos 5 HMWs bons para explorar?

## Próximo passo

Com o foco definido, avance para a **Fase 3 — Idear** para gerar e priorizar ideias.` ,
        tags: ['fases', 'definir', 'pov', 'hmw'],
        searchKeywords: ['fase 2', 'definir', 'pov', 'how might we', 'hmw', 'problema'],
        order: 10,
        featured: false,
      },
      {
        title: 'Fase 3 — Idear: geração e priorização de ideias',
        slug: 'fase-3-idear',
        category: 'fases',
        subcategory: 'Idear',
        phase: 3,
        author: 'DTTools Team',
        content: `# Fase 3 — Idear

Objetivo: gerar **muitas ideias** (divergir) e então selecionar as melhores (convergir) com critérios claros.

## Antes de idear

Você deve ter:

- um POV bem escrito
- perguntas HMW acionáveis

Se não tiver, volte para a fase **Definir**.

## Como idear no DTTools

Sugestão de fluxo:

1. **Divergir**: gere o máximo de ideias sem julgar
2. **Agrupar**: organize por tema/abordagem
3. **Avaliar**: aplique critérios
4. **Selecionar**: escolha 1–3 ideias para prototipar

## Técnicas úteis

- Brainwriting (cada pessoa escreve em silêncio antes de discutir)
- Crazy 8’s (8 ideias em 8 minutos)
- SCAMPER (substituir, combinar, adaptar, modificar…)
- Analogias (como outras indústrias resolvem isso?)

## Critérios de priorização

Você pode usar:

- **Impacto x esforço**
- **Valor para o usuário x viabilidade**
- **Risco x aprendizado** (ótimo para protótipo)

## Checklist antes de avançar

- Existe diversidade de ideias (não só variações do mesmo)?
- Você tem critérios explícitos de escolha?
- Você escolheu ideias que permitem aprendizado rápido?

## Próximo passo

Escolha 1–3 ideias e avance para a **Fase 4 — Prototipar**.` ,
        tags: ['fases', 'idear', 'brainstorm', 'priorização'],
        searchKeywords: ['fase 3', 'idear', 'ideias', 'brainstorm', 'priorizar', 'priorização'],
        order: 11,
        featured: false,
      },
      {
        title: 'Fase 4 — Prototipar: tornando ideias tangíveis',
        slug: 'fase-4-prototipar',
        category: 'fases',
        subcategory: 'Prototipar',
        phase: 4,
        author: 'DTTools Team',
        content: `# Fase 4 — Prototipar

Objetivo: criar uma versão simples da solução para **aprender rápido** e reduzir incertezas.

## O que é (e o que não é)

- Protótipo é **ferramenta de aprendizado**.
- Não precisa estar “bonito”. Precisa ser **testável**.

## Como prototipar no DTTools

1. **Escolha a ideia** (ou combinação de ideias) priorizada na fase anterior
2. **Defina hipóteses**
3. **Defina o que será prototipado** (o mínimo necessário)
4. **Produza o protótipo** (baixa ou média fidelidade)

## Tipos de protótipo

- **Papel** (rápido e barato)
- **Wireframe** (fluxos e estrutura)
- **Clique** (Figma/Protótipo navegável)
- **Fake door** (botão/fluxo para medir interesse)
- **Wizard of Oz** (simulação manual por trás)

## Template de hipótese

> Acreditamos que [mudança] para [público] vai resultar em [efeito] porque [motivação].

Exemplo:

> Acreditamos que um onboarding com exemplo pronto para novos usuários vai reduzir abandono porque elimina o “medo da tela em branco”.

## Checklist antes de avançar

- Seu protótipo responde a uma hipótese clara?
- Está claro o que você quer aprender?
- Você consegue testar isso em até 30–60 minutos com um usuário?

## Próximo passo

Prepare um plano de teste e avance para a **Fase 5 — Testar**.` ,
        tags: ['fases', 'prototipar', 'mvp', 'hipóteses'],
        searchKeywords: ['fase 4', 'prototipar', 'protótipo', 'mvp', 'hipótese', 'fidelidade'],
        order: 12,
        featured: false,
      },
      {
        title: 'Fase 5 — Testar: validar e iterar',
        slug: 'fase-5-testar',
        category: 'fases',
        subcategory: 'Testar',
        phase: 5,
        author: 'DTTools Team',
        content: `# Fase 5 — Testar

Objetivo: validar com usuários, aprender e **iterar**. O teste não é “aprovação”; é um instrumento para reduzir risco.

## O que testar

- Compreensão (a pessoa entende?)
- Fluxo (a pessoa consegue concluir?)
- Confiança (a pessoa se sente segura?)
- Resultado (o comportamento muda?)

## Como testar no DTTools

1. **Defina objetivo do teste**
2. **Escolha público** (perfil mais próximo da persona)
3. **Crie roteiro**
4. **Execute e registre evidências**
5. **Sistematize achados**
6. **Decida próximos passos** (iterar, pivotar, escalar)

## Roteiro mínimo (sugestão)

- Contexto (2 min): “quero entender como você faria…”
- Tarefas (15–30 min): cenários reais
- Perguntas finais (5 min): “o que foi mais difícil?”, “o que você esperava?”

## O que registrar (evidências)

- O que a pessoa fez (passo a passo)
- Onde hesitou
- Onde errou
- O que falou (quotes)

## Checklist antes de encerrar

- Você identificou 3–5 problemas prioritários?
- Você sabe o que muda na próxima iteração?
- Você sabe o que permanece igual?

## Próximo passo

Consolide aprendizados e planeje a próxima iteração do produto. Se necessário, volte para **Definir** ou **Idear**.` ,
        tags: ['fases', 'testar', 'validação', 'feedback'],
        searchKeywords: ['fase 5', 'testar', 'teste', 'validação', 'feedback', 'iterar'],
        order: 13,
        featured: false,
      },
      {
        title: 'Biblioteca: como usar conteúdos e recursos',
        slug: 'biblioteca-como-usar',
        category: 'inicio-rapido',
        author: 'DTTools Team',
        content: `# Biblioteca: como usar conteúdos e recursos

A **Biblioteca** reúne conteúdos e recursos para apoiar suas fases e decisões. Pense nela como um “repositório de referência” para o time.

## O que você encontra na Biblioteca

- artigos e guias
- templates e exemplos
- referências por tema

## Como usar bem

1. **Busque por palavra-chave**
   - use termos do seu problema (ex.: “onboarding”, “retenção”, “entrevista”)
2. **Filtre por tema**
3. **Salve/guarde referências** (quando disponível)
4. **Conecte com sua fase atual**

## Biblioteca x Central de Ajuda

- **Central de Ajuda**: foco em “como usar o DTTools” e orientação de processo.
- **Biblioteca**: conteúdos mais amplos e referências.

Se você quer saber “onde clicar” e “como preencher”, comece na Central de Ajuda.

## Dica prática

Ao avançar fase a fase, mantenha 1–3 referências essenciais por fase. Isso evita dispersão e mantém o time alinhado.

Observação: alguns conteúdos podem depender do seu plano/add-on.` ,
        tags: ['biblioteca', 'conteúdos', 'recursos'],
        searchKeywords: ['biblioteca', 'conteudo', 'conteúdo', 'artigos', 'recursos', 'referências'],
        order: 14,
        featured: false,
      },
      {
        title: 'Colaboração: trabalhando em equipe',
        slug: 'trabalho-equipe',
        category: 'colaboracao',
        author: 'DTTools Team',
        content: `# Colaboração: trabalhando em equipe

Quando habilitada no seu plano/add-on, a colaboração permite que várias pessoas trabalhem no mesmo projeto com visibilidade e consistência.

## Casos de uso comuns

- workshop com stakeholders
- time multidisciplinar (produto, design, pesquisa, engenharia)
- revisão e feedback assíncrono

## Boas práticas

- Defina um “owner” do projeto (responsável por decisões e alinhamento).
- Combine padrões de escrita (ex.: usar bullet points e evidências).
- Registre decisões importantes (o que foi escolhido e por quê).

## Permissões (conceito)

Dependendo da configuração do seu ambiente, você pode ter perfis como:

- **Owner/Admin**: gerencia acesso e configurações
- **Editor**: edita conteúdo do projeto
- **Viewer**: apenas visualiza

## Se estiver bloqueado

Se você não conseguir convidar/colaborar, isso pode indicar:

- limites do seu **plano**
- necessidade de **add-on**

Se precisar, verifique também a sessão de **Planos/Assinatura** no seu ambiente.` ,
        tags: ['equipe', 'colaboração', 'compartilhamento'],
        searchKeywords: ['equipe', 'time', 'colaborar', 'compartilhar', 'permissão', 'workspace'],
        order: 4,
        featured: false,
      },
      {
        title: 'Exportação: como baixar seu projeto',
        slug: 'exportar-dados',
        category: 'exportacao',
        author: 'DTTools Team',
        content: `# Exportação: como baixar seu projeto

Você pode exportar seu projeto para compartilhar com stakeholders, apresentar resultados e manter documentação.

## Quando exportar

- para alinhar decisões com liderança
- para registrar aprendizados e evidências
- para apresentar resultados do ciclo

## Formatos comuns

- **PDF** (relatório)
- **PPTX** (apresentação)
- **Markdown/CSV/PNG** (quando habilitado)

## Dicas para uma exportação melhor

- Use títulos claros e objetivos.
- Mantenha evidências (quotes/dados) próximas das decisões.
- Evite blocos enormes de texto: prefira estrutura.

## Se uma exportação estiver bloqueada

Alguns formatos podem depender do seu **plano** ou de **add-ons** (ex.: exportações avançadas).

Se estiver com erro:

- tente novamente após recarregar
- verifique se o projeto tem conteúdo mínimo
- confirme se sua assinatura/plano está ativo` ,
        tags: ['exportar', 'pdf', 'download'],
        searchKeywords: ['exportar', 'download', 'pdf', 'pptx', 'markdown', 'csv', 'png'],
        order: 5,
        featured: true,
      },
      {
        title: 'Double Diamond: como funciona no DTTools',
        slug: 'double-diamond-como-funciona',
        category: 'double-diamond',
        author: 'DTTools Team',
        content: `# Double Diamond: como funciona no DTTools

O **Double Diamond** é um framework que combina divergência e convergência em dois “diamantes”: um para o problema e outro para a solução.

No DTTools, você trabalha em 4 etapas:

1. **Descobrir** (divergir): explorar o problema e levantar evidências
2. **Definir** (convergir): recortar e priorizar o foco
3. **Desenvolver** (divergir): explorar soluções
4. **Entregar** (convergir): consolidar proposta e próximos passos

## Quando usar Double Diamond

- quando o problema ainda é amplo e precisa de descoberta
- quando você quer estruturar uma entrega com clareza de decisão

## Como usar no DTTools

1. Acesse **Double Diamond** e crie um projeto.
2. Preencha o contexto do desafio:
   - problema
   - público
   - setor/vertical
3. Avance etapa por etapa, registrando evidências, decisões e outputs.

## Dicas

- Use “Descobrir” para abrir possibilidades e evitar soluções prematuras.
- Use “Definir” para escolher um foco que você consegue atacar.
- Em “Desenvolver”, gere alternativas antes de escolher.
- Em “Entregar”, consolide uma proposta e próximos passos com clareza.

Observação: recursos avançados podem depender de plano/add-on.`,
        tags: ['double diamond', 'framework', 'metodologia'],
        searchKeywords: ['double diamond', 'descobrir', 'definir', 'desenvolver', 'entregar', 'framework'],
        order: 6,
        featured: true,
      },
      {
        title: 'Recursos de IA (Google Gemini): quando e como usar',
        slug: 'ia-gemini-como-usar',
        category: 'ia',
        author: 'DTTools Team',
        content: `# Recursos de IA (Google Gemini): quando e como usar

O DTTools pode oferecer recursos assistidos por **Google Gemini** em partes do fluxo (dependendo do plano/limites).

## Quando usar IA

- para rascunhar textos (personas, insights, hipóteses)
- para gerar alternativas (ideias, perguntas HMW)
- para sintetizar informações (resumos e padrões)

## Quando NÃO usar IA (ou usar com cuidado)

- quando você não tem dados reais (a IA tende a “inventar”)
- quando precisa de decisão final sem validação

## Como pedir (prompt) de forma eficaz

Inclua:

- contexto do problema
- público-alvo
- restrições
- formato de saída (lista, tabela, tópicos)

Exemplo de pedido:

“Com base neste contexto [cole], gere 10 perguntas HMW curtas e acionáveis. Evite sugerir soluções específicas.”

## Boas práticas

- Revise e adapte: IA acelera, você valida.
- Use como copiloto, não como autor final.
- Prefira evidências do seu projeto (pesquisa) em vez de generalidades.

## Se não funcionar

- Verifique limites do plano/add-ons.
- Em ambiente local, confirme GEMINI_API_KEY configurada.
- Em produção (Render), confira se GEMINI_API_KEY está nas variáveis de ambiente.`,
        tags: ['ia', 'gemini', 'automação'],
        searchKeywords: ['ia', 'gemini', 'google', 'api key', 'gemi', 'automação'],
        order: 7,
        featured: false,
      },
      {
        title: 'Solução de problemas (Troubleshooting)',
        slug: 'troubleshooting',
        category: 'problemas',
        author: 'DTTools Team',
        content: `# Solução de problemas (Troubleshooting)

Aqui estão os problemas mais comuns e como resolver.

## 1) Não consigo logar

- Confirme email e senha.
- Verifique se o navegador não está bloqueando **cookies**.
- Tente em uma janela anônima.
- Se você usa SSO/Google, tente sair e entrar novamente.

## 2) Página não carrega / dá erro 500

- Recarregue a página.
- Se estiver em produção, pode ser deploy em andamento.
- Se persistir, verifique logs no Render.

## 3) IA não funciona

- Em desenvolvimento, confira GEMINI_API_KEY.
- Em produção (Render), confirme que GEMINI_API_KEY está configurada.
- Verifique se você não atingiu limites do plano/add-ons.

## 4) Exportação falha

- Confirme que o projeto tem conteúdo mínimo.
- Tente novamente após recarregar.
- Se o formato estiver bloqueado, pode ser plano/add-on.

## 5) Pagamento/assinatura não aparece

- Em ambientes com pagamento, isso depende de:
  - STRIPE_SECRET_KEY
  - webhooks configurados corretamente
- Se você acabou de pagar, aguarde alguns segundos e recarregue.

## Se precisar de suporte

Tenha em mãos:

- seu email
- o que você estava tentando fazer
- print do erro (se houver)
- horário aproximado (para localizar logs)`,
        tags: ['problemas', 'suporte', 'erro'],
        searchKeywords: ['erro', 'problema', 'login', 'ia', 'gemini', 'stripe', 'assinatura'],
        order: 8,
        featured: false,
      }
    ];

    const existingBySlug = new Map(
      (existingHelpArticles || [])
        .map((a: any) => [String(a?.slug || '').trim(), a] as const)
        .filter(([slug]) => Boolean(slug)),
    );

    let insertedCount = 0;
    let updatedCount = 0;
    for (const helpArticle of defaultHelpArticles) {
      const existing = existingBySlug.get(helpArticle.slug);
      if (!existing) {
        await storage.createHelpArticle(helpArticle as any);
        insertedCount++;
        continue;
      }

      const existingContent = String(existing?.content || '');
      const shouldUpdateContent = existingContent.length < 600;

      if (shouldUpdateContent) {
        await storage.updateHelpArticle(String(existing.id), {
          title: helpArticle.title,
          slug: helpArticle.slug,
          category: helpArticle.category,
          subcategory: (helpArticle as any).subcategory ?? null,
          phase: (helpArticle as any).phase ?? null,
          content: helpArticle.content,
          tags: helpArticle.tags,
          searchKeywords: helpArticle.searchKeywords,
          featured: helpArticle.featured,
          author: helpArticle.author,
          order: helpArticle.order,
        } as any);
        updatedCount++;
      }
    }

    if (insertedCount > 0 || updatedCount > 0) {
      console.log(`✅ Default help articles applied: inserted=${insertedCount}, updated=${updatedCount}`);
    }
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
}
