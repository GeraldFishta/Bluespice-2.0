// stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      role: null,

      // Actions
      setUser: (user) => {
        const role = user?.user_metadata?.role || null;
        set({
          user,
          isAuthenticated: !!user,
          role,
        });
      },

      setRole: (role) => {
        set({ role });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          isAuthenticated: false,
          role: null,
        });
      },

      syncSession: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          get().setUser(session.user);
        } else {
          get().logout();
        }
      },

      // Getters
      getUserRole: () => get().role,
      isAdmin: () => get().role === "admin",
      isHR: () => get().role === "hr",
      isEmployee: () => get().role === "employee",
      hasRole: (allowedRoles) => {
        const role = get().role;
        if (!role || !allowedRoles || allowedRoles.length === 0) return false;
        return allowedRoles.includes(role);
      },
    }),
    {
      name: "bs-auth-storage",
      partialize: () => ({
        // Non persistiamo user data sensibile, solo state booleani se necessario
        // Le preferences potrebbero andare in un settingsStore separato
      }),
    }
  )
);
