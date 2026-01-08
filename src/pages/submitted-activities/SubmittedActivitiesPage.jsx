import React from "react";
import PageContainer from "../../components/ui/shared/PageContainer";
import PageHeader from "../../components/ui/shared/PageHeader";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import SubmittedActivitiesTable from "../../components/dashboard/SubmittedActivitiesTable";
import ActivityFormModal from "../../components/activities/ActivityFormModal";
import DashboardDetailModal from "../../components/dashboard/DashboardDetailModal";
import { FiFileText, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { api } from "../../utils/api";

const SubmittedActivitiesPage = () => {
  const [metrics, setMetrics] = React.useState(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = React.useState(true);
  const [selectedActivity, setSelectedActivity] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState("edit");
  const [editActivity, setEditActivity] = React.useState(null);
  const [activitiesData, setActivitiesData] = React.useState([]);
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Function to fetch metrics for submitted activities
  const fetchMetrics = React.useCallback(async () => {
    try {
      setIsLoadingMetrics(true);
      // Fetch all parent-submitted activities (all statuses)
      const activities = await api.getParentApprovalActivities("all");
      const activitiesArray = Array.isArray(activities) ? activities : (activities?.data || activities?.activities || []);
      
      // Calculate metrics from all activities
      const total = activitiesArray.length;
      // Pending: isApproved=false, status="Concept", and no rejectReason (or empty/null rejectReason)
      const pending = activitiesArray.filter(a => 
        !a.isApproved && 
        a.status === "Concept" && 
        (!a.rejectReason || a.rejectReason === null || a.rejectReason === "" || a.rejectReason.trim() === "")
      ).length;
      // Approved: isApproved=true and status="Actief"
      const approved = activitiesArray.filter(a => a.isApproved && a.status === "Actief").length;
      // Rejected: isApproved=false, status="Concept", and has a non-empty rejectReason
      const rejected = activitiesArray.filter(a => 
        !a.isApproved && 
        a.status === "Concept" && 
        a.rejectReason && 
        a.rejectReason !== null && 
        a.rejectReason !== "" && 
        a.rejectReason.trim() !== ""
      ).length;

      setMetrics([
        {
          id: "totalSubmitted",
          label: "Total Submitted",
          value: total,
          delta: null,
          trend: "neutral",
          icon: FiFileText,
          hidePerTimeframe: true,
          isRaw: true,
        },
        {
          id: "pending",
          label: "Pending",
          value: pending,
          delta: null,
          trend: "neutral",
          icon: FiClock,
          hidePerTimeframe: true,
          isRaw: true,
        },
        {
          id: "approved",
          label: "Approved",
          value: approved,
          delta: null,
          trend: "neutral",
          icon: FiCheckCircle,
          hidePerTimeframe: true,
          isRaw: true,
        },
        {
          id: "rejected",
          label: "Rejected",
          value: rejected,
          delta: null,
          trend: "neutral",
          icon: FiXCircle,
          hidePerTimeframe: true,
          isRaw: true,
        },
      ]);

      setActivitiesData(activitiesArray);
    } catch (err) {
      console.error('Error fetching submitted activities metrics:', err);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  // Fetch metrics on mount
  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleRowClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseDetail = () => {
    setSelectedActivity(null);
  };

  const handleEditActivity = (activity) => {
    setDrawerMode("edit");
    // Map API data to form format
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
    
    setEditActivity(mappedActivity);
    setDrawerOpen(true);
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

      if (drawerMode === "edit" && editActivity) {
        const activityId = editActivity.id || editActivity._original?._id;
        if (!activityId) {
          throw new Error('Activity ID not found');
        }

        const response = await api.updateActivity(activityId, apiData, files);
        if (response.success) {
          // Refresh metrics after update
          await fetchMetrics();
          setDrawerOpen(false);
          setEditActivity(null);
        } else {
          throw new Error(response.message || 'Failed to update activity');
        }
      }

    } catch (err) {
      console.error('Error saving activity:', err);
      alert(err.message || 'Failed to save activity. Please try again.');
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Submitted Activities" />

      {/* Metrics cards */}
      {metrics && <DashboardMetrics metrics={metrics} />}

      {/* Submitted Activities Table */}
      <div className="mt-6">
        <SubmittedActivitiesTable 
          onRowClick={handleRowClick}
          onEdit={handleEditActivity}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => setStatusFilter(value)}
          onApprove={async (activity) => {
            // Refresh metrics after approval
            await fetchMetrics();
          }}
          onReject={async (activity) => {
            // Refresh metrics after rejection
            await fetchMetrics();
          }}
          onDelete={async (activity) => {
            // Refresh metrics after deletion
            await fetchMetrics();
          }}
        />
      </div>

      {/* Detail modal */}
      <DashboardDetailModal
        open={!!selectedActivity}
        activity={selectedActivity}
        onClose={handleCloseDetail}
      />

      {/* Edit Activity modal */}
      <ActivityFormModal
        key={editActivity?.id || 'edit'}
        open={drawerOpen}
        mode={drawerMode}
        initialValues={editActivity}
        onClose={() => {
          setDrawerOpen(false);
          setEditActivity(null);
        }}
        onSubmit={handleSubmitActivity}
      />
    </PageContainer>
  );
};

export default SubmittedActivitiesPage;

