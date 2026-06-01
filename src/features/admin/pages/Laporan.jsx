import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getAdminReport } from "../../../services/api";

const emptyReport = {
  total_penjualan: 0,
  total_order: 0,
  analytics_year: new Date().getFullYear(),
  perubahan: {
    total_penjualan: 0,
    total_order: 0,
    rata_rata_order: 0,
  },
  best_seller_menu: [],
  kategori_populer: [],
  jam_sibuk: [],
  transaksi: [],
  export_transaksi: [],
  export_period: "day",
};

const formatRupiah = (value) => {
  const numValue = Number(value || 0);
  // Bulatkan ke kelipatan 1000 terdekat
  const rounded = Math.round(numValue / 1000) * 1000;
  return `Rp ${rounded.toLocaleString("id-ID")}`;
};

const formatOrderId = (id) => {
  const numericId = Number(id || 0);
  return `#TRX-${numericId > 9999 ? numericId : String(numericId).padStart(4, "0")}`;
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

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

const REPORT_DATE_SCOPE = "all";
const REPORT_DATE_LABEL = "Semua Waktu";
const INDONESIA_TIME_ZONE = "Asia/Jakarta";
const EXPORT_PERIOD_OPTIONS = [
  { value: "day", label: "Harian" },
  { value: "week", label: "Mingguan" },
  { value: "month", label: "Bulanan" },
  { value: "year", label: "Tahunan" },
  { value: "all", label: "Semua Waktu" },
];

const getIndonesiaTodayValue = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: INDONESIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const getPart = (type) => parts.find((part) => part.type === type)?.value || "";

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
};

const formatDateLabel = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const formatPercentChange = (value) => {
  const percent = Number(value) || 0;

  if (percent > 0) {
    return `+${percent}%`;
  }

  return `${percent}%`;
};

const mapTransaction = (order) => {
  const isPaid = order.status_pembayaran === "lunas" || order.status_pesanan === "selesai";

  return {
    id: formatOrderId(order.id),
    date: formatDate(order.tgl_pesanan || order.created_at),
    items:
      order.detail_pesanans
        ?.map((detail) => {
          const qty = Number(detail.jumlah_item) || 1;
          const name = detail.produk?.nama_produk || "Menu dihapus";

          return `${qty}x ${name}`;
        })
        .join(" ") || "-",
    type:
      order.tipe_pesanan === "dine_in"
        ? `Makan di Sini (${order.meja?.nomor_meja || "Meja -"})`
        : "Bawa Pulang",
    total: formatRupiah(order.total_harga),
    status: isPaid ? "Sudah Bayar" : "Belum Bayar",
    statusClass: isPaid
      ? "bg-green-50 text-[#006C49]"
      : "bg-amber-50 text-[#784B00]",
  };
};

const toneClasses = {
  blue: "bg-blue-50 text-[#004AC6]",
  green: "bg-green-50 text-[#006C49]",
  amber: "bg-amber-50 text-[#784B00]",
};

function MetricIcon({ type, className = "h-5 w-5" }) {
  const paths = {
    money: "M3 6h18v12H3V6Zm3 3a3 3 0 0 1 3-3H6v3Zm12 0V6h-3a3 3 0 0 1 3 3ZM6 15v3h3a3 3 0 0 1-3-3Zm12 0a3 3 0 0 1-3 3h3v-3Zm-6 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    receipt: "M6 2h12v20l-3-2-3 2-3-2-3 2V2Zm3 5v2h6V7H9Zm0 4v2h6v-2H9Zm0 4v2h4v-2H9Z",
    star: "m12 2 2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 16.81l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2Z",
    users: "M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 0a4 4 0 1 0-2.3-7.28A6 6 0 0 1 14 9c0 .7-.12 1.37-.35 2H16ZM8 13c-3.31 0-6 1.79-6 4v2h12v-2c0-2.21-2.69-4-6-4Zm8 0c-.47 0-.92.04-1.35.12A5.03 5.03 0 0 1 16 16.5V19h6v-2c0-2.21-2.69-4-6-4Z",
  };

  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
}

