import { useEffect, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import {
  checkoutQrOrder,
  getQrPaymentConfig,
  getQrPaymentStatus,
} from "../../../services/api";

const formatRupiah = (value) => `Rp ${value.toLocaleString("id-ID")}`;
const QRIS_PAYMENT_SECONDS = 10 * 60;

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

function CartItemCard({ item, onQuantityChange, onRemove }) {
  return (
    <article className="overflow-hidden border border-[#DC2626]/70 bg-[#16202E] shadow-[0_0_0_3px_rgba(220,38,38,0.10)]">
      <div className="flex gap-3 p-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-20 w-20 shrink-0 object-cover"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-['Space_Grotesk',Arial,sans-serif] text-sm font-bold uppercase leading-5 tracking-[1px] text-[#D9E3F6]">
              {item.name}
            </h2>
            <button
              type="button"
              onClick={() => onRemove(item.cartKey)}
              aria-label={`Hapus ${item.name}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center text-[#FFB4AB] transition hover:text-white"
            >
              <TrashIcon />
            </button>
          </div>

          <p className="mt-1 text-xs font-bold uppercase leading-4 tracking-[1px] text-[#EEC200]">
            {formatRupiah(item.price)}
          </p>

          {(item.variantLabel || item.note) && (
            <div className="mt-2 space-y-1 text-[10px] uppercase leading-4 tracking-[0.8px] text-[#E6BDB8]">
              {item.variantLabel && <p>{item.variantLabel}</p>}
              {item.note && <p>Catatan: {item.note}</p>}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex h-9 items-center bg-[#091421]">
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

function OrderSubmittedModal({ onClose }) {
  return (
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
            className="absolute left-1/2 top-[70px] flex h-[26px] w-[260px] -translate-x-1/2 items-center justify-center text-center font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold uppercase leading-8 tracking-[-1.2px] text-white"
          >
            Pesanan telah masuk ke dapur
          </h2>

          <div className="absolute left-[26.2%] top-[96px] h-px w-[73.8%] bg-white/15" />

          <p className="absolute left-1/2 top-[122px] flex h-[109px] w-[min(284px,calc(100%-48px))] -translate-x-1/2 items-center font-['Be_Vietnam_Pro',Arial,sans-serif] text-xl font-normal leading-5 text-white/50">
            Pesanan Anda sudah masuk ke dapur. Mohon menunggu, pesanan sedang diproses.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute bottom-0 left-0 flex h-[39px] w-full items-center justify-center gap-2 bg-[#DC2626] px-4 font-['Space_Grotesk',Arial,sans-serif] text-base font-bold uppercase leading-6 tracking-[1.6px] text-white transition hover:bg-[#B91C1C] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#091421]"
          >
            Berhasil
          </button>
        </div>
      </section>
    </div>
  );
}

function OrderTypeModal({ isSubmitting, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex animate-[qr-modal-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-type-title"
    >
      <section className="max-h-[calc(100vh-32px)] w-[min(360px,calc(100vw-32px))] animate-[qr-modal-panel_260ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-xl border border-[#DC2626]/70 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <header className="border-b border-white/20 px-5 py-4 text-center">
          <p className="text-sm font-normal leading-5 text-white/70">Sistem</p>
          <h2
            id="order-type-title"
            className="mt-2 font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold uppercase leading-7 text-white"
          >
            Konfirmasi pesanan
          </h2>
        </header>

        <div className="grid gap-3 p-5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onConfirm("dine_in")}
            className="flex h-14 items-center justify-center bg-[#EEC200] font-['Space_Grotesk',Arial,sans-serif] text-sm font-black uppercase tracking-[1.6px] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Makan di Sini
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onConfirm("takeaway")}
            className="flex h-14 items-center justify-center bg-[#DC2626] font-['Space_Grotesk',Arial,sans-serif] text-sm font-black uppercase tracking-[1.6px] text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Bawa Pulang
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-10 text-xs font-bold uppercase tracking-[1.2px] text-[#E6BDB8] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
        </div>
      </section>
    </div>
  );
}

function PaymentMethodModal({
  isLoadingPaymentConfig,
  isSubmitting,
  onClose,
  onSelect,
  qrisEnabled,
  qrisMessage,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex animate-[qr-modal-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-method-title"
    >
      <section className="max-h-[calc(100vh-32px)] w-[min(360px,calc(100vw-32px))] animate-[qr-modal-panel_260ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-xl border border-[#EEC200]/60 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <header className="border-b border-white/20 px-5 py-4 text-center">
          <p className="text-sm font-normal leading-5 text-white/70">Sistem</p>
          <h2
            id="payment-method-title"
            className="mt-2 font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold uppercase leading-7 text-white"
          >
            Pilih pembayaran
          </h2>
        </header>

        <div className="grid max-h-[calc(100vh-168px)] gap-3 overflow-y-auto p-5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSelect("cash")}
            className="flex h-14 items-center justify-center bg-[#EEC200] font-['Space_Grotesk',Arial,sans-serif] text-sm font-black uppercase tracking-[1.6px] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Bayar Tunai
          </button>
          <button
            type="button"
            disabled={isSubmitting || isLoadingPaymentConfig || !qrisEnabled}
            onClick={() => onSelect("qris")}
            className="flex h-14 items-center justify-center bg-[#DC2626] font-['Space_Grotesk',Arial,sans-serif] text-sm font-black uppercase tracking-[1.6px] text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:bg-[#334155] disabled:text-[#CBD5E1] disabled:opacity-100"
          >
            {isLoadingPaymentConfig
              ? "Mengecek QRIS..."
              : qrisEnabled
                ? "Bayar QRIS"
                : "QRIS Belum Aktif"}
          </button>
          {!qrisEnabled && !isLoadingPaymentConfig && (
            <p className="rounded-lg border border-[#EEC200]/20 bg-[#16202E] px-3 py-2 text-center text-xs font-semibold leading-5 text-[#E6BDB8]">
              {qrisMessage || "QRIS belum aktif. Silakan pilih pembayaran tunai dulu."}
            </p>
          )}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-10 text-xs font-bold uppercase tracking-[1.2px] text-[#E6BDB8] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
        </div>
      </section>
    </div>
  );
}

function QrisPaymentModal({ payment, isChecking, onClose, onCheckStatus }) {
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

  useEffect(() => {
    if (isExpired) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      onCheckStatus();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isExpired, onCheckStatus]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-[qr-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qris-payment-title"
    >
      <section className="flex max-h-[92vh] w-[min(390px,calc(100vw-32px))] animate-[qr-modal-panel_260ms_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden rounded-xl border border-[#EEC200]/60 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
        <header className="border-b border-white/15 px-5 py-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[1.4px] text-[#EEC200]">
            Pembayaran QRIS
          </p>
          <h2
            id="qris-payment-title"
            className="mt-2 font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold uppercase leading-7 text-white"
          >
            Scan untuk bayar
          </h2>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="border-l-4 border-[#EEC200] bg-[#16202E] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-[#E6BDB8]">
                Total Bayar
              </p>
              <p className="mt-1 font-['Space_Grotesk',Arial,sans-serif] text-xl font-black text-[#EEC200]">
                {formatRupiah(total)}
              </p>
            </div>
            <div className={`border-l-4 p-3 ${isExpired ? "border-[#DC2626] bg-[#DC2626]/15" : "border-[#4AE176] bg-[#16202E]"}`}>
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-[#E6BDB8]">
                Batas Waktu
              </p>
              <p className={`mt-1 font-['Space_Grotesk',Arial,sans-serif] text-xl font-black ${isExpired ? "text-[#FFB4AB]" : "text-[#4AE176]"}`}>
                {formatCountdown(secondsLeft)}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white p-3">
            {payment?.payment_qr_url ? (
              <img
                src={payment.payment_qr_url}
                alt="QRIS pembayaran Kedai Sigma"
                className="mx-auto max-h-[430px] w-full object-contain"
              />
            ) : (
              <div className="flex min-h-[280px] items-center justify-center px-4 text-center text-sm font-bold leading-6 text-[#3C2F00]">
                QR pembayaran belum tersedia dari gateway.
              </div>
            )}
          </div>

          <p className="text-center text-xs font-semibold leading-5 text-[#E6BDB8]">
            Menunggu konfirmasi pembayaran dari GoPay/Midtrans.
          </p>
        </div>

        <div className="grid gap-3 bg-[#121C2A] p-4">
          {payment?.payment_deeplink_url && (
            <a
              href={payment.payment_deeplink_url}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center bg-[#DC2626] font-['Space_Grotesk',Arial,sans-serif] text-xs font-black uppercase tracking-[1.4px] text-white transition hover:bg-[#B91C1C]"
            >
              Buka GoPay
            </a>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isChecking}
              onClick={onClose}
              className="h-12 border border-[#5C403C] font-['Space_Grotesk',Arial,sans-serif] text-xs font-black uppercase tracking-[1.4px] text-[#E6BDB8] transition hover:border-[#EEC200] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Tutup
            </button>
            <button
              type="button"
              disabled={isChecking || isExpired}
              onClick={onCheckStatus}
              className="h-12 bg-[#EEC200] font-['Space_Grotesk',Arial,sans-serif] text-xs font-black uppercase tracking-[1.4px] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExpired ? "Waktu Habis" : isChecking ? "Mengecek..." : "Cek Status"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Keranjang() {
  const {
    cartItems,
    cartTotal,
    clearCart,
    removeFromCart,
    updateCartQuantity,
    qrTable,
  } = useOutletContext();
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);
  const [pendingOrderType, setPendingOrderType] = useState("");
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [isLoadingPaymentConfig, setIsLoadingPaymentConfig] = useState(false);
  const [qrisPayment, setQrisPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const menuPath = queryString ? `/qr/menu?${queryString}` : "/qr/menu";
  const mejaId = searchParams.get("meja_id") || qrTable?.id;
  const qrisEnabled = paymentConfig?.qris_enabled === true;
  const qrisMessage = paymentConfig?.message;

  useEffect(() => {
    if (!isPaymentMethodModalOpen) {
      return undefined;
    }

    let isMounted = true;

    setIsLoadingPaymentConfig(true);
    getQrPaymentConfig()
      .then((response) => {
        if (isMounted) {
          setPaymentConfig(response.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPaymentConfig({
            qris_enabled: false,
            message: "QRIS belum bisa dicek. Silakan pilih pembayaran tunai dulu.",
          });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingPaymentConfig(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isPaymentMethodModalOpen]);

  const openOrderTypeModal = () => {
    if (!cartItems.length) {
      return;
    }

    setIsOrderTypeModalOpen(true);
  };

  const handleConfirm = (orderType) => {
    setPendingOrderType(orderType);
    setIsOrderTypeModalOpen(false);
    setIsPaymentMethodModalOpen(true);
  };

  const handlePaymentMethodSelect = (method) => {
    if (method === "qris" && !qrisEnabled) {
      return;
    }

    handleCheckoutSubmit(pendingOrderType || "dine_in", method);
  };

  const handleCheckoutSubmit = async (orderType, paymentMethod) => {
    if (!cartItems.length) {
      return;
    }

    if (!mejaId) {
      window.alert("QR belum terhubung ke meja. Buka ulang menu dari QR meja admin.");
      return;
    }

    if (cartItems.some((item) => !item.productId)) {
      window.alert("Menu belum terhubung ke backend. Pastikan backend Laravel aktif lalu buka ulang QR.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await checkoutQrOrder({
        meja_id: Number(mejaId),
        tipe_pesanan: orderType || "dine_in",
        metode_pembayaran: paymentMethod === "qris" ? "qris" : "cash",
        catatan_pesanan: paymentMethod === "qris" ? "Pembayaran QRIS" : "Bayar Tunai",
        items: cartItems.map((item) => ({
          produk_id: item.productId,
          jumlah_item: item.quantity,
          opsi_varian: [item.variantLabel, item.note].filter(Boolean).join(", ") || null,
        })),
      });
      setIsOrderTypeModalOpen(false);
      setIsPaymentMethodModalOpen(false);
      setPendingOrderType("");
      clearCart();

      if (paymentMethod === "qris") {
        setQrisPayment(response.data);
        return;
      }

      setIsOrderSubmitted(true);
    } catch (error) {
      console.error("Gagal mengirim pesanan:", error);
      const message =
        paymentMethod === "qris"
          ? "QRIS belum aktif. Silakan pilih pembayaran tunai dulu."
          : error.message || "Pesanan belum bisa dikirim.";

      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentStatusCheck = async () => {
    if (!qrisPayment?.id || isCheckingPayment) {
      return;
    }

    setIsCheckingPayment(true);

    try {
      const response = await getQrPaymentStatus(qrisPayment.id);
      const updatedPayment = response.data;

      setQrisPayment(updatedPayment);

      if (updatedPayment?.status_pembayaran === "lunas") {
        setQrisPayment(null);
        setIsOrderSubmitted(true);
      }

      if (
        updatedPayment?.status_pesanan === "dibatalkan" ||
        ["expire", "cancel", "deny", "failure"].includes(updatedPayment?.payment_status)
      ) {
        setQrisPayment(null);
        window.alert("Pembayaran QRIS sudah tidak aktif. Silakan pesan ulang.");
      }
    } catch (error) {
      console.error("Gagal mengecek status pembayaran:", error);
      window.alert(error.message || "Status pembayaran belum bisa dicek.");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-[29px] border-r-4 border-[#212B39] px-7 pb-12 pt-7">
      <section className="box-border flex w-full max-w-[285px] flex-col border-l-8 border-[#DC2626] py-4 pl-2.5">
        <h1 className="font-['Space_Grotesk',Arial,sans-serif] text-[44px] font-bold uppercase leading-[48px] tracking-[-2px] text-[#D9E3F6]">
          Pesanan
        </h1>
        <p className="w-full max-w-[267px] text-[10px] font-medium uppercase leading-5 tracking-[1.4px] text-[#E6BDB8]">
          Cek lagi menu pilihanmu sebelum dikirim ke kasir.
        </p>
      </section>

      <Link
        to={menuPath}
        className="flex h-12 w-[210px] items-center justify-center gap-3 border-l-4 border-[#EEC200] bg-[#212B39] px-4 font-['Space_Grotesk',Arial,sans-serif] text-xs font-bold uppercase tracking-[1.6px] text-[#EEC200] transition hover:text-[#FFB4AB]"
      >
        <ArrowLeftIcon />
        Kembali Menu
      </Link>

      {cartItems.length === 0 ? (
        <section className="w-full max-w-[334px] border-l-4 border-[#EEC200] bg-[#212B39] p-5">
          <h2 className="font-['Space_Grotesk',Arial,sans-serif] text-xl font-bold uppercase leading-7 text-[#D9E3F6]">
            Keranjang Kosong
          </h2>
          <p className="mt-3 text-xs uppercase leading-5 tracking-[1px] text-[#E6BDB8]">
            Pilih menu dulu, nanti pesananmu muncul di sini.
          </p>
        </section>
      ) : (
        <>
          <section className="flex w-full max-w-[334px] flex-col gap-4">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.cartKey}
                item={item}
                onQuantityChange={updateCartQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </section>

          <section className="w-full max-w-[334px] bg-[#16202E] p-5 border-b-8 border-[#EEC200]">
            <div className="flex items-center justify-between gap-4 border-b-2 border-[#2B3544] pb-4">
              <span className="text-xs font-bold uppercase leading-4 tracking-[1.2px] text-[#E6BDB8]">
                Total Harga
              </span>
              <span className="font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold leading-7 text-[#EEC200]">
                {formatRupiah(cartTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={openOrderTypeModal}
              disabled={isSubmitting}
              className="mt-5 flex h-[60px] w-full items-center justify-center bg-[#EEC200] px-4 font-['Space_Grotesk',Arial,sans-serif] text-sm font-black uppercase leading-5 tracking-[2px] text-[#3C2F00] shadow-[8px_8px_0_#3C2F00] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0_#3C2F00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pesanan"}
            </button>
          </section>
        </>
      )}

      {isOrderSubmitted && (
        <OrderSubmittedModal onClose={() => setIsOrderSubmitted(false)} />
      )}
      {isOrderTypeModalOpen && (
        <OrderTypeModal
          isSubmitting={isSubmitting}
          onClose={() => setIsOrderTypeModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
      {isPaymentMethodModalOpen && (
        <PaymentMethodModal
          isLoadingPaymentConfig={isLoadingPaymentConfig}
          isSubmitting={isSubmitting}
          onClose={() => {
            setIsPaymentMethodModalOpen(false);
            setPendingOrderType("");
          }}
          onSelect={handlePaymentMethodSelect}
          qrisEnabled={qrisEnabled}
          qrisMessage={qrisMessage}
        />
      )}
      {qrisPayment && (
        <QrisPaymentModal
          payment={qrisPayment}
          isChecking={isCheckingPayment}
          onClose={() => setQrisPayment(null)}
          onCheckStatus={handlePaymentStatusCheck}
        />
      )}
    </main>
  );
}
