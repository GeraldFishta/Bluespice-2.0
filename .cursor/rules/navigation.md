# Navigation Rules - Bluespice 2.0

## Overview

Navigation registry pattern, permission-based rendering, route structure, breadcrumbs, sidebar, and consistent link patterns for the Bluespice payroll application.

## Core Principles

### 1. Navigation Registry

- Single source of truth for all navigation items
- Centralized permission management
- Consistent route structure
- Easy to maintain and extend

### 2. Permission-Based Rendering

- Show/hide navigation items based on user roles
- Implement role-based access control
- Dynamic navigation based on permissions
- Secure route access

### 3. Route Structure

- Use Next.js App Router conventions
- Implement route groups for organization
- Consistent URL patterns
- SEO-friendly URLs

### 4. Navigation Components

- Reusable sidebar component
- Dynamic breadcrumbs
- Mobile-responsive navigation
- Consistent link patterns

## Patterns & Examples

### Navigation Registry

```javascript
// lib/navigation.js
export const navigationRegistry = {
  dashboard: {
    path: "/dashboard",
    label: "Dashboard",
    icon: "Dashboard",
    permissions: ["admin", "hr", "employee"],
    order: 1,
  },
  employees: {
    path: "/employees",
    label: "Employees",
    icon: "People",
    permissions: ["admin", "hr"],
    order: 2,
    children: {
      list: {
        path: "/employees",
        label: "Employee List",
        permissions: ["admin", "hr"],
      },
      add: {
        path: "/employees/add",
        label: "Add Employee",
        permissions: ["admin", "hr"],
      },
      departments: {
        path: "/employees/departments",
        label: "Departments",
        permissions: ["admin", "hr"],
      },
    },
  },
  payroll: {
    path: "/payroll",
    label: "Payroll",
    icon: "Payment",
    permissions: ["admin", "hr"],
    order: 3,
    children: {
      list: {
        path: "/payroll",
        label: "Payroll Records",
        permissions: ["admin", "hr"],
      },
      generate: {
        path: "/payroll/generate",
        label: "Generate Payroll",
        permissions: ["admin", "hr"],
      },
      reports: {
        path: "/payroll/reports",
        label: "Payroll Reports",
        permissions: ["admin", "hr"],
      },
    },
  },
  reports: {
    path: "/reports",
    label: "Reports",
    icon: "Assessment",
    permissions: ["admin", "hr"],
    order: 4,
    children: {
      analytics: {
        path: "/reports/analytics",
        label: "Analytics",
        permissions: ["admin", "hr"],
      },
      exports: {
        path: "/reports/exports",
        label: "Exports",
        permissions: ["admin", "hr"],
      },
    },
  },
  settings: {
    path: "/settings",
    label: "Settings",
    icon: "Settings",
    permissions: ["admin"],
    order: 5,
    children: {
      general: {
        path: "/settings/general",
        label: "General Settings",
        permissions: ["admin"],
      },
      users: {
        path: "/settings/users",
        label: "User Management",
        permissions: ["admin"],
      },
      integrations: {
        path: "/settings/integrations",
        label: "Integrations",
        permissions: ["admin"],
      },
    },
  },
  profile: {
    path: "/profile",
    label: "My Profile",
    icon: "Person",
    permissions: ["admin", "hr", "employee"],
    order: 99,
  },
};

// Helper functions
export const getNavigationItems = (userRole) => {
  return Object.entries(navigationRegistry)
    .filter(([_, config]) => config.permissions.includes(userRole))
    .sort(([_, a], [__, b]) => a.order - b.order)
    .map(([key, config]) => ({ key, ...config }));
};

export const getNavigationItem = (key) => {
  return navigationRegistry[key];
};

export const hasPermission = (userRole, requiredRoles) => {
  return requiredRoles.includes(userRole);
};

export const getBreadcrumbs = (pathname) => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Find matching navigation item
    const navItem = Object.values(navigationRegistry).find(
      (item) =>
        item.path === currentPath ||
        Object.values(item.children || {}).some(
          (child) => child.path === currentPath
        )
    );

    if (navItem) {
      breadcrumbs.push({
        label: navItem.label,
        path: currentPath,
      });
    } else {
      // Handle dynamic routes
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
      });
    }
  });

  return breadcrumbs;
};
```

### Sidebar Component

```javascript
// components/layout/Sidebar.js
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { getNavigationItems } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = ({ open, onClose, variant = "temporary" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState({});

  const navigationItems = getNavigationItems(user?.role || "employee");

  const handleNavigation = (path) => {
    router.push(path);
    if (variant === "temporary") {
      onClose();
    }
  };

  const handleExpand = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const renderNavigationItem = (item) => {
    const hasChildren = item.children && Object.keys(item.children).length > 0;
    const isExpanded = expandedItems[item.key];
    const isItemActive = isActive(item.path);

    return (
      <Box key={item.key}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleExpand(item.key);
              } else {
                handleNavigation(item.path);
              }
            }}
            selected={isItemActive}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {Object.entries(item.children).map(([childKey, child]) => (
                <ListItem key={childKey} disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => handleNavigation(child.path)}
                    selected={isActive(child.path)}
                  >
                    <ListItemText primary={child.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Bluespice
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Payroll Management
        </Typography>
      </Box>

      <Divider />

      <List>{navigationItems.map(renderNavigationItem)}</List>
    </Drawer>
  );
};

export default Sidebar;
```

