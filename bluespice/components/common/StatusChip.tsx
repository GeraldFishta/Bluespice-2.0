// components/common/StatusChip.tsx
import { Chip, ChipProps } from "@mui/material";
import { CheckCircle, Cancel, Pending, Error } from "@mui/icons-material";

type StatusType = "active" | "inactive" | "pending" | "approved" | "rejected";

interface StatusChipProps extends Omit<ChipProps, "color" | "icon"> {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<
  StatusType,
  { label: string; color: ChipProps["color"]; icon: React.ReactElement }
> = {
  active: {
    label: "Active",
    color: "success",
    icon: <CheckCircle />,
  },
  inactive: {
    label: "Inactive",
    color: "default",
    icon: <Cancel />,
  },
  pending: {
    label: "Pending",
    color: "warning",
    icon: <Pending />,
  },
  approved: {
    label: "Approved",
    color: "success",
    icon: <CheckCircle />,
  },
  rejected: {
    label: "Rejected",
    color: "error",
    icon: <Error />,
  },
};

export const StatusChip = ({
  status,
  label,
  ...chipProps
}: StatusChipProps) => {
  const config = statusConfig[status];

  return (
    <Chip
      label={label || config.label}
      color={config.color}
      icon={config.icon}
      size="small"
      {...chipProps}
    />
  );
};
