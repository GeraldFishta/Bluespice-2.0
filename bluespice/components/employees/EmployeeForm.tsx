// components/employees/EmployeeForm.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Stack, Paper, Typography, Divider } from "@mui/material";
import { FormField } from "@/components/forms/FormField";
import { employeeSchema, EmployeeFormData } from "@/schemas/employeeSchema";
import { useFormErrors } from "@/hooks/useFormErrors";
import { useToast } from "@/hooks/useToast";
import { secureFormData } from "@/utils/form-security";
import { useEmployees, Employee } from "@/hooks/useEmployees";
import { supabase } from "@/lib/supabase";

interface EmployeeFormProps {
  employee?: Employee | null;
  onSuccess?: () => void;
}

export function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const router = useRouter();
  const toast = useToast();
  const { createEmployee, updateEmployee } = useEmployees();
  const { handleFormErrors, handleServerError } =
    useFormErrors<EmployeeFormData>();

  const isEditMode = !!employee;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      firstName: employee?.profile?.first_name || "",
      lastName: employee?.profile?.last_name || "",
      email: employee?.profile?.email || "",
      phone: "",
      hireDate: employee?.profile?.hire_date
        ? new Date(employee.profile.hire_date).toISOString().split("T")[0]
        : undefined,
      employeeId: employee?.employee_id || "",
      salary: employee?.salary || 0,
      hourlyRate: employee?.hourly_rate || null,
      employmentType: employee?.employment_type || "full-time",
      status: employee?.status || "active",
      department: employee?.profile?.department || "",
      position: employee?.profile?.position || "",
      role:
        (employee?.profile?.role as "admin" | "hr" | "employee") || "employee",
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.profile?.first_name || "",
        lastName: employee.profile?.last_name || "",
        email: employee.profile?.email || "",
        phone: "",
        hireDate: employee.profile?.hire_date
          ? new Date(employee.profile.hire_date).toISOString().split("T")[0]
          : undefined,
        employeeId: employee.employee_id || "",
        salary: employee.salary || 0,
        hourlyRate: employee.hourly_rate || null,
        employmentType: employee.employment_type || "full-time",
        status: employee.status || "active",
        department: employee.profile?.department || "",
        position: employee.profile?.position || "",
        role:
          (employee.profile?.role as "admin" | "hr" | "employee") || "employee",
      });
    }
  }, [employee, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const sanitizedData = secureFormData(data);

      if (isEditMode && employee) {
        // Update mode: update both profile and employee
        // Update profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            first_name: sanitizedData.firstName,
            last_name: sanitizedData.lastName,
            email: sanitizedData.email,
            department: sanitizedData.department,
            position: sanitizedData.position,
            role: sanitizedData.role,
            hire_date: sanitizedData.hireDate
              ? new Date(sanitizedData.hireDate).toISOString()
              : null,
          })
          .eq("id", employee.profile_id);

        if (profileError) throw profileError;

        // Update employee
        const result = await updateEmployee(employee.id, {
          employee_id: sanitizedData.employeeId,
          salary: sanitizedData.salary,
          hourly_rate: sanitizedData.hourlyRate || null,
          employment_type: sanitizedData.employmentType,
          status: sanitizedData.status,
        });

        if (!result.success)
          throw new Error(result.error || "Failed to update employee");

        toast.success("Employee updated successfully!");
        router.push("/employees");
        onSuccess?.();
      } else {
        // Create mode: for now, we need to create profile first
        // This is a simplified version - in production you'd want to create auth user first
        toast.error(
          "Creating new employees requires profile setup. Please use the profile creation flow first."
        );
        // TODO: Implement full create flow with profile creation
      }
    } catch (error) {
      handleServerError(error);
    }
  };

  const onError = () => {
    handleFormErrors(errors);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {isEditMode ? "Edit Employee" : "Add Employee"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Stack spacing={2}>
              <FormField
                name="firstName"
                control={control}
                label="First Name"
                type="text"
                required
              />
              <FormField
                name="lastName"
                control={control}
                label="Last Name"
                type="text"
                required
              />
              <FormField
                name="email"
                control={control}
                label="Email"
                type="email"
                required
              />
              <FormField
                name="phone"
                control={control}
                label="Phone"
                type="text"
                placeholder="+39 123 456 7890"
              />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Employment Details
            </Typography>
            <Stack spacing={2}>
              <FormField
                name="employeeId"
                control={control}
                label="Employee ID"
                type="text"
                required
              />
              <FormField
                name="hireDate"
                control={control}
                label="Hire Date"
                type="date"
                required
              />
              <FormField
                name="department"
                control={control}
                label="Department"
                type="select"
                options={[
                  { value: "engineering", label: "Engineering" },
                  { value: "hr", label: "HR" },
                  { value: "finance", label: "Finance" },
                  { value: "sales", label: "Sales" },
                  { value: "marketing", label: "Marketing" },
                  { value: "operations", label: "Operations" },
                ]}
                required
              />
              <FormField
                name="position"
                control={control}
                label="Position"
                type="text"
                required
              />
              <FormField
                name="role"
                control={control}
                label="Role"
                type="select"
                options={[
                  { value: "employee", label: "Employee" },
                  { value: "hr", label: "HR" },
                  { value: "admin", label: "Admin" },
                ]}
                required
              />
              <FormField
                name="employmentType"
                control={control}
                label="Employment Type"
                type="select"
                options={[
                  { value: "full-time", label: "Full Time" },
                  { value: "part-time", label: "Part Time" },
                  { value: "contract", label: "Contract" },
                ]}
                required
              />
              {isEditMode && (
                <FormField
                  name="status"
                  control={control}
                  label="Status"
                  type="select"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "terminated", label: "Terminated" },
                  ]}
                  required
                />
              )}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Compensation
            </Typography>
            <Stack spacing={2}>
              <FormField
                name="salary"
                control={control}
                label="Salary (EUR)"
                type="number"
                required
              />
              <FormField
                name="hourlyRate"
                control={control}
                label="Hourly Rate (EUR)"
                type="number"
              />
            </Stack>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Employee"
                : "Create Employee"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
