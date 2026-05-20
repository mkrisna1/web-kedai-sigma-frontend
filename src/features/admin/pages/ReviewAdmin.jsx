import { useEffect, useMemo, useState } from "react";
import {
  deleteAdminReviewPhoto,
  deleteAdminReview,
  getAdminReviews,
  replyAdminReview,
} from "../../../services/api";

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

const mapReviewFromApi = (review) => {
  const photos = Array.isArray(review.foto_review) ? review.foto_review : [];

  return {
    rawId: review.id,
    name: review.nama_pelanggan || "-",
    item: "Review Kedai",
    date: formatReviewTime(review.created_at),
    createdAt: review.created_at || "",
    rating: Number(review.rating) || 0,
    comment: review.komentar || "",
    reply: review.balasan_admin || "",
    initials: getInitials(review.nama_pelanggan),
    photos: photos.map((src, index) => ({
      index,
      src,
      alt: `Foto review ${review.nama_pelanggan || "pelanggan"} ${index + 1}`,
    })),
  };
};

const reviewSortOptions = [
  { value: "latest", label: "Terbaru" },
  { value: "highest", label: "Rating Tertinggi" },
  { value: "lowest", label: "Rating Terendah" },
];

const getReviewTimeValue = (review) => {
  const time = new Date(review.createdAt).getTime();

  return Number.isNaN(time) ? 0 : time;
};

function StarIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="m12 2 2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 16.81l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2Z" />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrendIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m4 16 6-6 4 4 6-8M14 6h6v6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className = "h-3 w-3" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stars({ size = "h-5 w-5", rating = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={`${size} ${index < rating ? "text-[#784B00]" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

const getRatingLabel = (averageRating, totalReviews) => {
  if (totalReviews === 0) {
    return "Belum ada nilai";
  }

  if (averageRating >= 4.5) {
    return "Nilai sangat baik";
  }

  if (averageRating >= 3.5) {
    return "Nilai baik";
  }

  if (averageRating >= 2.5) {
    return "Nilai cukup";
  }

  return "Perlu ditingkatkan";
};

function ReviewCard({ review, onDelete, onPhotoClick, onReply }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex gap-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE] text-sm font-extrabold text-[#004AC6] shadow-[0_0_0_4px_#ECEEF0]">
          {review.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-bold text-[#191C1E]">
                {review.name}
              </h3>
              <span className="rounded-full bg-[#ECEEF0] px-2 py-1 text-xs text-[#434655]">
                {review.item}
              </span>
              <span className="text-[10px] font-medium text-[#434655]">
                {review.date}
              </span>
            </div>

            <Stars size="h-3 w-3" rating={review.rating} />
          </div>

          <p className="mt-2 text-sm leading-[23px] text-[#191C1E]">
            {review.comment}
          </p>
          {review.reply && (
            <p className="mt-3 rounded-lg bg-[#EFF6FF] px-4 py-3 text-xs font-semibold leading-5 text-[#004AC6]">
              Balasan admin: {review.reply}
            </p>
          )}

          {review.photos?.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.photos.map((photo) => (
                <figure
                  key={photo.src}
                  className="group relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                >
                  <button
                    type="button"
                    onClick={() => onPhotoClick(review, photo)}
                    className="h-full w-full focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    aria-label={`Perbesar ${photo.alt}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </button>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#434655]">
              <CheckIcon />
              <span>Tidak ada foto review</span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onReply(review)}
              className="rounded bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
            >
              Balas opsional
            </button>
            <button
              type="button"
              onClick={() => onDelete(review)}
              className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function PhotoPreviewModal({ target, onClose, onDelete }) {
  if (!target) {
    return null;
  }

  const { photo } = target;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Preview foto review"
      onMouseDown={onClose}
    >
      <section
        className="relative flex max-h-[92vh] w-fit max-w-[92vw] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[#434655]">
            Foto Review
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#E6E8EA] px-4 py-2 text-xs font-black uppercase text-[#191C1E] transition hover:bg-[#DDE1E6]"
          >
            Tutup
          </button>
        </header>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-4">
          <img
            src={photo.src}
            alt={photo.alt}
            className="block max-h-[74vh] max-w-[86vw] object-contain"
          />
        </div>
        <footer className="flex justify-end border-t border-slate-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={() => onDelete(target)}
            className="rounded-lg bg-[#BA1A1A] px-5 py-2 text-xs font-black uppercase text-white transition hover:brightness-105"
          >
            Hapus Foto
          </button>
        </footer>
      </section>
    </div>
  );
}

function ReplyModal({ review, onClose, onSave }) {
  const [reply, setReply] = useState("");

  useEffect(() => {
    setReply("");
  }, [review?.rawId]);

  if (!review) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!reply.trim()) {
      return;
    }

    onSave(review, reply.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[520px] animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/25"
      >
        <header className="border-b border-[#E6E8EA] px-6 py-5">
          <h2 className="text-xl font-extrabold text-[#191C1E]">
            Balas Review Opsional
          </h2>
          <p className="mt-1 text-xs font-semibold text-[#434655]">
            {review.name}
          </p>
        </header>
        <div className="p-6">
          <textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            className="min-h-32 w-full resize-y rounded-lg border border-[#C3C6D7] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#191C1E] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            placeholder="Tulis balasan admin..."
          />
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
            type="submit"
            className="h-11 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-6 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:brightness-105"
          >
            Simpan Balasan Opsional
          </button>
        </footer>
      </form>
    </div>
  );
}

