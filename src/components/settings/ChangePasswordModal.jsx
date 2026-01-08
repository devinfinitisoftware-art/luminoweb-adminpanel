import React from "react";
import Modal from "../ui/shared/Modal";
import TextField from "../ui/shared/TextField";
import Button from "../ui/shared/Button";

const ChangePasswordModal = ({ open, onClose, onChangePassword }) => {
  const [values, setValues] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!values.currentPassword || !values.newPassword) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError("New password and confirmation do not match.");
      setLoading(false);
      return;
    }

    try {
      await onChangePassword?.({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative w-full max-w-md my-auto rounded-2xl bg-white shadow-lg flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]">
        <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Settings &gt; Security
              </div>
              <h2 className="mt-1 text-sm font-semibold text-slate-900">
                Change Password
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <form id="change-password-form" onSubmit={handleSubmit} className="space-y-3 text-xs">
          <TextField
            label="Current Password"
            type="password"
            value={values.currentPassword}
            onChange={handleChange("currentPassword")}
          />
          <TextField
            label="New Password"
            type="password"
            value={values.newPassword}
            onChange={handleChange("newPassword")}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
          />

          {error && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] text-rose-600">
              {error}
            </div>
          )}
          </form>
        </div>

        <div className="flex-shrink-0 px-5 pb-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              className="cursor-pointer w-full rounded-xl border border-slate-200 bg-white py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="change-password-form"
              variant="primary"
              disabled={loading}
              className="cursor-pointer w-full rounded-xl bg-emerald-400 py-2 text-[11px] font-semibold text-slate-900 hover:bg-emerald-500 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Password"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
