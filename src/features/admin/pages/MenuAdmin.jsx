import { useState } from "react";
import americanoImage from "../../../assets/Americano.jpg";
import ayamPopcornImage from "../../../assets/Ayam Popcorn.jpg";
import coffeeBearImage from "../../../assets/Coffee Bear.jpg";
import coffeeLatteImage from "../../../assets/Coffee Latte.webp";
import coffeeMilkV2Image from "../../../assets/Coffee Milk V2.jpeg";
import coffeeMilkImage from "../../../assets/Coffee Milk.jpg";
import coffeeMilkChocolateImage from "../../../assets/Coffe Milk Chocholate.jpg";
import coklatClassicRotiImage from "../../../assets/Coklat Clasic Roti.jpg";
import coklatClassicImage from "../../../assets/Coklat Clasic.jpg";
import espressoImage from "../../../assets/Espresso.webp";
import indomieNyemekHaluImage from "../../../assets/Indomie Nyemek Halu.jpg";
import indomieNyemekVinsenImage from "../../../assets/Indomie Nyemek Vinsen.jpg";
import kentangImage from "../../../assets/Kentang.jpg";
import kopiTubrukImage from "../../../assets/Kopi Tubruk.jpg";
import kopiTubrukSusuImage from "../../../assets/Kopi Tubruk Susu.jpg";
import lemonTeaImage from "../../../assets/Lemon Tea.jpg";
import miloImage from "../../../assets/Ice Milo.jpg";
import joshuaImage from "../../../assets/Joshua.jpg";
import lycheeTeaImage from "../../../assets/Lychee Tea.jpg";
import matchaImage from "../../../assets/Matcha.jpg";
import mixPlatterImage from "../../../assets/Mix Platter.jpg";
import nuggetImage from "../../../assets/Nugget.jpg";
import piscokImage from "../../../assets/Piscok.jpg";
import redvelvetImage from "../../../assets/Redvelvet.webp";
import risolMayoImage from "../../../assets/Risol Mayo.jpg";
import siomayAyamImage from "../../../assets/Siomay Ayam.jpg";
import sosisSoloImage from "../../../assets/Sosis Solo.jpg";
import strawberryMilkImage from "../../../assets/Strawberry Milk.jpg";
import tahuBaksoGorengImage from "../../../assets/Tahu Bakso Goreng.jpg";
import tarikTeaImage from "../../../assets/Teh Tarik.jpg";
import v6DripImage from "../../../assets/V6 Drip.jpg";
import v6DripSusuImage from "../../../assets/V6 Drip Susu.jpg";

