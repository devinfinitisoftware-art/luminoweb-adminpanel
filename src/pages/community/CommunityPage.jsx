import React from "react";
import PageContainer from "../../components/ui/shared/PageContainer";
import PageHeader from "../../components/ui/shared/PageHeader";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import ConfirmDialog from "../../components/ui/shared/ConfirmDialog";
import LoadingSpinner from "../../components/ui/shared/LoadingSpinner";
import api from "../../utils/api";

import CommunityFormModal from "../../components/community/CommunityFormModal";
import CommunityOverviewTable from "../../components/community/CommunityOverviewTable";
import CommunityDetailsDrawer from "../../components/community/CommunityDetailsDrawer";
import ModerationActionModal from "../../components/community/ModerationActionModal";
import {
  FiLayers,
  FiUsers,
  FiMessageCircle,
  FiUserCheck,
} from "react-icons/fi";

const CommunityPage = () => {
  const [communities, setCommunities] = React.useState([]);
  const [metrics, setMetrics] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMetrics, setIsLoadingMetrics] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedCommunity, setSelectedCommunity] = React.useState(null);

  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [statusModal, setStatusModal] = React.useState({
    open: false,
    type: null,
    community: null,
  });
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState("create"); // "create" | "edit"
  const [editingCommunity, setEditingCommunity] = React.useState(null);

  // Fetch communities
  const fetchCommunities = React.useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.getAllCommunities({
        page: params.page || 1,
        limit: params.limit || 100, // Fetch all communities
        search: params.search || '',
        status: params.status || 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.communities) {
        // Map API response to frontend format
        const mappedCommunities = response.communities.map((community) => ({
          id: community._id,
          name: community.name,
          description: community.description || '',
          category: community.category || 'General',
          members: community.stats?.actualMemberCount || community.stats?.memberCount || 0,
          posts: community.stats?.actualPostCount || community.stats?.postCount || 0,
          reports: 0, // TODO: Add reports count when available in API
          status: community.status || 'active',
          isPublic: community.isPublic !== undefined ? community.isPublic : true,
          _original: community, // Store original data for edit
        }));

        setCommunities(mappedCommunities);
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
      setError(err.message || 'Failed to fetch communities');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch metrics
  const fetchMetrics = React.useCallback(async () => {
    try {
      setIsLoadingMetrics(true);
      const response = await api.getCommunityStats();

      if (response.success && response.stats) {
        const communityMetricsData = [
          {
            id: "totalCommunities",
            label: "Total Communities",
            value: response.stats.totalCommunities || 0,
            delta: null, // No comparison data available
            trend: null,
            icon: FiLayers,
            hidePerTimeframe: true,
            isRaw: true,
          },
          {
            id: "totalMembers",
            label: "Total Members",
            value: response.stats.totalMembers || 0,
            delta: null,
            trend: null,
            icon: FiUsers,
            hidePerTimeframe: true,
            isRaw: true,
          },
          {
            id: "posts",
            label: "Posts",
            value: response.stats.totalPosts || 0,
            delta: null,
            trend: null,
            icon: FiMessageCircle,
            hidePerTimeframe: true,
            isRaw: true,
          },
          {
            id: "activeModerators",
            label: "Active Moderators",
            value: response.stats.activeModerators || 0,
            delta: null,
            trend: null,
            icon: FiUserCheck,
            hidePerTimeframe: true,
            isRaw: true,
          },
        ];

        setMetrics(communityMetricsData);
      }
    } catch (err) {
      console.error('Error fetching community metrics:', err);
      // Don't set error for metrics, just log it
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  // Fetch data on mount
  React.useEffect(() => {
    fetchCommunities();
    fetchMetrics();
  }, [fetchCommunities, fetchMetrics]);

  const handleView = (community) => {
    setSelectedCommunity(community);
    setDetailsOpen(true);
  };

  const handleDelete = (community) => setDeleteTarget(community);

  const confirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await api.deleteCommunity(deleteTarget.id);
      
      // Remove from state
      setCommunities((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      
      // Update metrics (decrement total communities)
      setMetrics((prev) => {
        if (!prev) return prev;
        return prev.map((metric) => {
          if (metric.id === "totalCommunities") {
            return { ...metric, value: Math.max(0, (metric.value || 0) - 1) };
          }
          return metric;
        });
      });
      
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting community:', err);
      alert(err.message || 'Failed to delete community. Please try again.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (!isDeleting) {
      setDeleteTarget(null);
    }
  };

  const handleStatusClick = (community) => {
    const type =
      community.status === "active"
        ? "suspend_community"
        : "reactivate_community";
    setStatusModal({ open: true, type, community });
  };

  const confirmStatusChange = async () => {
    if (!statusModal.community) return;
    
    try {
      const newStatus = statusModal.type === "suspend_community" ? "suspended" : "active";
      
      // Update community status via API
      await api.updateCommunity(statusModal.community.id, { status: newStatus });
      
      // Update community status in state
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === statusModal.community.id
            ? {
                ...c,
                status: newStatus,
              }
            : c
        )
      );
      
      setStatusModal({ open: false, type: null, community: null });
    } catch (err) {
      console.error('Error updating community status:', err);
      alert(err.message || 'Failed to update community status. Please try again.');
    }
  };

  const cancelStatusChange = () =>
    setStatusModal({ open: false, type: null, community: null });

  const handleAddCommunity = () => {
    setFormMode("create");
    setEditingCommunity(null);
    setFormOpen(true);
  };

  const handleEdit = (community) => {
    setFormMode("edit");
    // Use _original data if available (contains full API response), otherwise use community
    const sourceData = community._original || community;
    // Map community data to form format
    const formData = {
      id: community.id || community._id,
      name: sourceData.name || community.name || '',
      description: sourceData.description || community.description || '',
      category: sourceData.category || community.category || '',
      isPublic: sourceData.isPublic !== undefined ? sourceData.isPublic : (community.isPublic !== undefined ? community.isPublic : true),
      _original: sourceData,
    };
    setEditingCommunity(formData);
    setFormOpen(true);
  };

  const handleSubmitCommunity = async (values) => {
    try {
      // Map form values to API format
      const apiData = {
        name: values.name.trim(),
        description: values.description.trim(),
        category: values.category,
        isPublic: values.privacy === 'public',
        image: 'https://via.placeholder.com/400x300', // Default placeholder image (required by API)
        requiresApproval: false,
        maxMembers: 0,
      };

      if (formMode === 'create') {
        // Create new community
        const response = await api.createCommunity(apiData);
        
        if (response.community || response.message) {
          const createdCommunity = response.community || response;
          // Map API response to frontend format and add to state
          const newCommunity = {
            id: createdCommunity._id || createdCommunity.id,
            name: createdCommunity.name || values.name,
            description: createdCommunity.description || values.description,
            category: createdCommunity.category || values.category,
            members: 0,
            posts: 0,
            reports: 0,
            status: createdCommunity.status || 'active',
            isPublic: createdCommunity.isPublic !== undefined ? createdCommunity.isPublic : (values.privacy === 'public'),
            _original: createdCommunity,
          };
          
          setCommunities((prev) => [newCommunity, ...prev]);
          
          // Update metrics (increment total communities)
          setMetrics((prev) => {
            if (!prev) return prev;
            return prev.map((metric) => {
              if (metric.id === "totalCommunities") {
                return { ...metric, value: (metric.value || 0) + 1 };
              }
              return metric;
            });
          });
        }
      } else if (formMode === 'edit' && editingCommunity?.id) {
        // Update existing community
        const response = await api.updateCommunity(editingCommunity.id, apiData);
        
        if (response.community || response.message) {
          const updatedCommunity = response.community || response;
          // Update community in state
          setCommunities((prev) =>
            prev.map((c) =>
              c.id === editingCommunity.id
                ? {
                    ...c,
                    name: updatedCommunity.name || values.name,
                    description: updatedCommunity.description || values.description,
                    category: updatedCommunity.category || values.category,
                    isPublic: updatedCommunity.isPublic !== undefined ? updatedCommunity.isPublic : (values.privacy === 'public'),
                    _original: updatedCommunity || c._original,
                  }
                : c
            )
          );
        }
      }
      
      setFormOpen(false);
      setEditingCommunity(null);
    } catch (err) {
      console.error('Error submitting community:', err);
      alert(err.message || 'Failed to save community. Please try again.');
      throw err;
    }
  };

  if (error && !communities.length) {
    return (
      <PageContainer>
        <PageHeader title="Community Management" />
        <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-800">
          Error: {error}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Community Management" />

      <div className="mt-4">
        {/* KPI cards */}
        {isLoadingMetrics ? (
          <div className="mb-6 flex h-32 items-center justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          metrics && <DashboardMetrics metrics={metrics} />
        )}
        
        {/* Overview section */}
        {isLoading ? (
          <div className="mt-6 flex h-64 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <CommunityOverviewTable
            communities={communities}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusClick={handleStatusClick}
            onAdd={handleAddCommunity}
          />
        )}
      </div>

      {/* View community drawer */}
      <CommunityDetailsDrawer
        open={detailsOpen}
        community={selectedCommunity}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedCommunity(null);
        }}
      />

      <CommunityFormModal
        key={editingCommunity?.id || 'create'}
        open={formOpen}
        mode={formMode} // "create" | "edit"
        initialValues={editingCommunity}
        onSubmit={handleSubmitCommunity}
        onClose={() => {
          setFormOpen(false);
          setEditingCommunity(null);
        }}
      />
      {/* Delete community dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this community?"
        description="All data related to this community will be removed. This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "DELETE COMMUNITY"}
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        disabled={isDeleting}
      />

      {/* Community status (reactivate / suspend) */}
      <ModerationActionModal
        open={statusModal.open}
        actionType={statusModal.type}
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
      />
    </PageContainer>
  );
};

export default CommunityPage;
