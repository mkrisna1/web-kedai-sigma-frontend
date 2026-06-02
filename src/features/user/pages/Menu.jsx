import { useEffect, useMemo, useState } from "react";
import ScrollToTopButton from "../../../components/user/ScrollToTopButton";
import { getPublicMenu, resolveApiAssetUrl } from "../../../services/api";
import coklatClassicImage from "../../../assets/Coklat Clasic.jpg";
import coklatClassicRotiImage from "../../../assets/Coklat Clasic Roti.jpg";
import coffeeBearImage from "../../../assets/Coffee Bear.jpg";
import coffeeMilkImage from "../../../assets/Coffee Milk.jpg";
import coffeLatteImage from "../../../assets/Coffee Latte.webp";
import coffeMilkV2Image from "../../../assets/Coffee Milk V2.jpeg";
import coffeMilkChocholateImage from "../../../assets/Coffe Milk Chocholate.jpg";
import espressoImage from "../../../assets/Espresso.webp";
import americanoImage from "../../../assets/Americano.jpg";
import ayamPopcornImage from "../../../assets/Ayam Popcorn.jpg";
import indomieNyemekHaluImage from "../../../assets/Indomie Nyemek Halu.jpg";
import indomieNyemekVinsenImage from "../../../assets/Indomie Nyemek Vinsen.jpg";
import joshuaImage from "../../../assets/Joshua.jpg";
import kentangImage from "../../../assets/Kentang.jpg";
import kopiTubrukImage from "../../../assets/Kopi Tubruk.jpg";
import kopiTubrukSusuImage from "../../../assets/Kopi Tubruk Susu.jpg";
import lemonTeaImage from "../../../assets/Lemon Tea.jpg";
import lycheeTeaImage from "../../../assets/Lychee Tea.jpg";
import matchaImage from "../../../assets/Matcha.jpg";
import miloImage from "../../../assets/Ice Milo.jpg";
import mixPlatterImage from "../../../assets/Mix Platter.jpg";
import nuggetImage from "../../../assets/Nugget.jpg";
import piscokImage from "../../../assets/Piscok.jpg";
import redvelvetImage from "../../../assets/Redvelvet.webp";
import risolMayoImage from "../../../assets/Risol Mayo.jpg";
import siomayAyamImage from "../../../assets/Siomay Ayam.jpg";
import sosisSoloImage from "../../../assets/Sosis Solo.jpg";
import strawberryMilkImage from "../../../assets/Strawberry Milk.jpg";
import tahuBaksoGorengImage from "../../../assets/Tahu Bakso Goreng.jpg";
import tehTarikImage from "../../../assets/Teh Tarik.jpg";
import v6DripImage from "../../../assets/V6 Drip.jpg";
import v6DripSusuImage from "../../../assets/V6 Drip Susu.jpg";

const INITIAL_VISIBLE_COUNT = 9;
const LOAD_MORE_COUNT = 6;
const MENU_AUTO_REFRESH_MS = 30000;

const filters = [
  { label: "Semua Menu", value: "all" },
  { label: "Makanan", value: "food" },
  { label: "Kopi", value: "coffee-based" },
  { label: "Teh", value: "tea-series" },
  { label: "Susu", value: "milk-series" },
];

