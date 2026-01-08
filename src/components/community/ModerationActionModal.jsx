import React from "react";
import Modal from "../ui/shared/Modal";
import Button from "../ui/shared/Button";
import { FiCheckCircle, FiAlertTriangle, FiTrash2 } from "react-icons/fi";

const ACTION_CONFIG = {
  reactivate_community: {
    icon: FiCheckCircle,
    iconVariant: "success",
    title: "Reactivate this community?",
    description:
      "This community will become active again. Members can view posts and share new activities.",
    primaryLabel: "REACTIVATE COMMUNITY",
    primaryVariant: "primary",
  },
  suspend_community: {
    icon: FiAlertTriangle,
    iconVariant: "danger",
    title: "Suspend this community?",
    description:
      "Suspending this community will hide it from users and pause new posts or comments. Existing content will remain safe.",
    primaryLabel: "SUSPEND COMMUNITY",
    primaryVariant: "danger",
  },
  activate_post: {
    icon: FiCheckCircle,
    iconVariant: "success",
    title: "Make this post visible again?",
    description:
      "The post will reappear in the community feed for all members.",
    primaryLabel: "ACTIVATE POST",
    primaryVariant: "primary",
  },
  flag_post: {
    icon: FiAlertTriangle,
    iconVariant: "danger",
    title: "Flag this post for review?",
    description:
      "Flagged posts are moved to the reports section for moderator review. The author will not be notified.",
    primaryLabel: "FLAG POST",
    primaryVariant: "danger",
  },
  delete_post: {
    icon: FiTrash2,
    iconVariant: "danger",
    title: "Delete this post permanently?",
    description:
      "This post and all associated comments will be permanently removed from the community. This action cannot be undone.",
    primaryLabel: "DELETE POST",
    primaryVariant: "danger",
  },
  resolve_report: {
    icon: FiCheckCircle,
    iconVariant: "success",
    title: "Resolve this report?",
    description:
      "This report will be marked as resolved and moved to the reviewed section.",
    primaryLabel: "RESOLVE REPORT",
    primaryVariant: "primary",
  },
  delete_report: {
    icon: FiTrash2,
    iconVariant: "danger",
    title: "Delete this report?",
    description:
      "The report record will be permanently removed. The related content will remain unchanged.",
    primaryLabel: "DELETE REPORT",
    primaryVariant: "danger",
  },
  activate_comment: {
    icon: FiCheckCircle,
    iconVariant: "success",
    title: "Show this comment again?",
    description: "This comment will become visible to all community members.",
    primaryLabel: "ACTIVATE COMMENT",
    primaryVariant: "primary",
  },
  delete_comment: {
    icon: FiTrash2,
    iconVariant: "danger",
    title: "Delete this comment permanently?",
    description:
      "This comment will be permanently removed from the post. The action cannot be undone.",
    primaryLabel: "DELETE COMMENT",
    primaryVariant: "danger",
  },
};

const iconBgClasses = {
  success: "bg-emerald-50 text-emerald-500",
  danger: "bg-rose-50 text-rose-500",
};

const ModerationActionModal = ({ open, actionType, onConfirm, onCancel }) => {
  if (!open || !actionType) return null;

  const cfg = ACTION_CONFIG[actionType];
  if (!cfg) return null;

  const Icon = cfg.icon;
  const iconClasses =
    iconBgClasses[cfg.iconVariant] || "bg-slate-100 text-slate-500";

  return (
    <Modal open={open} onClose={onCancel}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${iconClasses}`}
            >
              <Icon className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {cfg.title}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {cfg.description}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            onClick={onCancel}
          >
            CANCEL
          </Button>
          <Button
            variant={cfg.primaryVariant}
            className={`w-full rounded-xl py-2 text-[11px] font-semibold sm:w-auto ${
              cfg.primaryVariant === "danger"
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-emerald-400 text-slate-900 hover:bg-emerald-500"
            }`}
            onClick={onConfirm}
          >
            {cfg.primaryLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModerationActionModal;
