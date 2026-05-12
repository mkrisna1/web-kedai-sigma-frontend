import { Link, useOutletContext } from "react-router-dom";

const formatRupiah = (value) => `Rp ${value.toLocaleString("id-ID")}`;

function PlusIcon({ className = "h-3 w-3" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M7 15V9H1V7h6V1h2v6h6v2H9v6H7Z" fill="currentColor" />
    </svg>
  );
}

function MinusIcon({ className = "h-3 w-3" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 7h12v2H2V7Z" fill="currentColor" />
    </svg>
  );
}

function TrashIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 16 18" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 18c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 1 16V3H0V1h5V0h6v1h5v2h-1v13c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H3Zm10-15H3v13h10V3ZM5 14h2V5H5v9Zm4 0h2V5H9v9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 20 12" fill="none" aria-hidden="true" className="h-[7.4px] w-3">
      <path d="M6.5.5 1 6l5.5 5.5 1.4-1.4L4.8 7H19V5H4.8l3.1-3.1L6.5.5Z" fill="currentColor" />
    </svg>
  );
}

function CartItemCard({ item, onQuantityChange, onRemove }) {
  return (
    <article className="overflow-hidden bg-[#16202E] border-b-8 border-[#DC2626]">
      <div className="flex gap-3 p-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-20 w-20 shrink-0 object-cover"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-['Space_Grotesk',Arial,sans-serif] text-sm font-bold uppercase leading-5 tracking-[1px] text-[#D9E3F6]">
              {item.name}
            </h2>
            <button
              type="button"
              onClick={() => onRemove(item.cartKey)}
              aria-label={`Hapus ${item.name}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center text-[#FFB4AB] transition hover:text-white"
            >
              <TrashIcon />
            </button>
          </div>

          <p className="mt-1 text-xs font-bold uppercase leading-4 tracking-[1px] text-[#EEC200]">
            {formatRupiah(item.price)}
          </p>

          {(item.variantLabel || item.note) && (
            <div className="mt-2 space-y-1 text-[10px] uppercase leading-4 tracking-[0.8px] text-[#E6BDB8]">
              {item.variantLabel && <p>{item.variantLabel}</p>}
              {item.note && <p>Catatan: {item.note}</p>}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex h-9 items-center bg-[#091421]">
              <button
                type="button"
                onClick={() => onQuantityChange(item.cartKey, item.quantity - 1)}
                className="flex h-9 w-9 items-center justify-center text-[#EEC200] transition hover:bg-[#212B39]"
                aria-label={`Kurangi ${item.name}`}
              >
                <MinusIcon />
              </button>
              <span className="flex h-9 min-w-9 items-center justify-center font-['Space_Grotesk',Arial,sans-serif] text-sm font-bold text-white">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(item.cartKey, item.quantity + 1)}
                className="flex h-9 w-9 items-center justify-center text-[#EEC200] transition hover:bg-[#212B39]"
                aria-label={`Tambah ${item.name}`}
              >
                <PlusIcon />
              </button>
            </div>

            <p className="shrink-0 font-['Space_Grotesk',Arial,sans-serif] text-base font-bold text-[#D9E3F6]">
              {formatRupiah(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Keranjang() {
  const {
    cartItems,
    cartTotal,
    clearCart,
    removeFromCart,
    updateCartQuantity,
  } = useOutletContext();

  const handleConfirm = () => {
    if (!cartItems.length) {
      return;
    }

    window.alert(
      `Pesanan meja 04 diterima.\nTotal: ${formatRupiah(cartTotal)}`
    );
    clearCart();
  };

  return (
    <main className="flex flex-1 flex-col gap-[29px] border-r-4 border-[#212B39] px-7 pb-12 pt-7">
      <section className="box-border flex w-full max-w-[285px] flex-col border-l-8 border-[#DC2626] py-4 pl-2.5">
        <h1 className="font-['Space_Grotesk',Arial,sans-serif] text-[44px] font-bold uppercase leading-[48px] tracking-[-2px] text-[#D9E3F6]">
          Pesanan
        </h1>
        <p className="w-full max-w-[267px] text-[10px] font-medium uppercase leading-5 tracking-[1.4px] text-[#E6BDB8]">
          Cek lagi menu pilihanmu sebelum dikirim ke kasir.
        </p>
      </section>

      <Link
        to="/qr/menu"
        className="flex h-12 w-[210px] items-center justify-center gap-3 border-l-4 border-[#EEC200] bg-[#212B39] px-4 font-['Space_Grotesk',Arial,sans-serif] text-xs font-bold uppercase tracking-[1.6px] text-[#EEC200] transition hover:text-[#FFB4AB]"
      >
        <ArrowLeftIcon />
        Kembali Menu
      </Link>

      {cartItems.length === 0 ? (
        <section className="w-full max-w-[334px] border-l-4 border-[#EEC200] bg-[#212B39] p-5">
          <h2 className="font-['Space_Grotesk',Arial,sans-serif] text-xl font-bold uppercase leading-7 text-[#D9E3F6]">
            Keranjang Kosong
          </h2>
          <p className="mt-3 text-xs uppercase leading-5 tracking-[1px] text-[#E6BDB8]">
            Pilih menu dulu, nanti pesananmu muncul di sini.
          </p>
        </section>
      ) : (
        <>
          <section className="flex w-full max-w-[334px] flex-col gap-4">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.cartKey}
                item={item}
                onQuantityChange={updateCartQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </section>

          <section className="w-full max-w-[334px] bg-[#16202E] p-5 border-b-8 border-[#EEC200]">
            <div className="flex items-center justify-between gap-4 border-b-2 border-[#2B3544] pb-4">
              <span className="text-xs font-bold uppercase leading-4 tracking-[1.2px] text-[#E6BDB8]">
                Total Harga
              </span>
              <span className="font-['Space_Grotesk',Arial,sans-serif] text-2xl font-bold leading-7 text-[#EEC200]">
                {formatRupiah(cartTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="mt-5 flex h-[60px] w-full items-center justify-center bg-[#EEC200] px-4 font-['Space_Grotesk',Arial,sans-serif] text-sm font-black uppercase leading-5 tracking-[2px] text-[#3C2F00] shadow-[8px_8px_0_#3C2F00] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0_#3C2F00]"
            >
              Kirim Pesanan
            </button>
          </section>
        </>
      )}
    </main>
  );
}
