import { useEffect, useMemo, useState } from "react";
import { getAdminDashboard } from "../../../services/api";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatTime = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "-";

const statusLabel = {
  menunggu_konfirmasi: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

function StatCard({ label, value, tone = "blue", helper }) {
  const tones = {
    blue: "border-blue-600 bg-blue-50 text-blue-700",
    green: "border-emerald-600 bg-emerald-50 text-emerald-700",
    amber: "border-amber-500 bg-amber-50 text-amber-700",
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`mb-5 h-1.5 w-16 rounded-full ${tones[tone]}`} />
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      {helper && <p className="mt-2 text-sm text-slate-500">{helper}</p>}
    </article>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAdminDashboard();

        if (isMounted) {
          setSummary(response.data);
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

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const maxTraffic = useMemo(() => {
    const values = summary?.grafik_jam_ramai || [];
    return Math.max(...values.map((item) => Number(item.total || 0)), 1);
  }, [summary]);

  if (isLoading) {
    return (
      <section className="rounded-lg bg-white p-8 text-sm font-semibold text-slate-500">
        Memuat dashboard...
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-black text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan operasional Kedai Sigma hari ini.
        </p>
      </header>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Pendapatan Harian"
          value={formatRupiah(summary?.pendapatan_harian)}
          helper="Order batal tidak dihitung"
        />
        <StatCard
          label="Meja Terisi Sekarang"
          value={`${summary?.meja_terisi || 0}/${summary?.total_meja || 0}`}
          tone="green"
          helper="Dari order menunggu dan diproses"
        />
        <StatCard
          label="Reservasi Belum Diproses"
          value={summary?.reservasi_belum_diproses || 0}
          tone="amber"
          helper="Perlu ACC atau tolak"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <article className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-950">
              Transaksi Terakhir
            </h2>
            <p className="text-sm text-slate-500">
              Data langsung dari riwayat pesanan.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Meja</th>
                  <th className="px-6 py-4 text-left">Waktu</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(summary?.transaksi_terakhir || []).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                      Belum ada transaksi.
                    </td>
                  </tr>
                ) : (
                  summary.transaksi_terakhir.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-blue-700">
                        #{String(order.id).padStart(4, "0")}
                      </td>
                      <td className="px-6 py-4">
                        {order.meja?.nomor_meja || "Takeaway"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatTime(order.tgl_pesanan)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          {statusLabel[order.status_pesanan] || order.status_pesanan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black">
                        {formatRupiah(order.total_harga)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Grafik Jam Ramai</h2>
          <p className="text-sm text-slate-500">Jumlah order per jam hari ini.</p>
          <div className="mt-6 flex h-72 items-end gap-3 border-b border-l border-slate-200 pl-3">
            {(summary?.grafik_jam_ramai || []).length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-400">
                Belum ada data
              </div>
            ) : (
              summary.grafik_jam_ramai.map((item) => (
                <div key={item.jam} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-blue-600"
                    style={{ height: `${Math.max((item.total / maxTraffic) * 100, 8)}%` }}
                    title={`${item.jam}: ${item.total} order`}
                  />
                  <span className="text-[10px] font-bold text-slate-500">
                    {item.jam}
                  </span>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
