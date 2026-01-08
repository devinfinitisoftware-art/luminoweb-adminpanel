import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/shared/Button";
import TextField from "../../components/ui/shared/TextField";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState("");

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!values.password || !values.confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // TODO: call reset API with token
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-3 py-6">
      {/* Main card */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl md:h-[520px]">
        {/* LEFT: illustration on solid orange background */}
        <div className="flex w-full flex-col items-center justify-center bg-[#FF9745] px-8 py-10 md:w-1/2">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-[48px] bg-[#FFB367] md:h-72 md:w-72">
            <img
              src="/images/img3.png"
              alt="Reset password illustration"
              className="h-[90%] w-[90%] object-contain"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>

          <p className="mt-8 max-w-xs text-center text-xs leading-relaxed text-orange-50">
            Support parents and children by keeping Luumilo safe, fun, and
            inspiring.
          </p>

          <div className="mt-4 flex items-center gap-1 text-[10px] text-orange-100">
            <span className="inline-flex h-1 w-1 rounded-full bg-white/50" />
            <span className="inline-flex h-1 w-1 rounded-full bg-white/50" />
            <span className="inline-flex h-1.5 w-4 rounded-full bg-white" />
          </div>
        </div>

        {/* RIGHT: form column */}
        <div className="flex w-full items-center justify-center bg-white px-6 py-8 md:w-1/2 md:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-slate-900">
                Create a new password
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Choose a strong password you don’t use anywhere else.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <TextField
                label="New Password"
                type="password"
                value={values.password}
                onChange={handleChange("password")}
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />

              {error && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] text-rose-600">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                className="mt-2 w-full rounded-full bg-black py-2.5 text-xs font-semibold text-white hover:bg-slate-900"
              >
                RESET
              </Button>
            </form>

            <p className="mt-6 text-[11px] text-slate-500">
              Facing any issues?{" "}
              <button
                type="button"
                className="font-semibold text-slate-800 underline"
              >
                Contact Support
              </button>
            </p>

            <p className="mt-2 text-[11px] text-slate-400">
              <Link to="/login" className="hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
