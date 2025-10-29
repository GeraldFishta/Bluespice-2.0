"use client";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { Logout, DarkMode, LightMode } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useThemeStore } from "@/stores/themeStore";

export function Header() {
  const router = useRouter();
  const { mode, toggleMode } = useThemeStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bluespice
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={toggleMode}
            aria-label="toggle theme"
          >
            {mode === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            aria-label="logout"
          >
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
