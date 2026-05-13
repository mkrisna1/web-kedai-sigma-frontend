import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/TopBar";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const hasAdminToken =
    localStorage.getItem("admin_token") || localStorage.getItem("token");

  if (!hasAdminToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex flex-col flex-1 min-h-screen">
        
        {/* TopBar */}
        <TopBar />

        {/* Content */}
        <main className="p-6 bg-slate-100 flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
