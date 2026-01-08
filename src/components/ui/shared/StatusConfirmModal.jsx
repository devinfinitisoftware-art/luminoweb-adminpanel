import React from "react";
import Modal from "./Modal";
import Button from "./Button";

/**
 * mode: "reactivate" | "suspend"
 * Optional title/description/labels let you reuse this for
 * Users, Communities, Posts, etc.
 */
const StatusConfirmModal = ({
  open,
  mode,
  title,
  description,
  primaryLabel,
  cancelLabel = "CANCEL",
  onConfirm,
  onCancel,
}) => {
  if (!open || !mode) return null;

  const isReactivate = mode === "reactivate";

  // Default copy (for accounts) – can be overridden via props
  const defaultTitle = isReactivate
    ? "Reactivate this account?"
    : "Suspend this account?";

  const defaultDescription = isReactivate
    ? "This user's account will be reactivated, restoring full access to the Luumilo app and all linked child profiles."
    : "Suspending this account will temporarily block the user from logging in or accessing any Luumilo features.";

  const defaultPrimaryLabel = isReactivate
    ? "REACTIVATE ACCOUNT"
    : "SUSPEND ACCOUNT";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalPrimaryLabel = primaryLabel || defaultPrimaryLabel;

  const primaryClasses = isReactivate
    ? "bg-emerald-400 text-slate-900 hover:bg-emerald-500"
    : "bg-rose-500 text-white hover:bg-rose-600";

  const iconBg = isReactivate
    ? "bg-emerald-50 text-emerald-500"
    : "bg-rose-50 text-rose-500";

  const iconSymbol = isReactivate ? "✓" : "⛔";

  return (
    <Modal open={open} onClose={onCancel}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        {/* Header + icon + copy */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}
            >
              <span className="text-lg font-bold">{iconSymbol}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {finalTitle}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {finalDescription}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Footer buttons */}
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            className={`w-full rounded-xl py-2 text-[11px] font-semibold sm:w-auto ${primaryClasses}`}
            onClick={onConfirm}
          >
            {finalPrimaryLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusConfirmModal;
