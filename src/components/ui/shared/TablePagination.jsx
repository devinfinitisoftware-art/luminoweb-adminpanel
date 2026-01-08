import React from "react";

const buildPages = (currentPage, totalPages) => {
  const pages = [];

  if (totalPages <= 5) {
    for (let p = 1; p <= totalPages; p++) pages.push(p);
    return pages;
  }

  pages.push(1);
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("ellipsis-start");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push("ellipsis-end");

  pages.push(totalPages);
  return pages;
};

const TablePagination = ({
  pageSize,
  pageSizeOptions = [8],
  currentPage,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const [gotoValue, setGotoValue] = React.useState("");

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleGotoBlur = () => {
    const value = Number(gotoValue);
    if (!value) return;
    if (value >= 1 && value <= totalPages) {
      onPageChange(value);
    }
  };

  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="mt-4 flex flex-col items-center gap-3 text-[11px] text-slate-500 sm:flex-row sm:justify-between">
      {/* Left: page size + goto */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-[11px] focus:border-emerald-400 focus:outline-none"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span>Go to</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={gotoValue}
            onChange={(e) => setGotoValue(e.target.value)}
            onBlur={handleGotoBlur}
            className="h-7 w-12 rounded-lg border border-slate-200 bg-white px-1 text-center text-[11px] focus:border-emerald-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Middle: total items */}
      <div className="hidden sm:block">
        Total {totalItems} item{totalItems !== 1 ? "s" : ""}
      </div>

      {/* Right: pagination buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg border border-slate-200 bg-white text-[11px] text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {"<"}
        </button>

        {pages.map((item, idx) => {
          if (typeof item !== "number") {
            return (
              <span
                key={`${item}-${idx}`}
                className="inline-flex h-7 min-w-[1.75rem] items-center justify-center text-[11px] text-slate-400"
              >
                …
              </span>
            );
          }

          const isActive = item === currentPage;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg border text-[11px] ${
                isActive
                  ? "border-emerald-400 bg-emerald-400/10 text-emerald-600"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg border border-slate-200 bg-white text-[11px] text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
