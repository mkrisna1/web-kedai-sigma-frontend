import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoSigma from "../../assets/Logo Sigma.png";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Reservasi", href: "/reservasi" },
  { label: "Review", href: "/review" },
];

const scrollPageToTop = () => {
  if (typeof window === "undefined") {
    return;
  }

  const options = { top: 0, left: 0, behavior: "smooth" };

  window.scrollTo(options);
  window.requestAnimationFrame?.(() => window.scrollTo(options));
};

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleNavigate = () => {
    setMenuOpen(false);
    scrollPageToTop();
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[86px] border-b border-white/5 bg-[#091421]/92 px-4 py-3 shadow-[0_14px_46px_rgba(0,0,0,0.18)] backdrop-blur-md sm:px-6">
      <Link
        to="/"
        className="absolute left-4 top-1/2 flex h-12 w-[162px] -translate-y-1/2 items-center justify-start rounded-full transition duration-300 hover:opacity-90"
        onClick={handleNavigate}
      >
        <img
          src={logoSigma}
          alt="Kedai Sigma"
          className="h-20 w-[184px] -translate-x-5 object-cover object-center mix-blend-screen"
        />
      </Link>

      <nav className="absolute left-1/2 top-1/2 hidden h-12 w-[520px] -translate-x-1/2 -translate-y-1/2 grid-cols-4 items-center justify-items-center md:grid">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? location.pathname === "/" || location.pathname === "/home"
              : location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={handleNavigate}
              className={`relative flex h-12 items-center justify-center px-4 font-grotesk text-lg font-black uppercase leading-6 tracking-normal transition-colors after:absolute after:bottom-0 after:left-1/2 after:h-1 after:-translate-x-1/2 after:bg-[#DC2626] after:transition-all ${
                isActive
                  ? "text-[#FFB4AB] after:w-16"
                  : "text-[#94A3B8] after:w-0 hover:text-[#D9E3F6]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-1.5 p-2 md:hidden"
        onClick={() => setMenuOpen((current) => !current)}
        aria-label="Buka menu navigasi"
        aria-expanded={menuOpen}
      >
        <span
          className={`block h-0.5 w-6 bg-[#D9E3F6] transition-all ${
            menuOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-[#D9E3F6] transition-all ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-[#D9E3F6] transition-all ${
            menuOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {menuOpen && (
        <div className="fixed inset-x-0 top-[86px] z-40 max-h-[calc(100dvh-86px)] overflow-y-auto border-t border-white/5 bg-[#091421]/98 px-4 py-4 shadow-2xl backdrop-blur-md md:hidden">
          <div className="mx-auto flex w-full max-w-[360px] flex-col gap-2 rounded-2xl border border-white/10 bg-[#0D1828] p-3">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? location.pathname === "/" || location.pathname === "/home"
                  : location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={handleNavigate}
                  className={`flex h-12 items-center justify-between rounded-xl px-4 font-grotesk text-sm font-black tracking-normal transition ${
                    isActive
                      ? "bg-[#DC2626] text-white shadow-[0_12px_26px_rgba(220,38,38,0.22)]"
                      : "bg-[#121C2A] text-[#D9E3F6] hover:bg-[#16202E]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-[#EEC200]" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
