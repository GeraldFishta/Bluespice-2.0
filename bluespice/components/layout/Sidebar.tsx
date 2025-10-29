"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Dashboard, People, Payment, Schedule } from "@mui/icons-material";
import { getNavigationItems } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <Dashboard />,
  People: <People />,
  Payment: <Payment />,
  Schedule: <Schedule />,
};

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const navItems = getNavigationItems(role);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ overflow: "auto", mt: 8 }}>
        <List>
          {navItems.map((item) => {
            const Icon = item.icon ? iconMap[item.icon] : null;
            const isActive =
              pathname === item.path || pathname?.startsWith(item.path + "/");

            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={isActive}
                >
                  {Icon && <ListItemIcon>{Icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
