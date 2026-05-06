const tables = [
  { id: "T-01", name: "Meja 01", capacity: 6, status: "Aktif" },
  { id: "T-02", name: "Meja 02", capacity: 4, status: "Aktif" },
  { id: "T-03", name: "Meja 03", capacity: 6, status: "Maintenance" },
  { id: "T-04", name: "Meja 04", capacity: 4, status: "Aktif" },
  { id: "T-05", name: "Meja 05", capacity: 4, status: "Aktif" },
  { id: "T-06", name: "Meja 06", capacity: 4, status: "Aktif" },
  { id: "T-07", name: "Meja 07", capacity: 4, status: "Aktif" },
  { id: "T-08", name: "Meja 08", capacity: 4, status: "Aktif" },
];

const stats = [
  {
    label: "TOTAL UNIT MEJA",
    value: tables.length,
    description: "+3 unit baru bulan ini",
    valueClass: "text-[#004AC6]",
    borderClass: "",
    descriptionClass: "text-[#006C49]",
    hiddenDescription: true,
  },
  {
    label: "AKTIF",
    value: tables.filter((table) => table.status === "Aktif").length,
    description: "Siap digunakan pelanggan",
    valueClass: "text-[#191C1E]",
    borderClass: "border-l-4 border-[#006C49]",
    descriptionClass: "text-[#434655]",
  },
  {
    label: "BUTUH MAINTENANCE",
    value: tables.filter((table) => table.status === "Maintenance").length,
    description: "Membutuhkan perhatian segera",
    valueClass: "text-[#191C1E]",
    borderClass: "border-l-4 border-[#BA1A1A]",
    descriptionClass: "font-semibold text-[#BA1A1A]",
  },
];

function TableIcon({ className = "text-[#004AC6]" }) {
  return (
    <svg
      viewBox="0 0 24 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 4.5C4 2.57 5.57 1 7.5 1h9C18.43 1 20 2.57 20 4.5V9H4V4.5Z"
        fill="currentColor"
      />
      <path
        d="M2.75 10.5h18.5c.69 0 1.25.56 1.25 1.25S21.94 13 21.25 13H20v5a1 1 0 1 1-2 0v-5H6v5a1 1 0 1 1-2 0v-5H2.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function QrIcon({ className = "text-white" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 2h5v5H2V2Zm2 2v1h1V4H4Zm5-2h5v5H9V2Zm2 2v1h1V4h-1ZM2 9h5v5H2V9Zm2 2v1h1v-1H4Zm6-2h2v2h-2V9Zm-1 3h2v2H9v-2Zm3 0h2v2h-2v-2Zm0-3h2v2h-2V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StatCard({ stat }) {
  return (
    <div
      className={`rounded-lg bg-[#F2F4F6] p-6 ${stat.borderClass}`.trim()}
    >
      <p className="text-xs font-bold uppercase tracking-normal text-[#434655]">
        {stat.label}
      </p>
      <p
        className={`mt-2 text-4xl font-black leading-10 tracking-normal ${stat.valueClass}`}
      >
        {stat.value}
      </p>
      <p
        className={`mt-2 text-xs leading-4 ${stat.descriptionClass} ${
          stat.hiddenDescription ? "invisible" : ""
        }`}
      >
        {stat.description}
      </p>
    </div>
  );
}

function TableCard({ table }) {
  const isMaintenance = table.status === "Maintenance";

  return (
    <article
      className={`rounded-lg p-5 ${
        isMaintenance
          ? "border border-[#FFDAD6]/30 bg-[#F2F4F6]"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            isMaintenance ? "bg-[#FFDAD6]/60" : "bg-[#EFF6FF]"
          }`}
        >
          <TableIcon
            className={`h-5 w-6 ${
              isMaintenance ? "text-[#BA1A1A]" : "text-[#004AC6]"
            }`}
          />
        </div>

        <div className="flex flex-col items-end">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold leading-[15px] ${
              isMaintenance
                ? "bg-[#FFDAD6] text-[#BA1A1A]"
                : "bg-[#6CF8BB] text-[#006C49]"
            }`}
          >
            {table.status}
          </span>
          <span className="mt-1 text-[10px] uppercase leading-[15px] tracking-normal text-[#434655]">
            Unit ID: {table.id}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h3
          className={`text-lg font-bold leading-7 text-[#191C1E] ${
            isMaintenance ? "opacity-50" : ""
          }`}
        >
          {table.name}
        </h3>
        <p className="text-sm leading-5 text-[#434655]">
          Kapasitas: {table.capacity} Orang
        </p>
      </div>

      <button
        type="button"
        disabled={isMaintenance}
        className={`mt-6 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-bold leading-4 transition ${
          isMaintenance
            ? "cursor-not-allowed bg-[#E6E8EA] text-[#434655]"
            : "bg-gradient-to-br from-[#004AC6] to-[#2563EB] text-white hover:brightness-105"
        }`}
      >
        <QrIcon
          className={`h-3 w-3 ${isMaintenance ? "text-[#434655]" : "text-white"}`}
        />
        {isMaintenance ? "Repair" : "Lihat QR"}
      </button>
    </article>
  );
}

export default function MejaAdmin() {
  return (
    <main className="min-h-screen bg-[#F7F9FB] p-6 font-['Inter',Arial,sans-serif] text-[#191C1E] sm:p-8">
      <section className="mx-auto flex w-full max-w-[960px] flex-col gap-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-9 tracking-normal text-[#191C1E]">
              Kelola Meja & QR
            </h1>
            <p className="mt-2 text-sm font-medium leading-5 text-[#434655]">
              Atur status meja, kapasitas, dan kode QR untuk pelanggan.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3" aria-label="Statistik meja">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h2 className="whitespace-nowrap text-xl font-bold leading-7 text-[#191C1E]">
              Sektor A
            </h2>
            <div className="h-px flex-1 bg-[#E6E8EA]" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tables.map((table) => (
              <TableCard key={table.id} table={table} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
