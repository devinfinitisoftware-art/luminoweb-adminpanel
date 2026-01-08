import React from "react";
import PageContainer from "../../components/ui/shared/PageContainer";
import PageHeader from "../../components/ui/shared/PageHeader";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import { FiTarget, FiLayers, FiStar, FiCheckCircle } from "react-icons/fi";

import ActivityOverviewTable from "../../components/activities/ActivityOverviewTable";
import CompletionBreakdownChart from "../../components/dashboard/CompletionBreakdownChart";
import ActivityTrendsChart from "../../components/dashboard/ActivityTrendsChart";
import ActivityFormModal from "../../components/activities/ActivityFormModal";
import StatusConfirmModal from "../../components/ui/shared/StatusConfirmModal";
import { api } from "../../utils/api";
import LoadingSpinner from "../../components/ui/shared/LoadingSpinner";

// Static mock data for now – replace with API later
const initialActivities = [
  {
    id: 1,
    name: "Gratitude Jar",
    category: "Gratitude",
    ageGroup: "4–6 yrs",
    avgRating: 4.9,
    completed: 512,
    status: "inactive",
  },
  {
    id: 2,
    name: "Feelings Faces",
    category: "Emotional Health",
    ageGroup: "3–5 yrs",
    avgRating: 4.7,
    completed: 435,
    status: "active",
  },
  {
    id: 3,
    name: "Piggy Bank Fun",
    category: "Financial Literacy",
    ageGroup: "4–6 yrs",
    avgRating: 4.5,
    completed: 320,
    status: "active",
  },
  {
    id: 4,
    name: "Calm Corner",
    category: "Self-care",
    ageGroup: "3–6 yrs",
    avgRating: 4.5,
    completed: 276,
    status: "active",
  },
];

const activityMetrics = [
  {
    id: "totalActivities",
    label: "Total Activities",
    value: 126,
    delta: "10% vs Last Month",
    trend: "down",
    icon: FiTarget,
    hidePerTimeframe: true,
    isRaw: true,
  },
  {
    id: "activeCategories",
    label: "Active Categories",
    value: 7,
    delta: "10% vs Last Month",
    trend: "up",
    icon: FiLayers,
    hidePerTimeframe: true,
    isRaw: true,
  },
  {
    id: "avgRating",
    label: "Avg. Rating",
    value: 4.6,
    delta: "32% vs Last Month",
    trend: "up",
    icon: FiStar,
    hidePerTimeframe: true,
    isRaw: true,
  },
  {
    id: "activitiesCompleted",
    label: "Activities Completed",
    value: 1342,
    delta: "20% vs Last Week",
    trend: "up",
    icon: FiCheckCircle,
    hidePerTimeframe: true,
    isRaw: true,
  },
];

