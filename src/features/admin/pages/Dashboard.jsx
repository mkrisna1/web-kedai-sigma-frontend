import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-8 max-w-[1024px] mx-auto space-y-8 bg-[#F7F9FB] min-h-screen">

      {/* Statistics Bento Grid */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Daily Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-11 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-wallet text-[#2563EB] text-2xl"></i>
            </div>
            <div className="flex items-center gap-1 text-[#006C49] text-sm font-semibold">
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span>12%</span>
            </div>
          </div>
          <p className="uppercase text-xs tracking-widest text-[#434655] mt-8">Pendapatan Harian</p>
          <p className="text-4xl font-bold text-[#191C1E] mt-1">Rp 5.000.000</p>
        </div>

        {/* Tables Occupied */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="w-11 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chair text-[#16A34A] text-2xl"></i>
            </div>
          </div>
          <p className="uppercase text-xs tracking-widest text-[#434655] mt-8">MEJA YANG TERISI</p>
          <div className="flex items-end gap-1 mt-2">
            <span className="text-4xl font-bold">7</span>
            <span className="text-xl text-gray-500">/8</span>
          </div>
        </div>

        {/* Pending Reservations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-11 h-10 bg-[#F0FFAD] rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-clock text-gray-700"></i>
            </div>
            <div className="bg-[#BA1A1A] text-white text-xs font-bold px-3 py-1 rounded-full">12</div>
          </div>
          <p className="uppercase text-xs tracking-widest text-[#434655] mt-8">RESERVASI BELUM DIPROSES</p>
          <p className="text-4xl font-bold text-[#BA1A1A] mt-1">12</p>
        </div>
      </div>

      {/* Latest Orders & Peak Traffic */}
      <div className="grid grid-cols-7 gap-6">
        
        {/* Latest Orders */}
        <div className="col-span-5 bg-white rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#191C1E]">Transaksi Terakhir</h3>
              <p className="text-[#434655]">Transaksi hari ini</p>
            </div>
            <button className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl font-semibold">
              Lihat Semua
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-widest text-[#434655]">
                <th className="text-left pb-4">ID Pesanan</th>
                <th className="text-left pb-4">Meja</th>
                <th className="text-left pb-4">Waktu</th>
                <th className="text-right pb-4">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { id: '#TRX-9382', table: 'Meja 04', time: '14:32', total: '41K' },
                { id: '#TRX-9381', table: 'Meja 12', time: '13:55', total: '13K' },
                { id: '#TRX-9380', table: 'Meja 01', time: '13:10', total: '69K' },
                { id: '#TRX-9379', table: 'Meja 08', time: '12:45', total: '30K' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-4 text-[#2563EB] font-medium">{item.id}</td>
                  <td className="py-4">{item.table}</td>
                  <td className="py-4 text-gray-600">{item.time}</td>
                  <td className="py-4 text-right font-bold">Rp {item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Peak Traffic */}
        <div className="col-span-2 bg-white rounded-2xl p-8 flex flex-col">
          <h3 className="text-xl font-bold">Peak Traffic</h3>
          <p className="text-sm text-gray-500">Hourly customer flow comparison</p>

          <div className="flex-1 flex items-end gap-3 mt-10 border-b border-l border-gray-200 h-56 relative">
            <div className="flex-1 bg-[#2563EB] rounded-t" style={{height: '65%'}}></div>
            <div className="flex-1 bg-[#2563EB] rounded-t" style={{height: '82%'}}></div>
            <div className="flex-1 bg-[#2563EB] rounded-t" style={{height: '48%'}}></div>
            <div className="flex-1 bg-[#10B981] rounded-t" style={{height: '75%'}}></div>
            <div className="flex-1 bg-[#2563EB] rounded-t" style={{height: '90%'}}></div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2563EB] rounded-full"></div>
                <span>Hari ini</span>
              </div>
              <span className="font-bold">60 Pelanggan</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-[#006C49] rounded-full"></div>
                <span>Minggu ini</span>
              </div>
              <span>300 Pelanggan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;