const categoryOrder = filters.filter((item) => item.value !== "all");

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
    category: "coffee-based",
    categoryLabel: "Kopi",
    image: coffeMilkChocholateImage,
  },
  {
    name: "Coffee Milk",
    description: "Kopi susu klasik dengan rasa seimbang.",
    price: "IDR 13K",
    category: "coffee-based",
    categoryLabel: "Kopi",
    image: coffeeMilkImage,
  },
  {
    name: "Hot/Ice Coffe Latte",
    description: "Latte lembut yang tersedia panas atau dingin.",
    price: "IDR 15K/13K",
    category: "coffee-based",
    categoryLabel: "Kopi",
    image: coffeLatteImage,
  },
  {
    name: "Coffe Milk V2",
    description: "Varian kopi susu dengan rasa khas Kedai Sigma.",
    price: "IDR 13K",
    category: "coffee-based",
    categoryLabel: "Kopi",
    image: coffeMilkV2Image,
  },
  {
    name: "V6 Drip Susu",
    description: "Manual brew susu dengan rasa lebih lembut.",
    price: "IDR 13K",
    category: "coffee-based",
    categoryLabel: "Kopi",
    image: v6DripSusuImage,
  },
  {
    name: "Kopi Tubruk Susu",
    description: "Kopi tubruk klasik dengan tambahan susu.",
    price: "IDR 10K",
    category: "coffee-based",
    categoryLabel: "Kopi",
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

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const staticMenuBySlug = new Map(menuItems.map((item) => [slugify(item.name), item]));

const staticMenuAliasBySlug = {
  americano: "Hot/Ice Americano",
  "coffee-latte": "Hot/Ice Coffe Latte",
  "coffe-latte": "Hot/Ice Coffe Latte",
  "cofee-latte": "Hot/Ice Coffe Latte",
  "coffee-milk-chocolate": "Coffee Milk Chocholate",
  "coffe-milk-chocolate": "Coffee Milk Chocholate",
  "cofee-milk-chocolate": "Coffee Milk Chocholate",
  "coffee-milk-cholate": "Coffee Milk Chocholate",
  "coffe-milk-cholate": "Coffee Milk Chocholate",
  "cofee-milk-cholate": "Coffee Milk Chocholate",
  "coffee-milk-chocholate": "Coffee Milk Chocholate",
  "coffe-milk-chocholate": "Coffee Milk Chocholate",
  "cofee-milk-chocholate": "Coffee Milk Chocholate",
  "coffee-milk-v2": "Coffe Milk V2",
  "coffe-milk-v2": "Coffe Milk V2",
  "cofee-milk-v2": "Coffe Milk V2",
  "teh-tarik": "Tarik Tea",
  "tarik-tea": "Tarik Tea",
  matcha: "Hot/Ice Matcha",
  redvelvet: "Hot/Ice Redvelvet",
  "red-velvet": "Hot/Ice Redvelvet",
  "coklat-classic": "Hot/Ice Coklat Classic",
  "coklat-clasic": "Hot/Ice Coklat Classic",
  "coklat-classic-roti": "Hot/Ice Coklat Classic Roti",
  "coklat-clasic-roti": "Hot/Ice Coklat Classic Roti",
};

const localImageBySlug = {
  americano: americanoImage,
  "hot-ice-americano": americanoImage,
  "coffee-latte": coffeLatteImage,
  "coffe-latte": coffeLatteImage,
  "cofee-latte": coffeLatteImage,
  "hot-ice-coffe-latte": coffeLatteImage,
  "coffee-milk-chocolate": coffeMilkChocholateImage,
  "coffe-milk-chocolate": coffeMilkChocholateImage,
  "cofee-milk-chocolate": coffeMilkChocholateImage,
  "coffee-milk-cholate": coffeMilkChocholateImage,
  "coffe-milk-cholate": coffeMilkChocholateImage,
  "cofee-milk-cholate": coffeMilkChocholateImage,
  "coffee-milk-chocholate": coffeMilkChocholateImage,
  "coffe-milk-chocholate": coffeMilkChocholateImage,
  "cofee-milk-chocholate": coffeMilkChocholateImage,
  "coffee-milk-v2": coffeMilkV2Image,
  "coffe-milk-v2": coffeMilkV2Image,
  "cofee-milk-v2": coffeMilkV2Image,
  "teh-tarik": tehTarikImage,
  "tarik-tea": tehTarikImage,
  matcha: matchaImage,
  "hot-ice-matcha": matchaImage,
  redvelvet: redvelvetImage,
  "red-velvet": redvelvetImage,
  "hot-ice-redvelvet": redvelvetImage,
  "coklat-classic": coklatClassicImage,
  "coklat-clasic": coklatClassicImage,
  "hot-ice-coklat-classic": coklatClassicImage,
  "hot-ice-coklat-clasic": coklatClassicImage,
  "coklat-classic-roti": coklatClassicRotiImage,
  "coklat-clasic-roti": coklatClassicRotiImage,
  "hot-ice-coklat-classic-roti": coklatClassicRotiImage,
  "hot-ice-coklat-clasic-roti": coklatClassicRotiImage,
};

const getStaticMenuItem = (name) => {
  const itemSlug = slugify(name);
  const aliasName = staticMenuAliasBySlug[itemSlug];

  return staticMenuBySlug.get(itemSlug) || staticMenuBySlug.get(slugify(aliasName));
};

const getMergeSlug = (name) => {
  const itemSlug = slugify(name);
  const aliasName = staticMenuAliasBySlug[itemSlug];

  return aliasName ? slugify(aliasName) : itemSlug;
};

const inferCategoryValue = (categoryName) => {
  const normalized = String(categoryName || "").toLowerCase();

  if (normalized.includes("makan") || normalized.includes("food")) {
    return "food";
  }

  if (normalized.includes("tea") || normalized.includes("teh")) {
    return "tea-series";
  }

  if (normalized.includes("coffee milk") || normalized.includes("kopi susu")) {
    return "coffee-based";
  }

  if (normalized.includes("milk") || normalized.includes("susu")) {
    return "milk-series";
  }

  if (normalized.includes("coffee") || normalized.includes("kopi")) {
    return "coffee-based";
  }

  return "food";
};

const getCategoryLabel = (categoryValue, categoryName) =>
  filters.find((item) => item.value === categoryValue)?.label ||
  categoryName ||
  "Menu";

const formatRupiah = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const formatPriceNumber = (value) =>
  Number(value || 0).toLocaleString("id-ID");

const getPriceSortValue = (item) => {
  if (Number.isFinite(item.priceValue)) {
    return item.priceValue;
  }

  const priceLabel = String(item.price || "");
  const prices = priceLabel
    .match(/\d[\d.]*/g)
    ?.map((value) => Number(value.replace(/\./g, "")))
    .filter((value) => Number.isFinite(value));

  if (!prices?.length) {
    return 0;
  }

  const minPrice = Math.min(...prices);

  return /k\b/i.test(priceLabel) && minPrice < 1000 ? minPrice * 1000 : minPrice;
};

const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const formatVariantPriceLabel = (item, baseItem, basePrice) => {
  const option =
    item.opsi_suhu ||
    (String(baseItem?.price || "").includes("/") ? "hot_ice" : "none");
  const hotPrice = toNullableNumber(item.harga_hot);
  const icePrice = toNullableNumber(item.harga_ice);

  if (option === "hot_ice") {
    if (hotPrice === null && icePrice === null && baseItem?.price) {
      return String(baseItem.price).replace(/^IDR\s*/i, "Rp");
    }

    const hot = hotPrice ?? basePrice;
    const ice = icePrice ?? basePrice;

    return hot === ice
      ? formatRupiah(hot)
      : `${formatRupiah(hot)}/${formatPriceNumber(ice)}`;
  }

  if (option === "hot") {
    return formatRupiah(hotPrice ?? basePrice);
  }

  if (option === "ice") {
    return formatRupiah(icePrice ?? basePrice);
  }

  return formatRupiah(basePrice);
};

const mapMenuFromApi = (item) => {
  const name = item.nama_produk || "Menu";
  const baseItem = getStaticMenuItem(name);
  const categoryValue = baseItem?.category || inferCategoryValue(item.kategori?.nama_kategori);
  const price = Number(item.harga_produk) || 0;
  const imageUrl = resolveApiAssetUrl(item.foto_produk);
  const localImage = baseItem?.image || localImageBySlug[slugify(name)];

  return {
    ...(baseItem || {}),
    id: item.id ?? item.id_produk,
    name,
    description: item.deskripsi_produk || baseItem?.description || `${name} tersedia di Kedai Sigma.`,
    price: formatVariantPriceLabel(item, baseItem, price),
    priceValue: price,
    category: categoryValue,
    categoryLabel: baseItem?.categoryLabel || getCategoryLabel(categoryValue, item.kategori?.nama_kategori),
    image: imageUrl || localImage,
    isAvailable: item.ketersediaan_produk !== "tidak_tersedia",
  };
};

const mergeMenuItems = (apiItems) => {
  if (!Array.isArray(apiItems)) {
    return menuItems;
  }

  const mergedBySlug = new Map();

  apiItems.forEach((item) => {
    mergedBySlug.set(getMergeSlug(item.name), item);
  });

  return Array.from(mergedBySlug.values());
};

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
      className={`rounded-full border px-5 py-2.5 font-['Space_Grotesk',sans-serif] text-sm font-bold leading-6 tracking-normal transition sm:px-6 sm:text-base ${
        active
          ? "border-[#EEC200] bg-[#EEC200] text-[#3C2F00]"
          : "border-white/10 bg-[#121C2A] text-[#D9E3F6] hover:border-[#EEC200]/60"
      }`}
    >
      <span>{item.label}</span>
    </button>
  );
}