function DeleteReviewModal({ review, onClose, onConfirm }) {
  if (!review) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <section className="w-full max-w-sm animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] rounded-2xl bg-white p-8 shadow-2xl shadow-black/25">
        <h2 className="text-xl font-bold text-[#191C1E]">
          Hapus review dari {review.name}?
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#434655]">
          Review ini akan hilang dari halaman admin dan halaman review pelanggan.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg bg-[#E6E8EA] text-sm font-bold text-[#191C1E] transition hover:brightness-95"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(review)}
            className="h-11 rounded-lg bg-[#BA1A1A] text-sm font-bold text-white transition hover:brightness-105"
          >
            Hapus
          </button>
        </div>
      </section>
    </div>
  );
}

function DeletePhotoModal({ target, onClose, onConfirm }) {
  if (!target) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-[admin-modal-backdrop_180ms_ease-out] items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <section className="w-full max-w-sm animate-[admin-modal-panel_240ms_cubic-bezier(0.16,1,0.3,1)] rounded-2xl bg-white p-8 shadow-2xl shadow-black/25">
        <h2 className="text-xl font-bold text-[#191C1E]">
          Hapus foto review?
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#434655]">
          Foto dari review {target.review.name} akan hilang dari halaman admin dan halaman review pelanggan.
        </p>
        <img
          src={target.photo.src}
          alt={target.photo.alt}
          className="mt-5 h-36 w-full rounded-lg border border-slate-200 object-cover"
        />
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg bg-[#E6E8EA] text-sm font-bold text-[#191C1E] transition hover:brightness-95"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(target)}
            className="h-11 rounded-lg bg-[#BA1A1A] text-sm font-bold text-white transition hover:brightness-105"
          >
            Hapus Foto
          </button>
        </div>
      </section>
    </div>
  );
}

