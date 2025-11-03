// schemas/payrollRecordSchema.ts
import * as yup from "yup";

export const payrollRecordSchema = yup.object({
  employee_id: yup
    .string()
    .required("Employee is required")
    .uuid("Invalid employee ID"),

  payroll_period_id: yup
    .string()
    .required("Payroll period is required")
    .uuid("Invalid payroll period ID"),

  base_salary: yup
    .number()
    .required("Base salary is required")
    .positive("Base salary must be positive")
    .min(0, "Base salary must be at least 0"),

  overtime_hours: yup
    .number()
    .min(0, "Overtime hours cannot be negative")
    .max(100, "Overtime hours cannot exceed 100")
    .default(0),

  overtime_rate: yup
    .number()
    .min(0, "Overtime rate cannot be negative")
    .default(0),

  deductions: yup
    .number()
    .min(0, "Deductions cannot be negative")
    .default(0),

  bonuses: yup
    .number()
    .min(0, "Bonuses cannot be negative")
    .default(0),

  status: yup
    .string()
    .oneOf(["pending", "approved", "paid"], "Invalid status")
    .default("pending"),
});

export type PayrollRecordFormData = {
  employee_id: string;
  payroll_period_id: string;
  base_salary: number;
  overtime_hours?: number;
  overtime_rate?: number;
  deductions?: number;
  bonuses?: number;
  status?: "pending" | "approved" | "paid";
};
