import React from "react";
import PageContainer from "../../components/ui/shared/PageContainer";
import PageHeader from "../../components/ui/shared/PageHeader";

import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import CompletionBreakdownChart from "../../components/dashboard/CompletionBreakdownChart";
import ActivityTrendsChart from "../../components/dashboard/ActivityTrendsChart";
import RecentActivityTable from "../../components/dashboard/RecentActivityTable";
import DashboardDetailModal from "../../components/dashboard/DashboardDetailModal";
import ActivityFormModal from "../../components/activities/ActivityFormModal";
import { api } from "../../utils/api";

const DashboardPage = () => {
  const [selectedActivity, setSelectedActivity] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState("edit"); // "create" | "edit"
  const [editActivity, setEditActivity] = React.useState(null);

  const handleRowClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseDetail = () => {
    setSelectedActivity(null);
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

      if (drawerMode === "edit" && editActivity) {
        // Update existing activity
        const activityId = editActivity.id || editActivity._original?._id;
        if (!activityId) {
          throw new Error('Activity ID not found');
        }

        const response = await api.updateActivity(activityId, apiData, files);
        if (response.success) {
          // Reload the page or refresh the table data
          window.location.reload(); // Simple reload for now, could be optimized to refresh just the table
        } else {
          throw new Error(response.message || 'Failed to update activity');
        }
      }

      setDrawerOpen(false);
      setEditActivity(null);
    } catch (err) {
      console.error('Error saving activity:', err);
      alert(err.message || 'Failed to save activity. Please try again.');
    }
  };

  return (
    <PageContainer className="px-3 pb-6 pt-4 sm:px-4 lg:px-6">
      <PageHeader title="Dashboard" />

      {/* KPI cards */}
      <DashboardMetrics />

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CompletionBreakdownChart />
        <ActivityTrendsChart />
      </div>

      {/* Overview table */}
      <div className="mt-6">
        <RecentActivityTable 
          onRowClick={handleRowClick} 
          onEdit={handleEditActivity}
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

export default DashboardPage;
