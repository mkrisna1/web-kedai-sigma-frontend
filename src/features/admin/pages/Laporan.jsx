const stats = [
  {
    label: "Total Penjualan",
    value: "IDR 124.500k",
    change: "+12.5%",
    tone: "blue",
    icon: "money",
  },
  {
    label: "Transaksi",
    value: "1,842",
    change: "+8.2%",
    tone: "green",
    icon: "receipt",
  },
  {
    label: "Rata-rata Order",
    value: "IDR 67.5k",
    change: "-3.1%",
    tone: "amber",
    icon: "star",
  },
  {
    label: "Pelanggan Baru",
    value: "220",
    change: "+10.4%",
    tone: "purple",
    icon: "users",
  },
];

const categories = [
  { label: "Minuman Kopi", value: "42%", width: "42%" },
  { label: "Non Kafein", value: "28%", width: "28%" },
  { label: "Cemilan", value: "18%", width: "18%" },
  { label: "Kopi Artisan", value: "12%", width: "12%" },
];

const bestSellers = [
  { name: "Kopi Tubruk", category: "Kopi Khas", total: "IDR 32.4M" },
  { name: "Americano", category: "Minuman Terlaris", total: "IDR 24.8M" },
  { name: "Ice coffee milk chocholate", category: "Favorit Pelanggan", total: "IDR 18.2M" },
];

const peakHours = [
  { time: "16:00", width: "25%", color: "bg-blue-100" },
  { time: "17:30", width: "85%", color: "bg-blue-500" },
  { time: "18:00", width: "50%", color: "bg-blue-300" },
  { time: "19:30", width: "95%", color: "bg-blue-600" },
  { time: "21:00", width: "30%", color: "bg-blue-200" },
];

const transactions = [
  {
    id: "#TRX-1001",
    date: "5 April 2026",
    items: "2x Indomie Nyemek Halu 2x Lemon Tea",
    type: "Dine In (Table 3)",
    total: "IDR 50.000",
  },
  {
    id: "#TRX-1002",
    date: "5 April 2026",
    items: "1x Coffee Milk Chocholate 1x Coffe latte",
    type: "Take Away",
    total: "IDR 26.000",
  },
  {
    id: "#TRX-1003",
    date: "5 April 2026",
    items: "2x Piscok 2x Redvelvet",
    type: "Dine In (Table 5)",
    total: "IDR 52.000",
  },
  {
    id: "#TRX-1004",
    date: "5 April 2026",
    items: "2x Indomie Nyemek Halu 2x Lemon Tea",
    type: "Delivery",
    total: "IDR 40.000",
  },
];

const toneClasses = {
  blue: "bg-blue-50 text-[#004AC6]",
  green: "bg-green-50 text-[#006C49]",
  amber: "bg-amber-50 text-[#784B00]",
  purple: "bg-purple-50 text-purple-600",
};

function MetricIcon({ type, className = "h-5 w-5" }) {
  const paths = {
    money: "M3 6h18v12H3V6Zm3 3a3 3 0 0 1 3-3H6v3Zm12 0V6h-3a3 3 0 0 1 3 3ZM6 15v3h3a3 3 0 0 1-3-3Zm12 0a3 3 0 0 1-3 3h3v-3Zm-6 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    receipt: "M6 2h12v20l-3-2-3 2-3-2-3 2V2Zm3 5v2h6V7H9Zm0 4v2h6v-2H9Zm0 4v2h4v-2H9Z",
    star: "m12 2 2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 16.81l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2Z",
    users: "M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 0a4 4 0 1 0-2.3-7.28A6 6 0 0 1 14 9c0 .7-.12 1.37-.35 2H16ZM8 13c-3.31 0-6 1.79-6 4v2h12v-2c0-2.21-2.69-4-6-4Zm8 0c-.47 0-.92.04-1.35.12A5.03 5.03 0 0 1 16 16.5V19h6v-2c0-2.21-2.69-4-6-4Z",
  };

  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
}

