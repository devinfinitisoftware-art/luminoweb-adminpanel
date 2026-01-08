import React from "react";
import clsx from "clsx";

const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const LoadingSpinner = ({ label, size = "lg", className, showLabel = true }) => {
  // If className includes h-screen, it's a full-page spinner (keep original behavior)
  const isFullPage = className?.includes("h-screen");
  
  if (isFullPage) {
    return (
      <div
        className={clsx(
          "flex h-screen flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#FFE9D6] via-[#FFD6EA] to-[#FFE4F5] text-slate-600",
          className
        )}
      >
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-white/60" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
        </div>
        {label && <div className="text-sm font-medium text-slate-700">{label}</div>}
      </div>
    );
  }

  // Inline spinner for components
  return (
    <div className={clsx("flex flex-col items-center justify-center gap-2", className)}>
      <div className={clsx("relative", sizeClasses[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
      </div>
      {showLabel && label && <div className="text-xs font-medium text-slate-600">{label}</div>}
    </div>
  );
};

export default LoadingSpinner;
