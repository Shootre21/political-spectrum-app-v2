import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization - only create PrismaClient when actually used
let _prisma: PrismaClient | null = null

/**
 * Get the Prisma client instance
 * Returns null if DATABASE_URL is not configured
 */
export function getDb(): PrismaClient | null {
  if (_prisma) return _prisma
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    console.log('[Database] DATABASE_URL not configured, database features disabled')
    return null
  }
  
  try {
    _prisma = new PrismaClient({
      log: ['query'],
    })
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _prisma
    }
    
    return _prisma
  } catch (error) {
    console.error('[Database] Failed to initialize Prisma:', error)
    return null
  }
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
