import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getAdminOrderReceipt } from "../../../services/api";

const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const formatTimeLabel = (value) => {
  if (!value) return "Baru masuk";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatCalendarLabel = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

export default function StrukAdmin() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const receiptToken = searchParams.get("token") || "";
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getAdminOrderReceipt(id, receiptToken)
      .then((res) => {
        if (isMounted) {
          setReceipt(res.data);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Gagal memuat struk");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id, receiptToken]);

  useEffect(() => {
    if (!loading && receipt && !error) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, receipt, error]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#F7F9FB]"><p>Memuat struk...</p></div>;
  }

  if (error || !receipt) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#F7F9FB]">
        <p className="text-red-500 mb-4">{error || "Struk tidak ditemukan"}</p>
        <Link to="/admin/pesanan" className="bg-[#2563EB] text-white px-4 py-2 rounded">Kembali</Link>
      </div>
    );
  }

  const items = receipt.items || receipt.detail_pesanans || [];
  const mejaName = receipt.meja?.nomor_meja || (receipt.tipe_pesanan === "takeaway" ? "Bawa Pulang" : "Takeaway");
  const orderIdRaw = receipt.id || receipt.id_pesanan;
  const orderId = `#ORD-${String(orderIdRaw).padStart(3, "0")}`;
  const dateValue = receipt.tgl_pesanan || receipt.created_at;

  const total = items.reduce((sum, item) => {
    const qty = item.jumlah_item || item.quantity || 1;
    const price = item.harga_satuan || item.harga || item.harga_produk || 0;
    const subtotal = item.subtotal || (price * qty);
    // Asumsikan note 'Stok habis' tidak dihitung, tapi di receipt endpoint mungkin sudah bersih.
    if (item.opsi_varian === 'Stok habis') return sum;
    return sum + Number(subtotal);
  }, 0);

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#191c1e] font-['Arial',sans-serif] print:bg-white flex flex-col items-center py-6 print:py-0">
      <main className="w-[320px] bg-white p-6 rounded-[14px] shadow-[0_16px_40px_rgba(15,23,42,0.12)] print:w-full print:shadow-none print:m-0 print:rounded-none">
        <h1 className="m-0 text-[22px] tracking-[1px] uppercase">Kedai Sigma</h1>
        <div className="mt-[10px] text-[#434655] text-xs leading-[1.6]">
          <div>{orderId}</div>
          <div>Meja {mejaName.replace(/^meja\s*/i, "")}</div>
          <div>{formatCalendarLabel(dateValue)} - {formatTimeLabel(dateValue)}</div>
        </div>
        
        <table className="w-full border-collapse mt-[18px] text-xs">
          <tbody>
            {items.map((item, idx) => {
              const itemName = item.produk?.nama_produk || item.nama_produk || "Menu";
              const qty = item.jumlah_item || item.quantity || 1;
              const price = item.harga_satuan || item.harga || item.harga_produk || 0;
              const subtotal = item.subtotal || (price * qty);
              const notes = item.opsi_varian ? ` (${item.opsi_varian})` : "";
              const displayName = qty > 1 ? `${qty}x ${itemName}` : itemName;

              return (
                <tr key={idx}>
                  <td className="border-b border-dashed border-[#c3c6d7] py-2.5 align-top">
                    {displayName}{notes}
                  </td>
                  <td className="border-b border-dashed border-[#c3c6d7] py-2.5 align-top text-right whitespace-nowrap font-bold">
                    {item.opsi_varian === 'Stok habis' ? formatRupiah(0) : formatRupiah(subtotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between mt-[18px] pt-4 border-t-2 border-[#191c1e] text-[15px] font-[800]">
          <span>Total</span>
          <span>{formatRupiah(total)}</span>
        </div>
        <p className="mt-5 text-center text-[#ba1a1a] text-[11px] font-[800] uppercase">
          Terima kasih
        </p>
      </main>

      <div className="mt-8 flex flex-col gap-3 text-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-[#2563EB] text-white font-bold py-2.5 px-6 rounded-lg shadow-sm hover:bg-[#1D4ED8] transition"
        >
          Cetak Ulang
        </button>
        <Link to="/admin/pesanan" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition">
          Kembali ke Pesanan
        </Link>
      </div>
    </div>
  );
}
