import React from "react";
import clsx from "clsx";

const TableToolbar = ({ left, right, className }) => (
  <div
    className={clsx(
      "mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
      className
    )}
  >
    <div className="flex flex-1 flex-wrap gap-2">{left}</div>
    <div className="flex flex-wrap items-center justify-end gap-2">{right}</div>
  </div>
);

export default TableToolbar;
