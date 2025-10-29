// hooks/usePermissions.ts
"use client";
import { useAuth } from "./useAuth";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions";

export function usePermissions(allowedRoles: readonly string[]) {
    const { role } = useAuth();

    return {
        hasAccess: hasPermission(role, allowedRoles),
        role,
    };
}

export function useAnyPermission(
    permissions: readonly (readonly string[])[]
) {
    const { role } = useAuth();

    return {
        hasAccess: hasAnyPermission(role, permissions),
        role,
    };
}

export function useAllPermissions(
    permissions: readonly (readonly string[])[]
) {
    const { role } = useAuth();

    return {
        hasAccess: hasAllPermissions(role, permissions),
        role,
    };
}
