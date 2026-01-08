import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/ui/shared/Button";

const CODE_LENGTH = 6;

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = React.useState(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = React.useState(45);
  const inputsRef = React.useRef([]);

  // countdown
  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== CODE_LENGTH) return;
    // TODO: verify with API
    navigate("/dashboard");
  };

  const handleResend = () => {
    // TODO: call API; for now just reset timer
    setSecondsLeft(45);
  };

  const formattedTime = `00:${String(secondsLeft).padStart(2, "0")}`;

  return (
    // same outer frame as LoginPage
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-3 py-6">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl md:h-[520px]">
        {/* LEFT: illustration / purple panel */}
        <div className="flex w-full flex-col items-center justify-center bg-[#7B61FF] px-8 py-10 md:w-1/2">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-[48px] bg-[#5E47E0] md:h-72 md:w-72">
            <img
              src="/images/img2.png"
              alt="Verify code illustration"
              className="h-[90%] w-[90%] object-contain"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>

          <p className="mt-8 max-w-xs text-center text-xs leading-relaxed text-purple-50">
            Support parents and children by keeping Luumilo safe, fun, and
            inspiring.
          </p>

          <div className="mt-4 flex items-center gap-1 text-[10px] text-purple-100">
            <span className="inline-flex h-1 w-1 rounded-full bg-white/50" />
            <span className="inline-flex h-1.5 w-4 rounded-full bg-white" />
            <span className="inline-flex h-1 w-1 rounded-full bg-white/50" />
          </div>
        </div>

        {/* RIGHT: verification form */}
        <div className="flex w-full items-center justify-center bg-white px-6 py-8 md:w-1/2 md:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-slate-900">
                Verify it’s really you
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Enter the 6-digit code we sent to your email or phone.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      inputMode="numeric"
                      maxLength={1}
                      className="h-10 w-10 rounded-lg border border-slate-300 text-center text-base font-semibold text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
                    />
                  ))}
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <div className="font-medium">{formattedTime} Sec</div>
                  <button
                    type="button"
                    className="mt-1 font-semibold text-slate-800 hover:underline disabled:text-slate-400"
                    onClick={handleResend}
                    disabled={secondsLeft > 0}
                  >
                    Resend Code
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                className="mt-2 w-full rounded-full bg-[#0B1528] py-2.5 text-xs font-semibold text-white hover:bg-slate-900"
              >
                VERIFY
              </Button>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                <span>OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span className="h-4 w-4 rounded bg-slate-200" />
                Continue with Google
              </button>
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

export default VerifyCodePage;
