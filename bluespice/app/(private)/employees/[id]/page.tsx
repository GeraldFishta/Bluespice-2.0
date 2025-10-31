"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Chip,
  Grid,
} from "@mui/material";
import { Edit, ArrowBack, Delete } from "@mui/icons-material";
import { useEmployee } from "@/hooks/useEmployees";
import { useEmployeeMutations } from "@/hooks/useEmployeeMutations";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";

import {
  LoadingSpinner,
  AccessDenied,
  StatusChip,
  ConfirmDialog,
} from "@/components/common";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  const { employee, isLoading, error } = useEmployee(employeeId);
  const { deleteEmployee } = useEmployeeMutations();
  const { hasAccess: canView } = usePermissions(PERMISSIONS.EMPLOYEES_VIEW);
  const { hasAccess: canUpdate } = usePermissions(PERMISSIONS.EMPLOYEES_UPDATE);
  const { hasAccess: canDelete } = usePermissions(PERMISSIONS.EMPLOYEES_DELETE);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Log for debugging hydration mismatch issues
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[EmployeeDetailPage] Component mounted on client", {
        employeeId,
        timestamp: new Date().toISOString(),
        hasEmployee: !!employee,
        isLoading,
        hasError: !!error,
      });
    }
  }, [employeeId, employee, isLoading, error]);

  // Log hydration warnings if any
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      const originalError = console.error;
      console.error = (...args) => {
        if (
          typeof args[0] === "string" &&
          (args[0].includes("hydration") ||
            args[0].includes("Hydration") ||
            args[0].includes("mismatch"))
        ) {
          console.warn("[HYDRATION DEBUG]", {
            message: args[0],
            stack: new Error().stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
          });
        }
        originalError.apply(console, args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  if (!canView) return <AccessDenied />;
  if (isLoading) return <LoadingSpinner message="Loading employee..." />;

  if (error || !employee) {
    return (
      <Box>
        <Typography color="error">
          {error?.message || "Employee not found"}
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/employees")}
          sx={{ mt: 2 }}
        >
          Back to Employees
        </Button>
      </Box>
    );
  }

  const profile = employee.profile;

  const handleDeleteConfirm = async () => {
    const result = await deleteEmployee(employee.id);
    if (result.success) router.push("/employees");
    else setDeleteDialogOpen(false);
  };

  const employeeName =
    profile?.first_name || profile?.last_name
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      : employee.employee_id;

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Employee Details
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/employees")}
          >
            Back
          </Button>

          {canUpdate && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => router.push(`/employees/${employee.id}/edit`)}
            >
              Edit
            </Button>
          )}

          {canDelete && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Content */}
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Personal Information
            </Typography>
            <Stack spacing={2}>
              <Info label="Full Name">
                {profile?.first_name} {profile?.last_name}
              </Info>
              <Info label="Email">{profile?.email}</Info>
              <Info label="Employee ID" bold>
                {employee.employee_id}
              </Info>
              {profile?.hire_date && (
                <Info label="Hire Date">{formatDate(profile.hire_date)}</Info>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Employment Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Employment Details
            </Typography>
            <Stack spacing={2}>
              <Info label="Department">{profile?.department || "-"}</Info>
              <Info label="Position">{profile?.position || "-"}</Info>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Chip
                  label={profile?.role || "employee"}
                  size="small"
                  color={
                    profile?.role === "admin"
                      ? "error"
                      : profile?.role === "hr"
                      ? "primary"
                      : "default"
                  }
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <StatusChip
                  status={
                    employee.status === "active"
                      ? "active"
                      : employee.status === "terminated"
                      ? "rejected"
                      : "inactive"
                  }
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Employment Type
                </Typography>
                <Chip
                  label={employee.employment_type}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Compensation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Compensation
            </Typography>
            <Stack spacing={2}>
              <Info label="Salary" bold>
                {formatCurrency(employee.salary)}
              </Info>
              {employee.hourly_rate && (
                <Info label="Hourly Rate">
                  {formatCurrency(employee.hourly_rate)}/hour
                </Info>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Additional Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Additional Information
            </Typography>
            <Stack spacing={2}>
              <Info label="Created At">{formatDate(employee.created_at)}</Info>
              <Info label="Last Updated">
                {formatDate(employee.updated_at)}
              </Info>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete "${employeeName}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}

/* Small helper subcomponent to reduce repetition */
function Info({
  label,
  children,
  bold = false,
}: {
  label: string;
  children: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: bold ? 500 : "normal", wordBreak: "break-word" }}
      >
        {children}
      </Typography>
    </Box>
  );
}
