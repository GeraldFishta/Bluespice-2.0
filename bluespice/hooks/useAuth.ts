"use client";
import { useAuthContext } from "@/contexts/AuthContext";

// Public hook - clean API that wraps the context
export function useAuth() {
    return useAuthContext();
}

export function hasRole(userRole: string | null, allowed?: string[]) {
    if (!allowed || allowed.length === 0) return true
    if (!userRole) return false
    return allowed.includes(userRole)
}


