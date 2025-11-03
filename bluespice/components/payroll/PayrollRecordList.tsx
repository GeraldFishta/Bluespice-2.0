// components/payroll/PayrollRecordList.tsx
"use client";
import { useState } from "react";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { DataTable } from "@/components/ui/DataTable";
import { ConfirmDialog } from "@/components/common";
import { usePayrollRecords } from "@/hooks/usePayrollRecords";
import { usePayrollRecordMutations } from "@/hooks/usePayrollRecordMutations";
import { PayrollRecord } from "@/hooks/usePayrollRecords";

interface PayrollRecordListProps {
  payrollPeriodId?: string;
  status?: "all" | "pending" | "approved" | "paid";
  onCreateClick?: () => void;
  onEditClick?: (record: PayrollRecord) => void;
  filters?: {
    employeeName?: string;
    periodName?: string;
    minAmount?: string;
    maxAmount?: string;
  };
}

export function PayrollRecordList({
  payrollPeriodId,
  status = "all",
  onCreateClick,
  onEditClick,
  filters,
}: PayrollRecordListProps) {
  const { payrollRecords, isLoading, total } = usePayrollRecords({
    payrollPeriodId,
    status,
    ...filters,
  });

  const {
    deletePayrollRecord,
    approvePayrollRecord,
    markAsPaid,
    bulkApproveRecords,
  } = usePayrollRecordMutations();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    record: PayrollRecord
  ) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedRecord(record);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRecord(null);
  };

  const handleEdit = () => {
    if (selectedRecord && onEditClick) {
      onEditClick(selectedRecord);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleApprove = async () => {
    if (selectedRecord) {
      await approvePayrollRecord(selectedRecord.id);
    }
    handleMenuClose();
  };

  const handleMarkAsPaid = async () => {
    if (selectedRecord) {
      await markAsPaid(selectedRecord.id);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedRecord) {
      await deletePayrollRecord(selectedRecord.id);
    }
    setDeleteDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleBulkApprove = async () => {
    if (selectedRecords.length > 0) {
      await bulkApproveRecords(selectedRecords);
      setSelectedRecords([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "paid":
        return "info";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const columns: GridColDef[] = [
    {
      field: "employee",
      headerName: "Employee",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row.employee?.first_name} {params.row.employee?.last_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.employee?.employee_id}
          </Typography>
        </Box>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 140,
      valueGetter: (params) => params.row.employee?.department || "",
    },
    {
      field: "position",
      headerName: "Position",
      width: 140,
      valueGetter: (params) => params.row.employee?.position || "",
    },
    {
      field: "base_salary",
      headerName: "Base Salary",
      width: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "overtime_hours",
      headerName: "OT Hours",
      width: 100,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => `${params.value}h`,
    },
    {
      field: "overtime_amount",
      headerName: "OT Amount",
      width: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "bonuses",
      headerName: "Bonuses",
      width: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "deductions",
      headerName: "Deductions",
      width: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "net_pay",
      headerName: "Net Pay",
      width: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleMenuOpen(event, params.row)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  const pendingRecords = payrollRecords.filter((r) => r.status === "pending");

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h6">Payroll Records ({total || 0})</Typography>
            {payrollPeriodId && (
              <Typography variant="body2" color="text.secondary">
                Period: {payrollRecords[0]?.payroll_period?.name}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1}>
            {pendingRecords.length > 0 && (
              <Tooltip
                title={`Approve ${pendingRecords.length} pending records`}
              >
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={handleBulkApprove}
                  size="small"
                >
                  Approve All ({pendingRecords.length})
                </Button>
              </Tooltip>
            )}

            {onCreateClick && (
              <Button variant="contained" onClick={onCreateClick} size="small">
                Add Record
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      <DataTable
        rows={payrollRecords}
        columns={columns}
        loading={isLoading}
        autoHeight
        emptyMessage="No payroll records found"
        checkboxSelection
        onRowSelectionModelChange={(ids) => setSelectedRecords(ids as string[])}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        {selectedRecord?.status === "pending" && (
          <MenuItem onClick={handleApprove}>
            <ApproveIcon sx={{ mr: 1 }} />
            Approve
          </MenuItem>
        )}

        {selectedRecord?.status === "approved" && (
          <MenuItem onClick={handleMarkAsPaid}>
            <PaymentIcon sx={{ mr: 1 }} />
            Mark as Paid
          </MenuItem>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Payroll Record"
        content={`Are you sure you want to delete the payroll record for "${selectedRecord?.employee?.first_name} ${selectedRecord?.employee?.last_name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Delete"
        confirmColor="error"
      />
    </>
  );
}