function ArrowIcon({ down = false }) {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
      <path
        d={down ? "m6 9 6 6 6-6" : "m6 15 6-6 6 6"}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({ stat }) {
  const isDown = stat.change.startsWith("-");

  return (
    <article className="rounded-lg bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`rounded p-2 ${toneClasses[stat.tone]}`}>
          <MetricIcon type={stat.icon} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${isDown ? "text-[#BA1A1A]" : "text-[#006C49]"}`}>
          <ArrowIcon down={isDown} />
          {stat.change}
        </div>
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.05em] text-[#434655]">
        {stat.label}
      </p>
      <p className="mt-1 text-2xl font-black text-[#191C1E]">{stat.value}</p>
    </article>
  );
}

export default function Laporan() {
  return (
    <section className="flex w-full flex-col gap-8 bg-[#F7F9FB] font-['Inter',Arial,sans-serif] text-[#191C1E]">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.025em]">
            Kelola Laporan
          </h2>
          <p className="mt-1 text-sm font-medium text-[#434655]">
            Data performa finansial dan operasional
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg bg-[#E6E8EA] px-4 py-2 text-sm font-semibold">
            April 2026
          </button>
          <button className="rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_15px_-3px_rgba(0,74,198,0.2)]">
            Export Data
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_304px]">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Best Seller Menu</h3>
          <div className="mt-6 flex flex-col gap-4">
            {bestSellers.map((item, index) => (
              <div key={item.name} className="flex items-center gap-4 rounded-xl bg-[#F8FAFC] p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-black text-[#2563EB]">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>
                <p className="text-right text-sm font-black text-[#2563EB]">{item.total}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold">Kategori Menu Populer</h3>
          <div className="mt-6 flex flex-col gap-6">
            {categories.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-[0.05em]">
                  <span>{item.label}</span>
                  <span className="text-[#006C49]">{item.value}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#006C49] to-[#10B981]"
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-xl font-black text-[#784B00]">
                1
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
                  Makanan khas sigma
                </p>
                <p className="text-sm font-extrabold">Indomie Nyemek Halu</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[222px_1fr]">
        <article className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Jam Sibuk</h3>
          <p className="mt-4 text-xs leading-5 text-[#434655]">
            Persentase keramaian berdasarkan waktu operasional.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {peakHours.map((item) => (
              <div key={item.time} className="flex items-center gap-3">
                <span className="w-12 text-right text-[10px] font-bold uppercase text-[#434655]">
                  {item.time}
                </span>
                <div className="h-4 flex-1 overflow-hidden rounded-md bg-[#F8FAFC]">
                  <div className={`h-full ${item.color}`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 md:px-8">
            <div>
              <h3 className="text-lg font-bold">Log Transaksi</h3>
              <p className="text-xs font-medium text-[#434655]">
                Transaksi terbaru dalam periode ini
              </p>
            </div>
            <button className="text-xs font-bold text-[#004AC6]">View all</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-y border-slate-100 bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.1em] text-[#434655]">
                <tr>
                  <th className="px-8 py-4 text-left">ID</th>
                  <th className="px-4 py-4 text-left">Tanggal</th>
                  <th className="px-4 py-4 text-left">Pesanan</th>
                  <th className="px-4 py-4 text-left">Tipe</th>
                  <th className="px-4 py-4 text-right">Total</th>
                  <th className="px-8 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-8 py-4 font-bold">{item.id}</td>
                    <td className="px-4 py-4 text-xs font-semibold text-[#434655]">{item.date}</td>
                    <td className="px-4 py-4">{item.items}</td>
                    <td className="px-4 py-4 text-xs font-semibold text-[#434655]">{item.type}</td>
                    <td className="px-4 py-4 text-right font-black">{item.total}</td>
                    <td className="px-8 py-4 text-center">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-black uppercase text-[#006C49]">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
