import React from "react";
import TextField from "../ui/shared/TextField";
import Button from "../ui/shared/Button";

const defaultValues = {
  allowParentPosts: true,
  allowChildPosts: false,
  requireApprovalForNewPosts: false,
  autoFlagThreshold: 5,
  maxReportsBeforeAutoHide: 3,
};

const CommunitySettingsForm = ({ initialValues, onSubmit, saving = false }) => {
  const [values, setValues] = React.useState({
    ...defaultValues,
    ...initialValues,
  });

  React.useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const handleToggle = (field) => () => {
    setValues((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div className="rounded-2xl bg-white/95 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Posting Permissions
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Decide who can start new conversations and share updates.
        </p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleToggle("allowParentPosts")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:bg-slate-50"
          >
            <div>
              <div className="text-[11px] font-medium text-slate-800">
                Allow parents to create posts
              </div>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full ${
                values.allowParentPosts ? "bg-emerald-400" : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values.allowParentPosts
                    ? "translate-x-3.5"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={handleToggle("allowChildPosts")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:bg-slate-50"
          >
            <div>
              <div className="text-[11px] font-medium text-slate-800">
                Allow child accounts to create posts
              </div>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full ${
                values.allowChildPosts ? "bg-emerald-400" : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values.allowChildPosts ? "translate-x-3.5" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={handleToggle("requireApprovalForNewPosts")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:bg-slate-50"
          >
            <div>
              <div className="text-[11px] font-medium text-slate-800">
                Require moderator approval for new posts
              </div>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full ${
                values.requireApprovalForNewPosts
                  ? "bg-emerald-400"
                  : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values.requireApprovalForNewPosts
                    ? "translate-x-3.5"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/95 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Safety & Moderation
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Configure automatic reporting and hiding of problematic content.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField
            label="Reports needed to auto-flag content"
            type="number"
            min={1}
            value={values.autoFlagThreshold}
            onChange={handleChange("autoFlagThreshold")}
          />
          <TextField
            label="Reports before post is auto-hidden"
            type="number"
            min={1}
            value={values.maxReportsBeforeAutoHide}
            onChange={handleChange("maxReportsBeforeAutoHide")}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={saving}
          className="cursor-pointer rounded-xl bg-emerald-400 px-6 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default CommunitySettingsForm;
