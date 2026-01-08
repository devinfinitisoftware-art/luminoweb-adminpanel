import React from "react";
import PageContainer from "../../components/ui/shared/PageContainer";
import PageHeader from "../../components/ui/shared/PageHeader";
import Button from "../../components/ui/shared/Button";
import api from "../../utils/api";

import GeneralSettingsForm from "../../components/settings/GeneralSettingsForm";
import RewardSettingsForm from "../../components/settings/RewardSettingsForm";
import CommunitySettingsForm from "../../components/settings/CommunitySettingsForm";
import AccessSettingsForm from "../../components/settings/AccessSettingsForm";
import ChangePasswordModal from "../../components/settings/ChangePasswordModal";

const TABS = [
  { id: "general", label: "General" },
  { id: "rewards", label: "Rewards" },
  { id: "community", label: "Community" },
  { id: "access", label: "Access & Security" },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = React.useState("general");
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [settings, setSettings] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  // Fetch settings on mount
  React.useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAdminSettings();
      if (response.success) {
        setSettings(response.settings);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (tabId) => async (payload) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await api.updateAdminSettings(payload);
      if (response.success) {
        setSettings((prev) => ({ ...prev, ...payload }));
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Are you sure you want to reset all settings to defaults? This cannot be undone.")) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await api.resetAdminSettings();
      if (response.success) {
        setSettings(response.settings);
        setSuccess("Settings reset to defaults!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || "Failed to reset settings");
      }
    } catch (err) {
      console.error("Error resetting settings:", err);
      setError(err.message || "Failed to reset settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (payload) => {
    try {
      await api.changeAdminPassword(payload.currentPassword, payload.newPassword);
      return { success: true };
    } catch (err) {
      throw new Error(err.message || "Failed to change password");
    }
  };

  const renderActiveForm = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-slate-500">Loading settings...</div>
        </div>
      );
    }

    if (!settings) {
      return (
        <div className="rounded-2xl bg-white/95 p-6 shadow-sm">
          <div className="text-sm text-red-600">Failed to load settings. Please refresh the page.</div>
        </div>
      );
    }

    switch (activeTab) {
      case "general":
        return (
          <GeneralSettingsForm
            initialValues={{
              organizationName: settings.organizationName,
              defaultLanguage: settings.defaultLanguage,
              timezone: settings.timezone,
              dailySummaryEmail: settings.dailySummaryEmail,
              weeklyReportEmail: settings.weeklyReportEmail,
            }}
            onSubmit={handleSave("general")}
            saving={saving}
          />
        );
      case "rewards":
        return (
          <RewardSettingsForm
            initialValues={{
              dailyGoalPoints: settings.dailyGoalPoints,
              activityCompletionPoints: settings.activityCompletionPoints,
              maxDailyPoints: settings.maxDailyPoints,
              streakBonusEnabled: settings.streakBonusEnabled,
              streakBonusMultiplier: settings.streakBonusMultiplier,
            }}
            onSubmit={handleSave("rewards")}
            saving={saving}
          />
        );
      case "community":
        return (
          <CommunitySettingsForm
            initialValues={{
              allowParentPosts: settings.allowParentPosts,
              allowChildPosts: settings.allowChildPosts,
              requireApprovalForNewPosts: settings.requireApprovalForNewPosts,
              autoFlagThreshold: settings.autoFlagThreshold,
              maxReportsBeforeAutoHide: settings.maxReportsBeforeAutoHide,
            }}
            onSubmit={handleSave("community")}
            saving={saving}
          />
        );
      case "access":
        return (
          <AccessSettingsForm
            initialValues={{
              requireTwoFactor: settings.requireTwoFactor,
              sessionTimeoutMinutes: settings.sessionTimeoutMinutes,
              allowEmailDomainRestriction: settings.allowEmailDomainRestriction,
              allowedDomains: settings.allowedDomains,
            }}
            onSubmit={handleSave("access")}
            onOpenChangePassword={() => setChangePasswordOpen(true)}
            saving={saving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Settings" />

      <div className="mt-4 p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Tabs header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-2xl bg-white/70 p-1 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-emerald-400 text-slate-900 shadow"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResetDefaults}
              disabled={saving || loading}
            >
              Restore Defaults
            </Button>
          </div>

          {/* Success/Error messages */}
          {success && (
            <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Active tab body */}
          {renderActiveForm()}
        </div>
      </div>

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onChangePassword={handleChangePassword}
      />
    </PageContainer>
  );
};

export default SettingsPage;
