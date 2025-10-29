// app/(private)/employees/add/page.tsx
"use client";
import { Box, Typography } from "@mui/material";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { PERMISSIONS } from "@/lib/permissions";
import { AccessDenied } from "@/components/common";
import { usePermissions } from "@/hooks/usePermissions";

export default function AddEmployeePage() {
  const { hasAccess } = usePermissions(PERMISSIONS.EMPLOYEES_CREATE);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Add Employee
      </Typography>
      <EmployeeForm />
    </Box>
  );
}
