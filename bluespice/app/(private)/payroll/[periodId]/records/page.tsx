// app/(private)/payroll/[periodId]/records/page.tsx
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { PayrollRecordList, PayrollGenerator } from "@/components/payroll";
import { usePayrollPeriod } from "@/hooks/usePayrollPeriods";
import { PayrollRecord } from "@/hooks/usePayrollRecords";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied, LoadingSpinner } from "@/components/common";

type StatusTab = "all" | "pending" | "approved" | "paid";

export default function PayrollPeriodRecordsPage() {
  const params = useParams();
  const router = useRouter();
  const periodId = params.periodId as string;

  const { payrollPeriod, isLoading, error } = usePayrollPeriod(periodId);
  const { hasAccess } = usePermissions(PERMISSIONS.PAYROLL_VIEW);

  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
          <LoadingSpinner />
        </Box>
      </Container>
    );
  }

  if (error || !payrollPeriod) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="error">
            Error loading payroll period: {error?.message || "Period not found"}
          </Typography>
        </Box>
      </Container>
    );
  }

  const handleCreateClick = () => {
    router.push(`/payroll/${periodId}/records/add`);
  };

  const handleEditClick = (record: PayrollRecord) => {
    router.push(`/payroll/${periodId}/records/${record.id}/edit`);
  };

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: StatusTab
  ) => {
    setStatusTab(newValue);
  };

  const handleGenerationSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
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
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/payroll")}
              >
                Back to Periods
              </Button>
              <Box>
                <Typography variant="h4" component="h1">
                  {payrollPeriod.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Payroll Records Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(payrollPeriod.start_date).toLocaleDateString(
                    "it-IT"
                  )}{" "}
                  -{" "}
                  {new Date(payrollPeriod.end_date).toLocaleDateString("it-IT")}
                </Typography>
              </Box>
            </Stack>

            {hasAccess && payrollPeriod.status !== "paid" && (
              <Stack direction="row" spacing={2}>
                <PayrollGenerator
                  payrollPeriodId={periodId}
                  onSuccess={handleGenerationSuccess}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateClick}
                  size="large"
                >
                  Add Manual Record
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Period Summary */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Period Summary
          </Typography>
          <Stack direction="row" spacing={4} flexWrap="wrap">
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Gross
              </Typography>
              <Typography variant="h6" color="success.main">
                €{payrollPeriod.total_gross.toLocaleString("it-IT")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Net
              </Typography>
              <Typography variant="h6" color="primary.main">
                €{payrollPeriod.total_net.toLocaleString("it-IT")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                {payrollPeriod.status}
              </Typography>
            </Box>
          </Stack>
        </Paper>

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
          key={refreshTrigger}
          payrollPeriodId={periodId}
          status={statusTab}
          onCreateClick={
            hasAccess && payrollPeriod.status !== "paid"
              ? handleCreateClick
              : undefined
          }
          onEditClick={handleEditClick}
        />
      </Box>
    </Container>
  );
}
