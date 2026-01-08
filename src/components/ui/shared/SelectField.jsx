import React from "react";
import clsx from "clsx";

const sizeClasses = {
  xs: "text-[11px] px-3 py-1.5",
  sm: "text-xs px-3 py-2",
  md: "text-sm px-3 py-2.5",
};

const variantClasses = {
  default:
    "border-slate-200 bg-white text-slate-800 focus:ring-emerald-300 focus:border-emerald-400",
  soft:
    "border-rose-100 bg-rose-50 text-slate-800 focus:ring-rose-200 focus:border-rose-200 shadow-sm",
};

const SelectField = ({
  label,
  hideLabel = false,
  options = [],
  size = "sm",
  variant = "default",
  className,
  selectClassName,
  error,
  ...rest
}) => {
  const id = rest.id || rest.name;

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      {label && !hideLabel && (
        <label htmlFor={id} className="text-[11px] font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={clsx(
            "w-full appearance-none rounded-xl border pr-8 focus:outline-none focus:ring-1",
            error
              ? "border-rose-300 focus:ring-rose-300 focus:border-rose-400"
              : variantClasses[variant] || variantClasses.default,
            sizeClasses[size],
            selectClassName
          )}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className={clsx(
            "pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px]",
            variant === "soft" ? "text-rose-400" : "text-slate-400"
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="h-3 w-3"
            fill="none"
          >
            <path
              d="M3 4.5 6 7.5l3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectField;
