import React from "react";

const PageHeader = ({ title, subtitle, actions }) => (
  <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      {title && (
        <h1 className="text-xl mb-2 font-semibold text-slate-900">{title}</h1>
      )}
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </header>
);

export default PageHeader;
