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
  return (
    <article className="flex min-h-[350px] w-full flex-col overflow-hidden bg-[#16202E] border-b-8 border-[#DC2626]">
      <div className="h-[151px] w-full overflow-hidden bg-[#2B3544]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 px-[14px] pt-[15px] pb-1.5">
        <div className="flex min-h-[25px] items-start justify-between gap-1">
          <h3 className="min-w-0 flex-1 break-words font-['Space_Grotesk',Arial,sans-serif] text-[10px] font-bold uppercase leading-5 tracking-[0.8px] text-[#D9E3F6]">
            {item.name}
          </h3>

          <span className="min-w-[43px] shrink-0 bg-black px-1 py-[3px] text-center font-['Space_Grotesk',Arial,sans-serif] text-[10px] font-bold uppercase leading-[10px] text-[#EEC200]">
            {item.priceLabel}
          </span>
        </div>

        <p className="h-[72px] overflow-hidden text-[10px] font-normal leading-[10px] text-[#E6BDB8]">
          {item.description}
        </p>

        <button
          type="button"
          onClick={() => onAdd(item)}
          className="mt-auto flex h-[51px] w-full items-center justify-center gap-1 bg-[#DC2626] px-1 font-['Space_Grotesk',Arial,sans-serif] text-[11px] font-bold uppercase leading-[10px] tracking-[1.6px] text-white transition hover:bg-[#B91C1C] active:translate-y-px"
        >
          <PlusIcon className="h-3 w-3 shrink-0" />
          <span>Tambah Pesanan</span>
        </button>
      </div>
    </article>
  );
}
