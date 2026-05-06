import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-[#091421] pt-[95px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
