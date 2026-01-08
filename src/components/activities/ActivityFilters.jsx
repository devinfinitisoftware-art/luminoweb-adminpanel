import React from "react";
import { FiSearch } from "react-icons/fi";
import Button from "../ui/shared/Button";
import SelectField from "../ui/shared/SelectField";

const statusOptions = [
  { value: "all", label: "Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const ActivityFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onAddActivity,
}) => {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Search input */}
      <div className="relative w-full md:max-w-xs">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <FiSearch className="text-sm" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-300"
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* Status filter */}
        <SelectField
          size="xs"
          className="min-w-[120px]"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
        />

        {/* Add button */}
        <Button
          size="sm"
          variant="primary"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-600"
          onClick={onAddActivity}
        >
          Add Activity
        </Button>
      </div>
    </div>
  );
};

export default ActivityFilters;
