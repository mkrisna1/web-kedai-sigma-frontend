const socialLinks = [
  {
    label: "@kedai__sigma",
    href: "https://instagram.com/kedai__sigma",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "@kedal.sigma",
    href: "https://tiktok.com/@kedal.sigma",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M14 3v10.4a4.6 4.6 0 1 1-4.6-4.6c.34 0 .67.04 1 .11v3.06a1.72 1.72 0 1 0 .6 1.31V3h3Zm0 0c.46 2.67 2.1 4.32 4.8 4.82V11c-1.82-.12-3.42-.74-4.8-1.87V3Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "081234567890",
    href: "https://wa.me/6281234567890",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M4.2 19.8 5.4 16A8.3 8.3 0 1 1 8 18.5l-3.8 1.3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.1 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.1.1-.2.3 0 .5.5.8 1.2 1.5 2.1 2 .2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.2.1.4.3.4.5 0 .6-.2 1.2-.7 1.6-.5.4-1.1.5-1.7.4-3.6-.8-6.1-3.3-6.9-6.8-.1-.6 0-1.2.4-1.6Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "kedaisigma@gmail.com",
    href: "mailto:kedaisigma@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M4 6h16v12H4V6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m4 7 8 6 8-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#16202E] bg-[#091421]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-12 md:py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <a href="/" className="inline-flex">
            <span className="font-grotesk text-2xl font-black uppercase tracking-[-0.05em] text-[#DC2626]">
              KEDAI SIGMA
            </span>
          </a>

          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="group flex items-center gap-2 text-[#E6BDB8] transition-colors hover:text-[#D9E3F6]"
              >
                {item.icon}
                <span className="font-grotesk text-xs font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#16202E]" />

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569]">
            &copy; 2025 KEDAI SIGMA
          </span>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <button
              type="button"
              className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569] transition-colors hover:text-[#94A3B8]"
            >
              Terms of Chaos
            </button>
            <button
              type="button"
              className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569] transition-colors hover:text-[#94A3B8]"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
