// lib/permissions.ts

/**
 * Permission constants for role-based access control
 * Each permission maps to an array of roles that have access
 */
export const PERMISSIONS = {
    // Employee permissions
    EMPLOYEES_VIEW: ["admin", "hr"],
    EMPLOYEES_CREATE: ["admin", "hr"],
    EMPLOYEES_UPDATE: ["admin", "hr"],
    EMPLOYEES_DELETE: ["admin"],

    // Payroll permissions
    PAYROLL_VIEW: ["admin", "hr", "employee"],
    PAYROLL_CREATE: ["admin", "hr"],
    PAYROLL_UPDATE: ["admin", "hr"],
    PAYROLL_APPROVE: ["admin"],
    PAYROLL_DELETE: ["admin"],

    // Timesheets permissions
    TIMESHEETS_VIEW: ["admin", "hr", "employee"],
    TIMESHEETS_CREATE: ["admin", "hr", "employee"],
    TIMESHEETS_UPDATE: ["admin", "hr", "employee"],
    TIMESHEETS_APPROVE: ["admin", "hr"],
    TIMESHEETS_DELETE: ["admin"],

    // Reports permissions
    REPORTS_VIEW: ["admin", "hr"],
    REPORTS_EXPORT: ["admin", "hr"],

    // Settings permissions
    SETTINGS_VIEW: ["admin", "hr"],
    SETTINGS_UPDATE: ["admin"],
} as const;

/**
 * Check if a user role has permission to access a resource
 * @param userRole - The user's role (admin, hr, employee)
 * @param allowedRoles - Array of roles that have permission
 * @returns true if user has permission, false otherwise
 */
export function hasPermission(
    userRole: string | null,
    allowedRoles: readonly string[]
): boolean {
    if (!userRole || !allowedRoles || allowedRoles.length === 0) {
        return false;
    }
    return allowedRoles.includes(userRole);
}

/**
 * Check if user has any of the specified permissions
 * @param userRole - The user's role
 * @param permissions - Array of permission arrays
 * @returns true if user has at least one permission
 */
export function hasAnyPermission(
    userRole: string | null,
    permissions: readonly (readonly string[])[]
): boolean {
    return permissions.some((permission) =>
        hasPermission(userRole, permission)
    );
}

/**
 * Check if user has all of the specified permissions
 * @param userRole - The user's role
 * @param permissions - Array of permission arrays
 * @returns true if user has all permissions
 */
export function hasAllPermissions(
    userRole: string | null,
    permissions: readonly (readonly string[])[]
): boolean {
    return permissions.every((permission) =>
        hasPermission(userRole, permission)
    );
}
