import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import ConnectPgSimple from "connect-pg-simple";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { initializeDefaultData } from "./storage";
import passport from "./passport-config";
import { setupPassport } from "./passport-config";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Simple log function
const log = (...args: any[]) => {
  console.log(`[${new Date().toISOString()}]`, ...args);
};

// Build version v8.0.0-AUTO-SYNC - Production asset sync implemented
const BUILD_VERSION = "v8.0.0-AUTO-SYNC";

// Extend session data type
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    user?: {
      id: string;
      username: string;
      role: string;
      createdAt: Date;
    };
  }
}

// Create session store - use PostgreSQL in production, memory in development
const MemStore = MemoryStore(session);
const PgStore = ConnectPgSimple(session);

const app = express();

// Trust proxy for secure cookies behind load balancer
app.set('trust proxy', 1);

// Parse and validate FRONTEND_URL from environment
const parseFrontendUrls = (envVar: string | undefined): string[] => {
  if (!envVar) return [];
  
  return envVar.split(',').map(url => url.trim()).filter(url => {
    // Validate: must be HTTPS (or HTTP for localhost), no wildcards
    const isHttps = url.startsWith('https://');
    const isLocalhost = url.startsWith('http://localhost');
    const hasWildcard = url.includes('*');
    
    if (hasWildcard) {
      console.error(`[CORS] Invalid FRONTEND_URL - wildcards not allowed: ${url}`);
      return false;
    }
    
    if (!isHttps && !isLocalhost) {
      console.error(`[CORS] Invalid FRONTEND_URL - must use HTTPS: ${url}`);
      return false;
    }
    
    // Normalize: remove trailing slash
    return true;
  }).map(url => url.replace(/\/$/, '')); // Remove trailing slashes
};

const configuredFrontendUrls = parseFrontendUrls(process.env.FRONTEND_URL);
if (configuredFrontendUrls.length > 0) {
  console.log(`[CORS] Configured frontend URLs: ${configuredFrontendUrls.join(', ')}`);
}

// Add CORS headers for external browser access
app.use((req, res, next) => {
  const origin = req.headers.origin?.replace(/\/$/, ''); // Normalize incoming origin
  
  // Base allowed origins
  const allowedOrigins = [
    'https://designthinkingtools.com',
    'https://www.designthinkingtools.com',
    'https://dttools.app',
    'https://www.dttools.app',
    'http://localhost:5000',
    'http://localhost:5173',
    ...configuredFrontendUrls
  ];
  
  // Allow origin if it's in the allowlist
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Response compression for better performance
app.use(compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Compression level (1-9, 6 is good balance)
}));

// Rate limiting for API protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  message: 'Muitas requisições. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per window
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Increase limits for image uploads (base64 encoded images can be large)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Validate required environment variables
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required');
}

// Session configuration
const isProduction = process.env.NODE_ENV === 'production';
const sessionStore = isProduction && process.env.DATABASE_URL ? 
  new PgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    tableName: 'user_sessions'
  }) : 
  new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });

app.use(session({
  name: 'dttools.session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: 'auto', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? 'lax' : 'none' // Lax for production, none for development
  }
}));

