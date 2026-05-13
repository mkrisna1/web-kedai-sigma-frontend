import { useEffect, useMemo, useState } from "react";

const QR_GENERATOR_URL = "https://id.qr-code-generator.com/";
const QR_GENERATOR_API_TOKEN = import.meta.env.VITE_QR_CODE_GENERATOR_TOKEN;
const TABLE_STORAGE_KEY = "kedai-sigma-admin-tables";

const defaultTables = [
  { id: "T-01", name: "Meja 01", capacity: 6, used: 0, status: "Aktif" },
  { id: "T-02", name: "Meja 02", capacity: 4, used: 2, status: "Aktif" },
  { id: "T-03", name: "Meja 03", capacity: 6, used: 0, status: "Maintenance" },
  { id: "T-04", name: "Meja 04", capacity: 4, used: 4, status: "Aktif" },
  { id: "T-05", name: "Meja 05", capacity: 4, used: 0, status: "Aktif" },
  { id: "T-06", name: "Meja 06", capacity: 4, used: 1, status: "Aktif" },
  { id: "T-07", name: "Meja 07", capacity: 4, used: 0, status: "Aktif" },
  { id: "T-08", name: "Meja 08", capacity: 4, used: 0, status: "Aktif" },
];

const inputClass =
  "h-10 w-full rounded-lg border border-[#C3C6D7] bg-white px-3 text-sm font-semibold text-[#191C1E] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15";

const parseSeatCount = (value, fallback = 0) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(Math.round(parsed), 0);
};

const normalizeTable = (table, index = 0) => {
  const fallbackNumber = String(index + 1).padStart(2, "0");
  const capacity = Math.max(parseSeatCount(table.capacity, 4), 1);
  const status = table.status === "Maintenance" ? "Maintenance" : "Aktif";
  const used = 
    status === "Maintenance"
      ? 0
      : Math.min(parseSeatCount(table.used, 0), capacity);
  const name = String(table.name || "").trim() || `Meja ${fallbackNumber}`;
  const id = String(table.id || "").trim() || `T-${fallbackNumber}`;

  return { id, name, capacity, used, status };
};

const loadStoredTables = () => {
  if (typeof window === "undefined") {
    return defaultTables;
  }

  try {
    const storedTables = JSON.parse(
      window.localStorage.getItem(TABLE_STORAGE_KEY)
    );

    if (Array.isArray(storedTables) && storedTables.length) {
      return storedTables.map(normalizeTable);
    }
  } catch (error) {
    console.warn("Gagal membaca data meja:", error);
  }

  return defaultTables;
};

const getAvailableSeats = (table) =>
  table.status === "Maintenance"
    ? 0
    : Math.max(table.capacity - table.used, 0);

const getTableState = (table) => {
  if (table.status === "Maintenance") {
    return {
      label: "Maintenance",
      badgeClass: "bg-[#FFDAD6] text-[#BA1A1A]",
      dotClass: "bg-[#BA1A1A]",
      cardClass: "border border-[#FFDAD6] bg-[#F2F4F6]",
      iconClass: "bg-[#FFDAD6]/60 text-[#BA1A1A]",
    };
  }

  if (getAvailableSeats(table) === 0) {
    return {
      label: "Penuh",
      badgeClass: "bg-[#FFE6A7] text-[#765800]",
      dotClass: "bg-[#B88A00]",
      cardClass: "bg-white shadow-sm",
      iconClass: "bg-[#FFF4CE] text-[#8A6A00]",
    };
  }

  if (table.used > 0) {
    return {
      label: "Terpakai",
      badgeClass: "bg-[#DBEAFE] text-[#004AC6]",
      dotClass: "bg-[#004AC6]",
      cardClass: "bg-white shadow-sm",
      iconClass: "bg-[#EFF6FF] text-[#004AC6]",
    };
  }

  return {
    label: "Tersedia",
    badgeClass: "bg-[#6CF8BB] text-[#006C49]",
    dotClass: "bg-[#006C49]",
    cardClass: "bg-white shadow-sm",
    iconClass: "bg-[#E8FFF3] text-[#006C49]",
  };
};

