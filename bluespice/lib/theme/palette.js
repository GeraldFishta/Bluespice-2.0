// lib/theme/palette.js - Light/Dark palettes with state colors

const base = {
  primary: { main: "#1976d2", light: "#42a5f5", dark: "#1565c0", contrastText: "#ffffff" },
  secondary: { main: "#4CAF50", light: "#66bb6a", dark: "#388e3c", contrastText: "#ffffff" },
  error: { main: "#F44336", light: "#ef5350", dark: "#d32f2f", contrastText: "#ffffff" },
  warning: { main: "#FF9800", light: "#ffb74d", dark: "#f57c00", contrastText: "#000000" },
  success: { main: "#4CAF50", light: "#66bb6a", dark: "#388e3c", contrastText: "#ffffff" },
  info: { main: "#2196F3", light: "#64b5f6", dark: "#1976d2", contrastText: "#ffffff" },
  grey: {
    50: "#fafafa", 100: "#f5f5f5", 200: "#eeeeee", 300: "#e0e0e0", 400: "#bdbdbd",
    500: "#9e9e9e", 600: "#757575", 700: "#616161", 800: "#424242", 900: "#212121",
  },
  custom: {
    payroll: {
      salary: "#4CAF50",
      bonus: "#FF9800",
      deduction: "#F44336",
      tax: "#9C27B0",
      overtime: "#2196F3",
    },
    chart: {
      primary: "#1976d2",
      secondary: "#4CAF50",
      tertiary: "#FF9800",
      quaternary: "#9C27B0",
      quinary: "#F44336",
    },
    state: {
      pending: { main: "#9E9E9E", bg: "#F5F5F5", contrastText: "#212121" },
      approved: { main: "#4CAF50", bg: "#E8F5E8", contrastText: "#1B5E20" },
      rejected: { main: "#F44336", bg: "#FFEBEE", contrastText: "#B71C1C" },
    },
  },
}

export const lightPalette = {
  mode: "light",
  ...base,
  background: { default: "#ffffff", paper: "#f5f5f5" },
  text: { primary: "#212121", secondary: "#757575", disabled: "#bdbdbd" },
  divider: "#e0e0e0",
}

export const darkPalette = {
  mode: "dark",
  ...base,
  primary: { ...base.primary, light: "#4791db", main: "#90caf9", dark: "#115293", contrastText: "#0b1220" },
  secondary: { ...base.secondary, main: "#81c784", light: "#a5d6a7", dark: "#4caf50", contrastText: "#0b1220" },
  background: { default: "#0b1220", paper: "#111827" },
  text: { primary: "#e5e7eb", secondary: "#9ca3af", disabled: "#6b7280" },
  divider: "#374151",
  custom: {
    ...base.custom,
    state: {
      pending: { main: "#9CA3AF", bg: "#1F2937", contrastText: "#E5E7EB" },
      approved: { main: "#81C784", bg: "#0F2E1B", contrastText: "#E6F4EA" },
      rejected: { main: "#E57373", bg: "#3F0D12", contrastText: "#FFEBEE" },
    },
  },
}

export default lightPalette


