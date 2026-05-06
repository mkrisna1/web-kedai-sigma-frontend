import { useState } from "react";

const reservations = [
  {
    id: "RSV-001",
    initials: "AR",
    name: "Ariel Pratama",
    phone: "+62 812-8888-2211",
    guests: "4 Person",
    date: "Apr 6, 2026",
    dateValue: "2026-04-06",
    time: "19:00 PM",
    status: "Pending",
  },
  {
    id: "RSV-002",
    initials: "NA",
    name: "Nadia Putri",
    phone: "+62 813-4477-9910",
    guests: "3 Person",
    date: "Apr 6, 2026",
    dateValue: "2026-04-06",
    time: "18:30 PM",
    status: "Confirmed",
  },
  {
    id: "RSV-003",
    initials: "BS",
    name: "Bima Santoso",
    phone: "+62 857-3312-0044",
    guests: "20 Person",
    date: "Apr 6, 2026",
    dateValue: "2026-04-06",
    time: "20:15 PM",
    status: "Cancelled",
  },
  {
    id: "RSV-004",
    initials: "KY",
    name: "Kyla Dewi",
    phone: "+62 821-7780-2219",
    guests: "2 Person",
    date: "Apr 6, 2026",
    dateValue: "2026-04-06",
    time: "12:00 PM",
    status: "Confirmed",
  },
];

const reservationPages = [0, 1, 2].map((pageIndex) =>
  reservations.map((item) => ({
    ...item,
    id: `${item.id}-P${pageIndex + 1}`,
  }))
);

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDateValue = (dateValue) => {
  if (!dateValue) {
    return new Date(2026, 3, 1);
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDateLabel = (dateValue) => {
  if (!dateValue) {
    return "Pilih tanggal";
  }

  const date = parseDateValue(dateValue);
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

function CalendarIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm12 8H5v10h14V10ZM5 8h14V6H5v2Z" />
    </svg>
  );
}

function UsersIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16 11a4 4 0 1 0-3.46-6A5.97 5.97 0 0 1 14 9c0 .73-.13 1.43-.37 2H16ZM8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.31 0-6 1.79-6 4v2h12v-2c0-2.21-2.69-4-6-4Zm8 0c-.45 0-.88.04-1.3.11.82.95 1.3 2.07 1.3 3.39V19h6v-2c0-2.21-2.69-4-6-4Z" />
    </svg>
  );
}

function DotsIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "h-3 w-2" }) {
  return (
    <svg viewBox="0 0 8 12" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.6 12 0.6 6 6.6 0 8 1.4 3.4 6 8 10.6 6.6 12Z" />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-3 w-2" }) {
  return (
    <svg viewBox="0 0 8 12" className={className} fill="currentColor" aria-hidden="true">
      <path d="M1.4 12 0 10.6 4.6 6 0 1.4 1.4 0 7.4 6 1.4 12Z" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M9.55 17.6 4.4 12.45 5.8 11.05 9.55 14.8 18.2 6.15 19.6 7.55 9.55 17.6Z" />
    </svg>
  );
}

function XIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.4 19 5 17.6 10.6 12 5 6.4 6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19Z" />
    </svg>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex min-w-[220px] flex-1 flex-col gap-2">
      <span className="px-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
        {label}
      </span>
      {children}
    </label>
  );
}

