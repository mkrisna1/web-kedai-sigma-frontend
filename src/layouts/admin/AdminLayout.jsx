import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/Topbar";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-w-0 overflow-x-hidden">
      
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
      />

      {/* Main */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        
        {/* TopBar */}
        <TopBar />

        {/* Content */}
        <main className="min-w-0 flex-1 bg-slate-100 p-6">
          <div key={location.pathname} className="page-route-transition h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
