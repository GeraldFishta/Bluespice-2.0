// components/ui/DataTable.tsx
"use client";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box, Paper, Typography } from "@mui/material";
import { LoadingSpinner } from "@/components/common";

interface DataTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  rowsPerPageOptions?: number[];
  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  autoHeight?: boolean;
  height?: number | string;
  onRowClick?: (params: any) => void;
  emptyMessage?: string;
  [key: string]: any; // Allow additional DataGrid props
}

export function DataTable({
  rows,
  columns,
  loading = false,
  pageSize = 25,
  rowsPerPageOptions = [10, 25, 50, 100],
  checkboxSelection = false,
  disableSelectionOnClick = true,
  autoHeight = false,
  height = 400,
  onRowClick,
  emptyMessage = "No data found",
  ...props
}: DataTableProps) {
  const hasData = rows && rows.length > 0;

  return (
    <Paper sx={{ height: autoHeight ? "auto" : height, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick={disableSelectionOnClick}
        onRowClick={onRowClick}
        sx={{
          border: 0,
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #e0e0e0",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            fontWeight: 600,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "action.hover",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
        components={{
          LoadingOverlay: () => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <LoadingSpinner />
            </Box>
          ),
          NoRowsOverlay: () => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {emptyMessage}
              </Typography>
            </Box>
          ),
        }}
        {...props}
      />
    </Paper>
  );
}
