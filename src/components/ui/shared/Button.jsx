import React from "react";
import clsx from "clsx";

const baseClasses =
  "cursor-pointer inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition";

const sizeClasses = {
  xs: "text-[11px] px-2.5 py-1.5",
  sm: "text-xs px-3 py-2",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

const variantClasses = {
  primary:
    "bg-emerald-400 text-slate-900 hover:bg-emerald-500 ring-offset-slate-50",
  secondary: "bg-slate-900 text-white hover:bg-slate-950 ring-offset-slate-50",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 ring-offset-slate-50",
  danger: "bg-rose-500 text-white hover:bg-rose-600 ring-offset-slate-50",
};

const Button = ({
  type = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}) => (
  <button
    type={type}
    className={clsx(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
