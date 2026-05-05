import { useState } from "react";

/* =========================
   DATA
========================= */
const STATS = [
  { label: "Pending Orders", value: 1, color: "border-blue-600", iconBg: "bg-blue-50", iconColor: "text-blue-600", valColor: "text-gray-900" },
  { label: "In Preparation", value: 2, color: "border-amber-500", iconBg: "bg-amber-50", iconColor: "text-amber-600", valColor: "text-gray-900" },
  { label: "Completed (Today)", value: 40, color: "border-emerald-700", iconBg: "bg-emerald-50", iconColor: "text-emerald-700", valColor: "text-gray-900" },
  { label: "Cancelled", value: 0, color: "border-red-700", iconBg: "bg-red-50", iconColor: "text-red-700", valColor: "text-gray-900" },
];

const ORDERS = [
  {
    id: "KS-9281",
    table: "T-04",
    tableColor: "border-blue-200 text-blue-700",
    time: "Dipesan 4 menit lalu",
    status: "Pending",
    statusBg: "bg-indigo-200 text-indigo-900",
    headerBg: "bg-blue-50/30",
    items: [
      { name: "2x Kentang", price: "20K" },
      { name: "1x Ice Matcha", price: "13K" },
      { name: "2x Ice Coffee Latte", price: "26K" },
    ],
    total: "59K",
    totalColor: "text-blue-700",
    primaryBtn: { label: "Konfirmasi Pesanan", bg: "bg-blue-700 hover:bg-blue-800 text-white", width: "w-full" },
    secondaryBtn: null,
    strikethrough: false,
  },
  {
    id: "KS-7743",
    table: "T-08",
    tableColor: "border-amber-300 text-amber-600",
    time: "Disiapkan: 12 menit",
    status: "Processing",
    statusBg: "bg-orange-200 text-orange-900",
    headerBg: "bg-amber-50/30",
    items: [
      { name: "1x Sosis Solo", price: "13K" },
      { name: "1x Ice Lemon Tea", price: "10K" },
    ],
    total: "23K",
    totalColor: "text-amber-600",
    primaryBtn: { label: "Selesai Disiapkan", bg: "bg-amber-500 hover:bg-amber-600 text-white", width: "flex-1" },
    secondaryBtn: true,
    strikethrough: false,
  },
];

/* =========================
   COMPONENTS
========================= */
function StatCard({ label, value, color, iconBg, iconColor, valColor }) {
  return (
    <div className={`flex-1 bg-white rounded-lg shadow-sm border-b-4 ${color} p-6 flex flex-col gap-1`}>
      <div className={`rounded p-2 w-fit ${iconBg}`}>
        <span className={`${iconColor}`}>■</span>
      </div>

      <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mt-2">
        {label}
      </p>

      <p className={`text-3xl font-black tracking-tight ${valColor}`}>
        {value}
      </p>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col">

      {/* Header */}
      <div className={`flex justify-between items-center px-5 py-4 ${order.headerBg} border-b border-gray-100/20`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-white border rounded flex items-center justify-center font-bold ${order.tableColor}`}>
            {order.table}
          </div>
          <div>
            <p className="font-bold text-gray-900">Order #{order.id}</p>
            <p className="text-xs text-gray-500">{order.time}</p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2 py-1 rounded ${order.statusBg}`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.name}</span>
            <span className="font-semibold">{item.price}</span>
          </div>
        ))}

        <div className="border-t pt-3 flex justify-between items-center mt-2">
          <span className="text-xs font-bold uppercase text-gray-500">
            Total
          </span>
          <span className={`text-lg font-black ${order.totalColor}`}>
            {order.total}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-4 py-4 flex gap-2">
        <button className={`flex-1 py-2.5 rounded text-xs font-bold ${order.primaryBtn.bg}`}>
          {order.primaryBtn.label}
        </button>

        {order.secondaryBtn && (
          <button className="w-10 h-10 bg-white border rounded flex items-center justify-center">
            •••
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================
   PAGE (CONTENT ONLY)
========================= */
export default function Pesanan() {
  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold">Kelola Pesanan</h1>
        <p className="text-gray-600">
          Pantau semua pesanan secara real-time
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        {STATS.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Orders */}
      <div className="grid grid-cols-3 gap-6">
        {ORDERS.map((o, i) => (
          <OrderCard key={i} order={o} />
        ))}
      </div>
    </div>
  );
}