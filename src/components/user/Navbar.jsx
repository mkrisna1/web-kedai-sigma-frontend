import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoSigma from "../../assets/Logo Sigma.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Reservasi", href: "/reservasi" },
  { label: "Review", href: "/review" },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[95px] bg-[#091421]/90 px-6 py-4 shadow-[0_0_40px_rgba(220,38,38,0.05)] backdrop-blur-md">
      <Link
        to="/"
        className="absolute left-6 top-1/2 flex h-[176px] w-[440px] -translate-y-1/2 items-center"
        onClick={() => setMenuOpen(false)}
      >
        <img
          src={logoSigma}
          alt="Kedai Sigma"
          className="h-[176px] w-[440px] object-contain"
        />
      </Link>

      <nav className="absolute left-1/2 top-1/2 hidden h-8 -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex h-8 items-start border-b-4 font-grotesk text-base uppercase leading-6 tracking-[-0.05em] transition-colors ${
                isActive
                  ? "border-[#DC2626] pb-1 font-bold text-[#FFB4AB]"
                  : "border-transparent font-black text-[#94A3B8] hover:text-[#D9E3F6]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link
        to="/reservasi"
        className="absolute right-6 top-1/2 hidden h-10 w-[173px] -translate-y-1/2 items-center justify-center bg-[#DC2626] px-6 py-2 text-center font-grotesk text-base font-bold uppercase leading-6 text-[#FFF6F5] transition-colors hover:bg-red-700 md:flex"
      >
        RESERVE NOW
      </Link>

      <button
        type="button"
        className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-1.5 p-2 md:hidden"
        onClick={() => setMenuOpen((current) => !current)}
        aria-label="Toggle menu"
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
        <div className="absolute left-0 right-0 top-[95px] flex flex-col gap-4 border-t border-[#16202E] bg-[#091421] p-6 md:hidden">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-grotesk text-base font-black uppercase tracking-[-0.05em] ${
                  isActive ? "text-[#FFB4AB]" : "text-[#94A3B8]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            to="/reservasi"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center bg-[#DC2626] px-6 py-3 font-grotesk text-base font-bold uppercase text-[#FFF6F5]"
          >
            RESERVE NOW
          </Link>
        </div>
      )}
    </header>
  );
}
