// lib/cache/types.ts
/**
 * Common types for cache management utilities
 */

// SWR key type - can be string, array, or function
export type SWRKey = string | unknown[] | null;

// Cache key pattern matcher function
export type CacheKeyMatcher = (key: SWRKey) => boolean;

// Cache invalidation options
export interface InvalidationOptions {
  /**
   * Also invalidate related list caches
   * @default true
   */
  alsoList?: boolean;
  
  /**
   * Also invalidate related detail caches
   * @default false
   */
  alsoDetail?: boolean;
  
  /**
   * Revalidate after invalidation
   * @default true
   */
  revalidate?: boolean;
}

