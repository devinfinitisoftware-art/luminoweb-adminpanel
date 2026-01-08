import React, { useEffect, useState } from "react";
import Button from "../ui/shared/Button";
import UserStatusBadge from "./UserStatusBadge";
import api from "../../utils/api";

const UserDetailsDrawer = ({ open, user, onClose, onSave }) => {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (open && user) {
      const next = {
        id: user.id,
        parentName: user.parentName || "",
        email: user.email || "",
        childNames: user.childNames || "",
        childAge: user.childAge || "",
        role: user.role || "",
        lastActive: user.lastActive || "",
        status: user.status || "",
      };

      // avoid unnecessary state updates
      const applyIfDifferent = () => {
        setForm((prev) => {
          const keys = Object.keys(next);
          for (let k of keys) {
            if (prev[k] !== next[k]) return next;
          }
          return prev;
        });
      };

      const t = setTimeout(applyIfDifferent, 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, user]);

  useEffect(() => {
    if (open) {
      setError(null);
      setUserDetails(null);
      // Fetch user details when drawer opens
      if (user && user.id) {
        fetchUserDetails();
      }
    }
  }, [open, user]);

  const fetchUserDetails = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingDetails(true);
      const response = await api.getUserDetails(user.id);
      if (response.success) {
        setUserDetails(response);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (!open || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setError(null);
  };

  const handleSave = async () => {
    if (!form.id) {
      setError("User ID is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Prepare update data - map frontend fields to backend fields
      const updateData = {};
      
      if (form.parentName !== user.parentName) {
        updateData.username = form.parentName;
      }
      
      if (form.email !== user.email) {
        updateData.email = form.email;
      }
      
      // Handle childAge - convert "6 yrs" format to ageGroup format
      const formattedChildAge = form.childAge === "—" || !form.childAge 
        ? "" 
        : form.childAge.replace(/\s*yrs\s*/i, "").trim();
      const originalChildAge = user.childAge === "—" || !user.childAge 
        ? "" 
        : user.childAge.replace(/\s*yrs\s*/i, "").trim();
      
      if (formattedChildAge !== originalChildAge) {
        updateData.ageGroup = formattedChildAge;
      }

      // Update status separately if it changed
      if (form.status && form.status !== user.status) {
        await api.updateUserStatus(form.id, form.status);
      }

      // Update other user fields if there are changes
      if (Object.keys(updateData).length > 0) {
        const response = await api.updateUser(form.id, updateData);
        
        if (!response.success) {
          setError(response.message || "Failed to update user");
          return;
        }
      }

      // Call onSave with updated form data
      if (onSave) {
        onSave({
          ...form,
          // Format updated user data to match display format
          parentName: updateData.username || form.parentName,
          email: updateData.email || form.email,
          childAge: updateData.ageGroup 
            ? (updateData.ageGroup ? `${updateData.ageGroup} yrs` : "—")
            : form.childAge,
          status: form.status,
        });
      }
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message || "Failed to update user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto"
      onClick={onClose}
      aria-hidden={false}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-2xl my-auto rounded-3xl bg-white/95 shadow-xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 sm:px-6 sm:pt-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Users &gt; View User
              </div>
              <div className="mt-1 flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  {form.parentName}
                </h2>
                {form.status && <UserStatusBadge status={form.status} />}
              </div>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
        {/* Body Content */}
        <div className="space-y-4">
          {/* Form Fields Section */}
          <div className="rounded-2xl bg-slate-50/50 p-4">
            <div className="grid gap-3 text-xs sm:grid-cols-2">
            {/* Parent Name */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Parent Name
              </div>
              <input
                name="parentName"
                value={form.parentName}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              />
            </div>

            {/* Email */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Email
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full break-all rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              />
            </div>

            {/* Child Names */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Child Name(s)
              </div>
              <input
                name="childNames"
                value={form.childNames}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              />
            </div>

            {/* Child Age */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Child Age
              </div>
              <input
                name="childAge"
                value={form.childAge}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              />
            </div>

            {/* Role */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">Role</div>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              />
            </div>

            {/* Last Active */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Last Active
              </div>
              <input
                name="lastActive"
                value={form.lastActive}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              />
            </div>

            {/* Status */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Status
              </div>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          </div>

          {/* Activity and Stats Section */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="mb-3 text-xs font-semibold text-slate-700">
              User Activity & Stats
            </h3>
            
            {loadingDetails ? (
              <div className="py-4 text-center text-[11px] text-slate-400">
                Loading activity data...
              </div>
            ) : userDetails ? (
              <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-[10px] font-medium text-slate-500">
                      Activities Completed
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {userDetails.stats?.totalCompletedActivities || 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-[10px] font-medium text-slate-500">
                      Badges Earned
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {userDetails.stats?.badgesEarned || 0}
                    </div>
                  </div>
                </div>

                {/* Subscription Info */}
                {userDetails.subscription && (
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <div className="text-[10px] font-medium text-emerald-700">
                      Subscription Status
                    </div>
                    <div className="mt-1 text-xs font-semibold text-emerald-900">
                      {userDetails.subscription.status}
                    </div>
                    {userDetails.subscription.type && (
                      <div className="mt-0.5 text-[10px] text-emerald-700">
                        {userDetails.subscription.type}
                      </div>
                    )}
                    {userDetails.subscription.endDate && (
                      <div className="mt-1 text-[10px] text-emerald-600">
                        Expires: {new Date(userDetails.subscription.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Account Created */}
                {userDetails.user?.accountCreated && (
                  <div className="text-[10px] text-slate-500">
                    Account created:{" "}
                    {new Date(userDetails.user.accountCreated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}

                {/* Recent Activities */}
                {userDetails.stats?.recentActivities &&
                  userDetails.stats.recentActivities.length > 0 && (
                    <div>
                      <div className="mb-2 text-[10px] font-medium text-slate-600">
                        Recent Completed Activities
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {userDetails.stats.recentActivities.map((activity, idx) => (
                          <div
                            key={activity.id || idx}
                            className="rounded-lg border border-slate-200 bg-white p-2"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="text-[11px] font-medium text-slate-900">
                                  {activity.title}
                                </div>
                                {activity.learningDomain && (
                                  <div className="mt-0.5 text-[10px] text-slate-500">
                                    {activity.learningDomain}
                                    {activity.ageGroup && ` • ${activity.ageGroup}`}
                                  </div>
                                )}
                              </div>
                              {activity.completedAt && (
                                <div className="ml-2 text-[10px] text-slate-400">
                                  {new Date(activity.completedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* No activities message */}
                {userDetails.stats?.recentActivities?.length === 0 && (
                  <div className="py-4 text-center text-[11px] text-slate-400">
                    No completed activities yet
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-[11px] text-slate-400">
                Unable to load activity data
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
        </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={saving}
            className="cursor-pointer rounded-xl px-6 py-2 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={saving}
            className="cursor-pointer rounded-xl bg-emerald-400 px-6 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsDrawer;
