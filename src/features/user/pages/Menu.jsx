import { useEffect, useState } from "react";
import {
  getPublicCategories,
  getPublicMenus,
  resolveBackendAsset,
} from "../../../services/api";

const formatPrice = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await getPublicCategories();

        if (isMounted) {
          setCategories(response.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadMenus = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getPublicMenus(selectedCategory);

        if (isMounted) {
          setMenus(response.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setMenus([]);
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMenus();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <section className="min-h-[70vh] bg-[#091421] px-6 py-20 text-[#D9E3F6] md:px-24">
      <div className="mx-auto flex max-w-[1088px] flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="font-['Space_Grotesk',sans-serif] text-sm font-bold uppercase tracking-[0.2em] text-[#EEC200]">
            Kedai Sigma
          </p>
          <h1 className="font-['Space_Grotesk',sans-serif] text-6xl font-black uppercase tracking-[-0.05em] md:text-8xl">
            Menu
          </h1>
          <p className="max-w-2xl font-['Be_Vietnam_Pro',sans-serif] text-base leading-8 text-[#E6BDB8] md:text-lg">
            Daftar menu ini langsung mengambil data dari backend Laravel.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`h-11 px-5 font-['Space_Grotesk',sans-serif] text-sm font-bold uppercase transition ${
              selectedCategory === ""
                ? "bg-[#DC2626] text-white"
                : "border border-[#2B3544] bg-[#121C2A] text-[#D9E3F6] hover:border-[#EEC200]"
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(String(category.id))}
              className={`h-11 px-5 font-['Space_Grotesk',sans-serif] text-sm font-bold uppercase transition ${
                selectedCategory === String(category.id)
                  ? "bg-[#DC2626] text-white"
                  : "border border-[#2B3544] bg-[#121C2A] text-[#D9E3F6] hover:border-[#EEC200]"
              }`}
            >
              {category.nama_kategori}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="border border-[#DC2626]/40 bg-[#3B1115] px-5 py-4 font-['Be_Vietnam_Pro',sans-serif] text-sm text-[#FFB4AB]">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="border border-[#2B3544] bg-[#121C2A] px-6 py-10 font-['Be_Vietnam_Pro',sans-serif] text-sm text-[#94A3B8]">
            Memuat menu...
          </div>
        ) : menus.length === 0 ? (
          <div className="border border-[#2B3544] bg-[#121C2A] px-6 py-10 font-['Be_Vietnam_Pro',sans-serif] text-sm text-[#94A3B8]">
            Belum ada menu tersedia untuk kategori ini.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {menus.map((menu) => (
              <article
                key={menu.id}
                className="flex min-h-[360px] flex-col overflow-hidden border border-[#2B3544] bg-[#121C2A]"
              >
                <div className="flex h-48 items-center justify-center bg-[#0D1826] font-['Space_Grotesk',sans-serif] text-sm font-black uppercase text-[#536173]">
                  {menu.foto_produk ? (
                    <img
                      src={resolveBackendAsset(menu.foto_produk)}
                      alt={menu.nama_produk}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    menu.kategori?.nama_kategori || "Menu"
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-['Be_Vietnam_Pro',sans-serif] text-xs font-bold uppercase tracking-[0.18em] text-[#EEC200]">
                          {menu.kategori?.nama_kategori || "Menu"}
                        </p>
                        <h2 className="mt-2 font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase text-white">
                          {menu.nama_produk}
                        </h2>
                      </div>
                      <span className="border border-[#4AE176]/30 bg-[#0F2317] px-3 py-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase text-[#4AE176]">
                        {menu.ketersediaan_produk?.replaceAll("_", " ")}
                      </span>
                    </div>

                    <p className="font-['Be_Vietnam_Pro',sans-serif] text-sm leading-7 text-[#CBD5E1]">
                      {menu.deskripsi_produk || "Deskripsi menu belum diisi."}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#2B3544] pt-5 font-['Space_Grotesk',sans-serif] text-2xl font-black text-[#FFB4AB]">
                    {formatPrice(menu.harga_produk)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
