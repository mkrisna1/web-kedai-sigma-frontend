import { useState } from "react";
import fotoKedai1 from "../../../assets/Foto Kedai 1.png";
import fotoKedai2 from "../../../assets/Foto Kedai 2.PNG";
import fotoKedai3 from "../../../assets/Foto Kedai 3.PNG";

const ratingBars = [
  { star: 5, percent: 100, color: "#00B954" },
  { star: 4, percent: 0, color: "#00B954" },
  { star: 3, percent: 0, color: "#00B954" },
  { star: 2, percent: 0, color: "#00B954" },
  { star: 1, percent: 0, color: "#DC2626" },
];

const categories = [
  {
    label: "Bersih",
    className: "border-[#4AE176]/30 bg-[#00B954]/20 text-[#6BFF8F]",
  },
  {
    label: "Playlist",
    className: "border-[#EEC200]/30 bg-[#EEC200]/20 text-[#EEC200]",
  },
  {
    label: "Affordable",
    className: "border-[#FFB4AB]/30 bg-[#DC2626]/20 text-[#FFB4AB]",
  },
  {
    label: "Tempat Teduh",
    className: "border-transparent bg-[#334155] text-[#E2E8F0]",
  },
];

const reviews = [
  {
    name: "Jennie Madya",
    time: "Sebulan lalu",
    rating: 5,
    accent: "#DC2626",
    avatarAccent: "#EEC200",
    initials: "JM",
    text: "Tempatnya lumayan bersih, sejuk karena banyak pepohonan, cocok buat ngopi santai.",
    helpful: "12 suka",
    replies: "Balas",
    photos: [],
  },
  {
    name: "Natasya Andita",
    time: "2 minggu lalu",
    rating: 5,
    accent: "#EEC200",
    avatarAccent: "#4AE176",
    initials: "NA",
    text: "Tempatnya bersih, aesthetic, dingin, pelayanannya cepat dan ramah, playlist lagunya sangat mantap dan sesuai dengan vibes kafe nya, makanannya enak, harganya affordable dan aman di kantong, juga disediakan permainan kartu dan ada gitar juga.",
    helpful: "9 suka",
    replies: "Balas",
    photos: [
      { src: fotoKedai1, alt: "Foto area duduk Kedai Sigma" },
      { src: fotoKedai2, alt: "Foto suasana Kedai Sigma" },
    ],
  },
  {
    name: "Rama Pradana",
    time: "3 hari lalu",
    rating: 5,
    accent: "#4AE176",
    avatarAccent: "#FFB4AB",
    initials: "RP",
    text: "Kopi susunya pas, suasananya santai, dan meja outdoor paling enak buat ngobrol lama. Bakal balik lagi buat coba menu makanan lainnya.",
    helpful: "7 suka",
    replies: "Balas",
    photos: [{ src: fotoKedai3, alt: "Foto halaman Kedai Sigma" }],
  },
];

function StarIcon({ className = "h-5 w-5", filled = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.86 1.18 6.87L12 17.77 5.82 21 7 14.13l-5-4.86 6.91-1.01L12 2Z" />
    </svg>
  );
}

function LikeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Z" />
      <path d="M7 10 12 2a3 3 0 0 1 3 3v4h5a2 2 0 0 1 2 2l-1 8a2 2 0 0 1-2 2H7V10Z" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 96 64" className="h-16 w-24" fill="currentColor" aria-hidden="true">
      <path d="M18 8h22L26 56H4L18 8Zm52 0h22L78 56H56L70 8Z" />
    </svg>
  );
}

function SkewTag({ label, className }) {
  return (
    <span
      className={`inline-flex -skew-x-12 border px-3 py-1 font-['Be_Vietnam_Pro',sans-serif] text-xs font-bold leading-4 ${className}`}
    >
      <span className="skew-x-12">{label}</span>
    </span>
  );
}

