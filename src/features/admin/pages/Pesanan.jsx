import { useMemo, useState } from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatRupiah = (value) => `Rp ${value.toLocaleString("id-ID")}`;

const getOrderTotal = (items) =>
  items.reduce((total, item) => total + item.price, 0);

const statusConfig = {
  pending: {
    badge: { bg: "bg-[#DBE1FF]", text: "text-[#00174B]", label: "Pending" },
    headerBg: "bg-[rgba(239,246,255,0.30)]",
    tableBorder: "border-[rgba(0,74,198,0.20)]",
    tableText: "text-[#004AC6]",
    tableBg: "bg-white",
    totalColor: "text-[#004AC6]",
  },
  processing: {
    badge: { bg: "bg-[#FFDDB8]", text: "text-[#653E00]", label: "Processing" },
    headerBg: "bg-[rgba(255,251,235,0.30)]",
    tableBorder: "border-[#FDE68A]",
    tableText: "text-[#D97706]",
    tableBg: "bg-white",
    totalColor: "text-[#D97706]",
  },
  completed: {
    badge: { bg: "bg-[#6CF8BB]", text: "text-[#00714D]", label: "Completed" },
    headerBg: "bg-[rgba(108,248,187,0.10)]",
    tableBorder: "border-[rgba(0,108,73,0.20)]",
    tableText: "text-[#006C49]",
    tableBg: "bg-white",
    totalColor: "text-[#006C49]",
  },
  cancelled: {
    badge: { bg: "bg-[#FFDAD6]", text: "text-[#93000A]", label: "Cancelled" },
    headerBg: "bg-[rgba(255,218,214,0.20)]",
    tableBorder: "border-[rgba(186,26,26,0.20)]",
    tableText: "text-[#BA1A1A]",
    tableBg: "bg-white",
    totalColor: "text-[#BA1A1A]",
  },
};

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

function StatCard({ label, value, icon, accentColor, valueColor }) {
  return (
    <div className={cn("flex flex-col gap-1 p-6 rounded-lg bg-white shadow-sm border-b-4", accentColor)}>
      <div className="flex justify-between items-start">{icon}</div>
      <p className="text-[#434655] text-xs font-bold leading-4 tracking-[0.6px] uppercase mt-3">{label}</p>
      <p className={cn("text-3xl font-black leading-9", valueColor)}>{value}</p>
    </div>
  );
}

