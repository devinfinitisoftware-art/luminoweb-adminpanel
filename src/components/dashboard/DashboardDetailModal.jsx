import React from "react";
import Modal from "../ui/shared/Modal";

const DashboardDetailModal = ({ open, activity, onClose }) => {
  if (!open || !activity) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {activity.name}
            </h3>
            <p className="text-xs text-slate-500">
              Detailed stats for this activity
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Category</span>
            <span className="font-medium text-slate-800">
              {activity.category}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Age Group</span>
            <span className="font-medium text-slate-800">
              {activity.ageGroup}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Average Rating</span>
            <span className="font-medium text-slate-800">
              {activity.avgRating.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Completed</span>
            <span className="font-medium text-slate-800">
              {activity.completed.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <span className="font-medium capitalize text-slate-800">
              {activity.status}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DashboardDetailModal;
