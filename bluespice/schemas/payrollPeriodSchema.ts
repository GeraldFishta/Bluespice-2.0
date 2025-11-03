// schemas/payrollPeriodSchema.ts
import * as yup from "yup";

export const payrollPeriodSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  startDate: yup
    .string()
    .required("Start date is required")
    .test("is-valid-date", "Invalid date", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),

  endDate: yup
    .string()
    .required("End date is required")
    .test("is-valid-date", "Invalid date", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test("is-after-start", "End date must be after start date", function(value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return true;
      return new Date(value) > new Date(startDate);
    }),

  frequency: yup
    .string()
    .oneOf(["weekly", "bi-weekly", "monthly", "quarterly"], "Invalid frequency")
    .default("monthly"),

  description: yup
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  status: yup
    .string()
    .oneOf(["draft", "processing", "approved", "paid"], "Invalid status")
    .default("draft"),
});

export type PayrollPeriodFormData = {
  name: string;
  startDate: string;
  endDate: string;
  frequency: "weekly" | "bi-weekly" | "monthly" | "quarterly";
  description?: string;
  status: "draft" | "processing" | "approved" | "paid";
};
