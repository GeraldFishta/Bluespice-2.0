"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Session, User } from "@supabase/supabase-js"

// Helper function to extract name from user_metadata
function extractNamesFromMetadata(user: User): { first_name: string; last_name: string } {
    const metadata = user.user_metadata || {}

    // Try full_name first (GitHub format)
    const fullName = metadata.full_name || metadata.name || ""

    if (fullName) {
        const parts = fullName.trim().split(/\s+/)
        if (parts.length >= 2) {
            return {
                first_name: parts[0],
                last_name: parts.slice(1).join(" ")
            }
        }
        // Single name: use as first_name
        return {
            first_name: parts[0] || "User",
            last_name: "User"
        }
    }

    // Fallback: use preferred_username or email prefix
    const username = metadata.preferred_username || user.email?.split("@")[0] || "User"
    return {
        first_name: username,
        last_name: "User"
    }
}

// Helper function to create profile if it doesn't exist
async function ensureProfileExists(user: User): Promise<string | null> {
    try {
        // First, check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle()

        // If profile exists, return its role
        if (existingProfile && !fetchError) {
            return existingProfile.role
        }

        // Profile doesn't exist, create it
        const { first_name, last_name } = extractNamesFromMetadata(user)
        const email = user.email || ""

        const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                email: email,
                first_name: first_name,
                last_name: last_name,
                role: "employee" // Default role
            })
            .select("role")
            .single()

        if (createError) {
            console.warn("Failed to create profile:", createError)
            // Fallback to user_metadata role if available
            return (user.user_metadata?.role as string) || null
        }

        return newProfile?.role || "employee"
    } catch (error) {
        console.warn("Error ensuring profile exists:", error)
        // Fallback to user_metadata role if available
        return (user.user_metadata?.role as string) || null
    }
}

export function useAuth() {
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<Session | null>(null)
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        const init = async () => {
            const { data } = await supabase.auth.getSession()
            if (!mounted) return
            setSession(data.session)

            // Fetch and ensure profile exists
            if (data.session?.user) {
                const userRole = await ensureProfileExists(data.session.user)
                if (mounted) {
                    setRole(userRole)
                }
            } else {
                setRole(null)
            }

            if (mounted) {
                setLoading(false)
            }
        }

        init()

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
            if (!mounted) return
            setSession(s)

            // Update role when session changes
            if (s?.user) {
                const userRole = await ensureProfileExists(s.user)
                if (mounted) {
                    setRole(userRole)
                }
            } else {
                setRole(null)
            }
        })

        return () => {
            mounted = false
            listener.subscription.unsubscribe()
        }
    }, [])

    const user = session?.user || null

    return { loading, session, user, role }
}

export function hasRole(userRole: string | null, allowed?: string[]) {
    if (!allowed || allowed.length === 0) return true
    if (!userRole) return false
    return allowed.includes(userRole)
}


