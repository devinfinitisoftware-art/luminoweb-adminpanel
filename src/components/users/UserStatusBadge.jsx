import React from "react";
import StatusPill from "../ui/shared/StatusPill";

const statusConfig = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "danger" },
};

const UserStatusBadge = ({ status }) => {
  const config = statusConfig[status] ?? {
    label: status || "Unknown",
    variant: "neutral",
  };

  return <StatusPill variant={config.variant}>{config.label}</StatusPill>;
};

export default UserStatusBadge;
