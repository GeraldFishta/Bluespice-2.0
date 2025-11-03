// app/(private)/payroll/[periodId]/records/[recordId]/edit/page.tsx
"use client";
import { useParams } from "next/navigation";
import { Container, Box, Alert } from "@mui/material";
import { PayrollRecordForm } from "@/components/payroll";
import { usePayrollRecord } from "@/hooks/usePayrollRecords";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied, LoadingSpinner } from "@/components/common";

export default function EditPayrollRecordPage() {
  const params = useParams();
  const periodId = params.periodId as string;
  const recordId = params.recordId as string;

  const { payrollRecord, isLoading, error } = usePayrollRecord(recordId);
  const { hasAccess } = usePermissions(PERMISSIONS.PAYROLL_UPDATE);

  if (!hasAccess) {
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
            Error loading payroll record: {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!payrollRecord) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning">
            Payroll record not found
          </Alert>
        </Box>
      </Container>
    );
  }

  // Prevent editing if already paid
  if (payrollRecord.status === "paid") {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="info">
            This payroll record has already been paid and cannot be edited.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <PayrollRecordForm
          payrollRecord={payrollRecord}
          payrollPeriodId={periodId}
        />
      </Box>
    </Container>
  );
}
