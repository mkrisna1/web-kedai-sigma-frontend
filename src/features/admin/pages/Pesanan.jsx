import { useEffect, useMemo, useState } from "react";
import {
  getAdminMenu,
  getAdminOrderReceipt,
  getAdminOrders,
  resolveAdminOrderStockIssue,
  updateAdminOrderStatus,
} from "../../../services/api";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatRupiah = (value) => `Rp ${value.toLocaleString("id-ID")}`;

const STOCK_OUT_NOTE = "Stok habis";

const isStockOutItem = (item) => item.note === STOCK_OUT_NOTE;

const getOrderTotal = (items) =>
  items.reduce(
    (total, item) => total + (isStockOutItem(item) ? 0 : item.price),
    0,
  );

const statusConfig = {
  pending: {
    badge: { bg: "bg-[#DBE1FF]", text: "text-[#00174B]", label: "Menunggu" },
    headerBg: "bg-[rgba(239,246,255,0.30)]",
    tableBorder: "border-[rgba(0,74,198,0.20)]",
    tableText: "text-[#004AC6]",
    tableBg: "bg-white",
    totalColor: "text-[#004AC6]",
  },
  processing: {
    badge: { bg: "bg-[#FFDDB8]", text: "text-[#653E00]", label: "Diproses" },
    headerBg: "bg-[rgba(255,251,235,0.30)]",
    tableBorder: "border-[#FDE68A]",
    tableText: "text-[#D97706]",
    tableBg: "bg-white",
    totalColor: "text-[#D97706]",
  },
  completed: {
    badge: { bg: "bg-[#6CF8BB]", text: "text-[#00714D]", label: "Selesai" },
    headerBg: "bg-[rgba(108,248,187,0.10)]",
    tableBorder: "border-[rgba(0,108,73,0.20)]",
    tableText: "text-[#006C49]",
    tableBg: "bg-white",
    totalColor: "text-[#006C49]",
  },
  cancelled: {
    badge: { bg: "bg-[#FFDAD6]", text: "text-[#93000A]", label: "Dibatalkan" },
    headerBg: "bg-[rgba(255,218,214,0.20)]",
    tableBorder: "border-[rgba(186,26,26,0.20)]",
    tableText: "text-[#BA1A1A]",
    tableBg: "bg-white",
    totalColor: "text-[#BA1A1A]",
  },
};

const apiStatusByUiStatus = {
  pending: "menunggu_konfirmasi",
  processing: "diproses",
  completed: "selesai",
  cancelled: "dibatalkan",
};

const uiStatusByApiStatus = {
  menunggu_konfirmasi: "pending",
  diproses: "processing",
  selesai: "completed",
  dibatalkan: "cancelled",
};

const formatOrderId = (id) => `#ORD-${String(id || 0).padStart(3, "0")}`;

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });

const formatTimeLabel = (value) => {
  if (!value) {
    return "Baru masuk";
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
const INDONESIA_TIME_ZONE = "Asia/Jakarta";

const getIndonesiaToday = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INDONESIA_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const getPart = (type) => Number(parts.find((part) => part.type === type)?.value);

  return new Date(getPart("year"), getPart("month") - 1, getPart("day"));
};

const formatDateValue = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const parseDateValue = (value) => {
  if (!value) {
    return getIndonesiaToday();
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return getIndonesiaToday();
  }

  return new Date(year, month - 1, day);
};

const formatCalendarLabel = (value) => {
  const date = parseDateValue(value);

  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const getDateValueFromApi = (value) => {
  const date = value ? new Date(value) : getIndonesiaToday();

  if (Number.isNaN(date.getTime())) {
    return formatDateValue(getIndonesiaToday());
  }

  return formatDateValue(date);
};

const getTableNumber = (value) =>
  String(value || "-")
    .replace(/^meja\s*/i, "")
    .trim() || "-";

const mapOrderFromApi = (order) => ({
  rawId: order.id,
  tableNumber: getTableNumber(order.meja?.nomor_meja),
  orderId: formatOrderId(order.id),
  timeLabel: formatTimeLabel(order.tgl_pesanan || order.created_at),
  dateValue: getDateValueFromApi(order.tgl_pesanan || order.created_at),
  status: uiStatusByApiStatus[order.status_pesanan] || "pending",
  paymentStatus: order.status_pembayaran,
  paymentMethod: order.metode_pembayaran || "cash",
  gatewayStatus: order.payment_status,
  items: (order.detail_pesanans || []).map((detail) => {
    const quantity = Number(detail.jumlah_item) || 1;
    const productName = detail.produk?.nama_produk || "Menu";

    return {
      rawId: detail.id,
      productId: detail.produk?.id,
      name: quantity > 1 ? `${quantity}x ${productName}` : productName,
      productName,
      quantity,
      price: Number(detail.subtotal) || 0,
      note: detail.opsi_varian || "",
    };
  }),
});

const mapReplacementMenuFromApi = (item) => ({
  productId: item.id,
  name: item.nama_produk || "Menu",
  price: Number(item.harga_produk) || 0,
});

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1-8.414 3.293 3.293-1.414 1.414L11 12.414V6h2v5.586Z" fill="currentColor" />
  </svg>
);

const ProcessingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 1 0-2.343 5.657l1.414 1.414A10 10 0 1 1 12 2Zm1 5v6h5v-2h-3V7h-2Z" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm-1.05-6.464 6.364-6.364-1.414-1.414-4.95 4.95-2.121-2.122-1.414 1.414 3.535 3.536Z" fill="currentColor" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm3.536-14.95L12 10.586 8.464 7.05 7.05 8.464 10.586 12 7.05 15.536l1.414 1.414L12 13.414l3.536 3.536 1.414-1.414L13.414 12l3.536-3.536-1.414-1.414Z" fill="currentColor" />
  </svg>
);

const CancelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M18.3 5.71 16.89 4.3 12 9.17 7.11 4.3 5.7 5.71 10.59 10.6 5.7 15.49 7.11 16.9 12 12.01 16.89 16.9 18.3 15.49 13.41 10.6 18.3 5.71Z" fill="currentColor" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
    <path d="M4.05417 7.90417L7.35 4.60833L6.51875 3.77708L4.05417 6.24167L2.82917 5.01667L1.99792 5.84792L4.05417 7.90417ZM4.66667 11.6667C3.31528 11.3264 2.19965 10.551 1.31979 9.34062C0.439931 8.13021 0 6.78611 0 5.30833V1.75L4.66667 0L9.33333 1.75V5.30833C9.33333 6.78611 8.8934 8.13021 8.01354 9.34062C7.13368 10.551 6.01806 11.3264 4.66667 11.6667ZM4.66667 10.4417C5.67778 10.1208 6.51389 9.47917 7.175 8.51667C7.83611 7.55417 8.16667 6.48472 8.16667 5.30833V2.55208L4.66667 1.23958L1.16667 2.55208V5.30833C1.16667 6.48472 1.49722 7.55417 2.15833 8.51667C2.81944 9.47917 3.65556 10.1208 4.66667 10.4417Z" fill="#006C49" />
  </svg>
);

function StatCard({
  label,
  value,
  icon,
  accentColor,
  valueColor,
  activeColor = "ring-[#004AC6]",
  activeBg = "bg-[#EFF6FF]",
  active = false,
  onClick,
}) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex flex-col gap-1 rounded-lg p-5 shadow-sm border-b-4 text-left transition",
        active ? activeBg : "bg-white",
        onClick && "hover:-translate-y-0.5 hover:shadow-md",
        active && `ring-2 ${activeColor} ring-offset-2 ring-offset-[#F6F7FB]`,
        accentColor,
      )}
    >
      <div className="flex justify-between items-start">{icon}</div>
      <p className="text-[#434655] text-xs font-bold leading-4 tracking-[0.6px] uppercase mt-3">{label}</p>
      <p className={cn("text-2xl font-black leading-8", valueColor)}>{value}</p>
    </Component>
  );
}

