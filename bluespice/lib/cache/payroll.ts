// lib/cache/payroll.ts
/**
 * Payroll cache management module
 * Handles cache invalidation for payroll-related data
 */

import { mutate as globalMutate } from "swr";
import type { SWRKey } from "./types";
import { isListKey, logCacheOperation } from "./utils";

// Cache key patterns
const PAYROLL_PERIODS_LIST_PREFIX = "payroll-periods";
const PAYROLL_PERIOD_DETAIL_PREFIX = "payroll-period-";

/**
 * Invalidate only payroll periods list caches (not detail endpoints)
 * Use this after create/delete operations or bulk updates
 */
export function invalidatePayrollPeriodLists(): void {
  logCacheOperation("Payroll", "Invalidating payroll period lists only");

  globalMutate((key: SWRKey) => {
    if (isListKey(key, PAYROLL_PERIODS_LIST_PREFIX)) {
      logCacheOperation("Payroll", "Invalidating payroll period list cache", { key });
      return true;
    }
    return false;
  });
}

/**
 * Invalidate a specific payroll period detail cache
 * Use this after updating a single payroll period
 * @param payrollPeriodId - Payroll period ID
 */
export function invalidatePayrollPeriod(payrollPeriodId: string): void {
  logCacheOperation("Payroll", "Invalidating payroll period cache", { payrollPeriodId });

  // Invalidate detail cache
  globalMutate(`${PAYROLL_PERIOD_DETAIL_PREFIX}${payrollPeriodId}`);

  // Also invalidate lists since the period might appear there
  invalidatePayrollPeriodLists();
}

/**
 * Invalidate multiple payroll periods with options
 * @param ids - Array of payroll period IDs
 * @param options - Invalidation options
 */
export function invalidatePayrollPeriods(
  ids: string[] = [],
  options: { alsoList?: boolean } = {}
): void {
  const { alsoList = true } = options;
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));

  if (uniqueIds.length === 0) return;

  logCacheOperation("Payroll", "Invalidating multiple payroll periods", {
    ids: uniqueIds,
    alsoList,
  });

  // Invalidate detail caches
  uniqueIds.forEach((id) => {
    globalMutate(`${PAYROLL_PERIOD_DETAIL_PREFIX}${id}`);
  });

  // Invalidate payroll period lists if requested
  if (alsoList) {
    invalidatePayrollPeriodLists();
  }
}

/**
 * Invalidate all payroll-related caches
 * Useful for bulk operations or when you need to refresh everything
 * @param force - Force invalidation (required for safety)
 */
export function invalidateAllPayroll(force = false): void {
  if (!force) {
    console.warn(
      "[Cache:Payroll] invalidateAllPayroll called without force=true. Use force=true to confirm."
    );
    return;
  }

  logCacheOperation("Payroll", "Force invalidating all payroll caches");

  globalMutate((key: SWRKey) => {
    // Pattern 1: All payroll period list endpoints
    if (isListKey(key, PAYROLL_PERIODS_LIST_PREFIX)) {
      logCacheOperation("Payroll", "Force invalidating payroll period list cache", {
        key,
      });
      return true;
    }

    // Pattern 2: All payroll period detail endpoints
    if (
      typeof key === "string" &&
      key.startsWith(PAYROLL_PERIOD_DETAIL_PREFIX)
    ) {
      logCacheOperation("Payroll", "Force invalidating payroll period detail cache", {
        key,
      });
      return true;
    }

    return false;
  });
}

// Export all methods as a cohesive module
export const payrollCache = {
  invalidatePayrollPeriodLists,
  invalidatePayrollPeriod,
  invalidatePayrollPeriods,
  invalidateAllPayroll,
};
