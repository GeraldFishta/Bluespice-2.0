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

    phone: yup
        .string()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number"),

    hireDate: yup
        .date()
        .required("Hire date is required")
        .max(new Date(), "Hire date cannot be in the future"),

    salary: yup
        .number()
        .required("Salary is required")
        .positive("Salary must be positive")
        .min(0, "Salary must be at least 0"),

    department: yup
        .string()
        .required("Department is required"),

    position: yup
        .string()
        .required("Position is required"),

    role: yup
        .string()
        .oneOf(["admin", "hr", "employee"], "Invalid role")
        .required("Role is required"),
});

export type EmployeeFormData = yup.InferType<typeof employeeSchema>;
