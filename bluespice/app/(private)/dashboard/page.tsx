"use client";
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Paper,
} from "@mui/material";
import { People, Payment, Schedule, TrendingUp } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}

const StatCard = ({ icon, title, value, subtitle }: StatCardProps) => (
  <Card>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
      </Typography>

      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }}>
            <StatCard
              icon={<People color="primary" />}
              title="Employees"
              value="0"
              subtitle="Active employees"
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }}>
            <StatCard
              icon={<Payment color="success" />}
              title="Payroll"
              value="€0"
              subtitle="Total this month"
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }}>
            <StatCard
              icon={<Schedule color="info" />}
              title="Timesheets"
              value="0"
              subtitle="Pending approval"
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }}>
            <StatCard
              icon={<TrendingUp color="warning" />}
              title="Growth"
              value="0%"
              subtitle="This quarter"
            />
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box sx={{ flex: 2 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent activity yet. Start by adding employees or generating
                payroll.
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  • Add Employee
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Generate Payroll
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • View Reports
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
