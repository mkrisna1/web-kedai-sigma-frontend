import { useEffect, useMemo, useState } from "react";
import {
  createAdminTable,
  deleteAdminTable,
  generateAdminTableQr,
  getAdminTables,
  updateAdminTable,
} from "../../../services/api";

const emptyForm = {
  nomor_meja: "",
  status_meja: "active",
};

const getFullQrUrl = (qrCode) => {
  if (!qrCode) {
    return "";
  }

  try {
    return new URL(qrCode, window.location.origin).href;
  } catch {
    return qrCode;
  }
};

function TableFormModal({ form, isSaving, onChange, onClose, onSubmit, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
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

        <form onSubmit={onSubmit} className="flex flex-col gap-5 p-6">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Nomor Meja
            </span>
            <input
              name="nomor_meja"
              value={form.nomor_meja}
              onChange={onChange}
              className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              placeholder="Contoh: Meja 09"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Status
            </span>
            <select
              name="status_meja"
              value={form.status_meja}
              onChange={onChange}
              className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
            >
              <option value="active">Aktif</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </label>

          <div className="flex justify-end gap-3">
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
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MejaAdmin() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingTable, setEditingTable] = useState(null);
  const [qrTarget, setQrTarget] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadTables = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAdminTables();
      setTables(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const stats = useMemo(
    () => ({
      total: tables.length,
      active: tables.filter((table) => table.status_meja === "active").length,
      maintenance: tables.filter((table) => table.status_meja === "maintenance").length,
    }),
    [tables],
  );

  const openCreateForm = () => {
    setEditingTable(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (table) => {
    setEditingTable(table);
    setForm({
      nomor_meja: table.nomor_meja || "",
      status_meja: table.status_meja || "active",
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        nomor_meja: form.nomor_meja.trim(),
        status_meja: form.status_meja,
      };
      const response = editingTable
        ? await updateAdminTable(editingTable.id, payload)
        : await createAdminTable(payload);

      if (editingTable) {
        setTables((current) =>
          current.map((table) => (table.id === editingTable.id ? response.data : table)),
        );
      } else {
        setTables((current) => [...current, response.data]);
      }

      setSuccessMessage(response.message || "Data meja berhasil disimpan.");
      setIsFormOpen(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateQr = async (table) => {
    setUpdatingId(table.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await generateAdminTableQr(table.id);
      setTables((current) =>
        current.map((item) => (item.id === table.id ? response.data : item)),
      );
      setQrTarget(response.data);
      setSuccessMessage(response.message || "QR meja berhasil dibuat.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (table) => {
    if (!window.confirm(`Hapus ${table.nomor_meja}?`)) {
      return;
    }

    setUpdatingId(table.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await deleteAdminTable(table.id);
      setTables((current) => current.filter((item) => item.id !== table.id));
      setSuccessMessage(response.message || "Meja berhasil dihapus.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Kelola Meja & QR</h1>
          <p className="mt-1 text-sm text-slate-500">
            Meja kedai bisa tetap, tetapi tetap bisa ditambah saat layout berubah.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
        >
          Tambah Meja
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Total Meja</p>
          <p className="mt-2 text-3xl font-black">{stats.total}</p>
        </article>
        <article className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Aktif</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">{stats.active}</p>
        </article>
        <article className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Maintenance</p>
          <p className="mt-2 text-3xl font-black text-rose-700">{stats.maintenance}</p>
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

      {isLoading ? (
        <div className="rounded-lg bg-white p-8 text-sm font-semibold text-slate-500">
          Memuat meja...
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tables.map((table) => {
            const isMaintenance = table.status_meja === "maintenance";
            const fullQrUrl = getFullQrUrl(table.qr_code);

            return (
              <article key={table.id} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-lg font-black text-blue-700">
                    {table.nomor_meja?.replace(/\D/g, "") || table.id}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isMaintenance
                        ? "bg-rose-50 text-rose-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {isMaintenance ? "Maintenance" : "Aktif"}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-950">
                  {table.nomor_meja}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  URL QR: {fullQrUrl || "Belum dibuat"}
                </p>

                {fullQrUrl && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(fullQrUrl)}`}
                      alt={`QR ${table.nomor_meja}`}
                      className="mx-auto h-36 w-36"
                    />
                    <a
                      href={fullQrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block truncate text-center text-xs font-bold text-blue-700"
                    >
                      Buka QR Menu
                    </a>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={updatingId === table.id}
                    onClick={() => handleGenerateQr(table)}
                    className="h-9 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    Generate QR
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditForm(table)}
                    className="h-9 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === table.id}
                    onClick={() => handleDelete(table)}
                    className="col-span-2 h-9 rounded-lg bg-rose-50 px-3 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                  >
                    Hapus
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isFormOpen && (
        <TableFormModal
          form={form}
          isSaving={isSaving}
          onChange={handleChange}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          title={editingTable ? "Edit Meja" : "Tambah Meja"}
        />
      )}

      {qrTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
            <h2 className="text-xl font-black text-slate-950">
              QR {qrTarget.nomor_meja}
            </h2>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(getFullQrUrl(qrTarget.qr_code))}`}
              alt={`QR ${qrTarget.nomor_meja}`}
              className="mx-auto mt-5 h-56 w-56"
            />
            <p className="mt-4 break-all text-xs font-semibold text-slate-500">
              {getFullQrUrl(qrTarget.qr_code)}
            </p>
            <button
              type="button"
              onClick={() => setQrTarget(null)}
              className="mt-5 h-11 w-full rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
