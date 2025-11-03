// app/(private)/payroll/[periodId]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { usePayrollPeriod } from "@/hooks/usePayrollPeriods";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied, LoadingSpinner } from "@/components/common";

export default function PayrollPeriodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const periodId = params.periodId as string;

  const { payrollPeriod, isLoading, error } = usePayrollPeriod(periodId);
  const { hasAccess } = usePermissions(PERMISSIONS.PAYROLL_VIEW);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
          <LoadingSpinner />
        </Box>
      </Container>
    );
  }

  if (error || !payrollPeriod) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="error">
            Error loading payroll period: {error?.message || "Period not found"}
          </Typography>
        </Box>
      </Container>
    );
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Box>
              <Typography variant="h4" component="h1">
                {payrollPeriod.name}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 1 }}
              >
                <Chip
                  label={payrollPeriod.status}
                  color={getStatusColor(payrollPeriod.status)}
                />
                <Typography variant="body2" color="text.secondary">
                  {payrollPeriod.frequency.replace("-", " ")}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {hasAccess && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/payroll/${periodId}/edit`)}
            >
              Edit Period
            </Button>
          )}
        </Stack>

        {/* Details */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Period Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Date Range */}
            {/* @ts-expect-error - MUI Grid types issue */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="body1">
                {formatDate(payrollPeriod.start_date)}
              </Typography>
            </Grid>
            {/* @ts-expect-error - MUI Grid types issue */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                End Date
              </Typography>
              <Typography variant="body1">
                {formatDate(payrollPeriod.end_date)}
              </Typography>
            </Grid>

            {/* Financial Summary */}
            {/* @ts-expect-error - MUI Grid types issue */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Gross
              </Typography>
              <Typography variant="h6" color="success.main">
                {formatCurrency(payrollPeriod.total_gross)}
              </Typography>
            </Grid>
            {/* @ts-expect-error - MUI Grid types issue */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Net
              </Typography>
              <Typography variant="h6" color="primary.main">
                {formatCurrency(payrollPeriod.total_net)}
              </Typography>
            </Grid>

            {/* Metadata */}
            {/* @ts-expect-error - MUI Grid types issue */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">
                {formatDate(payrollPeriod.created_at)}
              </Typography>
              {payrollPeriod.creator && (
                <Typography variant="body2" color="text.secondary">
                  by {payrollPeriod.creator.first_name}{" "}
                  {payrollPeriod.creator.last_name}
                </Typography>
              )}
            </Grid>

            {payrollPeriod.processed_at && (
              <>
                {/* @ts-expect-error - MUI Grid types issue */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Processed
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(payrollPeriod.processed_at)}
                  </Typography>
                </Grid>
              </>
            )}

            {payrollPeriod.approved_at && (
              <>
                {/* @ts-expect-error - MUI Grid types issue */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Approved
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(payrollPeriod.approved_at)}
                  </Typography>
                  {payrollPeriod.approver && (
                    <Typography variant="body2" color="text.secondary">
                      by {payrollPeriod.approver.first_name}{" "}
                      {payrollPeriod.approver.last_name}
                    </Typography>
                  )}
                </Grid>
              </>
            )}
          </Grid>

          {/* Description */}
          {payrollPeriod.description && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Description
                </Typography>
                <Typography variant="body1">
                  {payrollPeriod.description}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
