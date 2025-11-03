// app/(private)/payroll/[id]/edit/page.tsx
"use client";
import { useParams } from "next/navigation";
import { Container, Box, Alert } from "@mui/material";
import { PayrollPeriodForm } from "@/components/payroll";
import { usePayrollPeriod } from "@/hooks/usePayrollPeriods";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied, LoadingSpinner } from "@/components/common";

export default function EditPayrollPeriodPage() {
  const params = useParams();
  const id = params.id as string;

  const { payrollPeriod, isLoading, error } = usePayrollPeriod(id);
  const { hasPermission } = usePermissions();

  if (!hasPermission(PERMISSIONS.PAYROLL.UPDATE)) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
          <LoadingSpinner />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            Error loading payroll period: {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!payrollPeriod) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning">
            Payroll period not found
          </Alert>
        </Box>
      </Container>
    );
  }

  // Prevent editing if already paid
  if (payrollPeriod.status === "paid") {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="info">
            This payroll period has already been paid and cannot be edited.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <PayrollPeriodForm payrollPeriod={payrollPeriod} />
      </Box>
    </Container>
  );
}
