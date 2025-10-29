// components/common/AccessDenied.tsx
import { Box, Paper, Typography, Button } from "@mui/material";
import { Lock } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export const AccessDenied = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        p: 3,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 500, textAlign: "center" }}>
        <Lock sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You don&apos;t have permission to access this resource.
        </Typography>
        <Button variant="contained" onClick={() => router.back()}>
          Go Back
        </Button>
      </Paper>
    </Box>
  );
};
