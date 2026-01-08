import React from "react";
import TextField from "../ui/shared/TextField";
import Button from "../ui/shared/Button";

const defaultValues = {
  allowEmailDomainRestriction: false,
  allowedDomains: "",
  requireTwoFactor: false,
  sessionTimeoutMinutes: 30,
};

const AccessSettingsForm = ({
  initialValues,
  onSubmit,
  onOpenChangePassword,
  saving = false,
}) => {
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
          Sign-in & Security
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Configure how admins access the dashboard.
        </p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleToggle("requireTwoFactor")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:bg-slate-50"
          >
            <div>
              <div className="text-[11px] font-medium text-slate-800">
                Require two-factor authentication
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Recommended for all moderator and admin accounts.
              </div>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full ${
                values.requireTwoFactor ? "bg-emerald-400" : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values.requireTwoFactor
                    ? "translate-x-3.5"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Session timeout (minutes)"
              type="number"
              min={5}
              value={values.sessionTimeoutMinutes}
              onChange={handleChange("sessionTimeoutMinutes")}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/95 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Allowed Email Domains
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Restrict which email domains can create admin accounts.
        </p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleToggle("allowEmailDomainRestriction")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:bg-slate-50"
          >
            <div>
              <div className="text-[11px] font-medium text-slate-800">
                Limit logins to specific domains
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                e.g. only users with emails from your school or organization.
              </div>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full ${
                values.allowEmailDomainRestriction
                  ? "bg-emerald-400"
                  : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values.allowEmailDomainRestriction
                    ? "translate-x-3.5"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          {values.allowEmailDomainRestriction && (
            <TextField
              label="Allowed domains (comma separated)"
              placeholder="e.g. school.org, luumilo.com"
              value={values.allowedDomains}
              onChange={handleChange("allowedDomains")}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="ghost"
          disabled={saving}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onOpenChangePassword}
        >
          Change Admin Password
        </Button>

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

export default AccessSettingsForm;
