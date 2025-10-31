// app/(private)/employees/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useEmployees } from "@/hooks";
import { PERMISSIONS } from "@/lib/permissions";
import { SearchBar } from "@/components/search";
import {
  LoadingSpinner,
  AccessDenied,
  StatusChip,
  ConfirmDialog,
} from "@/components/common";
import { formatCurrency } from "@/utils";
import { usePermissions } from "@/hooks/usePermissions";

export default function EmployeesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "terminated"
  >("all");

  const { employees, isLoading, error, deleteEmployee } = useEmployees({
    search: searchQuery,
    status: statusFilter,
  });
  const { hasAccess: canView } = usePermissions(PERMISSIONS.EMPLOYEES_VIEW);
  const { hasAccess: canCreate } = usePermissions(PERMISSIONS.EMPLOYEES_CREATE);
  const { hasAccess: canUpdate } = usePermissions(PERMISSIONS.EMPLOYEES_UPDATE);
  const { hasAccess: canDelete } = usePermissions(PERMISSIONS.EMPLOYEES_DELETE);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  if (!canView) {
    return <AccessDenied />;
  }

  // Data already filtered server-side via useEmployees params
  const filteredEmployees = employees;

  const handleDeleteClick = (employee: { id: string; name: string }) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      const result = await deleteEmployee(employeeToDelete.id);
      if (result.success) {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Employees
        </Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push("/employees/add")}
          >
            Add Employee
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <SearchBar
            placeholder="Search employees..."
            onSearch={setSearchQuery}
            debounceMs={400}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "active" | "inactive" | "terminated"
              )
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">
            Error loading employees: {error.message}
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Employment Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <LoadingSpinner message="Loading employees..." />
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No employees found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>
                    {employee.profile?.first_name} {employee.profile?.last_name}
                  </TableCell>
                  <TableCell>{employee.profile?.email}</TableCell>
                  <TableCell>{employee.profile?.department || "-"}</TableCell>
                  <TableCell>{employee.profile?.position || "-"}</TableCell>
                  <TableCell>
                    <StatusChip
                      status={
                        employee.status === "active"
                          ? "active"
                          : employee.status === "terminated"
                          ? "rejected"
                          : "inactive"
                      }
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(employee.salary)}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.employment_type}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/employees/${employee.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      {canUpdate && (
                        <IconButton
                          size="small"
                          onClick={() =>
                            router.push(`/employees/${employee.id}/edit`)
                          }
                        >
                          <Edit />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteClick({
                              id: employee.id,
                              name:
                                `${employee.profile?.first_name || ""} ${
                                  employee.profile?.last_name || ""
                                }`.trim() || employee.employee_id,
                            })
                          }
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Employee"
        message={
          employeeToDelete
            ? `Are you sure you want to delete "${employeeToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this employee?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}
