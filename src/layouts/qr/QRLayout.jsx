import { Link, Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

export default function QRLayout() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [qrTable, setQrTable] = useState(null);
  const menuPath = `/qr/menu${location.search}`;
  const cartPath = `/qr/keranjang${location.search}`;

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const addToCart = (menuItem) => {
    const quantity = Math.max(Number(menuItem.quantity) || 1, 1);
    const cartKey =
      menuItem.cartKey ||
      `${menuItem.id}::${menuItem.variantLabel || "default"}::${menuItem.note || ""}`;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.cartKey === cartKey);

      if (!existingItem) {
        return [...currentItems, { ...menuItem, cartKey, quantity }];
      }

      return currentItems.map((item) =>
        item.cartKey === cartKey
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    });
  };

  const updateCartQuantity = (cartKey, quantity) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.cartKey === cartKey ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (cartKey) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartKey !== cartKey)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-[#091421] text-[#D9E3F6]">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-[#091421] font-['Be_Vietnam_Pro',Arial,sans-serif]">
        <header className="sticky top-0 z-30 flex h-[68px] shrink-0 items-center border-b-4 border-[#212B39] bg-[#091421] px-8 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
          <Link
            to={menuPath}
            className="font-['Space_Grotesk',Arial,sans-serif] text-[17px] font-bold uppercase leading-8 tracking-[-1.2px] text-[#DC2626]"
          >
            Kedai Sigma
          </Link>
        </header>

        <Outlet
          context={{
            addToCart,
            cartCount,
            cartItems,
            cartTotal,
            clearCart,
            removeFromCart,
            updateCartQuantity,
            qrTable,
            setQrTable,
          }}
        />

        <footer className="mt-auto flex min-h-[35px] shrink-0 items-center justify-between border-t-2 border-[#212B39] bg-[#091421] px-6 py-4">
          <p className="text-[10px] uppercase leading-[15px] tracking-[1px] text-[#DC2626]">
            (C) 2025 Kedai Sigma
          </p>
          <nav className="hidden items-center gap-8 text-[10px] uppercase leading-[15px] tracking-[1px] text-[#EEC200] min-[420px]:flex">
            <Link to={menuPath} className="transition hover:text-[#FFB4AB]">
              Menu
            </Link>
            <Link to={cartPath} className="transition hover:text-[#FFB4AB]">
              Pesanan
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
