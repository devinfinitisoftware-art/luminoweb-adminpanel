import React from "react";
import clsx from "clsx";

const PageContainer = ({ className, children }) => (
  <div
    className={clsx(
      // remove default white/gray background so the layout gradient shows through
      "text-slate-900",
      "px-3 py-4 sm:px-6 sm:py-6 lg:px-8",
      className
    )}
  >
    {children}
  </div>
);

export default PageContainer;
