import React from "react";
import StatusPill from "../ui/shared/StatusPill";

const statusConfig = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "danger" },
};

const ActivityStatusBadge = ({ status }) => {
  const config = statusConfig[status] ?? {
    label: status || "Unknown",
    variant: "neutral",
  };

  return <StatusPill variant={config.variant}>{config.label}</StatusPill>;
};

export default ActivityStatusBadge;
