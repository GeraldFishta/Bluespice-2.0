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
};
