import React from "react";
import TextField from "../ui/shared/TextField";
import Button from "../ui/shared/Button";

const defaultValues = {
  dailyGoalPoints: 10,
  activityCompletionPoints: 5,
  streakBonusEnabled: true,
  streakBonusMultiplier: 2,
  maxDailyPoints: 100,
};

const RewardSettingsForm = ({ initialValues, onSubmit, saving = false }) => {
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
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
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
          Points & Progress
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Configure how children earn points and complete reward milestones.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField
            label="Default daily goal (points)"
            type="number"
            min={0}
            value={values.dailyGoalPoints}
            onChange={handleChange("dailyGoalPoints")}
          />
          <TextField
            label="Points per completed activity"
            type="number"
            min={0}
            value={values.activityCompletionPoints}
            onChange={handleChange("activityCompletionPoints")}
          />
          <TextField
            label="Maximum points per day"
            type="number"
            min={0}
            value={values.maxDailyPoints}
            onChange={handleChange("maxDailyPoints")}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white/95 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Streaks & Bonuses
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          Encourage consistency with streaks and bonus multipliers.
        </p>

        <div className="mt-4 space-y-4">
          <button
            type="button"
            onClick={handleToggle("streakBonusEnabled")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[11px] hover:bg-slate-50"
          >
            <div>
              <div className="font-medium text-slate-800">
                Enable streak bonuses
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                When enabled, children earn extra points for multi-day streaks.
              </div>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full ${
                values.streakBonusEnabled ? "bg-emerald-400" : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values.streakBonusEnabled
                    ? "translate-x-3.5"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          {values.streakBonusEnabled && (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Streak bonus multiplier"
                type="number"
                min={1}
                step={0.5}
                value={values.streakBonusMultiplier}
                onChange={handleChange("streakBonusMultiplier")}
              />
            </div>
          )}
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

export default RewardSettingsForm;
