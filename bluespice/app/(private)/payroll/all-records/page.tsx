// app/(private)/payroll/all-records/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Stack,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { PayrollRecordList } from "@/components/payroll";
import { PayrollRecord } from "@/hooks/usePayrollRecords";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/common";

type StatusTab = "all" | "pending" | "approved" | "paid";

export default function AllPayrollRecordsPage() {
  const router = useRouter();
  const { hasAccess } = usePermissions(PERMISSIONS.PAYROLL_VIEW);

  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [filters, setFilters] = useState({
    employeeName: "",
    periodName: "",
    minAmount: "",
    maxAmount: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: StatusTab
  ) => {
    setStatusTab(newValue);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      employeeName: "",
      periodName: "",
      minAmount: "",
      maxAmount: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value.trim() !== ""
  );

  const handleEditClick = (record: PayrollRecord) => {
    router.push(
      `/payroll/${record.payroll_period_id}/records/${record.id}/edit`
    );
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                All Payroll Records
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Global view of all payroll records across all periods
              </Typography>
              {hasActiveFilters && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    label={`${
                      Object.values(filters).filter((v) => v.trim()).length
                    } active filters`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              )}
            </Box>

            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Stack>
        </Box>

        {/* Advanced Filters */}
        {showFilters && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Advanced Filters
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <TextField
                label="Employee Name"
                value={filters.employeeName}
                onChange={(e) =>
                  handleFilterChange("employeeName", e.target.value)
                }
                placeholder="Search by employee name..."
                size="small"
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Period Name"
                value={filters.periodName}
                onChange={(e) =>
                  handleFilterChange("periodName", e.target.value)
                }
                placeholder="Search by period name..."
                size="small"
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Min Amount (€)"
                type="number"
                value={filters.minAmount}
                onChange={(e) =>
                  handleFilterChange("minAmount", e.target.value)
                }
                placeholder="0"
                size="small"
                sx={{ minWidth: 120 }}
              />
              <TextField
                label="Max Amount (€)"
                type="number"
                value={filters.maxAmount}
                onChange={(e) =>
                  handleFilterChange("maxAmount", e.target.value)
                }
                placeholder="10000"
                size="small"
                sx={{ minWidth: 120 }}
              />
            </Stack>
            {hasActiveFilters && (
              <Button
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
                color="secondary"
              >
                Clear All Filters
              </Button>
            )}
          </Paper>
        )}

        {/* Status Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={statusTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="All Records" value="all" />
            <Tab label="Pending" value="pending" />
            <Tab label="Approved" value="approved" />
            <Tab label="Paid" value="paid" />
          </Tabs>
        </Paper>

        {/* Payroll Records List */}
        <PayrollRecordList
          status={statusTab}
          onEditClick={handleEditClick}
          filters={filters}
        />
      </Box>
    </Container>
  );
}
