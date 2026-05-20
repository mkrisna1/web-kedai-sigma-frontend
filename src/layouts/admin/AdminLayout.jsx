import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/Topbar";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
      />

      {/* Main */}
      <div className="flex flex-col flex-1 min-h-screen">
        
        {/* TopBar */}
        <TopBar />

        {/* Content */}
        <main className="p-6 bg-slate-100 flex-1">
          <div key={location.pathname} className="page-route-transition h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
