import { Link, useOutletContext } from "react-router-dom";
import { useMemo, useState } from "react";
import QRMenuCard from "../../../components/qr/QRMenuCard";
import americanoImage from "../../../assets/Americano.jpg";
import ayamPopcornImage from "../../../assets/Ayam Popcorn.jpg";
import coklatClassicImage from "../../../assets/Coklat Clasic.jpg";
import coklatClassicRotiImage from "../../../assets/Coklat Clasic Roti.jpg";
import coffeeBearImage from "../../../assets/Coffee Bear.jpg";
import coffeeLatteImage from "../../../assets/Coffee Latte.webp";
import coffeeMilkImage from "../../../assets/Coffee Milk.jpg";
import coffeeMilkChocolateImage from "../../../assets/Coffe Milk Chocholate.jpg";
import coffeeMilkV2Image from "../../../assets/Coffee Milk V2.jpeg";
import espressoImage from "../../../assets/Espresso.webp";
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

const formatRupiah = (value) => `Rp${value.toLocaleString("id-ID")}`;

const menuItems = [
  {
    id: "matcha",
    name: "Matcha",
    category: "non-coffee",
    price: 13000,
    priceLabel: "15K/13K",
    image: matchaImage,
    description: "Minuman teh hijau dengan rasa khas yang creamy.",
    temperatureOptions: [
      { id: "hot", label: "Hot", price: 15000 },
      { id: "ice", label: "Ice", price: 13000 },
    ],
  },
  {
    id: "americano",
    name: "Americano",
    category: "coffee",
    price: 10000,
    priceLabel: "10K/13K",
    image: americanoImage,
    description: "Espresso yang dicampur air panas menghasilkan rasa kopi yang ringan.",
    temperatureOptions: [
      { id: "hot", label: "Hot", price: 10000 },
      { id: "ice", label: "Ice", price: 13000 },
    ],
  },
  {
    id: "coffee-milk",
    name: "Coffee Milk",
    category: "coffee",
    price: 13000,
    priceLabel: "13K",
    image: coffeeMilkImage,
    description: "Kopi susu creamy dengan manis yang pas untuk teman ngobrol.",
  },
  {
    id: "coffee-bear",
    name: "Coffee Bear",
    category: "coffee",
    price: 16000,
    priceLabel: "16K",
    image: coffeeBearImage,
    description: "Kopi dingin bold dengan karakter rasa yang lebih tebal.",
  },
  {
    id: "espresso",
    name: "Espresso",
    category: "coffee",
    price: 8000,
    priceLabel: "8K",
    image: espressoImage,
    description: "Ekstrak kopi murni dengan rasa kuat dan aroma pekat.",
  },
  {
    id: "coffee-latte",
    name: "Coffee Latte",
    category: "coffee",
    price: 13000,
    priceLabel: "13K/15K",
    image: coffeeLatteImage,
    description: "Kopi susu halus dengan karakter lembut dan nyaman diminum.",
    temperatureOptions: [
      { id: "hot", label: "Hot", price: 15000 },
      { id: "ice", label: "Ice", price: 13000 },
    ],
  },
  {
    id: "coffee-milk-chocolate",
    name: "Coffee Milk Chocolate",
    category: "coffee",
    price: 15000,
    priceLabel: "15K",
    image: coffeeMilkChocolateImage,
    description: "Perpaduan kopi susu dan coklat dengan rasa lebih kaya.",
  },
  {
    id: "coffee-milk-v2",
    name: "Coffee Milk V2",
    category: "coffee",
    price: 13000,
    priceLabel: "13K",
    image: coffeeMilkV2Image,
    description: "Varian kopi susu dengan karakter manis dan creamy.",
  },
  {
    id: "kopi-tubruk",
    name: "Kopi Tubruk",
    category: "coffee",
    price: 8000,
    priceLabel: "8K",
    image: kopiTubrukImage,
    description: "Kopi tubruk klasik dengan rasa pekat dan aroma hangat.",
  },
  {
    id: "kopi-tubruk-susu",
    name: "Kopi Tubruk Susu",
    category: "coffee",
    price: 10000,
    priceLabel: "10K",
    image: kopiTubrukSusuImage,
    description: "Tubruk khas dengan tambahan susu agar terasa lebih lembut.",
  },
  {
    id: "v6-drip",
    name: "V6 Drip",
    category: "coffee",
    price: 10000,
    priceLabel: "10K",
    image: v6DripImage,
    description: "Seduhan manual yang ringan, bersih, dan aromatik.",
  },
  {
    id: "v6-drip-susu",
    name: "V6 Drip Susu",
    category: "coffee",
    price: 13000,
    priceLabel: "13K",
    image: v6DripSusuImage,
    description: "Manual brew dengan susu untuk rasa yang lebih round.",
  },
  {
    id: "lemon-tea",
    name: "Lemon Tea",
    category: "non-coffee",
    price: 10000,
    priceLabel: "10K",
    image: lemonTeaImage,
    description: "Teh segar dengan sentuhan lemon yang ringan dan wangi.",
  },
  {
    id: "lychee-tea",
    name: "Lychee Tea",
    category: "non-coffee",
    price: 10000,
    priceLabel: "10K",
    image: lycheeTeaImage,
    description: "Teh buah lychee yang manis, segar, dan harum.",
  },
  {
    id: "milo",
    name: "Milo",
    category: "non-coffee",
    price: 13000,
    priceLabel: "13K",
    image: miloImage,
    description: "Minuman coklat malt yang creamy dan familiar.",
  },
  {
    id: "joshua",
    name: "Joshua",
    category: "non-coffee",
    price: 13000,
    priceLabel: "13K",
    image: joshuaImage,
    description: "Minuman manis menyegarkan dengan karakter lembut.",
  },
  {
    id: "strawberry-milk",
    name: "Strawberry Milk",
    category: "non-coffee",
    price: 15000,
    priceLabel: "15K",
    image: strawberryMilkImage,
    description: "Susu stroberi dengan rasa manis buah yang ringan.",
  },
  {
    id: "teh-tarik",
    name: "Teh Tarik",
    category: "non-coffee",
    price: 13000,
    priceLabel: "13K",
    image: tehTarikImage,
    description: "Teh susu berbusa dengan rasa legit dan harum.",
  },
  {
    id: "redvelvet",
    name: "Redvelvet",
    category: "non-coffee",
    price: 13000,
    priceLabel: "13K/15K",
    image: redvelvetImage,
    description: "Minuman creamy dengan karakter manis khas red velvet.",
    temperatureOptions: [
      { id: "hot", label: "Hot", price: 15000 },
      { id: "ice", label: "Ice", price: 13000 },
    ],
  },
  {
    id: "coklat-classic",
    name: "Coklat Classic",
    category: "non-coffee",
    price: 13000,
    priceLabel: "13K",
    image: coklatClassicImage,
    description: "Coklat klasik yang pekat, lembut, dan comforting.",
  },
  {
    id: "coklat-classic-roti",
    name: "Coklat Classic Roti",
    category: "non-coffee",
    price: 15000,
    priceLabel: "15K",
    image: coklatClassicRotiImage,
    description: "Coklat creamy dengan sentuhan rasa roti yang khas.",
  },
  {
    id: "ayam-popcorn",
    name: "Ayam Popcorn",
    category: "food",
    price: 15000,
    priceLabel: "15K",
    image: ayamPopcornImage,
    description: "Potongan ayam kecil yang digoreng crispy dengan rasa gurih dan renyah.",
  },
  {
    id: "kentang",
    name: "Kentang",
    category: "food",
    price: 10000,
    priceLabel: "10K",
    image: kentangImage,
    description: "Kentang goreng renyah dengan rasa gurih, cocok buat camilan santai.",
  },
  {
    id: "risol-mayo",
    name: "Risol Mayo",
    category: "food",
    price: 13000,
    priceLabel: "13K",
    image: risolMayoImage,
    description: "Risol gurih berisi mayo lembut, enak buat pembuka pesanan.",
  },
  {
    id: "sosis-solo",
    name: "Sosis Solo",
    category: "food",
    price: 13000,
    priceLabel: "13K",
    image: sosisSoloImage,
    description: "Camilan gurih berisi daging lembut dengan balutan tipis.",
  },
  {
    id: "tahu-bakso-goreng",
    name: "Tahu Bakso Goreng",
    category: "food",
    price: 13000,
    priceLabel: "13K",
    image: tahuBaksoGorengImage,
    description: "Tahu bakso goreng renyah dengan isi yang gurih.",
  },
  {
    id: "piscok",
    name: "Piscok",
    category: "food",
    price: 13000,
    priceLabel: "13K",
    image: piscokImage,
    description: "Pisang coklat crispy dengan rasa manis yang pas.",
  },
  {
    id: "nugget",
    name: "Nugget",
    category: "food",
    price: 13000,
    priceLabel: "13K",
    image: nuggetImage,
    description: "Nugget goreng hangat untuk camilan praktis.",
  },
  {
    id: "siomay-ayam",
    name: "Siomay Ayam",
    category: "food",
    price: 15000,
    priceLabel: "15K",
    image: siomayAyamImage,
    description: "Siomay ayam lembut dengan cita rasa gurih.",
  },
  {
    id: "mix-platter",
    name: "Mix Platter",
    category: "food",
    price: 20000,
    priceLabel: "20K",
    image: mixPlatterImage,
    description: "Pilihan snack campur untuk dinikmati bareng.",
  },
  {
    id: "indomie-nyemek-halu",
    name: "Indomie Nyemek Halu",
    category: "food",
    price: 15000,
    priceLabel: "15K",
    image: indomieNyemekHaluImage,
    description: "Indomie nyemek dengan rasa gurih yang lebih berani.",
  },
  {
    id: "indomie-nyemek-vinsen",
    name: "Indomie Nyemek Vinsen",
    category: "food",
    price: 15000,
    priceLabel: "15K",
    image: indomieNyemekVinsenImage,
    description: "Indomie nyemek hangat dengan racikan khas Kedai Sigma.",
  },
];