const parsePrice = (price) => {
  const values = price.match(/\d[\d.]*/g)?.map((value) =>
    Number(value.replace(/\D/g, ""))
  );

  if (!values?.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
};

const formatShortPrice = (price) => `IDR ${Math.round(price / 1000)}k`;

const categoryOptions = [
  "Food",
  "Coffee Based",
  "Coffee Milk",
  "Tea Series",
  "Milk Series",
];

const menuItems = [
  { name: "Kentang", sku: "SKU-FO-001", category: "Food", price: "Rp 10.000", status: "ACTIVE", image: kentangImage, thumbnail: "from-yellow-100 via-amber-200 to-orange-300" },
  { name: "Risol Mayo", sku: "SKU-FO-002", category: "Food", price: "Rp 13.000", status: "ACTIVE", image: risolMayoImage, thumbnail: "from-orange-100 via-amber-200 to-yellow-300" },
  { name: "Sosis Solo", sku: "SKU-FO-003", category: "Food", price: "Rp 13.000", status: "ACTIVE", image: sosisSoloImage, thumbnail: "from-red-100 via-orange-200 to-amber-300" },
  { name: "Tahu Bakso Goreng", sku: "SKU-FO-004", category: "Food", price: "Rp 13.000", status: "ACTIVE", image: tahuBaksoGorengImage, thumbnail: "from-stone-100 via-yellow-200 to-orange-300" },
  { name: "Piscok", sku: "SKU-FO-005", category: "Food", price: "Rp 13.000", status: "ACTIVE", image: piscokImage, thumbnail: "from-yellow-100 via-amber-200 to-stone-300" },
  { name: "Nugget", sku: "SKU-FO-006", category: "Food", price: "Rp 13.000", status: "ACTIVE", image: nuggetImage, thumbnail: "from-orange-100 via-yellow-200 to-amber-300" },
  { name: "Siomay Ayam", sku: "SKU-FO-007", category: "Food", price: "Rp 15.000", status: "ACTIVE", image: siomayAyamImage, thumbnail: "from-lime-100 via-yellow-200 to-orange-300" },
  { name: "Ayam Popcorn", sku: "SKU-FO-008", category: "Food", price: "Rp 15.000", status: "ACTIVE", image: ayamPopcornImage, thumbnail: "from-amber-100 via-orange-200 to-red-300" },
  { name: "Mix Platter", sku: "SKU-FO-009", category: "Food", price: "Rp 20.000", status: "OUT OF STOCK", image: mixPlatterImage, thumbnail: "from-red-100 via-amber-200 to-yellow-300" },
  { name: "Indomie Nyemek Halu", sku: "SKU-FO-010", category: "Food", price: "Rp 15.000", status: "ACTIVE", image: indomieNyemekHaluImage, thumbnail: "from-yellow-100 via-orange-200 to-red-300" },
  { name: "Indomie Nyemek Vinsen", sku: "SKU-FO-011", category: "Food", price: "Rp 15.000", status: "ACTIVE", image: indomieNyemekVinsenImage, thumbnail: "from-orange-100 via-red-200 to-yellow-300" },
  { name: "Coffee Bear", sku: "SKU-CB-001", category: "Coffee Based", price: "Rp 16.000", status: "ACTIVE", image: coffeeBearImage, thumbnail: "from-stone-100 via-slate-200 to-amber-300" },
  { name: "Espresso", sku: "SKU-CB-002", category: "Coffee Based", price: "Rp 8.000", status: "ACTIVE", image: espressoImage, thumbnail: "from-stone-200 via-zinc-300 to-amber-400" },
  { name: "Americano", sku: "SKU-CB-003", category: "Coffee Based", price: "Rp 10.000/13.000", status: "ACTIVE", image: americanoImage, thumbnail: "from-slate-100 via-stone-200 to-zinc-300" },
  { name: "Kopi Tubruk", sku: "SKU-CB-004", category: "Coffee Based", price: "Rp 8.000", status: "ACTIVE", image: kopiTubrukImage, thumbnail: "from-amber-100 via-stone-300 to-zinc-400" },
  { name: "V6 Drip", sku: "SKU-CB-005", category: "Coffee Based", price: "Rp 10.000", status: "ACTIVE", image: v6DripImage, thumbnail: "from-stone-100 via-amber-200 to-zinc-300" },
  { name: "Coffee Milk Chocolate", sku: "SKU-CM-001", category: "Coffee Milk", price: "Rp 15.000", status: "ACTIVE", image: coffeeMilkChocolateImage, thumbnail: "from-amber-100 via-stone-200 to-orange-300" },
  { name: "Coffee Milk", sku: "SKU-CM-002", category: "Coffee Milk", price: "Rp 13.000", status: "ACTIVE", image: coffeeMilkImage, thumbnail: "from-stone-100 via-amber-200 to-yellow-300" },
  { name: "Coffee Latte", sku: "SKU-CM-003", category: "Coffee Milk", price: "Rp 13.000/15.000", status: "ACTIVE", image: coffeeLatteImage, thumbnail: "from-orange-100 via-amber-200 to-stone-300" },
  { name: "Coffee Milk V2", sku: "SKU-CM-004", category: "Coffee Milk", price: "Rp 13.000", status: "ACTIVE", image: coffeeMilkV2Image, thumbnail: "from-yellow-100 via-amber-200 to-stone-300" },
  { name: "V6 Drip Susu", sku: "SKU-CM-005", category: "Coffee Milk", price: "Rp 13.000", status: "ACTIVE", image: v6DripSusuImage, thumbnail: "from-stone-100 via-orange-200 to-amber-300" },
  { name: "Kopi Tubruk Susu", sku: "SKU-CM-006", category: "Coffee Milk", price: "Rp 10.000", status: "ACTIVE", image: kopiTubrukSusuImage, thumbnail: "from-amber-100 via-yellow-200 to-stone-300" },
  { name: "Lemon Tea", sku: "SKU-TE-001", category: "Tea Series", price: "Rp 10.000", status: "ACTIVE", image: lemonTeaImage, thumbnail: "from-lime-100 via-yellow-200 to-green-300" },
  { name: "Lychee Tea", sku: "SKU-TE-002", category: "Tea Series", price: "Rp 10.000", status: "ACTIVE", image: lycheeTeaImage, thumbnail: "from-rose-100 via-pink-200 to-lime-300" },
  { name: "Tarik Tea", sku: "SKU-TE-003", category: "Tea Series", price: "Rp 13.000", status: "ACTIVE", image: tarikTeaImage, thumbnail: "from-orange-100 via-amber-200 to-yellow-300" },
  { name: "Milo", sku: "SKU-MS-001", category: "Milk Series", price: "Rp 13.000", status: "ACTIVE", image: miloImage, thumbnail: "from-green-100 via-lime-200 to-emerald-300" },
  { name: "Joshua", sku: "SKU-MS-002", category: "Milk Series", price: "Rp 13.000", status: "ACTIVE", image: joshuaImage, thumbnail: "from-blue-100 via-sky-200 to-cyan-300" },
  { name: "Matcha", sku: "SKU-MS-003", category: "Milk Series", price: "Rp 13.000/15.000", status: "ACTIVE", image: matchaImage, thumbnail: "from-emerald-100 via-lime-200 to-teal-300" },
  { name: "Redvelvet", sku: "SKU-MS-004", category: "Milk Series", price: "Rp 13.000/15.000", status: "ACTIVE", image: redvelvetImage, thumbnail: "from-red-100 via-rose-200 to-pink-300" },
  { name: "Coklat Classic", sku: "SKU-MS-005", category: "Milk Series", price: "Rp 13.000", status: "ACTIVE", image: coklatClassicImage, thumbnail: "from-stone-100 via-amber-200 to-orange-300" },
  { name: "Coklat Classic Roti", sku: "SKU-MS-006", category: "Milk Series", price: "Rp 15.000", status: "ACTIVE", image: coklatClassicRotiImage, thumbnail: "from-yellow-100 via-amber-200 to-stone-300" },
  { name: "Strawberry Milk", sku: "SKU-MS-007", category: "Milk Series", price: "Rp 15.000", status: "ACTIVE", image: strawberryMilkImage, thumbnail: "from-pink-100 via-rose-200 to-red-300" },
];

const chunkItems = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  );

