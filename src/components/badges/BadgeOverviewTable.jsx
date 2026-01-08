import React from "react";
import Card from "../ui/shared/Card";
import IconButton from "../ui/shared/IconButton";
import StatusPill from "../ui/shared/StatusPill";
import TablePagination from "../ui/shared/TablePagination";

import { FiTrash2, FiEdit2, FiSearch, FiPlus } from "react-icons/fi";
import { IoChevronDownSharp } from "react-icons/io5";

const statusConfig = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "danger" },
};

const BadgeStatusButton = ({ status, onClick }) => {
  const meta = statusConfig[status] ?? {
    label: status || "Unknown",
    variant: "neutral",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full bg-transparent px-0 py-0 text-[11px] font-medium"
    >
      <StatusPill variant={meta.variant}>{meta.label}</StatusPill>
    </button>
  );
};

const BadgeOverviewTable = ({
  badges = [],
  onEdit,
  onDelete,
  onToggleStatus,
  onAdd,
}) => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [pageSize, setPageSize] = React.useState(8);
  const [currentPage, setCurrentPage] = React.useState(1);

  // ---------- filtering ----------
  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = badges.filter((badge) => {
    const matchesSearch =
      !normalizedSearch ||
      badge.name?.toLowerCase().includes(normalizedSearch) ||
      badge.category?.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" ? true : badge.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleToggleStatus = (badge) => {
    const nextStatus = badge.status === "active" ? "inactive" : "active";
    onToggleStatus?.(badge.id, nextStatus);
  };

  const handleAddClick = () => onAdd?.();

  return (
    <Card className="rounded-2xl mt-3.5 bg-white/90 p-4 shadow-sm">
      {/* Title */}
      <div className="mb-3 text-sm font-semibold text-slate-800">Overview</div>

      {/* Top controls: search + status filter + add button */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="flex flex-1 items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
          <FiSearch className="mr-2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Name or Email"
            className="w-full border-none bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Status filter + Add badge button */}
        <div className="flex items-center justify-end gap-2">
          {/* Status dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-7 text-xs text-slate-600 shadow-sm focus:border-emerald-400 focus:outline-none"
            >
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              ▼
            </span>
          </div>

          {/* Add Badge button (black pill) */}
          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black"
          >
            <FiPlus className="text-sm" />
            <span>Add Badge</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
              <th className="py-2 pl-4 pr-4">Badge Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Earned By</th>
              <th className="px-4 py-2">Progress (%)</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((badge) => (
              <tr
                key={badge.id}
                className="border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/60"
              >
                <td className="py-3 pl-4 pr-4 text-slate-800">{badge.name}</td>
                <td className="px-4 py-3 text-slate-600">{badge.category}</td>
                <td className="px-4 py-3 text-slate-600">{badge.type}</td>
                <td className="px-4 py-3 text-slate-800">
                  {badge.earnedByUsers?.toLocaleString?.() ??
                    badge.earnedByUsers}
                </td>
                <td className="px-4 py-3 text-slate-800">
                  {typeof badge.progress === "number"
                    ? `${badge.progress}%`
                    : badge.progress}
                </td>
                <td className="px-4 py-3">
                  <BadgeStatusButton
                    status={badge.status}
                    onClick={() => handleToggleStatus(badge)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <IconButton
                      aria-label="Delete badge"
                      size="sm"
                      variant="ghost-danger"
                      onClick={() => onDelete?.(badge)}
                    >
                      <FiTrash2 />
                    </IconButton>
                    <IconButton
                      aria-label="Edit badge"
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit?.(badge)}
                    >
                      <FiEdit2 />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-xs text-slate-400"
                >
                  No badges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom pagination bar – same shared component as Activities table */}
      <TablePagination
        pageSize={pageSize}
        pageSizeOptions={[8, 12, 16]}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Card>
  );
};

export default BadgeOverviewTable;
