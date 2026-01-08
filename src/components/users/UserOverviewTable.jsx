import React from "react";
import Card from "../ui/shared/Card";
import IconButton from "../ui/shared/IconButton";
import Button from "../ui/shared/Button";
import TablePagination from "../ui/shared/TablePagination";
import { FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import UserStatusBadge from "./UserStatusBadge";
import { exportCsvFromObjects } from "../../utils/csv";

const UserOverviewTable = ({
  users = [],
  onEdit,
  onDelete,
  onStatusClick,
  onRowClick,
}) => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [pageSize, setPageSize] = React.useState(8);
  const [currentPage, setCurrentPage] = React.useState(1);

  // ---------- CSV export ----------
  const handleExport = () => {
    const columns = [
      { key: "parentName", label: "Parent Name" },
      { key: "email", label: "Email" },
      { key: "childNames", label: "Child Name(s)" },
      { key: "childAge", label: "Child Age" },
      { key: "role", label: "Role" },
      { key: "lastActive", label: "Last Active" },
      { key: "status", label: "Status" },
    ];

    const rows = users.map((u) => ({
      parentName: u.parentName,
      email: u.email,
      childNames: u.childNames,
      childAge: u.childAge,
      role: u.role,
      lastActive: u.lastActive,
      status: u.status,
    }));

    exportCsvFromObjects(rows, columns, "users.csv");
  };

  // ---------- filtering ----------
  const normalizedSearch = search.trim().toLowerCase();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !normalizedSearch ||
      u.parentName.toLowerCase().includes(normalizedSearch) ||
      u.email.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" ? true : u.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = filteredUsers.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <Card className="rounded-2xl bg-white/90 p-4 shadow-sm">
      {/* Header title */}
      <div className="mb-3 text-sm font-semibold text-slate-800">Overview</div>

      {/* Top controls: search + status filter + export (small) */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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

        {/* Right controls */}
        <div className="flex items-center justify-end gap-2">
          {/* Status filter dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-7 text-xs text-slate-600 shadow-sm focus:border-emerald-400 focus:outline-none"
            >
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              ▼
            </span>
          </div>

          {/* Tiny Export button (optional, not in Figma but handy) */}
          <Button size="xs" variant="ghost" onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
              <th className="py-2 pl-4 pr-4">Parent Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Child Name(s)</th>
              <th className="px-4 py-2">Child Age</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Last Active</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((user, idx) => (
              <tr
                key={user.id}
                className={`border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/60 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                } ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick && onRowClick(user)}
              >
                <td className="py-3 pl-4 pr-4 text-[11px] text-slate-800">
                  {user.parentName}
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{user.childNames}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{user.childAge}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{user.role}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{user.lastActive}</td>

                {/* Status pill with dropdown chevron */}
                <td
                  className="px-4 py-3"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onStatusClick && onStatusClick(user)}
                    className="cursor-pointer inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[10px] font-medium hover:bg-slate-100"
                  >
                    <UserStatusBadge status={user.status} />
                  </button>
                </td>

                {/* Actions */}
                <td
                  className="px-4 py-3"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="flex justify-end gap-2">
                    <IconButton
                      aria-label="Delete user"
                      size="sm"
                      variant="ghost-danger"
                      onClick={() => onDelete && onDelete(user)}
                    >
                      <FiTrash2 />
                    </IconButton>
                    <IconButton
                      aria-label="Edit user"
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit && onEdit(user)}
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
                  colSpan={8}
                  className="py-6 text-center text-[11px] text-slate-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom pagination bar – same component as other tables */}
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

export default UserOverviewTable;
