import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiAward,
  FiUsers,
  FiSettings,
  FiActivity,
  FiMessageCircle,
  FiLogOut,
  FiInbox,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import StatusConfirmModal from "../../../components/ui/shared/StatusConfirmModal";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/activities", label: "Activity Management", icon: FiActivity },
  { to: "/submitted-activities", label: "Submitted Activities", icon: FiInbox },
  { to: "/badges", label: "Badge Management", icon: FiAward },
  { to: "/community", label: "Community Management", icon: FiMessageCircle },
  { to: "/users", label: "User Management", icon: FiUsers },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const handleLogout = () => {
    setLogoutOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login", { replace: true });
    if (onClose) onClose();
  };

  // Get user display name - use username or name if available
  const displayName = user?.username || user?.name || "Admin User";
  const displayEmail = user?.email || "";

  return (
    <aside
      className={[
        "fixed left-0 top-0 bottom-0 z-40 h-screen w-60 shrink-0 border-r border-slate-900 bg-black transition-transform duration-200 flex",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:flex",
      ].join(" ")}
    >
      <div className="flex h-full w-full flex-col px-4 py-4">
        {/* Profile card */}
        <div className="mb-8 px-1">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-lg shadow-emerald-500/15 transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <span className="text-base font-semibold">
                {displayName && displayName.length > 0 
                  ? displayName.charAt(0).toUpperCase() 
                  : "A"}
              </span>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-slate-900 leading-tight">
                {displayName}
              </span>
              <span className="truncate text-[11px] text-slate-500">
                {displayEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 text-[13px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200",
                    isActive
                      ? "bg-emerald-400 text-black font-semibold shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white",
                  ].join(" ")
                }
                end={item.to === "/dashboard"}
                onClick={onClose}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-transparent text-base group-[.bg-emerald-400]:bg-emerald-300/70 group-hover:bg-emerald-300/20 transition-colors duration-200">
                  <Icon className="shrink-0" />
                </span>
                <span className="truncate tracking-tight">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-6 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-slate-400 transition-all duration-200 hover:bg-slate-900 hover:text-white"
          >
            <FiLogOut className="text-sm" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <StatusConfirmModal
        open={logoutOpen}
        mode="suspend"
        title="Log out from Luumilo Admin?"
        description="You'll be signed out from your admin session. Make sure all changes are saved before logging out."
        primaryLabel="LOG OUT"
        cancelLabel="Cancel"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </aside>
  );
};

Sidebar.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default Sidebar;
