import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-[#091421] pt-[95px]">
        <div key={location.pathname} className="page-route-transition">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
