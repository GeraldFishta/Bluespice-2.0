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
  const { updateEmployee } = useEmployees(); // Rimossa createEmployee non usata
  const { handleFormErrors, handleServerError } =
    useFormErrors<EmployeeFormData>();

  const isEditMode = !!employee;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(employeeSchema) as any,
    defaultValues: {
      firstName: employee?.profile?.first_name || "",
      lastName: employee?.profile?.last_name || "",
      email: employee?.profile?.email || "",
      hireDate: employee?.profile?.hire_date
        ? new Date(employee.profile.hire_date).toISOString().split("T")[0]
        : "",
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
        hireDate: employee.profile?.hire_date
          ? new Date(employee.profile.hire_date).toISOString().split("T")[0]
          : "",
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
        // CREATE MODE: Call API route to create auth user, profile, and employee
        try {
          // Get current session token
          const { data: session } = await supabase.auth.getSession();
          if (!session?.session?.access_token) {
            throw new Error("Not authenticated");
          }

          // Call API route
          const response = await fetch("/api/employees/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.session.access_token}`,
            },
            body: JSON.stringify({
              email: sanitizedData.email,
              firstName: sanitizedData.firstName,
              lastName: sanitizedData.lastName,
              employeeId: sanitizedData.employeeId,
              salary: sanitizedData.salary,
              hourlyRate: sanitizedData.hourlyRate,
              employmentType: sanitizedData.employmentType,
              department: sanitizedData.department,
              position: sanitizedData.position,
              role: sanitizedData.role,
              hireDate: sanitizedData.hireDate,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to create employee");
          }

          toast.success(
            "Employee created successfully! They will receive an email to set their password."
          );
          router.push("/employees");
          onSuccess?.();
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create employee";
          toast.error(errorMessage);
          handleServerError(error);
        }
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

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Box component="form" onSubmit={handleSubmit(onSubmit as any, onError)}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Stack spacing={2}>
              <FormField<EmployeeFormData>
                name="firstName"
                control={control}
                label="First Name"
                type="text"
                required
              />
              <FormField<EmployeeFormData>
                name="lastName"
                control={control}
                label="Last Name"
                type="text"
                required
              />
              <FormField<EmployeeFormData>
                name="email"
                control={control}
                label="Email"
                type="email"
                required
              />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Employment Details
            </Typography>
            <Stack spacing={2}>
              <FormField<EmployeeFormData>
                name="employeeId"
                control={control}
                label="Employee ID"
                type="text"
                required
              />
              <FormField<EmployeeFormData>
                name="hireDate"
                control={control}
                label="Hire Date"
                type="date"
                required
              />
              <FormField<EmployeeFormData>
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
              <FormField<EmployeeFormData>
                name="position"
                control={control}
                label="Position"
                type="text"
                required
              />
              <FormField<EmployeeFormData>
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
              <FormField<EmployeeFormData>
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
                <FormField<EmployeeFormData>
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
              <FormField<EmployeeFormData>
                name="salary"
                control={control}
                label="Salary (EUR)"
                type="number"
                required
              />
              <FormField<EmployeeFormData>
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
