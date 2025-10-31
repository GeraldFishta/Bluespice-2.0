// lib/cache/utils.ts
/**
 * Utility functions for cache key pattern matching
 */

import type { SWRKey, CacheKeyMatcher } from "./types";

/**
 * Check if a key is an array key
 */
export function isArrayKey(key: SWRKey): key is unknown[] {
  return Array.isArray(key);
}

/**
 * Check if a key is a string key
 */
export function isStringKey(key: SWRKey): key is string {
  return typeof key === "string";
}

/**
 * Check if an array key starts with a specific prefix
 */
export function isListKey(key: SWRKey, prefix: string): boolean {
  if (!isArrayKey(key)) return false;
  return key[0] === prefix;
}

/**
 * Check if a string key matches a pattern (supports wildcards)
 * @param key - The cache key to check
 * @param pattern - Pattern to match (supports * wildcard)
 * @example
 * matchesPattern("employees", "employees*") // true
 * matchesPattern("employee-123", "employee-*") // true
 */
export function matchesPattern(key: SWRKey, pattern: string): boolean {
  if (!isStringKey(key)) return false;
  
  // Convert wildcard pattern to regex
  const regexPattern = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&") // Escape special chars
    .replace(/\*/g, ".*"); // Convert * to .*
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(key);
}

/**
 * Create a matcher function for array keys starting with specific prefix
 */
export function createListMatcher(prefix: string): CacheKeyMatcher {
  return (key: SWRKey) => isListKey(key, prefix);
}

/**
 * Create a matcher function for string keys matching a pattern
 */
export function createPatternMatcher(pattern: string): CacheKeyMatcher {
  return (key: SWRKey) => matchesPattern(key, pattern);
}

/**
 * Log cache operations (dev only)
 */
export function logCacheOperation(
  feature: string,
  operation: string,
  details?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Cache:${feature}] ${operation}`, details || "");
  }
}

