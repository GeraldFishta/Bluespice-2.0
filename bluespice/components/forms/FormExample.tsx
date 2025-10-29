// components/forms/FormExample.tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Stack, Paper, Typography } from "@mui/material";
import { FormField } from "./FormField";
import { employeeSchema, EmployeeFormData } from "@/schemas/employeeSchema";
import { useFormErrors } from "@/hooks/useFormErrors";
import { useToast } from "@/hooks/useToast";
import { secureFormData } from "@/utils/form-security";

export function FormExample() {
  const toast = useToast();
  const { handleFormErrors, handleServerError } =
    useFormErrors<EmployeeFormData>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hireDate: undefined,
      salary: 0,
      department: "",
      position: "",
      role: "employee",
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // Sanitize form data before submission
      const sanitizedData = secureFormData(data);

      // Simulate API call
      console.log("Form data (sanitized):", sanitizedData);
      toast.success("Employee created successfully!");
      reset();
    } catch (error) {
      handleServerError(error);
    }
  };

  const onError = () => {
    handleFormErrors(errors);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Example Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
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
          <FormField
            name="hireDate"
            control={control}
            label="Hire Date"
            type="date"
            required
          />
          <FormField
            name="salary"
            control={control}
            label="Salary"
            type="number"
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
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Button type="button" variant="outlined" onClick={() => reset()}>
              Reset
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
