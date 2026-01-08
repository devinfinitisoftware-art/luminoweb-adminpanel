import React from "react";
import Modal from "../ui/shared/Modal";
import CommunityForm from "./CommunityForm";

const CommunityFormModal = ({
  open,
  mode = "create", // "create" | "edit"
  initialValues,
  onSubmit,
  onClose,
}) => {
  const isCreate = mode === "create";

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl bg-white/95 p-5 shadow-xl sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              Community &gt; {isCreate ? "Add New Community" : "Edit Community"}
            </div>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              {isCreate ? "Add New Community" : "Edit Community"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Form container (card look like the others) */}
        <div className="rounded-2xl bg-white/95 p-4 shadow-sm">
          <CommunityForm
            key={initialValues?.id || 'create'}
            mode={mode}
            initialValues={initialValues || {}}
            onSubmit={(values) => {
              onSubmit?.(values);
            }}
            onCancel={handleClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CommunityFormModal;
