const breakdown = [
  { stars: 5, percent: 100, color: "bg-[#006C49]" },
  { stars: 4, percent: 0, color: "bg-[#006C49]/70" },
  { stars: 3, percent: 0, color: "bg-[#996100]" },
  { stars: 2, percent: 0, color: "bg-[#BA1A1A]/60" },
  { stars: 1, percent: 0, color: "bg-[#BA1A1A]" },
];

const reviews = [
  {
    name: "Jagat Satrio Wibowo",
    item: "Kopi Susu Sigma",
    date: "2 hours ago",
    rating: 5,
    comment: "Tenang Asik,",
    verified: true,
    initials: "JS",
  },
  {
    name: "Rizkaa Auliaa",
    item: "Indomie Nyemek Halu",
    date: "4 hours ago",
    rating: 5,
    comment: "cozy, konsep keren, harga menu masih afordeble.",
    verified: false,
    initials: "RA",
    attachment: "Makanan Sempel.jpg",
  },
];

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

function ReviewCard({ review }) {
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

          {review.attachment ? (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-100 p-1">
                <div className="h-10 w-10 rounded bg-gradient-to-br from-amber-200 to-red-200" />
              </div>
              <span className="text-[10px] font-bold italic text-[#434655]">
                {review.attachment}
              </span>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#006C49]">
              <CheckIcon />
              <span>Verified review</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ReviewAdmin() {
  return (
    <section className="flex w-full flex-col gap-8 bg-[#F7F9FB] font-['Inter',Arial,sans-serif] text-[#191C1E]">
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="search"
          placeholder="Search Reviews..."
          className="h-[38px] w-full border-0 border-b-2 border-[#C3C6D7] bg-white py-2 pl-10 pr-4 text-sm text-[#191C1E] outline-none placeholder:text-[#6B7280] focus:border-[#004AC6]"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[304px_1fr]">
        <article className="flex min-h-[237px] flex-col justify-between rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-[#434655]">
              Overall Rating
            </h2>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-6xl font-black leading-none tracking-[-0.05em] text-[#191C1E]">
                5.0
              </span>
              <span className="text-xl text-[#434655]">/ 5</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-base font-bold text-[#006C49]">
              <TrendIcon />
              <span>Excellent score</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <Stars />
            <span className="pl-1 text-sm font-medium text-[#434655]">
              (7 Reviews)
            </span>
          </div>
        </article>

        <article className="rounded-xl border border-slate-100 bg-white px-8 py-10 shadow-sm">
          <h2 className="pb-6 text-sm font-bold uppercase tracking-[0.1em] text-[#434655]">
            Rating Breakdown
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
          Customer Reviews
        </h2>

        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <button className="flex h-12 items-center gap-2 rounded-xl border-2 border-slate-200 px-8 text-sm font-bold text-[#434655] transition hover:border-slate-300 hover:bg-white">
            Load More Reviews
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
