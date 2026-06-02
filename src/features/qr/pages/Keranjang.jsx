import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import QRCodeLib from "react-qr-code";
import ViewportPortal from "../../../components/common/ViewportPortal";
import qrisStaticImage from "../../../assets/qris-static.jpeg";
import {
  checkoutQrOrder,
  getQrMenu,
} from "../../../services/api";

const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
const QRIS_PAYMENT_SECONDS = 10 * 60;
const QRIS_PAYMENT_STORAGE_PREFIX = "kedai_sigma_qris_payment";
const QRCode =
  typeof QRCodeLib === "function" ? QRCodeLib : QRCodeLib.default || QRCodeLib;

const readSessionJson = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getQrisPaymentStorageKey = (search = "") =>
  `${QRIS_PAYMENT_STORAGE_PREFIX}:${search || "default"}`;

const getOrderId = (order) => order?.id_pesanan || order?.order_id || order?.id || "";

const buildReceiptUrl = (order) => {
  const orderId = getOrderId(order);
  const token = order?.receipt_token;
  const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";

  return `${window.location.origin}/struk/${orderId}${tokenQuery}`;
};

const normalizeMenuName = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getMenuBackendId = (item) => item?.id ?? item?.id_produk ?? null;
const getMenuName = (item) => item?.nama_produk || item?.name || "";

const inferCategoryFromMenuItem = (item) => {
  const category = (item?.category || item?.kategori?.nama_kategori || "").toLowerCase();
  return category === "makanan" || category === "food" ? "food" : "coffee";
};

