import React from "react";
import Card from "./Card";

const ChartCard = ({
  title,
  subtitle,
  headerRight,
  children,
  className,
}) => (
  <Card className={`p-4 sm:p-5 ${className || ""}`}>
    {(title || subtitle || headerRight) && (
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {title && (
            <h3 className="truncate text-sm font-semibold text-slate-900">{title}</h3>
          )}
          {subtitle && (
            <span className="text-[11px] text-slate-500">{subtitle}</span>
          )}
        </div>
        {headerRight && (
          <div className="flex shrink-0 items-center">{headerRight}</div>
        )}
      </div>
    )}
    <div className="min-h-0 w-full">{children}</div>
  </Card>
);

export default ChartCard;