const getNextTableId = (tables) => {
  const highestNumber = tables.reduce((highest, table) => {
    const number = Number(String(table.id).match(/\d+/)?.[0] || 0);
    return Math.max(highest, number);
  }, 0);

  return `T-${String(highestNumber + 1).padStart(2, "0")}`;
};

const getQrMenuUrl = (table) => {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  const url = new URL("/qr/menu", baseUrl);

  url.searchParams.set("table", table.id);
  url.searchParams.set("name", table.name);

  return url.toString();
};

const getQrImageUrl = (table) => {
  const menuUrl = getQrMenuUrl(table);

  if (QR_GENERATOR_API_TOKEN) {
    const apiUrl = new URL("https://api.qr-code-generator.com/v1/create");

    apiUrl.searchParams.set("access-token", QR_GENERATOR_API_TOKEN);
    apiUrl.searchParams.set("frame_name", "no-frame");
    apiUrl.searchParams.set("qr_code_text", menuUrl);
    apiUrl.searchParams.set("image_format", "PNG");
    apiUrl.searchParams.set("image_width", "260");

    return apiUrl.toString();
  }

  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(
    menuUrl
  )}`;
};

function TableIcon({ className = "h-5 w-6" }) {
  return (
    <svg viewBox="0 0 24 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 4.5C4 2.57 5.57 1 7.5 1h9C18.43 1 20 2.57 20 4.5V9H4V4.5Z"
        fill="currentColor"
      />
      <path
        d="M2.75 10.5h18.5c.69 0 1.25.56 1.25 1.25S21.94 13 21.25 13H20v5a1 1 0 1 1-2 0v-5H6v5a1 1 0 1 1-2 0v-5H2.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function QrIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2 2h5v5H2V2Zm2 2v1h1V4H4Zm5-2h5v5H9V2Zm2 2v1h1V4h-1ZM2 9h5v5H2V9Zm2 2v1h1v-1H4Zm6-2h2v2h-2V9Zm-1 3h2v2H9v-2Zm3 0h2v2h-2v-2Zm0-3h2v2h-2V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M6 14V8H0V6H6V0H8V6H14V8H8V14H6Z" fill="currentColor" />
    </svg>
  );
}

function TrashIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 16 18" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 18c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 1 16V3H0V1h5V0h6v1h5v2h-1v13c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H3Zm10-15H3v13h10V3ZM5 14h2V5H5v9Zm4 0h2V5H9v9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M6 14c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 4 12V2c0-.55.2-1.02.59-1.41C4.98.2 5.45 0 6 0h10c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v10c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H6Zm0-2h10V2H6v10Zm-4 6c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 16V4h2v12h12v2H2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M2 18c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 16V2C0 1.45.2.98.59.59 0.98.2 1.45 0 2 0h7v2H2v14h14V9h2v7c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H2ZM6.7 12.7 5.3 11.3 14.6 2H11V0h7v7h-2V3.4l-9.3 9.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StatCard({ stat }) {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-sm ${stat.borderClass || ""}`}>
      <p className="text-xs font-bold uppercase tracking-normal text-[#434655]">
        {stat.label}
      </p>
      <p className={`mt-2 text-4xl font-black leading-10 ${stat.valueClass}`}>
        {stat.value}
      </p>
      <p className="mt-2 text-xs leading-4 text-[#434655]">{stat.description}</p>
    </div>
  );
}

