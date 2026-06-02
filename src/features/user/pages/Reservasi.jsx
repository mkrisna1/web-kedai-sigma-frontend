import { useEffect, useState } from "react";
import ViewportPortal from "../../../components/common/ViewportPortal";
import logoSigma from "../../../assets/Logo Sigma.png";
import {
  createPublicReservation,
  getPublicReservationTables,
} from "../../../services/api";

const inputClass =
  "h-[54px] w-full rounded-2xl border border-[#5C403C]/80 bg-[#091421]/55 px-4 py-3 font-['Space_Grotesk',sans-serif] text-base font-bold leading-6 text-[#D9E3F6] outline-none transition placeholder:text-[#94A3B8]/75 focus:border-[#EEC200] focus:bg-[#091421]";
const peopleOptions = [1, 2, 3, 4, 5, 6, 7, 8];

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-['Be_Vietnam_Pro',sans-serif] text-xs font-bold leading-5 text-[#EEC200]">
        {label}
      </span>
      {children}
    </label>
  );
}

function FormIcon({ className = "h-5 w-6" }) {
  return (
    <svg viewBox="0 0 24 20" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2 4h10v2H2V4Zm0 5h8v2H2V9Zm0 5h6v2H2v-2Zm12.7 3.2-1.8-1.8 5.8-5.8 1.8 1.8-5.8 5.8Zm6.4-6.4L19.3 9l.9-.9a1.3 1.3 0 0 1 1.8 1.8l-.9.9Z" />
    </svg>
  );
}

function CheckBadgeIcon({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path
        d="m7.5 16.4 5.2 5.2 11.8-12"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        className="[stroke-dasharray:30] [stroke-dashoffset:30] animate-[check-draw_520ms_180ms_cubic-bezier(0.65,0,0.35,1)_forwards]"
      />
    </svg>
  );
}

const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const INDONESIA_TIME_ZONE = "Asia/Jakarta";
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
const timeOptions = [
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

const mapTableFromApi = (item) => ({
  id: item.id ?? item.id_meja,
  label: item.nomor_meja || "Meja",
  capacity: Number(item.capacity) || 0,
  usedSeats: Number(item.used_seats) || 0,
  status: item.status_meja || "active",
});

function formatDateValue(year, month, date) {
  return `${String(month + 1).padStart(2, "0")}/${String(date).padStart(2, "0")}/${year}`;
}

function getIndonesiaToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INDONESIA_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const getPart = (type) => Number(parts.find((part) => part.type === type)?.value);

  return new Date(getPart("year"), getPart("month") - 1, getPart("day"));
}

function getIndonesiaNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INDONESIA_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const getPart = (type) => Number(parts.find((part) => part.type === type)?.value);

  return new Date(
    getPart("year"),
    getPart("month") - 1,
    getPart("day"),
    getPart("hour"),
    getPart("minute"),
    getPart("second"),
  );
}

function getDateFromValue(value) {
  if (!value) {
    return getIndonesiaToday();
  }

  const [month, date, year] = value.split("/").map(Number);

  if (!month || !date || !year) {
    return getIndonesiaToday();
  }

  return new Date(year, month - 1, date);
}

function toApiDate(value) {
  const date = getDateFromValue(value);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDate(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function buildReservationDateTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return null;
  }

  const date = getDateFromValue(dateValue);
  const [hours, minutes] = timeValue.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}

function getMinimumReservationDateTime() {
  const minimumDateTime = getIndonesiaNow();
  minimumDateTime.setHours(minimumDateTime.getHours() + 2, minimumDateTime.getMinutes(), 0, 0);

  return minimumDateTime;
}

function isReservationTimeAllowed(dateValue, timeValue) {
  const reservationDateTime = buildReservationDateTime(dateValue, timeValue);

  if (!reservationDateTime) {
    return true;
  }

  return reservationDateTime >= getMinimumReservationDateTime();
}

function hasReservableTimeForDate(dateValue) {
  return timeOptions.some((time) => isReservationTimeAllowed(dateValue, time));
}