### Breadcrumbs Component

```javascript
// components/layout/Breadcrumbs.js
import { usePathname } from "next/navigation";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { getBreadcrumbs } from "@/lib/navigation";

const CustomBreadcrumbs = () => {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography key={breadcrumb.path} color="text.primary">
                {breadcrumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={breadcrumb.path}
              underline="hover"
              color="inherit"
              href={breadcrumb.path}
            >
              {breadcrumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default CustomBreadcrumbs;
```

### Mobile Navigation

```javascript
// components/layout/MobileNavigation.js
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Payment,
  Assessment,
  Person,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { getNavigationItems } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";

const MobileNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = getNavigationItems(user?.role || "employee");
  const mobileNavItems = navigationItems.filter((item) =>
    ["dashboard", "employees", "payroll", "profile"].includes(item.key)
  );

  const handleBottomNavChange = (event, newValue) => {
    const item = mobileNavItems.find((item) => item.key === newValue);
    if (item) {
      router.push(item.path);
    }
  };

  const currentValue = mobileNavItems.find(
    (item) => pathname === item.path || pathname.startsWith(item.path + "/")
  )?.key;

  return (
    <>
      <AppBar position="fixed" sx={{ display: { xs: "block", md: "none" } }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bluespice
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ pb: 7, display: { xs: "block", md: "none" } }}>
        {/* Main content */}
      </Box>

      <BottomNavigation
        value={currentValue}
        onChange={handleBottomNavChange}
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: "flex", md: "none" },
        }}
      >
        {mobileNavItems.map((item) => (
          <BottomNavigationAction
            key={item.key}
            label={item.label}
            value={item.key}
            icon={<item.icon />}
          />
        ))}
      </BottomNavigation>
    </>
  );
};

export default MobileNavigation;
```

### Navigation Hook

```javascript
// hooks/useNavigation.js
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  getNavigationItems,
  getBreadcrumbs,
  hasPermission,
} from "@/lib/navigation";
import { useAuth } from "./useAuth";

export const useNavigation = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navigationItems = useMemo(() => {
    return getNavigationItems(user?.role || "employee");
  }, [user?.role]);

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbs(pathname);
  }, [pathname]);

  const canAccess = (requiredRoles) => {
    return hasPermission(user?.role, requiredRoles);
  };

  const getCurrentPage = () => {
    return navigationItems.find(
      (item) => pathname === item.path || pathname.startsWith(item.path + "/")
    );
  };

  return {
    navigationItems,
    breadcrumbs,
    canAccess,
    getCurrentPage,
    currentPath: pathname,
  };
};
```

### Route Protection Component

```javascript
// components/auth/RouteGuard.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/navigation";

const RouteGuard = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (
        requiredRoles.length > 0 &&
        !hasPermission(user.role, requiredRoles)
      ) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, loading, requiredRoles, router]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRoles.length > 0 && !hasPermission(user.role, requiredRoles)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return children;
};

export default RouteGuard;
```

## Anti-Patterns

### ❌ Don't Do This

```javascript
// Don't hardcode navigation items
const BadSidebar = () => {
  return (
    <List>
      <ListItem>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Employees" />
      </ListItem>
      {/* Hardcoded - hard to maintain */}
    </List>
  );
};

// Don't check permissions in every component
const BadComponent = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }
  // Permission check in every component - repetitive
};

// Don't use inconsistent link patterns
const BadLinks = () => {
  return (
    <div>
      <a href="/employees">Employees</a>
      <Link to="/payroll">Payroll</Link>
      <button onClick={() => router.push("/reports")}>Reports</button>
      {/* Inconsistent link patterns */}
    </div>
  );
};
```

### ✅ Do This Instead

```javascript
// Use navigation registry
const GoodSidebar = () => {
  const { navigationItems } = useNavigation();

  return (
    <List>
      {navigationItems.map((item) => (
        <ListItem key={item.key}>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );
};

// Use route guards for permission checking
const GoodComponent = () => {
  return (
    <RouteGuard requiredRoles={["admin"]}>
      <AdminContent />
    </RouteGuard>
  );
};

// Use consistent link patterns
const GoodLinks = () => {
  return (
    <div>
      <Link href="/employees">Employees</Link>
      <Link href="/payroll">Payroll</Link>
      <Link href="/reports">Reports</Link>
      {/* Consistent Next.js Link usage */}
    </div>
  );
};
```

## Related Files/Dependencies

### Required Packages

```json
{
  "next": "^13.0.0"
}
```

### File Structure

```
lib/
└── navigation.js         # Navigation registry and utilities
components/
├── layout/
│   ├── Sidebar.js        # Desktop sidebar
│   ├── Breadcrumbs.js    # Breadcrumb navigation
│   └── MobileNavigation.js # Mobile navigation
├── auth/
│   └── RouteGuard.js     # Route protection component
hooks/
└── useNavigation.js      # Navigation hook
```

### Navigation Best Practices

1. **Registry Pattern**: Use centralized navigation registry
2. **Permission-Based**: Show/hide items based on user roles
3. **Consistent Links**: Use Next.js Link component everywhere
4. **Mobile Responsive**: Implement mobile-friendly navigation
5. **Breadcrumbs**: Provide clear navigation context
6. **Route Guards**: Protect routes at layout level
7. **SEO Friendly**: Use descriptive URLs and meta tags
8. **Accessibility**: Implement proper ARIA labels and keyboard navigation
