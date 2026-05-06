import { Link } from "react-router-dom";
import heroImage from "../../../assets/hero.png";
import fotoKedai1 from "../../../assets/Foto Kedai 1.png";
import fotoKedai2 from "../../../assets/Foto Kedai 2.PNG";
import fotoKedai3 from "../../../assets/Foto Kedai 3.PNG";
import lokasiSigma from "../../../assets/Lokasi_Sigma.png";

const stats = [
  { value: "5 dari 5", label: "Rating Kedai", color: "#EEC200" },
  { value: "16:00-00:00", label: "Jam Buka", color: "#4AE176" },
  { value: "32", label: "Total Menu", color: "#DC2626" },
  { value: "Rp 13.000", label: "Harga rata-rata menu", color: "#AC8884" },
];

const menuCards = [
  {
    category: "Coffee-Milk",
    name: "Coffee Latte",
    price: "IDR13K",
    accent: "#4AE176",
  },
  {
    category: "Non Kafein",
    name: "Matcha",
    price: "IDR13K",
    accent: "#4AE176",
  },
  {
    category: "Food",
    name: "Indomie Nyemek Halu",
    price: "IDR15K",
    accent: "#4AE176",
  },
];

const gallery = [
  { label: "Kedai Sigma", image: fotoKedai1 },
  { label: "Coffee Bar", image: fotoKedai2 },
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

export default function Home() {
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
              className="flex h-[72px] w-full items-center justify-center bg-[#DC2626] px-10 py-5 font-['Space_Grotesk',sans-serif] text-xl font-black uppercase leading-7 text-[#FFF6F5] transition hover:bg-red-700 sm:w-[224px]"
            >
              Lihat Menu
            </Link>
            <a
              href="#location"
              className="flex h-[72px] w-full items-center justify-center border-2 border-[#5C403C] px-10 py-5 font-['Space_Grotesk',sans-serif] text-xl font-bold uppercase leading-7 text-[#D9E3F6] transition hover:border-[#AC8884] sm:w-[190px]"
            >
              Our Location
            </a>
          </div>

          <div className="mt-24 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <article
                key={item.label}
                className="min-h-[132px] min-w-0 border-l-4 bg-[#121C2A] p-6 transition duration-300 hover:-translate-y-2 hover:bg-[#16202E] hover:shadow-[0_18px_45px_rgba(220,38,38,0.18)]"
                style={{ borderColor: item.color }}
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
            <article className="relative min-h-[500px] overflow-hidden bg-[#16202E] lg:col-span-2">
              <img
                src={heroImage}
                alt="Espresso"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                <SkewLabel className="bg-[#4AE176] text-[#003915]">
                  Best Seller
                </SkewLabel>
                <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold uppercase leading-10 tracking-[-0.05em]">
                      Espresso
                    </h3>
                    <p className="mt-2 font-['Be_Vietnam_Pro',sans-serif] text-base leading-6 text-[#E6BDB8]">
                      Ekstrak kopi murni dengan rasa kuat dan aroma pekat.
                    </p>
                  </div>
                  <p className="font-['Space_Grotesk',sans-serif] text-5xl font-bold leading-none text-[#EEC200]">
                    IDR8k
                  </p>
                </div>
              </div>
            </article>

            <article className="flex min-h-[500px] flex-col justify-between border-t-8 border-[#DC2626] bg-[#212B39] p-8">
              <div>
                <div className="text-[#DC2626]">
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

            {menuCards.map((item) => (
              <article
                key={item.name}
                className="relative min-h-[400px] overflow-hidden bg-[#121C2A]"
              >
                <img
                  src={heroImage}
                  alt={item.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute left-4 top-4">
                  <SkewLabel className="bg-[#2B3544] text-[#D9E3F6]">
                    {item.category}
                  </SkewLabel>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase leading-8">
                    {item.name}
                  </h3>
                  <p
                    className="font-['Space_Grotesk',sans-serif] text-[28px] font-bold leading-[48px]"
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
                className="h-[455px] w-[341px] shrink-0 overflow-hidden bg-[#16202E]"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover"
                />
              </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="location"
        className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-[#050F1C] px-6 py-24"
      >
        <img
          src={lokasiSigma}
          alt="Lokasi Kedai Sigma"
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-[#050F1C]/40" />

        <div className="relative z-10 flex w-full max-w-[1088px] flex-col items-center gap-8">
          <div className="flex h-[63px] items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-[60px] w-[60px] text-[#DC2626]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
            </svg>
          </div>

          <div className="w-full max-w-[448px] border-2 border-[#DC2626] bg-[#091421]/95 p-10 text-center backdrop-blur-md">
            <h2 className="font-['Space_Grotesk',sans-serif] text-4xl font-black uppercase leading-10 tracking-[-0.05em]">
              Lokasi
            </h2>
            <p className="mt-4 font-['Be_Vietnam_Pro',sans-serif] text-sm uppercase leading-5 tracking-[0.1em] text-[#E6BDB8]">
              CM9M+5M2, Blimbing, Bulusari, Kec. Gempol, Pasuruan, Jawa Timur
            </p>
            <a
              href="https://www.google.com/maps/place/Kedai+sigma/@-7.5830068,112.6849278,2052m/data=!3m1!1e3!4m6!3m5!1s0x2dd7df006f54af3b:0xf79fc24e5225303b!8m2!3d-7.5821219!4d112.6841547!16s%2Fg%2F11yg6j139l?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex h-14 items-center justify-center bg-[#DC2626] font-['Space_Grotesk',sans-serif] text-base font-bold uppercase text-[#FFF6F5] transition hover:bg-red-700"
            >
              Buka di Google Maps
            </a>
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
