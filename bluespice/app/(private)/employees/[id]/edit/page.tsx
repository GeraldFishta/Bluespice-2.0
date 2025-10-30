// app/(private)/employees/[id]/edit/page.tsx
"use client";
import { useParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { useEmployee } from "@/hooks/useEmployees";
import { PERMISSIONS } from "@/lib/permissions";
import { AccessDenied, LoadingSpinner } from "@/components/common";
import { usePermissions } from "@/hooks/usePermissions";

export default function EditEmployeePage() {
  const params = useParams();
  const employeeId = params.id as string;
  const { employee, isLoading, error } = useEmployee(employeeId);
  const { hasAccess } = usePermissions(PERMISSIONS.EMPLOYEES_UPDATE);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading employee..." />;
  }

  if (error || !employee) {
    return (
      <Box>
        <Typography color="error">
          {error?.message || "Employee not found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Edit Employee
      </Typography>
      <EmployeeForm employee={employee} />
    </Box>
  );
}
