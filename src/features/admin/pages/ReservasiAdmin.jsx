import { useEffect, useMemo, useState } from "react";
import {
  getAdminTables,
  getAdminReservations,
  updateAdminReservationStatus,
} from "../../../services/api";

const statusConfig = {
  menunggu_konfirmasi: {
    label: "Menunggu",
    badge: "bg-amber-100 text-amber-700",
  },
  dikonfirmasi: {
    label: "Dikonfirmasi",
    badge: "bg-emerald-100 text-emerald-700",
  },
  dibatalkan: {
    label: "Ditolak",
    badge: "bg-rose-100 text-rose-700",
  },
};

const getInitials = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "RS";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(`${value}T00:00:00`))
    : "-";

const formatTime = (value = "") => value.slice(0, 5) || "-";

function DecisionPopup({ feedback, onClose }) {
  if (!feedback) {
    return null;
  }

  const isSuccess = feedback.type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-8 backdrop-blur-[1px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <div className="px-6 py-6">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl font-black ${
              isSuccess
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {isSuccess ? "+" : "!"}
          </div>
          <h3 className="mt-5 text-xl font-extrabold text-[#191C1E]">
            {feedback.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#434655]">
            {feedback.message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`flex h-14 w-full items-center justify-center text-sm font-bold uppercase text-white ${
            isSuccess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function ReservasiAdmin() {
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableAssignments, setTableAssignments] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadReservations = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [reservationResponse, tableResponse] = await Promise.all([
          getAdminReservations(),
          getAdminTables(),
        ]);

        if (isMounted) {
          const reservationData = reservationResponse.data || [];

          setReservations(reservationData);
          setTables((tableResponse.data || []).filter((table) => table.status_meja === "active"));
          setTableAssignments(
            reservationData.reduce((assignments, reservation) => {
              if (reservation.meja_id) {
                assignments[reservation.id] = String(reservation.meja_id);
              }

              return assignments;
            }, {}),
          );
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

    loadReservations();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesDate = selectedDate
        ? reservation.tgl_reservasi === selectedDate
        : true;
      const matchesStatus =
        selectedStatus === "semua"
          ? true
          : reservation.status_reservasi === selectedStatus;

      return matchesDate && matchesStatus;
    });
  }, [reservations, selectedDate, selectedStatus]);

  const pendingCount = reservations.filter(
    (reservation) => reservation.status_reservasi === "menunggu_konfirmasi",
  ).length;

  const handleDecision = async (reservationId, nextStatus) => {
    setUpdatingId(reservationId);
    setErrorMessage("");

    try {
      const selectedMejaId = tableAssignments[reservationId];

      if (nextStatus === "dikonfirmasi" && !selectedMejaId) {
        throw new Error("Pilih meja dulu sebelum ACC reservasi.");
      }

      const response = await updateAdminReservationStatus(
        reservationId,
        nextStatus,
        nextStatus === "dikonfirmasi" ? selectedMejaId : null,
      );

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId ? response.data : reservation,
        ),
      );
      setFeedback({
        type: "success",
        title:
          nextStatus === "dikonfirmasi"
            ? "Reservasi berhasil di-ACC"
            : "Reservasi berhasil ditolak",
        message: response.message || "Status reservasi berhasil diperbarui.",
      });
    } catch (error) {
      setErrorMessage(error.message);
      setFeedback({
        type: "error",
        title: "Aksi gagal",
        message: error.message || "Status reservasi belum berhasil diperbarui.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="flex w-full flex-col gap-8 bg-[#F7F9FB] font-['Inter',Arial,sans-serif] text-[#191C1E]">
      <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
        <div className="grid gap-4 rounded-lg bg-white p-6 shadow-[0_10px_30px_rgba(25,28,30,0.04)] md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
              Filter Tanggal
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-11 rounded border border-b-2 border-[#C3C6D7] bg-[#F2F4F6] px-4 text-sm text-[#191C1E] outline-none transition focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
              Status Reservasi
            </span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-11 rounded border border-b-2 border-[#C3C6D7] bg-[#F2F4F6] px-4 text-sm text-[#191C1E] outline-none transition focus:border-blue-500"
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu_konfirmasi">Menunggu</option>
              <option value="dikonfirmasi">Dikonfirmasi</option>
              <option value="dibatalkan">Ditolak</option>
            </select>
          </label>
        </div>

        <aside className="rounded-lg bg-[#2563EB] p-6 text-white shadow-[0_10px_30px_rgba(25,28,30,0.04)]">
          <p className="text-xs font-medium uppercase tracking-[0.05em] text-white/70">
            Belum diproses
          </p>
          <p className="mt-2 text-4xl font-extrabold tracking-[-0.025em]">
            {pendingCount}
          </p>
        </aside>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(25,28,30,0.04)]">
        <div className="border-b border-[#E6E8EA] p-6">
          <h3 className="text-lg font-bold text-[#191C1E]">
            Reservasi yang masuk
          </h3>
          <p className="mt-1 text-sm text-[#434655]">
            Data di bawah ini langsung berasal dari backend.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-[#F2F4F6]/50 text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
              <tr>
                <th className="px-6 py-4 text-left">Pelanggan</th>
                <th className="px-6 py-4 text-left">Kontak</th>
                <th className="px-6 py-4 text-left">Jadwal</th>
                <th className="px-6 py-4 text-left">Meja</th>
                <th className="px-6 py-4 text-left">Orang</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8EA]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-[#434655]">
                    Memuat reservasi...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-[#434655]">
                    Belum ada reservasi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => {
                  const status = statusConfig[reservation.status_reservasi];
                  const isPending =
                    reservation.status_reservasi === "menunggu_konfirmasi";
                  const isUpdating = updatingId === reservation.id;

                  return (
                    <tr key={reservation.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                            {getInitials(reservation.nama_reservasi)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#191C1E]">
                              {reservation.nama_reservasi}
                            </p>
                            <p className="mt-1 max-w-[220px] text-xs leading-5 text-[#434655]">
                              {reservation.catatan_reservasi || "Tanpa catatan"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-medium text-[#191C1E]">
                        {reservation.no_hp}
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-medium">{formatDate(reservation.tgl_reservasi)}</p>
                        <p className="text-xs text-[#434655]">
                          {formatTime(reservation.jam_reservasi)}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        {isPending ? (
                          <select
                            value={tableAssignments[reservation.id] || ""}
                            onChange={(event) =>
                              setTableAssignments((current) => ({
                                ...current,
                                [reservation.id]: event.target.value,
                              }))
                            }
                            className="h-9 rounded border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
                          >
                            <option value="">Pilih meja</option>
                            {tables.map((table) => (
                              <option key={table.id} value={table.id}>
                                {table.nomor_meja}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="font-semibold text-slate-700">
                            {reservation.meja?.nomor_meja || "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 font-semibold">
                        {reservation.jml_orang}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            status?.badge || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {status?.label || reservation.status_reservasi}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {isPending ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDecision(reservation.id, "dikonfirmasi")
                                }
                                disabled={isUpdating}
                                className="rounded bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                ACC
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDecision(reservation.id, "dibatalkan")
                                }
                                disabled={isUpdating}
                                className="rounded bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Tolak
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-medium text-[#434655]">
                              Sudah diproses
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DecisionPopup
        feedback={feedback}
        onClose={() => setFeedback(null)}
      />
    </section>
  );
}
