"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"

export function useAuth() {
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        let mounted = true
        const init = async () => {
            const { data } = await supabase.auth.getSession()
            if (!mounted) return
            setSession(data.session)
            setLoading(false)
        }
        init()
        const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s)
        })
        return () => {
            mounted = false
            listener.subscription.unsubscribe()
        }
    }, [])

    const user = session?.user || null
    const role = (user?.user_metadata?.role as string) || null

    return { loading, session, user, role }
}

export function hasRole(userRole: string | null, allowed?: string[]) {
    if (!allowed || allowed.length === 0) return true
    if (!userRole) return false
    return allowed.includes(userRole)
}


