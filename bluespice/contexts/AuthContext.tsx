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

// Helper function to get user role (simple and clean)
async function getUserRole(user: User): Promise<string | null> {
  try {
    // Single, clean fetch by auth user ID (now that we fixed the ID mismatch)
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.warn("Error fetching user role:", error);
      return null;
    }

    if (profile) {
      return profile.role;
    }

    // If no profile found, create one (fallback for new users)
    const { first_name, last_name } = extractNamesFromMetadata(user);

    const { data: newProfile, error: createError } = await supabase
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

    if (createError) {
      console.warn("Failed to create profile:", createError);
      return null;
    }

    return newProfile?.role || "employee";
  } catch (error) {
    console.warn("Error getting user role:", error);
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