const extractQrMenuItems = (response) => {
  const data = response?.data;

  if (Array.isArray(data?.menu)) {
    return data.menu;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

const resolveCheckoutItems = async (items, mejaId) => {
  if (items.every((item) => item.productId)) {
    return items;
  }

  const response = await getQrMenu({ meja_id: mejaId, _refresh: Date.now() });
  const menuByName = new Map(
    extractQrMenuItems(response)
      .map((menuItem) => [normalizeMenuName(getMenuName(menuItem)), getMenuBackendId(menuItem)])
      .filter(([name, id]) => name && id),
  );

  return items.map((item) => ({
    ...item,
    productId: item.productId || menuByName.get(normalizeMenuName(item.name)) || null,
  }));
};

const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

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

function PencilIcon({ className = "h-[14px] w-[14px]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
        fill="currentColor"
      />
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

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 20 12" fill="none" aria-hidden="true" className="h-[7.4px] w-3">
      <path d="M6.5.5 1 6l5.5 5.5 1.4-1.4L4.8 7H19V5H4.8l3.1-3.1L6.5.5Z" fill="currentColor" />
    </svg>
  );
}

function CartItemCard({ item, onQuantityChange, onRemove, onEdit }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#EEC200]/15 bg-[#16202E] shadow-[0_16px_38px_rgba(0,0,0,0.18)]">
      <div className="flex gap-3 p-3.5">
        <img
          src={item.image}
          alt={item.name}
          className="h-[78px] w-[78px] shrink-0 rounded-xl object-cover"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="overflow-hidden break-words font-['Space_Grotesk',Arial,sans-serif] text-sm font-bold leading-5 tracking-normal text-[#D9E3F6] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [overflow-wrap:anywhere]">
              {item.name}
            </h2>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E1928] text-[#EEC200] transition hover:text-white"
              >
                <PencilIcon className="h-[14px] w-[14px]" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(item.cartKey)}
                aria-label={`Hapus ${item.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E1928] text-[#FFB4AB] transition hover:text-white"
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          <p className="mt-1 text-xs font-bold leading-4 tracking-normal text-[#EEC200]">
            {formatRupiah(item.price)}
          </p>

          {(item.variantLabel || item.note) && (
            <div className="mt-2 space-y-1 break-words text-[10px] leading-4 tracking-normal text-[#E6BDB8] [overflow-wrap:anywhere]">
              {item.variantLabel && <p>{item.variantLabel}</p>}
              {item.note && <p>Catatan: {item.note}</p>}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex h-9 items-center overflow-hidden rounded-lg bg-[#091421]">
              <button
                type="button"
                onClick={() => onQuantityChange(item.cartKey, item.quantity - 1)}
                className="flex h-9 w-9 items-center justify-center text-[#EEC200] transition hover:bg-[#212B39]"
                aria-label={`Kurangi ${item.name}`}
              >
                <MinusIcon />
              </button>
              <span className="flex h-9 min-w-9 items-center justify-center font-['Space_Grotesk',Arial,sans-serif] text-sm font-bold text-white">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(item.cartKey, item.quantity + 1)}
                className="flex h-9 w-9 items-center justify-center text-[#EEC200] transition hover:bg-[#212B39]"
                aria-label={`Tambah ${item.name}`}
              >
                <PlusIcon />
              </button>
            </div>

            <p className="shrink-0 font-['Space_Grotesk',Arial,sans-serif] text-base font-bold text-[#D9E3F6]">
              {formatRupiah(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function EditMenuModal({ item, onClose, onConfirm }) {
  const temperatureOptions = item.temperatureOptions || [];
  const [selectedOptionId, setSelectedOptionId] = useState(
    temperatureOptions.find((opt) => opt.label === item.variantLabel)?.id ?? temperatureOptions[0]?.id ?? ""
  );
  const [note, setNote] = useState(item.note || "");

  const selectedOption =
    temperatureOptions.find((option) => option.id === selectedOptionId) ??
    temperatureOptions[0];
  const totalPrice = (selectedOption?.price ?? item.price) * item.quantity;
  const notePlaceholder =
    inferCategoryFromMenuItem(item) === "food"
      ? "Misal: tidak pedas, saus dipisah, atau ekstra topping"
      : "Misal: gula sedikit dan es sedikit";

  const handleSubmit = (event) => {
    event.preventDefault();

    onConfirm({
      ...item,
      price: selectedOption?.price ?? item.price,
      variantLabel: selectedOption?.label,
      note: note.trim(),
      newCartKey: `${item.id}::${selectedOption?.id ?? "default"}::${note.trim()}`,
    });
  };

  return (
    <ViewportPortal>
    <div
      className="fixed inset-0 z-50 flex animate-[qr-modal-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        className="relative h-[360px] w-[min(348px,calc(100vw-32px))] animate-[qr-modal-panel_260ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-xl bg-[#091421] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_24px_70px_rgba(0,0,0,0.32)]"
      >
        <header className="flex h-[52px] items-start justify-center border-b border-white/50 px-5 pt-4">
          <h2 className="text-center text-xs font-normal leading-5 text-white">
            Edit Pesanan
          </h2>
        </header>

        <div className="px-3 pt-2">
          <div className="relative min-h-[108px] border-b border-white/15">
            <img
              src={item.image}
              alt={item.name}
              className="absolute left-0 top-2 h-[60px] w-[60px] rounded-md object-cover"
            />

            <div className="ml-[72px] pt-2">
              <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-2">
                <p className="min-w-0 flex-1 overflow-hidden break-words pr-1 font-['Source_Sans_3',Arial,sans-serif] text-[12px] font-bold leading-[14px] tracking-normal text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [overflow-wrap:anywhere]">
                  {item.name}
                </p>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-['Space_Grotesk',Arial,sans-serif] text-base font-bold leading-[27px] tracking-[-1.2px] text-white">
                    {item.quantity} x
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 pt-1">
                {temperatureOptions.map((option) => {
                  const isActive = option.id === selectedOptionId;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOptionId(option.id)}
                      className="flex h-[21px] w-full items-center justify-between border-b border-white/15 text-left font-['Source_Sans_3',Arial,sans-serif] text-[10px] font-bold leading-[10px] tracking-normal text-white"
                    >
                      <span>
                        {option.label} Rp {Math.round(option.price / 1000)}k
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

          <label className="mt-2 flex items-center gap-2 px-2 text-[13px] font-normal leading-5 text-white/50">
            <PencilIcon />
            <span>Catatan untuk menu:</span>
          </label>

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={notePlaceholder}
            className="mt-1 h-[156px] w-full resize-none border border-white/15 bg-white/5 px-2 py-2 font-['Space_Grotesk',Arial,sans-serif] text-[10px] font-normal leading-[12px] tracking-normal text-white/80 outline-none placeholder:text-white/25 focus:border-[#EEC200]/60"
          />
        </div>

        <button
          type="submit"
          className="absolute bottom-0 left-0 flex h-[30px] w-full items-center justify-center gap-2 bg-[#DC2626] px-2 font-['Space_Grotesk',Arial,sans-serif] text-[10px] font-bold leading-6 tracking-[0.4px] text-white transition hover:bg-[#B91C1C]"
        >
          <PencilIcon className="h-3 w-3" />
          Simpan Perubahan - {formatRupiah(totalPrice)}
        </button>
      </form>
    </div>
    </ViewportPortal>
  );
}

function OrderSubmittedModal({ onClose }) {
  return (
    <ViewportPortal>
    <div
      className="fixed inset-0 z-50 flex animate-[qr-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-submitted-title"
    >
      <section className="relative h-[295px] w-[min(549px,calc(100vw-32px))] animate-[qr-modal-panel_260ms_cubic-bezier(0.16,1,0.3,1)]">
        <div className="absolute left-0 top-2 h-[287px] w-full overflow-hidden rounded-xl bg-[#091421] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_24px_70px_rgba(0,0,0,0.32)]">
          <p className="absolute left-1/2 top-[11px] flex h-[14px] w-[197px] -translate-x-1/2 items-center justify-center font-['Be_Vietnam_Pro',Arial,sans-serif] text-xl font-normal leading-5 text-white">
            Sistem
          </p>

          <div className="absolute left-0 top-[36.65px] h-px w-full bg-white/40" />

          <h2
            id="order-submitted-title"
            className="absolute left-1/2 top-[70px] flex h-[52px] w-[260px] -translate-x-1/2 items-center justify-center text-center font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold leading-8 tracking-[-0.4px] text-white"
          >
            Pesanan telah masuk ke dapur
          </h2>

          <div className="absolute left-[26.2%] top-[96px] h-px w-[73.8%] bg-white/15" />

          <p className="absolute left-1/2 top-[122px] flex h-[109px] w-[min(284px,calc(100%-48px))] -translate-x-1/2 items-center text-center font-['Be_Vietnam_Pro',Arial,sans-serif] text-[18px] font-normal leading-6 text-white/70">
            Pembayaran berhasil. Pesanan sedang dalam proses! Sabar ya.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute bottom-0 left-0 flex h-[39px] w-full items-center justify-center gap-2 bg-[#DC2626] px-4 font-['Space_Grotesk',Arial,sans-serif] text-base font-bold leading-6 tracking-[0.4px] text-white transition hover:bg-[#B91C1C] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#091421]"
          >
            Berhasil
          </button>
        </div>
      </section>
    </div>
    </ViewportPortal>
  );
}

function PaymentMethodModal({
  isSubmitting,
  onClose,
  onSelect,
}) {
  return (
    <ViewportPortal>
    <div
      className="fixed inset-0 z-50 flex animate-[qr-modal-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-method-title"
    >
      <section className="max-h-[calc(100vh-32px)] w-[min(360px,calc(100vw-32px))] animate-[qr-modal-panel_260ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-xl border border-[#EEC200]/60 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <header className="border-b border-white/20 px-5 py-4 text-center">
          <p className="text-xs font-bold tracking-[0.8px] text-[#EEC200]">
            Metode Pembayaran
          </p>
          <h2
            id="payment-method-title"
            className="mt-2 font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold leading-7 text-white"
          >
            Pilih cara bayar
          </h2>
        </header>

        <div className="grid max-h-[calc(100vh-168px)] gap-3 overflow-y-auto p-5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSelect("cash")}
            className="group flex items-center gap-3 rounded-lg border border-[#EEC200]/50 bg-[#121C2A] p-4 text-left transition hover:border-[#EEC200] hover:bg-[#192536] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEC200] font-['Space_Grotesk',Arial,sans-serif] text-sm font-black text-[#3C2F00]">
              Rp
            </span>
            <span className="min-w-0">
              <span className="block font-['Space_Grotesk',Arial,sans-serif] text-lg font-black tracking-[0.4px] text-white">
                Bayar Tunai
              </span>
            </span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSelect("qris")}
            className="group flex items-center gap-3 rounded-lg border border-[#DC2626]/60 bg-[#121C2A] p-4 text-left transition hover:border-[#FFB4AB] hover:bg-[#192536] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DC2626] font-['Space_Grotesk',Arial,sans-serif] text-xs font-black text-white">
              QR
            </span>
            <span className="min-w-0">
              <span className="block font-['Space_Grotesk',Arial,sans-serif] text-lg font-black tracking-[0.4px] text-white">
                QRIS
              </span>
            </span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-10 text-xs font-bold tracking-[0.4px] text-[#E6BDB8] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
        </div>
      </section>
    </div>
    </ViewportPortal>
  );
}

function QrisPaymentModal({ payment, onClose, onConfirmPaid }) {
  const getInitialSeconds = () => {
    if (!payment?.payment_expired_at) {
      return QRIS_PAYMENT_SECONDS;
    }

    const expiresAt = new Date(payment.payment_expired_at).getTime();

    if (Number.isNaN(expiresAt)) {
      return QRIS_PAYMENT_SECONDS;
    }

    return Math.max(Math.floor((expiresAt - Date.now()) / 1000), 0);
  };

  const [secondsLeft, setSecondsLeft] = useState(getInitialSeconds);
  const isExpired = secondsLeft <= 0;
  const total = Number(payment?.total_harga) || 0;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <ViewportPortal>
    <div
      className="fixed inset-0 z-50 flex animate-[qr-modal-backdrop_180ms_ease-out] items-start justify-center overflow-y-auto bg-black/75 px-4 py-3 backdrop-blur-sm sm:items-center sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qris-payment-title"
    >
      <section className="my-auto flex max-h-[calc(100dvh-24px)] w-[min(390px,calc(100vw-32px))] animate-[qr-modal-panel_260ms_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden rounded-xl border border-[#EEC200]/60 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
        <header className="border-b border-white/15 px-5 py-3 text-center sm:py-4">
          <p className="text-xs font-bold tracking-[0.8px] text-[#EEC200]">
            Pembayaran QRIS
          </p>
          <h2
            id="qris-payment-title"
            className="mt-2 font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold leading-7 text-white"
          >
            Scan untuk bayar
          </h2>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:gap-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="border-l-4 border-[#EEC200] bg-[#16202E] p-3">
              <p className="text-[10px] font-bold tracking-[0.4px] text-[#E6BDB8]">
                Total Bayar
              </p>
              <p className="mt-1 font-['Space_Grotesk',Arial,sans-serif] text-xl font-black text-[#EEC200]">
                {formatRupiah(total)}
              </p>
            </div>
            <div className={`border-l-4 p-3 ${isExpired ? "border-[#DC2626] bg-[#DC2626]/15" : "border-[#4AE176] bg-[#16202E]"}`}>
              <p className="text-[10px] font-bold tracking-[0.4px] text-[#E6BDB8]">
                Batas Waktu
              </p>
              <p className={`mt-1 font-['Space_Grotesk',Arial,sans-serif] text-xl font-black ${isExpired ? "text-[#FFB4AB]" : "text-[#4AE176]"}`}>
                {formatCountdown(secondsLeft)}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-3">
            <img
              src={qrisStaticImage}
              alt="QRIS pembayaran Kedai Sigma"
              className="mx-auto max-h-[min(42dvh,300px)] w-full object-contain"
            />
          </div>

          <p className="text-center text-xs font-semibold leading-5 text-[#E6BDB8]">
            Setelah bayar, tekan cek status atau tunjukkan bukti pembayaran ke kasir.
          </p>
        </div>

        <div className="grid gap-3 bg-[#121C2A] p-4">
          {payment?.payment_deeplink_url && (
            <a
              href={payment.payment_deeplink_url}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center bg-[#DC2626] font-['Space_Grotesk',Arial,sans-serif] text-xs font-black tracking-[0.5px] text-white transition hover:bg-[#B91C1C]"
            >
              Buka GoPay
            </a>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 border border-[#5C403C] font-['Space_Grotesk',Arial,sans-serif] text-xs font-black tracking-[0.5px] text-[#E6BDB8] transition hover:border-[#EEC200] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Tutup
            </button>
            <button
              type="button"
              disabled={isExpired}
              onClick={onConfirmPaid}
              className="h-12 bg-[#EEC200] font-['Space_Grotesk',Arial,sans-serif] text-xs font-black tracking-[0.5px] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExpired ? "Waktu Habis" : "Cek Status"}
            </button>
          </div>
        </div>
      </section>
    </div>
    </ViewportPortal>
  );
}

function CashPaymentModal({ payment, onConfirmPaid }) {
  const orderId = getOrderId(payment);
  const receiptUrl = buildReceiptUrl(payment);

  return (
    <ViewportPortal>
    <div
      className="fixed inset-0 z-50 flex animate-[qr-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cash-payment-title"
    >
      <section className="flex max-h-[calc(100vh-24px)] w-[min(390px,calc(100vw-32px))] animate-[qr-modal-panel_260ms_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden rounded-xl border border-[#EEC200]/60 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
        <header className="border-b border-white/15 px-5 py-4 text-center">
          <p className="text-xs font-bold tracking-[0.8px] text-[#EEC200]">
            Pembayaran Tunai
          </p>
          <h2
            id="cash-payment-title"
            className="mt-2 font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold leading-7 text-white"
          >
            Tunjukkan ke Kasir
          </h2>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
          <div className="mx-auto rounded-lg bg-white p-4">
            <QRCode value={receiptUrl} size={220} />
          </div>

          <p className="text-center text-xs font-semibold leading-5 text-[#E6BDB8]">
            Kasir akan melakukan scan QR ini untuk memproses pemesanan anda.
          </p>
          {orderId && (
            <p className="text-center font-['Space_Grotesk',Arial,sans-serif] text-sm font-black tracking-[2px] text-white">
              ID: {orderId}
            </p>
          )}
        </div>

        <div className="grid gap-3 bg-[#121C2A] p-4">
          <button
            type="button"
            onClick={onConfirmPaid}
            className="h-12 bg-[#EEC200] font-['Space_Grotesk',Arial,sans-serif] text-xs font-black tracking-[0.5px] text-[#3C2F00] transition hover:brightness-105"
          >
            Cek Status
          </button>
        </div>
      </section>
    </div>
    </ViewportPortal>
  );
}

export default function Keranjang() {
  const {
    addToCart,
    cartItems,
    cartTotal,
    clearCart,
    removeFromCart,
    updateCartQuantity,
    qrTable,
    orderType,
    setOrderType,
  } = useOutletContext();
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [cashPayment, setCashPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryString = searchParams.toString();
  const menuPath = queryString ? `/qr/menu?${queryString}` : "/qr/menu";
  const mejaId = searchParams.get("meja_id") || qrTable?.id;
  const qrisPaymentStorageKey = getQrisPaymentStorageKey(queryString);
  const [qrisPayment, setQrisPayment] = useState(() =>
    readSessionJson(getQrisPaymentStorageKey(window.location.search.replace(/^\?/, "")), null),
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (qrisPayment) {
      window.sessionStorage.setItem(qrisPaymentStorageKey, JSON.stringify(qrisPayment));
      return;
    }

    window.sessionStorage.removeItem(qrisPaymentStorageKey);
  }, [qrisPayment, qrisPaymentStorageKey]);

  const openOrderTypeModal = () => {
    if (!cartItems.length) {
      return;
    }

    setIsPaymentMethodModalOpen(true);
  };

  const handlePaymentMethodSelect = (method) => {
    handleCheckoutSubmit(orderType || "dine_in", method);
  };

  const handleCheckoutSubmit = async (selectedOrderType, paymentMethod) => {
    if (!cartItems.length) {
      return;
    }

    if (!mejaId) {
      toast.error("QR belum terhubung ke meja. Buka ulang menu dari QR meja admin.");
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutItems = await resolveCheckoutItems(cartItems, mejaId);
      const disconnectedItem = checkoutItems.find((item) => !item.productId);

      if (disconnectedItem) {
        toast.error(
          `Menu "${disconnectedItem.name}" belum tersambung ke backend. Hapus item itu lalu tambah ulang dari halaman menu QR.`,
        );
        return;
      }

      const response = await checkoutQrOrder({
        meja_id: Number(mejaId),
        tipe_pesanan: selectedOrderType,
        metode_pembayaran: paymentMethod,
        catatan_pesanan: paymentMethod === "qris" ? "Pembayaran QRIS manual" : "Bayar Tunai",
        items: checkoutItems.map((item) => ({
          produk_id: item.productId,
          jumlah_item: item.quantity,
          opsi_varian: [item.variantLabel, item.note].filter(Boolean).join(", ") || null,
        })),
      });
      setIsPaymentMethodModalOpen(false);
      clearCart();

      if (paymentMethod === "qris") {
        setQrisPayment({
          ...response.data,
          total_harga: response.data?.total_harga || cartTotal,
        });
        return;
      }
      if (paymentMethod === "cash") {
        setCashPayment({
          ...response.data,
          total_harga: response.data?.total_harga || cartTotal,
        });
        return;
      }

      setIsOrderSubmitted(true);
    } catch (error) {
      console.error("Gagal mengirim pesanan:", error);
      toast.error(error.message || "Pesanan belum bisa dikirim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center gap-5 px-5 pb-12 pt-6 sm:px-6">
      <section className="box-border flex w-full max-w-[372px] flex-col rounded-2xl border border-[#EEC200]/15 bg-[#111C2A] px-5 py-5 shadow-[0_16px_38px_rgba(0,0,0,0.18)]">
        <span className="mb-2 h-1.5 w-12 rounded-full bg-[#DC2626]" />
        <h1 className="font-['Space_Grotesk',Arial,sans-serif] text-[36px] font-bold leading-[40px] tracking-normal text-[#D9E3F6]">
          Keranjang
        </h1>
        <p className="mt-1 w-full max-w-[300px] text-[11px] font-medium leading-5 tracking-normal text-[#E6BDB8]">
          Cek lagi menu pilihanmu sebelum dikirim ke kasir.
        </p>
      </section>

      <Link
        to={menuPath}
        className="flex h-12 w-full max-w-[372px] items-center justify-center gap-3 rounded-xl border-2 border-[#EEC200] bg-[#EEC200] px-4 font-['Space_Grotesk',Arial,sans-serif] text-sm font-black tracking-normal text-[#3C2F00] shadow-[0_12px_24px_rgba(238,194,0,0.18)] transition hover:-translate-y-0.5 hover:brightness-105"
      >
        <ArrowLeftIcon />
        Kembali ke Menu
      </Link>

      {cartItems.length > 0 && (
        <section className="flex w-full max-w-[372px] flex-col gap-2">
          <p className="font-['Space_Grotesk',Arial,sans-serif] text-sm font-bold tracking-normal text-[#D9E3F6]">
            Tipe Pesanan
          </p>
          <div className="flex rounded-xl bg-[#212B39] p-1">
            <button
              type="button"
              onClick={() => setOrderType("dine_in")}
              className={`flex-1 rounded-lg py-2.5 font-['Space_Grotesk',Arial,sans-serif] text-xs font-bold tracking-normal transition ${orderType === "dine_in" ? "bg-[#EEC200] text-[#3C2F00]" : "text-[#E6BDB8] hover:text-white"}`}
            >
              Makan di Sini
            </button>
            <button
              type="button"
              onClick={() => setOrderType("takeaway")}
              className={`flex-1 rounded-lg py-2.5 font-['Space_Grotesk',Arial,sans-serif] text-xs font-bold tracking-normal transition ${orderType === "takeaway" ? "bg-[#EEC200] text-[#3C2F00]" : "text-[#E6BDB8] hover:text-white"}`}
            >
              Bawa Pulang
            </button>
          </div>
        </section>
      )}

      {cartItems.length === 0 ? (
        <section className="w-full max-w-[372px] rounded-2xl border border-[#EEC200]/20 bg-[#212B39] p-5">
          <h2 className="font-['Space_Grotesk',Arial,sans-serif] text-xl font-bold leading-7 text-[#D9E3F6]">
            Keranjang Kosong
          </h2>
          <p className="mt-3 text-xs leading-5 tracking-normal text-[#E6BDB8]">
            Pilih menu dulu, nanti pesananmu muncul di sini.
          </p>
        </section>
      ) : (
        <>
          <section className="flex w-full max-w-[372px] flex-col gap-3">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.cartKey}
                item={item}
                onQuantityChange={updateCartQuantity}
                onRemove={removeFromCart}
                onEdit={setEditingItem}
              />
            ))}
          </section>

          <section className="w-full max-w-[372px] rounded-2xl border border-[#EEC200]/20 bg-[#16202E] p-5 shadow-[0_16px_38px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-3 pb-4 mb-4 border-b-2 border-[#2B3544]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold leading-4 tracking-normal text-[#E6BDB8]">
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} menu)
                </span>
                <span className="font-['Space_Grotesk',Arial,sans-serif] text-base font-bold leading-5 text-white">
                  {formatRupiah(cartTotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-b-2 border-[#2B3544] pb-4">
              <span className="text-xs font-bold leading-4 tracking-normal text-[#E6BDB8]">
                Total Pembayaran
              </span>
              <span className="font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold leading-7 text-[#EEC200]">
                {formatRupiah(cartTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={openOrderTypeModal}
              disabled={isSubmitting}
              className="mt-5 flex h-[60px] w-full items-center justify-center rounded-xl bg-[#EEC200] px-4 font-['Space_Grotesk',Arial,sans-serif] text-sm font-black leading-5 tracking-[0.6px] text-[#3C2F00] shadow-[8px_8px_0_#3C2F00] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0_#3C2F00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Memproses..." : "Bayar"}
            </button>
          </section>
        </>
      )}

      {isOrderSubmitted && (
        <OrderSubmittedModal
          onClose={() => {
            setIsOrderSubmitted(false);
            navigate(menuPath, { replace: true });
          }}
        />
      )}
      {editingItem && (
        <EditMenuModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onConfirm={(updatedItem) => {
            const { cartKey: oldCartKey, newCartKey } = updatedItem;
            removeFromCart(oldCartKey);
            addToCart({ ...updatedItem, cartKey: newCartKey });
            setEditingItem(null);
          }}
        />
      )}
      {isPaymentMethodModalOpen && (
        <PaymentMethodModal
          isSubmitting={isSubmitting}
          onClose={() => {
            setIsPaymentMethodModalOpen(false);
          }}
          onSelect={handlePaymentMethodSelect}
        />
      )}
      {qrisPayment && (
        <QrisPaymentModal
          payment={qrisPayment}
          onClose={() => setQrisPayment(null)}
          onConfirmPaid={() => {
            setQrisPayment(null);
            setIsOrderSubmitted(true);
          }}
        />
      )}
      {cashPayment && (
        <CashPaymentModal
          payment={cashPayment}
          onConfirmPaid={() => {
            setCashPayment(null);
            setIsOrderSubmitted(true);
          }}
        />
      )}
    </main>
  );
}
