// lib/cache/payrollRecords.ts
/**
 * Payroll records cache management module
 * Handles cache invalidation for payroll record-related data
 */

import { mutate as globalMutate } from "swr";
import type { SWRKey } from "./types";
import { isListKey, logCacheOperation } from "./utils";

// Cache key patterns
const PAYROLL_RECORDS_LIST_PREFIX = "payroll-records";
const PAYROLL_RECORD_DETAIL_PREFIX = "payroll-record-";

/**
 * Invalidate only payroll records list caches (not detail endpoints)
 * Use this after create/delete operations or bulk updates
 */
export function invalidatePayrollRecordsLists(): void {
  logCacheOperation("Payroll Records", "Invalidating payroll records lists only");

  globalMutate((key: SWRKey) => {
    if (isListKey(key, PAYROLL_RECORDS_LIST_PREFIX)) {
      logCacheOperation("Payroll Records", "Invalidating payroll records list cache", { key });
      return true;
    }
    return false;
  });
}

/**
 * Invalidate payroll records for a specific payroll period
 * Use this when records for a period are modified
 * @param payrollPeriodId - Payroll period ID
 */
export function invalidatePayrollRecordsForPeriod(payrollPeriodId: string): void {
  logCacheOperation("Payroll Records", "Invalidating records for payroll period", { payrollPeriodId });

  // Invalidate all payroll records lists that might contain this period's records
  globalMutate((key: SWRKey) => {
    if (isListKey(key, PAYROLL_RECORDS_LIST_PREFIX)) {
      logCacheOperation("Payroll Records", "Invalidating payroll records list cache", { key });
      return true;
    }
    return false;
  });
}

/**
 * Invalidate a specific payroll record detail cache
 * Use this after updating a single payroll record
 * @param payrollRecordId - Payroll record ID
 */
export function invalidatePayrollRecord(payrollRecordId: string): void {
  logCacheOperation("Payroll Records", "Invalidating payroll record cache", { payrollRecordId });

  // Invalidate detail cache
  globalMutate(`${PAYROLL_RECORD_DETAIL_PREFIX}${payrollRecordId}`);
}

/**
 * Invalidate multiple payroll records with options
 * @param ids - Array of payroll record IDs
 * @param options - Invalidation options
 */
export function invalidatePayrollRecords(
  ids: string[] = [],
  options: { alsoList?: boolean; alsoPeriod?: string } = {}
): void {
  const { alsoList = true, alsoPeriod } = options;
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));

  if (uniqueIds.length === 0) return;

  logCacheOperation("Payroll Records", "Invalidating multiple payroll records", {
    ids: uniqueIds,
    alsoList,
    alsoPeriod,
  });

  // Invalidate detail caches
  uniqueIds.forEach((id) => {
    globalMutate(`${PAYROLL_RECORD_DETAIL_PREFIX}${id}`);
  });

  // Invalidate records for specific period if provided
  if (alsoPeriod) {
    invalidatePayrollRecordsForPeriod(alsoPeriod);
  }

  // Invalidate all lists if requested
  if (alsoList) {
    invalidatePayrollRecordsLists();
  }
}

/**
 * Invalidate all payroll record-related caches
 * Useful for bulk operations or when you need to refresh everything
 * @param force - Force invalidation (required for safety)
 */
export function invalidateAllPayrollRecords(force = false): void {
  if (!force) {
    console.warn(
      "[Cache:Payroll Records] invalidateAllPayrollRecords called without force=true. Use force=true to confirm."
    );
    return;
  }

  logCacheOperation("Payroll Records", "Force invalidating all payroll records caches");

  globalMutate((key: SWRKey) => {
    // Pattern 1: All payroll records list endpoints
    if (isListKey(key, PAYROLL_RECORDS_LIST_PREFIX)) {
      logCacheOperation("Payroll Records", "Force invalidating payroll records list cache", {
        key,
      });
      return true;
    }

    // Pattern 2: All payroll record detail endpoints
    if (
      typeof key === "string" &&
      key.startsWith(PAYROLL_RECORD_DETAIL_PREFIX)
    ) {
      logCacheOperation("Payroll Records", "Force invalidating payroll record detail cache", {
        key,
      });
      return true;
    }

    return false;
  });
}

// Export all methods as a cohesive module
export const payrollRecordsCache = {
  invalidatePayrollRecordsLists,
  invalidatePayrollRecordsForPeriod,
  invalidatePayrollRecord,
  invalidatePayrollRecords,
  invalidateAllPayrollRecords,
};
