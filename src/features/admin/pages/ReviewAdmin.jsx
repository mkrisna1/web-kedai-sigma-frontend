import { useEffect, useMemo, useState } from "react";
import { getAdminReviews, replyAdminReview } from "../../../services/api";

function Stars({ rating }) {
  return (
    <div className="flex gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < Number(rating || 0) ? "*" : "-"}</span>
      ))}
    </div>
  );
}

export default function ReviewAdmin() {
  const [reviews, setReviews] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadReviews = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAdminReviews();
      const data = response.data || [];

      setReviews(data);
      setReplyDrafts(
        data.reduce((drafts, review) => {
          drafts[review.id] = review.balasan_admin || "";
          return drafts;
        }, {}),
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return reviews;
    }

    return reviews.filter((review) =>
      [review.nama_pelanggan, review.komentar, review.balasan_admin]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [reviews, searchQuery]);

  const averageRating = useMemo(() => {
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return reviews.length ? (total / reviews.length).toFixed(1) : "0.0";
  }, [reviews]);

  const breakdown = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((rating) => {
        const count = reviews.filter((review) => Number(review.rating) === rating).length;
        const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0;

        return { rating, count, percent };
      }),
    [reviews],
  );

  const handleReply = async (review) => {
    const reply = replyDrafts[review.id]?.trim();

    if (!reply) {
      setErrorMessage("Balasan tidak boleh kosong.");
      return;
    }

    setUpdatingId(review.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await replyAdminReview(review.id, reply);
      setReviews((current) =>
        current.map((item) => (item.id === review.id ? response.data : item)),
      );
      setSuccessMessage(response.message || "Balasan review berhasil disimpan.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Review</h1>
          <p className="mt-1 text-sm text-slate-500">
            Admin bisa membalas review, dan balasan tetap terlihat di halaman publik.
          </p>
        </div>
        <button
          type="button"
          onClick={loadReviews}
          className="h-11 rounded-lg bg-slate-900 px-5 text-sm font-bold text-white hover:bg-slate-700"
        >
          Refresh
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <article className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            Overall Rating
          </p>
          <p className="mt-3 text-5xl font-black text-slate-950">
            {averageRating}
            <span className="text-xl text-slate-400">/5</span>
          </p>
          <div className="mt-3">
            <Stars rating={Math.round(Number(averageRating))} />
          </div>
          <p className="mt-3 text-sm text-slate-500">{reviews.length} review masuk</p>
        </article>

        <article className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            Rating Breakdown
          </p>
          <div className="mt-5 space-y-3">
            {breakdown.map((item) => (
              <div key={item.rating} className="flex items-center gap-4">
                <span className="w-8 text-sm font-bold text-slate-600">{item.rating}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="w-20 text-right text-xs font-bold text-slate-500">
                  {item.count} review
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Cari nama, komentar, atau balasan"
        className="h-11 max-w-md rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
      />

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg bg-white p-8 text-sm font-semibold text-slate-500">
          Memuat review...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-sm font-semibold text-slate-500">
          Belum ada review yang cocok.
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredReviews.map((review) => (
            <article key={review.id} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    {review.nama_pelanggan}
                  </h2>
                  <div className="mt-1 flex items-center gap-3">
                    <Stars rating={review.rating} />
                    <span className="text-xs font-semibold text-slate-500">
                      Rating {review.rating}/5
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {review.created_at
                    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                        new Date(review.created_at),
                      )
                    : "-"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-700">{review.komentar}</p>

              {review.balasan_admin && (
                <div className="mt-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
                  <span className="font-black">Balasan admin:</span> {review.balasan_admin}
                </div>
              )}

              <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_140px]">
                <textarea
                  value={replyDrafts[review.id] || ""}
                  onChange={(event) =>
                    setReplyDrafts((current) => ({
                      ...current,
                      [review.id]: event.target.value,
                    }))
                  }
                  className="min-h-24 resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  placeholder="Tulis balasan admin"
                />
                <button
                  type="button"
                  disabled={updatingId === review.id}
                  onClick={() => handleReply(review)}
                  className="h-11 self-end rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  Balas
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
