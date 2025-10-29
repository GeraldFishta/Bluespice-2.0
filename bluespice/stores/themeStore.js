// stores/themeStore.js
import { create } from "zustand"

const getInitialMode = () => {
  if (typeof window === "undefined") return "light"
  const stored = localStorage.getItem("bs_theme_mode")
  if (stored === "light" || stored === "dark") return stored
  try {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  } catch {
    return "light"
  }
}

export const useThemeStore = create((set, get) => ({
  mode: getInitialMode(),
  toggleMode: () => {
    const next = get().mode === "dark" ? "light" : "dark"
    try { localStorage.setItem("bs_theme_mode", next) } catch {}
    set({ mode: next })
  },
  setMode: mode => {
    const next = mode === "dark" ? "dark" : "light"
    try { localStorage.setItem("bs_theme_mode", next) } catch {}
    set({ mode: next })
  },
}))