function OrderCard({
  tableNumber,
  orderId,
  timeLabel,
  status,
  paymentStatus,
  paymentMethod,
  gatewayStatus,
  items,
  onAccept,
  onCancel,
  onMarkReady,
  onPrint,
}) {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";
  const isDimmed = isCompleted || isCancelled;
  const total = formatRupiah(getOrderTotal(items));
  const isOnlinePayment = ["qris", "gopay"].includes(paymentMethod);
  const isPaymentPending = isOnlinePayment && paymentStatus !== "lunas";
  const paymentLabel = isOnlinePayment
    ? paymentStatus === "lunas"
      ? "QRIS Lunas"
      : gatewayStatus
        ? `QRIS ${gatewayStatus}`
        : "QRIS Pending"
    : "Tunai";

  return (
    <div className={cn("flex flex-col rounded-lg bg-white shadow-sm overflow-hidden", isCompleted && "border border-[rgba(0,108,73,0.10)]")}>
      <div className={cn("flex items-center justify-between px-5 py-4 border-b border-[rgba(195,198,215,0.15)]", cfg.headerBg)}>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center justify-center w-10 h-10 rounded border font-bold text-base", cfg.tableBorder, cfg.tableText, cfg.tableBg)}>
            {tableNumber}
          </div>

          <div className="flex flex-col">
            <span className="text-[#191C1E] text-sm font-bold leading-5">{orderId}</span>
            <span className="text-[#434655] text-[10px] font-medium leading-[15px]">{timeLabel}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={cn("px-2 py-1 rounded-sm text-[10px] font-bold leading-[15px] tracking-[0.5px] uppercase", cfg.badge.bg, cfg.badge.text)}>
            {cfg.badge.label}
          </span>
          <span className={cn(
            "rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.5px]",
            isPaymentPending ? "bg-[#FFF2CC] text-[#784B00]" : "bg-[#DFF7E8] text-[#006C49]",
          )}>
            {paymentLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 flex-1">
        <div className="flex flex-col gap-3">
          {items.map((item, idx) => {
            const isStockOut = isStockOutItem(item);

            return (
              <div
                key={`${item.name}-${idx}`}
                className={cn(
                  "flex justify-between items-start",
                  (isDimmed || isStockOut) && "opacity-60",
                )}
              >
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-[#434655] text-sm leading-5",
                      (isDimmed || isStockOut) && "line-through",
                    )}
                  >
                    {item.name}
                  </span>
                  {item.note && (
                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#BA1A1A]">
                      {item.note}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[#191C1E] text-sm font-semibold leading-5 flex-shrink-0 ml-2",
                    isStockOut && "line-through",
                  )}
                >
                  {formatRupiah(item.price)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[rgba(195,198,215,0.15)] mt-auto">
          <span className="text-[#434655] text-xs font-bold leading-4 uppercase tracking-wide">Total Harga</span>

          <div className="flex items-center gap-2">
            {isCompleted && <ShieldIcon />}
            <span className={cn("text-lg font-black leading-7", cfg.totalColor)}>{total}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 bg-[#F2F4F6] flex gap-2">
        {status === "pending" && (
          <>
            <button
              type="button"
              onClick={onAccept}
              disabled={isPaymentPending}
              className="flex-1 py-3 rounded bg-[#004AC6] text-white text-xs font-bold tracking-wide shadow-md transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
            >
              {isPaymentPending ? "Menunggu Pembayaran" : "Terima Pesanan"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center w-10 h-10 rounded border border-[rgba(195,198,215,0.20)] bg-white text-[#BA1A1A] hover:bg-red-50 transition-colors flex-shrink-0"
              aria-label="Tandai stok habis"
            >
              <CancelIcon />
            </button>
          </>
        )}

        {status === "processing" && (
          <>
            <button
              type="button"
              onClick={onMarkReady}
              className="flex-1 py-3 rounded bg-[#F59E0B] text-white text-xs font-bold tracking-wide shadow-md hover:bg-amber-500 transition-colors"
            >
              Siap / Sudah Bayar
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center w-10 h-10 rounded border border-[rgba(195,198,215,0.20)] bg-white hover:bg-red-50 hover:text-[#BA1A1A] transition-colors flex-shrink-0"
              aria-label="Tandai stok habis"
            >
              <CancelIcon />
            </button>
          </>
        )}

        {(isCompleted || isCancelled) && (
          <button
            type="button"
            onClick={onPrint}
            className="flex-1 py-2 rounded border border-[rgba(195,198,215,0.20)] bg-white text-[#434655] text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cetak Struk
          </button>
        )}
      </div>
    </div>
  );
}

function StockIssuePopup({ order, replacementOptions, onClose, onResolve }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [resolution, setResolution] = useState("replace");
  const [replacementName, setReplacementName] = useState(
    replacementOptions[0]?.name ?? ""
  );

  if (!order) {
    return null;
  }

  const selectedItem = order.items[selectedIndex];
  const selectedReplacement = replacementOptions.find(
    (option) => option.name === replacementName
  );
  const canResolve = resolution === "remove" || Boolean(selectedReplacement?.productId);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canResolve) {
      return;
    }

    onResolve({
      itemIndex: selectedIndex,
      resolution,
      replacement: selectedReplacement,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-issue-title"
    >
      <div className="w-full max-w-[560px] animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="px-7 pb-5 pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="stock-issue-title"
                className="text-2xl font-black leading-8 text-[#191C1E]"
              >
                Stok menu habis
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#434655]">
                Pilih item dari pesanan {order.orderId}, lalu ganti dengan menu lain atau hapus dari pesanan.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFDAD6] text-[#BA1A1A]">
              <XIcon />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <fieldset className="flex flex-col gap-3">
              <legend className="text-xs font-bold uppercase leading-4 tracking-[0.6px] text-[#434655]">
                Item yang stoknya habis
              </legend>

              <div className="grid gap-2">
                {order.items.map((item, index) => (
                  <label
                    key={`${item.name}-${index}`}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 transition",
                      selectedIndex === index
                        ? "border-[#BA1A1A] bg-[#FFF4F2]"
                        : "border-[rgba(195,198,215,0.45)] bg-white hover:bg-slate-50"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <input
                        type="radio"
                        name="outOfStockItem"
                        checked={selectedIndex === index}
                        onChange={() => setSelectedIndex(index)}
                        className="h-4 w-4 accent-[#BA1A1A]"
                      />
                      <span className="truncate text-sm font-bold leading-5 text-[#191C1E]">
                        {item.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-[#434655]">
                      {formatRupiah(item.price)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResolution("replace")}
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-bold transition",
                  resolution === "replace"
                    ? "border-[#004AC6] bg-[#DBE1FF] text-[#00174B]"
                    : "border-[rgba(195,198,215,0.60)] bg-white text-[#434655] hover:bg-slate-50"
                )}
              >
                Ganti menu
              </button>
              <button
                type="button"
                onClick={() => setResolution("remove")}
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-bold transition",
                  resolution === "remove"
                    ? "border-[#BA1A1A] bg-[#FFDAD6] text-[#93000A]"
                    : "border-[rgba(195,198,215,0.60)] bg-white text-[#434655] hover:bg-slate-50"
                )}
              >
                Hapus item
              </button>
            </div>

            {resolution === "replace" && (
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase leading-4 tracking-[0.6px] text-[#434655]">
                  Menu pengganti
                </span>
                <select
                  value={replacementName}
                  onChange={(event) => setReplacementName(event.target.value)}
                  className="h-11 rounded-lg border border-[rgba(195,198,215,0.70)] bg-white px-3 text-sm font-semibold text-[#191C1E] outline-none transition focus:border-[#004AC6]"
                >
                  {replacementOptions.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.name} - {formatRupiah(option.price)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="rounded-lg bg-[#F2F4F6] px-4 py-3 text-xs font-semibold leading-5 text-[#434655]">
              {resolution === "replace"
                ? `${selectedItem?.name ?? "Item"} akan ditandai stok habis dan diganti dengan ${selectedReplacement?.name ?? "menu pengganti"}.`
                : `${selectedItem?.name ?? "Item"} akan ditandai stok habis dan tidak dihitung di total pesanan.`}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[rgba(195,198,215,0.60)] bg-white px-4 py-3 text-sm font-bold text-[#434655] transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!canResolve}
                className="rounded-lg bg-[#BA1A1A] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CalendarPopup({ value, onClose, onSelect }) {
  const initialDate = parseDateValue(value);
  const [viewDate, setViewDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const [draftDate, setDraftDate] = useState(value || formatDateValue(initialDate));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayValue = formatDateValue(getIndonesiaToday());
  const calendarDays = [
    ...Array.from({ length: firstDay }, (_, index) => ({
      key: `blank-${index}`,
      day: "",
      value: "",
    })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const dateValue = formatDateValue(new Date(year, month, day));

      return {
        key: dateValue,
        day,
        value: dateValue,
      };
    }),
  ];

  const changeMonth = (offset) => {
    setViewDate(
      (currentDate) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/20 p-6">
      <div className="flex h-[495px] w-full max-w-96 animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden rounded-lg bg-white shadow-[0_10px_30px_rgba(25,28,30,0.12)]">
        <div className="flex h-[427px] w-full flex-col gap-8 p-6">
          <div className="flex h-7 w-full items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-xl text-[#434655] transition hover:bg-[#F2F4F6]"
              aria-label="Bulan sebelumnya"
            >
              {"<"}
            </button>

            <h2 className="flex h-7 items-center text-lg font-bold leading-7 text-[#191C1E]">
              {monthNames[month]} {year}
            </h2>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="flex h-7 w-7 items-center justify-center rounded-xl text-[#434655] transition hover:bg-[#F2F4F6]"
              aria-label="Bulan berikutnya"
            >
              {">"}
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-2">
            {dayNames.map((dayName) => (
              <div
                key={dayName}
                className="flex h-[31px] items-start justify-center pb-4 text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[#434655]"
              >
                {dayName}
              </div>
            ))}

            {calendarDays.map((dateItem) => {
              const isSelected = dateItem.value === draftDate;
              const isToday = dateItem.value === todayValue;

              return (
                <button
                  key={dateItem.key}
                  type="button"
                  disabled={!dateItem.value}
                  onClick={() => setDraftDate(dateItem.value)}
                  className="relative flex h-10 items-center justify-center text-sm font-medium leading-5 text-[#191C1E] disabled:pointer-events-none"
                >
                  {isToday && !isSelected && (
                    <span className="absolute inset-1 rounded-xl border border-[#2563EB]/20" />
                  )}
                  {isSelected && (
                    <span className="absolute inset-1 rounded-xl bg-gradient-to-br from-[#004AC6] to-[#2563EB] shadow-sm" />
                  )}
                  <span className={`relative z-10 ${isSelected ? "font-bold text-white" : ""}`}>
                    {dateItem.day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex h-[68px] w-full items-center justify-end gap-3 bg-[#F2F4F6] p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 items-center justify-center px-5 text-sm font-semibold leading-5 text-[#434655] transition hover:text-[#191C1E]"
          >
            Keluar
          </button>
          <button
            type="button"
            onClick={() => onSelect(draftDate)}
            className="flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#004AC6] to-[#2563EB] px-6 text-sm font-bold leading-5 text-white shadow-sm transition hover:brightness-105"
          >
            Pilih
          </button>
        </div>
      </div>
    </div>
  );
}

const fallbackReplacementMenuOptions = [
  { name: "Kentang", price: 10000 },
  { name: "Risol Mayo", price: 13000 },
  { name: "Sosis Solo", price: 13000 },
  { name: "Tahu Bakso Goreng", price: 13000 },
  { name: "Piscok", price: 13000 },
  { name: "Nugget", price: 13000 },
  { name: "Siomay Ayam", price: 15000 },
  { name: "Ayam Popcorn", price: 15000 },
  { name: "Coffee Milk", price: 13000 },
  { name: "Coffee Latte Ice", price: 13000 },
  { name: "Americano Hot", price: 10000 },
  { name: "V6 Drip Susu Hot", price: 13000 },
  { name: "Coffee Bear Ice", price: 16000 },
  { name: "Lemon Tea Ice", price: 10000 },
  { name: "Lychee Tea Ice", price: 10000 },
  { name: "Matcha Ice", price: 13000 },
  { name: "Coklat Classic Roti", price: 15000 },
];
export default function Pesanan() {
  const [orders, setOrders] = useState([]);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDateValue(getIndonesiaToday()));
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [replacementMenuOptions, setReplacementMenuOptions] = useState(
    fallbackReplacementMenuOptions,
  );

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([getAdminOrders(), getAdminMenu()])
      .then(([ordersResult, menuResult]) => {
        if (!isMounted) {
          return;
        }

        if (ordersResult.status === "fulfilled") {
          setOrders((ordersResult.value.data || []).map(mapOrderFromApi));
        } else {
          setOrders([]);
        }

        if (menuResult.status === "fulfilled") {
          const availableMenu = (menuResult.value.data || [])
            .filter((item) => item.ketersediaan_produk === "tersedia")
            .map(mapReplacementMenuFromApi);

          if (availableMenu.length) {
            setReplacementMenuOptions(availableMenu);
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const dateOrders = useMemo(
    () => orders.filter((order) => order.dateValue === selectedDate),
    [orders, selectedDate],
  );
  const visibleOrders = useMemo(
    () =>
      activeStatusFilter === "all"
        ? dateOrders
        : dateOrders.filter((order) => order.status === activeStatusFilter),
    [activeStatusFilter, dateOrders],
  );
  const statusCounts = useMemo(
    () =>
      dateOrders.reduce(
        (counts, order) => ({
          ...counts,
          [order.status]: counts[order.status] + 1,
        }),
        { pending: 0, processing: 0, completed: 0, cancelled: 0 },
      ),
    [dateOrders],
  );

  const updateOrderStatus = async (order, nextStatus) => {
    if (!order.rawId) {
      return;
    }

    const previousOrders = orders;

    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.orderId === order.orderId
          ? { ...currentOrder, status: nextStatus }
          : currentOrder,
      ),
    );

    try {
      const response = await updateAdminOrderStatus(
        order.rawId,
        apiStatusByUiStatus[nextStatus],
      );

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.rawId === order.rawId
            ? mapOrderFromApi(response.data)
            : currentOrder,
        ),
      );
    } catch (error) {
      console.error("Gagal memperbarui status pesanan:", error);
      setOrders(previousOrders);
    }
  };

  const resolveStockIssue = async ({ itemIndex, resolution, replacement }) => {
    if (!orderToCancel) {
      return;
    }

    const selectedItem = orderToCancel.items[itemIndex];

    if (!orderToCancel.rawId || !selectedItem?.rawId) {
      setOrderToCancel(null);
      return;
    }

    try {
      const response = await resolveAdminOrderStockIssue(orderToCancel.rawId, {
        detail_id: selectedItem.rawId,
        action: resolution === "replace" ? "replace" : "remove",
        ...(resolution === "replace" && replacement?.productId
          ? { replacement_produk_id: replacement.productId }
          : {}),
      });
      const updatedOrder = mapOrderFromApi(response.data);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.rawId === updatedOrder.rawId ? updatedOrder : order,
        ),
      );
      setOrderToCancel(null);
    } catch (error) {
      console.error("Gagal menyimpan perubahan stok pesanan:", error);
    }
  };

  const printOrderReceipt = async (order) => {
    let printableOrder = order;

    if (order.rawId) {
      try {
        const response = await getAdminOrderReceipt(order.rawId);
        printableOrder = mapOrderFromApi(response.data);
      } catch (error) {
        console.error("Gagal mengambil receipt:", error);
      }
    }

    const rows = printableOrder.items
      .map((item) => {
        const itemPrice = isStockOutItem(item) ? 0 : item.price;
        const itemNote = item.note ? ` (${item.note})` : "";

        return `
          <tr>
            <td>${escapeHtml(item.name)}${escapeHtml(itemNote)}</td>
            <td class="price">${escapeHtml(formatRupiah(itemPrice))}</td>
          </tr>
        `;
      })
      .join("");
    const printWindow = window.open("", "_blank", "width=420,height=640");

    if (!printWindow) {
      window.alert("Pop up print diblokir browser. Izinkan pop up lalu coba lagi.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <title>Struk ${escapeHtml(printableOrder.orderId)}</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; background: #f2f4f6; color: #191c1e; font-family: Arial, sans-serif; }
            .receipt { width: 320px; margin: 24px auto; background: #fff; padding: 24px; border-radius: 14px; box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12); }
            h1 { margin: 0; font-size: 22px; letter-spacing: 1px; text-transform: uppercase; }
            .meta { margin-top: 10px; color: #434655; font-size: 12px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 12px; }
            td { border-bottom: 1px dashed #c3c6d7; padding: 10px 0; vertical-align: top; }
            .price { text-align: right; white-space: nowrap; font-weight: 700; }
            .total { display: flex; justify-content: space-between; margin-top: 18px; padding-top: 16px; border-top: 2px solid #191c1e; font-size: 15px; font-weight: 800; }
            .thanks { margin-top: 20px; text-align: center; color: #ba1a1a; font-size: 11px; font-weight: 800; text-transform: uppercase; }
            @media print { body { background: #fff; } .receipt { margin: 0; box-shadow: none; border-radius: 0; width: 100%; } }
          </style>
        </head>
        <body>
          <main class="receipt">
            <h1>Kedai Sigma</h1>
            <div class="meta">
              <div>${escapeHtml(printableOrder.orderId)}</div>
              <div>Meja ${escapeHtml(printableOrder.tableNumber)}</div>
              <div>${escapeHtml(formatCalendarLabel(printableOrder.dateValue))} - ${escapeHtml(printableOrder.timeLabel)}</div>
            </div>
            <table><tbody>${rows}</tbody></table>
            <div class="total">
              <span>Total</span>
              <span>${escapeHtml(formatRupiah(getOrderTotal(printableOrder.items)))}</span>
            </div>
            <p class="thanks">Terima kasih</p>
          </main>
          <script>
            window.addEventListener("load", () => {
              window.print();
              window.setTimeout(() => window.close(), 300);
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <main className="bg-[#F6F7FB] font-['Inter',sans-serif]">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold leading-8 text-[#191C1E]">
            Kelola Pesanan
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#434655]">
            Pesanan tanggal {formatCalendarLabel(selectedDate)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCalendarOpen(true)}
          className="h-10 rounded-lg bg-white px-5 text-sm font-bold text-[#191C1E] shadow-sm transition hover:bg-[#DBE1FF]"
        >
          {formatCalendarLabel(selectedDate)}
        </button>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Menunggu"
          value={statusCounts.pending}
          accentColor="border-[#004AC6]"
          valueColor="text-[#004AC6]"
          activeColor="ring-[#004AC6]"
          activeBg="bg-[#EFF6FF]"
          active={activeStatusFilter === "pending"}
          onClick={() => setActiveStatusFilter((current) => current === "pending" ? "all" : "pending")}
          icon={<div className="w-10 h-10 rounded bg-[#DBE1FF] text-[#004AC6] flex items-center justify-center"><ClockIcon /></div>}
        />
        <StatCard
          label="Diproses"
          value={statusCounts.processing}
          accentColor="border-[#F59E0B]"
          valueColor="text-[#D97706]"
          activeColor="ring-[#F59E0B]"
          activeBg="bg-[#FFF7ED]"
          active={activeStatusFilter === "processing"}
          onClick={() => setActiveStatusFilter((current) => current === "processing" ? "all" : "processing")}
          icon={<div className="w-10 h-10 rounded bg-[#FFDDB8] text-[#D97706] flex items-center justify-center"><ProcessingIcon /></div>}
        />
        <StatCard
          label="Selesai"
          value={statusCounts.completed}
          accentColor="border-[#006C49]"
          valueColor="text-[#006C49]"
          activeColor="ring-[#006C49]"
          activeBg="bg-[#ECFDF5]"
          active={activeStatusFilter === "completed"}
          onClick={() => setActiveStatusFilter((current) => current === "completed" ? "all" : "completed")}
          icon={<div className="w-10 h-10 rounded bg-[#6CF8BB] text-[#006C49] flex items-center justify-center"><CheckIcon /></div>}
        />
        <StatCard
          label="Dibatalkan"
          value={statusCounts.cancelled}
          accentColor="border-[#BA1A1A]"
          valueColor="text-[#BA1A1A]"
          activeColor="ring-[#BA1A1A]"
          activeBg="bg-[#FFF1F2]"
          active={activeStatusFilter === "cancelled"}
          onClick={() => setActiveStatusFilter((current) => current === "cancelled" ? "all" : "cancelled")}
          icon={<div className="w-10 h-10 rounded bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center"><XIcon /></div>}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleOrders.map((order) => (
          <OrderCard
            key={order.orderId}
            {...order}
            onAccept={() => updateOrderStatus(order, "processing")}
            onCancel={() => setOrderToCancel(order)}
            onMarkReady={() => updateOrderStatus(order, "completed")}
            onPrint={() => printOrderReceipt(order)}
          />
        ))}
        {visibleOrders.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 rounded-lg border border-dashed border-[#C3C6D7] bg-white p-10 text-center text-sm font-semibold text-[#434655]">
            Belum ada pesanan pada tanggal ini.
          </div>
        )}
      </div>

      <StockIssuePopup
        key={orderToCancel?.orderId ?? "stock-issue"}
        order={orderToCancel}
        replacementOptions={replacementMenuOptions}
        onClose={() => setOrderToCancel(null)}
        onResolve={resolveStockIssue}
      />
      {isCalendarOpen && (
        <CalendarPopup
          value={selectedDate}
          onClose={() => setIsCalendarOpen(false)}
          onSelect={(value) => {
            setSelectedDate(value);
            setActiveStatusFilter("all");
            setIsCalendarOpen(false);
          }}
        />
      )}
    </main>
  );
}
