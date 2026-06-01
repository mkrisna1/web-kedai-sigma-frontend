import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const ORDER_TYPE_KEY = "kedai_sigma_order_type";
const CART_STORAGE_KEY = "kedai_sigma_qr_carts";

const readSessionJson = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export default function QRLayout() {
  const location = useLocation();
  const cartScopeKey = location.search || "default";
  const [cartByScope, setCartByScope] = useState(() =>
    readSessionJson(CART_STORAGE_KEY, {}),
  );
  const cartItems = useMemo(
    () => cartByScope[cartScopeKey] || [],
    [cartByScope, cartScopeKey],
  );
  const [qrTable, setQrTable] = useState(null);
  const [orderType, setOrderTypeState] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.sessionStorage.getItem(ORDER_TYPE_KEY) || null;
  });
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

  useEffect(() => {
    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartByScope));
  }, [cartByScope]);

  const setCartItems = (updater) => {
    setCartByScope((currentByScope) => {
      const currentItems = currentByScope[cartScopeKey] || [];
      const nextItems =
        typeof updater === "function" ? updater(currentItems) : updater;

      return {
        ...currentByScope,
        [cartScopeKey]: nextItems,
      };
    });
  };

  const setOrderType = (type) => {
    setOrderTypeState(type);

    if (type) {
      window.sessionStorage.setItem(ORDER_TYPE_KEY, type);
      return;
    }

    window.sessionStorage.removeItem(ORDER_TYPE_KEY);
  };

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
    <div className="min-h-screen bg-[#091421] text-[#D9E3F6] overflow-x-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-[#091421] font-['Be_Vietnam_Pro',Arial,sans-serif]">
        <header className="sticky top-0 z-30 flex min-h-[76px] shrink-0 items-center justify-between border-b-4 border-[#212B39] bg-[#091421]/95 px-6 py-3 shadow-[0_0_20px_rgba(220,38,38,0.1)] backdrop-blur">
          <div className="flex min-w-0 flex-col gap-1">
            <Link
              to={menuPath}
              className="font-['Space_Grotesk',Arial,sans-serif] text-[17px] font-bold leading-6 tracking-[-0.4px] text-[#DC2626]"
            >
              Kedai Sigma
            </Link>
          </div>
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
            orderType,
            setOrderType,
          }}
        />

        <footer className="mt-auto flex min-h-[35px] shrink-0 items-center justify-between border-t-2 border-[#212B39] bg-[#091421] px-6 py-4">
          <p className="text-[10px] leading-[15px] tracking-[0.4px] text-[#DC2626]">
            2025 Kedai Sigma
          </p>
          <nav className="hidden items-center gap-8 text-[10px] leading-[15px] tracking-[0.4px] text-[#EEC200] min-[420px]:flex">
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
