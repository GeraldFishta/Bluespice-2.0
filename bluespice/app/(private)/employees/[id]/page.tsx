// app/(private)/employees/[id]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import { Edit, ArrowBack } from "@mui/icons-material";
import { useEmployee } from "@/hooks/useEmployees";
import { usePermissions, PERMISSIONS } from "@/lib/permissions";
import { LoadingSpinner, AccessDenied, StatusChip } from "@/components/common";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  const { employee, isLoading, error } = useEmployee(employeeId);
  const { hasAccess: canView } = usePermissions(PERMISSIONS.EMPLOYEES_VIEW);
  const { hasAccess: canUpdate } = usePermissions(PERMISSIONS.EMPLOYEES_UPDATE);

  if (!canView) {
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

  return (
    <Box>
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
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Personal Information
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile?.first_name} {profile?.last_name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{profile?.email}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {employee.employee_id}
                </Typography>
              </Box>
              {profile?.hire_date && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Hire Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(profile.hire_date)}
                  </Typography>
                </Box>
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
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1">
                  {profile?.department || "-"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Position
                </Typography>
                <Typography variant="body1">
                  {profile?.position || "-"}
                </Typography>
              </Box>
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
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Salary
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatCurrency(employee.salary)}
                </Typography>
              </Box>
              {employee.hourly_rate && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Hourly Rate
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(employee.hourly_rate)}/hour
                  </Typography>
                </Box>
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
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formatDate(employee.created_at)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {formatDate(employee.updated_at)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
