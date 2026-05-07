import React, { useState } from "react";

const transactions = [
  { id: "#TRX-9382", table: "Meja 04", time: "14:32", total: "41K" },
  { id: "#TRX-9381", table: "Meja 12", time: "13:55", total: "13K" },
  { id: "#TRX-9380", table: "Meja 01", time: "13:10", total: "69K" },
  { id: "#TRX-9379", table: "Meja 08", time: "12:45", total: "30K" },
];

const allTransactions = [
  ...transactions,
  { id: "#TRX-9378", table: "Meja 03", time: "12:20", total: "52K" },
  { id: "#TRX-9377", table: "Meja 10", time: "11:58", total: "27K" },
  { id: "#TRX-9376", table: "Meja 06", time: "11:35", total: "84K" },
  { id: "#TRX-9375", table: "Meja 02", time: "11:12", total: "18K" },
];

const Dashboard = () => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const visibleTransactions = showAllTransactions ? allTransactions : transactions;

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-10 font-['Inter',Arial,sans-serif]">
      <div className="mx-auto max-w-[1280px] space-y-10">
        <div className="grid grid-cols-3 gap-8">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#EFF6FF]">
                <i className="fa-solid fa-wallet text-4xl text-[#2563EB]" />
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold text-[#006C49]">
                <i className="fa-solid fa-arrow-trend-up" />
                <span>12%</span>
              </div>
            </div>
            <p className="mt-12 text-sm font-semibold uppercase tracking-normal text-[#434655]">
              Pendapatan Harian
            </p>
            <p className="mt-2 text-5xl font-bold leading-tight text-[#191C1E]">
              Rp 5.000.000
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F0FDF4]">
                <i className="fa-solid fa-chair text-4xl text-[#16A34A]" />
              </div>
            </div>
            <p className="mt-12 text-sm font-semibold uppercase tracking-normal text-[#434655]">
              Meja Yang Terisi
            </p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-6xl font-bold leading-none text-[#191C1E]">
                7
              </span>
              <span className="text-3xl text-gray-500">/8</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F0FFAD]">
                <i className="fa-solid fa-clock text-3xl text-gray-700" />
              </div>
              <div className="rounded-full bg-[#BA1A1A] px-4 py-1.5 text-base font-bold text-white">
                12
              </div>
            </div>
            <p className="mt-12 text-sm font-semibold uppercase tracking-normal text-[#434655]">
              Reservasi Belum Diproses
            </p>
            <p className="mt-2 text-6xl font-bold leading-none text-[#BA1A1A]">
              12
            </p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-8">
          <div className="col-span-5 rounded-2xl bg-white p-10 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-[#191C1E]">
                  Transaksi Terakhir
                </h3>
                <p className="mt-1 text-lg text-[#434655]">
                  Transaksi hari ini
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllTransactions((current) => !current)}
                className="group flex items-center gap-3 rounded-xl bg-[#2563EB] px-8 py-3 text-lg font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
                aria-expanded={showAllTransactions}
              >
                <span>{showAllTransactions ? "Sembunyikan" : "Lihat Semua"}</span>
                <span
                  className={`text-base leading-none transition-transform duration-300 ${
                    showAllTransactions ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  v
                </span>
              </button>
            </div>

            <div
              className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showAllTransactions ? "max-h-[680px]" : "max-h-[372px]"
              }`}
            >
              <table className="w-full text-lg">
                <thead>
                  <tr className="border-b text-sm uppercase tracking-normal text-[#434655]">
                    <th className="pb-5 text-left">ID Pesanan</th>
                    <th className="pb-5 text-left">Meja</th>
                    <th className="pb-5 text-left">Waktu</th>
                    <th className="pb-5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleTransactions.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-gray-50 ${
                        showAllTransactions && index >= transactions.length
                          ? "animate-[dashboard-row-in_320ms_ease-out_both]"
                          : ""
                      }`}
                      style={{
                        animationDelay:
                          showAllTransactions && index >= transactions.length
                            ? `${(index - transactions.length) * 55}ms`
                            : "0ms",
                      }}
                    >
                      <td className="py-6 font-medium text-[#2563EB]">
                        {item.id}
                      </td>
                      <td className="py-6 text-[#191C1E]">{item.table}</td>
                      <td className="py-6 text-gray-600">{item.time}</td>
                      <td className="py-6 text-right font-bold text-[#191C1E]">
                        Rp {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-2 flex self-start flex-col rounded-2xl bg-white p-10 shadow-sm">
            <h3 className="text-2xl font-bold text-[#191C1E]">Peak Traffic</h3>
            <p className="mt-1 text-base text-gray-500">
              Hourly customer flow comparison
            </p>

            <div className="relative mt-12 flex h-72 shrink-0 items-end gap-4 border-b border-l border-gray-200">
              <div className="flex-1 rounded-t bg-[#2563EB]" style={{ height: "65%" }} />
              <div className="flex-1 rounded-t bg-[#2563EB]" style={{ height: "82%" }} />
              <div className="flex-1 rounded-t bg-[#2563EB]" style={{ height: "48%" }} />
              <div className="flex-1 rounded-t bg-[#10B981]" style={{ height: "75%" }} />
              <div className="flex-1 rounded-t bg-[#2563EB]" style={{ height: "90%" }} />
            </div>

            <div className="mt-8 space-y-4 text-base">
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-[#2563EB]" />
                  <span>Hari ini</span>
                </div>
                <span className="font-bold">60 Pelanggan</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-500">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border border-[#006C49]" />
                  <span>Minggu ini</span>
                </div>
                <span>300 Pelanggan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
