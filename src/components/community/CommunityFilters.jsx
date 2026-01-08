import React from "react";
import { FiSearch } from "react-icons/fi";
import Button from "../ui/shared/Button";
import SelectField from "../ui/shared/SelectField";

const statusOptions = [
  { value: "all", label: "Status" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

const CommunityFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onAddCommunity,
}) => {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Search input */}
      <div className="relative w-full md:max-w-lg">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <FiSearch className="text-sm" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Name or category"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <SelectField
          size="xs"
          className="min-w-[120px]"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
        />

        <Button
          size="sm"
          variant="primary"
          className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-900"
          onClick={onAddCommunity}
        >
          Add Community
        </Button>
      </div>
    </div>
  );
};

export default CommunityFilters;
