"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { useAuth, hasRole } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LoadingSpinner } from "@/components/common";

// Optionally, pages inside this layout can rely on future per-route RBAC.
const ALLOWED_ROLES: string[] | undefined = undefined;

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, user, role } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      }
    }
  }, [loading, user, router]);

  if (loading) return <LoadingSpinner fullScreen message="Loading..." />;
  if (!user) return null;

  if (!hasRole(role, ALLOWED_ROLES)) {
    router.replace("/403");
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: "0rem",
          minHeight: "100vh",
        }}
      >
        <Breadcrumbs />
        {children}
      </Box>
    </Box>
  );
}
