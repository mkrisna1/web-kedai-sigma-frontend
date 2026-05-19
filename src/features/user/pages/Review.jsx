import { useEffect, useMemo, useState } from "react";
import logoSigma from "../../../assets/Logo Sigma.png";
import {
  createPublicReview,
  getPublicReviews,
  likePublicReview,
} from "../../../services/api";

const LIKE_STORAGE_KEY = "kedai-sigma-liked-reviews";
const REVIEW_PHOTO_MAX_COUNT = 5;
const REVIEW_PHOTO_MAX_DIMENSION = 1600;
const REVIEW_PHOTO_TARGET_BYTES = 1200 * 1024;
const REVIEW_PHOTO_MIN_QUALITY = 0.62;

const advantages = [
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

const getInitials = (name) =>
  String(name || "-")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const formatReviewTime = (value) => {
  if (!value) {
    return "Baru saja";
  }

  const createdAt = new Date(value);
  const diffInMinutes = Math.round((createdAt.getTime() - Date.now()) / 60000);
  const formatter = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);

  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, "hour");
  }

  return formatter.format(Math.round(diffInHours / 24), "day");
};

const readLikedReviews = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedLikes = JSON.parse(window.localStorage.getItem(LIKE_STORAGE_KEY));

    return Array.isArray(storedLikes) ? storedLikes.map(String) : [];
  } catch (error) {
    console.warn("Gagal membaca data like review:", error);
    return [];
  }
};

const saveLikedReviews = (reviewIds) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(reviewIds));
};

const loadPhotoImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Foto tidak bisa dibaca."));
    };

    image.src = url;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });

