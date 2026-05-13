import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User
import Home from "../features/user/pages/Home";
import Menu from "../features/user/pages/Menu";
import Reservasi from "../features/user/pages/Reservasi";
import Review from "../features/user/pages/Review";
import MainLayout from "../layouts/user/MainLayout";

// Admin
import Login from "../features/admin/pages/Login";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../features/admin/pages/Dashboard";
import Pesanan from "../features/admin/pages/Pesanan";
import MenuAdmin from "../features/admin/pages/MenuAdmin";
import MejaAdmin from "../features/admin/pages/MejaAdmin";
import ReservasiAdmin from "../features/admin/pages/ReservasiAdmin";
import ReviewAdmin from "../features/admin/pages/ReviewAdmin";
import Laporan from "../features/admin/pages/Laporan";
import QRMenu from "../features/qr/pages/QRMenu";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/qr" element={<Navigate to="/qr/menu" replace />} />
        <Route path="/qr/menu" element={<QRMenu />} />

        {/* USER */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="reservasi" element={<Reservasi />} />
          <Route path="review" element={<Review />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* dashboard utama */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Pesanan */}
          <Route path="pesanan" element={<Pesanan />} />

          {/*Menu*/}
          <Route path="menu" element={<MenuAdmin />} />

          {/*Meja*/}
          <Route path="meja" element={<MejaAdmin />} />

          {/*Reservasi*/}
          <Route path="reservasi" element={<ReservasiAdmin />} />

          {/*Review*/}
          <Route path="review" element={<ReviewAdmin />} />

          {/*Laporan*/}
          <Route path="laporan" element={<Laporan />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;





