import React from "react";
import TextField from "../ui/shared/TextField";
import SelectField from "../ui/shared/SelectField";
import Button from "../ui/shared/Button";

const languageOptions = [
  { value: "en", label: "English (Default)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const timezoneOptions = [
  { value: "UTC-5", label: "GMT-5 (Central US)" },
  { value: "UTC-4", label: "GMT-4 (Eastern US)" },
  { value: "UTC+1", label: "GMT+1 (Central Europe)" },
];

const defaultValues = {
  organizationName: "",
  defaultLanguage: "en",
  timezone: "UTC-5",
  dailySummaryEmail: true,
  weeklyReportEmail: true,
};

const GeneralSettingsForm = ({ initialValues, onSubmit, saving = false }) => {
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

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleToggle = (field) => () => {
    setValues((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div className="rounded-2xl bg-white/95 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          General Settings
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Control app-wide basics like organization name, language and timezone.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField
            label="Organization / School Name"
            placeholder="e.g. Luumilo Family Hub"
            value={values.organizationName}
            onChange={handleChange("organizationName")}
          />

          <SelectField
            label="Default Language"
            value={values.defaultLanguage}
            onChange={handleChange("defaultLanguage")}
            options={languageOptions}
          />

          <SelectField
            label="Default Timezone"
            value={values.timezone}
            onChange={handleChange("timezone")}
            options={timezoneOptions}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white/95 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Email & Reports
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Choose which automatic emails admins receive.
        </p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleToggle("dailySummaryEmail")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[11px] hover:bg-slate-50"
          >
            <div>
              <div className="font-medium text-slate-800">
                Daily activity summary
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Short snapshot of activities, badges and communities.
              </div>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full ${
                values.dailySummaryEmail ? "bg-emerald-400" : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values.dailySummaryEmail
                    ? "translate-x-3.5"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={handleToggle("weeklyReportEmail")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[11px] hover:bg-slate-50"
          >
            <div>
              <div className="font-medium text-slate-800">
                Weekly progress report
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Detailed metrics every Monday for admins.
              </div>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full ${
                values.weeklyReportEmail ? "bg-emerald-400" : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values.weeklyReportEmail
                    ? "translate-x-3.5"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </button>
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

export default GeneralSettingsForm;
