import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getAdminToken } from "../services/api";
import logoSigma from "../assets/Logo Sigma.png";

const Home = lazy(() => import("../features/user/pages/Home"));
const Menu = lazy(() => import("../features/user/pages/Menu"));
const Reservasi = lazy(() => import("../features/user/pages/Reservasi"));
const Review = lazy(() => import("../features/user/pages/Review"));
const MainLayout = lazy(() => import("../layouts/user/MainLayout"));
const QRLayout = lazy(() => import("../layouts/qr/QRLayout"));
const QRMenu = lazy(() => import("../features/qr/pages/QRMenu"));
const Keranjang = lazy(() => import("../features/qr/pages/Keranjang"));
const Login = lazy(() => import("../features/admin/pages/Login"));
const StrukAdmin = lazy(() => import("../features/admin/pages/StrukAdmin"));
const AdminLayout = lazy(() => import("../layouts/admin/AdminLayout"));
const Dashboard = lazy(() => import("../features/admin/pages/Dashboard"));
const Pesanan = lazy(() => import("../features/admin/pages/Pesanan"));
const MenuAdmin = lazy(() => import("../features/admin/pages/MenuAdmin"));
const MejaAdmin = lazy(() => import("../features/admin/pages/MejaAdmin"));
const ReservasiAdmin = lazy(() => import("../features/admin/pages/ReservasiAdmin"));
const ReviewAdmin = lazy(() => import("../features/admin/pages/ReviewAdmin"));
const Laporan = lazy(() => import("../features/admin/pages/Laporan"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#091421] px-6 text-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-[#EEC200]/25 bg-[#111C2A] shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
          <img
            src={logoSigma}
            alt="Kedai Sigma"
            className="h-16 w-24 object-cover object-center mix-blend-screen"
          />
          <span className="absolute -bottom-2 h-1.5 w-16 overflow-hidden rounded-full bg-[#243244]">
            <span className="block h-full w-8 animate-[loading-bar_900ms_ease-in-out_infinite] rounded-full bg-[#EEC200]" />
          </span>
        </div>
        <p className="font-['Space_Grotesk',Arial,sans-serif] text-sm font-black tracking-normal text-[#D9E3F6]">
          Memuat Kedai Sigma...
        </p>
      </div>
    </div>
  );
}

function RequireAdminAuth({ children }) {
  const location = useLocation();
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function DashboardShortcut() {
  const token = getAdminToken();

  return <Navigate to={token ? "/admin/dashboard" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/struk/:id" element={<StrukAdmin />} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
