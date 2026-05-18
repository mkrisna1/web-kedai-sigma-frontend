import { useEffect, useMemo, useState } from "react";
import { getPublicMenu } from "../../../services/api";
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

const isLocalHost = (hostname) =>
  ["localhost", "127.0.0.1", "::1"].includes(hostname);

const resolveAssetUrl = (value) => {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const hostname =
    typeof window !== "undefined" && window.location?.hostname
      ? window.location.hostname
      : "";
  const apiOrigin = hostname
    ? `${window.location.protocol}//${hostname}:8000`
    : "http://127.0.0.1:8000";
  const fallbackOrigin = isLocalHost(hostname)
    ? "http://127.0.0.1:8000"
    : apiOrigin;

  return `${fallbackOrigin}${value.startsWith("/") ? value : `/${value}`}`;
};

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
      return String(baseItem.price).replace(/^IDR/i, "Rp");
    }

    const hot = hotPrice ?? basePrice;
    const ice = icePrice ?? basePrice;

    return hot === ice
      ? `${formatRupiah(hot)} Hot/Ice`
      : `Hot ${formatRupiah(hot)} / Ice ${formatRupiah(ice)}`;
  }

  if (option === "hot") {
    return `Hot ${formatRupiah(hotPrice ?? basePrice)}`;
  }

  if (option === "ice") {
    return `Ice ${formatRupiah(icePrice ?? basePrice)}`;
  }

  return formatRupiah(basePrice);
};

const mapMenuFromApi = (item) => {
  const name = item.nama_produk || "Menu";
  const baseItem = getStaticMenuItem(name);
  const categoryValue = baseItem?.category || inferCategoryValue(item.kategori?.nama_kategori);
  const price = Number(item.harga_produk) || 0;
  const imageUrl = resolveAssetUrl(item.foto_produk);
  const localImage = baseItem?.image || localImageBySlug[slugify(name)];

  return {
    ...(baseItem || {}),
    id: item.id ?? item.id_produk,
    name,
    description: item.deskripsi_produk || baseItem?.description || `${name} tersedia di Kedai Sigma.`,
    price: formatVariantPriceLabel(item, baseItem, price),
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

function interleaveItemsByCategory(items) {
  const groupedItems = categoryOrder.map((category) =>
    items.filter((item) => item.category === category.value)
  );
  const maxCategoryLength = Math.max(...groupedItems.map((itemsByCategory) => itemsByCategory.length), 0);
  const interleavedItems = [];

  for (let index = 0; index < maxCategoryLength; index += 1) {
    groupedItems.forEach((itemsByCategory) => {
      if (itemsByCategory[index]) {
        interleavedItems.push(itemsByCategory[index]);
      }
    });
  }

  return interleavedItems;
}

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
  const isOutOfStock = item.isAvailable === false;

  return (
    <article
      className={`group flex min-h-[540px] flex-col border p-6 opacity-0 transition-[transform,background-color,box-shadow] duration-500 ease-out ${
        isOutOfStock
          ? "border-[#DC2626]/70 bg-[#16202E] shadow-[0_0_0_3px_rgba(220,38,38,0.10)]"
          : "border-transparent bg-[#121C2A] shadow-[0_0_40px_rgba(220,38,38,0.1)] hover:-translate-y-1.5 hover:bg-[#16202E] hover:shadow-[0_18px_48px_rgba(220,38,38,0.16)]"
      }`}
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
              className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 ${
                isOutOfStock ? "grayscale opacity-45" : ""
              }`}
            />
            <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/0" />
          </>
        )}

        {!item.image && (
          <div className="flex h-full w-full items-center justify-center bg-[#2B3544] px-6 text-center font-['Space_Grotesk',sans-serif] text-lg font-black uppercase text-[#D9E3F6]/50">
            {item.name}
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="border border-[#DC2626] bg-[#091421]/90 px-5 py-3 font-['Space_Grotesk',sans-serif] text-lg font-black uppercase tracking-normal text-[#FF4D4D]">
              Stok Habis
            </span>
          </div>
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

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <p
            className={`font-['Space_Grotesk',sans-serif] text-xl font-bold leading-7 ${
              isOutOfStock ? "text-[#7B8798] line-through" : "text-[#4AE176]"
            }`}
          >
            {item.price}
          </p>

          {isOutOfStock && (
            <span className="border border-[#DC2626] bg-[#091421] px-3 py-2 font-['Space_Grotesk',sans-serif] text-xs font-black uppercase tracking-[1.4px] text-[#FF4D4D]">
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
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [apiMenuItems, setApiMenuItems] = useState(null);
  const activeMenuItems = useMemo(() => mergeMenuItems(apiMenuItems), [apiMenuItems]);

  useEffect(() => {
    let isMounted = true;

    getPublicMenu()
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

    return () => {
      isMounted = false;
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

    return activeFilter === "all"
      ? interleaveItemsByCategory(matchingItems)
      : matchingItems;
  }, [activeFilter, activeMenuItems, search]);

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
              placeholder="CARI MENU"
              className="h-[55px] w-full bg-[#121C2A] py-[17px] pl-12 pr-3 font-['Space_Grotesk',sans-serif] text-base font-bold leading-5 tracking-[-0.025em] text-[#D9E3F6] outline-none placeholder:text-[#5C403C] focus:ring-2 focus:ring-[#EEC200]"
            />
          </label>

          <div className="max-w-xl lg:text-right">
            <p className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 tracking-[0.2em] text-[#EEC200]">
              Kedai Sigma Menu
            </p>
            <h1 className="mt-2 font-['Space_Grotesk',sans-serif] text-4xl font-black uppercase leading-none tracking-[-0.05em] text-[#D9E3F6] sm:text-5xl">
              Temukan menu favoritmu
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

        <section className="flex w-full flex-col gap-12">
          {visibleCategorySections.map((category) => (
            <div key={category.value} className="flex w-full flex-col gap-6">
              <div className="flex items-center gap-5">
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-black uppercase leading-none tracking-[-0.05em] text-[#EEC200] sm:text-3xl">
                  {category.label}
                </h2>
                <div className="h-px flex-1 bg-[#2B3544]" />
              </div>

              <div className="grid w-full gap-8 md:grid-cols-2 xl:grid-cols-3">
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
