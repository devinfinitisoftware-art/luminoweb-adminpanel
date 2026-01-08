import React from "react";
import Modal from "../ui/shared/Modal";
import BadgeForm from "./BadgeForm";

const BadgeFormModal = ({
  open,
  mode = "create", // "create" | "edit"
  initialValues,
  onSubmit,
  onClose,
}) => {
  const title = mode === "create" ? "Add New Badge" : "Edit Badge";

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl bg-gradient-to-b from-[#FFE3D4] via-[#FFE3F0] to-[#FFE5D4] p-5 shadow-xl sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-600">
              Badges &gt; {title}
            </div>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow hover:bg-white"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="pb-2">
          <BadgeForm
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

export default BadgeFormModal;
