// components/payroll/PayrollPeriodForm.tsx
"use client";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Stack,
  Paper,
  Typography,
  Divider,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  payrollPeriodSchema,
  PayrollPeriodFormData,
} from "@/schemas/payrollPeriodSchema";
import { useToast } from "@/hooks/useToast";
import { secureFormData } from "@/utils/form-security";
import { PayrollPeriod } from "@/hooks/usePayrollPeriods";
import { usePayrollPeriodMutations } from "@/hooks/usePayrollPeriodMutations";

interface PayrollPeriodFormProps {
  payrollPeriod?: PayrollPeriod | null;
  onSuccess?: () => void;
}

export function PayrollPeriodForm({
  payrollPeriod,
  onSuccess,
}: PayrollPeriodFormProps) {
  const router = useRouter();
  const toast = useToast();
  const { createPayrollPeriod, updatePayrollPeriod } =
    usePayrollPeriodMutations();

  const isEditMode = !!payrollPeriod;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PayrollPeriodFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(payrollPeriodSchema) as any,
    defaultValues: {
      name: payrollPeriod?.name || "",
      startDate: payrollPeriod?.start_date
        ? new Date(payrollPeriod.start_date).toISOString().split("T")[0]
        : "",
      endDate: payrollPeriod?.end_date
        ? new Date(payrollPeriod.end_date).toISOString().split("T")[0]
        : "",
      frequency: payrollPeriod?.frequency || "monthly",
      description: payrollPeriod?.description || "",
      status: payrollPeriod?.status || "draft",
    },
  });

  const onSubmit = async (data: PayrollPeriodFormData) => {
    try {
      const securedData = secureFormData(data);

      if (isEditMode && payrollPeriod) {
        const result = await updatePayrollPeriod(payrollPeriod.id, {
          name: securedData.name,
          start_date: securedData.startDate,
          end_date: securedData.endDate,
          frequency: securedData.frequency,
          description: securedData.description,
        });
        if (!result.success) {
          toast.error(result.error || "Failed to update payroll period");
          return;
        }
      } else {
        const result = await createPayrollPeriod({
          name: securedData.name,
          start_date: securedData.startDate,
          end_date: securedData.endDate,
          frequency: securedData.frequency,
          description: securedData.description,
        });
        if (!result.success) {
          toast.error(result.error || "Failed to create payroll period");
          return;
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/payroll");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "default";
      case "processing":
        return "warning";
      case "approved":
        return "success";
      case "paid":
        return "info";
      default:
        return "default";
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return "Weekly";
      case "bi-weekly":
        return "Bi-weekly";
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      default:
        return frequency;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? "Edit Payroll Period" : "Create Payroll Period"}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Period Name"
                    placeholder="e.g., October 2025 Payroll"
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    placeholder="Optional notes about this payroll period"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                  />
                )}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Date Range */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Date Range
            </Typography>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Start Date"
                    type="date"
                    required
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    fullWidth
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="End Date"
                    type="date"
                    required
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                    fullWidth
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Settings */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Frequency"
                    select
                    required
                    error={!!errors.frequency}
                    helperText={errors.frequency?.message}
                    fullWidth
                    sx={{ flex: 1 }}
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="bi-weekly">Bi-weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                  </TextField>
                )}
              />

              {isEditMode && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip
                    label={payrollPeriod?.status || "draft"}
                    color={getStatusColor(payrollPeriod?.status || "draft")}
                    size="small"
                  />
                </Box>
              )}
            </Stack>
          </Box>

          {/* Summary */}
          {isEditMode && payrollPeriod && (
            <>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Frequency:</strong>{" "}
                    {getFrequencyLabel(payrollPeriod.frequency)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Gross:</strong> €
                    {payrollPeriod.total_gross.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Net:</strong> €
                    {payrollPeriod.total_net.toLocaleString()}
                  </Typography>
                  {payrollPeriod.created_at && (
                    <Typography variant="body2">
                      <strong>Created:</strong>{" "}
                      {new Date(payrollPeriod.created_at).toLocaleDateString()}
                    </Typography>
                  )}
                  {payrollPeriod.processed_at && (
                    <Typography variant="body2">
                      <strong>Processed:</strong>{" "}
                      {new Date(
                        payrollPeriod.processed_at
                      ).toLocaleDateString()}
                    </Typography>
                  )}
                  {payrollPeriod.approved_at && (
                    <Typography variant="body2">
                      <strong>Approved:</strong>{" "}
                      {new Date(payrollPeriod.approved_at).toLocaleDateString()}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </>
          )}

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Period"
                : "Create Period"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
