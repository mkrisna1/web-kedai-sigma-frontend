import { useMemo, useState } from "react";
import coklatClassicImage from "../../../assets/Coklat Classic.png";
import coklatClassicRotiImage from "../../../assets/Coklat Classic Roti.png";
import coffeeBearImage from "../../../assets/Coffee Bear.png";
import coffeeMilkImage from "../../../assets/Coffee Milk.png";
import coffeLatteImage from "../../../assets/Coffe Latte.png";
import coffeMilkV2Image from "../../../assets/Coffe Milk V2.png";
import coffeMilkChocholateImage from "../../../assets/Coffe Milk Chocholate.png";
import espressoImage from "../../../assets/Espresso.png";
import americanoImage from "../../../assets/Americano.png";
import ayamPopcornImage from "../../../assets/Ayam Popcorn.png";
import indomieNyemekHaluImage from "../../../assets/Indomie Nyemek Halu.png";
import indomieNyemekVinsenImage from "../../../assets/Indomie Nyemek Vinsen.png";
import joshuaImage from "../../../assets/Joshua.png";
import kentangImage from "../../../assets/Kentang.png";
import kopiTubrukImage from "../../../assets/Kopi Tubruk.png";
import kopiTubrukSusuImage from "../../../assets/Kopi Tubruk Susu.png";
import lemonTeaImage from "../../../assets/Lemon Tea.png";
import lycheeTeaImage from "../../../assets/Lychee Tea.png";
import matchaImage from "../../../assets/Matcha.png";
import miloImage from "../../../assets/Milo.png";
import mixPlatterImage from "../../../assets/Mix Platter.png";
import nuggetImage from "../../../assets/Nugget.png";
import piscokImage from "../../../assets/Piscok.png";
import redvelvetImage from "../../../assets/Redvelvet.png";
import risolMayoImage from "../../../assets/Risol Mayo.png";
import siomayAyamImage from "../../../assets/Siomay Ayam.png";
import sosisSoloImage from "../../../assets/Sosis Solo.png";
import strawberryMilkImage from "../../../assets/Strawberry Milk.png";
import tahuBaksoGorengImage from "../../../assets/Tahu Bakso Goreng.png";
import tehTarikImage from "../../../assets/Teh Tarik.png";
import v6DripImage from "../../../assets/V6 Drip.png";
import v6DripSusuImage from "../../../assets/V6 Drip Susu.png";

const INITIAL_VISIBLE_COUNT = 9;
const LOAD_MORE_COUNT = 6;

const filters = [
  { label: "All Menu", value: "all" },
  { label: "Food", value: "food" },
  { label: "Coffee Based", value: "coffee-based" },
  { label: "Coffee Milk", value: "coffee-milk" },
  { label: "Tea Series", value: "tea-series" },
  { label: "Milk Series", value: "milk-series" },
];