// Initialize Passport (must be after session)
setupPassport();
app.use(passport.initialize());
app.use(passport.session());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static('public/uploads'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Auto-detect production: check if running from dist/ OR if NODE_ENV is production
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Consider it production if:
  // 1. Running from dist/index.js (compiled build)
  // 2. OR NODE_ENV is explicitly set to production
  const isProductionBuild = __filename.includes('/dist/index.js') || process.env.NODE_ENV === 'production';

  // CRITICAL: Verify schema BEFORE anything else if database exists
  if (process.env.DATABASE_URL) {
    log('🔧 [STARTUP] Ensuring database schema is correct...');
    
    try {
      const { db } = await import('./db.js');
      log('🔍 [STARTUP] Verifying critical schema columns...');
      
      // Add missing columns if they don't exist (idempotent, safe to run multiple times)
      await db.execute(`
        ALTER TABLE IF EXISTS subscription_plans 
        ADD COLUMN IF NOT EXISTS included_users INTEGER;
      `);
      
      await db.execute(`
        ALTER TABLE IF EXISTS subscription_plans 
        ADD COLUMN IF NOT EXISTS price_per_additional_user INTEGER;
      `);
      
      // Add OAuth fields to users table
      await db.execute(`
        ALTER TABLE IF EXISTS users 
        ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'local';
      `);
      
      await db.execute(`
        ALTER TABLE IF EXISTS users 
        ADD COLUMN IF NOT EXISTS google_id TEXT;
      `);
      
      // Make password optional for OAuth users
      await db.execute(`
        ALTER TABLE IF EXISTS users 
        ALTER COLUMN password DROP NOT NULL;
      `);
      
      // Add translation columns to video_tutorials (for auto-translation feature)
      await db.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS title_en TEXT;
      `);
      
      await db.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS title_es TEXT;
      `);
      
      await db.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS title_fr TEXT;
      `);
      
      await db.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS description_en TEXT;
      `);
      
      await db.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS description_es TEXT;
      `);
      
      await db.execute(`
        ALTER TABLE IF EXISTS video_tutorials 
        ADD COLUMN IF NOT EXISTS description_fr TEXT;
      `);
      
      log('✅ [STARTUP] Schema columns verified and ready');
    } catch (schemaError) {
      // Log but don't crash - table might not exist yet
      log('⚠️  [STARTUP] Schema verification skipped (table may not exist yet):', String(schemaError).substring(0, 100));
    }
  }

  const server = await registerRoutes(app);

  // Initialize database and default data in background (after server starts)
  // Run schema verification if we have a database connection
  if (process.env.DATABASE_URL) {
    // Run database setup asynchronously without blocking server startup
    (async () => {
      let migrationCompleted = false;
      
      // ONLY run db:push in development, NOT in production (Render)
      // In production, schema should already be applied
      const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
      
      if (!isProduction) {
        try {
          log('🔧 Running database migration in background...');
          
          // Run migration with proper timeout handling
          const migrationPromise = new Promise<void>((resolve, reject) => {
            const { spawn } = require('child_process');
            const migration = spawn('npm', ['run', 'db:push'], {
              stdio: 'inherit' // Inherit to avoid buffer issues
            });
            
            // Set up timeout killer
            const timeoutId = setTimeout(() => {
              migration.kill('SIGTERM');
              reject(new Error('Migration timeout after 90s'));
            }, 90000);
            
            migration.on('close', (code: number) => {
              clearTimeout(timeoutId);
              if (code === 0) {
                log('✅ Database migration completed');
                resolve();
              } else {
                reject(new Error(`Migration exited with code ${code}`));
              }
            });
            
            migration.on('error', (error: Error) => {
              clearTimeout(timeoutId);
              reject(error);
            });
          });
          
          await migrationPromise;
          migrationCompleted = true;
        } catch (error) {
          log('⚠️  Database migration error (may already be applied):', String(error).substring(0, 100));
        }
      } else {
        log('⏭️  Skipping db:push in production (schema should already be applied)');
      }
      
      // ALWAYS initialize default data, regardless of migration result or environment
      try {
        await initializeDefaultData();
        log('✅ Default data initialized');
      } catch (error) {
        log('⚠️  Default data initialization error:', String(error).substring(0, 100));
      }
    })();
  } else {
    // In development without database, run normally
    try {
      await initializeDefaultData();
    } catch (error) {
      log('⚠️  Development initialization error:', String(error).substring(0, 100));
    }
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  const isDevelopment = process.env.NODE_ENV !== 'production' && !isProductionBuild;
  log(`Environment check: NODE_ENV=${process.env.NODE_ENV}, isDevelopment=${isDevelopment}, isProductionBuild=${isProductionBuild}`);
  
  if (isDevelopment) {
    log('Setting up Vite development server');
    const { setupVite } = await import('./vite.js');
    await setupVite(app, server);
  } else {
    // In production, serve from Vite's actual build output
    log('Setting up static file serving for production');
    const distPath = path.resolve(__dirname, 'public');
    log(`Serving static files from: ${distPath}`);
    
    if (!fsSync.existsSync(distPath)) {
      throw new Error(`Could not find the build directory: ${distPath}`);
    }
    
    // Serve static files with explicit configuration
    app.use(express.static(distPath, {
      etag: true,
      lastModified: true,
      setHeaders: (res, filepath) => {
        // CRITICAL: Prevent index.html from being cached (fixes stale deployment issue)
        if (filepath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
        // Set correct MIME types for JavaScript modules
        else if (filepath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if (filepath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        }
      }
    }));
    
    // SPA fallback - only for non-file requests
    app.use("*", (req, res) => {
      // Only serve index.html if the request doesn't have a file extension
      // This prevents intercepting asset requests
      if (req.originalUrl.includes('.')) {
        res.status(404).send('File not found');
      } else {
        // CRITICAL: Prevent index.html from being cached (fixes stale deployment issue)
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.sendFile(path.resolve(distPath, "index.html"));
      }
    });
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
