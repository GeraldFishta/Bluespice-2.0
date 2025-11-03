// components/payroll/PayrollGenerator.tsx
"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { AutoFixHigh as GenerateIcon } from "@mui/icons-material";
import { usePayrollRecordMutations } from "@/hooks/usePayrollRecordMutations";
import { useEmployees } from "@/hooks/useEmployees";
import { usePayrollRecords } from "@/hooks/usePayrollRecords";

interface PayrollGeneratorProps {
  payrollPeriodId: string;
  onSuccess?: () => void;
}

export function PayrollGenerator({ payrollPeriodId, onSuccess }: PayrollGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { generatePayrollRecords } = usePayrollRecordMutations();
  const { employees } = useEmployees({ status: "active" });
  const { payrollRecords } = usePayrollRecords({ payrollPeriodId });

  // Filter employees with role "employee"
  const activeEmployees = employees.filter(emp => emp.profile?.role === "employee");
  const existingRecordsCount = payrollRecords.length;
  const employeesWithoutRecords = activeEmployees.length - existingRecordsCount;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generatePayrollRecords(payrollPeriodId);
      if (result.success) {
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!generating) {
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<GenerateIcon />}
        onClick={handleOpen}
        disabled={employeesWithoutRecords === 0}
      >
        Generate Payroll Records
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Generate Payroll Records
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            <Typography variant="body1">
              This will automatically create payroll records for all active employees who don't already have records for this payroll period.
            </Typography>

            <Box>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  • Total active employees: <strong>{activeEmployees.length}</strong>
                </Typography>
                <Typography variant="body2">
                  • Existing payroll records: <strong>{existingRecordsCount}</strong>
                </Typography>
                <Typography variant="body2">
                  • Records to generate: <strong>{employeesWithoutRecords}</strong>
                </Typography>
              </Stack>
            </Box>

            {employeesWithoutRecords === 0 ? (
              <Alert severity="info">
                All active employees already have payroll records for this period.
              </Alert>
            ) : (
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Important:</strong> This action will create payroll records with base salary from employee contracts.
                  You can then edit individual records to add overtime, bonuses, and deductions.
                </Typography>
              </Alert>
            )}

            {generating && (
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} />
                <Typography variant="body2">
                  Generating payroll records...
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={generating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={generating || employeesWithoutRecords === 0}
            color="primary"
          >
            {generating ? "Generating..." : `Generate ${employeesWithoutRecords} Records`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
