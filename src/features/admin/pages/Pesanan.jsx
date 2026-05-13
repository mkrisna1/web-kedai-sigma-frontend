import { useEffect, useMemo, useState } from "react";
import {
  getAdminOrderReceipt,
  getAdminOrders,
  updateAdminOrderPayment,
  updateAdminOrderStatus,
} from "../../../services/api";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "-";

const statusConfig = {
  menunggu_konfirmasi: {
    label: "Menunggu",
    badge: "bg-blue-50 text-blue-700",
    border: "border-blue-500",
  },
  diproses: {
    label: "Processing",
    badge: "bg-amber-50 text-amber-700",
    border: "border-amber-500",
  },
  selesai: {
    label: "Ready",
    badge: "bg-emerald-50 text-emerald-700",
    border: "border-emerald-500",
  },
  dibatalkan: {
    label: "Cancelled",
    badge: "bg-rose-50 text-rose-700",
    border: "border-rose-500",
  },
};

function StatCard({ label, value, className = "border-slate-300" }) {
  return (
    <article className={`rounded-lg border-l-4 bg-white p-5 shadow-sm ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </article>
  );
}

function ReceiptModal({ receipt, onClose }) {
  if (!receipt) {
    return null;
  }

  const items = receipt.detail_pesanans || [];

  const printReceipt = () => {
    const html = `
      <html>
        <head>
          <title>Nota Pesanan #${receipt.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            h1 { font-size: 20px; margin: 0 0 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; }
            td, th { border-bottom: 1px solid #e5e7eb; padding: 8px 0; text-align: left; }
            .right { text-align: right; }
            .total { font-weight: 800; font-size: 18px; }
          </style>
        </head>
        <body>
          <h1>Kedai Sigma</h1>
          <div>Nota Pesanan #${receipt.id}</div>
          <div>${receipt.meja?.nomor_meja || "Takeaway"} - ${formatDateTime(receipt.tgl_pesanan)}</div>
          <table>
            <thead><tr><th>Menu</th><th>Qty</th><th class="right">Subtotal</th></tr></thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                    <tr>
                      <td>${item.produk?.nama_produk || "Menu"}${item.opsi_varian ? ` (${item.opsi_varian})` : ""}</td>
                      <td>${item.jumlah_item}</td>
                      <td class="right">${formatRupiah(item.subtotal)}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
          <p class="right total">Total ${formatRupiah(receipt.total_harga)}</p>
          <p>Bayar lewat kasir. Terima kasih.</p>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=420,height=640");

    if (!printWindow) {
      window.alert("Browser memblokir popup print. Izinkan popup dulu untuk cetak nota.");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-xl font-black text-slate-950">
            Nota Pesanan #{receipt.id}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {receipt.meja?.nomor_meja || "Takeaway"} - {formatDateTime(receipt.tgl_pesanan)}
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <p className="font-bold text-slate-950">
                    {item.produk?.nama_produk || "Menu"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.jumlah_item} item {item.opsi_varian ? `- ${item.opsi_varian}` : ""}
                  </p>
                </div>
                <p className="font-black">{formatRupiah(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between text-lg font-black">
            <span>Total</span>
            <span>{formatRupiah(receipt.total_harga)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg bg-white text-sm font-bold text-slate-600"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={printReceipt}
            className="h-11 rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700"
          >
            Print Nota
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Pesanan() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [receipt, setReceipt] = useState(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAdminOrders();
      setOrders(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const statusCounts = useMemo(
    () =>
      orders.reduce(
        (counts, order) => ({
          ...counts,
          [order.status_pesanan]: (counts[order.status_pesanan] || 0) + 1,
        }),
        {
          menunggu_konfirmasi: 0,
          diproses: 0,
          selesai: 0,
          dibatalkan: 0,
        },
      ),
    [orders],
  );

  const replaceOrder = (updatedOrder) => {
    setOrders((current) =>
      current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
    );
  };

  const handleStatus = async (order, nextStatus) => {
    if (nextStatus === "dibatalkan" && !window.confirm("Batalkan pesanan ini?")) {
      return;
    }

    setUpdatingId(order.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await updateAdminOrderStatus(order.id, nextStatus);
      replaceOrder(response.data);
      setSuccessMessage(response.message || "Status pesanan berhasil diperbarui.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePayment = async (order) => {
    setUpdatingId(order.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await updateAdminOrderPayment(order.id, "lunas");
      replaceOrder(response.data);
      setSuccessMessage(response.message || "Pembayaran ditandai lunas.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReceipt = async (order) => {
    setUpdatingId(order.id);

    try {
      const response = await getAdminOrderReceipt(order.id);
      setReceipt(response.data);
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
          <h1 className="text-3xl font-black text-slate-950">Kelola Pesanan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pesanan QR masuk ke sini, lalu admin bisa accept, ready, batal, dan cetak nota.
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="h-11 rounded-lg bg-slate-900 px-5 text-sm font-bold text-white hover:bg-slate-700"
        >
          Refresh
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Pending" value={statusCounts.menunggu_konfirmasi} className="border-blue-500" />
        <StatCard label="Processing" value={statusCounts.diproses} className="border-amber-500" />
        <StatCard label="Ready" value={statusCounts.selesai} className="border-emerald-500" />
        <StatCard label="Cancelled" value={statusCounts.dibatalkan} className="border-rose-500" />
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
          Memuat pesanan...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-sm font-semibold text-slate-500">
          Belum ada pesanan.
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {orders.map((order) => {
            const cfg = statusConfig[order.status_pesanan] || statusConfig.menunggu_konfirmasi;
            const isUpdating = updatingId === order.id;
            const items = order.detail_pesanans || [];

            return (
              <article key={order.id} className={`rounded-lg border-t-4 bg-white shadow-sm ${cfg.border}`}>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5">
                  <div>
                    <p className="text-lg font-black text-slate-950">
                      Pesanan #{String(order.id).padStart(4, "0")}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.meja?.nomor_meja || "Takeaway"} - {formatDateTime(order.tgl_pesanan)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {order.status_pembayaran === "lunas" ? "Lunas" : "Belum bayar"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-800">
                          {item.produk?.nama_produk || "Menu"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty {item.jumlah_item} {item.opsi_varian ? `- ${item.opsi_varian}` : ""}
                        </p>
                      </div>
                      <p className="font-black">{formatRupiah(item.subtotal)}</p>
                    </div>
                  ))}

                  {order.catatan_pesanan && (
                    <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      Catatan: {order.catatan_pesanan}
                    </div>
                  )}

                  <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-black">
                    <span>Total</span>
                    <span>{formatRupiah(order.total_harga)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 bg-slate-50 p-4">
                  {order.status_pesanan === "menunggu_konfirmasi" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatus(order, "diproses")}
                      className="h-10 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      Accept Order
                    </button>
                  )}

                  {order.status_pesanan === "diproses" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatus(order, "selesai")}
                      className="h-10 rounded-lg bg-amber-500 px-4 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-60"
                    >
                      Mark as Ready
                    </button>
                  )}

                  {order.status_pesanan !== "dibatalkan" && order.status_pesanan !== "selesai" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatus(order, "dibatalkan")}
                      className="h-10 rounded-lg bg-rose-50 px-4 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                    >
                      Batal
                    </button>
                  )}

                  {order.status_pesanan === "selesai" && order.status_pembayaran !== "lunas" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handlePayment(order)}
                      className="h-10 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Tandai Lunas
                    </button>
                  )}

                  {(order.status_pesanan === "selesai" || order.status_pesanan === "dibatalkan") && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleReceipt(order)}
                      className="h-10 rounded-lg bg-white px-4 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-60"
                    >
                      Print Receipt
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </section>
  );
}
