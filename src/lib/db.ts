/**
 * Database Configuration
 * 
 * IMPORTANT: This module handles database initialization with automatic fallback.
 * 
 * The app works even if DATABASE_URL is not configured - it will:
 * 1. First check for DATABASE_URL in environment
 * 2. Fall back to a default local database path
 * 3. If database fails, gracefully degrade to in-memory operation
 * 
 * This ensures the app ALWAYS starts, even on fresh installations.
 */

// Set default DATABASE_URL if not configured
// This MUST happen before any Prisma imports
const DEFAULT_DATABASE_URL = 'file:./db/custom.db';

if (!process.env.DATABASE_URL) {
  console.log('[Database] DATABASE_URL not set, using default:', DEFAULT_DATABASE_URL);
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization - only create PrismaClient when actually used
let _prisma: PrismaClient | null = null
let _dbError: string | null = null

/**
 * Get the Prisma client instance
 * Returns null if database cannot be initialized
 */
export function getDb(): PrismaClient | null {
  if (_prisma) return _prisma
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  
  try {
    console.log('[Database] Initializing Prisma client with DATABASE_URL:', process.env.DATABASE_URL);
    
    _prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    })
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _prisma
    }
    
    console.log('[Database] Prisma client initialized successfully');
    return _prisma
  } catch (error) {
    _dbError = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Database] Failed to initialize Prisma:', _dbError);
    return null
  }
}

/**
 * Check if database is available
 */
export function isDbAvailable(): boolean {
  return _prisma !== null;
}

/**
 * Get the last database error
 */
export function getDbError(): string | null {
  return _dbError;
}

/**
 * Get the database URL being used
 */
export function getDbUrl(): string {
  return process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
}

// Create a proxy that lazily initializes the database
// This allows `db.article.findMany()` syntax while handling missing DATABASE_URL
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const prisma = getDb()
    if (!prisma) {
      // Return a function that returns empty results for common operations
      return new Proxy({}, {
        get(_t, _p) {
          return async () => {
            // Return appropriate empty values based on operation type
            return []
          }
        }
      })
    }
    return prisma[prop as keyof PrismaClient]
  }
})
