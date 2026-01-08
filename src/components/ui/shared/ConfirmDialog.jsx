import React from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Delete Activity",
  cancelLabel = "Cancel",
  confirmVariant = "danger", // 'primary' | 'danger'
  onConfirm,
  onCancel,
  disabled = false,
  loading = false,
}) => {
  if (!open) return null;

  const isDanger = confirmVariant === "danger";

  return (
    <Modal open={open} onClose={onCancel}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        {/* Header + icon */}
        <div className="flex items-start justify-between">
          <div>
            {/* Icon badge */}
            <div
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
                isDanger
                  ? "bg-rose-50 text-rose-500"
                  : "bg-emerald-50 text-emerald-500"
              }`}
            >
              <FiTrash2 className="text-lg" />
            </div>

            {/* Title + description */}
            {title && (
              <h3 className="text-sm font-semibold text-slate-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {description}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX />
          </button>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          {/* Delete (left in screenshot) */}
          <Button
            type="button"
            variant={isDanger ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={disabled || loading}
            className="w-full rounded-xl py-2 text-[11px] font-semibold sm:w-40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : confirmLabel}
          </Button>

          {/* Cancel (right, outline / white) */}
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 sm:w-40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
