import React from "react";
import clsx from "clsx";

const variantClasses = {
  success: "bg-emerald-50 text-emerald-600 border-emerald-100",
  danger: "bg-rose-50 text-rose-600 border-rose-100",
  neutral: "bg-slate-50 text-slate-600 border-slate-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
};

const StatusPill = ({ variant = "neutral", children, className }) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium",
      variantClasses[variant],
      className
    )}
  >
    {children}
  </span>
);

export default StatusPill;
