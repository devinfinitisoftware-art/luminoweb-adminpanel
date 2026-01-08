import React from "react";
import Card from "../ui/shared/Card";
import StatusPill from "../ui/shared/StatusPill";
import IconButton from "../ui/shared/IconButton";
import ConfirmDialog from "../ui/shared/ConfirmDialog";
import TablePagination from "../ui/shared/TablePagination";
import {
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiPlus,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";

const statusConfig = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "danger" },
};


const ActivityOverviewTable = ({
  activities = [],
  onRowClick,
  onDelete,
  onEdit,
  onAdd,
  onToggleStatus,
}) => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [pageSize, setPageSize] = React.useState(8);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleRowClickInternal = (activity) => {
    onRowClick?.(activity);
  };

  const handleDeleteClick = (e, activity) => {
    e.stopPropagation();
    setDeleteTarget(activity);
    setConfirmOpen(true);
  };

  const handleEditClick = (e, activity) => {
    e.stopPropagation();
    onEdit?.(activity);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const deleted = deleteTarget;
    setDeleteTarget(null);
    setConfirmOpen(false);
    onDelete?.(deleted);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleAddClick = () => onAdd?.();

  // ---------- filtering ----------
  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = activities.filter((row) => {
    const matchesSearch =
      !normalizedSearch ||
      row.name.toLowerCase().includes(normalizedSearch) ||
      row.category.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" ? true : row.status === statusFilter;

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

  return (
    <Card className="rounded-2xl p-4 shadow-sm">
      {/* Title */}
      <div className="mb-3 text-sm font-semibold text-slate-800">Overview</div>

      {/* Top controls row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input (full-width on left) */}
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

        {/* Right controls: Status pill + Add Activity button */}
        <div className="flex items-center justify-end gap-2">
          {/* Status filter styled like the design (icon + label + chevron) */}
          <div className="relative">
            <FiFilter className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-xl border border-slate-200 bg-white pl-7 pr-7 py-2 text-xs font-medium text-slate-600 shadow-sm focus:border-emerald-400 focus:outline-none"
            >
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" />
          </div>

          {/* Add Activity button */}
          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black"
          >
            <FiPlus className="text-sm" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
              <th className="py-2 pr-4">Activity Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Age Group</th>
              <th className="px-4 py-2">Avg Rating</th>
              <th className="px-4 py-2">Completed</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((activity) => {
              const meta = statusConfig[activity.status] || statusConfig.active;

              return (
                <tr
                  key={activity.id}
                  className="cursor-pointer border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/60"
                  onClick={() => handleRowClickInternal(activity)}
                >
                  <td className="py-3 pr-4 text-slate-800">{activity.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {activity.category}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {activity.ageGroup}
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    {typeof activity.avgRating === "number"
                      ? activity.avgRating.toFixed(1)
                      : activity.avgRating}
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    {typeof activity.completed === "number"
                      ? activity.completed.toLocaleString()
                      : activity.completed}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(activity)}
                      className="focus:outline-none"
                    >
                      <StatusPill variant={meta.variant}>
                        {meta.label}
                      </StatusPill>
                    </button>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end gap-2">
                      <IconButton
                        aria-label="Delete activity"
                        size="sm"
                        variant="ghost-danger"
                        onClick={(e) => handleDeleteClick(e, activity)}
                      >
                        <FiTrash2 />
                      </IconButton>
                      <IconButton
                        aria-label="Edit activity"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleEditClick(e, activity)}
                      >
                        <FiEdit2 />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}

            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-xs text-slate-400"
                >
                  No activities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom pagination bar */}
      <TablePagination
        pageSize={pageSize}
        pageSizeOptions={[8, 12, 16]}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Activity?"
        description="Are you sure you want to delete this activity? All data related to it, including resources and links, will be removed."
        confirmLabel="Delete Activity"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Card>
  );
};

export default ActivityOverviewTable;
