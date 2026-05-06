import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
        <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0ZM2 8H6V2H2V8ZM12 16H16V10H12V16ZM12 4H16V2H12V4ZM2 16H6V14H2V16Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Kelola Pesanan",
    path: "/admin/pesanan",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
        <path d="M0 18V16L2 14V18H0ZM4 18V12L6 10V18H4ZM8 18V10L10 12.025V18H8ZM12 18V12.025L14 10.025V18H12ZM16 18V8L18 6V18H16ZM0 12.825V10L7 3L11 7L18 0V2.825L11 9.825L7 5.825L0 12.825Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Kelola Menu",
    path: "/admin/menu",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
        <path d="M1.4 18L0 16.6L10.25 6.35C9.95 5.65 9.90833 4.85833 10.125 3.975C10.3417 3.09167 10.8167 2.3 11.55 1.6C12.4333 0.716667 13.4167 0.2 14.5 0.05C15.5833 -0.1 16.4667 0.166667 17.15 0.85C17.8333 1.53333 18.1 2.41667 17.95 3.5C17.8 4.58333 17.2833 5.56667 16.4 6.45C15.7 7.18333 14.9083 7.65833 14.025 7.875C13.1417 8.09167 12.35 8.05 11.65 7.75L10.4 9L18 16.6L16.6 18L9 10.45L1.4 18ZM4.35 9.45L1.35 6.45C0.45 5.55 0 4.475 0 3.225C0 1.975 0.45 0.9 1.35 0L7.55 6.25L4.35 9.45Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Kelola Meja & QR",
    path: "/admin/meja",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
        <path d="M10 18V16H12V18H10ZM8 16V11H10V16H8ZM16 13V9H18V13H16ZM14 9V7H16V9H14ZM2 11V9H4V11H2ZM0 9V7H2V9H0ZM9 2V0H11V2H9ZM1.5 4.5H4.5V1.5H1.5V4.5ZM0 6V0H6V6H0ZM1.5 16.5H4.5V13.5H1.5V16.5ZM0 18V12H6V18H0ZM13.5 4.5H16.5V1.5H13.5V4.5ZM12 6V0H18V6H12ZM14 18V15H12V13H16V16H18V18H14ZM10 11V9H14V11H10ZM6 11V9H4V7H10V9H8V11H6ZM7 6V2H9V4H11V6H7ZM2.25 3.75V2.25H3.75V3.75H2.25ZM2.25 15.75V14.25H3.75V15.75H2.25ZM14.25 3.75V2.25H15.75V3.75H14.25Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Kelola Reservasi",
    path: "/kelola-reservasi",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 18 20" fill="none">
  <path
    d="M7.95 16.35L4.4 12.8L5.85 11.35L7.95 13.45L12.15 9.25L13.6 10.7L7.95 16.35ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z"
    fill="currentColor"
  />
</svg>
    ),
  },
  {
    label: "Review",
    path: "/review",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
  <path
    d="M4 12H7.05L12.05 7C12.2 6.85 12.3125 6.67917 12.3875 6.4875C12.4625 6.29583 12.5 6.10833 12.5 5.925C12.5 5.74167 12.4583 5.5625 12.375 5.3875C12.2917 5.2125 12.1833 5.05 12.05 4.9L11.15 3.95C11 3.8 10.8333 3.6875 10.65 3.6125C10.4667 3.5375 10.275 3.5 10.075 3.5C9.89167 3.5 9.70417 3.5375 9.5125 3.6125C9.32083 3.6875 9.15 3.8 9 3.95L4 8.95V12ZM11 5.925L10.075 5L11 5.925ZM5.5 10.5V9.55L8.025 7.025L8.525 7.475L8.975 7.975L6.45 10.5H5.5ZM8.525 7.475L8.975 7.975L8.025 7.025L8.525 7.475ZM9.175 12H16V10H11.175L9.175 12ZM0 20V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H4L0 20ZM3.15 14H18V2H2V15.125L3.15 14Z"
    fill="currentColor"
  />
</svg>
    ),
  },
  {
    label: "Laporan",
    path: "/laporan",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
  <path
    d="M4 14H6V7H4V14ZM8 14H10V4H8V14ZM12 14H14V10H12V14ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2Z"
    fill="currentColor"
  />
</svg>
    ),
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen border-r bg-slate-50">

      <div className="px-4 pt-4 pb-8">
  <div className="flex items-center gap-3">

    {/* Logo */}
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-md flex-shrink-0">
      <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
        <path
          d="M3 20V10.85C2.15 10.6167 1.4375 10.15 0.8625 9.45C0.2875 8.75 0 7.93333 0 7V0H2V7H3V0H5V7H6V0H8V7C8 7.93333 7.7125 8.75 7.1375 9.45C6.5625 10.15 5.85 10.6167 5 10.85V20H3ZM13 20V12H10V5C10 3.61667 10.4875 2.4375 11.4625 1.4625C12.4375 0.4875 13.6167 0 15 0V20H13Z"
          fill="white"
        />
      </svg>
    </div>

    {/* Text */}
    <div className="flex flex-col">
      <span className="text-slate-900 font-bold text-base">
        Kedai Sigma
      </span>
      <span className="text-slate-500 text-[10px] uppercase tracking-wider">
        Admin Console
      </span>
    </div>

  </div>
</div>

      <nav className="flex flex-col gap-1 px-4 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded text-sm text-slate-600 hover:bg-red-100 hover:text-red-600 w-full"
        >
          <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
            <path
              d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z"
              fill="currentColor"
            />
          </svg>
          Logout
        </button>
      </div>

    </aside>
  );
}