// lib/theme/components.js
const components = {
  MuiButton: {
    styleOverrides: {
      root: { minHeight: "44px", textTransform: "none", borderRadius: "8px", fontWeight: 500 },
      contained: { boxShadow: "none", "&:hover": { boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" } },
    },
  },
  MuiTableCell: {
    styleOverrides: { root: { padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }, head: { fontWeight: 600, backgroundColor: "#f5f5f5" } },
  },
  MuiCard: { styleOverrides: { root: { borderRadius: "12px", boxShadow: "0px 2px 8px rgba(0,0,0,0.1)" } } },
  MuiTextField: { styleOverrides: { root: { "& .MuiOutlinedInput-root": { borderRadius: "8px" } } } },
  MuiPaper: { styleOverrides: { root: { borderRadius: "12px" } } },
  MuiChip: { styleOverrides: { root: { borderRadius: "16px", fontWeight: 500 } } },

  // Sidebar items
  MuiListItemButton: { styleOverrides: { root: { margin: "0", position: "relative", transform: "none", "&:hover": { backgroundColor: "transparent" } } } },
  MuiListItem: { styleOverrides: { root: { margin: "0", position: "relative", transform: "none" } } },
  MuiListItemIcon: { styleOverrides: { root: { margin: "0" } } },
  MuiListItemText: { styleOverrides: { root: { margin: "0" } } },

  // Scrollbars via CssBaseline
  MuiCssBaseline: {
    styleOverrides: {
      '[data-testid="main-content-area"]': {
        scrollbarWidth: "thin",
        scrollbarColor: "#e5e7eb #f4f6fa",
        "&::-webkit-scrollbar": { width: "5px", height: "5px" },
        "&::-webkit-scrollbar-track": { background: "#f4f6fa", borderRadius: "45px" },
        "&::-webkit-scrollbar-thumb": { background: "#e5e7eb", borderRadius: "45px" },
        "&::-webkit-scrollbar-thumb:hover": { background: "#d1d5db" },
      },
      ".MuiDrawer-paper": {
        scrollbarWidth: "thin",
        scrollbarColor: "#D1D5DB #F9FAFB",
        "&::-webkit-scrollbar": { width: "4px", height: "4px", borderRadius: "50px !important" },
        "&::-webkit-scrollbar-track": { background: "#F9FAFB", borderRadius: "50px" },
        "&::-webkit-scrollbar-thumb": { background: "#D1D5DB", borderRadius: "50px" },
        "&::-webkit-scrollbar-thumb:hover": { background: "#9CA3AF" },
      },
    },
  },

  // X-Data-Grid overrides (if @mui/x-data-grid is used)
  MuiDataGrid: {
    styleOverrides: {
      root: { border: "1px solid #e0e0e0", borderRadius: 8 },
      columnHeaders: { backgroundColor: "#f5f5f5", fontWeight: 600 },
      cell: { alignItems: "center" },
      row: { "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.04)" } },
    },
  },

  // X-Date-Pickers overrides (if @mui/x-date-pickers is used)
  MuiDateCalendar: {
    styleOverrides: {
      root: { borderRadius: 12 },
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: { borderRadius: 8, fontWeight: 500 },
    },
  },
}

export default components


