import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { checkoutQrOrder, getQrMenuContext, resolveBackendAsset } from "../../../services/api";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const drinkKeywords = [
  "coffee",
  "kopi",
  "latte",
  "americano",
  "tea",
  "milo",
  "milk",
  "coklat",
  "matcha",
  "redvelvet",
  "drip",
  "espresso",
];

const needsVariant = (menuName = "") => {
  const normalized = menuName.toLowerCase();
  return drinkKeywords.some((keyword) => normalized.includes(keyword));
};

const getCartKey = (produkId, opsiVarian) => `${produkId}-${opsiVarian || "normal"}`;

export default function QRMenu() {
  const location = useLocation();
  const mejaId = new URLSearchParams(location.search).get("meja_id") || "";
  const [context, setContext] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [variantByMenu, setVariantByMenu] = useState({});
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadContext = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getQrMenuContext(mejaId);

        if (isMounted) {
          setContext(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadContext();

    return () => {
      isMounted = false;
    };
  }, [mejaId]);

  const categories = useMemo(() => {
    const map = new Map();

    (context?.menu || [])
      .filter((menu) => menu.ketersediaan_produk === "tersedia")
      .forEach((menu) => {
        if (menu.kategori) {
          map.set(menu.kategori.id, menu.kategori.nama_kategori);
        }
      });

    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [context]);

  const filteredMenus = useMemo(() => {
    const availableMenus = (context?.menu || []).filter(
      (menu) => menu.ketersediaan_produk === "tersedia",
    );

    if (selectedCategory === "semua") {
      return availableMenus;
    }

    return availableMenus.filter(
      (menu) => String(menu.kategori_id) === selectedCategory,
    );
  }, [context, selectedCategory]);

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + Number(item.harga_produk || 0) * item.jumlah_item,
        0,
      ),
    [cart],
  );

  const addToCart = (menu) => {
    if (menu.ketersediaan_produk !== "tersedia") {
      setErrorMessage("Menu ini sedang habis stok.");
      return;
    }

    setErrorMessage("");

    const opsiVarian = needsVariant(menu.nama_produk)
      ? variantByMenu[menu.id] || "Ice"
      : null;
    const key = getCartKey(menu.id, opsiVarian);

    setCart((current) => {
      const existing = current.find((item) => item.key === key);

      if (existing) {
        return current.map((item) =>
          item.key === key
            ? { ...item, jumlah_item: item.jumlah_item + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          key,
          produk_id: menu.id,
          nama_produk: menu.nama_produk,
          harga_produk: Number(menu.harga_produk || 0),
          opsi_varian: opsiVarian,
          jumlah_item: 1,
        },
      ];
    });
  };

  const changeQuantity = (key, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.key === key
            ? { ...item, jumlah_item: item.jumlah_item + delta }
            : item,
        )
        .filter((item) => item.jumlah_item > 0),
    );
  };

  const handleCheckout = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!context?.meja?.id) {
      setErrorMessage("QR meja tidak valid. Scan QR dari meja yang tersedia.");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Keranjang masih kosong.");
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await checkoutQrOrder({
        meja_id: context.meja.id,
        reservasi_id: context.reservasi_aktif?.id || null,
        tipe_pesanan: "dine_in",
        catatan_pesanan: note.trim() || null,
        items: cart.map((item) => ({
          produk_id: item.produk_id,
          jumlah_item: item.jumlah_item,
          opsi_varian: item.opsi_varian,
        })),
      });

      setCart([]);
      setNote("");
      setSuccessMessage(
        response.message || "Pesanan berhasil dibuat. Silakan bayar lewat kasir.",
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col gap-6">
          <header className="rounded-lg bg-slate-900 p-6 ring-1 ring-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Kedai Sigma QR Menu
            </p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  {context?.meja?.nomor_meja || "Scan QR Meja"}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {context?.reservasi_aktif
                    ? `Reservasi atas nama ${context.reservasi_aktif.nama_reservasi}`
                    : "Pilih menu, masuk keranjang, lalu checkout bayar di kasir."}
                </p>
              </div>
              <span className="w-fit rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase text-emerald-300">
                {context?.reservasi_aktif ? "Reserved Table" : "Walk-in Table"}
              </span>
            </div>
          </header>

          {errorMessage && (
            <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-200">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-200">
              {successMessage}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory("semua")}
              className={`h-10 rounded-full px-5 text-sm font-bold ${
                selectedCategory === "semua"
                  ? "bg-amber-300 text-slate-950"
                  : "bg-slate-900 text-slate-300 ring-1 ring-white/10"
              }`}
            >
              Semua
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(String(category.id))}
                className={`h-10 rounded-full px-5 text-sm font-bold ${
                  selectedCategory === String(category.id)
                    ? "bg-amber-300 text-slate-950"
                    : "bg-slate-900 text-slate-300 ring-1 ring-white/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="rounded-lg bg-slate-900 p-8 text-sm font-semibold text-slate-400 ring-1 ring-white/10">
              Memuat menu...
            </div>
          ) : filteredMenus.length === 0 ? (
            <div className="rounded-lg bg-slate-900 p-8 text-sm font-semibold text-slate-400 ring-1 ring-white/10">
              Menu belum tersedia.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMenus.map((menu) => {
                const hasVariant = needsVariant(menu.nama_produk);

                return (
                  <article
                    key={menu.id}
                    className="flex min-h-[260px] flex-col overflow-hidden rounded-lg bg-slate-900 ring-1 ring-white/10"
                  >
                    <div className="flex h-28 items-center justify-center bg-slate-800 text-sm font-black uppercase text-slate-500">
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
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-300">
                        {menu.kategori?.nama_kategori || "Menu"}
                      </p>
                      <h2 className="mt-2 text-xl font-black">{menu.nama_produk}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        {menu.deskripsi_produk || "Menu Kedai Sigma."}
                      </p>
                      <p className="mt-4 text-2xl font-black text-white">
                        {formatRupiah(menu.harga_produk)}
                      </p>

                      <div className="mt-auto flex gap-2 pt-5">
                        {hasVariant && (
                          <select
                            value={variantByMenu[menu.id] || "Ice"}
                            onChange={(event) =>
                              setVariantByMenu((current) => ({
                                ...current,
                                [menu.id]: event.target.value,
                              }))
                            }
                            className="h-10 rounded-lg border border-white/10 bg-slate-950 px-3 text-sm font-bold text-white outline-none"
                          >
                            <option value="Ice">Ice</option>
                            <option value="Hot">Hot</option>
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() => addToCart(menu)}
                          className="h-10 flex-1 rounded-lg bg-amber-300 px-4 text-sm font-black text-slate-950 hover:bg-amber-200"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-lg bg-white p-5 text-slate-950 shadow-2xl lg:sticky lg:top-6">
          <h2 className="text-2xl font-black">Keranjang</h2>
          <p className="mt-1 text-sm text-slate-500">
            Bayar lewat kasir setelah checkout.
          </p>

          <div className="mt-5 space-y-3">
            {cart.length === 0 ? (
              <div className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-500">
                Keranjang masih kosong.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.key} className="rounded-lg border border-slate-100 p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-black">{item.nama_produk}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.opsi_varian || "Normal"} - {formatRupiah(item.harga_produk)}
                      </p>
                    </div>
                    <p className="font-black">
                      {formatRupiah(item.harga_produk * item.jumlah_item)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.key, -1)}
                      className="h-8 w-8 rounded bg-slate-100 text-lg font-black hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black">{item.jumlah_item}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.key, 1)}
                      className="h-8 w-8 rounded bg-slate-100 text-lg font-black hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <label className="mt-5 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Catatan Pesanan
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Contoh: less sugar, tanpa pedas"
              className="min-h-24 resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </label>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex justify-between text-sm font-semibold text-slate-500">
              <span>Subtotal</span>
              <span>{formatRupiah(cartTotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-xl font-black">
              <span>Total</span>
              <span>{formatRupiah(cartTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isCheckingOut || cart.length === 0}
            onClick={handleCheckout}
            className="mt-5 h-12 w-full rounded-lg bg-blue-600 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isCheckingOut ? "Checkout..." : "Checkout ke Kasir"}
          </button>
        </aside>
      </div>
    </main>
  );
}

