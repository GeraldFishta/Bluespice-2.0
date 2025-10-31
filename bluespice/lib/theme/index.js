"use client"
// lib/theme/index.js
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { lightPalette, darkPalette } from "./palette"
import typography from "./typography"
import components from "./components"
import breakpoints from "./breakpoints"
import shadows from "./shadows"
import { useThemeStore } from "@/stores/themeStore"

export const createAppTheme = mode => {
  const palette = mode === "dark" ? darkPalette : lightPalette
  const baseTheme = createTheme({
    palette,
    typography,
    breakpoints,
    shadows,
    shape: { borderRadius: 8 },
    spacing: 8,
  })
  
  return createTheme(baseTheme, {
    components: components(baseTheme),
  })
}

export const lightTheme = createAppTheme("light")
export const darkTheme = createAppTheme("dark")

export const ThemeProviderWrapper = ({ children, mode = "light" }) => {
  const theme = mode === "dark" ? darkTheme : lightTheme
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export const AppThemeProvider = ({ children }) => {
  const mode = useThemeStore(s => s.mode)
  const theme = mode === "dark" ? darkTheme : lightTheme
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default lightTheme


