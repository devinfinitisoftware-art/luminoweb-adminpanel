import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../section/ui/Sidebar";
import Topbar from "../section/ui/Topbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div
      className="flex min-h-screen overflow-x-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFE9D6 0%, #FFD6EA 40%, #FFE4F5 100%)",
      }}
    >
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col bg-transparent lg:ml-60 overflow-x-hidden">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
