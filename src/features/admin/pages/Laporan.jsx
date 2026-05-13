import { useEffect, useMemo, useState } from "react";
import { getAdminReport } from "../../../services/api";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "-";

const statusLabel = {
  menunggu_konfirmasi: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

const periodLabel = {
  day: "Per Hari",
  week: "Per Minggu",
  month: "Per Bulan",
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });

export default function Laporan() {
  const [period, setPeriod] = useState("day");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReport = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAdminReport({ period, date });
      setReport(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [period, date]);

  const totalItemsSold = useMemo(
    () =>
      (report?.best_seller_menu || []).reduce(
        (total, item) => total + Number(item.jumlah || 0),
        0,
      ),
    [report],
  );

  const topSignatureMenu = report?.best_seller_menu?.[0]?.produk?.nama_produk || "-";
  const maxCategory = Math.max(
    ...(report?.kategori_populer || []).map((item) => Number(item.jumlah || 0)),
    1,
  );
  const maxBusyHour = Math.max(
    ...(report?.jam_sibuk || []).map((item) => Number(item.total || 0)),
    1,
  );

  const exportTransactionLog = () => {
    const transactions = report?.transaksi || [];
    const printWindow = window.open("", "_blank", "width=1100,height=720");

    if (!printWindow) {
      setErrorMessage("Popup export diblokir browser. Izinkan popup lalu coba lagi.");
      return;
    }

    const rows =
      transactions.length === 0
        ? `<tr><td colspan="6" class="empty">Belum ada transaksi dalam periode ini.</td></tr>`
        : transactions
            .map((order) => {
              const menuText =
                (order.detail_pesanans || [])
                  .map(
                    (item) =>
                      `${item.jumlah_item}x ${item.produk?.nama_produk || "Menu"}`,
                  )
                  .join(", ") || "-";
              const tipe =
                order.tipe_pesanan === "dine_in"
                  ? `Dine in ${order.meja?.nomor_meja || ""}`.trim()
                  : "Takeaway";

              return `
                <tr>
                  <td>#${String(order.id).padStart(4, "0")}</td>
                  <td>${escapeHtml(formatDate(order.tgl_pesanan))}</td>
                  <td>${escapeHtml(menuText)}</td>
                  <td>${escapeHtml(tipe)}</td>
                  <td class="right">${escapeHtml(formatRupiah(order.total_harga))}</td>
                  <td>${escapeHtml(statusLabel[order.status_pesanan] || order.status_pesanan)}</td>
                </tr>
              `;
            })
            .join("");

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Log Transaksi Kedai Sigma</title>
          <style>
            body {
              color: #0f172a;
              font-family: Arial, sans-serif;
              margin: 32px;
            }
            h1 {
              font-size: 22px;
              margin: 0 0 8px;
            }
            p {
              color: #475569;
              font-size: 13px;
              margin: 0 0 24px;
            }
            table {
              border-collapse: collapse;
              font-size: 12px;
              width: 100%;
            }
            th,
            td {
              border: 1px solid #cbd5e1;
              padding: 10px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background: #f1f5f9;
              font-size: 11px;
              text-transform: uppercase;
            }
            .right {
              text-align: right;
            }
            .empty {
              color: #64748b;
              padding: 28px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Log Transaksi Kedai Sigma</h1>
          <p>${escapeHtml(periodLabel[period])} | ${escapeHtml(formatDate(report?.start))} - ${escapeHtml(formatDate(report?.end))}</p>
          <table>
            <thead>
              <tr>
                <th>ID Order</th>
                <th>Tanggal</th>
                <th>Menu</th>
                <th>Tipe</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Kelola Laporan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Filter laporan penjualan per hari, minggu, atau bulan.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-blue-500"
          >
            <option value="day">Per Hari</option>
            <option value="week">Per Minggu</option>
            <option value="month">Per Bulan</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={exportTransactionLog}
            className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
          >
            Ekspor PDF
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg bg-white p-8 text-sm font-semibold text-slate-500">
          Memuat laporan...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <article className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                Total Penjualan
              </p>
              <p className="mt-2 text-3xl font-black">{formatRupiah(report?.total_penjualan)}</p>
            </article>
            <article className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                Transaksi
              </p>
              <p className="mt-2 text-3xl font-black">{report?.total_order || 0}</p>
            </article>
            <article className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                Item Terjual
              </p>
              <p className="mt-2 text-3xl font-black">{totalItemsSold}</p>
            </article>
            <article className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                Makanan Khas Kedai
              </p>
              <p className="mt-2 truncate text-2xl font-black">{topSignatureMenu}</p>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <article className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Best Seller Menu</h2>
              <div className="mt-5 space-y-3">
                {(report?.best_seller_menu || []).length === 0 ? (
                  <p className="text-sm font-semibold text-slate-500">Belum ada data.</p>
                ) : (
                  report.best_seller_menu.map((item, index) => (
                    <div key={item.produk?.id || index} className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black text-slate-950">
                          {item.produk?.nama_produk || "Menu"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.jumlah} item terjual
                        </p>
                      </div>
                      <p className="font-black text-blue-700">{formatRupiah(item.subtotal)}</p>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Kategori Populer</h2>
              <div className="mt-5 space-y-5">
                {(report?.kategori_populer || []).length === 0 ? (
                  <p className="text-sm font-semibold text-slate-500">Belum ada data.</p>
                ) : (
                  report.kategori_populer.map((item) => (
                    <div key={item.kategori}>
                      <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                        <span>{item.kategori}</span>
                        <span>{item.jumlah}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-600"
                          style={{ width: `${(item.jumlah / maxCategory) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
            <article className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Jam Sibuk</h2>
              <div className="mt-5 space-y-3">
                {(report?.jam_sibuk || []).length === 0 ? (
                  <p className="text-sm font-semibold text-slate-500">Belum ada data.</p>
                ) : (
                  report.jam_sibuk.map((item) => (
                    <div key={item.jam} className="flex items-center gap-3">
                      <span className="w-14 text-xs font-bold text-slate-500">{item.jam}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${(item.total / maxBusyHour) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-bold">{item.total}</span>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-black text-slate-950">Log Transaksi</h2>
                <p className="text-sm text-slate-500">
                  Periode {formatDate(report?.start)} sampai {formatDate(report?.end)}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                    <tr>
                      <th className="px-6 py-4 text-left">ID Order</th>
                      <th className="px-6 py-4 text-left">Tanggal</th>
                      <th className="px-6 py-4 text-left">Menu</th>
                      <th className="px-6 py-4 text-left">Tipe</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(report?.transaksi || []).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                          Belum ada transaksi dalam periode ini.
                        </td>
                      </tr>
                    ) : (
                      report.transaksi.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-black text-blue-700">
                            #{String(order.id).padStart(4, "0")}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {formatDate(order.tgl_pesanan)}
                          </td>
                          <td className="px-6 py-4">
                            {(order.detail_pesanans || [])
                              .map((item) => `${item.jumlah_item}x ${item.produk?.nama_produk || "Menu"}`)
                              .join(", ") || "-"}
                          </td>
                          <td className="px-6 py-4">
                            {order.tipe_pesanan === "dine_in"
                              ? `Dine in ${order.meja?.nomor_meja || ""}`.trim()
                              : "Takeaway"}
                          </td>
                          <td className="px-6 py-4 text-right font-black">
                            {formatRupiah(order.total_harga)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                              {statusLabel[order.status_pesanan] || order.status_pesanan}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
}
