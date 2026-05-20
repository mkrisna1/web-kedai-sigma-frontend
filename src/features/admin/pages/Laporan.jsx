import { useEffect, useMemo, useState } from "react";
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

const LOG_TRANSACTION_PREVIEW_COUNT = 6;

const formatRupiah = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const formatOrderId = (id) => `#TRX-${String(id || 0).padStart(4, "0")}`;

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

const exportPeriodLabels = {
  day: "Harian",
  month: "Bulanan",
  year: "Tahunan",
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
    setViewDate((currentDate) => {
      return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + offset,
        1,
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/20 p-6">
      <div className="flex h-[495px] w-full max-w-96 animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] flex-col items-start overflow-hidden rounded-lg bg-white shadow-[0_10px_30px_rgba(25,28,30,0.12)]">
        <div className="flex h-[427px] w-full flex-col items-start gap-8 p-6">
          <div className="flex h-7 w-full items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="flex h-7 w-[23.4px] items-center justify-center rounded-xl text-[#434655] transition hover:bg-[#F2F4F6]"
              aria-label="Bulan sebelumnya"
            >
              {"<"}
            </button>

            <h2 className="flex h-7 items-center text-lg font-bold leading-7 tracking-[-0.45px] text-[#191C1E]">
              {monthNames[month]} {year}
            </h2>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="flex h-7 w-[23.4px] items-center justify-center rounded-xl text-[#434655] transition hover:bg-[#F2F4F6]"
              aria-label="Bulan berikutnya"
            >
              {">"}
            </button>
          </div>

          <div className="h-[319px] w-full">
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
  exportPeriod,
  selectedDate,
  totalRows,
  onClose,
  onPeriodChange,
  onPrint,
}) {
  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <section className="w-full max-w-[520px] animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/25">
        <header className="border-b border-[#E6E8EA] px-6 py-5">
          <h2 className="text-xl font-extrabold text-[#191C1E]">
            Ekspor Data Transaksi
          </h2>
          <p className="mt-1 text-xs font-semibold text-[#434655]">
            {formatCalendarLabel(selectedDate)}
          </p>
        </header>

        <div className="grid gap-5 p-6">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-[#434655]">
              Periode Ekspor
            </span>
            <select
              value={exportPeriod}
              onChange={(event) => onPeriodChange(event.target.value)}
              className="h-11 rounded-lg border border-[#C3C6D7] bg-white px-3 text-sm font-semibold text-[#191C1E] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            >
              <option value="day">Harian</option>
              <option value="month">Bulanan</option>
              <option value="year">Tahunan</option>
            </select>
          </label>

          <div className="rounded-xl bg-[#F2F4F6] p-4">
            <p className="text-xs font-bold uppercase text-[#434655]">
              Data Siap Ekspor
            </p>
            <p className="mt-2 text-2xl font-black text-[#191C1E]">
              {totalRows.toLocaleString("id-ID")} transaksi
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
  const [selectedDate, setSelectedDate] = useState(formatDateValue(getIndonesiaToday()));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportPeriod, setExportPeriod] = useState("day");
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminReport({ date: selectedDate, export_period: exportPeriod })
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
  }, [exportPeriod, selectedDate]);

  useEffect(() => {
    setShowAllTransactions(false);
  }, [selectedDate]);

  const averageOrder =
    Number(report.total_order) > 0
      ? Number(report.total_penjualan || 0) / Number(report.total_order)
      : 0;
  const reportYear = Number(report.analytics_year) || parseDateValue(selectedDate).getFullYear();
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
  const visibleTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, LOG_TRANSACTION_PREVIEW_COUNT);
  const hasHiddenTransactions = transactions.length > LOG_TRANSACTION_PREVIEW_COUNT;
  const exportTransactions = (report.export_transaksi || [])
    .filter((item) => ["diproses", "selesai"].includes(item.status_pesanan))
    .map(mapTransaction);
  const exportLabel = exportPeriodLabels[exportPeriod] || "Harian";

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
      window.alert("Pop up export diblokir browser. Izinkan pop up lalu coba lagi.");
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
              <div>Tanggal acuan: ${escapeHtml(formatCalendarLabel(selectedDate))}</div>
            </div>
            <section class="summary">
              <div class="box"><span>Total Transaksi</span><strong>${escapeHtml(exportTransactions.length.toLocaleString("id-ID"))}</strong></div>
              <div class="box"><span>Total Penjualan Tahun</span><strong>${escapeHtml(formatRupiah(report.total_penjualan))}</strong></div>
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
            Ringkasan menu terjual tahun {reportYear}, log transaksi per tanggal
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
                Menampilkan {visibleTransactions.length.toLocaleString("id-ID")} dari {transactions.length.toLocaleString("id-ID")} transaksi pada {formatCalendarLabel(selectedDate)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className="rounded-lg bg-[#E6E8EA] px-4 py-2 text-xs font-bold text-[#191C1E] transition hover:bg-[#DDE1E6]"
              >
                {formatCalendarLabel(selectedDate)}
              </button>
              {hasHiddenTransactions && (
                <button
                  type="button"
                  onClick={() => setShowAllTransactions((value) => !value)}
                  className="rounded-lg bg-[#E6E8EA] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#191C1E] transition hover:bg-[#DDE1E6]"
                >
                  {showAllTransactions ? "Tampilkan 6" : "Lihat Semua"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
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
                      Belum ada transaksi pada tanggal ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {hasHiddenTransactions && (
            <div className="flex justify-center border-t border-slate-100 bg-white px-6 py-5">
              <button
                type="button"
                onClick={() => setShowAllTransactions((value) => !value)}
                className="rounded-lg bg-[#E6E8EA] px-6 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#191C1E] transition hover:bg-[#DDE1E6]"
              >
                {showAllTransactions ? "Tampilkan 6" : "Lihat Semua"}
              </button>
            </div>
          )}
        </article>
      </div>

      {isCalendarOpen && (
        <CalendarPopup
          value={selectedDate}
          onClose={() => setIsCalendarOpen(false)}
          onSelect={(value) => {
            setSelectedDate(value);
            setIsCalendarOpen(false);
          }}
        />
      )}
      {isExportModalOpen && (
        <ExportDataModal
          exportPeriod={exportPeriod}
          selectedDate={selectedDate}
          totalRows={exportTransactions.length}
          onClose={() => setIsExportModalOpen(false)}
          onPeriodChange={setExportPeriod}
          onPrint={printExportData}
        />
      )}
    </section>
  );
}
