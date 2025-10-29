"use client";
import { usePathname } from "next/navigation";
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import { findNavItemByPath } from "@/lib/navigation";
import NextLink from "next/link";

export function Breadcrumbs() {
  const pathname = usePathname();
  const navItem = findNavItemByPath(pathname || "");

  if (!navItem) return null;

  const paths = pathname?.split("/").filter(Boolean) || [];
  const breadcrumbItems = paths.map((segment, index) => {
    const path = "/" + paths.slice(0, index + 1).join("/");
    const item = findNavItemByPath(path);
    return {
      path,
      label: item?.label || segment,
      isLast: index === paths.length - 1,
    };
  });

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {breadcrumbItems.map((item, index) =>
        item.isLast ? (
          <Typography key={item.path} color="text.primary">
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.path}
            component={NextLink}
            href={item.path}
            color="inherit"
          >
            {item.label}
          </Link>
        )
      )}
    </MuiBreadcrumbs>
  );
}
