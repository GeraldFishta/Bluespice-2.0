// lib/navigation.ts
export type NavItem = {
    path: string
    label: string
    icon?: string
    permissions?: string[]
    order: number
    children?: Record<string, NavItem>
}

export const navigationRegistry: Record<string, NavItem> = {
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
                order: 1,
            },
            add: {
                path: "/employees/add",
                label: "Add Employee",
                permissions: ["admin", "hr"],
                order: 2,
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
            periods: {
                path: "/payroll",
                label: "Payroll Periods",
                permissions: ["admin", "hr"],
                order: 1,
            },
            allRecords: {
                path: "/payroll/all-records",
                label: "All Records",
                permissions: ["admin", "hr"],
                order: 2,
            },
            add: {
                path: "/payroll/add",
                label: "Add Payroll Period",
                permissions: ["admin", "hr"],
                order: 3,
            },
        },
    },
    timesheets: {
        path: "/timesheets",
        label: "Timesheets",
        icon: "Schedule",
        permissions: ["admin", "hr", "employee"],
        order: 4,
    },
}

export function getNavigationItems(userRole: string | null): NavItem[] {
    return Object.values(navigationRegistry)
        .filter((item) => {
            // If no permissions required, show to everyone
            if (!item.permissions || item.permissions.length === 0) return true;
            // If userRole is null, show Dashboard and Timesheets (basic access)
            if (!userRole) {
                return item.path === "/dashboard" || item.path === "/timesheets";
            }
            // Check if user role is in permissions
            return item.permissions.includes(userRole);
        })
        .sort((a, b) => a.order - b.order)
}

export function findNavItemByPath(pathname: string): NavItem | null {
    for (const item of Object.values(navigationRegistry)) {
        if (item.path === pathname) return item
        if (item.children) {
            for (const child of Object.values(item.children)) {
                if (child.path === pathname) return child
            }
        }
    }
    return null
}
