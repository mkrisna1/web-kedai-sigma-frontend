function PlusIcon({ className = "h-3 w-3" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7 15V9H1V7h6V1h2v6h6v2H9v6H7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function QRMenuCard({ item, onAdd }) {
  const isOutOfStock = item.isAvailable === false;

  return (
    <article className="flex min-h-[342px] min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-[#EEC200]/15 bg-[#16202E] shadow-[0_14px_36px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#EEC200]/35 hover:shadow-[0_18px_42px_rgba(0,0,0,0.24)]">
      <div className="relative aspect-square w-full overflow-hidden bg-[#2B3544]">
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover transition duration-500 ${isOutOfStock ? "grayscale opacity-45" : "hover:scale-105"}`}
          loading="lazy"
          decoding="async"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="border border-[#DC2626] bg-[#091421]/90 px-3 py-2 font-['Space_Grotesk',Arial,sans-serif] text-[11px] font-black tracking-[0.4px] text-[#FF4D4D]">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 px-3.5 pb-2 pt-3.5">
        <div className="flex min-h-[23px] min-w-0 items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 overflow-hidden break-words font-['Space_Grotesk',Arial,sans-serif] text-[13px] font-bold leading-[15px] tracking-normal text-[#F4F7FF] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [overflow-wrap:anywhere]">
            {item.name}
          </h3>

          <span className="min-w-[43px] max-w-[62px] shrink-0 break-words rounded-lg bg-black/80 px-1.5 py-1 text-center font-['Space_Grotesk',Arial,sans-serif] text-[10px] font-bold leading-[11px] text-[#EEC200] [overflow-wrap:anywhere]">
            {item.priceLabel}
          </span>
        </div>

        <p className="mb-3 min-w-0 overflow-hidden break-words text-[10.5px] font-normal leading-[13px] text-[#E6BDB8] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] [overflow-wrap:anywhere]">
          {item.description}
        </p>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAdd(item)}
          className={`mt-auto flex h-[50px] w-full items-center justify-center gap-1 rounded-xl px-1 font-['Space_Grotesk',Arial,sans-serif] text-[11px] font-bold leading-[12px] tracking-[0.3px] transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-[#2B3544] text-[#FF4D4D]"
              : "bg-[#DC2626] text-white shadow-[0_10px_22px_rgba(220,38,38,0.20)] hover:bg-[#B91C1C] active:translate-y-px"
          }`}
        >
          {!isOutOfStock && <PlusIcon className="h-3 w-3 shrink-0" />}
          <span>{isOutOfStock ? "Stok Habis" : "Tambah Pesanan"}</span>
        </button>
      </div>
    </article>
  );
}
