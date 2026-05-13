import { useEffect, useState } from "react";
import { createReview, getPublicReviews } from "../../../services/api";

const initialForm = {
  nama_pelanggan: "",
  rating: "5",
  komentar: "",
};

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      setIsLoading(true);

      try {
        const response = await getPublicReviews();

        if (isMounted) {
          setReviews(response.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await createReview({
        ...formData,
        rating: Number(formData.rating),
      });

      setReviews((current) => [response.data, ...current]);
      setFormData(initialForm);
      setSuccessMessage(response.message || "Review berhasil dikirim.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] bg-[#091421] px-6 py-20 text-[#D9E3F6] md:px-24">
      <div className="mx-auto grid max-w-[1088px] gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-4">
            <p className="font-['Space_Grotesk',sans-serif] text-sm font-bold uppercase tracking-[0.2em] text-[#FFB4AB]">
              Customer Voice
            </p>
            <h1 className="font-['Space_Grotesk',sans-serif] text-6xl font-black uppercase tracking-[-0.05em] md:text-8xl">
              Review
            </h1>
            <p className="max-w-xl font-['Be_Vietnam_Pro',sans-serif] text-base leading-8 text-[#E6BDB8] md:text-lg">
              Review pelanggan sekarang tersambung ke endpoint backend, jadi data baru langsung masuk dari form ini.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 border border-[#2B3544] bg-[#121C2A] p-6"
          >
            <input
              name="nama_pelanggan"
              value={formData.nama_pelanggan}
              onChange={handleChange}
              placeholder="Nama pelanggan"
              className="h-12 border border-[#2B3544] bg-[#091421] px-4 text-sm text-white outline-none transition placeholder:text-[#64748B] focus:border-[#EEC200]"
            />

            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="h-12 border border-[#2B3544] bg-[#091421] px-4 text-sm text-white outline-none transition focus:border-[#EEC200]"
            >
              <option value="5">5 - Sangat puas</option>
              <option value="4">4 - Puas</option>
              <option value="3">3 - Cukup</option>
              <option value="2">2 - Kurang</option>
              <option value="1">1 - Buruk</option>
            </select>

            <textarea
              name="komentar"
              value={formData.komentar}
              onChange={handleChange}
              placeholder="Tulis pengalamanmu"
              className="min-h-[136px] resize-none border border-[#2B3544] bg-[#091421] px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-[#64748B] focus:border-[#EEC200]"
            />

            {errorMessage && (
              <div className="border border-[#DC2626]/40 bg-[#3B1115] px-4 py-3 text-sm text-[#FFB4AB]">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="border border-[#4AE176]/40 bg-[#0F2317] px-4 py-3 text-sm text-[#4AE176]">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 bg-[#DC2626] px-5 font-['Space_Grotesk',sans-serif] text-sm font-bold uppercase text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-[#7F1D1D]"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Review"}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-5">
          {isLoading ? (
            <div className="border border-[#2B3544] bg-[#121C2A] px-6 py-10 text-sm text-[#94A3B8]">
              Memuat review...
            </div>
          ) : reviews.length === 0 ? (
            <div className="border border-[#2B3544] bg-[#121C2A] px-6 py-10 text-sm text-[#94A3B8]">
              Belum ada review.
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="border border-[#2B3544] bg-[#121C2A] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-['Space_Grotesk',sans-serif] text-xl font-bold uppercase text-white">
                    {review.nama_pelanggan}
                  </h2>
                  <span className="border border-[#EEC200]/40 bg-[#332800] px-3 py-2 font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase text-[#EEC200]">
                    Rating {review.rating}/5
                  </span>
                </div>
                <p className="mt-4 font-['Be_Vietnam_Pro',sans-serif] text-sm leading-7 text-[#CBD5E1]">
                  {review.komentar}
                </p>
                {review.balasan_admin && (
                  <div className="mt-5 border-l-2 border-[#4AE176] bg-[#0F2317] px-4 py-3 text-sm leading-6 text-[#D9E3F6]">
                    <span className="font-bold text-[#4AE176]">Balasan admin:</span>{" "}
                    {review.balasan_admin}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
