import { useState } from "react";
import fotoKedai1 from "../../../assets/Foto Kedai 1.png";
import fotoKedai2 from "../../../assets/Foto Kedai 2.PNG";
import logoSigma from "../../../assets/Logo Sigma.png";
import { createPublicReservation } from "../../../services/api";

const inputClass =
  "h-[62px] w-full border-0 border-b-2 border-[#5C403C] bg-transparent px-1 py-4 font-['Space_Grotesk',sans-serif] text-xl font-bold uppercase leading-7 text-[#D9E3F6] outline-none transition placeholder:text-[#94A3B8]/75 focus:border-[#EEC200]";

function SkewBadge({ children, className = "bg-[#00B954] text-[#003915]" }) {
  return (
    <span
      className={`inline-flex h-6 w-[166px] -skew-x-12 items-center justify-center font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 ${className}`}
    >
      <span className="skew-x-12">{children}</span>
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-['Be_Vietnam_Pro',sans-serif] text-[10px] font-bold uppercase leading-[15px] tracking-[0.2em] text-[#EEC200]">
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

function NoticeIcon({ className = "h-6 w-7" }) {
  return (
    <svg viewBox="0 0 28 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14 0 28 24H0L14 0Zm-1.5 8v7h3V8h-3Zm0 9v3h3v-3h-3Z" />
    </svg>
  );
}

function WifiIcon({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3.5 9.5a13 13 0 0 1 17 0M7 13a7.7 7.7 0 0 1 10 0M10.5 16.5a2.3 2.3 0 0 1 3 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.6"
      />
      <path d="M16.5 17.5h4v4h-4v-4Z" fill="currentColor" />
    </svg>
  );
}

function ChargeIcon({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M9 2h6v5h3l-6 15V13H7l2-11Z" />
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
    <div className="absolute left-1/2 top-full z-30 mt-4 w-[min(384px,calc(100vw-48px))] -translate-x-1/2 animate-[picker-panel_180ms_ease-out] overflow-hidden rounded-lg border border-[#2B3544] bg-[#212B39] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
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
              currentDate > maxReservationDate;

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
  );
}
function TimePopup({ selectedTime, onClose, onSelect }) {
  return (
    <div className="absolute left-1/2 top-full z-30 mt-4 w-[min(384px,calc(100vw-48px))] -translate-x-1/2 animate-[picker-panel_180ms_ease-out] overflow-hidden rounded-lg border border-[#2B3544] bg-[#212B39] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
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

            return (
              <button
                key={time}
                type="button"
                onClick={() => onSelect(time)}
                className={`h-10 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition ${
                  isSelected
                    ? "bg-[#DC2626] text-white shadow-[0_8px_18px_rgba(220,38,38,0.35)]"
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
  );
}

function ReservationSuccessPopup({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex animate-[popup-backdrop_180ms_ease-out] items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-success-title"
    >
      <div className="relative flex h-auto w-full max-w-[850px] animate-[popup-panel_220ms_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden rounded-xl bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:min-h-[415px]">
        <div className="relative flex min-h-[330px] flex-col border-b border-white/40 px-6 py-8 sm:min-h-[359px] sm:px-10 md:px-16">
          <div className="flex items-center justify-center border-b border-white/40 pb-8 sm:justify-start">
            <p className="font-['Be_Vietnam_Pro',sans-serif] text-xl leading-5 text-white">
              Sistem
            </p>
          </div>

          <div className="grid flex-1 items-center gap-8 pt-8 md:grid-cols-[220px_1fr] md:gap-10 md:pt-0">
            <div className="flex justify-center md:justify-start">
              <img
                src={logoSigma}
                alt="Logo Kedai Sigma"
                className="h-[170px] w-[170px] object-contain sm:h-[210px] sm:w-[210px] md:h-[235px] md:w-[234px]"
              />
            </div>

            <div className="relative flex flex-col gap-8 text-center md:text-left">
              <CheckBadgeIcon className="pointer-events-none mx-auto h-11 w-11 animate-[check-pop_360ms_120ms_ease-out_both] md:absolute md:-left-12 md:top-[52px] md:mx-0 md:h-9 md:w-9" />
              <h2
                id="reservation-success-title"
                className="font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase leading-8 tracking-[-0.05em] text-white"
              >
                Terima kasih sudah reservasi!
              </h2>
              <div className="h-px w-full bg-white/15" />
              <p className="max-w-[439px] font-['Be_Vietnam_Pro',sans-serif] text-xl leading-6 text-white/70">
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
          className="flex h-14 w-full items-center justify-center bg-[#DC2626] px-4 font-['Space_Grotesk',sans-serif] text-base font-bold uppercase leading-6 tracking-[0.1em] text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#091421]"
        >
          Reservasi Berhasil
        </button>
      </div>
    </div>
  );
}

function ReservationWarningPopup({ message, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex animate-[popup-backdrop_180ms_ease-out] items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-warning-title"
    >
      <div className="w-full max-w-[520px] animate-[popup-panel_220ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-xl border border-[#EEC200]/30 bg-[#091421] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
        <div className="border-b border-white/25 px-6 py-5 sm:px-8">
          <p className="font-['Be_Vietnam_Pro',sans-serif] text-xl leading-5 text-white">
            Sistem
          </p>
        </div>

        <div className="px-6 py-8 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEC200] text-2xl font-black text-[#091421]">
            !
          </div>
          <h2
            id="reservation-warning-title"
            className="mt-6 font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase leading-8 tracking-[-0.04em] text-white"
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
          className="flex h-14 w-full items-center justify-center bg-[#DC2626] px-4 font-['Space_Grotesk',sans-serif] text-base font-bold uppercase leading-6 tracking-[0.1em] text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#091421]"
        >
          Lengkapi Form
        </button>
      </div>
    </div>
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
  const [openPicker, setOpenPicker] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState(
    "Lengkapi nama, nomor telepon, tanggal, waktu, dan jumlah orang sebelum mengirim reservasi.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? value.replace(/\D/g, "") : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpenPicker(null);

    const isFormComplete =
      formData.name.trim() &&
      formData.phone.trim() &&
      selectedDate &&
      selectedTime &&
      formData.people;

    if (!isFormComplete) {
      setWarningMessage(
        "Lengkapi nama, nomor telepon, tanggal, waktu, dan jumlah orang sebelum mengirim reservasi.",
      );
      setShowWarningPopup(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await createPublicReservation({
        nama_reservasi: formData.name.trim(),
        no_hp: formData.phone.trim(),
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

      <section className="relative isolate bg-[#091421] px-6 pb-24 pt-12 md:px-8 md:pt-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#091421] opacity-[0.02]">
          <svg viewBox="0 0 1280 1280" className="h-[1280px] w-full min-w-[1280px]" aria-hidden="true">
            <path
              fill="#000"
              d="M0 0h1280v1280H0zM116 150h1048v90H116zM116 352h1048v90H116zM116 554h1048v90H116zM116 756h1048v90H116z"
            />
          </svg>
        </div>

        <div className="mx-auto flex w-full max-w-[1024px] flex-col items-center gap-16">
          <header className="flex flex-col items-center gap-5 text-center">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <SkewBadge>Reservasi</SkewBadge>
              <p className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#EEC200]">
                Reservasi sekarang biar sigma
              </p>
            </div>

            <h1 className="font-['Space_Grotesk',sans-serif] text-6xl font-black uppercase leading-[0.98] tracking-[-0.05em] md:text-[92px]">
              <span className="block text-[#D9E3F6]">Pesan</span>
              <span className="block text-[#DC2626]">Tempatmu</span>
            </h1>
          </header>

          <div className="flex w-full max-w-[672px] flex-col gap-8">
            <form
              onSubmit={handleSubmit}
              className="w-full bg-[#212B39] px-6 py-10 shadow-[0_0_60px_rgba(0,0,0,0.6)] sm:px-12 sm:pb-16 sm:pt-12"
            >
              <div className="flex items-center gap-3 border-b border-[#5C403C] pb-6">
                <FormIcon className="h-5 w-6 text-[#EEC200]" />
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase leading-8 tracking-[-0.025em]">
                  Form Reservasi
                </h2>
              </div>

              <div className="mt-10 flex flex-col gap-10">
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

                <div className="grid gap-8 sm:grid-cols-2">
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
                            setSelectedDate(value);
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
                          selectedTime={selectedTime}
                          onClose={() => setOpenPicker(null)}
                          onSelect={(value) => {
                            setSelectedTime(value);
                            setOpenPicker(null);
                          }}
                        />
                      )}
                    </div>
                  </Field>
                </div>

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
                    <option className="bg-[#212B39]" value="1 Person">
                      1 Orang
                    </option>
                    <option className="bg-[#212B39]" value="2 Person">
                      2 Orang
                    </option>
                    <option className="bg-[#212B39]" value="3 Person">
                      3 Orang
                    </option>
                    <option className="bg-[#212B39]" value="4 Person">
                      4 Orang
                    </option>
                    <option className="bg-[#212B39]" value="5+ Person">
                      5+ Orang
                    </option>
                  </select>
                </Field>

                <Field label="Catatan">
                  <textarea
                    className="min-h-[106px] w-full resize-none border-0 border-b-2 border-[#5C403C] bg-transparent px-1 py-4 font-['Space_Grotesk',sans-serif] text-base font-bold leading-6 text-[#D9E3F6] outline-none transition placeholder:text-[#94A3B8]/75 focus:border-[#EEC200]"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="cth: request tambah terminal kaka"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-20 w-full items-center justify-center bg-[#DC2626] px-4 py-6 text-center font-['Space_Grotesk',sans-serif] text-xl font-bold uppercase leading-8 tracking-[0.28em] text-[#FFF6F5] shadow-[0_10px_30px_rgba(220,38,38,0.3)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 md:text-2xl"
                >
                  {isSubmitting ? "Mengirim..." : "Konfirmasi Reservasi"}
                </button>
              </div>
            </form>

            <div className="-skew-x-12 bg-[#EEC200] px-5 py-4 text-[#3C2F00]">
              <div className="flex skew-x-12 items-center gap-4">
                <NoticeIcon className="h-6 w-7 shrink-0" />
                <p className="font-['Be_Vietnam_Pro',sans-serif] text-[11px] font-bold uppercase leading-[14px] tracking-[-0.025em]">
                  Dengan melakukan reservasi, pelanggan dianggap telah memahami dan menyetujui seluruh ketentuan yang berlaku serta bersedia menerima segala konsekuensi yang ditetapkan.
                </p>
              </div>
            </div>
          </div>

          <section className="relative grid w-full max-w-[960px] gap-12 pt-12 lg:grid-cols-[448px_1fr] lg:gap-16">
            <div className="relative">
              <span className="pointer-events-none absolute -left-8 -top-8 font-['Be_Vietnam_Pro',sans-serif] text-[110px] font-black uppercase leading-none text-[#DC2626]/20 md:text-[120px]">
                INFO
              </span>

              <div className="relative flex max-w-[448px] flex-col gap-8">
                <h2 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold uppercase leading-none tracking-[-0.025em]">
                  The Sigma
                  <br />
                  Protocol
                </h2>

                <p className="max-w-[330px] font-['Be_Vietnam_Pro',sans-serif] text-base font-light leading-[26px] text-[#94A3B8]">
                  Protokol reservasi adalah aturan yang mengatur proses pemesanan tempat agar berjalan tertib. Dengan melakukan reservasi, pelanggan dianggap telah memahami, menyetujui, dan siap menerima semua ketentuan serta konsekuensi yang berlaku.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <article className="h-[105px] border-l-2 border-[#4AE176] bg-[#121C2A] p-6">
                    <WifiIcon className="h-7 w-7 text-[#4AE176]" />
                    <p className="mt-4 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 tracking-[0.1em]">
                      Wifi cepat sangat sigma
                    </p>
                  </article>

                  <article className="h-[105px] border-l-2 border-[#DC2626] bg-[#121C2A] p-6">
                    <ChargeIcon className="h-7 w-7 text-[#DC2626]" />
                    <p className="mt-4 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 tracking-[0.1em]">
                      Station Charging
                    </p>
                  </article>
                </div>
              </div>
            </div>

            <div className="relative min-h-[368px]">
              <img
                src={fotoKedai1}
                alt="Interior Kedai Sigma"
                className="absolute left-0 top-0 h-80 w-[216px] border border-[#2B3544]/20 object-cover grayscale"
              />
              <img
                src={fotoKedai2}
                alt="Suasana Kedai Sigma"
                className="absolute left-[232px] top-12 h-80 w-[216px] border border-[#2B3544]/20 object-cover grayscale"
              />
            </div>
          </section>
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
