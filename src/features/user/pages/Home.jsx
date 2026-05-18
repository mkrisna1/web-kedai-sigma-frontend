import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import fotoKedai1 from "../../../assets/Foto Kedai 1.png";
import fotoKedai2 from "../../../assets/Foto Kedai 2.PNG";
import fotoKedai3 from "../../../assets/Foto Kedai 3.PNG";
import lokasiSigma from "../../../assets/Lokasi_Sigma.png";
import coffeLatteImage from "../../../assets/Coffee Latte.webp";
import espressoImage from "../../../assets/Espresso.webp";
import matchaImage from "../../../assets/Matcha.jpg";
import indomieNyemekHaluImage from "../../../assets/Indomie Nyemek Halu.jpg";

const stats = [
  { value: "5 dari 5", label: "Rating Kedai", color: "#EEC200" },
  { value: "16:00-00:00", label: "Jam Buka", color: "#4AE176" },
  { value: "32", label: "Total Menu", color: "#DC2626" },
  { value: "Rp 13.000", label: "Harga rata-rata menu", color: "#AC8884" },
];

const menuCards = [
  {
    category: "Kopi Susu",
    name: "Coffee Latte",
    price: "IDR13K",
    accent: "#4AE176",
    image: coffeLatteImage,
  },
  {
    category: "Susu",
    name: "Matcha",
    price: "IDR13K",
    accent: "#4AE176",
    image: matchaImage,
  },
  {
    category: "Makanan",
    name: "Indomie Nyemek Halu",
    price: "IDR15K",
    accent: "#4AE176",
    image: indomieNyemekHaluImage,
  },
];

const gallery = [
  { label: "Kedai Sigma", image: fotoKedai1 },
  { label: "Bar Kopi", image: fotoKedai2 },
  { label: "Underground Vibes", image: fotoKedai3 },
];

const galleryLoop = [...gallery, ...gallery];

function SkewLabel({ children, className = "bg-[#EEC200] text-[#3C2F00]" }) {
  return (
    <span
      className={`inline-flex -skew-x-12 px-4 py-1 font-['Space_Grotesk',sans-serif] text-sm font-bold uppercase leading-6 ${className}`}
    >
      <span className="skew-x-12">{children}</span>
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex w-full items-end gap-6">
      <h2 className="shrink-0 font-['Space_Grotesk',sans-serif] text-5xl font-bold uppercase leading-none tracking-[-0.05em] text-[#D9E3F6] md:text-7xl">
        {children}
      </h2>
      <div className="mb-3 h-1 flex-1 bg-[#2B3544]" />
    </div>
  );
}

function StatIcon({ type, className = "h-7 w-7" }) {
  const icons = {
    rating: (
      <path d="m12 2 2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 16.81l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2Z" />
    ),
    clock: (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v4.58l3.2 3.2-1.42 1.42L11 12.42V7h2Z" />
    ),
    menu: (
      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4v2h10V7H7Zm0 4v2h10v-2H7Zm0 4v2h6v-2H7Z" />
    ),
    price: (
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM8 8.5A1.5 1.5 0 1 0 8 5a1.5 1.5 0 0 0 0 3.5Z" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {icons[type]}
    </svg>
  );
}

function CoffeeIcon({ className = "h-12 w-10" }) {
  return (
    <svg
      viewBox="0 0 40 48"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 16h22v12c0 6.63-5.37 12-12 12S6 34.63 6 28V18c0-1.1.9-2 2-2Z"
        fill="currentColor"
      />
      <path
        d="M30 20h2a6 6 0 0 1 0 12h-2v-4h2a2 2 0 0 0 0-4h-2v-4ZM12 4c0 3-2 3-2 6M20 4c0 3-2 3-2 6M28 4c0 3-2 3-2 6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M4 42h28v4H4v-4Z" fill="currentColor" />
    </svg>
  );
}

function MapPinIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
    </svg>
  );
}

function ArrowDownIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  const locationSectionRef = useRef(null);
  const locationCardRef = useRef(null);
  const locationPulseTimer = useRef(null);
  const locationScrollFrame = useRef(null);
  const [locationPulse, setLocationPulse] = useState(false);
  const [locationScrollActive, setLocationScrollActive] = useState(false);

  useEffect(() => {
    return () => {
      if (locationPulseTimer.current) {
        window.clearTimeout(locationPulseTimer.current);
      }

      if (locationScrollFrame.current) {
        window.cancelAnimationFrame(locationScrollFrame.current);
      }
    };
  }, []);

  function scrollToLocation(target, onComplete) {
    const headerOffset = 95;
    const startY = window.scrollY;
    const targetY =
      window.scrollY + target.getBoundingClientRect().top - headerOffset;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const endY = Math.min(Math.max(targetY, 0), maxY);
    const distance = endY - startY;

    if (locationScrollFrame.current) {
      window.cancelAnimationFrame(locationScrollFrame.current);
    }

    if (Math.abs(distance) < 2) {
      onComplete();
      return;
    }

    const startTime = window.performance.now();
    const duration = Math.min(1800, Math.max(1300, Math.abs(distance) * 0.45));
    const easeInOutCubic = (progress) =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - (-2 * progress + 2) ** 3 / 2;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        locationScrollFrame.current = window.requestAnimationFrame(animate);
        return;
      }

      locationScrollFrame.current = null;
      onComplete();
    };

    locationScrollFrame.current = window.requestAnimationFrame(animate);
  }

  function handleLocationClick(event) {
    event.preventDefault();

    const target = locationSectionRef.current ?? document.getElementById("location");

    if (!target) {
      return;
    }

    if (locationPulseTimer.current) {
      window.clearTimeout(locationPulseTimer.current);
    }

    setLocationPulse(false);
    setLocationScrollActive(true);

    scrollToLocation(target, () => {
      setLocationScrollActive(false);
      setLocationPulse(true);

      if (window.history?.replaceState) {
        window.history.replaceState(null, "", "#location");
      }

      locationPulseTimer.current = window.setTimeout(
        () => setLocationPulse(false),
        1500
      );
    });
  }

  return (
    <div className="min-h-screen bg-[#091421] text-[#D9E3F6]">
      <div className="h-1 bg-[#050F1C]" />

      <section className="relative isolate flex min-h-[921px] items-center overflow-hidden px-6 py-24 md:px-24">
        <div className="pointer-events-none absolute left-[22%] top-[25%] -z-10 select-none font-['Space_Grotesk',sans-serif] text-[180px] font-black uppercase leading-none tracking-[-0.05em] text-[#DC2626]/20 md:text-[400px]">
          SIGMA
        </div>

        <div className="w-full max-w-[1088px]">
          <SkewLabel>EST. 2025 // DESA BULUSARI</SkewLabel>

          <h1 className="mt-6 font-['Space_Grotesk',sans-serif] text-7xl font-bold uppercase leading-[0.86] tracking-[-0.05em] text-[#D9E3F6] drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] md:text-[150px]">
            Kedai
          </h1>

          <p className="mt-6 max-w-[376px] font-['Be_Vietnam_Pro',sans-serif] text-xl font-medium leading-8 text-[#E6BDB8] md:text-2xl">
            Di sini tempat kumpulan orang-orang yang sigma. Kopi terbaik,
            suasana underground, vibes paling kenceng.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/menu"
              className="group flex h-[72px] w-full items-center justify-center gap-3 bg-[#DC2626] px-10 py-5 font-['Space_Grotesk',sans-serif] text-xl font-black uppercase leading-7 text-[#FFF6F5] shadow-[8px_8px_0_#5C0C0C] transition duration-300 ease-out hover:-translate-y-1 hover:bg-red-700 hover:shadow-[10px_10px_0_#5C0C0C] active:translate-y-0 active:shadow-[4px_4px_0_#5C0C0C] sm:w-[224px]"
            >
              <span>Lihat Menu</span>
              <span className="transition duration-300 ease-out group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </Link>
            <a
              href="#location"
              onClick={handleLocationClick}
              aria-controls="location"
              className={`location-scroll-trigger group relative flex h-[72px] w-full items-center justify-center gap-2 overflow-hidden border-2 border-[#5C403C] px-4 py-5 font-['Space_Grotesk',sans-serif] text-lg font-bold uppercase leading-7 text-[#D9E3F6] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#EEC200] hover:bg-[#EEC200] hover:text-[#3C2F00] hover:shadow-[0_16px_34px_rgba(238,194,0,0.18)] active:translate-y-0 sm:w-[236px] sm:text-xl ${
                locationScrollActive ? "location-scroll-active" : ""
              }`}
            >
              <span className="location-scroll-pin flex h-8 w-8 items-center justify-center bg-[#EEC200] text-[#3C2F00] transition duration-300 ease-out group-hover:-translate-y-0.5 group-hover:bg-[#3C2F00] group-hover:text-[#EEC200]">
                <MapPinIcon className="h-4 w-4" />
              </span>
              <span>Our Location</span>
              <span className="location-scroll-arrow transition duration-300 ease-out group-hover:translate-y-1">
                <ArrowDownIcon />
              </span>
            </a>
          </div>

          <div className="mt-24 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <article
                key={item.label}
                className="stat-card-motion min-h-[132px] min-w-0 border-l-4 bg-[#121C2A] p-6 opacity-0 transition duration-300 hover:-translate-y-2 hover:bg-[#16202E] hover:shadow-[0_18px_45px_rgba(220,38,38,0.18)]"
                style={{
                  animation:
                    "stat-card-in 620ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  animationDelay: `${220 + index * 80}ms`,
                  borderColor: item.color,
                }}
              >
                <div style={{ color: item.color }}>
                  <StatIcon
                    type={["rating", "clock", "menu", "price"][index]}
                  />
                </div>
                <p
                  className="mt-3 whitespace-nowrap font-['Space_Grotesk',sans-serif] text-[32px] font-bold leading-10 md:text-4xl xl:text-[32px] 2xl:text-4xl"
                  style={{ color: item.color }}
                >
                  {item.value}
                </p>
                <p className="mt-1 font-['Space_Grotesk',sans-serif] text-sm font-bold uppercase leading-5 tracking-[0.1em] text-[#E6BDB8]">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050F1C] px-6 py-24 md:px-24">
        <div className="mx-auto flex max-w-[1088px] flex-col gap-16">
          <SectionTitle>Menu Favorit</SectionTitle>

          <div className="grid gap-6 lg:grid-cols-3">
            <article
              className="favorite-card-motion group relative min-h-[500px] overflow-hidden bg-[#16202E] opacity-0 shadow-[0_0_40px_rgba(220,38,38,0.12)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(220,38,38,0.24)] lg:col-span-2"
              style={{
                animation:
                  "favorite-card-in 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <img
                src={espressoImage}
                alt="Espresso"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition duration-500 group-hover:from-black/95 group-hover:via-black/10" />
              <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-0 transition duration-700 group-hover:translate-x-[120%] group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                <div className="transition duration-500 ease-out group-hover:-translate-y-1">
                  <SkewLabel className="bg-[#4AE176] text-[#003915]">
                    Terlaris
                  </SkewLabel>
                </div>
                <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold uppercase leading-10 tracking-[-0.05em] transition duration-500 ease-out group-hover:text-[#FFF6F5]">
                      Espresso
                    </h3>
                    <p className="mt-2 font-['Be_Vietnam_Pro',sans-serif] text-base leading-6 text-[#E6BDB8]">
                      Ekstrak kopi murni dengan rasa kuat dan aroma pekat.
                    </p>
                  </div>
                  <p className="font-['Space_Grotesk',sans-serif] text-5xl font-bold leading-none text-[#EEC200] transition duration-500 ease-out group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_14px_rgba(238,194,0,0.45)]">
                    IDR8k
                  </p>
                </div>
              </div>
            </article>

            <article
              className="favorite-card-motion group relative flex min-h-[500px] flex-col justify-between overflow-hidden border-t-8 border-[#DC2626] bg-[#212B39] p-8 opacity-0 shadow-[0_0_32px_rgba(220,38,38,0.1)] transition-[transform,box-shadow,background-color] duration-500 ease-out hover:-translate-y-2 hover:bg-[#263241] hover:shadow-[0_20px_52px_rgba(220,38,38,0.18)]"
              style={{
                animation:
                  "favorite-card-in 700ms 110ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div className="pointer-events-none absolute right-[-54px] top-[-54px] h-36 w-36 rounded-full border border-[#DC2626]/30 transition duration-700 group-hover:scale-125 group-hover:border-[#EEC200]/40" />
              <div>
                <div className="text-[#DC2626] transition duration-500 ease-out group-hover:-translate-y-2 group-hover:text-[#EEC200]">
                  <CoffeeIcon />
                </div>
                <h3 className="mt-9 font-['Space_Grotesk',sans-serif] text-4xl font-bold uppercase leading-10 tracking-[-0.05em]">
                  Americano
                </h3>
                <p className="mt-4 font-['Be_Vietnam_Pro',sans-serif] text-base leading-6 text-[#E6BDB8]">
                  Espresso yang dicampur air panas menghasilkan rasa kopi yang
                  ringan.
                </p>
              </div>
              <p className="pt-8 font-['Space_Grotesk',sans-serif] text-5xl font-bold leading-[56px] text-[#EEC200]">
                IDR10k
              </p>
            </article>

            {menuCards.map((item, index) => (
              <article
                key={item.name}
                className="favorite-card-motion group relative min-h-[400px] overflow-hidden bg-[#121C2A] opacity-0 shadow-[0_0_30px_rgba(220,38,38,0.1)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(74,225,118,0.15)]"
                style={{
                  animation:
                    "favorite-card-in 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  animationDelay: `${220 + index * 90}ms`,
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 transition duration-500 group-hover:bg-black/25" />
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition duration-500 ease-out group-hover:scale-x-100" style={{ backgroundColor: item.accent }} />
                <div className="absolute left-4 top-4 transition duration-500 ease-out group-hover:-translate-y-1">
                  <SkewLabel className="bg-[#2B3544] text-[#D9E3F6]">
                    {item.category}
                  </SkewLabel>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 transition duration-500 ease-out group-hover:-translate-y-2">
                  <h3 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase leading-8 transition duration-500 group-hover:text-[#FFF6F5]">
                    {item.name}
                  </h3>
                  <p
                    className="font-['Space_Grotesk',sans-serif] text-[28px] font-bold leading-[48px] transition duration-500 group-hover:drop-shadow-[0_0_12px_rgba(74,225,118,0.35)]"
                    style={{ color: item.accent }}
                  >
                    {item.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-8 border-[#050F1C] bg-[#091421] px-6 py-24 md:px-24">
        <div className="mx-auto flex max-w-[1088px] flex-col gap-16">
          <SectionTitle>Foto Kedai</SectionTitle>
          <div className="overflow-hidden">
            <div className="flex w-max gap-8 animate-[slide-left_24s_linear_infinite] hover:[animation-play-state:paused]">
              {galleryLoop.map((item, index) => (
                <figure
                  key={`${item.label}-${index}`}
                  className="group h-[455px] w-[341px] shrink-0 overflow-hidden bg-[#16202E] transition duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_22px_52px_rgba(220,38,38,0.18)]"
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="location"
        ref={locationSectionRef}
        className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-[#050F1C] px-6 py-24"
      >
        <img
          src={lokasiSigma}
          alt="Lokasi Kedai Sigma"
          className="location-map-motion absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#050F1C]/40" />

        <div className="relative z-10 flex w-full max-w-[1088px] flex-col items-center gap-8">
          <div className="flex h-[63px] items-center justify-center">
            <MapPinIcon className="location-pin-motion h-[60px] w-[60px] text-[#DC2626]" />
          </div>

          <div
            ref={locationCardRef}
            className={`location-card-motion group relative w-full max-w-[448px] overflow-hidden border-2 border-[#DC2626] bg-[#091421]/95 p-10 text-center shadow-[0_0_0_rgba(238,194,0,0)] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-[#EEC200] hover:shadow-[0_20px_55px_rgba(220,38,38,0.22)] ${
              locationPulse ? "location-focus-ring" : ""
            }`}
            tabIndex="-1"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(238,194,0,0.16),transparent_48%)] opacity-0 transition duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#EEC200] transition duration-500 ease-out group-hover:scale-x-100" />

            <div className="relative">
              <h2 className="font-['Space_Grotesk',sans-serif] text-4xl font-black uppercase leading-10 tracking-[-0.05em]">
                Lokasi
              </h2>
              <p className="mt-4 font-['Be_Vietnam_Pro',sans-serif] text-sm uppercase leading-5 tracking-[0.1em] text-[#E6BDB8]">
                CM9M+5M2, Blimbing, Bulusari, Kec. Gempol, Pasuruan, Jawa
                Timur
              </p>
              <a
                href="https://www.google.com/maps/place/Kedai+sigma/@-7.5830068,112.6849278,2052m/data=!3m1!1e3!4m6!3m5!1s0x2dd7df006f54af3b:0xf79fc24e5225303b!8m2!3d-7.5821219!4d112.6841547!16s%2Fg%2F11yg6j139l?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="group/maps mt-8 flex h-14 items-center justify-center gap-2 bg-[#DC2626] px-5 font-['Space_Grotesk',sans-serif] text-base font-bold uppercase text-[#FFF6F5] shadow-[6px_6px_0_rgba(92,12,12,0.8)] outline-none transition duration-300 ease-out hover:-translate-y-1 hover:bg-red-700 hover:shadow-[8px_8px_0_rgba(92,12,12,0.8)] focus-visible:ring-2 focus-visible:ring-[#EEC200] focus-visible:ring-offset-4 focus-visible:ring-offset-[#091421] active:translate-y-0 active:shadow-[3px_3px_0_rgba(92,12,12,0.8)]"
              >
                Buka di Google Maps
                <span className="transition duration-300 ease-out group-hover/maps:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </a>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 hidden w-[171px] md:block">
            <div className="bg-[#EEC200] px-4 py-1 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-[0.1em] text-[#3C2F00]">
              Jam Operasional
            </div>
            <div className="border-l-4 border-[#EEC200] bg-[#212B39] p-4">
              <p className="font-['Be_Vietnam_Pro',sans-serif] text-lg font-bold leading-7">
                Daily: 16:00 - 00:00
              </p>
              <p className="mt-4 font-['Be_Vietnam_Pro',sans-serif] text-sm leading-5 text-[#E6BDB8]">
                Ayok mampir ke kedai sigma!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
