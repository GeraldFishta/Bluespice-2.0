// components/payroll/PayrollPeriodList.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as ProcessIcon,
  CheckCircle as ApproveIcon,
} from "@mui/icons-material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { DataTable } from "@/components/ui/DataTable";
import { ConfirmDialog } from "@/components/common";
import { usePayrollPeriods } from "@/hooks/usePayrollPeriods";
import { usePayrollPeriodMutations } from "@/hooks/usePayrollPeriodMutations";
import { PayrollPeriod } from "@/hooks/usePayrollPeriods";

interface PayrollPeriodListProps {
  search?: string;
  status?: "all" | "draft" | "processing" | "approved" | "paid";
  frequency?: "all" | "weekly" | "bi-weekly" | "monthly" | "quarterly";
  onCreateClick?: () => void;
}

export function PayrollPeriodList({
  search,
  status = "all",
  frequency = "all",
  onCreateClick,
}: PayrollPeriodListProps) {
  const router = useRouter();
  const { payrollPeriods, isLoading, total } = usePayrollPeriods({
    search,
    status,
    frequency,
  });

  const {
    deletePayrollPeriod,
    processPayrollPeriod,
    approvePayrollPeriod,
  } = usePayrollPeriodMutations();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, period: PayrollPeriod) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedPeriod(period);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedPeriod(null);
  };

  const handleEdit = () => {
    if (selectedPeriod) {
      router.push(`/payroll/${selectedPeriod.id}/edit`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleProcess = async () => {
    if (selectedPeriod) {
      await processPayrollPeriod(selectedPeriod.id);
    }
    handleMenuClose();
  };

  const handleApprove = async () => {
    if (selectedPeriod) {
      await approvePayrollPeriod(selectedPeriod.id);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedPeriod) {
      await deletePayrollPeriod(selectedPeriod.id);
    }
    setDeleteDialogOpen(false);
    setSelectedPeriod(null);
  };

  const handleRowClick = (params: GridRowParams) => {
    router.push(`/payroll/${params.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "default";
      case "processing":
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
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 120,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("it-IT"),
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 120,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("it-IT"),
    },
    {
      field: "frequency",
      headerName: "Frequency",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
          {params.value.replace("-", " ")}
        </Typography>
      ),
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
      field: "total_gross",
      headerName: "Total Gross",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "total_net",
      headerName: "Total Net",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "created_at",
      headerName: "Created",
      width: 120,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("it-IT"),
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

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              Payroll Periods ({total || 0})
            </Typography>
          </Box>
          {onCreateClick && (
            <Button variant="contained" onClick={onCreateClick}>
              Create Payroll Period
            </Button>
          )}
        </Stack>
      </Box>

      <DataTable
        rows={payrollPeriods}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        autoHeight
        emptyMessage="No payroll periods found"
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

        {selectedPeriod?.status === "draft" && (
          <MenuItem onClick={handleProcess}>
            <ProcessIcon sx={{ mr: 1 }} />
            Process
          </MenuItem>
        )}

        {selectedPeriod?.status === "processing" && (
          <MenuItem onClick={handleApprove}>
            <ApproveIcon sx={{ mr: 1 }} />
            Approve
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
        title="Delete Payroll Period"
        content={`Are you sure you want to delete "${selectedPeriod?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Delete"
        confirmColor="error"
      />
    </>
  );
}