const compressReviewPhoto = async (file) => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  try {
    const image = await loadPhotoImage(file);
    const originalWidth = image.naturalWidth || image.width;
    const originalHeight = image.naturalHeight || image.height;
    const scale = Math.min(
      1,
      REVIEW_PHOTO_MAX_DIMENSION / Math.max(originalWidth, originalHeight),
    );
    const width = Math.max(1, Math.round(originalWidth * scale));
    const height = Math.max(1, Math.round(originalHeight * scale));
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

    let quality = 0.84;
    let blob = await canvasToBlob(canvas, "image/jpeg", quality);

    while (
      blob &&
      blob.size > REVIEW_PHOTO_TARGET_BYTES &&
      quality > REVIEW_PHOTO_MIN_QUALITY
    ) {
      quality = Math.max(REVIEW_PHOTO_MIN_QUALITY, quality - 0.08);
      blob = await canvasToBlob(canvas, "image/jpeg", quality);
    }

    if (!blob) {
      throw new Error("Foto tidak bisa diproses.");
    }

    const nameWithoutExtension = file.name.replace(/\.[^.]+$/, "") || "review-photo";

    return new File([blob], `${nameWithoutExtension}.jpg`, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch (error) {
    console.warn("Gagal mengoptimalkan foto review:", error);
    throw error;
  }
};

const mapReviewFromApi = (review) => {
  const photos = Array.isArray(review.foto_review) ? review.foto_review : [];
  const likes = Number(review.likes_count) || 0;

  return {
    id: review.id,
    name: review.nama_pelanggan || "-",
    time: formatReviewTime(review.created_at),
    rating: Number(review.rating) || 0,
    accent: "#DC2626",
    avatarAccent: "#EEC200",
    initials: getInitials(review.nama_pelanggan),
    text: review.komentar || "",
    likes,
    helpful: `${likes} suka`,
    replies: review.balasan_admin ? "1 balasan" : "Balas",
    adminReply: review.balasan_admin || "",
    photos: photos.map((src, index) => ({
      src,
      alt: `Foto review ${review.nama_pelanggan || "pelanggan"} ${index + 1}`,
    })),
  };
};

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

function SuccessIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white [animation:review-check-pop_450ms_ease-out_120ms_both]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.5 16.6 4.9 12l-1.4 1.4 6 6L21 7.9 19.6 6.5 9.5 16.6Z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
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

function RatingSummary({ reviews }) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((total, review) => total + review.rating, 0) /
        totalReviews;
  const ratingBars = [5, 4, 3, 2, 1].map((star) => {
    const totalByStar = reviews.filter((review) => review.rating === star).length;
    const percent =
      totalReviews === 0 ? 0 : Math.round((totalByStar / totalReviews) * 100);

    return {
      star,
      percent,
      color: star <= 2 ? "#DC2626" : "#00B954",
    };
  });

  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-[127px]">
      <section className="border-l-8 border-[#EEC200] bg-[#121C2A] p-6 sm:p-8">
        <div className="flex flex-wrap items-end gap-4">
          <p className="font-['Space_Grotesk',sans-serif] text-7xl font-bold leading-none text-[#D9E3F6]">
            {averageRating.toFixed(1)}
          </p>
          <div className="pb-1">
            <RatingStars
              rating={Math.round(averageRating)}
              size="h-5 w-5"
              color="text-[#EEC200]"
            />
            <p className="mt-1 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 tracking-[0.1em] text-[#64748B]">
              {totalReviews} total review
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
            Keunggulan
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {advantages.map((item) => (
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

function ReviewCard({ review, isLiked, onLike, onPhotoClick }) {
  const [isReplyOpen, setIsReplyOpen] = useState(false);

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

        {review.photos?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {review.photos.map((photo) => (
              <button
                key={photo.alt}
                type="button"
                onClick={() => onPhotoClick(photo)}
                className="group relative h-24 w-24 overflow-hidden border-2 border-[#212B39] bg-[#091421] focus:outline-none focus:ring-2 focus:ring-[#EEC200]"
                aria-label={`Perbesar ${photo.alt}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover saturate-50 transition group-hover:scale-105 group-hover:saturate-100"
                />
                <span className="absolute inset-x-1 bottom-1 bg-black/70 px-2 py-1 font-['Space_Grotesk',sans-serif] text-[10px] font-black uppercase text-white opacity-0 transition group-hover:opacity-100 group-focus:opacity-100">
                  Lihat
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onLike(review)}
            disabled={isLiked}
            className="flex items-center gap-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#94A3B8] transition hover:text-[#D9E3F6] disabled:cursor-not-allowed disabled:text-[#EEC200]"
            aria-pressed={isLiked}
          >
            <LikeIcon />
            {isLiked ? `${review.likes} suka` : review.helpful}
          </button>
          <button
            type="button"
            onClick={() =>
              review.adminReply && setIsReplyOpen((current) => !current)
            }
            aria-expanded={review.adminReply ? isReplyOpen : undefined}
            className="flex items-center gap-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#94A3B8] transition hover:text-[#D9E3F6]"
          >
            <ReplyIcon />
            {review.replies}
          </button>
        </div>

        {review.adminReply && isReplyOpen && (
          <div className="mt-5 border-l-4 border-[#EEC200] bg-[#16202E] px-5 py-4 font-['Be_Vietnam_Pro',sans-serif]">
            <p className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase leading-4 text-[#EEC200]">
              Balasan admin
            </p>
            <p className="mt-2 text-sm leading-6 text-[#D9E3F6]">
              {review.adminReply}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function PhotoPreviewModal({ photo, onClose }) {
  if (!photo) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 [animation:review-backdrop-in_220ms_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label="Preview foto review"
      onMouseDown={onClose}
    >
      <section
        className="relative flex max-h-[92vh] w-fit max-w-[92vw] flex-col overflow-hidden bg-[#091421] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
          <p className="font-['Space_Grotesk',sans-serif] text-xs font-black uppercase tracking-[0.18em] text-[#EEC200]">
            Foto Review
          </p>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#DC2626] px-4 py-2 font-['Space_Grotesk',sans-serif] text-xs font-black uppercase text-white transition hover:bg-red-700"
          >
            Tutup
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-[#091421] p-4">
          <img
            src={photo.src}
            alt={photo.alt}
            className="block max-h-[78vh] max-w-[86vw] object-contain"
          />
        </div>
      </section>
    </div>
  );
}

function ReviewSuccessPopup({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 [animation:review-backdrop-in_220ms_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-success-title"
    >
      <div className="relative h-auto min-h-[415px] w-full max-w-[850px] overflow-hidden rounded-xl bg-[#091421] font-['Be_Vietnam_Pro',sans-serif] text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] [animation:review-popup-in_320ms_cubic-bezier(0.16,1,0.3,1)] sm:h-[415px]">
        <div className="flex h-[53px] items-center border-b border-white/40 px-6 sm:px-0">
          <p className="mx-auto font-['Be_Vietnam_Pro',sans-serif] text-xl leading-5 text-white sm:ml-[369px] sm:mr-0 sm:w-[305px]">
            Sistem
          </p>
        </div>

        <div className="relative flex min-h-[306px] flex-col items-center gap-8 px-6 py-10 text-center sm:block sm:px-0 sm:py-0">
          <img
            src={logoSigma}
            alt="Logo Kedai Sigma"
            className="h-[172px] w-[172px] object-contain sm:absolute sm:left-[34px] sm:top-[27px] sm:h-[234px] sm:w-[233px]"
          />

          <div className="hidden border-t border-white/15 sm:absolute sm:left-[223px] sm:top-[86px] sm:block sm:w-[627px]" />

          <h2
            id="review-success-title"
            className="font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase leading-8 tracking-[-1.2px] text-white sm:absolute sm:left-[300px] sm:top-[33px] sm:flex sm:h-[38px] sm:w-[367px] sm:items-center"
          >
            Terima kasih sudah review!
          </h2>

          <div className="flex items-start gap-3 sm:absolute sm:left-[253px] sm:top-[95px]">
            <SuccessIcon />
            <p className="max-w-[409px] text-left font-['Be_Vietnam_Pro',sans-serif] text-xl leading-6 text-white/50 sm:flex sm:h-[60px] sm:items-center sm:leading-5">
              Terima kasih banyak sudah memberikan review! Masukan dari kamu bakal bantu kami jadi
              lebih baik lagi!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-14 w-full items-center justify-center gap-2 bg-[#DC2626] px-4 py-4 font-['Space_Grotesk',sans-serif] text-base font-bold uppercase leading-6 tracking-[1.6px] text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[#EEC200] focus:ring-inset"
        >
          Review berhasil
        </button>
      </div>
    </div>
  );
}

function ReviewForm({ onReviewCreated }) {
  const [rating, setRating] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submitWarning, setSubmitWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparingPhotos, setIsPreparingPhotos] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    return () => {
      photoPreviews.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [photoPreviews]);

  function clearSubmitWarning() {
    if (submitWarning) {
      setSubmitWarning("");
    }
  }

  async function handlePhotoChange(event) {
    clearSubmitWarning();

    const files = Array.from(event.target.files || []).slice(0, REVIEW_PHOTO_MAX_COUNT);

    setIsPreparingPhotos(true);

    try {
      const preparedFiles = await Promise.all(files.map(compressReviewPhoto));
      const previews = preparedFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      photoPreviews.forEach((photo) => URL.revokeObjectURL(photo.url));
      setPhotoFiles(preparedFiles);
      setPhotoPreviews(previews);
    } catch (error) {
      console.error("Gagal memproses foto review:", error);
      setPhotoFiles([]);
      setSubmitWarning("Foto belum bisa diproses. Coba pilih ulang fotonya ya.");
    } finally {
      setIsPreparingPhotos(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const comment = formData.get("comment")?.toString().trim();

    if (!name || !comment || rating === 0) {
      setSubmitWarning("Review belum lengkap. Isi identitas, pilih rating, dan tulis komentar dulu ya.");
      return;
    }

    if (isPreparingPhotos) {
      setSubmitWarning("Foto masih diproses. Tunggu sebentar lalu kirim lagi ya.");
      return;
    }

    setIsSubmitting(true);
    setSubmitWarning("");

    try {
      const reviewPayload = new FormData();
      reviewPayload.append("nama_pelanggan", name);
      reviewPayload.append("rating", String(rating));
      reviewPayload.append("komentar", comment);

      photoFiles
        .slice(0, REVIEW_PHOTO_MAX_COUNT)
        .forEach((file) => reviewPayload.append("photos[]", file));

      const response = await createPublicReview(reviewPayload);

      onReviewCreated?.(mapReviewFromApi(response.data));
      form.reset();
      photoPreviews.forEach((photo) => URL.revokeObjectURL(photo.url));
      setPhotoFiles([]);
      setPhotoPreviews([]);
      setRating(0);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Gagal mengirim review:", error);
      setSubmitWarning(error.message || "Review belum bisa dikirim. Coba lagi sebentar ya.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
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
                  placeholder="NAMA PANGGILAN..."
                  onChange={clearSubmitWarning}
                  aria-invalid={Boolean(submitWarning)}
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
                        onClick={() => {
                          setRating(value);
                          clearSubmitWarning();
                        }}
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
                placeholder="TULIS KESANMU DI SINI..."
                onChange={clearSubmitWarning}
                aria-invalid={Boolean(submitWarning)}
                className="min-h-36 w-full resize-y border-2 border-[#5C403C] bg-transparent px-4 py-5 font-['Space_Grotesk',sans-serif] text-lg text-[#D9E3F6] outline-none transition placeholder:text-[#475569] focus:border-[#EEC200]"
              />
            </label>

            {submitWarning && (
              <div
                className="flex items-start gap-3 border-l-4 border-[#DC2626] bg-[#DC2626]/15 px-4 py-3 font-['Be_Vietnam_Pro',sans-serif] text-sm leading-5 text-[#FFD6D1] [animation:review-warning-in_180ms_ease-out]"
                role="alert"
              >
                <AlertIcon />
                <p>{submitWarning}</p>
              </div>
            )}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <label className="flex h-14 cursor-pointer items-center gap-2 border-2 border-dashed border-[#5C403C] px-4 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase text-[#94A3B8] transition hover:border-[#AC8884] hover:text-[#D9E3F6]">
                  <CameraIcon />
                  Tambah foto
                  <input
                    type="file"
                    name="photos"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>
                <p className="max-w-[150px] font-['Be_Vietnam_Pro',sans-serif] text-[10px] font-bold uppercase leading-3 text-[#64748B]">
                  Maksimal 5 foto.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isPreparingPhotos}
                className="-skew-x-12 bg-[#DC2626] px-10 py-5 font-['Space_Grotesk',sans-serif] text-2xl font-black uppercase leading-8 text-[#FFF6F5] shadow-[8px_8px_0_#EEC200] transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[#EEC200] focus:ring-offset-2 focus:ring-offset-[#16202E] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="block skew-x-12">
                  {isPreparingPhotos ? "Proses Foto..." : isSubmitting ? "Kirim..." : "Kirim"}
                </span>
              </button>
            </div>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {photoPreviews.map((photo) => (
                  <figure
                    key={photo.id}
                    className="overflow-hidden border-2 border-[#5C403C] bg-[#091421]"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="h-24 w-full object-cover"
                    />
                  </figure>
                ))}
              </div>
            )}
          </form>
        </div>
      </section>

      {showSuccessPopup && <ReviewSuccessPopup onClose={() => setShowSuccessPopup(false)} />}
    </>
  );
}

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [likedReviews, setLikedReviews] = useState(readLikedReviews);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getPublicReviews()
      .then((response) => {
        if (isMounted) {
          setReviews((response.data || []).map(mapReviewFromApi));
        }
      })
      .catch(() => {
        if (isMounted) {
          setReviews([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLikeReview = async (review) => {
    const reviewId = String(review.id || "");

    if (!reviewId || likedReviews.includes(reviewId)) {
      return;
    }

    const nextLikedReviews = [...likedReviews, reviewId];
    setLikedReviews(nextLikedReviews);
    saveLikedReviews(nextLikedReviews);
    setReviews((currentReviews) =>
      currentReviews.map((item) =>
        String(item.id) === reviewId
          ? {
              ...item,
              likes: item.likes + 1,
              helpful: `${item.likes + 1} suka`,
            }
          : item,
      ),
    );

    try {
      const response = await likePublicReview(review.id);
      const updatedReview = mapReviewFromApi(response.data);

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          String(item.id) === reviewId ? updatedReview : item,
        ),
      );
    } catch (error) {
      console.error("Gagal menyimpan like review:", error);
    }
  };

  const sortedReviews = useMemo(() => reviews, [reviews]);

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
          <RatingSummary reviews={sortedReviews} />

          <div className="flex flex-col gap-8">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.id || review.name}
                review={review}
                isLiked={likedReviews.includes(String(review.id))}
                onLike={handleLikeReview}
                onPhotoClick={setPreviewPhoto}
              />
            ))}
            {sortedReviews.length === 0 && (
              <div className="bg-[#121C2A] p-8 font-['Be_Vietnam_Pro',sans-serif] text-sm leading-6 text-[#E6BDB8]">
                Belum ada review.
              </div>
            )}
            <ReviewForm
              onReviewCreated={(review) =>
                setReviews((currentReviews) => [review, ...currentReviews])
              }
            />
          </div>
        </div>
      </section>
      <PhotoPreviewModal
        photo={previewPhoto}
        onClose={() => setPreviewPhoto(null)}
      />
    </div>
  );
}
