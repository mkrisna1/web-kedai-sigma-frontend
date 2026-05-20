import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function ArrowUpIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

export default function ScrollToTopButton() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimer = useRef(null);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => setIsVisible(window.scrollY > 420);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (animationTimer.current) {
        window.clearTimeout(animationTimer.current);
      }
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleClick = () => {
    if (animationTimer.current) {
      window.clearTimeout(animationTimer.current);
    }

    setIsAnimating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    animationTimer.current = window.setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  return createPortal(
    <button
      type="button"
      onClick={handleClick}
      aria-label="Kembali ke atas"
      className={`fixed bottom-7 right-7 z-40 flex h-16 w-16 items-center justify-center border-2 border-[#EEC200] bg-[#DC2626] text-[#FFF6F5] shadow-[8px_8px_0_#3C2F00] transition duration-300 ease-out will-change-transform hover:-translate-y-1 hover:bg-red-700 hover:shadow-[10px_10px_0_#3C2F00] focus:outline-none focus:ring-2 focus:ring-[#EEC200] focus:ring-offset-2 focus:ring-offset-[#091421] ${
        isVisible
          ? "translate-y-0 opacity-100 animate-[scroll-top-enter_360ms_cubic-bezier(0.16,1,0.3,1)]"
          : "pointer-events-none translate-y-10 opacity-0"
      } ${
        isAnimating ? "animate-[scroll-top-lift_760ms_cubic-bezier(0.16,1,0.3,1)]" : ""
      }`}
    >
      <ArrowUpIcon />
    </button>,
    document.body,
  );
}
