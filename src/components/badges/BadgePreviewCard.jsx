import React from "react";
import Card from "../ui/shared/Card";
import StatusPill from "../ui/shared/StatusPill";

const BadgePreviewCard = ({ name, category, type, status, iconUrl }) => {
  const statusVariant =
    status === "active"
      ? "success"
      : status === "inactive"
      ? "danger"
      : "neutral";

  return (
    <Card className="flex items-center gap-3 rounded-2xl bg-white/90 px-3 py-3 shadow-sm">
      {/* Icon preview */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={name || "Badge icon"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[10px] font-medium text-slate-400">Icon</span>
        )}
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-xs font-semibold text-slate-900">
            {name || "Badge Title"}
          </div>
          <StatusPill variant={statusVariant}>
            {status ? status[0].toUpperCase() + status.slice(1) : "Status"}
          </StatusPill>
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
          {category && (
            <span className="rounded-full bg-slate-50 px-2 py-0.5">
              {category}
            </span>
          )}
          {type && (
            <span className="rounded-full bg-slate-50 px-2 py-0.5">{type}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BadgePreviewCard;
