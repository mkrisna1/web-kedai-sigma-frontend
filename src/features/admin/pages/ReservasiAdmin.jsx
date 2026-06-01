import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ViewportPortal from "../../../components/common/ViewportPortal";
import {
  deleteAdminReservation,
  getAdminReservations,
  getAdminTables,
  updateAdminReservationStatus,
} from "../../../services/api";

const emptyReservationPages = [[]];
const RESERVATION_REFRESH_MS = 8000;

const statusStyles = {
  Menunggu: "bg-yellow-100 text-yellow-700",
  Dikonfirmasi: "bg-green-100 text-green-700",
  Selesai: "bg-blue-100 text-blue-700",
  Dibatalkan: "bg-red-100 text-red-700",
};

const uiStatusByApiStatus = {
  menunggu_konfirmasi: "Menunggu",
  dikonfirmasi: "Dikonfirmasi",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

const apiStatusByUiStatus = {
  Menunggu: "menunggu_konfirmasi",
  Dikonfirmasi: "dikonfirmasi",
  Selesai: "selesai",
  Dibatalkan: "dibatalkan",
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

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDateValue = (dateValue) => {
  if (!dateValue) {
    return getIndonesiaToday();
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDateLabel = (dateValue) => {
  if (!dateValue) {
    return "Pilih tanggal";
  }

  const date = parseDateValue(dateValue);
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const getInitials = (name) =>
  String(name || "-")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const formatTimeLabel = (timeValue) => {
  if (!timeValue) {
    return "-";
  }

  return String(timeValue).slice(0, 5);
};

const mapReservationFromApi = (item) => ({
  rawId: item.id,
  id: `RSV-${String(item.id || 0).padStart(3, "0")}`,
  initials: getInitials(item.nama_reservasi),
  name: item.nama_reservasi || "-",
  phone: item.no_hp || "-",
  guests: `${item.jml_orang || 0} Orang`,
  note: item.catatan_reservasi || "-",
  date: formatDateLabel(item.tgl_reservasi),
  dateValue: item.tgl_reservasi || "",
  time: formatTimeLabel(item.jam_reservasi),
  tableId: item.meja?.id ?? item.meja?.id_meja ?? item.id_meja,
  table: item.meja?.nomor_meja || "Meja belum dipilih",
  tableCapacity: Number(item.meja?.capacity) || 0,
  status: uiStatusByApiStatus[item.status_reservasi] || "Menunggu",
});

const mapTableOptionFromApi = (item) => ({
  id: item.id ?? item.id_meja,
  label: item.nomor_meja || `Meja ${item.id ?? item.id_meja}`,
  capacity: Number(item.capacity) || 0,
  status: item.status_meja,
});

const chunkReservations = (items, size = 8) => {
  if (!items.length) {
    return emptyReservationPages;
  }

  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
};

function CalendarIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm12 8H5v10h14V10ZM5 8h14V6H5v2Z" />
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

function XIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.4 19 5 17.6 10.6 12 5 6.4 6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19Z" />
    </svg>
  );
}

function TrashIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M9 3h6l1 2h5v2H3V5h5l1-2Zm-3 6h12l-1 12H7L6 9Zm3 2v8h2v-8H9Zm4 0v8h2v-8h-2Z" />
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
  const indonesiaTodayValue = formatDateValue(getIndonesiaToday());
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
    <ViewportPortal>
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/20 p-4 sm:p-6">
      <div className="flex max-h-[calc(100dvh-32px)] h-[495px] w-full max-w-96 animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] flex-col items-start overflow-y-auto rounded-lg bg-white shadow-[0_10px_30px_rgba(25,28,30,0.06)]">
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
                const isToday = dateItem.value === indonesiaTodayValue;

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
            Pilih
          </button>
        </div>
      </div>
    </div>
    </ViewportPortal>
  );
}

function ConfirmActionModal({ action, item, onCancel, onConfirm }) {
  const isDelete = action === "delete";
  const isReject = action === "cancel" && item?.status === "Menunggu";
  const title = isDelete ? "Konfirmasi Hapus" : isReject ? "Konfirmasi Tolak" : "Konfirmasi Batalkan";
  const body = isDelete
    ? `Apakah Anda yakin ingin menghapus reservasi "${item?.name || "ini"}"? Tindakan ini tidak dapat dibatalkan.`
    : isReject
      ? `Apakah Anda yakin ingin menolak reservasi "${item?.name || "ini"}"? Statusnya akan menjadi dibatalkan.`
      : `Apakah Anda yakin ingin membatalkan reservasi "${item?.name || "ini"}"? Meja akan dilepas jika tidak sedang dipakai.`;
  const confirmLabel = isDelete ? "Hapus" : isReject ? "Tolak" : "Batalkan";

  return (
    <ViewportPortal>
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative box-border flex w-full max-w-96 animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] flex-col items-start rounded-2xl border border-[#C3C6D7]/10 bg-white shadow-2xl shadow-black/25">
        <div className="flex w-full flex-col items-start gap-4 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BA1A1A]/10 text-[#BA1A1A]">
            {isDelete ? (
              <TrashIcon className="h-[23.75px] w-[27.5px]" />
            ) : (
              <XIcon className="h-[23.75px] w-[27.5px]" />
            )}
          </div>

          <h3 className="w-full break-words text-xl font-bold leading-7 tracking-[-0.5px] text-[#191C1E] [overflow-wrap:anywhere]">
            {title}
          </h3>

          <p className="w-full break-words text-sm font-normal leading-[23px] text-[#434655] [overflow-wrap:anywhere]">
            {body}
          </p>

          <div className="grid w-full grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-11 items-center justify-center rounded-lg bg-[#E6E8EA] text-sm font-bold leading-5 tracking-[0.35px] text-[#191C1E] transition hover:brightness-95"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-11 items-center justify-center rounded-lg bg-[#BA1A1A] text-sm font-bold leading-5 tracking-[0.35px] text-white shadow-[0_10px_15px_-3px_rgba(186,26,26,0.2),0_4px_6px_-4px_rgba(186,26,26,0.2)] transition hover:brightness-105"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
    </ViewportPortal>
  );
}

export default function ReservasiAdmin() {
  const [pages, setPages] = useState(emptyReservationPages);
  const [tableOptions, setTableOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const getVisiblePages = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, '...', total];
    if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const setReservationItems = (items) => {
    const nextPages = chunkReservations(items);

    setPages(nextPages);
    setCurrentPage((page) => Math.min(page, nextPages.length - 1));
  };

  const loadReservations = useCallback(async (silent = false) => {
    try {
      const result = await getAdminReservations({
        ...(selectedDate ? { date: selectedDate } : {}),
        ...(selectedStatus !== "Semua Status"
          ? { status: apiStatusByUiStatus[selectedStatus] }
          : {}),
      });
      setReservationItems((result.data || []).map(mapReservationFromApi));
    } catch (error) {
      if (!silent) {
        toast.error(error.message || "Reservasi belum bisa dimuat.");
      }
    }
  }, [selectedDate, selectedStatus]);

  useEffect(() => {
    let isMounted = true;

    getAdminTables()
      .then((tablesResult) => {
        if (isMounted) {
          setTableOptions((tablesResult.data || []).map(mapTableOptionFromApi));
        }
      })
      .catch(() => {
        if (isMounted) {
          setTableOptions([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const refresh = (silent = true) => {
      if (isMounted) {
        loadReservations(silent);
      }
    };

    refresh(false);
    const intervalId = window.setInterval(() => refresh(true), RESERVATION_REFRESH_MS);
    window.addEventListener("focus", refresh);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
    };
  }, [loadReservations]);

  const matchesFilters = (item) => {
    const matchesDate = selectedDate ? item.dateValue === selectedDate : true;
    const matchesStatus =
      selectedStatus === "Semua Status" ? true : item.status === selectedStatus;

    return matchesDate && matchesStatus;
  };

  const filteredItems = pages.flat().filter(matchesFilters);
  const filteredPages = chunkReservations(filteredItems);
  const currentReservations = filteredPages[currentPage] ?? [];
  const filteredTotal = filteredItems.length;
  const previousFilteredCount = filteredPages
    .slice(0, currentPage)
    .reduce((total, pageItems) => total + pageItems.length, 0);
  const firstShown =
    currentReservations.length === 0 ? 0 : previousFilteredCount + 1;
  const lastShown = previousFilteredCount + currentReservations.length;

  const isReservationComplete = (item) =>
    item?.rawId &&
    item?.name &&
    item.name !== "-" &&
    item?.phone &&
    item.phone !== "-" &&
    item?.dateValue &&
    item?.time &&
    item.time !== "-" &&
    item?.tableId;

  const updateReservationStatus = async (reservationId, status, mejaId) => {
    const previousPages = pages;
    const nextItems = pages
      .flat()
      .map((item) => (item.id === reservationId ? { ...item, status } : item));

    setReservationItems(nextItems);

    const target = pages.flat().find((item) => item.id === reservationId);

    if (!target?.rawId || !apiStatusByUiStatus[status]) {
      return;
    }

    if (status === "Dikonfirmasi" && !isReservationComplete({ ...target, tableId: mejaId || target.tableId })) {
      toast.error("Reservasi belum lengkap. Pilih meja dan pastikan data pelanggan, tanggal, dan jam sudah ada.");
      setPages(previousPages);
      return;
    }

    try {
      const response = await updateAdminReservationStatus(
        target.rawId,
        apiStatusByUiStatus[status],
        mejaId || target.tableId,
      );
      const updatedReservation = mapReservationFromApi(response.data);

      setReservationItems(
        pages
          .flat()
          .map((item) =>
            item.rawId === updatedReservation.rawId ? updatedReservation : item
          ),
      );
      toast.success(`Reservasi berhasil ${status.toLowerCase()}.`);
    } catch (error) {
      console.error("Gagal memperbarui status reservasi:", error);
      toast.error(error.message || "Reservasi belum bisa diperbarui.");
      setPages(previousPages);
    }
  };

  const handleTableChange = async (item, tableId) => {
    if (!item?.rawId) {
      toast.error("Reservasi belum valid.");
      return;
    }

    const previousPages = pages;

    try {
      const response = await updateAdminReservationStatus(
        item.rawId,
        apiStatusByUiStatus[item.status],
        Number(tableId),
      );
      const updatedReservation = mapReservationFromApi(response.data);

      setReservationItems(
        pages
          .flat()
          .map((reservation) =>
            reservation.rawId === updatedReservation.rawId ? updatedReservation : reservation
          ),
      );
      toast.success("Meja reservasi berhasil diperbarui.");
    } catch (error) {
      console.error("Gagal memperbarui meja reservasi:", error);
      toast.error(error.message || "Meja reservasi belum bisa diperbarui.");
      setPages(previousPages);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmTarget?.item) {
      return;
    }

    const { action, item } = confirmTarget;

    if (action === "cancel") {
      await updateReservationStatus(item.id, "Dibatalkan");
      setConfirmTarget(null);
      return;
    }

    const previousPages = pages;
    const remainingItems = pages
      .flat()
      .filter((reservation) => reservation.rawId !== item.rawId);

    setReservationItems(remainingItems);

    try {
      await deleteAdminReservation(item.rawId);
      setConfirmTarget(null);
      toast.success("Reservasi berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus reservasi:", error);
      toast.error(error.message || "Reservasi belum bisa dihapus.");
      setPages(previousPages);
    }
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
              <option>Menunggu</option>
              <option>Dikonfirmasi</option>
              <option>Selesai</option>
              <option>Dibatalkan</option>
            </select>
          </Field>

          <button
            type="button"
            onClick={() => {
              setSelectedDate("");
              setSelectedStatus("Semua Status");
              setCurrentPage(0);
            }}
            className="h-10 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-8 text-sm font-semibold text-white shadow-[0_10px_15px_-3px_rgba(59,130,246,0.2)] transition hover:brightness-105"
          >
            Reset
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

          <span className="rounded bg-[#F2F4F6] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#434655]">
            {filteredTotal} data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-sm">
            <thead className="bg-[#F2F4F6]/50 text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
              <tr>
                <th className="px-6 py-4 text-left">Nama Pelanggan</th>
                <th className="px-6 py-4 text-left">Tamu</th>
                <th className="px-6 py-4 text-left">Meja</th>
                <th className="px-6 py-4 text-left">Catatan</th>
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
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-[#191C1E] [overflow-wrap:anywhere]">{item.name}</p>
                        <p className="break-words text-[10px] text-[#434655] [overflow-wrap:anywhere]">{item.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium">{item.guests}</td>
                  <td className="px-6 py-5">
                    <select
                      value={item.tableId || ""}
                      onChange={(event) => handleTableChange(item, event.target.value)}
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-[#191C1E] outline-none focus:border-[#004AC6]"
                    >
                      <option value="">Pilih meja</option>
                      {tableOptions.map((table) => (
                        <option key={table.id} value={table.id}>
                          {table.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-[#434655]">
                      {item.tableCapacity ? `${item.tableCapacity} kursi` : "-"}
                    </p>
                  </td>
                  <td className="max-w-[240px] px-6 py-5 text-xs font-medium leading-5 text-[#434655]">
                    <p className="break-words line-clamp-3 [overflow-wrap:anywhere]">{item.note}</p>
                  </td>
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
                      {item.status === "Menunggu" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateReservationStatus(item.id, "Dikonfirmasi")}
                            className="rounded bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                          >
                            Terima
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmTarget({ action: "cancel", item })}
                            className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            Tolak
                          </button>
                        </>
                      ) : item.status === "Dikonfirmasi" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateReservationStatus(item.id, "Selesai")}
                            className="rounded bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                          >
                            Selesai
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmTarget({ action: "cancel", item })}
                            className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            Batalkan
                          </button>
                        </>
                      ) : (
                        <span className="rounded bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                          Tidak ada aksi
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setConfirmTarget({ action: "delete", item })}
                        className="rounded bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentReservations.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-sm text-[#434655]">
                    Tidak ada reservasi yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E6E8EA] bg-[#F2F4F6] p-6 text-xs font-medium text-[#434655] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Menampilkan {firstShown} sampai {lastShown} dari {filteredTotal} data
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
              className="flex h-8 w-8 items-center justify-center rounded border border-[#C3C6D7] bg-white transition hover:bg-[#E6E8EA] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Sebelumnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            {getVisiblePages(currentPage + 1, filteredPages.length).map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 font-medium">...</span>
              ) : (
                <button
                  key={`page-${page}`}
                  type="button"
                  onClick={() => setCurrentPage(page - 1)}
                  className={`flex h-8 min-w-[32px] items-center justify-center rounded transition ${
                    currentPage === page - 1
                      ? "bg-[#004AC6] font-bold text-white shadow-sm"
                      : "border border-[#C3C6D7] bg-white hover:bg-[#E6E8EA]"
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            <button
              type="button"
              disabled={currentPage === filteredPages.length - 1}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, filteredPages.length - 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded border border-[#C3C6D7] bg-white transition hover:bg-[#E6E8EA] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Berikutnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
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
      {confirmTarget && (
        <ConfirmActionModal
          action={confirmTarget.action}
          item={confirmTarget.item}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={handleConfirmAction}
        />
      )}
    </section>
  );
}
