import React from "react";
import { FiBell, FiChevronRight, FiMenu } from "react-icons/fi";
import ReactCountryFlag from "react-country-flag";

const Topbar = ({ onToggleSidebar }) => {
  const [now, setNow] = React.useState(new Date());

  // keep the time fresh
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  const timeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short", // e.g. "GMT-5"
  }).format(now);

  return (
    <header className="flex h-14 items-center justify-between px-3 py-2 sm:px-6 lg:px-8 lg:justify-end">
      {/* Mobile: menu + title */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm active:scale-95"
        >
          <FiMenu className="text-base" />
        </button>
        <span className="text-xs font-semibold text-slate-800">
          Luumilo Admin
        </span>
      </div>

      {/* Right controls */}
      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Date pill with flag */}
        <div className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[11px] shadow-sm max-xs:px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50">
            <ReactCountryFlag
              countryCode="US"
              svg
              style={{
                width: "1.1rem",
                height: "1.1rem",
                borderRadius: "3px",
                objectFit: "cover",
              }}
            />
          </div>
          <span className="whitespace-nowrap text-slate-700 max-xs:hidden">
            {dateLabel}
          </span>
          <span className="whitespace-nowrap text-slate-700 xs:hidden">
            {/* shorter date on tiny screens */}
            {now.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Time pill */}
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[11px] text-slate-700 shadow-sm hover:bg-slate-50 max-xs:px-2"
        >
          <span className="whitespace-nowrap">{timeLabel}</span>
          <FiChevronRight className="text-[11px] text-slate-400" />
        </button>

        {/* Bell button */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-700"
        >
          <FiBell className="text-base" />
        </button>
      </div>
    </header>
  );
};

Topbar.defaultProps = {
  onToggleSidebar: () => {},
};

export default Topbar;
