// lib/cache/employees.ts
/**
 * Employees cache management module
 * Handles cache invalidation for employee-related data
 */

import { mutate as globalMutate } from "swr";
import type { SWRKey } from "./types";
import { isListKey, logCacheOperation } from "./utils";

// Cache key patterns
const EMPLOYEES_LIST_PREFIX = "employees";
const EMPLOYEE_DETAIL_PREFIX = "employee-";

/**
 * Invalidate only employee list caches (not detail endpoints)
 * Use this after create/delete operations or bulk updates
 */
export function invalidateEmployeeLists(): void {
  logCacheOperation("Employees", "Invalidating employee lists only");

  globalMutate((key: SWRKey) => {
    if (isListKey(key, EMPLOYEES_LIST_PREFIX)) {
      logCacheOperation("Employees", "Invalidating employee list cache", { key });
      return true;
    }
    return false;
  });
}

/**
 * Invalidate a specific employee detail cache
 * Use this after updating a single employee
 * @param employeeId - Employee ID
 */
export function invalidateEmployee(employeeId: string): void {
  logCacheOperation("Employees", "Invalidating employee cache", { employeeId });

  // Invalidate detail cache
  globalMutate(`${EMPLOYEE_DETAIL_PREFIX}${employeeId}`);

  // Also invalidate lists since the employee might appear there
  invalidateEmployeeLists();
}

/**
 * Invalidate multiple employees with options
 * @param ids - Array of employee IDs
 * @param options - Invalidation options
 */
export function invalidateEmployees(
  ids: string[] = [],
  options: { alsoList?: boolean } = {}
): void {
  const { alsoList = true } = options;
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));

  if (uniqueIds.length === 0) return;

  logCacheOperation("Employees", "Invalidating multiple employees", {
    ids: uniqueIds,
    alsoList,
  });

  // Invalidate detail caches
  uniqueIds.forEach((id) => {
    globalMutate(`${EMPLOYEE_DETAIL_PREFIX}${id}`);
  });

  // Invalidate employee lists if requested
  if (alsoList) {
    invalidateEmployeeLists();
  }
}

/**
 * Invalidate all employee-related caches
 * Useful for bulk operations or when you need to refresh everything
 * @param force - Force invalidation (required for safety)
 */
export function invalidateAllEmployees(force = false): void {
  if (!force) {
    console.warn(
      "[Cache:Employees] invalidateAllEmployees called without force=true. Use force=true to confirm."
    );
    return;
  }

  logCacheOperation("Employees", "Force invalidating all employee caches");

  globalMutate((key: SWRKey) => {
    // Pattern 1: All employee list endpoints
    if (isListKey(key, EMPLOYEES_LIST_PREFIX)) {
      logCacheOperation("Employees", "Force invalidating employee list cache", {
        key,
      });
      return true;
    }

    // Pattern 2: All employee detail endpoints
    if (
      typeof key === "string" &&
      key.startsWith(EMPLOYEE_DETAIL_PREFIX)
    ) {
      logCacheOperation("Employees", "Force invalidating employee detail cache", {
        key,
      });
      return true;
    }

    return false;
  });
}

// Export all methods as a cohesive module
export const employeesCache = {
  invalidateEmployeeLists,
  invalidateEmployee,
  invalidateEmployees,
  invalidateAllEmployees,
};

