import React from "react";
import Button from "./Button";

const Pagination = ({
  page,
  pageCount,
  onPageChange,
  pageSize,
  pageSizeOptions = [8, 16, 32],
  onPageSizeChange,
  totalItems,
}) => {
  const canPrev = page > 1;
  const canNext = page < pageCount;

  const go = (p) => {
    if (p < 1 || p > pageCount) return;
    onPageChange?.(p);
  };

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 text-[11px] text-slate-500 sm:flex-row">
      <div className="flex items-center gap-2">
        <select
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px]"
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} / page
            </option>
          ))}
        </select>
        <span>Go to</span>
        <input
          type="number"
          min={1}
          max={pageCount}
          className="h-7 w-10 rounded-lg border border-slate-200 bg-white px-1 text-center text-[11px]"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = Number(e.currentTarget.value);
              if (!Number.isNaN(value)) go(value);
            }
          }}
        />
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="xs"
          variant="ghost"
          className="px-2"
          disabled={!canPrev}
          onClick={() => go(page - 1)}
        >
          {"<"}
        </Button>
        <Button
          size="xs"
          variant="ghost"
          className="px-2"
          disabled={!canPrev}
          onClick={() => go(1)}
        >
          1
        </Button>
        {page > 3 && <span className="px-1 text-[11px] text-slate-400">…</span>}
        {page > 2 && (
          <Button
            size="xs"
            variant="ghost"
            className="px-2"
            onClick={() => go(page - 1)}
          >
            {page - 1}
          </Button>
        )}
        <Button
          size="xs"
          variant="primary"
          className="rounded-lg bg-emerald-400 px-3 text-[11px] text-slate-900"
        >
          {page}
        </Button>
        {page < pageCount - 1 && (
          <Button
            size="xs"
            variant="ghost"
            className="px-2"
            onClick={() => go(page + 1)}
          >
            {page + 1}
          </Button>
        )}
        {page < pageCount - 2 && (
          <span className="px-1 text-[11px] text-slate-400">…</span>
        )}
        {pageCount > 1 && (
          <Button
            size="xs"
            variant="ghost"
            className="px-2"
            disabled={!canNext}
            onClick={() => go(pageCount)}
          >
            {pageCount}
          </Button>
        )}
        <Button
          size="xs"
          variant="ghost"
          className="px-2"
          disabled={!canNext}
          onClick={() => go(page + 1)}
        >
          {">"}
        </Button>
      </div>

      {typeof totalItems === "number" && <div>Total {totalItems} items</div>}
    </div>
  );
};

export default Pagination;
