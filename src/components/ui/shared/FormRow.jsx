import React from "react";

const FormRow = ({ label, description, children }) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
    <div className="w-full sm:max-w-xs">
      {label && (
        <div className="text-[11px] font-medium text-slate-700">{label}</div>
      )}
      {description && (
        <div className="mt-0.5 text-[11px] text-slate-500">{description}</div>
      )}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

export default FormRow;
