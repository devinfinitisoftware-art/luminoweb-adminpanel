import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "../../components/ui/shared/Button";
import TextField from "../../components/ui/shared/TextField";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const slide = "/images/img1.png"; // transparent PNG

  const [values, setValues] = React.useState({
    email: "",
    password: "",
    remember: true,
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (field) => (e) => {
    const value = field === "remember" ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!values.email || !values.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await login({ 
        email: values.email, 
        password: values.password 
      });
      // Navigate to dashboard on successful login
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    // dark frame background + centered 2-column card
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-3 py-6">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl md:h-[520px]">
        {/* LEFT: illustration / blue panel */}
        <div className="flex w-full flex-col items-center justify-center bg-[#1E7AD9] px-8 py-10 md:w-1/2">
          {/* blue pill behind transparent PNG */}
          <div className="relative flex h-64 w-64 items-center justify-center rounded-[48px] bg-[#0F5FC7] md:h-72 md:w-72">
            <img
              src={slide}
              alt="Family illustration"
              className="h-[90%] w-[90%] object-contain"
            />
          </div>

          <p className="mt-8 max-w-xs text-center text-xs leading-relaxed text-slate-50">
            Easily manage activities, users, and communities — all in one place.
          </p>

          {/* small dots under caption */}
          <div className="mt-4 flex items-center gap-1">
            <span className="inline-flex h-1.5 w-4 rounded-full bg-white" />
            <span className="inline-flex h-1 w-1 rounded-full bg-white/70" />
            <span className="inline-flex h-1 w-1 rounded-full bg-white/70" />
          </div>
        </div>

        {/* RIGHT: login form */}
        <div className="flex w-full items-center justify-center bg-white px-6 py-8 md:w-1/2 md:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-xl font-semibold text-slate-900">
                Welcome back to Luumilo Admin
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Log in to manage activities, users, and community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <TextField
                label="Admin email"
                type="email"
                placeholder="e.g. admin@luumilo.com"
                value={values.email}
                onChange={handleChange("email")}
              />

              {/* Password field with eye icon */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-[11px] font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange("password")}
                    className={`w-full rounded-xl border bg-white px-3 py-2 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                      error
                        ? "border-rose-300 focus:ring-rose-300 focus:border-rose-400"
                        : "border-slate-200 focus:ring-emerald-300 focus:border-emerald-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={values.remember}
                    onChange={handleChange("remember")}
                    className="h-3.5 w-3.5 rounded border-slate-300 accent-[#E53935]"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="font-semibold text-slate-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] text-rose-600">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                className="mt-2 w-full rounded-full bg-[#000000] py-2.5 text-xs font-semibold text-white hover:bg-black/90"
              >
                SIGN IN
              </Button>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                <span>OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span className="h-4 w-4 rounded-full bg-slate-200" />
                Google
              </button>
            </form>

            <p className="mt-8 text-[11px] text-slate-500">
              Facing any issues?{" "}
              <button
                type="button"
                className="font-semibold text-slate-800 underline"
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
