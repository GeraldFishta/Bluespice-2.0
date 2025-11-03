// app/(private)/payroll/[periodId]/records/add/page.tsx
"use client";
import { useParams } from "next/navigation";
import { Container, Box } from "@mui/material";
import { PayrollRecordForm } from "@/components/payroll";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/common";

export default function AddPayrollRecordPage() {
  const params = useParams();
  const periodId = params.periodId as string;

  const { hasAccess } = usePermissions(PERMISSIONS.PAYROLL_CREATE);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <PayrollRecordForm payrollPeriodId={periodId} />
      </Box>
    </Container>
  );
}
