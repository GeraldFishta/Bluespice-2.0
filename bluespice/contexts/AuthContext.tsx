"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

// Helper function to extract name from user_metadata
function extractNamesFromMetadata(user: User): {
  first_name: string;
  last_name: string;
} {
  const metadata = user.user_metadata || {};
  const fullName = metadata.full_name || metadata.name || "";

  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return {
        first_name: parts[0],
        last_name: parts.slice(1).join(" "),
      };
    }
    return {
      first_name: parts[0] || "User",
      last_name: "User",
    };
  }

  const username =
    metadata.preferred_username || user.email?.split("@")[0] || "User";
  return {
    first_name: username,
    last_name: "User",
  };
}

// Helper function to get user role (robust: id → email → create)
async function getUserRole(user: User): Promise<string | null> {
  try {
    console.log("🔍 getUserRole - User ID:", user.id, "Email:", user.email);

    // 1) Try by ID first (normal case)
    const { data: byId, error: idErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (idErr) {
      console.warn("❌ Role by ID error:", idErr);
    }

    if (byId) {
      console.log("✅ Found role by ID:", byId.role);

      // 🔥 CRITICAL: Se trovato per ID ma è "employee", controlla per email se c'è un ruolo migliore
      // Questo gestisce il caso in cui OAuth crea nuovo auth user ma profilo admin esiste già con stessa email
      // Usa funzione RPC che bypassa RLS per trovare profili con stessa email
      if (byId.role === "employee" && user.email) {
        console.log(
          "⚠️ Role by ID is 'employee', checking email for better role (bypassing RLS)..."
        );
        const { data: byEmail, error: emailErr } = await supabase.rpc(
          "get_role_by_email",
          { email_value: user.email }
        );

        if (emailErr) {
          console.error("❌ Role by email RPC error:", emailErr);
        } else if (byEmail && byEmail.length > 0) {
          const profile = byEmail[0];
          if (profile.role !== "employee" && profile.id !== user.id) {
            console.log(
              "✅ Found better role by email:",
              profile.role,
              "(profile ID:",
              profile.id,
              ")"
            );
            console.log(
              "⚠️ ID mismatch detected - trigger should reconcile on next login"
            );
            return profile.role; // Usa il ruolo migliore trovato per email
          } else if (profile.id === user.id) {
            console.log("✅ Email profile matches ID, role:", profile.role);
            return profile.role;
          }
        }
      }

      return byId.role;
    }

    console.log("⚠️ No profile found by ID, trying email fallback...");

    // 2) Fallback by email (reconciliation scenario - handles ID mismatch)
    // Usa funzione RPC che bypassa RLS per trovare profili con stessa email
    if (user.email) {
      console.log("🔍 Fetching profile by email (bypassing RLS):", user.email);
      const { data: byEmail, error: emailErr } = await supabase.rpc(
        "get_role_by_email",
        { email_value: user.email }
      );

      if (emailErr) {
        console.error("❌ Role by email RPC error:", emailErr);
      }

      if (byEmail && byEmail.length > 0) {
        const profile = byEmail[0];
        console.log(
          "✅ Found role by email:",
          profile.role,
          "(profile ID:",
          profile.id,
          ")"
        );
        return profile.role;
      }

      console.log("⚠️ No profile found by email either");
    }

    // 3) Last resort: create new profile if doesn't exist
    console.log("⚠️ Creating new profile with default role 'employee'");
    const { first_name, last_name } = extractNamesFromMetadata(user);
    const { data: created, error: createErr } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email || "",
        first_name,
        last_name,
        role: "employee",
      })
      .select("role")
      .single();

    if (createErr) {
      console.error("❌ Create profile error:", createErr);
      return null;
    }

    console.log("✅ Created new profile with role:", created?.role);
    return created?.role || "employee";
  } catch (error) {
    console.error("❌ Error getting user role:", error);
    return null;
  }
}

interface AuthContextType {
  loading: boolean;
  session: Session | null;
  user: User | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Use refs to track if fetch is in progress and prevent duplicate calls
  const fetchingRoleRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUserRole = async (user: User) => {
      // Prevent duplicate fetches for the same user
      if (fetchingRoleRef.current && currentUserIdRef.current === user.id) {
        return;
      }

      fetchingRoleRef.current = true;
      currentUserIdRef.current = user.id;

      try {
        const userRole = await getUserRole(user);
        if (mounted) {
          setRole(userRole);
        }
      } finally {
        fetchingRoleRef.current = false;
      }
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);

      // Fetch and ensure profile exists ONCE
      if (data.session?.user) {
        await fetchUserRole(data.session.user);
      } else {
        setRole(null);
        currentUserIdRef.current = null;
      }

      if (mounted) {
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        if (!mounted) return;
        setSession(s);

        // Update role when session changes
        if (s?.user) {
          // Reset refs if user changed
          if (currentUserIdRef.current !== s.user.id) {
            fetchingRoleRef.current = false;
            currentUserIdRef.current = null;
          }
          await fetchUserRole(s.user);
        } else {
          setRole(null);
          currentUserIdRef.current = null;
          fetchingRoleRef.current = false;
        }
      }
    );

    return () => {
      mounted = false;
      fetchingRoleRef.current = false;
      currentUserIdRef.current = null;
      listener.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user || null;

  return (
    <AuthContext.Provider value={{ loading, session, user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export a hook to use the context (internal use only)
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
