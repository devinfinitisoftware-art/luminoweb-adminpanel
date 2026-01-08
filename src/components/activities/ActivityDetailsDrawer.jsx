import React from "react";
import ActivityForm from "./ActivityForm";

const ActivityDetailsDrawer = ({
  open,
  mode = "create",
  initialValues,
  onClose,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right-side panel */}
      <div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white p-5 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              Activities &gt;{" "}
              {mode === "create" ? "Add New Activity" : "Edit Activity"}
            </div>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              {mode === "create" ? "Add New Activity" : "Edit Activity"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow hover:bg-white"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <ActivityForm
          mode={mode}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default ActivityDetailsDrawer;