function OrderCard({
  tableNumber,
  orderId,
  timeLabel,
  status,
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

        <span className={cn("px-2 py-1 rounded-sm text-[10px] font-bold leading-[15px] tracking-[0.5px] uppercase", cfg.badge.bg, cfg.badge.text)}>
          {cfg.badge.label}
        </span>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 flex-1">
        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className={cn("flex justify-between items-start", isDimmed && "opacity-60")}>
              <div className="flex flex-col">
                <span className={cn("text-[#434655] text-sm leading-5", isDimmed && "line-through")}>{item.name}</span>
                {item.note && (
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#BA1A1A]">
                    {item.note}
                  </span>
                )}
              </div>
              <span className="text-[#191C1E] text-sm font-semibold leading-5 flex-shrink-0 ml-2">{formatRupiah(item.price)}</span>
            </div>
          ))}
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
              className="flex-1 py-3 rounded bg-[#004AC6] text-white text-xs font-bold tracking-wide shadow-md hover:bg-blue-800 transition-colors"
            >
              Accept Order
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center w-10 h-10 rounded border border-[rgba(195,198,215,0.20)] bg-white text-[#BA1A1A] hover:bg-red-50 transition-colors flex-shrink-0"
              aria-label="Cancel order"
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
              Mark as Ready
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center w-10 h-10 rounded border border-[rgba(195,198,215,0.20)] bg-white hover:bg-red-50 hover:text-[#BA1A1A] transition-colors flex-shrink-0"
              aria-label="Cancel order"
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
            Print Receipt
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
  const canResolve = resolution === "remove" || Boolean(selectedReplacement);

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
                : `${selectedItem?.name ?? "Item"} akan ditandai stok habis lalu dihapus dari pesanan.`}
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
const replacementMenuOptions = [
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
const initialOrders = [
  {
    tableNumber: "01",
    orderId: "#ORD-001",
    timeLabel: "10 menit lalu",
    status: "pending",
    items: [
      { name: "Coffee Milk", price: 13000 },
      { name: "Risol Mayo", price: 13000 },
      { name: "Kentang", price: 10000 },
    ],
  },
  {
    tableNumber: "07",
    orderId: "#ORD-002",
    timeLabel: "18 menit lalu",
    status: "processing",
    items: [
      { name: "Coffee Latte Ice", price: 13000 },
      { name: "Mix Platter", price: 20000 },
      { name: "Lemon Tea Ice", price: 10000 },
    ],
  },
  {
    tableNumber: "03",
    orderId: "#ORD-003",
    timeLabel: "35 menit lalu",
    status: "completed",
    items: [
      { name: "Americano Hot", price: 10000 },
      { name: "Siomay Ayam", price: 15000 },
      { name: "Coklat Classic Roti", price: 15000 },
    ],
  },
  {
    tableNumber: "04",
    orderId: "#ORD-004",
    timeLabel: "50 menit lalu",
    status: "cancelled",
    items: [
      {
        name: "Mix Platter",
        price: 20000,
        note: "Stok habis",
      },
      { name: "Indomie Nyemek Vinsen", price: 15000 },
    ],
  },
  {
    tableNumber: "05",
    orderId: "#ORD-005",
    timeLabel: "12 menit lalu",
    status: "pending",
    items: [
      { name: "V6 Drip Susu Hot", price: 13000 },
      { name: "Ayam Popcorn", price: 15000 },
      { name: "Lychee Tea Ice", price: 10000 },
    ],
  },
  {
    tableNumber: "06",
    orderId: "#ORD-006",
    timeLabel: "6 menit lalu",
    status: "pending",
    items: [
      { name: "Matcha Ice", price: 13000 },
      { name: "Tahu Bakso Goreng", price: 13000 },
      { name: "Coffee Bear Ice", price: 16000 },
    ],
  },
];

export default function Pesanan() {
  const [orders, setOrders] = useState(initialOrders);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const statusCounts = useMemo(
    () =>
      orders.reduce(
        (counts, order) => ({
          ...counts,
          [order.status]: counts[order.status] + 1,
        }),
        { pending: 0, processing: 0, completed: 0, cancelled: 0 },
      ),
    [orders],
  );

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: nextStatus } : order,
      ),
    );
  };

  const resolveStockIssue = ({ itemIndex, resolution, replacement }) => {
    if (!orderToCancel) {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.orderId !== orderToCancel.orderId) {
          return order;
        }

        const outOfStockItem = order.items[itemIndex];
        const nextItems = order.items.map((item, index) =>
          index === itemIndex ? { ...item, note: "Stok habis" } : item
        );

        if (resolution === "replace" && replacement) {
          nextItems[itemIndex] = {
            ...replacement,
            note: `Pengganti ${outOfStockItem.name}`,
          };
        }

        const resolvedItems =
          resolution === "remove"
            ? nextItems.filter((_, index) => index !== itemIndex)
            : nextItems;

        return {
          ...order,
          status: resolvedItems.length ? order.status : "cancelled",
          items: resolvedItems.length
            ? resolvedItems
            : [{ ...outOfStockItem, note: "Stok habis" }],
        };
      })
    );
    setOrderToCancel(null);
  };

  const printOrderReceipt = (order) => {
    const summary = order.items
      .map((item) => `${item.name} - ${formatRupiah(item.price)}`)
      .join("\n");

    window.alert(
      `${order.orderId} | Meja ${order.tableNumber}\n${summary}\nTotal: ${formatRupiah(getOrderTotal(order.items))}`,
    );
  };

  return (
    <main className="min-h-screen bg-[#F6F7FB] p-6 font-['Inter',sans-serif]">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending" value={statusCounts.pending} accentColor="border-[#004AC6]" valueColor="text-[#004AC6]" icon={<div className="w-10 h-10 rounded bg-[#DBE1FF] text-[#004AC6] flex items-center justify-center"><ClockIcon /></div>} />
        <StatCard label="Processing" value={statusCounts.processing} accentColor="border-[#F59E0B]" valueColor="text-[#D97706]" icon={<div className="w-10 h-10 rounded bg-[#FFDDB8] text-[#D97706] flex items-center justify-center"><ProcessingIcon /></div>} />
        <StatCard label="Completed" value={statusCounts.completed} accentColor="border-[#006C49]" valueColor="text-[#006C49]" icon={<div className="w-10 h-10 rounded bg-[#6CF8BB] text-[#006C49] flex items-center justify-center"><CheckIcon /></div>} />
        <StatCard label="Cancelled" value={statusCounts.cancelled} accentColor="border-[#BA1A1A]" valueColor="text-[#BA1A1A]" icon={<div className="w-10 h-10 rounded bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center"><XIcon /></div>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {orders.map((order) => (
          <OrderCard
            key={order.orderId}
            {...order}
            onAccept={() => updateOrderStatus(order.orderId, "processing")}
            onCancel={() => setOrderToCancel(order)}
            onMarkReady={() => updateOrderStatus(order.orderId, "completed")}
            onPrint={() => printOrderReceipt(order)}
          />
        ))}
      </div>

      <StockIssuePopup
        key={orderToCancel?.orderId ?? "stock-issue"}
        order={orderToCancel}
        replacementOptions={replacementMenuOptions}
        onClose={() => setOrderToCancel(null)}
        onResolve={resolveStockIssue}
      />
    </main>
  );
}
