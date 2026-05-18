import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// User
import Home from "../features/user/pages/Home";
import Menu from "../features/user/pages/Menu";
import Reservasi from "../features/user/pages/Reservasi";
import Review from "../features/user/pages/Review";
import MainLayout from "../layouts/user/MainLayout";

// QR
import QRLayout from "../layouts/qr/QRLayout";
import QRMenu from "../features/qr/pages/QRMenu";
import Keranjang from "../features/qr/pages/Keranjang";

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

function RequireAdminAuth({ children }) {
  const location = useLocation();
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("admin_token")
      : "";

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function DashboardShortcut() {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("admin_token")
      : "";

  return <Navigate to={token ? "/admin/dashboard" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardShortcut />} />

        {/* QR */}
        <Route path="/qr" element={<QRLayout />}>
          <Route index element={<Navigate to="menu" replace />} />
          <Route path="menu" element={<QRMenu />} />
          <Route path="keranjang" element={<Keranjang />} />
        </Route>

        {/* USER */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="reservasi" element={<Reservasi />} />
          <Route path="review" element={<Review />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RequireAdminAuth>
              <AdminLayout />
            </RequireAdminAuth>
          }
        >
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
