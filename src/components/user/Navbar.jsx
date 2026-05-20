import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoSigma from "../../assets/Logo Sigma.png";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Reservasi", href: "/reservasi" },
  { label: "Review", href: "/review" },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeIndex = Math.max(
    navLinks.findIndex((link) =>
      link.href === "/"
        ? location.pathname === "/" || location.pathname === "/home"
        : location.pathname === link.href
    ),
    0
  );
  const ctaLink =
    location.pathname === "/reservasi"
      ? { href: "/menu", label: "Menu" }
      : { href: "/reservasi", label: "Reservasi" };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[95px] bg-[#091421]/90 px-6 py-4 shadow-[0_0_40px_rgba(220,38,38,0.05)] backdrop-blur-md">
      <Link
        to="/"
        className="absolute left-4 top-1/2 flex h-10 w-[173px] -translate-y-1/2 items-center justify-start transition duration-300 hover:opacity-90"
        onClick={() => setMenuOpen(false)}
      >
        <img
          src={logoSigma}
          alt="Kedai Sigma"
          className="h-20 w-[190px] -translate-x-4 object-cover object-center mix-blend-screen"
        />
      </Link>

      <nav className="absolute left-1/2 top-1/2 hidden h-10 w-[430px] -translate-x-1/2 -translate-y-1/2 grid-cols-4 items-center justify-items-center md:grid">
        <span
          className="pointer-events-none absolute bottom-0 h-1 w-16 -translate-x-1/2 bg-[#DC2626] transition-[left] duration-300 ease-out"
          style={{
            left: `${activeIndex * 25 + 12.5}%`,
          }}
        />
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? location.pathname === "/" || location.pathname === "/home"
              : location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex h-10 items-start justify-center pt-1 font-grotesk text-base uppercase leading-6 tracking-normal transition-colors ${
                isActive
                  ? "font-bold text-[#FFB4AB]"
                  : "font-black text-[#94A3B8] hover:text-[#D9E3F6]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link
        to={ctaLink.href}
        className="absolute right-6 top-1/2 hidden h-10 w-[173px] -translate-y-1/2 items-center justify-center bg-[#DC2626] px-6 py-2 text-center font-grotesk text-base font-bold uppercase leading-6 text-[#FFF6F5] transition-colors hover:bg-red-700 md:flex"
      >
        {ctaLink.label}
      </Link>

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
        <div className="absolute left-0 right-0 top-[95px] flex flex-col gap-4 border-t border-[#16202E] bg-[#091421] p-6 md:hidden">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? location.pathname === "/" || location.pathname === "/home"
                : location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-grotesk text-base font-black uppercase tracking-normal ${
                  isActive ? "text-[#FFB4AB]" : "text-[#94A3B8]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            to={ctaLink.href}
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center bg-[#DC2626] px-6 py-3 font-grotesk text-base font-bold uppercase text-[#FFF6F5]"
          >
            {ctaLink.label}
          </Link>
        </div>
      )}
    </header>
  );
}
