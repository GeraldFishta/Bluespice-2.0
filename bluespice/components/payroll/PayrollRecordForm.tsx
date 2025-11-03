// components/payroll/PayrollRecordForm.tsx
"use client";
import { useEffect } from "react";
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
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { payrollRecordSchema, PayrollRecordFormData } from "@/schemas/payrollRecordSchema";
import { useToast } from "@/hooks/useToast";
import { secureFormData } from "@/utils/form-security";
import { PayrollRecord } from "@/hooks/usePayrollRecords";
import { usePayrollRecordMutations } from "@/hooks/usePayrollRecordMutations";
import { useEmployees } from "@/hooks/useEmployees";

interface PayrollRecordFormProps {
  payrollRecord?: PayrollRecord | null;
  payrollPeriodId: string;
  onSuccess?: () => void;
}

export function PayrollRecordForm({
  payrollRecord,
  payrollPeriodId,
  onSuccess,
}: PayrollRecordFormProps) {
  const router = useRouter();
  const toast = useToast();
  const { createPayrollRecord, updatePayrollRecord } = usePayrollRecordMutations();

  // Get employees list for selection
  const { employees } = useEmployees({ status: "active" });

  const isEditMode = !!payrollRecord;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PayrollRecordFormData>({
    resolver: yupResolver(payrollRecordSchema),
    defaultValues: {
      employee_id: payrollRecord?.employee_id || "",
      payroll_period_id: payrollPeriodId,
      base_salary: payrollRecord?.base_salary || 0,
      overtime_hours: payrollRecord?.overtime_hours || 0,
      overtime_rate: payrollRecord?.overtime_rate || 0,
      deductions: payrollRecord?.deductions || 0,
      bonuses: payrollRecord?.bonuses || 0,
      status: payrollRecord?.status || "pending",
    },
  });

  // Watch for calculations
  const baseSalary = watch("base_salary");
  const overtimeHours = watch("overtime_hours");
  const overtimeRate = watch("overtime_rate");
  const bonuses = watch("bonuses");
  const deductions = watch("deductions");

  // Auto-populate base salary when employee changes
  const selectedEmployeeId = watch("employee_id");
  useEffect(() => {
    if (selectedEmployeeId && !isEditMode) {
      const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
      if (selectedEmployee) {
        setValue("base_salary", selectedEmployee.salary);
        setValue("overtime_rate", selectedEmployee.hourly_rate || 0);
      }
    }
  }, [selectedEmployeeId, employees, setValue, isEditMode]);

  // Calculate totals
  const overtimeAmount = (overtimeHours || 0) * (overtimeRate || 0);
  const grossTotal = (baseSalary || 0) + overtimeAmount + (bonuses || 0);
  const netTotal = grossTotal - (deductions || 0);

  const onSubmit = async (data: PayrollRecordFormData) => {
    try {
      const securedData = secureFormData(data);

      if (isEditMode && payrollRecord) {
        const result = await updatePayrollRecord(payrollRecord.id, {
          base_salary: securedData.base_salary,
          overtime_hours: securedData.overtime_hours,
          overtime_rate: securedData.overtime_rate,
          deductions: securedData.deductions,
          bonuses: securedData.bonuses,
        });
        if (!result.success) {
          toast.error(result.error || "Failed to update payroll record");
          return;
        }
      } else {
        const result = await createPayrollRecord({
          employee_id: securedData.employee_id,
          payroll_period_id: payrollPeriodId,
          base_salary: securedData.base_salary,
          overtime_hours: securedData.overtime_hours,
          overtime_rate: securedData.overtime_rate,
          deductions: securedData.deductions,
          bonuses: securedData.bonuses,
        });
        if (!result.success) {
          toast.error(result.error || "Failed to create payroll record");
          return;
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? "Edit Payroll Record" : "Create Payroll Record"}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          {/* Employee Selection */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Employee Information
            </Typography>
            <Controller
              name="employee_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Select Employee"
                  required
                  error={!!errors.employee_id}
                  helperText={errors.employee_id?.message}
                  fullWidth
                  disabled={isEditMode} // Can't change employee in edit mode
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.profile?.first_name} {employee.profile?.last_name} - {employee.employee_id}
                      {employee.department && ` (${employee.department})`}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {selectedEmployee && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Department:</strong> {selectedEmployee.department || "N/A"} |
                  <strong>Position:</strong> {selectedEmployee.position || "N/A"} |
                  <strong>Contract Salary:</strong> {formatCurrency(selectedEmployee.salary)}
                </Typography>
              </Alert>
            )}
          </Box>

          <Divider />

          {/* Salary Information */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Salary Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="base_salary"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Base Salary"
                      required
                      error={!!errors.base_salary}
                      helperText={errors.base_salary?.message}
                      fullWidth
                      InputProps={{
                        startAdornment: "€",
                      }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="bonuses"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Bonuses"
                      error={!!errors.bonuses}
                      helperText={errors.bonuses?.message}
                      fullWidth
                      InputProps={{
                        startAdornment: "€",
                      }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Overtime */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Overtime
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="overtime_hours"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Overtime Hours"
                      error={!!errors.overtime_hours}
                      helperText={errors.overtime_hours?.message}
                      fullWidth
                      InputProps={{
                        endAdornment: "hours",
                      }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="overtime_rate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Overtime Rate per Hour"
                      error={!!errors.overtime_rate}
                      helperText={errors.overtime_rate?.message}
                      fullWidth
                      InputProps={{
                        startAdornment: "€",
                      }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Deductions */}
          <Box>
            <Controller
              name="deductions"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Deductions"
                  error={!!errors.deductions}
                  helperText={errors.deductions?.message}
                  fullWidth
                  InputProps={{
                    startAdornment: "€",
                  }}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />
          </Box>

          {/* Calculations Summary */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pay Summary
              </Typography>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Base Salary:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(baseSalary || 0)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Overtime ({overtimeHours || 0}h × {formatCurrency(overtimeRate || 0)}):</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(overtimeAmount)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Bonuses:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(bonuses || 0)}
                  </Typography>
                </Box>

                <Divider />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" fontWeight="medium">Gross Total:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {formatCurrency(grossTotal)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Deductions:</Typography>
                  <Typography variant="body2" fontWeight="medium" color="error.main">
                    -{formatCurrency(deductions || 0)}
                  </Typography>
                </Box>

                <Divider />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Net Pay:</Typography>
                  <Typography variant="h6" color="primary.main">
                    {formatCurrency(netTotal)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

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
                ? "Update Record"
                : "Create Record"
              }
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
