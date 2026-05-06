const reservations = [
  {
    initials: "AR",
    name: "Ariel Pratama",
    phone: "+62 812-8888-2211",
    guests: "4 Person",
    date: "Apr 6, 2026",
    time: "19:00 PM",
    status: "Pending",
  },
  {
    initials: "NA",
    name: "Nadia Putri",
    phone: "+62 813-4477-9910",
    guests: "3 Person",
    date: "Apr 6, 2026",
    time: "18:30 PM",
    status: "Confirmed",
  },
  {
    initials: "BS",
    name: "Bima Santoso",
    phone: "+62 857-3312-0044",
    guests: "20 Person",
    date: "Apr 6, 2026",
    time: "20:15 PM",
    status: "Cancelled",
  },
  {
    initials: "KY",
    name: "Kyla Dewi",
    phone: "+62 821-7780-2219",
    guests: "2 Person",
    date: "Apr 6, 2026",
    time: "12:00 PM",
    status: "Confirmed",
  },
];

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function CalendarIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm12 8H5v10h14V10ZM5 8h14V6H5v2Z" />
    </svg>
  );
}

function UsersIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16 11a4 4 0 1 0-3.46-6A5.97 5.97 0 0 1 14 9c0 .73-.13 1.43-.37 2H16ZM8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.31 0-6 1.79-6 4v2h12v-2c0-2.21-2.69-4-6-4Zm8 0c-.45 0-.88.04-1.3.11.82.95 1.3 2.07 1.3 3.39V19h6v-2c0-2.21-2.69-4-6-4Z" />
    </svg>
  );
}

function DotsIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex min-w-[220px] flex-1 flex-col gap-2">
      <span className="px-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function ReservasiAdmin() {
  return (
    <section className="flex w-full flex-col gap-8 bg-[#F7F9FB] font-['Inter',Arial,sans-serif] text-[#191C1E]">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-[0_10px_30px_rgba(25,28,30,0.04)] lg:flex-row lg:items-end">
          <Field label="Filter Tanggal">
            <input
              type="date"
              className="h-[43px] rounded border border-b-2 border-[#C3C6D7] bg-[#F2F4F6] px-4 text-sm text-[#191C1E] outline-none transition focus:border-blue-500"
            />
          </Field>

          <Field label="Status Reservasi">
            <select className="h-[43px] rounded border border-b-2 border-[#C3C6D7] bg-[#F2F4F6] px-4 text-sm text-[#191C1E] outline-none transition focus:border-blue-500">
              <option>Semua Status</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
          </Field>

          <button className="h-10 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-8 text-sm font-semibold text-white shadow-[0_10px_15px_-3px_rgba(59,130,246,0.2)] transition hover:brightness-105">
            Terapkan
          </button>
        </div>

        <aside className="relative min-h-[123px] overflow-hidden rounded-lg bg-[#2563EB] p-6 text-white shadow-[0_10px_30px_rgba(25,28,30,0.04)] lg:w-[222px]">
          <CalendarIcon className="absolute -right-2 bottom-2 h-20 w-20 text-white/20" />
          <p className="text-xs font-medium uppercase tracking-[0.05em] text-white/70">
            Total hari ini
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-[-0.025em]">
            12
          </p>
        </aside>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(25,28,30,0.04)]">
        <div className="flex items-center justify-between border-b border-[#E6E8EA] p-6">
          <div>
            <h3 className="text-lg font-bold text-[#191C1E]">
              Reservasi yang masuk
            </h3>
            <p className="mt-1 text-sm text-[#434655]">
              Status booking meja secara real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded p-2 text-[#434655] transition hover:bg-slate-100">
              <DotsIcon />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[#F2F4F6]/50 text-[10px] font-bold uppercase tracking-[0.1em] text-[#434655]">
              <tr>
                <th className="px-6 py-4 text-left">Nama Pelanggan</th>
                <th className="px-6 py-4 text-left">Tamu</th>
                <th className="px-6 py-4 text-left">Tanggal</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8EA]">
              {reservations.map((item) => (
                <tr key={`${item.name}-${item.time}`} className="transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[#191C1E]">{item.name}</p>
                        <p className="text-[10px] text-[#434655]">{item.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium">{item.guests}</td>
                  <td className="px-6 py-5">
                    <p className="font-medium">{item.date}</p>
                    <p className="text-xs text-[#434655]">{item.time}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      {item.status === "Pending" ? (
                        <>
                          <button className="rounded bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100">
                            Terima
                          </button>
                          <button className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100">
                            Tolak
                          </button>
                        </>
                      ) : (
                        <button className="rounded p-2 text-[#434655] transition hover:bg-slate-100 disabled:opacity-50" disabled={item.status === "Cancelled"}>
                          <DotsIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E6E8EA] bg-[#F2F4F6] p-6 text-xs font-medium text-[#434655] sm:flex-row sm:items-center sm:justify-between">
          <span>Showing 1 to 4 of 12 entries</span>
          <div className="flex items-center gap-1">
            <button className="rounded border border-[#C3C6D7] px-3 py-1.5">Previous</button>
            <button className="rounded bg-[#004AC6] px-3 py-1.5 font-bold text-white shadow-sm">1</button>
            <button className="rounded border border-[#C3C6D7] px-3 py-1.5">2</button>
            <button className="rounded border border-[#C3C6D7] px-3 py-1.5">3</button>
            <button className="rounded border border-[#C3C6D7] px-3 py-1.5">Next</button>
          </div>
        </div>
      </div>
    </section>
  );
}
