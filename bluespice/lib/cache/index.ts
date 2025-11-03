// lib/cache/index.ts
/**
 * Central export for all cache management utilities
 */

export { employeesCache } from "./employees";
export { payrollCache } from "./payroll";
export { payrollRecordsCache } from "./payrollRecords";
export type { SWRKey, CacheKeyMatcher, InvalidationOptions } from "./types";
export {
  isArrayKey,
  isStringKey,
  isListKey,
  matchesPattern,
  createListMatcher,
  createPatternMatcher,
  logCacheOperation,
} from "./utils";

