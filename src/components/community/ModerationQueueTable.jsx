import React from "react";
import { FiSearch } from "react-icons/fi";
import IconButton from "../ui/shared/IconButton";
import StatusPill from "../ui/shared/StatusPill";
import SelectField from "../ui/shared/SelectField";
import TablePagination from "../ui/shared/TablePagination";
import LoadingSpinner from "../ui/shared/LoadingSpinner";
import api from "../../utils/api";
import { FiTrash2 } from "react-icons/fi";

const defaultReports = [
  {
    id: "R-508",
    reportedBy: "Anna Mitchell",
    contentType: "Post (P-1029)",
    status: "resolved",
    date: "June 10, 2025",
  },
  {
    id: "R-512",
    reportedBy: "Haris Q.",
    contentType: "Comment",
    status: "pending",
    date: "June 12, 2025",
  },
  {
    id: "R-515",
    reportedBy: "Moderator",
    contentType: "Post (P-1018)",
    status: "deleted",
    date: "June 12, 2025",
  },
];

const statusConfig = {
  resolved: { label: "Resolved", variant: "success" },
  pending: { label: "Pending", variant: "neutral" },
  deleted: { label: "Deleted", variant: "danger" },
};

const statusOptions = [
  { value: "all", label: "Status" },
  { value: "resolved", label: "Resolved" },
  { value: "pending", label: "Pending" },
  { value: "deleted", label: "Deleted" },
];

const ModerationQueueTable = ({ communityId, items, onStatusClick, onDelete }) => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalItems, setTotalItems] = React.useState(0);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Fetch reports
  const fetchReports = React.useCallback(async () => {
    if (!communityId) return;

    try {
      setIsLoading(true);
      const response = await api.getCommunityReports(communityId, {
        page: currentPage,
        limit: pageSize,
        status: statusFilter === 'all' ? 'all' : statusFilter,
        search: search.trim() || '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.reports) {
        const mappedReports = response.reports.map((report) => ({
          id: report.id || report._id,
          _id: report._id,
          reportedBy: report.reportedBy || 'System',
          contentType: report.contentDetails || report.contentType || 'Unknown',
          status: report.status || 'pending',
          date: formatDate(report.date || report.createdAt),
          _original: report,
        }));

        setData(mappedReports);
        setTotalItems(response.total || 0);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setData([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [communityId, currentPage, pageSize, statusFilter, search]);

  // Fetch data
  React.useEffect(() => {
    if (items) {
      // Use provided items if available
      setData(items);
      setTotalItems(items.length);
      setIsLoading(false);
      return;
    }

    if (communityId) {
      fetchReports();
    }
  }, [communityId, items, fetchReports]);

  // Debounced search
  React.useEffect(() => {
    if (items || !communityId) return;
    
    const timeoutId = setTimeout(() => {
      fetchReports();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, communityId, fetchReports, items]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const renderStatus = (status, row) => {
    const meta = statusConfig[status] ?? {
      label: status || "Unknown",
      variant: "neutral",
    };

    return (
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-medium"
        onClick={() => onStatusClick?.(row)}
      >
        <StatusPill variant={meta.variant}>{meta.label}</StatusPill>
      </button>
    );
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4">
      {/* Header row */}
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          Reports Overview
        </h3>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full sm:max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <FiSearch className="text-sm" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Replies by user name, community name, or status..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            />
          </div>
          <SelectField
            size="xs"
            className="min-w-[120px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pl-4 pr-4">Post ID</th>
                <th className="px-4 py-2">Reported By</th>
                <th className="px-4 py-2">Content Type</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date Posted</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
              <tr
                key={row.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
              >
                <td className="py-3 pl-4 pr-4 text-slate-800">{row.id}</td>
                <td className="px-4 py-3 text-slate-600">{row.reportedBy}</td>
                <td className="px-4 py-3 text-slate-600">{row.contentType}</td>
                <td className="px-4 py-3">{renderStatus(row.status, row)}</td>
                <td className="px-4 py-3 text-slate-800">{row.date}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <IconButton
                      aria-label="Delete report"
                      size="sm"
                      variant="ghost-danger"
                      onClick={() => onDelete?.(row)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}

              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-xs text-slate-400"
                  >
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer pagination */}
      {!isLoading && (
        <TablePagination
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20]}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default ModerationQueueTable;
