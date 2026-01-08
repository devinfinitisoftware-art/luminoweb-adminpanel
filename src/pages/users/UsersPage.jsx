import React from "react";
import PageContainer from "../../components/ui/shared/PageContainer";
import PageHeader from "../../components/ui/shared/PageHeader";
import ConfirmDialog from "../../components/ui/shared/ConfirmDialog";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import StatusConfirmModal from "../../components/ui/shared/StatusConfirmModal";
import { FiUsers, FiUserCheck, FiUser, FiCheckCircle } from "react-icons/fi";
import api from "../../utils/api";

import UserOverviewTable from "../../components/users/UserOverviewTable";
import UserDetailsDrawer from "../../components/users/UserDetailsDrawer";

const UsersPage = () => {
  const [users, setUsers] = React.useState([]);
  const [userMetrics, setUserMetrics] = React.useState([
    {
      id: "totalRegistered",
      label: "Total Registered Users",
      value: 0,
      delta: null,
      trend: null,
      icon: FiUsers,
      hidePerTimeframe: true,
      isRaw: true,
    },
    {
      id: "activeUsers",
      label: "Active Users",
      value: 0,
      delta: null,
      trend: null,
      icon: FiUserCheck,
      hidePerTimeframe: true,
      isRaw: true,
    },
    {
      id: "childrenProfiles",
      label: "Children Profiles",
      value: 0,
      delta: null,
      trend: null,
      icon: FiUser,
      hidePerTimeframe: true,
      isRaw: true,
    },
    {
      id: "activitiesCompleted",
      label: "Activities Completed",
      value: 0,
      delta: null,
      trend: null,
      icon: FiCheckCircle,
      hidePerTimeframe: true,
      isRaw: true,
    },
  ]);
  const [loading, setLoading] = React.useState(true);
  const [metricsLoading, setMetricsLoading] = React.useState(true);

  const [selectedUser, setSelectedUser] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [statusModalMode, setStatusModalMode] = React.useState(null); // "reactivate" | "suspend" | null
  const [statusTargetUser, setStatusTargetUser] = React.useState(null);

  // Fetch user metrics
  const fetchMetrics = React.useCallback(async () => {
    try {
      setMetricsLoading(true);
      const response = await api.getUserStats();
      if (response.success && response.stats) {
        setUserMetrics((prev) =>
          prev.map((metric) => {
            switch (metric.id) {
              case "totalRegistered":
                return { ...metric, value: response.stats.totalRegistered || 0 };
              case "activeUsers":
                return { ...metric, value: response.stats.activeUsers || 0 };
              case "childrenProfiles":
                return {
                  ...metric,
                  value: response.stats.childrenProfiles || 0,
                };
              case "activitiesCompleted":
                return {
                  ...metric,
                  value: response.stats.activitiesCompleted || 0,
                };
              default:
                return metric;
            }
          })
        );
      }
    } catch (error) {
      console.error("Error fetching user metrics:", error);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // Fetch users
  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers();
      if (response.success && response.users) {
        setUsers(response.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  React.useEffect(() => {
    fetchMetrics();
    fetchUsers();
  }, [fetchMetrics, fetchUsers]);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser({
      id: null,
      parentName: "",
      email: "",
      childNames: "",
      childAge: "",
      role: "Parent",
      lastActive: "",
      status: "active",
    });
    setDrawerOpen(true);
  };

  const handleDeleteUser = (user) => setDeleteTarget(user);

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    try {
      setDeleting(true);
      await api.deleteUser(deleteTarget.id);
      // Remove user from local state without refetching
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      // Refresh metrics to update counts
      fetchMetrics();
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (!deleting) {
      setDeleteTarget(null);
    }
  };

  const handleStatusClick = (user) => {
    const isActive = user.status === "active";
    setStatusModalMode(isActive ? "suspend" : "reactivate");
    setStatusTargetUser(user);
    setStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!statusTargetUser || !statusModalMode) return;
    try {
      const newStatus = statusModalMode === "suspend" ? "suspended" : "active";
      await api.updateUserStatus(statusTargetUser.id, newStatus);
      // Update user in local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === statusTargetUser.id ? { ...u, status: newStatus } : u
        )
      );
      // Refresh metrics to update counts
      fetchMetrics();
      setStatusModalOpen(false);
      setStatusTargetUser(null);
      setStatusModalMode(null);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status. Please try again.");
    }
  };

  return (
    <PageContainer>
      <PageHeader title="User Management" />

      {/* KPI cards */}
      <DashboardMetrics metrics={userMetrics} />

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-slate-500">Loading users...</div>
          </div>
        ) : (
          <UserOverviewTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onStatusClick={handleStatusClick}
            onRowClick={handleRowClick}
          />
        )}
      </div>

      {/* View / details modal (create + edit) */}
      <UserDetailsDrawer
        open={drawerOpen}
        user={selectedUser}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUser(null);
        }}
        onSave={async (updated) => {
          if (updated && updated.id) {
            // Update user in local state instead of refetching
            setUsers((prev) =>
              prev.map((u) =>
                u.id === updated.id
                  ? {
                      ...u,
                      parentName: updated.parentName || u.parentName,
                      email: updated.email || u.email,
                      childNames: updated.childNames || u.childNames,
                      childAge: updated.childAge || u.childAge,
                      role: updated.role || u.role,
                      status: updated.status || u.status,
                      lastActive: updated.lastActive || u.lastActive,
                    }
                  : u
              )
            );
            // Only refresh metrics if status changed
            if (selectedUser && updated.status !== selectedUser.status) {
              fetchMetrics();
            }
          }
        }}
      />

      {/* Delete user dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this account?"
        description="This user account and its related data may be removed depending on how your backend is implemented. This action cannot be undone."
        confirmLabel="DELETE ACCOUNT"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleting}
      />

      <StatusConfirmModal
        open={statusModalOpen}
        mode={statusModalMode}
        onCancel={() => {
          setStatusModalOpen(false);
          setStatusTargetUser(null);
          setStatusModalMode(null);
        }}
        onConfirm={confirmStatusChange}
      />
    </PageContainer>
  );
};

export default UsersPage;
