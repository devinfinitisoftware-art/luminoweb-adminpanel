import React from "react";
import { FiX } from "react-icons/fi";
import Modal from "../ui/shared/Modal";
import ActivityForm from "./ActivityForm";

const ActivityFormModal = ({
  open,
  mode = "create", // "create" | "edit"
  initialValues,
  onClose,
  onSubmit,
}) => {
  const title = mode === "edit" ? "Edit Activity" : "Add New Activity";

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="
          w-full max-w-lg sm:max-w-xl lg:max-w-2xl
          max-h-[95vh]
          overflow-y-auto no-scrollbar
          rounded-3xl
          border border-white/40
          bg-gradient-to-b from-[#FFE9D6] via-[#FFD6EA] to-[#FFE4F5]
          p-4 sm:p-6
          shadow-[0_18px_45px_rgba(15,23,42,0.25)]
        "
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              Activities &gt; <span className="text-slate-600">{title}</span>
            </div>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[13px] text-slate-500 shadow-sm hover:bg-white hover:text-slate-700"
          >
            <FiX />
          </button>
        </div>

        {/* Form area */}
        <div className="pb-2">
          <ActivityForm
            mode={mode}
            initialValues={initialValues}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ActivityFormModal;