function AddTableModal({ suggestedId, onClose, onSave }) {
  const tableNumber = suggestedId.replace("T-", "");
  const [form, setForm] = useState({
    name: `Meja ${tableNumber}`,
    capacity: 4,
    used: 0,
    status: "Aktif",
  });
  const capacity = Math.max(parseSeatCount(form.capacity, 4), 1);
  const used =
    form.status === "Maintenance"
      ? 0
      : Math.min(parseSeatCount(form.used, 0), capacity);
  const available = form.status === "Maintenance" ? 0 : capacity - used;

  const handleChange = (field, value) => {
    setForm((current) => {
      if (field === "capacity") {
        const nextCapacity = Math.max(parseSeatCount(value, current.capacity), 1);
        return {
          ...current,
          capacity: nextCapacity,
          used: Math.min(parseSeatCount(current.used, 0), nextCapacity),
        };
      }

      if (field === "used") {
        return {
          ...current,
          used: Math.min(parseSeatCount(value, 0), capacity),
        };
      }

      if (field === "status") {
        return {
          ...current,
          status: value,
          used: value === "Maintenance" ? 0 : current.used,
        };
      }

      return { ...current, [field]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      id: suggestedId,
      name: form.name.trim() || `Meja ${tableNumber}`,
      capacity,
      used,
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[520px] animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/25"
      >
        <header className="flex items-center justify-between border-b border-[#E6E8EA] px-6 py-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#191C1E]">Tambah Meja</h2>
            <p className="mt-1 text-xs font-semibold text-[#434655]">
              Unit baru akan memakai ID {suggestedId}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup tambah meja"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#434655] transition hover:bg-[#F2F4F6]"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-xs font-bold uppercase text-[#434655]">
              Nama Meja
            </span>
            <input
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              className={`mt-2 ${inputClass}`}
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase text-[#434655]">
              Kapasitas
            </span>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(event) => handleChange("capacity", event.target.value)}
              className={`mt-2 ${inputClass}`}
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase text-[#434655]">
              Terpakai
            </span>
            <input
              type="number"
              min="0"
              max={capacity}
              value={used}
              disabled={form.status === "Maintenance"}
              onChange={(event) => handleChange("used", event.target.value)}
              className={`mt-2 ${inputClass} disabled:bg-[#F2F4F6] disabled:text-[#434655]`}
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase text-[#434655]">
              Status Operasional
            </span>
            <select
              value={form.status}
              onChange={(event) => handleChange("status", event.target.value)}
              className={`mt-2 ${inputClass}`}
            >
              <option value="Aktif">Aktif</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </label>

          <div className="rounded-lg bg-[#F2F4F6] p-4">
            <p className="text-xs font-bold uppercase text-[#434655]">Tersedia</p>
            <p className="mt-1 text-3xl font-black text-[#006C49]">
              {available}
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 bg-[#F2F4F6] px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg px-6 text-sm font-bold text-[#434655] transition hover:bg-white"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex h-11 items-center gap-2 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-6 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:brightness-105"
          >
            <PlusIcon />
            Simpan Meja
          </button>
        </footer>
      </form>
    </div>
  );
}

function DeleteConfirmModal({ table, onCancel, onConfirm }) {
  if (!table) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <section className="w-full max-w-sm animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] rounded-2xl bg-white p-8 shadow-2xl shadow-black/25">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BA1A1A]/10 text-[#BA1A1A]">
          <TrashIcon className="h-5 w-5" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-[#191C1E]">
          Hapus {table.name}?
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#434655]">
          Meja ini akan hilang dari daftar admin dan QR yang terkait tidak akan
          dikelola lagi di halaman ini.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-lg bg-[#E6E8EA] text-sm font-bold text-[#191C1E] transition hover:brightness-95"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#BA1A1A] text-sm font-bold text-white transition hover:brightness-105"
          >
            <TrashIcon />
            Hapus
          </button>
        </div>
      </section>
    </div>
  );
}

function QrPreviewModal({ table, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!table) {
    return null;
  }

  const menuUrl = getQrMenuUrl(table);
  const qrImageUrl = getQrImageUrl(table);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.warn("Gagal menyalin link QR:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <section className="w-full max-w-[560px] animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/25">
        <header className="flex items-center justify-between border-b border-[#E6E8EA] px-6 py-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#191C1E]">
              QR {table.name}
            </h2>
            <p className="mt-1 text-xs font-semibold text-[#434655]">
              Scan QR akan membuka menu dengan ID {table.id}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup QR meja"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#434655] transition hover:bg-[#F2F4F6]"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="grid gap-6 p-6 sm:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center rounded-xl border border-[#E6E8EA] bg-[#F7F9FB] p-4">
            <img
              src={qrImageUrl}
              alt={`QR untuk ${table.name}`}
              className="h-[190px] w-[190px] rounded-lg bg-white object-contain p-2"
            />
            <span className="mt-3 rounded-full bg-[#EFF6FF] px-3 py-1 text-[10px] font-bold uppercase text-[#004AC6]">
              {table.id}
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#434655]">
                Link Menu
              </p>
              <p className="mt-2 break-all rounded-lg bg-[#F2F4F6] p-3 text-xs font-semibold leading-5 text-[#191C1E]">
                {menuUrl}
              </p>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E6E8EA] text-sm font-bold text-[#191C1E] transition hover:brightness-95"
              >
                <CopyIcon />
                {copied ? "Link Disalin" : "Salin Link"}
              </button>
              <a
                href={qrImageUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:brightness-105"
              >
                <QrIcon />
                Buka PNG QR
              </a>
              <a
                href={QR_GENERATOR_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#C3C6D7] text-sm font-bold text-[#004AC6] transition hover:bg-[#EFF6FF]"
              >
                <ExternalIcon />
                Buka QR Code Generator
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TableCard({ table, onDelete, onGenerateQr, onUpdate }) {
  const available = getAvailableSeats(table);
  const tableState = getTableState(table);
  const isMaintenance = table.status === "Maintenance";

  const handleCapacityChange = (event) => {
    const capacity = Math.max(parseSeatCount(event.target.value, table.capacity), 1);
    onUpdate(table.id, {
      capacity,
      used: Math.min(table.used, capacity),
    });
  };

  const handleUsedChange = (event) => {
    onUpdate(table.id, {
      used: Math.min(parseSeatCount(event.target.value, table.used), table.capacity),
    });
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    onUpdate(table.id, {
      status,
      used: status === "Maintenance" ? 0 : Math.min(table.used, table.capacity),
    });
  };

  return (
    <article className={`rounded-lg p-5 ${tableState.cardClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${tableState.iconClass}`}
        >
          <TableIcon />
        </div>

        <div className="flex flex-col items-end">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold leading-[15px] ${tableState.badgeClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tableState.dotClass}`} />
            {tableState.label}
          </span>
          <span className="mt-1 text-[10px] uppercase leading-[15px] tracking-normal text-[#434655]">
            Unit ID: {table.id}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h3
          className={`text-lg font-bold leading-7 text-[#191C1E] ${
            isMaintenance ? "opacity-50" : ""
          }`}
        >
          {table.name}
        </h3>
        <p className="text-sm leading-5 text-[#434655]">
          Kapasitas: {table.capacity} Orang
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#F2F4F6] p-3">
          <p className="text-[10px] font-bold uppercase text-[#434655]">
            Tersedia
          </p>
          <p className="mt-1 text-2xl font-black text-[#006C49]">{available}</p>
        </div>
        <div className="rounded-lg bg-[#F2F4F6] p-3">
          <p className="text-[10px] font-bold uppercase text-[#434655]">
            Terpakai
          </p>
          <p className="mt-1 text-2xl font-black text-[#004AC6]">{table.used}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <label>
          <span className="text-[10px] font-bold uppercase text-[#434655]">
            Ubah Kapasitas
          </span>
          <input
            type="number"
            min="1"
            value={table.capacity}
            onChange={handleCapacityChange}
            className={`mt-1 ${inputClass}`}
          />
        </label>

        <label>
          <span className="text-[10px] font-bold uppercase text-[#434655]">
            Kursi Terpakai
          </span>
          <input
            type="number"
            min="0"
            max={table.capacity}
            value={table.used}
            disabled={isMaintenance}
            onChange={handleUsedChange}
            className={`mt-1 ${inputClass} disabled:bg-[#F2F4F6] disabled:text-[#434655]`}
          />
        </label>

        <label>
          <span className="text-[10px] font-bold uppercase text-[#434655]">
            Operasional
          </span>
          <select
            value={table.status}
            onChange={handleStatusChange}
            className={`mt-1 ${inputClass}`}
          >
            <option value="Aktif">Aktif</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
        <button
          type="button"
          disabled={isMaintenance}
          onClick={() => onGenerateQr(table)}
          className={`flex h-10 items-center justify-center gap-2 rounded-lg text-xs font-bold leading-4 transition ${
            isMaintenance
              ? "cursor-not-allowed bg-[#E6E8EA] text-[#434655]"
              : "bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white hover:brightness-105"
          }`}
        >
          <QrIcon />
          Generate QR
        </button>
        <button
          type="button"
          onClick={() => onDelete(table)}
          aria-label={`Hapus ${table.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#BA1A1A] transition hover:bg-red-50"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}

export default function MejaAdmin() {
  const [tables, setTables] = useState(loadStoredTables);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [qrTarget, setQrTarget] = useState(null);
  const suggestedTableId = useMemo(() => getNextTableId(tables), [tables]);

  useEffect(() => {
    window.localStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(tables));
  }, [tables]);

  const stats = useMemo(() => {
    const activeTables = tables.filter((table) => table.status !== "Maintenance");
    const totalCapacity = activeTables.reduce(
      (total, table) => total + table.capacity,
      0
    );
    const usedSeats = activeTables.reduce((total, table) => total + table.used, 0);
    const availableSeats = activeTables.reduce(
      (total, table) => total + getAvailableSeats(table),
      0
    );
    const maintenanceTables = tables.length - activeTables.length;

    return [
      {
        label: "Total Meja",
        value: tables.length,
        description: `${activeTables.length} aktif, ${maintenanceTables} maintenance`,
        valueClass: "text-[#004AC6]",
      },
      {
        label: "Kapasitas Aktif",
        value: totalCapacity,
        description: "Total kursi siap dipakai",
        valueClass: "text-[#191C1E]",
      },
      {
        label: "Tersedia",
        value: availableSeats,
        description: "Kursi kosong saat ini",
        valueClass: "text-[#006C49]",
        borderClass: "border-l-4 border-[#006C49]",
      },
      {
        label: "Terpakai",
        value: usedSeats,
        description: "Kursi sedang digunakan",
        valueClass: "text-[#BA1A1A]",
        borderClass: "border-l-4 border-[#BA1A1A]",
      },
    ];
  }, [tables]);

  const handleAddTable = (newTable) => {
    setTables((currentTables) => [
      normalizeTable(newTable, currentTables.length),
      ...currentTables,
    ]);
    setIsAddModalOpen(false);
  };

  const handleUpdateTable = (tableId, updates) => {
    setTables((currentTables) =>
      currentTables.map((table, index) =>
        table.id === tableId ? normalizeTable({ ...table, ...updates }, index) : table
      )
    );
  };

  const handleConfirmDelete = () => {
    setTables((currentTables) =>
      currentTables.filter((table) => table.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  return (
    <main className="min-h-screen bg-[#F7F9FB] p-6 font-['Inter',Arial,sans-serif] text-[#191C1E] sm:p-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-9 tracking-normal text-[#191C1E]">
              Kelola Meja & QR
            </h1>
            <p className="mt-2 text-sm font-medium leading-5 text-[#434655]">
              Atur status meja, kapasitas, kursi terpakai, dan kode QR pelanggan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-6 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:brightness-105"
          >
            <PlusIcon />
            Tambah Meja
          </button>
        </header>

        <section
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Statistik meja"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h2 className="whitespace-nowrap text-xl font-bold leading-7 text-[#191C1E]">
              Sektor A
            </h2>
            <div className="h-px flex-1 bg-[#E6E8EA]" />
          </div>

          {tables.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onDelete={setDeleteTarget}
                  onGenerateQr={setQrTarget}
                  onUpdate={handleUpdateTable}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#C3C6D7] bg-white p-10 text-center">
              <p className="text-lg font-bold text-[#191C1E]">
                Belum ada meja.
              </p>
              <p className="mt-2 text-sm text-[#434655]">
                Tambahkan meja pertama untuk mulai membuat QR.
              </p>
            </div>
          )}
        </section>
      </section>

      {isAddModalOpen && (
        <AddTableModal
          suggestedId={suggestedTableId}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddTable}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          table={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {qrTarget && (
        <QrPreviewModal table={qrTarget} onClose={() => setQrTarget(null)} />
      )}
    </main>
  );
}
