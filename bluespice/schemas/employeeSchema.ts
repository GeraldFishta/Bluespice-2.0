// schemas/employeeSchema.ts
import * as yup from "yup";

export const employeeSchema = yup.object({
    firstName: yup
        .string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters"),

    lastName: yup
        .string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters"),

    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email address"),

    hireDate: yup
        .string()
        .required("Hire date is required")
        .test("is-valid-date", "Invalid date", (value) => {
            if (!value) return false;
            const date = new Date(value);
            return !isNaN(date.getTime()) && date <= new Date();
        }),

    employeeId: yup
        .string()
        .required("Employee ID is required")
        .min(2, "Employee ID must be at least 2 characters"),

    salary: yup
        .number()
        .required("Salary is required")
        .positive("Salary must be positive")
        .min(0, "Salary must be at least 0"),

    hourlyRate: yup
        .number()
        .positive("Hourly rate must be positive")
        .nullable()
        .notRequired(),

    employmentType: yup
        .string()
        .oneOf(["full-time", "part-time", "contract"], "Invalid employment type")
        .required("Employment type is required"),

    status: yup
        .string()
        .oneOf(["active", "inactive", "terminated"], "Invalid status")
        .required("Status is required"),

    department: yup.string().required("Department is required"),

    position: yup.string().required("Position is required"),

    role: yup
        .string()
        .oneOf(["admin", "hr", "employee"], "Invalid role")
        .required("Role is required"),

    // ✅ NUOVI CAMPI PER PAYROLL
    taxCode: yup
        .string()
        .matches(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/, "Invalid Italian tax code format")
        .nullable()
        .notRequired(),

    iban: yup
        .string()
        .matches(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, "Invalid IBAN format")
        .nullable()
        .notRequired(),

    paymentMethod: yup
        .string()
        .oneOf(["bank_transfer", "check", "cash"], "Invalid payment method")
        .default("bank_transfer"),

    weeklyHours: yup
        .number()
        .min(1, "Weekly hours must be at least 1")
        .max(168, "Weekly hours cannot exceed 168")
        .default(40.0),

    vacationDays: yup
        .number()
        .min(0, "Vacation days cannot be negative")
        .max(365, "Vacation days cannot exceed 365")
        .integer("Vacation days must be a whole number")
        .default(26),

    sickDays: yup
        .number()
        .min(0, "Sick days cannot be negative")
        .max(365, "Sick days cannot exceed 365")
        .integer("Sick days must be a whole number")
        .default(0),

    contractType: yup
        .string()
        .nullable()
        .notRequired(),

    badgeId: yup
        .string()
        .nullable()
        .notRequired(),

    officePhone: yup
        .string()
        .matches(/^[\+]?[0-9\s\-\(\)]+$/, "Invalid phone number format")
        .nullable()
        .notRequired(),

    extension: yup
        .string()
        .matches(/^\d{1,10}$/, "Extension must be numeric and max 10 digits")
        .nullable()
        .notRequired(),
});

export type EmployeeFormData = {
    firstName: string;
    lastName: string;
    email: string;
    hireDate: string;
    employeeId: string;
    salary: number;
    hourlyRate?: number | null;
    employmentType: "full-time" | "part-time" | "contract";
    status: "active" | "inactive" | "terminated";
    department: string;
    position: string;
    role: "admin" | "hr" | "employee";
    // ✅ NUOVI CAMPI PER PAYROLL
    taxCode?: string | null;
    iban?: string | null;
    paymentMethod?: string;
    weeklyHours?: number;
    vacationDays?: number;
    sickDays?: number;
    contractType?: string | null;
    badgeId?: string | null;
    officePhone?: string | null;
    extension?: string | null;
};
