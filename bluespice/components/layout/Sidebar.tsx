"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Dashboard,
  People,
  Payment,
  Schedule,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { getNavigationItems, NavItem } from "@/lib/navigation";
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
  console.log("🔍 DEBUG - Current role:", role); // 👈 AGGIUNGI QUI
  const navItems = getNavigationItems(role);
  console.log("🔍 DEBUG - Navigation items:", navItems); // 👈 E QUI
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (path: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const Icon = item.icon ? iconMap[item.icon] : null;
    const hasChildren = item.children && Object.keys(item.children).length > 0;
    const isOpen = openItems[item.path] || false;
    const isActive =
      pathname === item.path || pathname?.startsWith(item.path + "/");

    return (
      <Box key={item.path}>
        <ListItem disablePadding>
          <ListItemButton
            component={hasChildren ? "div" : Link}
            href={hasChildren ? undefined : item.path}
            selected={isActive && !hasChildren}
            onClick={hasChildren ? () => toggleItem(item.path) : undefined}
            sx={{ pl: level * 2 + 2 }}
          >
            {Icon && <ListItemIcon>{Icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {Object.values(item.children || {}).map((child: NavItem) => {
                const childIcon = child.icon ? iconMap[child.icon] : null;
                const isChildActive =
                  pathname === child.path ||
                  pathname?.startsWith(child.path + "/");

                return (
                  <ListItem key={child.path} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={child.path}
                      selected={isChildActive}
                      sx={{ pl: level * 2 + 6 }}
                    >
                      {childIcon && <ListItemIcon>{childIcon}</ListItemIcon>}
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

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
        <List>{navItems.map((item) => renderNavItem(item))}</List>
      </Box>
    </Drawer>
  );
}