const ActivitiesPage = () => {
  const [activities, setActivities] = React.useState([]);
  const [metrics, setMetrics] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState("create"); // "create" | "edit"
  const [selectedActivity, setSelectedActivity] = React.useState(null);
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [statusModalMode, setStatusModalMode] = React.useState(null); // "reactivate" | "suspend"
  const [statusTargetActivity, setStatusTargetActivity] = React.useState(null);

  // Fetch metrics for KPI cards
  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [platformStats, activityStats] = await Promise.all([
          api.getPlatformStats(),
          api.getAdminActivityStats('30d'),
        ]);

        if (platformStats && activityStats.success) {
          const totalActivities = activityStats.cards?.totalActivities || platformStats.totalActivities || 0;
          const activeCategories = activityStats.cards?.totalCategoriesDistinct || 0;
          const avgRating = activityStats.cards?.avgRatingGlobal || 0;
          const completedActivities = activityStats.cards?.totalCompletedActivities || platformStats.TotalActvitiesCompleted || 0;

          setMetrics([
            {
              id: "totalActivities",
              label: "Total Activities",
              value: totalActivities,
              delta: "— vs Last Month",
              trend: "neutral",
              icon: FiTarget,
              hidePerTimeframe: true,
              isRaw: true,
            },
            {
              id: "activeCategories",
              label: "Active Categories",
              value: activeCategories,
              delta: "— vs Last Month",
              trend: "neutral",
              icon: FiLayers,
              hidePerTimeframe: true,
              isRaw: true,
            },
            {
              id: "avgRating",
              label: "Avg. Rating",
              value: avgRating,
              delta: "— vs Last Month",
              trend: "neutral",
              icon: FiStar,
              hidePerTimeframe: true,
              isRaw: true,
            },
            {
              id: "activitiesCompleted",
              label: "Activities Completed",
              value: completedActivities,
              delta: "— vs Last Week",
              trend: "neutral",
              icon: FiCheckCircle,
              hidePerTimeframe: true,
              isRaw: true,
            },
          ]);
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError(err.message);
      }
    };

    fetchMetrics();
  }, []);

  const handleAddActivityClick = () => {
    setDrawerMode("create");
    setSelectedActivity(null);
    setDrawerOpen(true);
  };

  const handleEditActivity = (activity) => {
    setDrawerMode("edit");
    // Map API data to form format
    // Use _original which contains the full API response data with all fields
    const formData = activity._original || activity;
    
    const mappedActivity = {
      id: activity.id || formData._id,
      name: formData.title || activity.name || '',
      title: formData.title || activity.name || '',
      description: formData.description || '',
      learningArea: formData.learningDomain || activity.category || '',
      learningDomain: formData.learningDomain || activity.category || '',
      ageGroup: formData.ageGroup || activity.ageGroup || '',
      duration: formData.estimatedDuration || formData.time || '',
      estimatedDuration: formData.estimatedDuration || formData.time || '',
      materials: formData.materials || '',
      effectOnChild: formData.effect || '',
      effect: formData.effect || '',
      parentInstructions: formData.parentInstructions || formData.effect || '',
      category: formData.category || 'library',
      // Handle coverImage - could be URL string or object with url property
      coverImage: typeof formData.coverImage === 'string' 
        ? formData.coverImage 
        : (formData.coverImage?.url || (formData.coverImage && typeof formData.coverImage === 'object' ? formData.coverImage.url : '') || ''),
      // Handle gallery - array of objects with url property or strings
      gallery: Array.isArray(formData.gallery) 
        ? formData.gallery.map(item => typeof item === 'string' ? item : (item.url || ''))
        : [],
      // Handle resources - array of objects with url/name properties or strings
      resources: Array.isArray(formData.resources)
        ? formData.resources.map(item => typeof item === 'string' ? item : (item.url || item.name || ''))
        : [],
      _original: formData,
    };
    
    setSelectedActivity(mappedActivity);
    setDrawerOpen(true);
  };

  // Fetch activities list
  const fetchActivities = React.useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.getAdminActivities({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        status: params.status || 'all',
        sort: params.sort || 'newest',
      });

      if (response.success && response.activities) {
        const formatted = response.activities.map((activity) => ({
          id: activity._id,
          name: activity.title,
          category: activity.learningDomain || activity.category || 'Uncategorized',
          ageGroup: activity.ageGroup || 'N/A',
          avgRating: activity.averageRating || 0,
          completed: activity.completedCount || 0,
          status: activity.isApproved ? 'active' : 'inactive',
          _original: activity,
        }));
        setActivities(formatted);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchActivities({ limit: 100 }); // Fetch more items for client-side pagination/filtering
  }, [fetchActivities]);

  const handleDeleteActivity = async (activity) => {
    if (!activity) return;

    try {
      const response = await api.deleteActivity(activity.id);
      if (response.success) {
        // Refetch activities
        await fetchActivities({ limit: 100 });
      } else {
        throw new Error(response.message || 'Failed to delete activity');
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert(err.message || 'Failed to delete activity. Please try again.');
    }
  };

  const handleSubmitActivity = async (formValues) => {
    try {
      // Validate required fields
      if (!formValues.name && !formValues.title) {
        alert('Please enter a title for the activity.');
        return;
      }
      if (!formValues.description) {
        alert('Please enter a description for the activity.');
        return;
      }
      if (!formValues.learningArea && !formValues.learningDomain) {
        alert('Please select a learning area.');
        return;
      }
      if (!formValues.ageGroup) {
        alert('Please select an age group.');
        return;
      }

      // Extract files from form values
      // Filter out non-File objects (e.g., existing URLs)
      const files = {
        coverImage: formValues.coverImage instanceof File ? formValues.coverImage : null,
        gallery: Array.isArray(formValues.gallery) 
          ? formValues.gallery.filter(f => f instanceof File) 
          : null,
        resources: Array.isArray(formValues.resources) 
          ? formValues.resources.filter(f => f instanceof File) 
          : null,
      };

      // Map form field names to API field names
      const apiData = {
        title: (formValues.name || formValues.title || '').trim(),
        description: formValues.description || '',
        learningDomain: formValues.learningArea || formValues.learningDomain || '',
        ageGroup: formValues.ageGroup || '',
        estimatedDuration: formValues.duration || formValues.estimatedDuration || '',
        materials: formValues.materials || '',
        effect: formValues.effectOnChild || formValues.effect || '',
        parentInstructions: formValues.parentInstructions || formValues.effectOnChild || '',
        category: formValues.category || 'library',
      };

      if (drawerMode === "create") {
        // Create new activity
        const response = await api.createActivity(apiData, files);
        if (response.success) {
          // Refetch activities to get the new activity
          await fetchActivities({ limit: 100 });
        } else {
          throw new Error(response.message || 'Failed to create activity');
        }
      } else if (drawerMode === "edit" && selectedActivity) {
        // Update existing activity
        const activityId = selectedActivity.id || selectedActivity._original?._id;
        if (!activityId) {
          throw new Error('Activity ID not found');
        }

        const response = await api.updateActivity(activityId, apiData, files);
        if (response.success) {
          // Refetch activities to get updated data
          await fetchActivities({ limit: 100 });
        } else {
          throw new Error(response.message || 'Failed to update activity');
        }
      }

      setDrawerOpen(false);
      setSelectedActivity(null);
    } catch (err) {
      console.error('Error saving activity:', err);
      alert(err.message || 'Failed to save activity. Please try again.');
    }
  };

  const handleToggleActivityStatus = (activity) => {
    if (!activity) return;
    const isActive = activity.status === "active";
    setStatusModalMode(isActive ? "suspend" : "reactivate");
    setStatusTargetActivity(activity);
    setStatusModalOpen(true);
  };

  if (isLoading && !metrics && activities.length === 0) {
    return (
      <PageContainer>
        <PageHeader title="Activity Management" />
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="md" showLabel={false} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Activity Management" />

      {/* KPI cards */}
      {metrics && <DashboardMetrics metrics={metrics} />}

      {/* Charts removed from Activity Management per request */}

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CompletionBreakdownChart />
        <ActivityTrendsChart />
      </div>

      <div className="mt-6">
        <ActivityOverviewTable
          activities={activities}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivity}
          onAdd={handleAddActivityClick}
          onToggleStatus={handleToggleActivityStatus}
        />
      </div>

      {/* Add / Edit Activity modal */}
      <ActivityFormModal
        key={selectedActivity?.id || 'create'} // Force re-render when activity changes
        open={drawerOpen}
        mode={drawerMode}
        initialValues={selectedActivity}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedActivity(null);
        }}
        onSubmit={handleSubmitActivity}
      />

      <StatusConfirmModal
        open={statusModalOpen}
        mode={statusModalMode}
        title={
          statusModalMode === "suspend"
            ? "Deactivate this activity?"
            : "Reactivate this activity?"
        }
        description={
          statusModalMode === "suspend"
            ? "This activity will be marked inactive. Learners may not see it until reactivated."
            : "This activity will be marked active and available again."
        }
        primaryLabel={
          statusModalMode === "suspend"
            ? "DEACTIVATE ACTIVITY"
            : "REACTIVATE ACTIVITY"
        }
        onCancel={() => {
          setStatusModalOpen(false);
          setStatusTargetActivity(null);
          setStatusModalMode(null);
        }}
        onConfirm={async () => {
          if (!statusTargetActivity || !statusModalMode) return;

          try {
            const activityId = statusTargetActivity.id || statusTargetActivity._original?._id;
            if (!activityId) {
              throw new Error('Activity ID not found');
            }

            let response;
            if (statusModalMode === "suspend") {
              // Deactivate/reject activity
              response = await api.rejectActivity(activityId);
            } else {
              // Reactivate/approve activity
              response = await api.approveActivity(activityId);
            }

            if (response.success) {
              // Refetch activities to get updated status
              await fetchActivities({ limit: 100 });
              setStatusModalOpen(false);
              setStatusTargetActivity(null);
              setStatusModalMode(null);
            } else {
              throw new Error(response.message || 'Failed to update activity status');
            }
          } catch (err) {
            console.error('Error updating activity status:', err);
            alert(err.message || 'Failed to update activity status. Please try again.');
          }
        }}
      />
    </PageContainer>
  );
};

export default ActivitiesPage;
