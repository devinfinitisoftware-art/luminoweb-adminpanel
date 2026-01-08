import React from "react";
import PageContainer from "../../components/ui/shared/PageContainer";
import PageHeader from "../../components/ui/shared/PageHeader";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import ConfirmDialog from "../../components/ui/shared/ConfirmDialog";
import StatusConfirmModal from "../../components/ui/shared/StatusConfirmModal";
import LoadingSpinner from "../../components/ui/shared/LoadingSpinner";
import { FiAward, FiStar, FiGrid, FiTrendingUp } from "react-icons/fi";
import { api } from "../../utils/api";

import BadgeOverviewTable from "../../components/badges/BadgeOverviewTable";
import BadgeFormModal from "../../components/badges/BadgeFormModal";

const BadgesPage = () => {
  const [badges, setBadges] = React.useState([]);
  const [metrics, setMetrics] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMetrics, setIsLoadingMetrics] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState("create"); // "create" | "edit"
  const [editingBadge, setEditingBadge] = React.useState(null);

  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [statusModalMode, setStatusModalMode] = React.useState(null); // "reactivate" | "suspend"
  const [statusTargetBadge, setStatusTargetBadge] = React.useState(null);

  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Fetch badges and metrics
  const fetchBadges = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const badgesData = await api.getAllBadges();
      const badgesArray = Array.isArray(badgesData) ? badgesData : [];
      
      // Map API badge data to component format
      // Note: Badge model has: name, description, icon, category
      // Frontend expects: id, name, category, type, earnedByUsers, progress, status
      const mappedBadges = badgesArray.map((badge) => ({
        id: badge._id,
        name: badge.name || '',
        category: badge.category || 'General',
        type: 'Milestone', // Default since not in DB model
        earnedByUsers: 0, // Will be calculated if needed
        progress: 0, // Will be calculated if needed
        status: 'active', // Default since not in DB model
        iconUrl: badge.icon || badge.iconUrl || '',
        description: badge.description || '',
        _original: badge, // Keep original for API calls
      }));
      
      setBadges(mappedBadges);
    } catch (err) {
      console.error('Error fetching badges:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMetrics = React.useCallback(async () => {
    try {
      setIsLoadingMetrics(true);
      const stats = await api.getBadgeStats();
      
      if (stats.success) {
        setMetrics([
          {
            id: "totalBadgesCreated",
            label: "Total Badges Created",
            value: stats.stats.totalBadgesCreated || 0,
            delta: null,
            trend: "neutral",
            icon: FiAward,
            hidePerTimeframe: true,
            isRaw: true,
          },
          {
            id: "badgesEarned",
            label: "Badges Earned",
            value: stats.stats.badgesEarned || 0,
            delta: null,
            trend: "neutral",
            icon: FiStar,
            hidePerTimeframe: true,
            isRaw: true,
          },
          {
            id: "avgCompletion",
            label: "Avg Completion Rate",
            value: `${stats.stats.avgCompletionRate || 0}%`,
            delta: null,
            trend: "neutral",
            icon: FiTrendingUp,
            hidePerTimeframe: true,
            isRaw: true,
          },
          {
            id: "badgeCategories",
            label: "Badge Categories",
            value: stats.stats.badgeCategories || 0,
            delta: null,
            trend: "neutral",
            icon: FiGrid,
            hidePerTimeframe: true,
            isRaw: true,
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching badge stats:', err);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBadges();
    fetchMetrics();
  }, [fetchBadges, fetchMetrics]);

  // --- Filtering ---
  const filteredBadges = badges.filter((badge) => {
    const matchesSearch =
      !search ||
      badge.name.toLowerCase().includes(search.toLowerCase()) ||
      badge.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : badge.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // --- Form handlers ---
  const handleAddBadge = () => {
    setFormMode("create");
    setEditingBadge(null);
    setFormOpen(true);
  };

  const handleEditBadge = (badge) => {
    setFormMode("edit");
    const original = badge._original || badge;
    setEditingBadge({
      id: badge.id,
      title: badge.name || original.name || '',
      description: badge.description || original.description || '',
      learningArea: (badge.category || original.category || 'general').toLowerCase().replace(/ /g, '_'),
      badgeType: (badge.type || 'milestone').toLowerCase(),
      unlockCriteria: "Complete related activities to earn this badge.",
      status: badge.status || 'active',
      iconUrl: badge.iconUrl || original.icon || original.iconUrl || "",
    });
    setFormOpen(true);
  };

  const handleSubmitBadge = async (values) => {
    try {
      // Validate required fields
      if (!values.title || values.title.trim() === '') {
        alert('Please enter a title for the badge.');
        return;
      }

      if (!values.description || values.description.trim() === '') {
        alert('Please enter a description for the badge.');
        return;
      }

      if (!values.learningArea || values.learningArea === '') {
        alert('Please select a learning area / category.');
        return;
      }

      if (formMode === "create") {
        // Icon is required for create
        if (!values.iconFile) {
          alert('Please upload an icon for the badge.');
          return;
        }

        // Create badge via API
        const badgeData = {
          name: values.title.trim(),
          description: values.description, // Keep HTML from ReactQuill
          category: values.learningArea,
        };
        
        const response = await api.createBadge(badgeData, values.iconFile);
        
        if (response.message || response.badge) {
          // Add new badge to state
          const newBadge = {
            id: response.badge._id || response.badge.id,
            name: response.badge.name || values.title,
            category: response.badge.category || values.learningArea,
            type: values.badgeType || 'Milestone',
            earnedByUsers: 0,
            progress: 0,
            status: values.status || 'active',
            iconUrl: response.badge.icon || response.badge.iconUrl || '',
            description: response.badge.description || values.description,
            _original: response.badge,
          };
          
          setBadges((prev) => [newBadge, ...prev]);
          
          // Update metrics locally (increment total badges created)
          setMetrics((prev) => {
            if (!prev) return prev;
            return prev.map((metric) => {
              if (metric.id === "totalBadgesCreated") {
                return { ...metric, value: (metric.value || 0) + 1 };
              }
              return metric;
            });
          });
          
          // Close form on success
          setFormOpen(false);
          setEditingBadge(null);
        }
      } else if (formMode === "edit" && editingBadge?.id) {
        // Update badge via API
        const badgeData = {
          name: values.title,
          description: values.description || '',
          category: values.learningArea || 'general',
        };
        
        const response = await api.updateBadge(editingBadge.id, badgeData);
        
        if (response.message || response.badge) {
          // Update badge in state
          setBadges((prev) =>
            prev.map((b) =>
              b.id === editingBadge.id
                ? {
                    ...b,
                    name: response.badge.name || values.title,
                    category: response.badge.category || values.learningArea,
                    type: values.badgeType || b.type,
                    status: values.status || b.status,
                    description: response.badge.description || values.description,
                    iconUrl: response.badge.icon || response.badge.iconUrl || b.iconUrl,
                    _original: response.badge,
                  }
                : b
            )
          );
          // Metrics don't change on edit, no need to refetch
          
          // Close form on success
          setFormOpen(false);
          setEditingBadge(null);
        }
      }
    } catch (err) {
      console.error('Error saving badge:', err);
      alert(err.message || 'Failed to save badge. Please try again.');
      throw err; // Re-throw so form can handle loading state
    }
  };

  const handleCancelForm = () => {
    setFormOpen(false);
    setEditingBadge(null);
  };

  // --- Status / delete handlers ---
  const handleToggleStatusRequest = (badge) => {
    const mode = badge.status === "active" ? "suspend" : "reactivate";
    setStatusModalMode(mode);
    setStatusTargetBadge(badge);
    setStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!statusTargetBadge || !statusModalMode) return;

    try {
      // Note: Badge model doesn't have a status field in the DB
      // This is a frontend-only feature for now
      // If you need backend status, you'll need to add it to the Badge model
      setBadges((prev) =>
        prev.map((b) =>
          b.id === statusTargetBadge.id
            ? {
                ...b,
                status: statusModalMode === "suspend" ? "inactive" : "active",
              }
            : b
        )
      );

      setStatusModalOpen(false);
      setStatusModalMode(null);
      setStatusTargetBadge(null);
    } catch (err) {
      console.error('Error updating badge status:', err);
      alert(err.message || 'Failed to update badge status. Please try again.');
    }
  };

  const handleCancelStatusChange = () => {
    setStatusModalOpen(false);
    setStatusModalMode(null);
    setStatusTargetBadge(null);
  };

  const handleDeleteRequest = (badge) => {
    setDeleteTarget(badge);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    
    try {
      setIsDeleting(true);
      const response = await api.deleteBadge(deleteTarget.id);
      
      if (response.message || response.success !== false) {
        // Remove badge from state
        setBadges((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        
        // Update metrics locally (decrement total badges created)
        setMetrics((prev) => {
          if (!prev) return prev;
          return prev.map((metric) => {
            if (metric.id === "totalBadgesCreated") {
              return { ...metric, value: Math.max(0, (metric.value || 0) - 1) };
            }
            return metric;
          });
        });
        
        setDeleteTarget(null);
      } else {
        throw new Error(response.message || 'Failed to delete badge');
      }
    } catch (err) {
      console.error('Error deleting badge:', err);
      alert(err.message || 'Failed to delete badge. Please try again.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => setDeleteTarget(null);

  // (Import handler removed) Previously accepted parsed CSV rows and appended them as badges,
  // but the function was unused and caused a linter error, so it was removed.

  if (isLoading || isLoadingMetrics) {
    return (
      <PageContainer>
        <PageHeader title="Badge Management" />
        <div className="mt-8 flex justify-center">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Badge Management" />

      <div className="mt-4">
        {/* KPI cards */}
        {metrics && <DashboardMetrics metrics={metrics} />}
        {/* Overview section */}

        <BadgeOverviewTable
          badges={filteredBadges}
          onEdit={handleEditBadge}
          onDelete={handleDeleteRequest}
          onToggleStatus={handleToggleStatusRequest}
          onAdd={handleAddBadge}
        />
      </div>

      <BadgeFormModal
        open={formOpen}
        mode={formMode}
        initialValues={editingBadge}
        onSubmit={handleSubmitBadge}
        onClose={handleCancelForm}
      />

      {/* Delete modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this badge permanently?"
        description="All progress and unlock data related to this badge will be removed. This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "DELETE BADGE"}
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        disabled={isDeleting}
      />

      <StatusConfirmModal
        open={statusModalOpen}
        mode={statusModalMode}
        title={
          statusModalMode === "suspend"
            ? "Deactivate this badge?"
            : "Activate this badge?"
        }
        description={
          statusModalMode === "suspend"
            ? "Deactivating this badge will hide it from users. Any progress toward earning it will be paused until it's reactivated."
            : "Once activated, this badge will become visible to users and can be earned automatically when the set criteria are met."
        }
        primaryLabel={
          statusModalMode === "suspend" ? "DEACTIVATE BADGE" : "ACTIVATE BADGE"
        }
        onCancel={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
      />
    </PageContainer>
  );
};

export default BadgesPage;