const menuItems = [
  {
    name: "Kentang",
    description: "Kentang goreng gurih untuk teman santai.",
    price: "IDR 10K",
    category: "food",
    categoryLabel: "Food",
    image: kentangImage,
  },
  {
    name: "Risol Mayo",
    description: "Risol renyah dengan isian mayo yang creamy.",
    price: "IDR 13K",
    category: "food",
    categoryLabel: "Food",
    image: risolMayoImage,
  },
  {
    name: "Sosis Solo",
    description: "Camilan gurih berisi sosis dengan tekstur lembut.",
    price: "IDR 13K",
    category: "food",
    categoryLabel: "Food",
    image: sosisSoloImage,
  },
  {
    name: "Tahu Bakso Goreng",
    description: "Tahu bakso goreng yang padat dan gurih.",
    price: "IDR 13K",
    category: "food",
    categoryLabel: "Food",
    image: tahuBaksoGorengImage,
  },
  {
    name: "Piscok",
    description: "Pisang coklat hangat dengan rasa manis legit.",
    price: "IDR 13K",
    category: "food",
    categoryLabel: "Food",
    image: piscokImage,
  },
  {
    name: "Nugget",
    description: "Nugget gurih yang pas untuk camilan ringan.",
    price: "IDR 13K",
    category: "food",
    categoryLabel: "Food",
    image: nuggetImage,
  },
  {
    name: "Siomay Ayam",
    description: "Siomay ayam lembut dengan rasa gurih khas.",
    price: "IDR 15K",
    category: "food",
    categoryLabel: "Food",
    image: siomayAyamImage,
  },
  {
    name: "Ayam Popcorn",
    description: "Potongan ayam renyah dalam porsi ngemil.",
    price: "IDR 15K",
    category: "food",
    categoryLabel: "Food",
    image: ayamPopcornImage,
  },
  {
    name: "Mix Platter",
    description: "Paket camilan campur untuk dinikmati bareng.",
    price: "IDR 20K",
    category: "food",
    categoryLabel: "Food",
    image: mixPlatterImage,
  },
  {
    name: "Indomie Nyemek Halu",
    description: "Indomie hangat dengan kuah pekat, pedas tipis, dan vibes begadang.",
    price: "IDR 15K",
    category: "food",
    categoryLabel: "Food",
    image: indomieNyemekHaluImage,
  },
  {
    name: "Indomie Nyemek Vinsen",
    description: "Indomie nyemek gurih dengan karakter rasa spesial.",
    price: "IDR 15K",
    category: "food",
    categoryLabel: "Food",
    image: indomieNyemekVinsenImage,
  },
  {
    name: "Coffee Bear",
    description: "Minuman kopi dingin dengan karakter rasa ringan.",
    price: "IDR 16K",
    category: "coffee-based",
    categoryLabel: "Coffee Based",
    image: coffeeBearImage,
  },
  {
    name: "Espresso",
    description: "Shot kopi pekat dengan aroma yang tegas.",
    price: "IDR 8K",
    category: "coffee-based",
    categoryLabel: "Coffee Based",
    image: espressoImage,
  },
  {
    name: "Hot/Ice Americano",
    description: "Kopi hitam ringan yang tersedia panas atau dingin.",
    price: "IDR 10K/13K",
    category: "coffee-based",
    categoryLabel: "Coffee Based",
    image: americanoImage,
  },
  {
    name: "Kopi Tubruk",
    description: "Kopi seduh klasik dengan rasa kuat dan familiar.",
    price: "IDR 8K",
    category: "coffee-based",
    categoryLabel: "Coffee Based",
    image: kopiTubrukImage,
  },
  {
    name: "V6 Drip",
    description: "Manual brew drip dengan profil rasa yang clean.",
    price: "IDR 10K",
    category: "coffee-based",
    categoryLabel: "Coffee Based",
    image: v6DripImage,
  },
  {
    name: "Coffee Milk Chocholate",
    description: "Kopi susu coklat yang creamy dan manis.",
    price: "IDR 15K",
    category: "coffee-milk",
    categoryLabel: "Coffee Milk",
    image: coffeMilkChocholateImage,
  },
  {
    name: "Coffee Milk",
    description: "Kopi susu klasik dengan rasa seimbang.",
    price: "IDR 13K",
    category: "coffee-milk",
    categoryLabel: "Coffee Milk",
    image: coffeeMilkImage,
  },
  {
    name: "Hot/Ice Coffe Latte",
    description: "Latte lembut yang tersedia panas atau dingin.",
    price: "IDR 15K/13K",
    category: "coffee-milk",
    categoryLabel: "Coffee Milk",
    image: coffeLatteImage,
  },
  {
    name: "Coffe Milk V2",
    description: "Varian kopi susu dengan rasa khas Kedai Sigma.",
    price: "IDR 13K",
    category: "coffee-milk",
    categoryLabel: "Coffee Milk",
    image: coffeMilkV2Image,
  },
  {
    name: "V6 Drip Susu",
    description: "Manual brew susu dengan rasa lebih lembut.",
    price: "IDR 13K",
    category: "coffee-milk",
    categoryLabel: "Coffee Milk",
    image: v6DripSusuImage,
  },
  {
    name: "Kopi Tubruk Susu",
    description: "Kopi tubruk klasik dengan tambahan susu.",
    price: "IDR 10K",
    category: "coffee-milk",
    categoryLabel: "Coffee Milk",
    image: kopiTubrukSusuImage,
  },
  {
    name: "Lemon Tea",
    description: "Teh lemon segar dengan rasa ringan.",
    price: "IDR 10K",
    category: "tea-series",
    categoryLabel: "Tea Series",
    image: lemonTeaImage,
  },
  {
    name: "Lychee Tea",
    description: "Teh leci manis dan menyegarkan.",
    price: "IDR 10K",
    category: "tea-series",
    categoryLabel: "Tea Series",
    image: lycheeTeaImage,
  },
  {
    name: "Tarik Tea",
    description: "Teh tarik creamy dengan rasa lembut.",
    price: "IDR 13K",
    category: "tea-series",
    categoryLabel: "Tea Series",
    image: tehTarikImage,
  },
  {
    name: "Milo",
    description: "Minuman malt coklat yang manis dan creamy.",
    price: "IDR 13K",
    category: "milk-series",
    categoryLabel: "Milk Series",
    image: miloImage,
  },
  {
    name: "Joshua",
    description: "Minuman susu manis dengan karakter khas.",
    price: "IDR 13K",
    category: "milk-series",
    categoryLabel: "Milk Series",
    image: joshuaImage,
  },
  {
    name: "Hot/Ice Matcha",
    description: "Matcha lembut yang tersedia panas atau dingin.",
    price: "IDR 15K/13K",
    category: "milk-series",
    categoryLabel: "Milk Series",
    image: matchaImage,
  },
  {
    name: "Hot/Ice Redvelvet",
    description: "Red velvet creamy dalam pilihan panas atau dingin.",
    price: "IDR 15K/13K",
    category: "milk-series",
    categoryLabel: "Milk Series",
    image: redvelvetImage,
  },
  {
    name: "Hot/Ice Coklat Classic",
    description: "Coklat klasik yang tersedia panas atau dingin.",
    price: "IDR 13K/13K",
    category: "milk-series",
    categoryLabel: "Milk Series",
    image: coklatClassicImage,
  },
  {
    name: "Hot/Ice Coklat Classic Roti",
    description: "Coklat classic roti untuk sajian panas atau dingin.",
    price: "IDR 15K/15K",
    category: "milk-series",
    categoryLabel: "Milk Series",
    image: coklatClassicRotiImage,
  },
  {
    name: "Strawberry Milk",
    description: "Susu stroberi dingin dengan rasa manis segar.",
    price: "IDR 15K",
    category: "milk-series",
    categoryLabel: "Milk Series",
    image: strawberryMilkImage,
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
        {item.image && (
          <>
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/0" />
          </>
        )}
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
    return filteredItems.slice(0, visibleCount);
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
              key={`${item.category}-${item.name}`}
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

        {visibleItems.length < filteredItems.length && (
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
