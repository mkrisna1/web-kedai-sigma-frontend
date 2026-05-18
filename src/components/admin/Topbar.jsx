export default function TopBar() {
  return (
    <header className="flex items-center justify-end px-8 py-4 border-b border-slate-200 bg-[#F8FAFC] flex-shrink-0">
      {/* Actions */}
      <div className="flex items-center gap-4">
        
        {/* Bell */}
        <button className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path
              d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z"
              fill="#475569"
            />
          </svg>
        </button>

        {/* Settings */}
        <svg width="21" height="20" viewBox="0 0 24 24" fill="none">
  <path
    d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
    stroke="#475569"
    strokeWidth="1.5"
  />
  <path
    d="M19.4 15A1.65 1.65 0 0 0 19.73 16.82L19.79 16.88A2 2 0 1 1 16.88 19.79L16.82 19.73A1.65 1.65 0 0 0 15 19.4A1.65 1.65 0 0 0 14 21V21.2A2 2 0 1 1 10 21.2V21A1.65 1.65 0 0 0 9 19.4A1.65 1.65 0 0 0 7.18 19.73L7.12 19.79A2 2 0 1 1 4.21 16.88L4.27 16.82A1.65 1.65 0 0 0 4.6 15A1.65 1.65 0 0 0 3 14H2.8A2 2 0 1 1 2.8 10H3A1.65 1.65 0 0 0 4.6 9A1.65 1.65 0 0 0 4.27 7.18L4.21 7.12A2 2 0 1 1 7.12 4.21L7.18 4.27A1.65 1.65 0 0 0 9 4.6A1.65 1.65 0 0 0 10 3V2.8A2 2 0 1 1 14 2.8V3A1.65 1.65 0 0 0 15 4.6A1.65 1.65 0 0 0 16.82 4.27L16.88 4.21A2 2 0 1 1 19.79 7.12L19.73 7.18A1.65 1.65 0 0 0 19.4 9A1.65 1.65 0 0 0 21 10H21.2A2 2 0 1 1 21.2 14H21A1.65 1.65 0 0 0 19.4 15Z"
    stroke="#475569"
    strokeWidth="1.5"
  />
</svg>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/e6ba62826179fde8904406468cbb20af8500d9bc?width=64"
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </header>
  );
}
