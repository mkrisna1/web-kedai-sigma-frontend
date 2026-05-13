import { useEffect, useMemo, useState } from "react";
import {
  createAdminMenu,
  deleteAdminMenu,
  getAdminCategories,
  getAdminMenus,
  updateAdminMenu,
  resolveBackendAsset,
} from "../../../services/api";

const emptyForm = {
  kategori_id: "",
  nama_produk: "",
  harga_produk: "",
  deskripsi_produk: "",
  foto_file: null,
  foto_preview: "",
  ketersediaan_produk: "tersedia",
};

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function StatusBadge({ status }) {
  const isAvailable = status === "tersedia";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        isAvailable
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      {isAvailable ? "Tersedia" : "Out of stock"}
    </span>
  );
}

function MenuFormModal({ categories, form, isSaving, onChange, onFileChange, onClose, onSubmit, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Tutup modal"
          >
            X
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 p-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Nama Menu
            </span>
            <input
              name="nama_produk"
              value={form.nama_produk}
              onChange={onChange}
              className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              placeholder="Contoh: Coffee Latte"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Kategori
            </span>
            <select
              name="kategori_id"
              value={form.kategori_id}
              onChange={onChange}
              className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nama_kategori}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Harga
            </span>
            <input
              name="harga_produk"
              type="number"
              min="0"
              value={form.harga_produk}
              onChange={onChange}
              className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              placeholder="13000"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Status Stok
            </span>
            <select
              name="ketersediaan_produk"
              value={form.ketersediaan_produk}
              onChange={onChange}
              className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
            >
              <option value="tersedia">Tersedia</option>
              <option value="tidak_tersedia">Out of stock</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Foto Menu
            </span>
            <div className="grid gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 md:grid-cols-[120px_1fr]">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-white text-xs font-black text-slate-400 ring-1 ring-slate-200">
                {form.foto_preview ? (
                  <img
                    src={form.foto_preview}
                    alt="Preview foto menu"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "IMG"
                )}
              </div>
              <div className="flex flex-col justify-center gap-2">
                <input
                  name="foto_produk"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={onFileChange}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:text-sm file:font-bold file:text-white hover:file:bg-blue-700"
                />
                <p className="text-xs leading-5 text-slate-500">
                  Format JPG, PNG, atau WEBP. Maksimal 2MB.
                </p>
              </div>
            </div>
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Deskripsi
            </span>
            <textarea
              name="deskripsi_produk"
              value={form.deskripsi_produk}
              onChange={onChange}
              className="min-h-28 resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              placeholder="Deskripsi singkat menu"
            />
          </label>

          <div className="flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg px-5 text-sm font-bold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 rounded-lg bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenuAdmin() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingMenu, setEditingMenu] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [menuResponse, categoryResponse] = await Promise.all([
        getAdminMenus(),
        getAdminCategories(),
      ]);

      setMenus(menuResponse.data || []);
      setCategories(categoryResponse.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const total = menus.length;
    const outOfStock = menus.filter(
      (menu) => menu.ketersediaan_produk === "tidak_tersedia",
    ).length;
    const activeCategories = new Set(menus.map((menu) => menu.kategori_id)).size;
    const avgPrice =
      menus.reduce((totalPrice, menu) => totalPrice + Number(menu.harga_produk || 0), 0) /
      Math.max(total, 1);

    return { total, outOfStock, activeCategories, avgPrice };
  }, [menus]);

  const openCreateForm = () => {
    setEditingMenu(null);
    setForm({
      ...emptyForm,
      kategori_id: categories[0]?.id ? String(categories[0].id) : "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (menu) => {
    setEditingMenu(menu);
    setForm({
      kategori_id: String(menu.kategori_id || ""),
      nama_produk: menu.nama_produk || "",
      harga_produk: String(Number(menu.harga_produk || 0)),
      deskripsi_produk: menu.deskripsi_produk || "",
      foto_file: null,
      foto_preview: resolveBackendAsset(menu.foto_produk),
      ketersediaan_produk: menu.ketersediaan_produk || "tersedia",
    });
    setIsFormOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setForm((current) => ({
      ...current,
      foto_file: file,
      foto_preview: file ? URL.createObjectURL(file) : current.foto_preview,
    }));
  };

  const buildPayload = () => {
    const payload = new FormData();

    payload.append("kategori_id", form.kategori_id);
    payload.append("nama_produk", form.nama_produk.trim());
    payload.append("harga_produk", String(Number(form.harga_produk || 0)));
    payload.append("deskripsi_produk", form.deskripsi_produk.trim());
    payload.append("ketersediaan_produk", form.ketersediaan_produk);

    if (form.foto_file) {
      payload.append("foto_produk", form.foto_file);
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = buildPayload();
      const response = editingMenu
        ? await updateAdminMenu(editingMenu.id, payload)
        : await createAdminMenu(payload);

      if (editingMenu) {
        setMenus((current) =>
          current.map((menu) => (menu.id === editingMenu.id ? response.data : menu)),
        );
      } else {
        setMenus((current) => [response.data, ...current]);
      }

      setSuccessMessage(response.message || "Menu berhasil disimpan.");
      setIsFormOpen(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (menu) => {
    if (!window.confirm(`Hapus menu "${menu.nama_produk}"?`)) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await deleteAdminMenu(menu.id);
      setMenus((current) => current.filter((item) => item.id !== menu.id));
      setSuccessMessage(response.message || "Menu berhasil dihapus.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Kelola Menu</h1>
          <p className="mt-1 text-sm text-slate-500">
            Menu dari sini tampil di website pengunjung dan QR order.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
        >
          Tambah Menu
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Total Menu</p>
          <p className="mt-2 text-3xl font-black">{stats.total}</p>
        </article>
        <article className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Kategori Aktif</p>
          <p className="mt-2 text-3xl font-black">{stats.activeCategories}</p>
        </article>
        <article className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Out of Stock</p>
          <p className="mt-2 text-3xl font-black text-rose-700">{stats.outOfStock}</p>
        </article>
        <article className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Rata-rata Harga</p>
          <p className="mt-2 text-3xl font-black">{formatRupiah(stats.avgPrice)}</p>
        </article>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-6 py-4 text-left">Menu</th>
                <th className="px-6 py-4 text-left">Kategori</th>
                <th className="px-6 py-4 text-left">Harga</th>
                <th className="px-6 py-4 text-left">Stok</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    Memuat menu...
                  </td>
                </tr>
              ) : menus.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    Belum ada menu.
                  </td>
                </tr>
              ) : (
                menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-xs font-black text-slate-400">
                          {menu.foto_produk ? (
                            <img
                              src={resolveBackendAsset(menu.foto_produk)}
                              alt={menu.nama_produk}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            "IMG"
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-950">{menu.nama_produk}</p>
                          <p className="mt-1 line-clamp-1 max-w-sm text-xs text-slate-500">
                            {menu.deskripsi_produk || "Tanpa deskripsi"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {menu.kategori?.nama_kategori || "-"}
                    </td>
                    <td className="px-6 py-4 font-black">
                      {formatRupiah(menu.harga_produk)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={menu.ketersediaan_produk} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(menu)}
                          className="h-9 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(menu)}
                          className="h-9 rounded-lg bg-rose-50 px-3 text-xs font-bold text-rose-700 hover:bg-rose-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <MenuFormModal
          categories={categories}
          form={form}
          isSaving={isSaving}
          onChange={handleChange}
          onFileChange={handleFileChange}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          title={editingMenu ? "Edit Menu" : "Tambah Menu"}
        />
      )}
    </section>
  );
}