const menuPages = chunkItems(menuItems, 8);

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
      <path
        d="M6 14V8H0V6H6V0H8V6H14V8H8V14H6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
      <path
        d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="h-[30px] w-[33px]" viewBox="0 0 33 30" fill="none">
      <path
        d="M8.25 30C6.05 30 4.10417 29.25 2.4125 27.75C0.804167 26.1667 0 24.25 0 22C0 20.0667 0.579167 18.35 1.7375 16.85C2.89583 15.35 4.41667 14.3667 6.3 13.9C6.925 11.6333 8.175 9.8 10.05 8.4C11.925 6.96667 14.0667 6.25 16.475 6.25C19.4417 6.25 21.9583 7.28333 24.025 9.35C26.0917 11.3833 27.125 13.8833 27.125 16.85C28.825 17.05 30.225 17.7833 31.325 19.05C32.4417 20.2833 33 21.7333 33 23.4C33 25.2333 32.3583 26.8 31.075 28.1C29.775 29.3667 28.2 30 26.35 30H18.5V18.35L22.25 22.1L24.6 19.75L16.5 11.65L8.4 19.75L10.75 22.1L14.5 18.35V30H8.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 16H3.4L12.025 7.375L10.625 5.975L2 14.6V16ZM0 18V13.75L12.025 1.75C12.225 1.56667 12.4458 1.425 12.6875 1.325C12.9292 1.225 13.1833 1.175 13.45 1.175C13.7167 1.175 13.975 1.225 14.225 1.325C14.475 1.425 14.6917 1.575 14.875 1.775L16.25 3.175C16.45 3.35833 16.5958 3.575 16.6875 3.825C16.7792 4.075 16.825 4.325 16.825 4.575C16.825 4.84167 16.7792 5.09583 16.6875 5.3375C16.5958 5.57917 16.45 5.8 16.25 6L4.25 18H0ZM11.325 6.675L10.625 5.975L12.025 7.375L11.325 6.675Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TrashIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 16 18" fill="none">
      <path
        d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-3 w-2" viewBox="0 0 8 12" fill="none">
      <path
        d="M6.6 12L0.6 6L6.6 0L8 1.4L3.4 6L8 10.6L6.6 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-3 w-2" viewBox="0 0 8 12" fill="none">
      <path
        d="M1.4 12L0 10.6L4.6 6L0 1.4L1.4 0L7.4 6L1.4 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SelectChevronIcon() {
  return (
    <svg className="h-[21px] w-[21px]" viewBox="0 0 21 21" fill="none">
      <path d="M6.3 8.4L10.5 12.6L14.7 8.4" stroke="currentColor" strokeWidth="1.575" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AddMenuModal({ onClose, onSave }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").trim() || "Menu Baru";
    const selectedCategory = formData.get("category");
    const price = Number(formData.get("price")) || 0;
    const status = formData.get("status");
    const category =
      selectedCategory === "Pilih Kategori" ? "Coffee Milk" : selectedCategory;

    onSave({
      name,
      sku: `SKU-${Date.now()}`,
      category,
      price: `Rp ${price.toLocaleString("id-ID")}`,
      status,
      thumbnail: "from-blue-100 via-sky-200 to-cyan-300",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <div className="relative flex h-[715px] w-full max-w-[672px] animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] flex-col items-start overflow-hidden rounded-3xl bg-white pb-4 shadow-2xl shadow-black/25">
        <header className="flex h-[81px] w-full shrink-0 items-center justify-between border-b border-[#C3C6D7]/10 px-8 py-6">
          <h3 className="flex h-8 items-center text-2xl font-extrabold leading-8 text-[#191C1E]">
            Tambah Menu
          </h3>
          <button
            type="button"
            aria-label="Tutup tambah menu"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#434655] transition hover:bg-[#F2F4F6]"
          >
            <CloseIcon />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex w-full flex-1 flex-col gap-10 p-8">
          <div className="grid w-full grid-cols-2 gap-x-8 gap-y-6">
            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-bold leading-4 text-[#434655]">
                Nama Menu
              </span>
              <input
                name="name"
                type="text"
                placeholder="nama menu..."
                className="h-[38px] w-full border-0 border-b-2 border-[#C3C6D7] bg-transparent px-3 pb-2.5 pt-[9px] text-sm font-medium leading-[17px] text-[#191C1E] outline-none placeholder:text-[#434655]/40 focus:border-[#2563EB]"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold leading-4 text-[#434655]">
                Kategori
              </span>
              <div className="relative">
                <select
                  name="category"
                  className="h-[38px] w-full appearance-none border-0 border-b-2 border-[#C3C6D7] bg-transparent px-3 pr-10 text-sm font-medium leading-5 text-[#191C1E] outline-none focus:border-[#2563EB]"
                >
                  <option>Pilih Kategori</option>
                  {categoryOptions.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                  <SelectChevronIcon />
                </span>
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold leading-4 text-[#434655]">
                Status Stok
              </span>
              <div className="relative">
                <select
                  name="status"
                  defaultValue="ACTIVE"
                  className="h-[38px] w-full appearance-none border-0 border-b-2 border-[#C3C6D7] bg-transparent px-3 pr-10 text-sm font-medium leading-5 text-[#191C1E] outline-none focus:border-[#2563EB]"
                >
                  <option value="ACTIVE">Tersedia</option>
                  <option value="OUT OF STOCK">Stok Habis</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                  <SelectChevronIcon />
                </span>
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold leading-4 text-[#434655]">
                Harga (IDR)
              </span>
              <div className="relative h-[38px] border-b-2 border-[#C3C6D7] focus-within:border-[#2563EB]">
                <span className="absolute bottom-2 left-0 text-sm font-medium leading-5 text-[#434655]">
                  IDR
                </span>
                <input
                  name="price"
                  type="number"
                  placeholder="0"
                  className="h-full w-full border-0 bg-transparent pl-7 pr-3 text-sm font-medium leading-[17px] text-[#191C1E] outline-none placeholder:text-[#434655]/40"
                />
              </div>
            </label>

            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-bold leading-4 text-[#434655]">
                Deskripsi
              </span>
              <textarea
                placeholder="deskripsi dari menu..."
                className="h-[78px] w-full resize-none border-0 border-b-2 border-[#C3C6D7] bg-transparent px-3 pb-12 pt-2 text-sm font-medium leading-5 text-[#191C1E] outline-none placeholder:text-[#434655]/40 focus:border-[#2563EB]"
              />
            </label>

            <label className="col-span-2 flex flex-col gap-3">
              <span className="text-xs font-bold leading-4 text-[#434655]">
                Foto Menu
              </span>
              <div className="flex h-[146px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#C3C6D7]/50 bg-[#F2F4F6]/50 p-8 text-center transition hover:border-[#2563EB]/50">
                <input type="file" accept="image/*" className="sr-only" />
                <div className="pb-2 text-[#434655]/40">
                  <UploadIcon />
                </div>
                <p className="text-sm font-semibold leading-5 text-[#434655]">
                  Klik untuk upload foto
                </p>
                <p className="pt-1 text-xs leading-4 text-[#434655]/60">
                  PNG, JPG maksimal 2MB
                </p>
              </div>
            </label>
          </div>

          <div className="flex h-11 w-full justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 items-center justify-center rounded-xl px-8 text-sm font-bold leading-5 text-[#434655] transition hover:bg-[#F2F4F6]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="relative flex h-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-10 text-sm font-bold leading-5 text-white shadow-[0_10px_15px_-3px_rgba(0,74,198,0.2),0_4px_6px_-4px_rgba(0,74,198,0.2)] transition hover:brightness-105"
            >
              Simpan Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditMenuModal({ item, onClose, onSave }) {
  if (!item) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const price = Number(formData.get("price")) || 0;

    onSave({
      ...item,
      name: formData.get("name").trim() || item.name,
      category: formData.get("category"),
      description: formData.get("description").trim(),
      price: `Rp ${price.toLocaleString("id-ID")}`,
      status: formData.get("status"),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <div className="relative flex h-[690px] w-full max-w-[672px] animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] flex-col items-center gap-6 overflow-hidden rounded-[32px] bg-[#F7F9FB] pt-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <header className="flex h-8 w-[calc(100%-80px)] max-w-[592px] items-center justify-between">
          <h2 className="text-2xl font-extrabold leading-8 tracking-[-0.025em] text-[#191C1E]">
            Edit Menu
          </h2>
          <button
            type="button"
            aria-label="Tutup edit menu"
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-xl text-[#191C1E] transition hover:bg-[#E6E8EA]"
          >
            <CloseIcon />
          </button>
        </header>

        <form
          id={`edit-menu-${item.sku}`}
          onSubmit={handleSubmit}
          className="flex h-[462px] w-[calc(100%-80px)] max-w-[592px] flex-col gap-6"
        >
          <label className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#434655]">
              Edit Foto
            </span>
            <div className="flex h-24 items-center gap-6">
              <MenuThumbnail
                gradient={item.thumbnail}
                image={item.image}
                name={item.name}
                className="h-20 w-20"
              />
              <div className="flex h-24 flex-1 items-center justify-center rounded-lg border-2 border-dashed border-[#C3C6D7]/50 transition hover:border-[#004AC6]/50">
                <input type="file" accept="image/*" className="sr-only" />
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                  <div className="text-[#004AC6]">
                    <UploadIcon />
                  </div>
                  <span className="text-xs font-semibold leading-4 text-[#434655]">
                    Klik untuk ganti foto
                  </span>
                </div>
              </div>
            </div>
          </label>

          <div className="grid grid-cols-[1fr_140px] gap-x-8 gap-y-6">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#434655]">
                Edit Nama
              </span>
              <input
                name="name"
                defaultValue={item.name}
                className="h-[42px] border-0 border-b-2 border-[#C3C6D7] bg-transparent py-2 text-base font-medium leading-6 text-[#191C1E] outline-none focus:border-[#2563EB]"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#434655]">
                Edit Kategori
              </span>
              <div className="relative">
                <select
                  name="category"
                  defaultValue={item.category}
                  className="h-[42px] w-full appearance-none border-0 border-b-2 border-[#C3C6D7] bg-transparent pr-8 text-base font-medium leading-6 text-[#191C1E] outline-none focus:border-[#2563EB]"
                >
                  {categoryOptions.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-500">
                  <SelectChevronIcon />
                </span>
              </div>
            </label>

            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#434655]">
                Edit Deskripsi
              </span>
              <textarea
                name="description"
                defaultValue={item.description || `${item.name} tersedia di Kedai Sigma.`}
                className="h-[66px] resize-none border-0 border-b-2 border-[#C3C6D7] bg-transparent py-2 text-base font-medium leading-6 text-[#191C1E] outline-none focus:border-[#2563EB]"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#434655]">
                Edit Harga
              </span>
              <div className="relative h-[42px] border-b-2 border-[#C3C6D7] focus-within:border-[#2563EB]">
                <span className="absolute left-0 top-2 text-sm font-medium leading-5 text-[#434655]">
                  IDR
                </span>
                <input
                  name="price"
                  type="number"
                  defaultValue={parsePrice(item.price)}
                  className="h-full w-full border-0 bg-transparent pl-12 text-base font-medium leading-6 text-[#191C1E] outline-none"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#434655]">
                Info Stock
              </span>
              <div className="relative">
                <select
                  name="status"
                  defaultValue={item.status}
                  className="h-[42px] w-full appearance-none border-0 border-b-2 border-[#C3C6D7] bg-transparent pr-8 text-base font-medium leading-6 text-[#191C1E] outline-none focus:border-[#2563EB]"
                >
                  <option value="ACTIVE">Tersedia</option>
                  <option value="OUT OF STOCK">Stok Habis</option>
                </select>
                <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-500">
                  <SelectChevronIcon />
                </span>
              </div>
            </label>
          </div>
        </form>

        <div className="mt-auto flex h-[108px] w-full items-start justify-end gap-4 bg-[#F2F4F6] px-10 py-8">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-xl bg-white px-8 text-sm font-bold leading-5 text-[#434655] transition hover:bg-[#E6E8EA]"
          >
            Batal
          </button>
          <button
            type="submit"
            form={`edit-menu-${item.sku}`}
            className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-8 text-sm font-bold leading-5 text-white shadow-[0_10px_15px_-3px_rgba(0,74,198,0.2),0_4px_6px_-4px_rgba(0,74,198,0.2)] transition hover:brightness-105"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ itemName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <div className="relative box-border flex h-[321.8px] w-full max-w-96 animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] flex-col items-start rounded-2xl border border-[#C3C6D7]/10 bg-white shadow-2xl shadow-black/25">
        <div className="flex h-[319.8px] w-full flex-col items-start gap-[10.8px] p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BA1A1A]/10 text-[#BA1A1A]">
            <TrashIcon className="h-[23.75px] w-[27.5px]" />
          </div>

          <h3 className="flex h-[41.2px] w-full items-center pt-[13.2px] text-xl font-bold leading-7 tracking-[-0.5px] text-[#191C1E]">
            Konfirmasi Hapus
          </h3>

          <p className="flex h-[69px] w-full items-center text-sm font-normal leading-[23px] text-[#434655]">
            Apakah Anda yakin ingin menghapus {itemName ? `"${itemName}"` : "menu ini"}? Tindakan ini tidak dapat dibatalkan dan item akan dihapus dari semua daftar menu.
          </p>

          <div className="relative h-[65.2px] w-full">
            <button
              type="button"
              onClick={onCancel}
              className="absolute left-0 top-[21.2px] flex h-11 w-[153.75px] items-center justify-center rounded-lg bg-[#E6E8EA] text-sm font-bold leading-5 tracking-[0.35px] text-[#191C1E] transition hover:brightness-95"
            >
              No
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="absolute left-[165px] top-[21.2px] flex h-11 w-[162.34px] items-center justify-center rounded-lg bg-[#BA1A1A] text-sm font-bold leading-5 tracking-[0.35px] text-white shadow-[0_10px_15px_-3px_rgba(186,26,26,0.2),0_4px_6px_-4px_rgba(186,26,26,0.2)] transition hover:brightness-105"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, danger }) {
  return (
    <div className="h-[108px] rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
      <p className="text-xs font-bold uppercase leading-4 tracking-[0.6px] text-[#434655]">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-bold leading-9 ${
          danger ? "text-[#BA1A1A]" : "text-[#191C1E]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const isOutOfStock = status === "OUT OF STOCK";

  return (
    <span
      className={`inline-flex h-5 items-center gap-1.5 rounded-xl px-3 text-[10px] font-bold uppercase leading-3 tracking-[0.25px] ${
        isOutOfStock
          ? "bg-[#FFDAD6] text-[#93000A]"
          : "bg-[#6CF8BB] text-[#00714D]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOutOfStock ? "bg-[#BA1A1A]" : "bg-[#006C49]"
        }`}
      />
      {status}
    </span>
  );
}

function MenuThumbnail({ gradient, image, name = "Menu", className = "h-12 w-12" }) {
  return (
    <div className={`${className} shrink-0 overflow-hidden rounded bg-gradient-to-br ${gradient}`}>
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/10">
          <div className="h-7 w-7 rounded-full bg-white/35 shadow-inner" />
        </div>
      )}
    </div>
  );
}

function MenuRow({ item, index, onDeleteClick, onEditClick }) {
  return (
    <tr className={index > 1 ? "border-t border-[#E6E8EA]" : ""}>
      <td className="h-[81px] px-6">
        <div className="flex items-center gap-4">
          <MenuThumbnail
            gradient={item.thumbnail}
            image={item.image}
            name={item.name}
          />
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-5 text-[#191C1E]">
              {item.name}
            </p>
            <p className="truncate text-xs leading-4 text-[#434655]">{item.sku}</p>
          </div>
        </div>
      </td>
      <td className="h-[81px] px-6 pl-12 text-sm leading-5 text-[#434655]">
        {item.category}
      </td>
      <td className="h-[81px] whitespace-nowrap px-6 text-base font-semibold leading-5 text-[#191C1E]">
        {item.price}
      </td>
      <td className="h-[81px] px-6">
        <StatusBadge status={item.status} />
      </td>
      <td className="h-[81px] px-6">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            aria-label={`Edit ${item.name}`}
            onClick={() => onEditClick(item)}
            className="flex h-[34px] w-[34px] items-center justify-center rounded text-[#004AC6] transition hover:bg-blue-50"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            aria-label={`Hapus ${item.name}`}
            onClick={() => onDeleteClick(item)}
            className="flex h-[34px] w-8 items-center justify-center rounded text-[#BA1A1A] transition hover:bg-red-50"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function MenuAdmin() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [menuPageItems, setMenuPageItems] = useState(menuPages);
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const items = menuPageItems[currentPage];
  const totalMenuItems = menuPageItems.reduce(
    (total, pageItems) => total + pageItems.length,
    0
  );
  const flatMenuItems = menuPageItems.flat();
  const activeCategories = new Set(flatMenuItems.map((item) => item.category)).size;
  const outOfStockCount = flatMenuItems.filter(
    (item) => item.status === "OUT OF STOCK"
  ).length;
  const averagePrice =
    flatMenuItems.reduce((total, item) => total + parsePrice(item.price), 0) /
    Math.max(flatMenuItems.length, 1);
  const dashboardStats = [
    { label: "Total Items", value: String(totalMenuItems).padStart(2, "0") },
    { label: "Active Categories", value: String(activeCategories) },
    {
      label: "Out of Stock",
      value: String(outOfStockCount).padStart(2, "0"),
      danger: true,
    },
    { label: "Avg Price", value: formatShortPrice(averagePrice) },
  ];

  const handleAddMenu = (newItem) => {
    setMenuPageItems((currentPages) =>
      currentPages.map((pageItems, pageIndex) =>
        pageIndex === currentPage ? [newItem, ...pageItems] : pageItems
      )
    );
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setMenuPageItems((currentPages) =>
      currentPages.map((pageItems, pageIndex) =>
        pageIndex === currentPage
          ? pageItems.filter((item) => item.sku !== deleteTarget.sku)
          : pageItems
      )
    );
    setDeleteTarget(null);
  };

  const handleSaveEdit = (updatedItem) => {
    setMenuPageItems((currentPages) =>
      currentPages.map((pageItems) =>
        pageItems.map((item) =>
          item.sku === updatedItem.sku ? updatedItem : item
        )
      )
    );
    setEditTarget(null);
  };

  return (
    <div className="min-h-full bg-[#F7F9FB] p-8">
      <div className="mx-auto max-w-[960px] space-y-8">
        <section className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold leading-9 text-[#191C1E]">
              Kelola Menu
            </h1>
            <p className="mt-1 text-sm leading-5 text-[#434655]">
              Kontrol stok dan atur harga.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex h-11 items-center gap-2 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-6 text-base font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:brightness-105"
          >
            <PlusIcon />
            Tambah Menu
          </button>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] table-fixed border-collapse">
              <colgroup>
                <col className="w-[31%]" />
                <col className="w-[15%]" />
                <col className="w-[23%]" />
                <col className="w-[17%]" />
                <col className="w-[14%]" />
              </colgroup>

              <thead>
                <tr className="h-12 bg-[#F2F4F6]/30 text-left text-xs font-bold uppercase tracking-[1.2px] text-[#434655]">
                  <th className="px-6">Menu Item</th>
                  <th className="px-6">Category</th>
                  <th className="px-6">Price</th>
                  <th className="px-6">Status</th>
                  <th className="px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <MenuRow
                    key={item.sku}
                    item={item}
                    index={index}
                    onDeleteClick={setDeleteTarget}
                    onEditClick={setEditTarget}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <footer className="flex h-[61px] items-center justify-between border-t border-[#E6E8EA] bg-[#F2F4F6]/10 px-6">
            <p className="text-xs leading-4 text-[#434655]">
              Showing {items.length} of {totalMenuItems} menu items
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
                className="flex h-7 w-6 items-center justify-center rounded text-[#434655] transition hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeftIcon />
              </button>
              {menuPageItems.map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  type="button"
                  onClick={() => setCurrentPage(pageIndex)}
                  className={`flex h-7 min-w-7 items-center justify-center rounded px-3 text-xs font-bold leading-4 transition ${
                    currentPage === pageIndex
                      ? "bg-[#2563EB] text-white"
                      : "text-[#191C1E] hover:bg-slate-100"
                  }`}
                >
                  {pageIndex + 1}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === menuPageItems.length - 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, menuPageItems.length - 1)
                  )
                }
                className="flex h-7 w-6 items-center justify-center rounded text-[#434655] transition hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </footer>
        </section>
      </div>

      {isAddModalOpen && (
        <AddMenuModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddMenu}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          itemName={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {editTarget && (
        <EditMenuModal
          item={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
