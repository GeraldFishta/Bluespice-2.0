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
import { Add, Edit, Delete, Visibility, Search } from "@mui/icons-material";
import { useEmployees } from "@/hooks";
import { usePermissions, PERMISSIONS } from "@/lib/permissions";
import { LoadingSpinner, AccessDenied, StatusChip } from "@/components/common";
import { formatCurrency } from "@/utils/formatters";

export default function EmployeesPage() {
  const router = useRouter();
  const { employees, isLoading, error, deleteEmployee } = useEmployees();
  const { hasAccess: canView } = usePermissions(PERMISSIONS.EMPLOYEES_VIEW);
  const { hasAccess: canCreate } = usePermissions(PERMISSIONS.EMPLOYEES_CREATE);
  const { hasAccess: canUpdate } = usePermissions(PERMISSIONS.EMPLOYEES_UPDATE);
  const { hasAccess: canDelete } = usePermissions(PERMISSIONS.EMPLOYEES_DELETE);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (!canView) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">
          Error loading employees: {error.message}
        </Typography>
      </Box>
    );
  }

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      searchTerm === "" ||
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.profile?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      emp.profile?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      emp.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
    }
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
          <TextField
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
          </TextField>
        </Stack>
      </Paper>

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
            {filteredEmployees.length === 0 ? (
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
                          onClick={() => handleDelete(employee.id)}
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
    </Box>
  );
}
