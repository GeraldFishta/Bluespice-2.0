# Project Structure Rules - Bluespice 2.0

## Overview

Hybrid file structure, naming conventions (PascalCase, camelCase), import/export patterns (named exports), import ordering, and environment variables for the Bluespice payroll application.

## Core Principles

### 1. Hybrid File Structure

- Combine Next.js App Router with traditional component organization
- Separate concerns with clear directory structure
- Group related files together
- Maintain scalability and maintainability

### 2. Naming Conventions

- **Components**: PascalCase (e.g., `EmployeeCard.js`)
- **Hooks**: camelCase with `use` prefix (e.g., `useEmployeeData.js`)
- **Utilities**: camelCase (e.g., `formatCurrency.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: Descriptive names that indicate purpose

### 3. Import/Export Patterns

- Use named exports consistently
- Avoid default exports for components
- Group imports logically
- Use absolute imports with path aliases

### 4. Environment Configuration

- Centralize environment variables
- Use different configs for dev/prod
- Validate required environment variables
- Document all environment variables

## Patterns & Examples

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Route group for auth pages
│   │   ├── login/
│   │   │   └── page.js
│   │   └── signup/
│   │       └── page.js
│   ├── (dashboard)/         # Route group for dashboard pages
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── employees/
│   │   │   ├── page.js
│   │   │   ├── [id]/
│   │   │   │   └── page.js
│   │   │   └── add/
│   │   │       └── page.js
│   │   ├── payroll/
│   │   │   ├── page.js
│   │   │   └── generate/
│   │   │       └── page.js
│   │   └── reports/
│   │       └── page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/             # Reusable components
│   ├── ui/                 # Base UI components
│   │   ├── Button.js
│   │   ├── DataTable.js
│   │   ├── FormField.js
│   │   └── index.js
│   ├── forms/              # Form-specific components
│   │   ├── EmployeeForm.js
│   │   ├── PayrollForm.js
│   │   └── index.js
│   ├── layout/             # Layout components
│   │   ├── Sidebar.js
│   │   ├── Header.js
│   │   ├── Breadcrumbs.js
│   │   └── index.js
│   ├── employees/           # Employee-specific components
│   │   ├── EmployeeCard.js
│   │   ├── EmployeeList.js
│   │   ├── EmployeeFilters.js
│   │   └── index.js
│   ├── payroll/            # Payroll-specific components
│   │   ├── PayrollSummary.js
│   │   ├── PayrollTable.js
│   │   └── index.js
│   └── common/             # Common components
│       ├── LoadingSpinner.js
│       ├── ErrorBoundary.js
│       └── index.js
├── hooks/                  # Custom hooks
│   ├── useAuth.js
│   ├── useEmployees.js
│   ├── usePayroll.js
│   ├── useNavigation.js
│   └── index.js
├── lib/                    # Utilities and configurations
│   ├── auth.js
│   ├── axios.js
│   ├── theme.js
│   ├── navigation.js
│   └── constants.js
├── stores/                 # Zustand stores
│   ├── authStore.js
│   ├── uiStore.js
│   ├── settingsStore.js
│   └── index.js
├── schemas/                # Validation schemas
│   ├── employeeSchema.js
│   ├── payrollSchema.js
│   └── index.js
├── utils/                  # Helper functions
│   ├── formatters.js
│   ├── validators.js
│   ├── formSecurity.js
│   └── index.js
└── types/                  # TypeScript types (if using TS)
    ├── auth.ts
    ├── employee.ts
    └── index.ts
```

### Naming Conventions Examples

```javascript
// Components - PascalCase
// components/employees/EmployeeCard.js
export const EmployeeCard = ({ employee, onEdit }) => {
  return <div>{employee.name}</div>;
};

// Hooks - camelCase with use prefix
// hooks/useEmployeeData.js
export const useEmployeeData = (employeeId) => {
  const { data, error, isLoading } = useSWR(
    `/api/employees/${employeeId}`,
    fetcher
  );
  return { employee: data, error, isLoading };
};

// Utilities - camelCase
// utils/formatters.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US").format(new Date(date));
};

// Constants - UPPER_SNAKE_CASE
// lib/constants.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FILE_TYPES = [".csv", ".xlsx", ".pdf"];
export const USER_ROLES = {
  ADMIN: "admin",
  HR: "hr",
  EMPLOYEE: "employee",
};
```

### Import/Export Patterns

```javascript
// ✅ Good - Named exports
// components/ui/Button.js
export const Button = ({ children, variant = "primary", ...props }) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};

export const ButtonGroup = ({ children, ...props }) => {
  return (
    <div className="btn-group" {...props}>
      {children}
    </div>
  );
};

// ✅ Good - Index file for clean imports
// components/ui/index.js
export { Button, ButtonGroup } from "./Button";
export { DataTable } from "./DataTable";
export { FormField } from "./FormField";

// ✅ Good - Import usage
// components/employees/EmployeeList.js
import { Button, DataTable } from "@/components/ui";
import { useEmployeeData } from "@/hooks";
import { formatCurrency } from "@/utils/formatters";
import { USER_ROLES } from "@/lib/constants";

// ❌ Bad - Default exports
export default Button; // Avoid this

// ❌ Bad - Mixed import styles
import Button from "./Button"; // Default import
import { DataTable } from "./DataTable"; // Named import
```

### Import Ordering

```javascript
// ✅ Good - Proper import order
// components/employees/EmployeeList.js

// 1. React/Next.js imports
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 2. Third-party library imports
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

// 3. Internal imports (absolute paths with @ alias)
import { useEmployeeData } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { USER_ROLES } from "@/lib/constants";

// 4. Relative imports
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeFilters } from "./EmployeeFilters";

// 5. Type imports (if using TypeScript)
import type { Employee, EmployeeFilters as FilterType } from "@/types";
```

### Environment Configuration

```javascript
// lib/config.js
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_API_BASE_URL",
];

// Validate required environment variables
const validateEnvVars = () => {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// Validate on import
validateEnvVars();

export const config = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
  },

  // App configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Bluespice",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },

  // Feature flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== "false",
    enableExport: process.env.NEXT_PUBLIC_ENABLE_EXPORT !== "false",
  },
};

// Environment-specific configurations
export const isDevelopment = config.app.environment === "development";
export const isProduction = config.app.environment === "production";
export const isTest = config.app.environment === "test";
```

### Path Aliases Configuration

```javascript
// next.config.js
const path = require('path')

module.exports = {
  // ... other config

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/stores': path.resolve(__dirname, 'src/stores'),
      '@/schemas': path.resolve(__dirname, 'src/schemas'),
      '@/types': path.resolve(__dirname, 'src/types')
    }

    return config
  }
}

// jsconfig.json (for VS Code IntelliSense)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/lib/*": ["src/lib/*"],
      "@/utils/*": ["src/utils/*"],
      "@/stores/*": ["src/stores/*"],
      "@/schemas/*": ["src/schemas/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

### File Organization Patterns

```javascript
// ✅ Good - Component with related files
// components/employees/EmployeeCard/
// ├── EmployeeCard.js
// ├── EmployeeCard.test.js
// ├── EmployeeCard.stories.js
// └── index.js

// EmployeeCard.js
export const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <div className="employee-card">
      <h3>{employee.name}</h3>
      <p>{employee.position}</p>
      <button onClick={() => onEdit(employee)}>Edit</button>
      <button onClick={() => onDelete(employee.id)}>Delete</button>
    </div>
  );
};