const categoryTabs = [
  { label: "all menu", value: "all" },
  { label: "coffee", value: "coffee" },
  { label: "non-coffee", value: "non-coffee" },
  { label: "food", value: "food" },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-[10.5px] w-[10.5px]">
      <path
        d="m14.7 13.3-3.1-3.1a6.05 6.05 0 1 0-1.4 1.4l3.1 3.1 1.4-1.4ZM2.5 6.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CartIcon({ className = "h-8 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.2 14.4h7.45c.75 0 1.41-.41 1.75-1.03L21 5H5.21L4.27 3H1v2h2l3.6 7.59-1.35 2.44C4.52 16.37 5.48 18 7 18h12v-2H7l1.1-1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 20 12" fill="none" aria-hidden="true" className="h-[7.4px] w-3">
      <path d="M13.5.5 19 6l-5.5 5.5-1.4-1.4L15.2 7H1V5h14.2l-3.1-3.1L13.5.5Z" fill="currentColor" />
    </svg>
  );
}

function PlusIcon({ className = "h-3 w-3" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M7 15V9H1V7h6V1h2v6h6v2H9v6H7Z" fill="currentColor" />
    </svg>
  );
}

function MinusIcon({ className = "h-3 w-3" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 7h12v2H2V7Z" fill="currentColor" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3 w-3">
      <path
        d="M2 11.9V14h2.1l6.2-6.2-2.1-2.1L2 11.9Zm9.9-5.5c.2-.2.2-.6 0-.8L10.4 4c-.2-.2-.6-.2-.8 0L8.4 5.2l2.1 2.1 1.4-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BottomAction({ onShowMore }) {
  return (
    <button
      type="button"
      onClick={onShowMore}
      className="flex h-[60px] w-full items-center justify-center gap-3 bg-[#EEC200] px-6 font-['Space_Grotesk',Arial,sans-serif] text-sm font-black uppercase leading-5 tracking-[2.8px] text-[#3C2F00] shadow-[8px_8px_0_#3C2F00] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0_#3C2F00]"
    >
      <span>Lihat Menu Lain</span>
      <ArrowRightIcon />
    </button>
  );
}

function AddMenuModal({ item, onClose, onConfirm }) {
  const [selectedOptionId, setSelectedOptionId] = useState(
    item.temperatureOptions[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const selectedOption =
    item.temperatureOptions.find((option) => option.id === selectedOptionId) ??
    item.temperatureOptions[0];
  const totalPrice = (selectedOption?.price ?? item.price) * quantity;

  const handleSubmit = (event) => {
    event.preventDefault();

    onConfirm({
      ...item,
      price: selectedOption?.price ?? item.price,
      variantLabel: selectedOption?.label,
      note: note.trim(),
      quantity,
      cartKey: `${item.id}::${selectedOption?.id ?? "default"}::${note.trim()}`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onMouseDown={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        className="relative h-[342px] w-[300px] overflow-hidden rounded-xl bg-[#091421] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      >
        <header className="flex h-[52px] items-start justify-center border-b border-white/50 px-5 pt-4">
          <h2 className="text-center text-xs font-normal leading-5 text-white">
            Tambahkan Menu
          </h2>
        </header>

        <div className="px-2 pt-1">
          <div className="relative min-h-[92px] border-b border-white/15">
            <img
              src={item.image}
              alt={item.name}
              className="absolute left-0 top-2 h-[53px] w-[53px] object-cover"
            />

            <div className="ml-[65px] pt-2">
              <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-1">
                <p className="font-['Source_Sans_3',Arial,sans-serif] text-[10px] font-bold uppercase leading-[10px] tracking-[-1.2px] text-white">
                  {item.name}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(current - 1, 1))}
                    className="flex h-[11px] w-[10px] items-center justify-center rounded-full bg-[#BA1A1A] text-white"
                    aria-label="Kurangi jumlah menu"
                  >
                    <MinusIcon className="h-2.5 w-2.5" />
                  </button>
                  <span className="font-['Space_Grotesk',Arial,sans-serif] text-base font-bold leading-[27px] tracking-[-1.2px] text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="flex h-[11px] w-[10px] items-center justify-center rounded-full bg-white text-[#BA1A1A]"
                    aria-label="Tambah jumlah menu"
                  >
                    <PlusIcon className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-0.5 pt-1">
                {item.temperatureOptions.map((option) => {
                  const isActive = option.id === selectedOptionId;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOptionId(option.id)}
                      className="flex h-[21px] w-full items-center justify-between border-b border-white/15 text-left font-['Source_Sans_3',Arial,sans-serif] text-[10px] font-bold uppercase leading-[10px] tracking-[-1.2px] text-white"
                    >
                      <span>
                        {option.label} idr {Math.round(option.price / 1000)}k
                      </span>
                      <span
                        className={`flex h-4 w-[15px] items-center justify-center rounded-full ${
                          isActive ? "bg-[#BA1A1A]" : "bg-white"
                        }`}
                      >
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <label className="mt-[-1px] flex items-center gap-2 px-[47px] pt-1 text-[13px] font-normal leading-5 text-white/50">
            <PencilIcon />
            <span>Catatan untuk Menu:</span>
          </label>

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Misal: less sugar & less ice kak"
            className="mt-1 h-[156px] w-full resize-none border-2 border-[#5C403C] bg-transparent px-1 py-1 font-['Space_Grotesk',Arial,sans-serif] text-[10px] font-normal leading-[10px] tracking-[-0.45px] text-white outline-none placeholder:text-white"
          />
        </div>

        <button
          type="submit"
          className="absolute bottom-0 left-0 flex h-[30px] w-full items-center justify-center gap-2 bg-[#DC2626] px-2 font-['Space_Grotesk',Arial,sans-serif] text-[10px] font-bold uppercase leading-6 tracking-[1.6px] text-white transition hover:bg-[#B91C1C]"
        >
          <PlusIcon className="h-3 w-3" />
          Tambah Pesanan - {formatRupiah(totalPrice)}
        </button>
      </form>
    </div>
  );
}

function CartSuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <section className="relative h-[338px] w-[348px] overflow-hidden rounded-xl bg-[#091421] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <header className="flex h-[44px] items-start justify-center border-b border-white/50 pt-3">
          <h2 className="text-xl font-normal leading-5 text-white">System</h2>
        </header>

        <div className="flex h-[248px] items-center justify-center px-10">
          <p className="w-[179px] text-center font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold uppercase leading-8 tracking-[-1.2px] text-white">
            Pesanan telah masuk ke keranjang
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute bottom-0 left-0 flex h-[46px] w-full items-center justify-center bg-[#DC2626] font-['Space_Grotesk',Arial,sans-serif] text-base font-bold uppercase leading-6 tracking-[1.6px] text-white transition hover:bg-[#B91C1C]"
        >
          Berhasil
        </button>
      </section>
    </div>
  );
}

export default function QRMenu() {
  const { addToCart, cartCount } = useOutletContext();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [configItem, setConfigItem] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = filteredItems.length > visibleCount;

  const handleAddRequest = (item) => {
    if (item.temperatureOptions?.length) {
      setConfigItem(item);
      return;
    }

    addToCart({
      ...item,
      quantity: 1,
      cartKey: `${item.id}::default::`,
    });
    setIsSuccessModalOpen(true);
  };

  const handleConfiguredAdd = (configuredItem) => {
    addToCart(configuredItem);
    setConfigItem(null);
  };

  return (
    <main className="flex flex-1 flex-col gap-[29px] border-r-4 border-[#212B39] px-7 pb-12 pt-7">
      <section className="box-border flex w-full max-w-[285px] flex-col border-l-8 border-[#DC2626] py-4 pl-2.5">
        <h1 className="font-['Space_Grotesk',Arial,sans-serif] text-[60px] font-bold uppercase leading-[60px] tracking-[-3px] text-[#D9E3F6]">
          Meja 04
        </h1>
        <p className="w-full max-w-[267px] text-[10px] font-medium uppercase leading-5 tracking-[1.4px] text-[#E6BDB8]">
          Ngopi santai penuh makna, nongkrongnya ya di Kedai Sigma.
        </p>
      </section>

      <nav className="flex w-full max-w-[372px] gap-4 overflow-x-auto border-b-2 border-[#2B3544] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categoryTabs.map((tab) => {
          const isActive = tab.value === activeCategory;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveCategory(tab.value);
                setVisibleCount(4);
              }}
              className={`relative h-7 shrink-0 font-['Space_Grotesk',Arial,sans-serif] text-[17px] font-bold uppercase leading-7 tracking-[-0.45px] transition ${
                isActive ? "text-[#FFB4AB]" : "text-[#E6BDB8] hover:text-[#FFB4AB]"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute -bottom-[18px] left-0 right-0 h-1 bg-[#FFB4AB]" />
              )}
            </button>
          );
        })}
      </nav>

      <section className="relative flex h-[58px] w-full max-w-[246px] items-center">
        <label className="flex h-12 w-[210px] max-w-full items-center gap-2 border-l-4 border-[#EEC200] bg-[#212B39] px-4 text-[#EEC200]">
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(4);
            }}
            placeholder="cari menu..."
            className="h-8 min-w-0 flex-1 bg-transparent px-3 text-xs font-bold uppercase leading-[15px] tracking-[1.2px] text-[#E6BDB8] outline-none placeholder:text-[#E6BDB8]"
          />
        </label>

        <Link
          to="/qr/keranjang"
          aria-label="Buka keranjang"
          className="absolute left-[218px] top-[13px] flex h-8 w-[42px] items-center text-[#EEC200]"
        >
          <CartIcon />
          {cartCount > 0 && (
            <span className="absolute left-7 top-[-12px] text-xl font-bold leading-[25px] tracking-[1.2px] text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </section>

      <section className="grid w-full max-w-[334px] grid-cols-2 gap-x-8 gap-y-8">
        {visibleItems.map((item) => (
          <QRMenuCard key={item.id} item={item} onAdd={handleAddRequest} />
        ))}
      </section>

      {visibleItems.length === 0 && (
        <div className="w-full max-w-[334px] border-l-4 border-[#EEC200] bg-[#212B39] p-5 text-xs font-bold uppercase leading-5 tracking-[1.2px] text-[#E6BDB8]">
          Menu tidak ditemukan.
        </div>
      )}

      {hasMore && (
        <div className="flex w-full max-w-[330px] justify-center pb-4">
          <BottomAction
            onShowMore={() => setVisibleCount((count) => count + 4)}
          />
        </div>
      )}

      {configItem && (
        <AddMenuModal
          key={configItem.id}
          item={configItem}
          onClose={() => setConfigItem(null)}
          onConfirm={handleConfiguredAdd}
        />
      )}

      {isSuccessModalOpen && (
        <CartSuccessModal onClose={() => setIsSuccessModalOpen(false)} />
      )}
    </main>
  );
}