function CalendarPopup({ selectedDate, onClose, onSelect }) {
  const today = getIndonesiaToday();
  const selectedDateObject = getDateFromValue(selectedDate);
  const [visibleMonth, setVisibleMonth] = useState(selectedDateObject.getMonth());
  const [visibleYear, setVisibleYear] = useState(selectedDateObject.getFullYear());
  const firstDayIndex = new Date(visibleYear, visibleMonth, 1).getDay();
  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
  const monthDates = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const minReservationDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const maxReservationDate = new Date(minReservationDate);
  maxReservationDate.setDate(minReservationDate.getDate() + 14);
  const isPreviousMonthDisabled =
    visibleYear === today.getFullYear() && visibleMonth <= today.getMonth();
  const isNextMonthDisabled =
    new Date(visibleYear, visibleMonth + 1, 1) > maxReservationDate;

  const goToPreviousMonth = () => {
    setVisibleMonth((currentMonth) => {
      if (currentMonth === 0) {
        setVisibleYear((currentYear) => currentYear - 1);
        return 11;
      }

      return currentMonth - 1;
    });
  };

  const goToNextMonth = () => {
    setVisibleMonth((currentMonth) => {
      if (currentMonth === 11) {
        setVisibleYear((currentYear) => currentYear + 1);
        return 0;
      }

      return currentMonth + 1;
    });
  };

  const hasSelectableDatesInMonth = (monthIndex) => {
    const firstDateInMonth = new Date(visibleYear, monthIndex, 1);
    const lastDateInMonth = new Date(visibleYear, monthIndex + 1, 0);

    return (
      lastDateInMonth >= minReservationDate &&
      firstDateInMonth <= maxReservationDate
    );
  };

  return (
    <ViewportPortal>
    <div className="fixed left-1/2 top-1/2 z-[60] max-h-[calc(100dvh-32px)] w-[min(384px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 animate-[picker-panel_180ms_ease-out] overflow-y-auto rounded-lg border border-[#2B3544] bg-[#212B39] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goToPreviousMonth}
            disabled={isPreviousMonthDisabled}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#94A3B8] transition hover:bg-[#121C2A] hover:text-[#D9E3F6] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Bulan sebelumnya"
          >
            <span className="text-lg leading-none">{"<"}</span>
          </button>

          <div className="grid flex-1 grid-cols-[1fr_82px] gap-2">
            <select
              value={visibleMonth}
              onChange={(event) => setVisibleMonth(Number(event.target.value))}
              className="h-9 rounded-lg border border-[#2B3544] bg-[#121C2A] px-3 font-['Inter',sans-serif] text-sm font-bold text-[#D9E3F6] outline-none transition focus:border-[#EEC200]"
              aria-label="Pilih bulan"
            >
              {monthNames.map((month, index) => (
                <option
                  key={month}
                  className="bg-[#121C2A]"
                  value={index}
                  disabled={!hasSelectableDatesInMonth(index)}
                >
                  {month}
                </option>
              ))}
            </select>

            <div className="flex h-9 items-center justify-center rounded-lg border border-[#2B3544] bg-[#121C2A] px-3 font-['Inter',sans-serif] text-sm font-bold text-[#D9E3F6]">
              {visibleYear}
            </div>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            disabled={isNextMonthDisabled}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#94A3B8] transition hover:bg-[#121C2A] hover:text-[#D9E3F6] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Bulan berikutnya"
          >
            <span className="text-lg leading-none">{">"}</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-2">
          {days.map((day) => (
            <div
              key={day}
              className="pb-2 text-center font-['Inter',sans-serif] text-[10px] font-bold uppercase leading-[15px] tracking-[0.1em] text-[#EEC200]"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayIndex }).map((_, index) => (
            <div key={`blank-${index}`} />
          ))}
          {monthDates.map((date) => {
            const value = formatDateValue(visibleYear, visibleMonth, date);
            const isSelected = selectedDate === value;
            const currentDate = new Date(visibleYear, visibleMonth, date);
            const isToday = isSameDate(currentDate, today);
            const isOutsideReservationRange =
              currentDate < minReservationDate ||
              currentDate > maxReservationDate ||
              !hasReservableTimeForDate(value);

            return (
              <button
                key={date}
                type="button"
                onClick={() => {
                  if (!isOutsideReservationRange) {
                    onSelect(value);
                  }
                }}
                disabled={isOutsideReservationRange}
                className={`relative flex h-10 items-center justify-center rounded-xl font-['Inter',sans-serif] text-sm leading-5 transition ${
                  isSelected
                    ? "bg-gradient-to-br from-[#DC2626] to-[#F43F3F] font-bold text-white shadow-[0_8px_18px_rgba(220,38,38,0.35)]"
                    : isOutsideReservationRange
                      ? "cursor-not-allowed text-[#94A3B8]/30"
                      : "text-[#D9E3F6] hover:bg-[#121C2A]"
                } ${isToday && !isSelected ? "ring-1 ring-[#EEC200]/40" : ""}`}
              >
                {date}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-[68px] items-center justify-end gap-3 bg-[#121C2A] px-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-5 font-['Inter',sans-serif] text-sm font-semibold text-[#94A3B8] transition hover:text-[#D9E3F6]"
        >
          Keluar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg bg-[#DC2626] px-6 font-['Inter',sans-serif] text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
        >
          Pilih
        </button>
      </div>
    </div>
    </ViewportPortal>
  );
}
function TimePopup({ selectedDate, selectedTime, onClose, onSelect }) {
  return (
    <ViewportPortal>
    <div className="fixed left-1/2 top-1/2 z-[60] max-h-[calc(100dvh-32px)] w-[min(384px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 animate-[picker-panel_180ms_ease-out] overflow-y-auto rounded-lg border border-[#2B3544] bg-[#212B39] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h2 className="font-['Inter',sans-serif] text-lg font-bold leading-7 tracking-[-0.025em] text-[#D9E3F6]">
            Pilih Waktu
          </h2>
          <p className="mt-1 font-['Inter',sans-serif] text-sm text-[#94A3B8]">
            Jam operasional 16:00 - 00:00
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {timeOptions.map((time) => {
            const isSelected = selectedTime === time;
            const isDisabled = !isReservationTimeAllowed(selectedDate, time);

            return (
              <button
                key={time}
                type="button"
                onClick={() => {
                  if (!isDisabled) {
                    onSelect(time);
                  }
                }}
                disabled={isDisabled}
                className={`h-10 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition ${
                  isSelected
                    ? "bg-[#DC2626] text-white shadow-[0_8px_18px_rgba(220,38,38,0.35)]"
                    : isDisabled
                      ? "cursor-not-allowed bg-[#121C2A] text-[#64748B]/45 line-through"
                      : "bg-[#121C2A] text-[#D9E3F6] hover:bg-[#2B3544]"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-[68px] items-center justify-end gap-3 bg-[#121C2A] px-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-5 font-['Inter',sans-serif] text-sm font-semibold text-[#94A3B8] transition hover:text-[#D9E3F6]"
        >
          Keluar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg bg-[#DC2626] px-6 font-['Inter',sans-serif] text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
        >
          Pilih
        </button>
      </div>
    </div>
    </ViewportPortal>
  );
}

function TablePopup({ tables, selectedTableId, guestCount, onClose, onSelect }) {
  return (
    <ViewportPortal>
    <div className="fixed left-1/2 top-1/2 z-[60] max-h-[calc(100dvh-32px)] w-[min(420px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 animate-[picker-panel_180ms_ease-out] overflow-y-auto rounded-xl border border-[#2B3544] bg-[#212B39] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h2 className="font-['Inter',sans-serif] text-lg font-bold leading-7 tracking-[-0.025em] text-[#D9E3F6]">
            Pilih Meja
          </h2>
          <p className="mt-1 font-['Inter',sans-serif] text-sm text-[#94A3B8]">
            {guestCount ? `${guestCount} orang, pilih meja yang masih kosong` : "Pilih jumlah orang dulu"}
          </p>
        </div>

        {tables.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {tables.map((table) => {
              const isSelected = String(selectedTableId) === String(table.id);

              return (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => onSelect(table.id)}
                  className={`group relative flex min-h-[96px] flex-col items-start justify-between overflow-hidden rounded-xl border p-4 text-left font-['Inter',sans-serif] transition duration-300 hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-[#EEC200] bg-[#DC2626] text-white shadow-[0_8px_18px_rgba(220,38,38,0.35)]"
                      : "border-[#2B3544] bg-[#121C2A] text-[#D9E3F6] hover:border-[#EEC200]/60 hover:bg-[#2B3544]"
                  }`}
                >
                  <span
                    className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                      isSelected
                        ? "bg-white text-[#DC2626]"
                        : "bg-[#2B3544] text-[#EEC200] group-hover:bg-[#EEC200] group-hover:text-[#3C2F00]"
                    }`}
                  >
                    {table.capacity}
                  </span>
                  <span className="text-base font-bold leading-5">{table.label}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.12em] ${
                      isSelected ? "text-white/80" : "text-[#EEC200]"
                    }`}
                  >
                    {table.capacity} kursi
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[112px] items-center justify-center rounded-lg border border-[#2B3544] bg-[#121C2A] px-5 text-center font-['Inter',sans-serif] text-sm font-bold text-[#EEC200]">
            Meja penuh
          </div>
        )}
      </div>

      <div className="flex h-[68px] items-center justify-end gap-3 bg-[#121C2A] px-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-5 font-['Inter',sans-serif] text-sm font-semibold text-[#94A3B8] transition hover:text-[#D9E3F6]"
        >
          Keluar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg bg-[#DC2626] px-6 font-['Inter',sans-serif] text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
        >
          Pilih
        </button>
      </div>
    </div>
    </ViewportPortal>
  );
}

function ReservationSuccessPopup({ onClose }) {
  return (
    <ViewportPortal>
    <div
      className="fixed inset-0 z-50 flex animate-[popup-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-success-title"
    >
      <div className="relative flex h-auto w-full max-w-[780px] animate-[popup-panel_220ms_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
        <div className="relative flex min-h-[320px] flex-col border-b border-white/10 px-6 py-8 sm:px-10 md:px-14">
          <div className="flex items-center justify-center border-b border-white/10 pb-6 sm:justify-start">
            <p className="font-['Be_Vietnam_Pro',sans-serif] text-base font-semibold leading-5 text-white">
              Sistem
            </p>
          </div>

          <div className="grid flex-1 items-center gap-7 pt-8 md:grid-cols-[180px_1fr] md:gap-10 md:pt-0">
            <div className="flex justify-center md:justify-start">
              <img
                src={logoSigma}
                alt="Logo Kedai Sigma"
                className="h-[150px] w-[150px] object-contain sm:h-[180px] sm:w-[180px]"
              />
            </div>

            <div className="relative flex flex-col gap-6 text-center md:text-left">
              <CheckBadgeIcon className="pointer-events-none mx-auto h-11 w-11 animate-[check-pop_360ms_120ms_ease-out_both] md:absolute md:-left-11 md:top-[44px] md:mx-0 md:h-9 md:w-9" />
              <h2
                id="reservation-success-title"
                className="font-['Space_Grotesk',sans-serif] text-2xl font-bold leading-8 text-white sm:text-3xl"
              >
                Terima kasih sudah reservasi!
              </h2>
              <div className="h-px w-full bg-white/15" />
              <p className="max-w-[439px] font-['Be_Vietnam_Pro',sans-serif] text-base leading-7 text-white/70 sm:text-lg">
                Terima kasih telah melakukan reservasi.
                <br />
                Kami akan menyiapkan yang terbaik untuk menyambut kedatangan Anda.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-14 w-full items-center justify-center bg-[#DC2626] px-4 font-['Space_Grotesk',sans-serif] text-base font-bold leading-6 text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#091421]"
        >
          Reservasi Berhasil
        </button>
      </div>
    </div>
    </ViewportPortal>
  );
}

function ReservationWarningPopup({ message, onClose }) {
  return (
    <ViewportPortal>
    <div
      className="fixed inset-0 z-50 flex animate-[popup-backdrop_180ms_ease-out] items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-warning-title"
    >
      <div className="w-full max-w-[520px] animate-[popup-panel_220ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-3xl border border-[#EEC200]/25 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <p className="font-['Be_Vietnam_Pro',sans-serif] text-base font-semibold leading-5 text-white">
            Sistem
          </p>
        </div>

        <div className="px-6 py-8 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEC200] text-2xl font-black text-[#091421]">
            !
          </div>
          <h2
            id="reservation-warning-title"
            className="mt-6 font-['Space_Grotesk',sans-serif] text-2xl font-bold leading-8 text-white"
          >
            Mohon isi yang lengkap
          </h2>
          <p className="mx-auto mt-3 max-w-[360px] font-['Be_Vietnam_Pro',sans-serif] text-sm leading-6 text-white/70">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-14 w-full items-center justify-center bg-[#DC2626] px-4 font-['Space_Grotesk',sans-serif] text-base font-bold leading-6 text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#091421]"
        >
          Lengkapi Form
        </button>
      </div>
    </div>
    </ViewportPortal>
  );
}

export default function Reservasi() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    people: "",
    note: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [tableOptions, setTableOptions] = useState([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [openPicker, setOpenPicker] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState(
    "Lengkapi nama, nomor telepon, tanggal, waktu, jumlah orang, dan meja sebelum mengirim reservasi.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const guestCount = Number.parseInt(formData.people, 10) || undefined;
    const params = {
      ...(guestCount ? { jml_orang: guestCount } : {}),
      ...(selectedDate ? { tgl_reservasi: toApiDate(selectedDate) } : {}),
      ...(selectedTime ? { jam_reservasi: selectedTime } : {}),
    };

    queueMicrotask(() => {
      if (isMounted) {
        setIsLoadingTables(true);
      }
    });
    getPublicReservationTables(Object.keys(params).length ? params : undefined)
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const tables = (response.data || []).map(mapTableFromApi);
        setTableOptions(tables);

        setSelectedTableId((currentTableId) => {
          if (!currentTableId) {
            return "";
          }

          return tables.some((table) => String(table.id) === String(currentTableId))
            ? currentTableId
            : "";
        });
      })
      .catch((error) => {
        console.error("Gagal mengambil meja reservasi:", error);
        if (isMounted) {
          setTableOptions([]);
          setSelectedTableId("");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingTables(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [formData.people, selectedDate, selectedTime]);

  const selectedTable = tableOptions.find(
    (table) => String(table.id) === String(selectedTableId),
  );
  const hasNoAvailableTables =
    Boolean(formData.people) && !isLoadingTables && tableOptions.length === 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? value.replace(/\D/g, "") : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleDateSelect = (value) => {
    setSelectedDate(value);
    setSelectedTableId("");

    if (selectedTime && !isReservationTimeAllowed(value, selectedTime)) {
      setSelectedTime("");
    }
  };

  const handleTimeSelect = (value) => {
    setSelectedTime(value);
    setSelectedTableId("");
  };

  const handleTableSelect = (value) => {
    setSelectedTableId(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpenPicker(null);

    const isFormComplete =
      formData.name.trim() &&
      formData.phone.trim() &&
      selectedDate &&
      selectedTime &&
      formData.people &&
      selectedTableId;

    if (hasNoAvailableTables) {
      setWarningMessage(
        `Meja untuk ${formData.people} orang sedang penuh. Coba pilih tanggal/waktu lain atau hubungi admin 081223728077.`,
      );
      setShowWarningPopup(true);
      return;
    }

    if (!isFormComplete) {
      setWarningMessage(
        "Lengkapi nama, nomor telepon, tanggal, waktu, jumlah orang, dan meja sebelum mengirim reservasi.",
      );
      setShowWarningPopup(true);
      return;
    }

    if (!isReservationTimeAllowed(selectedDate, selectedTime)) {
      setWarningMessage(
        "Reservasi minimal H-2 jam dari waktu sekarang. Pilih tanggal atau jam yang lebih longgar ya.",
      );
      setShowWarningPopup(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await createPublicReservation({
        nama_reservasi: formData.name.trim(),
        no_hp: formData.phone.trim(),
        meja_id: Number.parseInt(selectedTableId, 10),
        tgl_reservasi: toApiDate(selectedDate),
        jam_reservasi: selectedTime,
        jml_orang: Number.parseInt(formData.people, 10) || 1,
        catatan_reservasi: formData.note.trim(),
      });
      setShowSuccessPopup(true);
      setFormData({
        name: "",
        phone: "",
        people: "",
        note: "",
      });
      setSelectedDate("");
      setSelectedTime("");
      setSelectedTableId("");
    } catch (error) {
      console.error("Gagal membuat reservasi:", error);
      setWarningMessage(error.message || "Reservasi belum bisa dikirim. Coba lagi sebentar ya.");
      setShowWarningPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#091421] text-[#D9E3F6]">
      <div className="h-1 bg-[#050F1C]" />

      <section className="relative isolate bg-[#091421] px-5 pb-16 pt-8 md:px-8 md:pt-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#091421] opacity-[0.02]">
          <svg viewBox="0 0 1280 1280" className="h-[1280px] w-full min-w-[1280px]" aria-hidden="true">
            <path
              fill="#000"
              d="M0 0h1280v1280H0zM116 150h1048v90H116zM116 352h1048v90H116zM116 554h1048v90H116zM116 756h1048v90H116z"
            />
          </svg>
        </div>

        <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-8">
          <header className="flex max-w-[640px] flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-center font-['Space_Grotesk',sans-serif] text-sm font-bold leading-5 text-[#EEC200]">
                RESERVASI SEKARANG BIAR SIGMA
              </p>
            </div>

            <h1 className="font-['Space_Grotesk',sans-serif] text-5xl font-black leading-[0.98] tracking-[-0.03em] md:text-7xl">
              <span className="block text-[#D9E3F6]">PESAN</span>
              <span className="block text-[#DC2626]">TEMPATMU</span>
            </h1>
          </header>

          <div className="flex w-full flex-col gap-6">
            <form
              onSubmit={handleSubmit}
              className="mx-auto w-full max-w-[720px] rounded-3xl border border-white/10 bg-[#101B2B] px-5 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:px-8 sm:py-8 lg:px-10"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <FormIcon className="h-5 w-6 text-[#EEC200]" />
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold leading-8 text-[#D9E3F6]">
                  Form Reservasi
                </h2>
              </div>

              <div className="mt-7 grid gap-x-8 gap-y-6 lg:grid-cols-2">
                <Field label="Nama kamu">
                  <input
                    className={inputClass}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama kamu"
                  />
                </Field>

                <Field label="No. telepon">
                  <input
                    className={inputClass}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="620000000000"
                  />
                </Field>

                <Field label="Tanggal reservasi">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenPicker((current) =>
                          current === "date" ? null : "date",
                        )
                      }
                      className={`${inputClass} flex items-center text-left`}
                    >
                      {selectedDate || (
                        <span className="text-[#94A3B8]/75">Pilih tanggal</span>
                      )}
                    </button>
                    {openPicker === "date" && (
                      <CalendarPopup
                        selectedDate={selectedDate}
                        onClose={() => setOpenPicker(null)}
                        onSelect={(value) => {
                          handleDateSelect(value);
                          setOpenPicker(null);
                        }}
                      />
                    )}
                  </div>
                </Field>

                <Field label="Waktu hadir">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenPicker((current) =>
                          current === "time" ? null : "time",
                        )
                      }
                      className={`${inputClass} flex items-center text-left`}
                    >
                      {selectedTime || (
                        <span className="text-[#94A3B8]/75">Pilih waktu</span>
                      )}
                    </button>
                    {openPicker === "time" && (
                      <TimePopup
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onClose={() => setOpenPicker(null)}
                        onSelect={(value) => {
                          handleTimeSelect(value);
                          setOpenPicker(null);
                        }}
                      />
                    )}
                  </div>
                </Field>

                <Field label="Berapa orang">
                  <select
                    className={`${inputClass} appearance-none`}
                    name="people"
                    value={formData.people}
                    onChange={handleChange}
                  >
                    <option className="bg-[#212B39]" value="">
                      Pilih jumlah orang
                    </option>
                    {peopleOptions.map((option) => (
                      <option key={option} className="bg-[#212B39]" value={option}>
                        {option} Orang
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Pilih meja">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.people || hasNoAvailableTables) {
                          return;
                        }

                        setOpenPicker((current) =>
                          current === "table" ? null : "table",
                        );
                      }}
                      disabled={!formData.people || isLoadingTables || hasNoAvailableTables}
                      className={`${inputClass} flex items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <span>
                        {!formData.people
                          ? "Pilih jumlah orang dulu"
                          : isLoadingTables
                            ? "Memuat meja..."
                            : hasNoAvailableTables
                              ? "Meja penuh"
                              : selectedTable?.label || "Pilih meja"}
                      </span>
                      {formData.people && !hasNoAvailableTables && (
                        <span className="text-base text-[#EEC200]">v</span>
                      )}
                    </button>
                    {openPicker === "table" && (
                      <TablePopup
                        tables={tableOptions}
                        selectedTableId={selectedTableId}
                        guestCount={formData.people}
                        onClose={() => setOpenPicker(null)}
                        onSelect={(value) => {
                          handleTableSelect(value);
                          setOpenPicker(null);
                        }}
                      />
                    )}
                  </div>
                  {Number.parseInt(formData.people, 10) <= 4 && formData.people && (
                    <p className="mt-2 font-['Be_Vietnam_Pro',sans-serif] text-xs font-semibold text-[#94A3B8]">
                      Untuk 1-4 orang, meja yang ditampilkan maksimal kapasitas 4 kursi.
                    </p>
                  )}
                  {hasNoAvailableTables && (
                    <p
                      className="mt-2 rounded-lg border border-[#DC2626]/35 bg-[#DC2626]/15 px-3 py-2 font-['Be_Vietnam_Pro',sans-serif] text-xs font-semibold leading-5 text-[#FFD6D1]"
                      role="alert"
                    >
                      Meja untuk {formData.people} orang sedang penuh. Coba pilih tanggal/waktu lain atau hubungi admin 081223728077.
                    </p>
                  )}
                </Field>

                <div className="lg:col-span-2">
                  <Field label="Catatan">
                    <textarea
                      className="min-h-[92px] w-full resize-none rounded-2xl border border-[#5C403C]/80 bg-[#091421]/55 px-4 py-3 font-['Space_Grotesk',sans-serif] text-base font-bold leading-6 text-[#D9E3F6] outline-none transition placeholder:text-[#94A3B8]/75 focus:border-[#EEC200] focus:bg-[#091421]"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="cth: request tambah terminal kaka"
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-[#DC2626] px-5 py-4 text-center font-['Space_Grotesk',sans-serif] text-base font-bold leading-7 text-[#FFF6F5] shadow-[0_16px_34px_rgba(220,38,38,0.28)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg lg:col-span-2"
                >
                  {isSubmitting ? "Mengirim..." : "Konfirmasi Reservasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {showSuccessPopup && (
        <ReservationSuccessPopup onClose={() => setShowSuccessPopup(false)} />
      )}
      {showWarningPopup && (
        <ReservationWarningPopup
          message={warningMessage}
          onClose={() => setShowWarningPopup(false)}
        />
      )}
    </div>
  );
}
