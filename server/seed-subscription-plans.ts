/**
 * Seed subscription plans for DTTools Freemium model
 * 
 * Plans:
 * - Basic (R$ 29/month): 1 AI-generated project
 * - Premium (R$ 299/month): Unlimited AI-generated projects
 */

import { db } from "./db";
import { subscriptionPlans } from "../shared/schema";
import { eq } from "drizzle-orm";

async function seedSubscriptionPlans() {
  console.log("🌱 Seeding subscription plans...");

  const plans = [
    {
      id: "plan_basic",
      name: "basic",
      displayName: "Básico",
      description: "Ideal para testar a geração automática de MVPs com IA",
      priceMonthly: 2900, // R$ 29.00 in cents
      priceYearly: 29000, // R$ 290.00 (10 months price - 2 months discount)
      stripePriceIdMonthly: null,
      stripePriceIdYearly: null,
      maxProjects: null, // unlimited manual projects
      maxPersonasPerProject: null, // unlimited personas
      maxUsersPerTeam: 1, // single user
      maxAiProjects: 1, // 1 AI-generated project per month
      includedUsers: 1,
      pricePerAdditionalUser: null,
      aiChatLimit: 50, // 50 AI chat messages
      libraryArticlesCount: 5, // up to 5 library articles (Library Premium add-on unlocks all)
      features: [
        "1 projeto gerado com IA por mês",
        "Projetos manuais ilimitados",
        "50 mensagens de chat IA/mês",
        "Acesso completo à biblioteca",
        "Exportar em PDF",
        "Suporte por email"
      ],
      exportFormats: ["pdf"],
      hasCollaboration: false,
      hasPermissionManagement: false,
      hasSharedWorkspace: false,
      hasCommentsAndFeedback: false,
      hasSso: false,
      hasCustomApi: false,
      hasCustomIntegrations: false,
      has24x7Support: false,
      order: 1,
      isActive: true,
    },
    {
      id: "plan_premium",
      name: "premium",
      displayName: "Premium",
      description: "Para equipes que precisam gerar múltiplos MVPs com IA",
      priceMonthly: 29900, // R$ 299.00 in cents
      priceYearly: 299000, // R$ 2990.00 (10 months price - 2 months discount)
      stripePriceIdMonthly: null,
      stripePriceIdYearly: null,
      maxProjects: null, // unlimited manual projects
      maxPersonasPerProject: null, // unlimited personas
      maxUsersPerTeam: null, // unlimited users
      maxAiProjects: null, // unlimited AI-generated projects
      includedUsers: 5,
      pricePerAdditionalUser: 5900, // R$ 59.00 per additional user
      aiChatLimit: null, // unlimited AI chat
      libraryArticlesCount: 5, // up to 5 library articles by default (Library Premium add-on unlocks all)
      features: [
        "Projetos IA ilimitados",
        "Projetos manuais ilimitados",
        "Chat IA ilimitado",
        "Até 5 usuários inclusos (+ R$ 59/usuário)",
        "Acesso completo à biblioteca",
        "Exportar em PDF, PNG e CSV",
        "Workspace compartilhado",
        "Comentários e feedback",
        "Suporte prioritário 24/7"
      ],
      exportFormats: ["pdf", "png", "csv"],
      hasCollaboration: true,
      hasPermissionManagement: true,
      hasSharedWorkspace: true,
      hasCommentsAndFeedback: true,
      hasSso: false,
      hasCustomApi: false,
      hasCustomIntegrations: false,
      has24x7Support: true,
      order: 2,
      isActive: true,
    },
  ];

  for (const plan of plans) {
    try {
      // Check if plan already exists
      const existing = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.id, plan.id))
        .limit(1);

      if (existing.length > 0) {
        // Update existing plan
        await db
          .update(subscriptionPlans)
          .set(plan)
          .where(eq(subscriptionPlans.id, plan.id));
        console.log(`✅ Updated plan: ${plan.displayName}`);
      } else {
        // Insert new plan
        await db.insert(subscriptionPlans).values(plan);
        console.log(`✅ Created plan: ${plan.displayName}`);
      }
    } catch (error) {
      console.error(`❌ Error seeding plan ${plan.displayName}:`, error);
      throw error;
    }
  }

  console.log("🎉 Subscription plans seeded successfully!");
}

export { seedSubscriptionPlans };

// Run seed if this file is executed directly
seedSubscriptionPlans()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed subscription plans:", error);
    process.exit(1);
  });