function ArrowIcon({ down = false }) {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
      <path
        d={down ? "m6 9 6 6 6-6" : "m6 15 6-6 6 6"}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({ stat }) {
  const isDown = stat.change.startsWith("-");

  return (
    <article className="rounded-lg bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`rounded p-2 ${toneClasses[stat.tone]}`}>
          <MetricIcon type={stat.icon} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${isDown ? "text-[#BA1A1A]" : "text-[#006C49]"}`}>
          <ArrowIcon down={isDown} />
          {stat.change}
        </div>
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.05em] text-[#434655]">
        {stat.label}
      </p>
      <p className="mt-1 text-2xl font-black text-[#191C1E]">{stat.value}</p>
    </article>
  );
}

function ExportDataModal({
  exportDate,
  exportPeriod,
  isLoading,
  totalRows,
  onDateChange,
  onClose,
  onPeriodChange,
  onPrint,
}) {
  const isAllTime = exportPeriod === REPORT_DATE_SCOPE;

  return (
      <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:p-6">
      <section className="max-h-[calc(100dvh-32px)] w-full max-w-[520px] animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] overflow-y-auto rounded-2xl bg-white shadow-2xl shadow-black/25">
        <header className="border-b border-[#E6E8EA] px-6 py-5">
          <h2 className="text-xl font-extrabold text-[#191C1E]">
            Ekspor Data Transaksi
          </h2>
          <p className="mt-1 text-xs font-semibold text-[#434655]">
            {isAllTime ? REPORT_DATE_LABEL : formatDateLabel(exportDate)}
          </p>
        </header>

        <div className="grid gap-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase text-[#434655]">
                Tanggal Acuan
              </span>
              <input
                type="date"
                value={exportDate}
                onChange={(event) => onDateChange(event.target.value)}
                disabled={isAllTime}
                className="h-11 rounded-lg border border-[#C3C6D7] bg-white px-3 text-sm font-semibold text-[#191C1E] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 disabled:bg-[#EEF0F3] disabled:text-[#8B8E99]"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase text-[#434655]">
                Periode
              </span>
              <select
                value={exportPeriod}
                onChange={(event) => onPeriodChange(event.target.value)}
                className="h-11 rounded-lg border border-[#C3C6D7] bg-white px-3 text-sm font-semibold text-[#191C1E] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
              >
                {EXPORT_PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="rounded-xl bg-[#F2F4F6] p-4">
            <p className="text-xs font-bold uppercase text-[#434655]">
              Data Siap Ekspor
            </p>
            <p className="mt-2 text-2xl font-black text-[#191C1E]">
              {isLoading ? "Memuat..." : `${totalRows.toLocaleString("id-ID")} transaksi`}
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
            type="button"
            onClick={onPrint}
            disabled={isLoading}
            className="h-11 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-6 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:brightness-105"
          >
            Cetak Ekspor
          </button>
        </footer>
      </section>
      </div>
  );
}

export default function Laporan() {
  const [report, setReport] = useState(emptyReport);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDate, setExportDate] = useState(getIndonesiaTodayValue);
  const [exportPeriod, setExportPeriod] = useState(REPORT_DATE_SCOPE);
  const [exportReport, setExportReport] = useState(emptyReport);
  const [isExportLoading, setIsExportLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminReport({ date: REPORT_DATE_SCOPE })
      .then((response) => {
        if (isMounted) {
          setReport({ ...emptyReport, ...(response.data || {}) });
        }
      })
      .catch(() => {
        if (isMounted) {
          setReport(emptyReport);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isExportModalOpen) {
      return undefined;
    }

    let isMounted = true;
    const requestParams =
      exportPeriod === REPORT_DATE_SCOPE
        ? { date: REPORT_DATE_SCOPE }
        : { date: exportDate, export_period: exportPeriod };

    getAdminReport(requestParams)
      .then((response) => {
        if (isMounted) {
          setExportReport({ ...emptyReport, ...(response.data || {}) });
        }
      })
      .catch(() => {
        if (isMounted) {
          setExportReport(emptyReport);
          toast.error("Data ekspor belum bisa dimuat.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsExportLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [exportDate, exportPeriod, isExportModalOpen]);

  const averageOrder =
    Number(report.total_order) > 0
      ? Number(report.total_penjualan || 0) / Number(report.total_order)
      : 0;
  const changes = { ...emptyReport.perubahan, ...(report.perubahan || {}) };
  const stats = [
    {
      label: "Total Penjualan",
      value: formatRupiah(report.total_penjualan),
      change: formatPercentChange(changes.total_penjualan),
      tone: "blue",
      icon: "money",
    },
    {
      label: "Transaksi",
      value: Number(report.total_order || 0).toLocaleString("id-ID"),
      change: formatPercentChange(changes.total_order),
      tone: "green",
      icon: "receipt",
    },
    {
      label: "Rata-rata Order",
      value: formatRupiah(averageOrder),
      change: formatPercentChange(changes.rata_rata_order),
      tone: "amber",
      icon: "star",
    },
  ];
  const bestSellers = useMemo(
    () =>
      (report.best_seller_menu || [])
        .filter((item) => item.produk?.nama_produk)
        .map((item) => ({
          name: item.produk.nama_produk,
          category: item.produk?.kategori?.nama_kategori || "Tanpa Kategori",
          quantity: Number(item.jumlah) || 0,
          revenue: formatRupiah(item.subtotal),
        })),
    [report.best_seller_menu],
  );
  const totalCategoryItems = (report.kategori_populer || []).reduce(
    (total, item) => total + (Number(item.jumlah) || 0),
    0,
  );
  const categories = (report.kategori_populer || []).map((item) => {
    const percent =
      totalCategoryItems === 0
        ? 0
        : Math.round(((Number(item.jumlah) || 0) / totalCategoryItems) * 100);

    return {
      label: item.kategori,
      value: `${Number(item.jumlah) || 0} terjual`,
      percent: `${percent}%`,
      width: `${percent}%`,
    };
  });
  const highestPeakHour = Math.max(
    ...(report.jam_sibuk || []).map((item) => Number(item.total) || 0),
    0,
  );
  const peakHours = (report.jam_sibuk || []).map((item, index) => ({
    time: item.jam,
    total: Number(item.total) || 0,
    width:
      highestPeakHour === 0
        ? "0%"
        : `${Math.max(((Number(item.total) || 0) / highestPeakHour) * 100, 8)}%`,
    color:
      index % 3 === 0
        ? "bg-blue-500"
        : index % 3 === 1
          ? "bg-blue-300"
          : "bg-blue-100",
  }));
  const transactions = (report.transaksi || [])
    .filter((item) => ["diproses", "selesai"].includes(item.status_pesanan))
    .map(mapTransaction);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const visibleTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getVisiblePages = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, '...', total];
    if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const exportSourceTransactions = (exportReport.export_transaksi || [])
    .filter((item) => ["diproses", "selesai"].includes(item.status_pesanan));
  const exportTransactions = exportSourceTransactions.map(mapTransaction);
  const exportTotalSales = exportSourceTransactions.reduce(
    (total, item) => total + (Number(item.total_harga) || 0),
    0,
  );
  const exportPeriodLabel =
    EXPORT_PERIOD_OPTIONS.find((option) => option.value === exportPeriod)?.label ||
    REPORT_DATE_LABEL;
  const exportLabel =
    exportPeriod === REPORT_DATE_SCOPE
      ? REPORT_DATE_LABEL
      : `${exportPeriodLabel} - ${formatDateLabel(exportDate)}`;

  const openExportModal = () => {
    setIsExportLoading(true);
    setIsExportModalOpen(true);
  };

  const handleExportDateChange = (value) => {
    if (value !== exportDate) {
      setIsExportLoading(true);
    }

    setExportDate(value);
  };

  const handleExportPeriodChange = (value) => {
    if (value !== exportPeriod) {
      setIsExportLoading(true);
    }

    setExportPeriod(value);
  };

  const printExportData = () => {
    const rows = exportTransactions
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.id)}</td>
            <td>${escapeHtml(item.date)}</td>
            <td>${escapeHtml(item.items)}</td>
            <td>${escapeHtml(item.type)}</td>
            <td class="right">${escapeHtml(item.total)}</td>
            <td class="center">${escapeHtml(item.status)}</td>
          </tr>
        `,
      )
      .join("");
    const printWindow = window.open("", "_blank", "width=960,height=720");

    if (!printWindow) {
      toast.error("Pop up export diblokir browser. Izinkan pop up lalu coba lagi.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <title>Ekspor ${escapeHtml(exportLabel)} Kedai Sigma</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; background: #f2f4f6; color: #191c1e; font-family: Arial, sans-serif; }
            main { max-width: 1040px; margin: 24px auto; background: #fff; padding: 28px; border-radius: 16px; box-shadow: 0 18px 46px rgba(15, 23, 42, 0.12); }
            h1 { margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px; }
            .meta { margin-top: 8px; color: #434655; font-size: 13px; line-height: 1.6; }
            .summary { display: flex; gap: 16px; margin: 22px 0; }
            .box { flex: 1; border: 1px solid #e6e8ea; border-radius: 12px; padding: 14px; }
            .box span { display: block; color: #434655; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .box strong { display: block; margin-top: 6px; font-size: 22px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #f2f4f6; color: #434655; text-align: left; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; padding: 12px; }
            td { border-bottom: 1px solid #eef0f3; padding: 12px; vertical-align: top; }
            .right { text-align: right; white-space: nowrap; font-weight: 800; }
            .center { text-align: center; white-space: nowrap; font-weight: 800; }
            @media print { body { background: #fff; } main { margin: 0; max-width: none; box-shadow: none; border-radius: 0; } }
          </style>
        </head>
        <body>
          <main>
            <h1>Kedai Sigma</h1>
            <div class="meta">
              <div>Ekspor ${escapeHtml(exportLabel)}</div>
              <div>Periode: ${escapeHtml(exportLabel)}</div>
            </div>
            <section class="summary">
              <div class="box"><span>Total Transaksi</span><strong>${escapeHtml(exportTransactions.length.toLocaleString("id-ID"))}</strong></div>
              <div class="box"><span>Total Penjualan ${escapeHtml(exportLabel)}</span><strong>${escapeHtml(formatRupiah(exportTotalSales))}</strong></div>
            </section>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Pesanan</th>
                  <th>Tipe</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows || `<tr><td colspan="6" class="center">Belum ada transaksi.</td></tr>`}
              </tbody>
            </table>
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
    <section className="flex w-full flex-col gap-6 bg-[#F7F9FB] font-['Inter',Arial,sans-serif] text-[#191C1E]">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.025em]">
            Kelola Laporan
          </h2>
          <p className="mt-1 text-sm font-medium text-[#434655]">
            Ringkasan transaksi semua waktu
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_288px]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Top 5 Best Seller</h3>
          <div className="mt-6 flex flex-col gap-4">
            {bestSellers.map((item, index) => (
              <div key={item.name} className="flex items-center gap-4 rounded-xl bg-[#F8FAFC] p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-black text-[#2563EB]">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#2563EB]">
                    {item.quantity} terjual
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    {item.revenue}
                  </p>
                </div>
              </div>
            ))}
            {bestSellers.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-[#F8FAFC] p-6 text-center text-sm font-semibold text-[#434655]">
                Belum ada menu terjual.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Kategori Menu Populer</h3>
          <div className="mt-6 flex flex-col gap-6">
            {categories.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-[0.05em]">
                  <span>{item.label}</span>
                  <span className="text-[#006C49]">{item.value}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#006C49] to-[#10B981]"
                    style={{ width: item.width }}
                  />
                </div>
                <p className="mt-1 text-right text-[10px] font-semibold text-[#434655]">
                  {item.percent} dari menu terjual
                </p>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm font-semibold text-[#434655]">
                Belum ada kategori populer.
              </p>
            )}
          </div>
          <div className="mt-10 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-xl font-black text-[#784B00]">
                1
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
                  Makanan khas sigma
                </p>
                <p className="text-sm font-extrabold">
                  {bestSellers[0]?.name || "-"}
                </p>
                {bestSellers[0] && (
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#784B00]">
                    {bestSellers[0].quantity} terjual
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[208px_1fr]">
        <article className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Jam Sibuk</h3>
          <p className="mt-4 text-xs leading-5 text-[#434655]">
            Berdasarkan jumlah pesanan yang masuk per jam.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {peakHours.map((item) => (
              <div key={item.time} className="flex items-center gap-3">
                <span className="w-12 text-right text-[10px] font-bold uppercase text-[#434655]">
                  {item.time}
                </span>
                <div className="h-4 flex-1 overflow-hidden rounded-md bg-[#F8FAFC]">
                  <div className={`h-full ${item.color}`} style={{ width: item.width }} />
                </div>
                <span className="w-14 text-right text-[10px] font-bold text-[#004AC6]">
                  {item.total} pesanan
                </span>
              </div>
            ))}
            {peakHours.length === 0 && (
              <p className="text-xs font-semibold text-[#434655]">
                Belum ada jam sibuk.
              </p>
            )}
          </div>
        </article>

        <article className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-6 md:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-bold">Log Transaksi</h3>
              <p className="text-xs font-medium text-[#434655]">
                Menampilkan {visibleTransactions.length.toLocaleString("id-ID")} dari {transactions.length.toLocaleString("id-ID")} transaksi keseluruhan
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openExportModal}
                className="rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-[0_10px_15px_-3px_rgba(0,74,198,0.2)] transition hover:brightness-105"
              >
                Ekspor Data
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-sm">
              <thead className="border-y border-slate-100 bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.1em] text-[#434655]">
                <tr>
                  <th className="px-8 py-4 text-left">ID</th>
                  <th className="px-4 py-4 text-left">Tanggal</th>
                  <th className="px-4 py-4 text-left">Pesanan</th>
                  <th className="px-4 py-4 text-left">Tipe</th>
                  <th className="px-4 py-4 text-right">Total</th>
                  <th className="px-8 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-8 py-4 font-bold">{item.id}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-[#434655]">{item.date}</td>
                    <td className="px-4 py-4">{item.items}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-[#434655]">{item.type}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-black">{item.total}</td>
                    <td className="whitespace-nowrap px-8 py-4 text-center">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-8 py-10 text-center text-sm font-semibold text-[#434655]">
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center border-t border-slate-100 bg-white px-6 py-5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C3C6D7] bg-white text-[#434655] transition hover:bg-[#F6F7FB] disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Sebelumnya"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                {getVisiblePages(currentPage, totalPages).map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 font-medium">...</span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition ${
                        page === currentPage
                          ? "bg-[#004AC6] text-white shadow-sm"
                          : "border border-[#C3C6D7] bg-white text-[#434655] hover:bg-[#F6F7FB]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C3C6D7] bg-white text-[#434655] transition hover:bg-[#F6F7FB] disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Berikutnya"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          )}
        </article>
      </div>

      {isExportModalOpen && (
        <ExportDataModal
          exportDate={exportDate}
          exportPeriod={exportPeriod}
          isLoading={isExportLoading}
          totalRows={exportTransactions.length}
          onDateChange={handleExportDateChange}
          onClose={() => setIsExportModalOpen(false)}
          onPeriodChange={handleExportPeriodChange}
          onPrint={printExportData}
        />
      )}
    </section>
  );
}
