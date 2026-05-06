const stats = [
  { label: "Total Items", value: "24" },
  { label: "Active Categories", value: "3" },
  { label: "Out of Stock", value: "01", danger: true },
  { label: "Avg Price", value: "IDR 15k" },
];

const menuItems = [
  {
    name: "Matcha",
    sku: "SKU-MT-001",
    category: "Minuman",
    price: "Rp 13.000",
    status: "ACTIVE",
    thumbnail: "from-emerald-100 via-lime-200 to-teal-300",
  },
  {
    name: "Matcha",
    sku: "SKU-MT-002",
    category: "Minuman",
    price: "Rp 13.000",
    status: "ACTIVE",
    thumbnail: "from-green-100 via-emerald-200 to-cyan-300",
  },
  {
    name: "Coffe Latte",
    sku: "SKU-CL-003",
    category: "Minuman",
    price: "Rp 15.000",
    status: "ACTIVE",
    thumbnail: "from-stone-200 via-amber-200 to-orange-300",
  },
  {
    name: "Indomie Nyemek Halu",
    sku: "SKU-IN-004",
    category: "Makanan",
    price: "Rp 15.000",
    status: "OUT OF STOCK",
    thumbnail: "from-yellow-100 via-orange-200 to-red-300",
  },
  {
    name: "Coffe Milk",
    sku: "SKU-CM-005",
    category: "Minuman",
    price: "Rp 13.000",
    status: "ACTIVE",
    thumbnail: "from-slate-200 via-stone-200 to-amber-300",
  },
  {
    name: "Matcha",
    sku: "SKU-MT-006",
    category: "Minuman",
    price: "Rp 13.000",
    status: "ACTIVE",
    thumbnail: "from-emerald-100 via-lime-200 to-teal-300",
  },
  {
    name: "Coffe Latte",
    sku: "SKU-CL-007",
    category: "Minuman",
    price: "Rp 15.000",
    status: "ACTIVE",
    thumbnail: "from-stone-200 via-amber-200 to-orange-300",
  },
  {
    name: "Indomie Nyemek Halu",
    sku: "SKU-IN-008",
    category: "Makanan",
    price: "Rp 15.000",
    status: "OUT OF STOCK",
    thumbnail: "from-yellow-100 via-orange-200 to-red-300",
  },
];

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
      <path
        d="M6 14V8H0V6H6V0H8V6H14V8H8V14H6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 16H3.4L12.025 7.375L10.625 5.975L2 14.6V16ZM0 18V13.75L12.025 1.75C12.225 1.56667 12.4458 1.425 12.6875 1.325C12.9292 1.225 13.1833 1.175 13.45 1.175C13.7167 1.175 13.975 1.225 14.225 1.325C14.475 1.425 14.6917 1.575 14.875 1.775L16.25 3.175C16.45 3.35833 16.5958 3.575 16.6875 3.825C16.7792 4.075 16.825 4.325 16.825 4.575C16.825 4.84167 16.7792 5.09583 16.6875 5.3375C16.5958 5.57917 16.45 5.8 16.25 6L4.25 18H0ZM11.325 6.675L10.625 5.975L12.025 7.375L11.325 6.675Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 16 18" fill="none">
      <path
        d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-3 w-2" viewBox="0 0 8 12" fill="none">
      <path
        d="M6.6 12L0.6 6L6.6 0L8 1.4L3.4 6L8 10.6L6.6 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-3 w-2" viewBox="0 0 8 12" fill="none">
      <path
        d="M1.4 12L0 10.6L4.6 6L0 1.4L1.4 0L7.4 6L1.4 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StatCard({ label, value, danger }) {
  return (
    <div className="h-[108px] rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
      <p className="text-xs font-bold uppercase leading-4 tracking-[0.6px] text-[#434655]">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-bold leading-9 ${
          danger ? "text-[#BA1A1A]" : "text-[#191C1E]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const isOutOfStock = status === "OUT OF STOCK";

  return (
    <span
      className={`inline-flex h-5 items-center gap-1.5 rounded-xl px-3 text-[10px] font-bold uppercase leading-3 tracking-[0.25px] ${
        isOutOfStock
          ? "bg-[#FFDAD6] text-[#93000A]"
          : "bg-[#6CF8BB] text-[#00714D]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOutOfStock ? "bg-[#BA1A1A]" : "bg-[#006C49]"
        }`}
      />
      {status}
    </span>
  );
}

function MenuThumbnail({ gradient }) {
  return (
    <div className={`h-12 w-12 shrink-0 overflow-hidden rounded bg-gradient-to-br ${gradient}`}>
      <div className="flex h-full w-full items-center justify-center bg-white/10">
        <div className="h-7 w-7 rounded-full bg-white/35 shadow-inner" />
      </div>
    </div>
  );
}

function MenuRow({ item, index }) {
  return (
    <tr className={index > 1 ? "border-t border-[#E6E8EA]" : ""}>
      <td className="h-[81px] px-6">
        <div className="flex items-center gap-4">
          <MenuThumbnail gradient={item.thumbnail} />
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-5 text-[#191C1E]">
              {item.name}
            </p>
            <p className="truncate text-xs leading-4 text-[#434655]">{item.sku}</p>
          </div>
        </div>
      </td>
      <td className="h-[81px] px-6 pl-12 text-sm leading-5 text-[#434655]">
        {item.category}
      </td>
      <td className="h-[81px] px-6 text-base font-semibold leading-5 text-[#191C1E]">
        {item.price}
      </td>
      <td className="h-[81px] px-6">
        <StatusBadge status={item.status} />
      </td>
      <td className="h-[81px] px-6">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            aria-label={`Edit ${item.name}`}
            className="flex h-[34px] w-[34px] items-center justify-center rounded text-[#004AC6] transition hover:bg-blue-50"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            aria-label={`Hapus ${item.name}`}
            className="flex h-[34px] w-8 items-center justify-center rounded text-[#BA1A1A] transition hover:bg-red-50"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function MenuAdmin() {
  return (
    <div className="min-h-full bg-[#F7F9FB] p-8">
      <div className="mx-auto max-w-[960px] space-y-8">
        <section className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold leading-9 text-[#191C1E]">
              Kelola Menu
            </h1>
            <p className="mt-1 text-sm leading-5 text-[#434655]">
              Kontrol stok dan atur harga.
            </p>
          </div>

          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-lg bg-gradient-to-br from-[#004AC6] to-[#2563EB] px-6 text-base font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:brightness-105"
          >
            <PlusIcon />
            Tambah Menu
          </button>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] table-fixed border-collapse">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[16%]" />
                <col className="w-[15%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
              </colgroup>

              <thead>
                <tr className="h-12 bg-[#F2F4F6]/30 text-left text-xs font-bold uppercase tracking-[1.2px] text-[#434655]">
                  <th className="px-6">Menu Item</th>
                  <th className="px-6">Category</th>
                  <th className="px-6">Price</th>
                  <th className="px-6">Status</th>
                  <th className="px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {menuItems.map((item, index) => (
                  <MenuRow key={item.sku} item={item} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          <footer className="flex h-[61px] items-center justify-between border-t border-[#E6E8EA] bg-[#F2F4F6]/10 px-6">
            <p className="text-xs leading-4 text-[#434655]">
              Showing 8 of 24 menu items
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="flex h-7 w-6 items-center justify-center text-[#434655] opacity-30"
              >
                <ChevronLeftIcon />
              </button>
              <span className="px-3 text-xs font-bold leading-4 text-[#191C1E]">
                1
              </span>
              <button
                type="button"
                className="flex h-7 w-6 items-center justify-center rounded text-[#434655] transition hover:bg-slate-100"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
