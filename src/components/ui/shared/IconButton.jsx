import React from "react";
import clsx from "clsx";

const sizeClasses = {
  xs: "h-7 w-7 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-9 w-9 text-base",
};

const variantClasses = {
  ghost:
    "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  "ghost-danger":
    "bg-transparent text-rose-500 hover:bg-rose-50 hover:text-rose-600",
};

const IconButton = ({
  as = "button",
  size = "sm",
  variant = "ghost",
  className,
  children,
  ...rest
}) => {
  const Component = as;
  // Check if className contains custom color overrides (text-* or hover:text-*)
  const hasCustomColor = className && (
    className.includes('text-green') || 
    className.includes('text-red') || 
    className.includes('text-blue') ||
    className.includes('text-emerald') ||
    className.includes('text-rose') ||
    className.includes('hover:text-green') ||
    className.includes('hover:text-red')
  );
  
  return (
    <Component
      className={clsx(
        "inline-flex items-center justify-center rounded-full transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50",
        sizeClasses[size],
        !hasCustomColor && variantClasses[variant],
        hasCustomColor && "bg-transparent", // Still apply transparent background
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default IconButton;
