import { useMemo, useState } from "react";
import heroImage from "../../../assets/hero.png";
import fotoKedai1 from "../../../assets/Foto Kedai 1.png";
import fotoKedai2 from "../../../assets/Foto Kedai 2.PNG";
import fotoKedai3 from "../../../assets/Foto Kedai 3.PNG";

const INITIAL_VISIBLE_COUNT = 9;
const LOAD_MORE_COUNT = 6;

const filters = [
  { label: "All Menu", value: "all" },
  { label: "Kopi", value: "kopi" },
  { label: "Non Kafein", value: "non-kafein" },
  { label: "Food", value: "food" },
];

const menuItems = [
  {
    name: "ICE coffee bear",
    description: "Minuman kopi segar dengan karakter rasa ringan dan aroma khas kopi.",
    price: "IDR 16K",
    category: "kopi",
    image: heroImage,
  },
  {
    name: "HOT espresso",
    description: "Ekstrak kopi murni dengan rasa kuat dan aroma pekat.",
    price: "IDR 8K",
    category: "kopi",
    image: heroImage,
  },
  {
    name: "HOT / ICE Americano",
    description: "Espresso yang dicampur air panas menghasilkan rasa kopi yang ringan.",
    price: "IDR 10K/13K",
    category: "kopi",
    image: heroImage,
  },
  {
    name: "HOT kopi tubruk",
    description: "Kopi hitam tradisional dengan bubuk kopi asli.",
    price: "IDR 8K",
    category: "kopi",
    image: fotoKedai1,
  },
  {
    name: "V60 drip",
    description: "Kopi manual brew dengan metode drip yang menghasilkan rasa clean dan aromatik.",
    price: "IDR 10K",
    category: "kopi",
    image: fotoKedai2,
  },
  {
    name: "ICE coffee milk chocholate",
    description: "Perpaduan kopi, susu, dan coklat yang creamy dan manis.",
    price: "IDR 15K",
    category: "kopi",
    image: heroImage,
  },
  {
    name: "ICE coffe milk",
    description: "Kopi susu klasik dengan rasa seimbang antara pahit dan creamy.",
    price: "IDR 13K",
    category: "kopi",
    image: fotoKedai3,
  },
  {
    name: "HOT / ICE coffe latte",
    description: "Espresso dengan susu steamed yang lembut dan ringan.",
    price: "IDR 15K/13K",
    category: "kopi",
    image: heroImage,
  },
  {
    name: "Ice milo",
    description: "Minuman coklat malt favorit dengan rasa manis dan creamy.",
    price: "IDR 13K",
    category: "non-kafein",
    image: fotoKedai2,
  },
  {
    name: "Indomie Nyemek Halu",
    description: "Indomie hangat dengan kuah pekat, pedas tipis, dan vibes begadang.",
    price: "IDR 15K",
    category: "food",
    image: fotoKedai1,
  },
  {
    name: "French Fries",
    description: "Kentang goreng renyah buat teman ngobrol dan nunggu pesanan kopi.",
    price: "IDR 12K",
    category: "food",
    image: fotoKedai3,
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21 21-4.35-4.35" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FilterButton({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-skew-x-12 border px-7 py-2 font-['Space_Grotesk',sans-serif] text-base font-black uppercase leading-6 tracking-[-0.05em] transition ${
        active
          ? "border-[#EEC200] bg-[#EEC200] text-[#3C2F00]"
          : "border-[#5C403C]/20 bg-[#212B39] text-[#D9E3F6] hover:border-[#5C403C]/60"
      }`}
    >
      <span className="block skew-x-12">{item.label}</span>
    </button>
  );
}

function MenuCard({ item, index }) {
  return (
    <article
      className="group flex min-h-[540px] flex-col bg-[#121C2A] p-6 opacity-0 shadow-[0_0_40px_rgba(220,38,38,0.1)] transition-[transform,background-color,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:bg-[#16202E] hover:shadow-[0_18px_48px_rgba(220,38,38,0.16)]"
      style={{
        animation: "menu-card-in 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        animationDelay: `${Math.min(index % LOAD_MORE_COUNT, 5) * 70}ms`,
      }}
    >
      <div className="relative h-[336px] overflow-hidden bg-[#212B39]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/0" />
        <span className="absolute right-0 top-0 bg-[#091421]/80 px-4 py-3 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-[0.12em] text-[#EEC200]">
          {item.category}
        </span>
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <div className="pb-6">
          <h3 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase leading-8 tracking-[-0.05em] text-[#D9E3F6]">
            {item.name}
          </h3>
          <p className="mt-2 font-['Be_Vietnam_Pro',sans-serif] text-sm leading-5 text-[#E6BDB8]">
            {item.description}
          </p>
        </div>

        <p className="mt-auto font-['Space_Grotesk',sans-serif] text-xl font-bold leading-7 text-[#4AE176]">
          {item.price}
        </p>
      </div>
    </article>
  );
}

export default function Menu() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.category === activeFilter;
      const matchesSearch =
        keyword.length === 0 ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const visibleItems = useMemo(() => {
    if (filteredItems.length === 0) {
      return [];
    }

    return Array.from({ length: visibleCount }, (_, index) => ({
      ...filteredItems[index % filteredItems.length],
      cloneId: index,
    }));
  }, [filteredItems, visibleCount]);

  function handleFilterChange(value) {
    setActiveFilter(value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  return (
    <div className="min-h-screen bg-[#091421] text-[#D9E3F6]">
      <div className="h-1 bg-[#050F1C]" />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 py-20 sm:px-8 lg:px-8 lg:py-24">
        <section className="flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <label className="relative block w-full max-w-sm">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#AC8884]">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="FIND YOUR MENU"
              className="h-[55px] w-full bg-[#121C2A] py-[17px] pl-12 pr-3 font-['Space_Grotesk',sans-serif] text-base font-bold leading-5 tracking-[-0.025em] text-[#D9E3F6] outline-none placeholder:text-[#5C403C] focus:ring-2 focus:ring-[#EEC200]"
            />
          </label>

          <div className="max-w-xl lg:text-right">
            <p className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 tracking-[0.2em] text-[#EEC200]">
              Kedai Sigma Menu
            </p>
            <h1 className="mt-2 font-['Space_Grotesk',sans-serif] text-4xl font-black uppercase leading-none tracking-[-0.05em] text-[#D9E3F6] sm:text-5xl">
              Find your menu
            </h1>
          </div>
        </section>

        <section className="flex w-full flex-wrap gap-4">
          {filters.map((item) => (
            <FilterButton
              key={item.value}
              item={item}
              active={activeFilter === item.value}
              onClick={() => handleFilterChange(item.value)}
            />
          ))}
        </section>

        <section className="grid w-full gap-8 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item, index) => (
            <MenuCard
              key={`${item.name}-${item.cloneId}`}
              item={item}
              index={index}
            />
          ))}
        </section>

        {filteredItems.length === 0 && (
          <div className="bg-[#121C2A] p-10 text-center font-['Space_Grotesk',sans-serif] text-xl font-bold uppercase text-[#94A3B8]">
            Menu tidak ditemukan
          </div>
        )}

        {filteredItems.length > 0 && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + LOAD_MORE_COUNT)}
              className="group flex h-[60px] items-center gap-3 bg-[#EEC200] px-12 py-5 font-['Space_Grotesk',sans-serif] text-sm font-black uppercase leading-5 tracking-[0.2em] text-[#3C2F00] shadow-[8px_8px_0_#3C2F00] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[10px_10px_0_#3C2F00] active:translate-y-0 active:shadow-[4px_4px_0_#3C2F00]"
            >
              Tampilkan lebih banyak
              <span className="transition duration-300 group-hover:translate-y-0.5">
                <ChevronDown />
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
