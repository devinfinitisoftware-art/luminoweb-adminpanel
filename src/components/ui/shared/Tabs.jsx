import React from "react";
import clsx from "clsx";

export const Tabs = ({ value, onChange, children, className }) => (
  <div
    className={clsx(
      "inline-flex rounded-2xl bg-white/70 p-1 shadow-sm",
      className
    )}
  >
    {React.Children.map(children, (child) =>
      React.cloneElement(child, {
        isActive: child.props.value === value,
        onSelect: () => onChange?.(child.props.value),
      })
    )}
  </div>
);

export const Tab = ({ label, isActive, onSelect }) => (
  <button
    type="button"
    className={clsx(
      "rounded-2xl px-4 py-2 text-xs font-semibold transition",
      isActive
        ? "bg-emerald-400 text-slate-900 shadow"
        : "text-slate-500 hover:bg-slate-50"
    )}
    onClick={onSelect}
  >
    {label}
  </button>
);

export default Tabs;
