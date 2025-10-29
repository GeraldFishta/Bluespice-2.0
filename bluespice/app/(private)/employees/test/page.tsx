// app/(private)/employees/test/page.tsx
"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  CheckCircle,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useEmployees } from "@/hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { LoadingSpinner } from "@/components/common";

interface TestResult {
  operation: string;
  success: boolean;
  message: string;
  timestamp: Date;
}

export default function EmployeeTestPage() {
  const { employees, isLoading, mutate, deleteEmployee } = useEmployees();
  const { hasAccess: canCreate } = usePermissions(PERMISSIONS.EMPLOYEES_CREATE);
  const { hasAccess: canUpdate } = usePermissions(PERMISSIONS.EMPLOYEES_UPDATE);
  const { hasAccess: canDelete } = usePermissions(PERMISSIONS.EMPLOYEES_DELETE);

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [testMode, setTestMode] = useState<"create" | "edit" | null>(null);

  const addTestResult = (
    operation: string,
    success: boolean,
    message: string
  ) => {
    setTestResults((prev) => [
      { operation, success, message, timestamp: new Date() },
      ...prev,
    ]);
  };

  const handleDeleteTest = async (id: string) => {
    try {
      addTestResult("DELETE", true, `Deleting employee ${id}...`);
      const result = await deleteEmployee(id);

      if (result.success) {
        addTestResult("DELETE", true, `Employee deleted successfully!`);
        await mutate(); // Refresh list
      } else {
        addTestResult(
          "DELETE",
          false,
          `Failed: ${result.error || "Unknown error"}`
        );
      }
    } catch (error: any) {
      addTestResult(
        "DELETE",
        false,
        `Error: ${error.message || "Unknown error"}`
      );
    }
  };

  const handleRefreshList = async () => {
    try {
      addTestResult("READ", true, "Refreshing employee list...");
      await mutate();
      addTestResult("READ", true, `Loaded ${employees.length} employees`);
    } catch (error: any) {
      addTestResult(
        "READ",
        false,
        `Error: ${error.message || "Unknown error"}`
      );
    }
  };

  if (isLoading && employees.length === 0) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Employee CRUD Test Page
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is a test page to verify the complete Employee CRUD flow and
        database communication. Monitor the test results panel below to see
        operation status.
      </Alert>

      <Grid container spacing={3}>
        {/* Controls Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Test Controls
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setTestMode("create");
                  setSelectedEmployee(null);
                  addTestResult("CREATE", true, "Create form opened");
                }}
                disabled={!canCreate}
                fullWidth
              >
                Test Create Employee
              </Button>

              <Button variant="outlined" onClick={handleRefreshList} fullWidth>
                Refresh List
              </Button>

              <Divider />

              <Typography variant="body2" color="text.secondary">
                <strong>Current Employees:</strong> {employees.length}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Permissions:</strong>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={`Create: ${canCreate ? "✓" : "✗"}`}
                  color={canCreate ? "success" : "default"}
                  size="small"
                />
                <Chip
                  label={`Update: ${canUpdate ? "✓" : "✗"}`}
                  color={canUpdate ? "success" : "default"}
                  size="small"
                />
                <Chip
                  label={`Delete: ${canDelete ? "✓" : "✗"}`}
                  color={canDelete ? "success" : "default"}
                  size="small"
                />
              </Stack>
            </Stack>
          </Paper>

          {/* Test Results */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Test Results
            </Typography>
            <Stack spacing={1} sx={{ maxHeight: 400, overflowY: "auto" }}>
              {testResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No test results yet. Start testing operations to see results.
                </Typography>
              ) : (
                testResults.map((result, index) => (
                  <Alert
                    key={index}
                    severity={result.success ? "success" : "error"}
                    icon={result.success ? <CheckCircle /> : <ErrorIcon />}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      [{result.operation}] {result.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {result.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Alert>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Form Panel */}
        <Grid item xs={12} md={8}>
          {testMode === "create" && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Test Create Employee
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Note: Creating an employee requires a valid profile_id. The form
                will show an error if profile creation is needed first.
              </Alert>
              <EmployeeForm
                onSuccess={() => {
                  addTestResult(
                    "CREATE",
                    true,
                    "Form submitted successfully - check EmployeeForm for actual result"
                  );
                  mutate(); // Refresh list
                  setTestMode(null);
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  setTestMode(null);
                  addTestResult("CREATE", true, "Create form cancelled");
                }}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            </Paper>
          )}

          {testMode === "edit" && selectedEmployee && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Test Edit Employee
              </Typography>
              <EmployeeForm
                employee={
                  employees.find((e) => e.id === selectedEmployee) || null
                }
                onSuccess={() => {
                  addTestResult(
                    "UPDATE",
                    true,
                    "Form submitted successfully - check EmployeeForm for actual result"
                  );
                  mutate(); // Refresh list
                  setTestMode(null);
                  setSelectedEmployee(null);
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  setTestMode(null);
                  setSelectedEmployee(null);
                  addTestResult("UPDATE", true, "Edit form cancelled");
                }}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            </Paper>
          )}

          {!testMode && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Employee List ({employees.length} employees)
              </Typography>
              <Stack spacing={2}>
                {employees.length === 0 ? (
                  <Alert severity="info">
                    No employees found. Try creating one using the "Test Create
                    Employee" button.
                  </Alert>
                ) : (
                  employees.slice(0, 10).map((employee) => (
                    <Card key={employee.id} variant="outlined">
                      <CardContent>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {employee.profile?.first_name}{" "}
                              {employee.profile?.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {employee.employee_id} | Email:{" "}
                              {employee.profile?.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Salary: €{employee.salary} | Status:{" "}
                              {employee.status}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            {canUpdate && (
                              <Button
                                size="small"
                                startIcon={<Edit />}
                                onClick={() => {
                                  setSelectedEmployee(employee.id);
                                  setTestMode("edit");
                                  addTestResult(
                                    "UPDATE",
                                    true,
                                    `Edit form opened for ${employee.employee_id}`
                                  );
                                }}
                              >
                                Edit
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                size="small"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteTest(employee.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
