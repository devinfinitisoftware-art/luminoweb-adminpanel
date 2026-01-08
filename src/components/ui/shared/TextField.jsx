import React from "react";
import clsx from "clsx";

const TextField = ({
  label,
  hideLabel = false,
  helperText,
  error,
  className,
  inputClassName,
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
      <input
        id={id}
        className={clsx(
          "w-full rounded-xl border bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400",
          error
            ? "border-rose-300 focus:ring-rose-300 focus:border-rose-400"
            : "border-slate-200",
          inputClassName
        )}
        {...rest}
      />
      {helperText && !error && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default TextField;
