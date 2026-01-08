import React from "react";
import clsx from "clsx";

/**
 * Generic table wrapper.
 * columns: [{ key, header, className, render?: (row) => ReactNode }]
 */
const DataTable = ({ columns, data, emptyMessage = "No data", rowKey }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
      <table className="min-w-full text-left text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  "px-4 py-2 first:pl-4 last:pr-4",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-center text-xs text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {data.map((row, idx) => (
            <tr
              key={rowKey ? rowKey(row) : idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={clsx(
                    "px-4 py-3 first:pl-4 last:pr-4 text-slate-800",
                    col.cellClassName
                  )}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
