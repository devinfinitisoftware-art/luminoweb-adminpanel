import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/shared/Card";
import StatusPill from "../ui/shared/StatusPill";
import IconButton from "../ui/shared/IconButton";
import ConfirmDialog from "../ui/shared/ConfirmDialog";
import StatusConfirmModal from "../ui/shared/StatusConfirmModal";
import LoadingSpinner from "../ui/shared/LoadingSpinner";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { api } from "../../utils/api";

const statusConfig = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "danger" },
};

const RecentActivityTable = ({ onRowClick, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [statusModalMode, setStatusModalMode] = React.useState(null); // "reactivate" | "suspend"
  const [statusTarget, setStatusTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchActivities = React.useCallback(async (showLoading = true) => {
    // Only show loading on initial load when there's no data
    if (showLoading && rows.length === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await api.getAdminActivities({
        limit: 10, // Show first 10 activities
        sort: 'newest',
      });
      
      if (response.success && response.activities) {
        // Transform API data to match component format
        const formatted = response.activities.map((activity) => ({
          id: activity._id,
          name: activity.title,
          category: activity.learningDomain || activity.category || 'Uncategorized',
          ageGroup: activity.ageGroup || 'N/A',
          avgRating: activity.averageRating || 0,
          completed: activity.completedCount || 0,
          status: activity.isApproved ? 'active' : 'inactive',
          // Keep original data for API calls
          _original: activity,
        }));
        
        setRows(formatted);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    fetchActivities(true);
  }, [fetchActivities]);

  const handleRowClickInternal = (activity) => {
    if (onRowClick) onRowClick(activity);
  };

  const handleDeleteClick = (e, activity) => {
    e.stopPropagation();
    setDeleteTarget(activity);
    setConfirmOpen(true);
  };

  const handleEditClick = (e, activity) => {
    e.stopPropagation();
    // Navigate to activities page with edit mode, or call onEdit callback if provided
    if (onEdit) {
      onEdit(activity);
    } else {
      // Navigate to activities page with the activity ID for editing
      navigate(`/activities?edit=${activity.id}`);
    }
  };

  const handleToggleStatus = (e, activity) => {
    e.stopPropagation();
    const mode = activity.status === "active" ? "suspend" : "reactivate";
    setStatusModalMode(mode);
    setStatusTarget(activity);
    setStatusModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const response = await api.deleteActivity(deleteTarget.id);
      
      if (response.success) {
        setConfirmOpen(false);
        const deleted = deleteTarget;
        setDeleteTarget(null);
        
        // Refetch activities to get updated list (don't show loading)
        await fetchActivities(false);
        
        // Call onDelete callback if provided
        if (onDelete) {
          onDelete(deleted);
        }
      } else {
        throw new Error(response.message || 'Failed to delete activity');
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
      // Show error message - you could add a toast notification here
      alert(err.message || 'Failed to delete activity. Please try again.');
      setConfirmOpen(false);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  // Only show loading spinner on initial load when there's no data
  if (isLoading && rows.length === 0) {
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
          Error loading activities: {error}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white/95 shadow-sm">
      {/* Only the table, exactly like Figma */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <th className="py-3 pl-6 pr-4">Activity Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Age Group</th>
              <th className="px-4 py-3">Avg Rating</th>
              <th className="px-4 py-3">Completed</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-sm text-slate-500">
                  No activities found
                </td>
              </tr>
            ) : (
              rows.map((activity) => {
                const meta = statusConfig[activity.status] || statusConfig.inactive;

                return (
                  <tr
                    key={activity.id}
                    className="cursor-pointer border-b border-slate-100 last:border-b-0 bg-white hover:bg-slate-50/60 transition-colors"
                    onClick={() => handleRowClickInternal(activity)}
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
                    <td className="px-4 py-3 text-slate-800">
                      {typeof activity.avgRating === 'number' ? activity.avgRating.toFixed(1) : '0.0'}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {typeof activity.completed === 'number' ? activity.completed.toLocaleString() : '0'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(e, activity)}
                        className="focus:outline-none"
                      >
                        <StatusPill variant={meta.variant}>{meta.label}</StatusPill>
                      </button>
                    </td>
                    <td
                      className="px-6 py-3"
                      onClick={(e) => e.stopPropagation()} // avoid row click
                    >
                      <div className="flex justify-end gap-3">
                        <IconButton
                          aria-label="Delete activity"
                          size="sm"
                          variant="ghost-danger"
                        >
                          <FiTrash2
                            onClick={(e) => handleDeleteClick(e, activity)}
                          />
                        </IconButton>
                        <IconButton
                          aria-label="Edit activity"
                          size="sm"
                          variant="ghost"
                        >
                          <FiEdit2 onClick={(e) => handleEditClick(e, activity)} />
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

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Activity?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete Activity"}
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        disabled={isDeleting}
      />
    </Card>

      <StatusConfirmModal
        open={statusModalOpen}
        mode={statusModalMode}
        onCancel={() => {
          setStatusModalOpen(false);
          setStatusTarget(null);
          setStatusModalMode(null);
        }}
        onConfirm={() => {
          if (!statusTarget || !statusModalMode) return;
          setRows((prev) =>
            prev.map((row) =>
              row.id === statusTarget.id
                ? {
                    ...row,
                    status: statusModalMode === "suspend" ? "inactive" : "active",
                  }
                : row
            )
          );
          setStatusModalOpen(false);
          setStatusTarget(null);
          setStatusModalMode(null);
        }}
      />
    </>
  );
};

export default RecentActivityTable;
