import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db";
import { users, subscriptionPlans } from "../shared/schema";
import { eq } from "drizzle-orm";

export function setupPassport() {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const googleId = profile.id;
          const displayName = profile.displayName || email?.split('@')[0] || 'User';
          const profilePicture = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error("No email found in Google profile"), undefined);
          }

          // Check if user already exists with this Google ID
          let [user] = await db
            .select()
            .from(users)
            .where(eq(users.googleId, googleId))
            .limit(1);

          if (user) {
            // User exists with Google ID, log them in
            return done(null, user);
          }

          // Check if user exists with this email (from email/password signup)
          [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (user) {
            // User exists with same email - link Google account
            const [updatedUser] = await db
              .update(users)
              .set({
                googleId: googleId,
                provider: "google",
                profilePicture: profilePicture || user.profilePicture,
              })
              .where(eq(users.id, user.id))
              .returning();

            return done(null, updatedUser);
          }

          // Get Free plan to assign to new Google OAuth users (case-insensitive)
          const allPlans = await db.select().from(subscriptionPlans);
          const freePlan = allPlans.find(p => p.name.toLowerCase() === "free");

          if (!freePlan) {
            console.error("❌ [Passport Google] Free plan not found!");
            console.error("Available plans:", allPlans.map(p => p.name).join(", "));
            return done(new Error("System configuration error"), undefined);
          }

          // Create new user with Google account and Free plan
          const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
          
          const [newUser] = await db
            .insert(users)
            .values({
              email,
              username,
              name: displayName,
              provider: "google",
              googleId: googleId,
              profilePicture: profilePicture,
              password: null, // No password for OAuth users
              role: "user",
              subscriptionPlanId: freePlan.id, // Automatically assign Free plan
              subscriptionStatus: "active",
            })
            .returning();

          console.log(`✅ [Passport Google] New user created with Free plan: ${newUser.email}`);
          return done(null, newUser);
        } catch (error) {
          console.error("[Passport Google] Error:", error);
          return done(error as Error, undefined);
        }
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        return done(new Error("User not found"), null);
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

export default passport;