function getVariantHint(item) {
  const value = `${item.name || ""} ${item.price || ""}`.toLowerCase();

  if (value.includes("hot/ice") || value.includes("hot / ice") || value.includes("/")) {
    return "Tersedia pilihan panas atau dingin.";
  }

  if (value.includes("ice")) {
    return "Disajikan dingin.";
  }

  if (value.includes("hot")) {
    return "Disajikan panas.";
  }

  return null;
}

function MenuCard({ item, index }) {
  const isOutOfStock = item.isAvailable === false;
  const variantHint = getVariantHint(item);

  return (
    <article
      className={`group flex min-h-[318px] min-w-0 flex-col overflow-hidden rounded-2xl border p-3 opacity-0 transition-[transform,background-color,box-shadow] duration-500 ease-out sm:min-h-[430px] sm:p-4 ${
        isOutOfStock
          ? "border-[#DC2626]/70 bg-[#16202E] shadow-[0_0_0_3px_rgba(220,38,38,0.10)]"
          : "border-white/10 bg-[#121C2A] shadow-[0_18px_48px_rgba(0,0,0,0.16)] hover:-translate-y-1.5 hover:border-[#EEC200]/40 hover:bg-[#16202E] hover:shadow-[0_18px_48px_rgba(220,38,38,0.12)]"
      }`}
      style={{
        animation: "menu-card-in 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        animationDelay: `${Math.min(index % LOAD_MORE_COUNT, 5) * 70}ms`,
      }}
    >
      <div className="relative h-[150px] overflow-hidden rounded-xl bg-[#212B39] sm:h-[250px] lg:h-[280px]">
        {item.image && (
          <>
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 ${
                isOutOfStock ? "grayscale opacity-45" : ""
              }`}
            />
            <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/0" />
          </>
        )}

        {!item.image && (
          <div className="flex h-full min-w-0 w-full items-center justify-center bg-[#2B3544] px-3 text-center font-['Space_Grotesk',sans-serif] text-sm font-black text-[#D9E3F6]/50 sm:px-6 sm:text-lg">
            <span className="min-w-0 break-words break-all [overflow-wrap:anywhere] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] overflow-hidden">{item.name}</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="border border-[#DC2626] bg-[#091421]/90 px-3 py-2 font-['Space_Grotesk',sans-serif] text-xs font-black tracking-normal text-[#FF4D4D] sm:px-5 sm:py-3 sm:text-lg">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex min-w-0 flex-1 flex-col sm:mt-4">
        <div className="min-w-0 pb-4">
          <h3 className="min-w-0 overflow-hidden break-words break-all font-['Space_Grotesk',sans-serif] text-sm font-bold leading-5 tracking-normal text-[#EEF4FF] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] [overflow-wrap:anywhere] sm:text-xl sm:leading-7">
            {item.name}
          </h3>
          <p className="mt-1 min-w-0 overflow-hidden break-words break-all font-['Be_Vietnam_Pro',sans-serif] text-xs leading-4 text-[#D9C5C1] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] [overflow-wrap:anywhere] sm:mt-2 sm:text-sm sm:leading-5">
            {item.description}
          </p>
          {variantHint && (
            <p className="mt-2 inline-flex max-w-full rounded-full border border-[#EEC200]/25 bg-[#EEC200]/10 px-3 py-1 font-['Be_Vietnam_Pro',sans-serif] text-[11px] font-bold leading-4 text-[#F7D94A]">
              {variantHint}
            </p>
          )}
        </div>

        <div className="mt-auto flex min-w-0 flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-3">
          <p
            className={`min-w-0 max-w-full break-words rounded-full px-3 py-1.5 font-['Space_Grotesk',sans-serif] text-sm font-bold leading-5 [overflow-wrap:anywhere] sm:text-base ${
              isOutOfStock ? "bg-[#2B3544] text-[#7B8798] line-through" : "bg-[#EEC200] text-[#3C2F00]"
            }`}
          >
            {item.price}
          </p>

          {isOutOfStock && (
            <span className="border border-[#DC2626] bg-[#091421] px-2 py-1 font-['Space_Grotesk',sans-serif] text-[10px] font-black tracking-[0.6px] text-[#FF4D4D] sm:px-3 sm:py-2 sm:text-xs">
              Stok Habis
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Menu() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("name");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [apiMenuItems, setApiMenuItems] = useState(null);
  const activeMenuItems = useMemo(() => mergeMenuItems(apiMenuItems), [apiMenuItems]);

  useEffect(() => {
    let isMounted = true;

    const loadMenu = () => {
      getPublicMenu({ _refresh: Date.now() })
        .then((response) => {
          if (isMounted) {
            setApiMenuItems((response.data || []).map(mapMenuFromApi));
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil menu publik:", error);
          if (isMounted) {
            setApiMenuItems(null);
          }
        });
    };

    loadMenu();
    const intervalId = window.setInterval(loadMenu, MENU_AUTO_REFRESH_MS);
    window.addEventListener("focus", loadMenu);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", loadMenu);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const matchingItems = activeMenuItems.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.category === activeFilter;
      const matchesSearch =
        keyword.length === 0 ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });

    return [...matchingItems].sort((first, second) => {
      if (sortMode === "price-low") {
        return getPriceSortValue(first) - getPriceSortValue(second)
          || first.name.localeCompare(second.name, "id", { sensitivity: "base" });
      }

      if (sortMode === "price-high") {
        return getPriceSortValue(second) - getPriceSortValue(first)
          || first.name.localeCompare(second.name, "id", { sensitivity: "base" });
      }

      return first.name.localeCompare(second.name, "id", { sensitivity: "base" });
    });
  }, [activeFilter, activeMenuItems, search, sortMode]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const visibleCategorySections = useMemo(() => {
    if (activeFilter === "all") {
      return [
        {
          label: "Semua Menu",
          value: "all",
          items: visibleItems,
        },
      ];
    }

    return categoryOrder
      .map((category) => ({
        ...category,
        items: visibleItems.filter((item) => item.category === category.value),
      }))
      .filter((category) => category.items.length > 0);
  }, [activeFilter, visibleItems]);

  function handleFilterChange(value) {
    setActiveFilter(value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function handleSortChange(value) {
    setSortMode(value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  return (
    <div className="min-h-screen bg-[#091421] text-[#D9E3F6]">
      <div className="h-1 bg-[#050F1C]" />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-14 sm:px-8 lg:px-8 lg:py-20">
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

        <section className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: "A-Z", value: "name" },
              { label: "Harga Termurah", value: "price-low" },
              { label: "Harga Termahal", value: "price-high" },
            ].map((item) => {
              const isActive = sortMode === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleSortChange(item.value)}
                  className={`rounded-full border px-5 py-2.5 font-['Space_Grotesk',sans-serif] text-xs font-bold tracking-normal transition ${
                    isActive
                      ? "border-[#EEC200] bg-[#EEC200] text-[#3C2F00]"
                      : "border-white/10 bg-[#121C2A] text-[#D9E3F6] hover:border-[#EEC200]/60"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <label className="relative block w-full lg:max-w-[360px]">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#AC8884]">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari menu"
              className="h-11 w-full rounded-full border border-white/10 bg-[#121C2A] py-3 pl-12 pr-4 font-['Space_Grotesk',sans-serif] text-sm font-bold leading-5 tracking-normal text-[#D9E3F6] outline-none placeholder:text-[#7B8798] focus:border-[#EEC200] focus:ring-2 focus:ring-[#EEC200]/20"
            />
          </label>
        </section>

        <section className="flex w-full flex-col gap-12">
          {visibleCategorySections.map((category) => (
            <div key={category.value} className="flex w-full flex-col gap-6">
              <div className="flex items-center gap-5">
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-black leading-none tracking-normal text-[#EEC200] sm:text-3xl">
                  {category.label}
                </h2>
                <div className="h-px flex-1 bg-[#2B3544]" />
              </div>

              <div className="grid w-full grid-cols-2 gap-4 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item, index) => (
                  <MenuCard
                    key={`${item.category}-${item.name}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </div>
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
              className="group flex h-12 items-center gap-3 rounded-full bg-[#EEC200] px-8 font-['Space_Grotesk',sans-serif] text-sm font-bold leading-5 tracking-normal text-[#3C2F00] shadow-[0_16px_34px_rgba(238,194,0,0.16)] transition duration-300 ease-out hover:-translate-y-1 active:translate-y-0"
            >
              Tampilkan lebih banyak
              <span className="transition duration-300 group-hover:translate-y-0.5">
                <ChevronDown />
              </span>
            </button>
          </div>
        )}
      </main>
      <ScrollToTopButton />
    </div>
  );
}
