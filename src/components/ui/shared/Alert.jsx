import React from "react";
import clsx from "clsx";

const variantClasses = {
  info: "bg-sky-50 text-sky-700 border-sky-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger: "bg-rose-50 text-rose-700 border-rose-100",
};

const Alert = ({ variant = "info", title, children, className }) => (
  <div
    className={clsx(
      "flex gap-3 rounded-xl border px-3 py-2 text-xs",
      variantClasses[variant],
      className
    )}
  >
    <div className="mt-0.5 text-base">•</div>
    <div>
      {title && <div className="font-semibold">{title}</div>}
      {children && <div className="mt-0.5">{children}</div>}
    </div>
  </div>
);

export default Alert;