function CalendarPopup({ value, onClose, onSelect }) {
  const initialDate = parseDateValue(value);
  const [viewDate, setViewDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  const [draftDate, setDraftDate] = useState(value || formatDateValue(initialDate));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const todayValue = formatDateValue(new Date());
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
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
        1
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6">
      <div className="flex h-[495px] w-full max-w-96 flex-col items-start overflow-hidden rounded-lg bg-white shadow-[0_10px_30px_rgba(25,28,30,0.06)]">
        <div className="flex h-[427px] w-full flex-col items-start gap-8 p-6">
          <div className="flex h-7 w-full items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="flex h-7 w-[23.4px] items-center justify-center rounded-xl text-[#434655] transition hover:bg-[#F2F4F6]"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeftIcon className="h-3 w-[7.4px]" />
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
              <ChevronRightIcon className="h-3 w-[7.4px]" />
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
                    <span
                      className={`relative z-10 ${
                        isSelected ? "font-bold text-white" : ""
                      }`}
                    >
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
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReservasiAdmin() {
  const [pages, setPages] = useState(reservationPages);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const matchesFilters = (item) => {
    const matchesDate = selectedDate ? item.dateValue === selectedDate : true;
    const matchesStatus =
      selectedStatus === "Semua Status" ? true : item.status === selectedStatus;

    return matchesDate && matchesStatus;
  };

  const filteredPages = pages.map((pageItems) => pageItems.filter(matchesFilters));
  const currentReservations = filteredPages[currentPage] ?? [];
  const filteredTotal = filteredPages.reduce(
    (total, pageItems) => total + pageItems.length,
    0
  );
  const previousFilteredCount = filteredPages
    .slice(0, currentPage)
    .reduce((total, pageItems) => total + pageItems.length, 0);
  const firstShown =
    currentReservations.length === 0 ? 0 : previousFilteredCount + 1;
  const lastShown = previousFilteredCount + currentReservations.length;

  const updateReservationStatus = (reservationId, status) => {
    setPages((currentPages) =>
      currentPages.map((pageItems) =>
        pageItems.map((item) =>
          item.id === reservationId ? { ...item, status } : item
        )
      )
    );
  };

  const handleDateSelect = (dateValue) => {
    setSelectedDate(dateValue);
    setCurrentPage(0);
    setIsCalendarOpen(false);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(0);
  };

  return (
    <section className="flex w-full flex-col gap-8 bg-[#F7F9FB] font-['Inter',Arial,sans-serif] text-[#191C1E]">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-[0_10px_30px_rgba(25,28,30,0.04)] lg:flex-row lg:items-end">
          <Field label="Filter Tanggal">
            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="h-[43px] rounded border border-b-2 border-[#C3C6D7] bg-[#F2F4F6] px-4 text-sm text-[#191C1E] outline-none transition focus:border-blue-500"
            >
              <span className="flex items-center justify-between gap-3">
                {formatDateLabel(selectedDate)}
                <CalendarIcon className="h-4 w-4 text-[#434655]" />
              </span>
            </button>
          </Field>

          <Field label="Status Reservasi">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="h-[43px] rounded border border-b-2 border-[#C3C6D7] bg-[#F2F4F6] px-4 text-sm text-[#191C1E] outline-none transition focus:border-blue-500"
            >
              <option>Semua Status</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
          </Field>

          <button
            type="button"
            onClick={() => setCurrentPage(0)}
            className="h-10 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-8 text-sm font-semibold text-white shadow-[0_10px_15px_-3px_rgba(59,130,246,0.2)] transition hover:brightness-105"
          >
            Terapkan
          </button>
        </div>

        <aside className="relative min-h-[123px] overflow-hidden rounded-lg bg-[#2563EB] p-6 text-white shadow-[0_10px_30px_rgba(25,28,30,0.04)] lg:w-[222px]">
          <CalendarIcon className="absolute -right-2 bottom-2 h-20 w-20 text-white/20" />
          <p className="text-xs font-medium uppercase tracking-[0.05em] text-white/70">
            Total hari ini
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-[-0.025em]">
            {filteredTotal}
          </p>
        </aside>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(25,28,30,0.04)]">
        <div className="flex items-center justify-between border-b border-[#E6E8EA] p-6">
          <div>
            <h3 className="text-lg font-bold text-[#191C1E]">
              Reservasi yang masuk
            </h3>
            <p className="mt-1 text-sm text-[#434655]">
              Status booking meja secara real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded p-2 text-[#434655] transition hover:bg-slate-100">
              <DotsIcon />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[#F2F4F6]/50 text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
              <tr>
                <th className="px-6 py-4 text-left">Nama Pelanggan</th>
                <th className="px-6 py-4 text-left">Tamu</th>
                <th className="px-6 py-4 text-left">Tanggal</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8EA]">
              {currentReservations.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[#191C1E]">{item.name}</p>
                        <p className="text-[10px] text-[#434655]">{item.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium">{item.guests}</td>
                  <td className="px-6 py-5">
                    <p className="font-medium">{item.date}</p>
                    <p className="text-xs text-[#434655]">{item.time}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      {item.status === "Pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateReservationStatus(item.id, "Confirmed")}
                            className="rounded bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                          >
                            Terima
                          </button>
                          <button
                            type="button"
                            onClick={() => updateReservationStatus(item.id, "Cancelled")}
                            className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            Tolak
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            item.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                          disabled
                        >
                          {item.status === "Confirmed" ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <XIcon className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentReservations.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-[#434655]">
                    Tidak ada reservasi yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E6E8EA] bg-[#F2F4F6] p-6 text-xs font-medium text-[#434655] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {firstShown} to {lastShown} of {filteredTotal} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
              className="rounded border border-[#C3C6D7] px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            {pages.map((_, pageIndex) => (
              <button
                key={pageIndex}
                type="button"
                onClick={() => setCurrentPage(pageIndex)}
                className={`rounded px-3 py-1.5 ${
                  currentPage === pageIndex
                    ? "bg-[#004AC6] font-bold text-white shadow-sm"
                    : "border border-[#C3C6D7]"
                }`}
              >
                {pageIndex + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === pages.length - 1}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, pages.length - 1))
              }
              className="rounded border border-[#C3C6D7] px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isCalendarOpen && (
        <CalendarPopup
          value={selectedDate}
          onClose={() => setIsCalendarOpen(false)}
          onSelect={handleDateSelect}
        />
      )}
    </section>
  );
}