export default function ReviewAdmin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(2);
  const [reviews, setReviews] = useState([]);
  const [replyTarget, setReplyTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePhotoTarget, setDeletePhotoTarget] = useState(null);
  const [previewPhotoTarget, setPreviewPhotoTarget] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getAdminReviews()
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

  const filteredReviews = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return reviews;
    }

    return reviews.filter((review) =>
      [
        review.name,
        review.item,
        review.date,
        review.comment,
        review.reply,
        review.photos?.length ? "foto review" : "",
        "balas opsional",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [reviews, searchQuery]);

  const sortedReviews = useMemo(() => {
    const nextReviews = [...filteredReviews];

    if (sortOption === "highest") {
      return nextReviews.sort(
        (a, b) =>
          b.rating - a.rating ||
          getReviewTimeValue(b) - getReviewTimeValue(a),
      );
    }

    if (sortOption === "lowest") {
      return nextReviews.sort(
        (a, b) =>
          a.rating - b.rating ||
          getReviewTimeValue(b) - getReviewTimeValue(a),
      );
    }

    return nextReviews.sort((a, b) => getReviewTimeValue(b) - getReviewTimeValue(a));
  }, [filteredReviews, sortOption]);

  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const canLoadMore = visibleCount < sortedReviews.length;
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((total, review) => total + review.rating, 0) /
        totalReviews;
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const totalByStars = reviews.filter((review) => review.rating === stars).length;
    const percent =
      totalReviews === 0 ? 0 : Math.round((totalByStars / totalReviews) * 100);

    return {
      stars,
      percent,
      color:
        stars >= 4
          ? "bg-[#006C49]"
          : stars === 3
            ? "bg-[#996100]"
            : "bg-[#BA1A1A]",
    };
  });

  const handleReply = async (review, reply) => {
    try {
      const response = await replyAdminReview(review.rawId, reply);
      const updatedReview = mapReviewFromApi(response.data);

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item.rawId === updatedReview.rawId ? updatedReview : item,
        ),
      );
      setReplyTarget(null);
    } catch (error) {
      console.error("Gagal membalas review:", error);
    }
  };

  const handleDelete = async (review) => {
    try {
      await deleteAdminReview(review.rawId);
      setReviews((currentReviews) =>
        currentReviews.filter((item) => item.rawId !== review.rawId),
      );
      setDeleteTarget(null);
    } catch (error) {
      console.error("Gagal menghapus review:", error);
    }
  };

  const handleDeletePhoto = async ({ review, photo }) => {
    try {
      const response = await deleteAdminReviewPhoto(review.rawId, photo.index);
      const updatedReview = mapReviewFromApi(response.data);

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item.rawId === updatedReview.rawId ? updatedReview : item,
        ),
      );
      setDeletePhotoTarget(null);
    } catch (error) {
      console.error("Gagal menghapus foto review:", error);
    }
  };

  return (
    <section className="flex w-full flex-col gap-6 bg-[#F7F9FB] font-['Inter',Arial,sans-serif] text-[#191C1E]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="search"
            placeholder="Cari review..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setVisibleCount(2);
            }}
            className="h-[38px] w-full border-0 border-b-2 border-[#C3C6D7] bg-white py-2 pl-10 pr-4 text-sm text-[#191C1E] outline-none placeholder:text-[#6B7280] focus:border-[#004AC6]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {reviewSortOptions.map((option) => {
            const isActive = sortOption === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSortOption(option.value);
                  setVisibleCount(2);
                }}
                className={`h-9 rounded-lg px-4 text-xs font-black uppercase tracking-[0.08em] transition ${
                  isActive
                    ? "bg-[#004AC6] text-white shadow-sm"
                    : "bg-white text-[#434655] hover:bg-[#EFF6FF] hover:text-[#004AC6]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <article className="flex min-h-[210px] flex-col justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-[#434655]">
              Rating Keseluruhan
            </h2>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-black leading-none tracking-[-0.05em] text-[#191C1E]">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xl text-[#434655]">/ 5</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-base font-bold text-[#006C49]">
              <TrendIcon />
              <span>{getRatingLabel(averageRating, totalReviews)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <Stars rating={Math.round(averageRating)} />
            <span className="pl-1 text-sm font-medium text-[#434655]">
              ({totalReviews} Review)
            </span>
          </div>
        </article>

        <article className="rounded-xl border border-slate-100 bg-white px-6 py-8 shadow-sm">
          <h2 className="pb-6 text-sm font-bold uppercase tracking-[0.1em] text-[#434655]">
            Rincian Rating
          </h2>
          <div className="flex flex-col gap-3">
            {breakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <span className="w-4 text-xs font-bold text-[#434655]">
                  {item.stars}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#ECEEF0]">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-[#434655]">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-[-0.025em] text-[#191C1E]">
          Review Pelanggan
        </h2>

        <div className="flex flex-col gap-4">
          {visibleReviews.length > 0 ? (
            visibleReviews.map((review) => (
              <ReviewCard
                key={review.rawId}
                review={review}
                onDelete={setDeleteTarget}
                onPhotoClick={(targetReview, photo) =>
                  setPreviewPhotoTarget({ review: targetReview, photo })
                }
                onReply={setReplyTarget}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-[#434655]">
              Tidak ada review yang cocok.
            </div>
          )}
        </div>

        {canLoadMore && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((current) =>
                  Math.min(current + 2, sortedReviews.length),
                )
              }
              className="flex h-12 items-center gap-2 rounded-xl border-2 border-slate-200 px-8 text-sm font-bold text-[#434655] transition hover:border-slate-300 hover:bg-white"
            >
              Muat Review Lagi
              <ChevronDownIcon />
            </button>
          </div>
        )}
      </div>

      <ReplyModal
        review={replyTarget}
        onClose={() => setReplyTarget(null)}
        onSave={handleReply}
      />
      <PhotoPreviewModal
        target={previewPhotoTarget}
        onClose={() => setPreviewPhotoTarget(null)}
        onDelete={(target) => {
          setPreviewPhotoTarget(null);
          setDeletePhotoTarget(target);
        }}
      />
      <DeleteReviewModal
        review={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <DeletePhotoModal
        target={deletePhotoTarget}
        onClose={() => setDeletePhotoTarget(null)}
        onConfirm={handleDeletePhoto}
      />
    </section>
  );
}
