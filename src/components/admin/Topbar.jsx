import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getAdminOrders,
  getAdminReservations,
} from "../../services/api";

const MAX_VISIBLE_NOTIFICATIONS = 6;
const ACTIONABLE_NOTIFICATION_TYPES = ["Pesanan", "Reservasi"];

const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatShortTime = (value) => {
  if (!value) {
    return "Baru masuk";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Baru masuk";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatReservationTime = (dateValue, timeValue) => {
  if (!dateValue && !timeValue) {
    return "Reservasi baru";
  }

  const cleanTime = timeValue ? String(timeValue).slice(0, 5) : "";
  const date = dateValue ? new Date(dateValue) : null;
  const dateLabel =
    date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "short",
        }).format(date)
      : "";

  return [dateLabel, cleanTime].filter(Boolean).join(" - ");
};

const getTableLabel = (order) =>
  order?.meja?.nomor_meja || order?.nomor_meja || "Meja belum dipilih";

const buildNotifications = ({ orders, reservations }) => {
  const orderNotifications = orders
    .filter((order) => order.status_pesanan === "menunggu_konfirmasi")
    .map((order) => ({
      id: `order-${order.id}`,
      type: "Pesanan",
      title: `Pesanan baru ${getTableLabel(order)}`,
      description: `${order.detail_pesanans?.length || 0} item menunggu diterima`,
      time: formatShortTime(order.tgl_pesanan || order.created_at),
      to: "/admin/pesanan",
      tone: "blue",
    }));

  const reservationNotifications = reservations
    .filter((reservation) => reservation.status_reservasi === "menunggu_konfirmasi")
    .map((reservation) => ({
      id: `reservation-${reservation.id}`,
      type: "Reservasi",
      title: reservation.nama_reservasi || "Reservasi baru",
      description: `${reservation.jml_orang || 0} orang, ${formatReservationTime(
        reservation.tgl_reservasi,
        reservation.jam_reservasi,
      )}`,
      time: "Menunggu ACC",
      to: "/admin/reservasi",
      tone: "amber",
    }));

  return [
    ...orderNotifications,
    ...reservationNotifications,
  ];
};

function BellIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 16 20" className={className} fill="none" aria-hidden="true">
      <path
        d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [seenNotificationIds, setSeenNotificationIds] = useState(() => new Set());
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const dropdownRef = useRef(null);

  const actionableNotifications = useMemo(
    () =>
      notifications.filter((notification) =>
        ACTIONABLE_NOTIFICATION_TYPES.includes(notification.type),
      ),
    [notifications],
  );
  const visibleNotifications = useMemo(
    () => actionableNotifications.slice(0, MAX_VISIBLE_NOTIFICATIONS),
    [actionableNotifications],
  );
  const totalNotifications = actionableNotifications.length;
  const unreadNotifications = useMemo(
    () =>
      actionableNotifications.filter(
        (notification) => !seenNotificationIds.has(notification.id),
      ),
    [actionableNotifications, seenNotificationIds],
  );
  const badgeCount = unreadNotifications.length;

  const handleBellClick = () => {
    const nextOpenState = !isOpen;

    setIsOpen(nextOpenState);

    if (nextOpenState) {
      setSeenNotificationIds((currentIds) => {
        const nextIds = new Set(currentIds);

        actionableNotifications.forEach((notification) => {
          nextIds.add(notification.id);
        });

        return nextIds;
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const [ordersResult, reservationsResult] = await Promise.all([
          getAdminOrders(),
          getAdminReservations(),
        ]);

        if (!isMounted) {
          return;
        }

        setNotifications(
          buildNotifications({
            orders: ordersResult?.data || [],
            reservations: reservationsResult?.data || [],
          }),
        );
        setErrorMessage("");
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Notifikasi belum bisa dimuat.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="flex items-center justify-end border-b border-slate-200 bg-[#F8FAFC] px-8 py-4">
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={handleBellClick}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors",
            isOpen ? "bg-white text-blue-700 shadow-sm" : "hover:bg-slate-100",
          )}
          aria-label={`Buka notifikasi${badgeCount ? `, ${badgeCount} belum dilihat` : ""}`}
          aria-expanded={isOpen}
        >
          <BellIcon />
          {badgeCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-[#BA1A1A] px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
              {badgeCount > 99 ? "99+" : badgeCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-sm font-black text-slate-900">Notifikasi</p>
                <p className="text-xs text-slate-500">
                  {totalNotifications
                    ? `${totalNotifications} pesanan/reservasi perlu dicek`
                    : "Tidak ada pesanan atau reservasi baru"}
                </p>
              </div>
              {isLoading && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              )}
            </div>

            <div className="max-h-[420px] overflow-y-auto py-2">
              {errorMessage && (
                <div className="mx-3 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {errorMessage}
                </div>
              )}

              {!errorMessage && !isLoading && visibleNotifications.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-bold text-slate-800">Aman semua</p>
                </div>
              )}

              {visibleNotifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.to}
                  onClick={() => setIsOpen(false)}
                  className="mx-2 flex gap-3 rounded-md px-3 py-3 transition-colors hover:bg-slate-50"
                >
                  <span
                    className={cn(
                      "mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full",
                      notification.tone === "blue" && "bg-blue-600",
                      notification.tone === "amber" && "bg-amber-500",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-black uppercase tracking-wide text-slate-500">
                        {notification.type}
                      </span>
                      <span className="flex-shrink-0 text-[11px] font-semibold text-slate-400">
                        {notification.time}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-sm font-bold text-slate-900">
                      {notification.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {notification.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            {totalNotifications > MAX_VISIBLE_NOTIFICATIONS && (
              <div className="border-t border-slate-100 px-4 py-3 text-center text-xs font-bold text-slate-500">
                +{totalNotifications - MAX_VISIBLE_NOTIFICATIONS} notifikasi lain
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
