import React from "react";
import Card from "../ui/shared/Card";
import StatusPill from "../ui/shared/StatusPill";
import IconButton from "../ui/shared/IconButton";
import ConfirmDialog from "../ui/shared/ConfirmDialog";
import LoadingSpinner from "../ui/shared/LoadingSpinner";
import SelectField from "../ui/shared/SelectField";
import { FiTrash2, FiEdit2, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { api } from "../../utils/api";

const SubmittedActivitiesTable = ({ onRowClick, onEdit, onApprove, onReject, onDelete, statusFilter, onStatusFilterChange }) => {
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [approveTarget, setApproveTarget] = React.useState(null);
  const [approveConfirmOpen, setApproveConfirmOpen] = React.useState(false);
  const [rejectTarget, setRejectTarget] = React.useState(null);
  const [rejectConfirmOpen, setRejectConfirmOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fetchActivities = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const activities = await api.getParentApprovalActivities(statusFilter || "all");
      
      // Handle both array response and object response
      const activitiesArray = Array.isArray(activities) ? activities : (activities?.data || activities?.activities || []);
      
      if (Array.isArray(activitiesArray)) {
        // Transform API data to match component format - show all activities (no limit)
        const formatted = activitiesArray.map((activity) => ({
          id: activity._id,
          name: activity.title || '',
          category: activity.learningDomain || activity.category || 'Uncategorized',
          ageGroup: activity.ageGroup || 'N/A',
          createdAt: activity.createdAt,
          isApproved: activity.isApproved !== undefined ? activity.isApproved : false,
          status: activity.status || 'Concept',
          rejectReason: activity.rejectReason || null,
          // Keep original data for API calls
          _original: activity,
        }));
        
        setRows(formatted);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error('Error fetching submitted activities:', err);
      setError(err.message || 'Failed to load submitted activities');
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => {
    fetchActivities();
  }, [fetchActivities, statusFilter]);

  const handleDeleteClick = (e, activity) => {
    e.stopPropagation();
    setDeleteTarget(activity);
    setConfirmOpen(true);
  };

  const handleEditClick = (e, activity) => {
    e.stopPropagation();
    if (onEdit) onEdit(activity);
  };

  const handleApproveClick = (e, activity) => {
    e.stopPropagation();
    setApproveTarget(activity);
    setApproveConfirmOpen(true);
  };

  const handleRejectClick = (e, activity) => {
    e.stopPropagation();
    setRejectTarget(activity);
    setRejectConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsProcessing(true);
      const response = await api.deleteActivity(deleteTarget.id);
      
      if (response.success) {
        setConfirmOpen(false);
        setDeleteTarget(null);
        await fetchActivities();
        if (onDelete) onDelete(deleteTarget);
      } else {
        throw new Error(response.message || 'Failed to delete activity');
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert(err.message || 'Failed to delete activity. Please try again.');
      setConfirmOpen(false);
      setDeleteTarget(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmApprove = async () => {
    if (!approveTarget) return;

    try {
      setIsProcessing(true);
      const response = await api.approveActivity(approveTarget.id);
      
      if (response.success) {
        setApproveConfirmOpen(false);
        setApproveTarget(null);
        await fetchActivities();
        if (onApprove) {
          await onApprove(approveTarget);
        }
      } else {
        throw new Error(response.message || 'Failed to approve activity');
      }
    } catch (err) {
      console.error('Error approving activity:', err);
      alert(err.message || 'Failed to approve activity. Please try again.');
      setApproveConfirmOpen(false);
      setApproveTarget(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;

    try {
      setIsProcessing(true);
      const response = await api.rejectActivity(rejectTarget.id);
      
      if (response.success) {
        setRejectConfirmOpen(false);
        setRejectTarget(null);
        await fetchActivities();
        if (onReject) {
          await onReject(rejectTarget);
        }
      } else {
        throw new Error(response.message || 'Failed to reject activity');
      }
    } catch (err) {
      console.error('Error rejecting activity:', err);
      alert(err.message || 'Failed to reject activity. Please try again.');
      setRejectConfirmOpen(false);
      setRejectTarget(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const cancelApprove = () => {
    setApproveConfirmOpen(false);
    setApproveTarget(null);
  };

  const cancelReject = () => {
    setRejectConfirmOpen(false);
    setRejectTarget(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white/95 shadow-sm">
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="md" showLabel={false} />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white/95 shadow-sm">
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
          Error loading submitted activities: {error}
        </div>
      </Card>
    );
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white/95 shadow-sm">
        {/* Filter section */}
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Submitted Activities</h3>
            <div className="flex items-center gap-3">
              <SelectField
                label=""
                value={statusFilter || "all"}
                onChange={(e) => onStatusFilterChange?.(e.target.value)}
                options={statusOptions}
                className="w-40"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="py-3 pl-6 pr-4">Activity Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Age Group</th>
                <th className="px-4 py-3">Submitted Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-slate-500">
                    No submitted activities found
                  </td>
                </tr>
              ) : (
                rows.map((activity) => {
                  return (
                    <tr
                      key={activity.id}
                      className="border-b border-slate-100 last:border-b-0 bg-white hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 pl-6 pr-4 text-slate-800">
                        {activity.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {activity.category}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {activity.ageGroup}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(activity.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const originalActivity = activity._original || activity;
                          const isApproved = originalActivity.isApproved !== undefined ? originalActivity.isApproved : (activity.isApproved !== undefined ? activity.isApproved : false);
                          const status = originalActivity.status || activity.status || "Concept";
                          const rejectReason = originalActivity.rejectReason || activity.rejectReason;
                          
                          // Check if rejected (has non-empty rejectReason)
                          const isRejected = rejectReason && rejectReason !== null && rejectReason !== "" && rejectReason.trim() !== "";
                          
                          if (isApproved && status === "Actief") {
                            return <StatusPill variant="success">Approved</StatusPill>;
                          } else if (!isApproved && status === "Concept" && isRejected) {
                            return <StatusPill variant="danger">Rejected</StatusPill>;
                          } else {
                            return <StatusPill variant="warning">Pending</StatusPill>;
                          }
                        })()}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-2">
                          <IconButton
                            aria-label="Approve activity"
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={(e) => handleApproveClick(e, activity)}
                          >
                            <FiCheckCircle />
                          </IconButton>
                          <IconButton
                            aria-label="Reject activity"
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => handleRejectClick(e, activity)}
                          >
                            <FiXCircle />
                          </IconButton>
                          <IconButton
                            aria-label="Edit activity"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleEditClick(e, activity)}
                          >
                            <FiEdit2 />
                          </IconButton>
                          <IconButton
                            aria-label="Delete activity"
                            size="sm"
                            variant="ghost-danger"
                            onClick={(e) => handleDeleteClick(e, activity)}
                          >
                            <FiTrash2 />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Activity?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel={isProcessing ? "Deleting..." : "Delete Activity"}
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        disabled={isProcessing}
      />

      {/* Approve confirm dialog */}
      <ConfirmDialog
        open={approveConfirmOpen}
        title="Approve Activity?"
        description={`Are you sure you want to approve "${approveTarget?.name}"? This will make it available to all users.`}
        confirmLabel={isProcessing ? "Approving..." : "Approve Activity"}
        cancelLabel="Cancel"
        confirmVariant="primary"
        onConfirm={confirmApprove}
        onCancel={cancelApprove}
        disabled={isProcessing}
      />

      {/* Reject confirm dialog */}
      <ConfirmDialog
        open={rejectConfirmOpen}
        title="Reject Activity?"
        description={`Are you sure you want to reject "${rejectTarget?.name}"? This will mark it as rejected and it will not be available to users.`}
        confirmLabel={isProcessing ? "Rejecting..." : "Reject Activity"}
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmReject}
        onCancel={cancelReject}
        disabled={isProcessing}
      />
    </>
  );
};

export default SubmittedActivitiesTable;