function RatingStars({ rating, size = "h-3 w-3", color = "text-[#4AE176]" }) {
  return (
    <div className={`flex items-center ${color}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon key={index} className={size} filled={index < rating} />
      ))}
    </div>
  );
}

function RatingSummary() {
  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-[127px]">
      <section className="border-l-8 border-[#EEC200] bg-[#121C2A] p-6 sm:p-8">
        <div className="flex flex-wrap items-end gap-4">
          <p className="font-['Space_Grotesk',sans-serif] text-7xl font-bold leading-none text-[#D9E3F6]">
            5.0
          </p>
          <div className="pb-1">
            <RatingStars rating={5} size="h-5 w-5" color="text-[#EEC200]" />
            <p className="mt-1 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#64748B]">
              7 total reviews
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {ratingBars.map((item) => (
            <div key={item.star} className="grid grid-cols-[16px_1fr_42px] items-center gap-4">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold text-[#D9E3F6]">
                {item.star}
              </span>
              <div className="h-3 overflow-hidden bg-[#2B3544]">
                <div
                  className="h-full"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="font-['Space_Grotesk',sans-serif] text-xs text-[#64748B]">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#2B3544] p-6">
        <div className="relative z-10">
          <h3 className="font-['Space_Grotesk',sans-serif] text-xl font-bold uppercase leading-7 text-[#D9E3F6]">
            Kategori
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {categories.map((item) => (
              <SkewTag key={item.label} label={item.label} className={item.className} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-2 text-[#D9E3F6]/10">
          <QuoteIcon />
        </div>
      </section>
    </aside>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="relative isolate flex flex-col gap-6 bg-[#121C2A] p-6 sm:flex-row sm:p-8">
      <div
        className="absolute bottom-0 left-0 top-0 w-1"
        style={{ backgroundColor: review.accent }}
      />
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center border-2 bg-[#212B39] font-['Space_Grotesk',sans-serif] text-2xl font-black text-[#D9E3F6]"
        style={{ borderColor: review.avatarAccent }}
      >
        {review.initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="font-['Space_Grotesk',sans-serif] text-xl font-bold uppercase leading-7 text-[#D9E3F6]">
              {review.name}
            </h4>
            <p className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#64748B]">
              {review.time}
            </p>
          </div>
          <RatingStars rating={review.rating} />
        </div>

        <p className="mt-4 font-['Be_Vietnam_Pro',sans-serif] text-base leading-8 text-[#E6BDB8] sm:text-lg">
          {review.text}
        </p>

        {review.photos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {review.photos.map((photo) => (
              <img
                key={photo.alt}
                src={photo.src}
                alt={photo.alt}
                className="h-24 w-24 border-2 border-[#212B39] object-cover saturate-50 transition hover:saturate-100"
              />
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#94A3B8] transition hover:text-[#D9E3F6]"
          >
            <LikeIcon />
            {review.helpful}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#94A3B8] transition hover:text-[#D9E3F6]"
          >
            <ReplyIcon />
            {review.replies}
          </button>
        </div>
      </div>
    </article>
  );
}

function ReviewForm() {
  const [rating, setRating] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className="relative overflow-hidden bg-[#16202E] p-6 sm:p-8 lg:p-12">
      <div className="relative z-10">
        <h2 className="font-['Space_Grotesk',sans-serif] text-3xl font-bold uppercase leading-10 text-[#D9E3F6] sm:text-4xl">
          Tinggalkan jejak anda
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
          <div className="grid gap-8 md:grid-cols-2">
            <label className="relative block pt-2">
              <span className="absolute left-4 top-0 bg-[#16202E] px-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#EEC200]">
                Identitas
              </span>
              <input
                type="text"
                name="name"
                placeholder="ALIASES ONLY..."
                className="h-16 w-full border-2 border-[#5C403C] bg-transparent px-4 pt-1 font-['Space_Grotesk',sans-serif] text-lg uppercase tracking-[0.08em] text-[#D9E3F6] outline-none transition placeholder:text-[#475569] focus:border-[#EEC200]"
              />
            </label>

            <div>
              <p className="mb-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#EEC200]">
                Rating
              </p>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`p-1 transition ${
                        value <= rating ? "text-[#EEC200]" : "text-[#475569] hover:text-[#94A3B8]"
                      }`}
                      aria-label={`Beri rating ${value}`}
                    >
                      <StarIcon className="h-[30px] w-[30px]" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <label className="relative block pt-2">
            <span className="absolute left-4 top-0 bg-[#16202E] px-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#EEC200]">
              Komentar
            </span>
            <textarea
              name="comment"
              placeholder="WHAT'S THE WORD ON THE STREET?"
              className="min-h-36 w-full resize-y border-2 border-[#5C403C] bg-transparent px-4 py-5 font-['Space_Grotesk',sans-serif] text-lg text-[#D9E3F6] outline-none transition placeholder:text-[#475569] focus:border-[#EEC200]"
            />
          </label>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="flex h-14 cursor-pointer items-center gap-2 border-2 border-dashed border-[#5C403C] px-4 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase text-[#94A3B8] transition hover:border-[#AC8884] hover:text-[#D9E3F6]">
                <CameraIcon />
                Add images (photos)
                <input type="file" name="photos" multiple accept="image/*" className="sr-only" />
              </label>
              <p className="max-w-[150px] font-['Be_Vietnam_Pro',sans-serif] text-[10px] font-bold uppercase leading-3 text-[#64748B]">
                Max 3 files, keep it real.
              </p>
            </div>

            <button
              type="submit"
              className="-skew-x-12 bg-[#DC2626] px-10 py-5 font-['Space_Grotesk',sans-serif] text-2xl font-black uppercase leading-8 text-[#FFF6F5] shadow-[8px_8px_0_#EEC200] transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[#EEC200] focus:ring-offset-2 focus:ring-offset-[#16202E]"
            >
              <span className="block skew-x-12">Kirim</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function Review() {
  return (
    <div className="min-h-screen bg-[#091421] text-[#D9E3F6]">
      <div className="h-1 bg-[#050F1C]" />

      <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 py-20 sm:px-8 lg:px-12 lg:py-24 xl:px-12">
        <header className="flex flex-col gap-2">
          <h1 className="font-['Space_Grotesk',sans-serif] text-6xl font-bold uppercase leading-none text-[#D9E3F6] sm:text-8xl">
            Reviews.
          </h1>
          <p className="font-['Be_Vietnam_Pro',sans-serif] text-sm font-bold uppercase leading-5 tracking-[0.1em] text-[#EEC200]">
            Kata-kata dari orang sigma
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(280px,373px)_1fr]">
          <RatingSummary />

          <div className="flex flex-col gap-8">
            {reviews.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
            <ReviewForm />
          </div>
        </div>
      </section>
    </div>
  );
}
