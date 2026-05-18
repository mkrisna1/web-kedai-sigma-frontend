import { useEffect, useMemo, useState } from "react";
import { getAdminDashboard } from "../../../services/api";

const emptyDashboard = {
  pendapatan_harian: 0,
  pendapatan_kedai: 0,
  pendapatan_persen: 0,
  periode_pendapatan: "day",
  meja_terisi: 0,
  meja_sisa: 0,
  total_meja: 8,
  reservasi_belum_diproses: 0,
  transaksi_terakhir: [],
  grafik_jam_ramai: [],
};

const formatRupiah = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const formatPercentChange = (value) => {
  const percent = Number(value) || 0;

  if (percent > 0) {
    return `+${percent}%`;
  }

  return `${percent}%`;
};

const formatOrderId = (id) => `#ORD-${String(id || 0).padStart(3, "0")}`;

const formatTime = (value) => {
  if (!value) {
    return "00:00";
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
const periodOptions = [
  { value: "day", label: "Harian" },
  { value: "week", label: "Mingguan" },
  { value: "month", label: "Bulanan" },
  { value: "year", label: "Tahunan" },
];
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

const yearOptions = Array.from(
  { length: 7 },
  (_, index) => getIndonesiaToday().getFullYear() - 3 + index,
);

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

const getTableNumber = (value) =>
  String(value || "-")
    .replace(/^meja\s*/i, "")
    .trim() || "-";

const mapTransaction = (order) => ({
  id: formatOrderId(order.id),
  table: getTableNumber(order.meja?.nomor_meja),
  time: formatTime(order.tgl_pesanan || order.created_at),
  total: formatRupiah(order.total_harga),
});

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

const Dashboard = () => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [incomePeriod, setIncomePeriod] = useState("day");
  const [selectedDate, setSelectedDate] = useState(formatDateValue(getIndonesiaToday()));
  const [trafficMonth, setTrafficMonth] = useState(getIndonesiaToday().getMonth() + 1);
  const [trafficYear, setTrafficYear] = useState(getIndonesiaToday().getFullYear());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminDashboard({
      period: incomePeriod,
      date: selectedDate,
      traffic_month: trafficMonth,
      traffic_year: trafficYear,
    })
      .then((response) => {
        if (isMounted) {
          setDashboard({ ...emptyDashboard, ...(response.data || {}) });
        }
      })
      .catch(() => {
        if (isMounted) {
          setDashboard(emptyDashboard);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [incomePeriod, selectedDate, trafficMonth, trafficYear]);

  const allTransactions = useMemo(
    () => (dashboard.transaksi_terakhir || []).map(mapTransaction),
    [dashboard.transaksi_terakhir],
  );
  const transactions = allTransactions.slice(0, 4);
  const visibleTransactions = showAllTransactions
    ? allTransactions
    : transactions;
  const trafficData = dashboard.grafik_jam_ramai || [];
  const totalTables = Number(dashboard.total_meja) || 0;
  const occupiedTables = Number(dashboard.meja_terisi) || 0;
  const remainingTables =
    dashboard.meja_sisa !== undefined
      ? Number(dashboard.meja_sisa) || 0
      : Math.max(totalTables - occupiedTables, 0);
  const incomeValue = dashboard.pendapatan_kedai ?? dashboard.pendapatan_harian;
  const incomePercent = Number(dashboard.pendapatan_persen) || 0;
  const incomePeriodLabel =
    periodOptions.find((option) => option.value === incomePeriod)?.label || "Harian";
  const highestTraffic = Math.max(...trafficData.map((item) => Number(item.total) || 0), 0);
  const monthlyTrafficTotal = trafficData.reduce(
    (total, item) => total + (Number(item.total) || 0),
    0,
  );
  const busiestDay = trafficData.reduce(
    (peak, item) => ((Number(item.total) || 0) > (Number(peak?.total) || 0) ? item : peak),
    null,
  );
  const trafficBars = trafficData.map((item) => ({
    ...item,
    height:
      highestTraffic === 0
        ? "0%"
        : `${Math.max(((Number(item.total) || 0) / highestTraffic) * 100, 8)}%`,
    color: item.tanggal === busiestDay?.tanggal ? "bg-[#10B981]" : "bg-[#2563EB]",
  }));

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-10 font-['Inter',Arial,sans-serif]">
      <div className="mx-auto max-w-[1280px] space-y-10">
        <div className="grid grid-cols-3 gap-8">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#EFF6FF]">
                <i className="fa-solid fa-wallet text-4xl text-[#2563EB]" />
              </div>
              <div
                className={`flex items-center gap-2 text-lg font-semibold ${
                  incomePercent < 0 ? "text-[#BA1A1A]" : "text-[#006C49]"
                }`}
              >
                <i
                  className={`fa-solid ${
                    incomePercent < 0 ? "fa-arrow-trend-down" : "fa-arrow-trend-up"
                  }`}
                />
                <span>{formatPercentChange(incomePercent)}</span>
              </div>
            </div>
            <p className="mt-12 text-sm font-semibold uppercase tracking-normal text-[#434655]">
              Pendapatan Kedai
            </p>
            <p className="mt-2 text-5xl font-bold leading-tight text-[#191C1E]">
              {formatRupiah(incomeValue)}
            </p>
            <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
              <select
                value={incomePeriod}
                onChange={(event) => setIncomePeriod(event.target.value)}
                className="h-10 rounded-lg border border-[#E6E8EA] bg-white px-3 text-sm font-bold text-[#191C1E] outline-none focus:border-[#2563EB]"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className="h-10 rounded-lg bg-[#E6E8EA] px-4 text-sm font-bold text-[#191C1E] transition hover:bg-[#DBE1FF]"
              >
                {formatCalendarLabel(selectedDate)}
              </button>
            </div>
            <p className="mt-3 text-xs font-semibold text-[#434655]">
              Periode {incomePeriodLabel.toLowerCase()}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F0FDF4]">
                <i className="fa-solid fa-chair text-4xl text-[#16A34A]" />
              </div>
            </div>
            <p className="mt-12 text-sm font-semibold uppercase tracking-normal text-[#434655]">
              Terisi / Sisa Meja
            </p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-6xl font-bold leading-none text-[#191C1E]">
                {occupiedTables}
              </span>
              <span className="text-3xl text-gray-500">
                /{remainingTables}
              </span>
            </div>
            <p className="mt-3 text-xs font-semibold text-[#434655]">
              Total aktif {totalTables} meja
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F0FFAD]">
                <i className="fa-solid fa-clock text-3xl text-gray-700" />
              </div>
              <div className="rounded-full bg-[#BA1A1A] px-4 py-1.5 text-base font-bold text-white">
                {dashboard.reservasi_belum_diproses || 0}
              </div>
            </div>
            <p className="mt-12 text-sm font-semibold uppercase tracking-normal text-[#434655]">
              Reservasi Belum Diproses
            </p>
            <p className="mt-2 text-6xl font-bold leading-none text-[#BA1A1A]">
              {dashboard.reservasi_belum_diproses || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-8">
          <div className="col-span-5 rounded-2xl bg-white p-10 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-[#191C1E]">
                  Transaksi Terakhir
                </h3>
                <p className="mt-1 text-lg text-[#434655]">
                  Transaksi hari ini
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllTransactions((current) => !current)}
                disabled={allTransactions.length <= transactions.length}
                className="group flex items-center gap-3 rounded-xl bg-[#2563EB] px-8 py-3 text-lg font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                aria-expanded={showAllTransactions}
              >
                <span>{showAllTransactions ? "Sembunyikan" : "Lihat Semua"}</span>
                <span
                  className={`text-base leading-none transition-transform duration-300 ${
                    showAllTransactions ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  v
                </span>
              </button>
            </div>

            <div
              className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showAllTransactions ? "max-h-[680px]" : "max-h-[372px]"
              }`}
            >
              <table className="w-full text-lg">
                <thead>
                  <tr className="border-b text-sm uppercase tracking-normal text-[#434655]">
                    <th className="pb-5 text-left">ID Pesanan</th>
                    <th className="pb-5 text-left">Meja</th>
                    <th className="pb-5 text-left">Waktu</th>
                    <th className="pb-5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleTransactions.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-gray-50 ${
                        showAllTransactions && index >= transactions.length
                          ? "animate-[dashboard-row-in_320ms_ease-out_both]"
                          : ""
                      }`}
                      style={{
                        animationDelay:
                          showAllTransactions && index >= transactions.length
                            ? `${(index - transactions.length) * 55}ms`
                            : "0ms",
                      }}
                    >
                      <td className="py-6 font-medium text-[#2563EB]">
                        {item.id}
                      </td>
                      <td className="py-6 text-[#191C1E]">{item.table}</td>
                      <td className="py-6 text-gray-600">{item.time}</td>
                      <td className="py-6 text-right font-bold text-[#191C1E]">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                  {visibleTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-12 text-center text-base font-semibold text-[#434655]"
                      >
                        Belum ada transaksi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-2 flex self-start flex-col rounded-2xl bg-white p-10 shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#191C1E]">
                  Trafik Puncak Bulanan
                </h3>
                <p className="mt-1 text-base text-gray-500">
                  Total pesanan per hari dalam satu bulan
                </p>
              </div>
              <div className="grid grid-cols-[1fr_96px] gap-3">
                <select
                  value={trafficMonth}
                  onChange={(event) => setTrafficMonth(Number(event.target.value))}
                  className="h-10 rounded-lg border border-[#E6E8EA] bg-white px-3 text-sm font-bold text-[#191C1E] outline-none focus:border-[#2563EB]"
                >
                  {monthNames.map((monthName, index) => (
                    <option key={monthName} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </select>
                <select
                  value={trafficYear}
                  onChange={(event) => setTrafficYear(Number(event.target.value))}
                  className="h-10 rounded-lg border border-[#E6E8EA] bg-white px-3 text-sm font-bold text-[#191C1E] outline-none focus:border-[#2563EB]"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative mt-10 flex h-72 shrink-0 items-end gap-1 overflow-hidden border-b border-l border-gray-200 px-1">
              {trafficBars.map((item, index) => (
                <div
                  key={item.tanggal || index}
                  className={`min-w-0 flex-1 rounded-t ${item.color}`}
                  style={{ height: item.height }}
                  title={`${item.label}: ${item.total} pesanan`}
                />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-[#94A3B8]">
              {trafficBars
                .filter((item) => item.hari === 1 || item.hari % 5 === 0)
                .map((item) => (
                  <span key={item.tanggal}>{item.hari}</span>
                ))}
            </div>

            <div className="mt-8 space-y-4 text-base">
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-[#2563EB]" />
                  <span>Total bulan ini</span>
                </div>
                <span className="font-bold">{monthlyTrafficTotal} Pesanan</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-500">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-[#10B981]" />
                  <span>Puncak</span>
                </div>
                <span>
                  {busiestDay?.total ? `${busiestDay.label} (${busiestDay.total})` : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default Dashboard;
