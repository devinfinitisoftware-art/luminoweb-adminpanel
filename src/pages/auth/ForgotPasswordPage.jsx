import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/shared/Button";
import TextField from "../../components/ui/shared/TextField";
import { api } from "../../utils/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = React.useState("");
  const [info, setInfo] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error) => {
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('email is required')) {
      return 'Please enter your admin email address.';
    }
    
    if (errorMessage.includes('unable to connect') || 
        errorMessage.includes('server') ||
        errorMessage.includes('network')) {
      return 'Unable to connect to the server. Please check your connection and try again.';
    }
    
    if (errorMessage.includes('client_url') || errorMessage.includes('not configured')) {
      return 'System configuration error. Please contact support.';
    }
    
    return error.message || 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsLoading(true);

    // Client-side validation
    if (!email) {
      setError("Please enter your admin email address.");
      setIsLoading(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.sendResetLink(email.trim().toLowerCase());
      
      if (response.success) {
        // Always show success message for security (don't reveal if email exists)
        setInfo(
          "If an account exists with this email, a reset link has been sent. Please check your inbox and follow the instructions."
        );
        // Clear the email field after successful submission
        setEmail("");
      } else {
        setError(response.message || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-3 py-6">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl md:h-[520px]">
        {/* LEFT: illustration panel (pink theme) */}
        <div className="flex w-full flex-col items-center justify-center bg-[#FF7BA7] px-8 py-10 md:w-1/2">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-[48px] bg-[#F25F8C] md:h-72 md:w-72">
            <img
              src="/images/img4.png"
              alt="Forgot password illustration"
              className="h-[90%] w-[90%] object-contain"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>

          <p className="mt-8 max-w-xs text-center text-xs leading-relaxed text-pink-50">
            Easily manage activities, users, and communities — all in one place.
          </p>

          <div className="mt-4 flex items-center gap-1 text-[10px] text-pink-100">
            <span className="inline-flex h-1.5 w-4 rounded-full bg-white" />
            <span className="inline-flex h-1 w-1 rounded-full bg-white/60" />
            <span className="inline-flex h-1 w-1 rounded-full bg-white/40" />
          </div>
        </div>

        {/* RIGHT: form column */}
        <div className="flex w-full items-center justify-center bg-white px-6 py-8 md:w-1/2 md:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-slate-900">
                Reset your password
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Enter your admin email and we’ll send instructions to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <TextField
                label="Admin email"
                type="email"
                placeholder="e.g. admin@luumilo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear error when user starts typing
                  if (error) setError("");
                  // Clear success message when user starts typing
                  if (info) setInfo("");
                }}
              />

              {error && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] text-rose-600">
                  {error}
                </div>
              )}
              {info && !error && (
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
                  {info}
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                disabled={isLoading}
                className="mt-1 w-full rounded-full bg-[#0B1528] py-2.5 text-xs font-semibold text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "SENDING..." : "SEND RESET LINK"}
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
              Remembered your password?{" "}
              <Link to="/login" className="font-semibold text-slate-800">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
