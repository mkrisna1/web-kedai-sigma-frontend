import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../features/user/pages/Home";
import Login from "../features/admin/pages/Login";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../features/admin/pages/Dashboard";
import Pesanan from "../features/admin/pages/Pesanan";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* dashboard utama */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Pesanan */}
          <Route path="pesanan" element={<Pesanan />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;