// index.js
export { EmployeeCard } from "./EmployeeCard";

// ✅ Good - Hook with related files
// hooks/useEmployeeData/
// ├── useEmployeeData.js
// ├── useEmployeeData.test.js
// └── index.js

// ✅ Good - Utility with related files
// utils/formatters/
// ├── formatters.js
// ├── formatters.test.js
// └── index.js
```

## Anti-Patterns

### ❌ Don't Do This

```javascript
// Don't use inconsistent naming
const badComponent = () => <div>Bad</div>; // camelCase for component
const Bad_Component = () => <div>Bad</div>; // snake_case for component
const badcomponent = () => <div>Bad</div>; // lowercase for component

// Don't mix import styles
import React from "react";
import { useState } from "react"; // Duplicate React import
import Button from "./Button"; // Default import
import { DataTable } from "./DataTable"; // Named import

// Don't use relative paths for deep imports
import { formatCurrency } from "../../../utils/formatters"; // Too deep
import { useAuth } from "../../../../hooks/useAuth"; // Too deep

// Don't hardcode environment variables
const API_URL = "https://api.example.com"; // Hardcoded - bad
const MAX_SIZE = 1000000; // Magic number - bad
```

### ✅ Do This Instead

```javascript
// Use consistent PascalCase for components
const GoodComponent = () => <div>Good</div>;

// Use consistent import style
import React, { useState } from "react";
import { Button, DataTable } from "@/components/ui";
import { formatCurrency } from "@/utils/formatters";
import { useAuth } from "@/hooks";

// Use absolute imports with aliases
import { formatCurrency } from "@/utils/formatters";
import { useAuth } from "@/hooks/useAuth";

// Use environment variables
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MAX_SIZE = process.env.NEXT_PUBLIC_MAX_FILE_SIZE || 1000000;
```

## Related Files/Dependencies

### Configuration Files

```json
// package.json
{
  "name": "bluespice-2.0",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

```javascript
// next.config.js
module.exports = {
  // Configuration
}

// jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### File Structure Guidelines

1. **Scalability**: Structure should support growth
2. **Clarity**: Directory names should be self-explanatory
3. **Consistency**: Follow naming conventions throughout
4. **Separation**: Keep concerns separated
5. **Reusability**: Group reusable components together
6. **Maintainability**: Easy to find and modify files
7. **Testing**: Co-locate test files with components
8. **Documentation**: Include README files in complex directories
