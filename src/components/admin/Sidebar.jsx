// src/components/admin/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // opsional: hapus data login
    localStorage.clear();
    sessionStorage.clear();

    // redirect ke login
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col">
      
      {/* Logo */}
      <div className="p-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center">
            <i className="fa-solid fa-utensils text-white text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">Kedai Sigma</h1>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#64748B]">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive 
              ? 'bg-[#EFF6FF] text-[#2563EB]' 
              : 'text-[#475569] hover:bg-gray-100'}`
          }
        >
          <i className="fa-solid fa-chart-line w-5"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/pesanan" className="flex items-center gap-3 px-4 py-3 text-[#475569] hover:bg-gray-100 rounded-xl transition">
          <i className="fa-solid fa-receipt w-5"></i>
          <span>Kelola Pesanan</span>
        </NavLink>

        <NavLink to="/admin/menu" className="flex items-center gap-3 px-4 py-3 text-[#475569] hover:bg-gray-100 rounded-xl transition">
          <i className="fa-solid fa-utensils w-5"></i>
          <span>Kelola Menu</span>
        </NavLink>

        <NavLink to="/admin/meja" className="flex items-center gap-3 px-4 py-3 text-[#475569] hover:bg-gray-100 rounded-xl transition">
          <i className="fa-solid fa-chair w-5"></i>
          <span>Kelola Meja & QR</span>
        </NavLink>

        <NavLink to="/admin/reservasi" className="flex items-center gap-3 px-4 py-3 text-[#475569] hover:bg-gray-100 rounded-xl transition">
          <i className="fa-solid fa-calendar-check w-5"></i>
          <span>Kelola Reservasi</span>
        </NavLink>

        <NavLink to="/admin/review" className="flex items-center gap-3 px-4 py-3 text-[#475569] hover:bg-gray-100 rounded-xl transition">
          <i className="fa-solid fa-star w-5"></i>
          <span>Review</span>
        </NavLink>

        <NavLink to="/admin/laporan" className="flex items-center gap-3 px-4 py-3 text-[#475569] hover:bg-gray-100 rounded-xl transition">
          <i className="fa-solid fa-file-lines w-5"></i>
          <span>Laporan</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#E2E8F0]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-[#475569] hover:bg-gray-100 rounded-xl w-full transition"
        >
          <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;