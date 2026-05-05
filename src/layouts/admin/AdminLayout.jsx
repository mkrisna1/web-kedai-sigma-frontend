import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/TopBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
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