// app/(private)/employees/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Pagination,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useEmployees } from "@/hooks";
import { useEmployeeMutations } from "@/hooks/useEmployeeMutations";
import { PERMISSIONS } from "@/lib/permissions";
import { SearchBar } from "@/components/search";
import { AccessDenied, StatusChip, ConfirmDialog } from "@/components/common";
import { DataTable } from "@/components/ui";
import {
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { formatCurrency } from "@/utils";
import { usePermissions } from "@/hooks/usePermissions";

type SortField = "created_at" | "employee_id" | "salary";
type SortDirection = "asc" | "desc";

export default function EmployeesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "terminated"
  >("all");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<
    "all" | "full-time" | "part-time" | "contract"
  >("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { employees, total, isLoading, error } = useEmployees({
    search: searchQuery,
    status: statusFilter,
    employmentType: employmentTypeFilter,
    sort: sortField,
    dir: sortDirection,
    page,
    pageSize,
  });
  const { deleteEmployee } = useEmployeeMutations();
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

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setPageSize(event.target.value as number);
    setPage(1); // Reset to first page on page size change
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      setSortField(field as SortField);
      setSortDirection(sort as SortDirection);
      setPage(1); // Reset to first page on sort change
    }
  };

  // Calculate total pages
  const totalPages = total ? Math.ceil(total / pageSize) : 0;

  // DataTable column configuration
  const columns: GridColDef[] = [
    {
      field: "employee_id",
      headerName: "Employee ID",
      width: 120,
      sortable: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.row.profile?.first_name} {params.row.profile?.last_name}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{params.row.profile?.email}</Typography>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{params.value || "-"}</Typography>
      ),
    },
    {
      field: "position",
      headerName: "Position",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{params.value || "-"}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <StatusChip
          status={
            params.value === "active"
              ? "active"
              : params.value === "terminated"
              ? "rejected"
              : "inactive"
          }
        />
      ),
    },
    {
      field: "salary",
      headerName: "Salary",
      width: 120,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{formatCurrency(params.value)}</Typography>
      ),
    },
    {
      field: "employment_type",
      headerName: "Employment Type",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} size="small" variant="outlined" />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton
            size="small"
            onClick={() => router.push(`/employees/${params.row.id}`)}
          >
            <Visibility />
          </IconButton>
          {canUpdate && (
            <IconButton
              size="small"
              onClick={() => router.push(`/employees/${params.row.id}/edit`)}
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
                  id: params.row.id,
                  name:
                    `${params.row.profile?.first_name || ""} ${
                      params.row.profile?.last_name || ""
                    }`.trim() || params.row.employee_id,
                })
              }
            >
              <Delete />
            </IconButton>
          )}
        </Stack>
      ),
    },
  ];

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
            onChange={(e) => {
              setStatusFilter(
                e.target.value as "all" | "active" | "inactive" | "terminated"
              );
              setPage(1); // Reset to first page on filter change
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
          </TextField>
          <TextField
            select
            label="Employment Type"
            value={employmentTypeFilter}
            onChange={(e) => {
              setEmploymentTypeFilter(
                e.target.value as "all" | "full-time" | "part-time" | "contract"
              );
              setPage(1); // Reset to first page on filter change
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="full-time">Full-time</MenuItem>
            <MenuItem value="part-time">Part-time</MenuItem>
            <MenuItem value="contract">Contract</MenuItem>
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

      <DataTable
        rows={filteredEmployees}
        columns={columns}
        loading={isLoading}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50, 100]}
        autoHeight
        emptyMessage="No employees found"
        onSortModelChange={handleSortModelChange}
        initialState={{
          sorting: {
            sortModel: [{ field: sortField, sort: sortDirection }],
          },
        }}
      />

      {/* Pagination */}
      {total && total > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Total: {total} employees
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={pageSize}
                  label="Per Page"
                  onChange={(e) =>
                    handlePageSizeChange(
                      e as React.ChangeEvent<{ value: unknown }>
                    )
                  }
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Stack>
        </Paper>
      )}

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
