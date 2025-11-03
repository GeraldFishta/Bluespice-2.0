// app/(private)/payroll/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PayrollPeriodList } from "@/components/payroll";
import { PERMISSIONS } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AccessDenied } from "@/components/common";

type StatusTab = "all" | "draft" | "processing" | "approved" | "paid";

export default function PayrollPage() {
  const router = useRouter();
  const [statusTab, setStatusTab] = useState<StatusTab>("all");

  const { hasAccess } = usePermissions(PERMISSIONS.PAYROLL_VIEW);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  const handleCreateClick = () => {
    router.push("/payroll/add");
  };

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: StatusTab
  ) => {
    setStatusTab(newValue);
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
                Payroll Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage payroll periods and employee compensation
              </Typography>
            </Box>

            {hasAccess && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
                size="large"
              >
                Create Payroll Period
              </Button>
            )}
          </Stack>
        </Box>

        {/* Status Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={statusTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="All Periods" value="all" />
            <Tab label="Draft" value="draft" />
            <Tab label="Processing" value="processing" />
            <Tab label="Approved" value="approved" />
            <Tab label="Paid" value="paid" />
          </Tabs>
        </Paper>

        {/* Payroll Periods List */}
        <PayrollPeriodList
          status={statusTab}
          onCreateClick={hasAccess ? handleCreateClick : undefined}
        />
      </Box>
    </Container>
  );
}
