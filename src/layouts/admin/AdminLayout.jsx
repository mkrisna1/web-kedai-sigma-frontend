import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#F7F9FB] overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[69px] bg-[#F8FAFC] border-b border-[#E2E8F0] px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#2563EB]">Home Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 hover:bg-gray-100 rounded-xl">🛎️</button>
            <div className="w-8 h-8 rounded-2xl bg-cover border" 
                 style={{backgroundImage: "url('https://i.pravatar.cc/128?u=admin')"}} />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;