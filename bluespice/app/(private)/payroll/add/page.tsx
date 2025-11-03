// app/(private)/payroll/add/page.tsx
"use client";
import { Container, Box } from "@mui/material";
import { PayrollPeriodForm } from "@/components/payroll";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/common";

export default function AddPayrollPeriodPage() {
  const { hasAccess } = usePermissions(PERMISSIONS.PAYROLL_CREATE);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <PayrollPeriodForm />
      </Box>
    </Container>
  );
}
