const isLocalHost = (hostname) =>
  ["localhost", "127.0.0.1", "::1"].includes(hostname);

const isPrivateNetworkHost = (hostname) =>
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
  /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);

const resolveApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.location?.hostname) {
    const { hostname, protocol } = window.location;

    if (isLocalHost(hostname) || isPrivateNetworkHost(hostname)) {
      return `${protocol}//${hostname}:8000/api`;
    }
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return "http://127.0.0.1:8000/api";
};

const API_BASE_URL = resolveApiBaseUrl();
const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_DATA_KEY = "admin_data";

const clearLegacyAdminSession = () => {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_DATA_KEY);
};

export const getAdminToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  clearLegacyAdminSession();

  return window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  window.sessionStorage.removeItem(ADMIN_DATA_KEY);
  clearLegacyAdminSession();
};

const redirectAdminToLogin = () => {
  if (
    typeof window !== "undefined" &&
    window.location?.pathname?.startsWith("/admin")
  ) {
    window.location.assign("/login");
  }
};

const buildUrl = (endpoint, params) => {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
};

const request = async (
  endpoint,
  { method = "GET", body, auth = false, headers = {}, params } = {},
) => {
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  const options = {
    method,
    headers: requestHeaders,
  };

  if (auth) {
    const token = getAdminToken();

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(endpoint, params), options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (auth && response.status === 401) {
      clearAdminSession();
      redirectAdminToLogin();
    }

    const validationMessage = data?.errors
      ? Object.values(data.errors).flat().join(" ")
      : "";

    throw new Error(
      validationMessage || data?.message || "Gagal terhubung ke server.",
    );
  }

  return data;
};

export const loginAdmin = async (username, password) => {
  const data = await request("/admin/login", {
    method: "POST",
    auth: false,
    body: { username, password },
  });

  if (data?.data?.token) {
    clearLegacyAdminSession();
    window.sessionStorage.setItem(ADMIN_TOKEN_KEY, data.data.token);
  }

  return data;
};

export const logoutAdmin = async () => {
  try {
    return await request("/admin/logout", {
      method: "POST",
      auth: true,
    });
  } finally {
    clearAdminSession();
  }
};

export const getAdminDashboard = (params) =>
  request("/admin/dashboard", { auth: true, params });

export const getAdminOrders = () => request("/admin/pesanan", { auth: true });

export const getAdminMenu = () => request("/admin/menu", { auth: true });

export const getAdminMenuCategories = () =>
  request("/admin/kategori", { auth: true });

export const createAdminMenuItem = (payload) =>
  request("/admin/menu", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateAdminMenuItem = (menuId, payload) => {
  if (payload instanceof FormData) {
    if (!payload.has("_method")) {
      payload.append("_method", "PATCH");
    }

    return request(`/admin/menu/${menuId}`, {
      method: "POST",
      auth: true,
      body: payload,
    });
  }

  return request(`/admin/menu/${menuId}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
};

export const deleteAdminMenuItem = (menuId) =>
  request(`/admin/menu/${menuId}`, {
    method: "DELETE",
    auth: true,
  });

export const updateAdminOrderStatus = (orderId, statusPesanan) =>
  request(`/admin/pesanan/${orderId}/status`, {
    method: "PATCH",
    auth: true,
    body: { status_pesanan: statusPesanan },
  });

export const updateAdminOrderPayment = (orderId, statusPembayaran) =>
  request(`/admin/pesanan/${orderId}/payment`, {
    method: "PATCH",
    auth: true,
    body: { status_pembayaran: statusPembayaran },
  });

export const getAdminOrderReceipt = (orderId) =>
  request(`/admin/pesanan/${orderId}/receipt`, { auth: true });

export const resolveAdminOrderStockIssue = (orderId, payload) =>
  request(`/admin/pesanan/${orderId}/stock-issue`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });

export const getAdminReservations = () =>
  request("/admin/reservasi", { auth: true });

export const updateAdminReservationStatus = (
  reservationId,
  statusReservasi,
  mejaId,
) =>
  request(`/admin/reservasi/${reservationId}/status`, {
    method: "PATCH",
    auth: true,
    body: {
      status_reservasi: statusReservasi,
      ...(mejaId ? { meja_id: mejaId } : {}),
    },
  });

export const deleteAdminReservation = (reservationId) =>
  request(`/admin/reservasi/${reservationId}`, {
    method: "DELETE",
    auth: true,
  });

export const getAdminReviews = () => request("/admin/review", { auth: true });

export const replyAdminReview = (reviewId, reply) =>
  request(`/admin/review/${reviewId}/reply`, {
    method: "PATCH",
    auth: true,
    body: { balasan_admin: reply },
  });

export const deleteAdminReview = (reviewId) =>
  request(`/admin/review/${reviewId}`, {
    method: "DELETE",
    auth: true,
  });

export const getAdminReport = (params) =>
  request("/admin/laporan", { auth: true, params });

export const getAdminTables = () => request("/admin/meja", { auth: true });

export const createAdminTable = (payload) =>
  request("/admin/meja", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateAdminTable = (tableId, payload) =>
  request(`/admin/meja/${tableId}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });

export const deleteAdminTable = (tableId) =>
  request(`/admin/meja/${tableId}`, {
    method: "DELETE",
    auth: true,
  });

export const generateAdminTableQr = (tableId) =>
  request(`/admin/meja/${tableId}/qr`, {
    method: "POST",
    auth: true,
  });

export const getPublicReviews = () => request("/public/review");

export const getPublicMenu = (params) =>
  request("/public/menu", { params });

export const getPublicMenuCategories = () => request("/public/kategori");

export const getPublicReservationTables = (params) =>
  request("/public/reservasi/meja", { params });

export const createPublicReview = (payload) =>
  request("/public/review", {
    method: "POST",
    body: payload,
  });

export const likePublicReview = (reviewId) =>
  request(`/public/review/${reviewId}/like`, {
    method: "POST",
  });

export const createPublicReservation = (payload) =>
  request("/public/reservasi", {
    method: "POST",
    body: payload,
  });

export const getQrMenu = (params) =>
  request("/qr/menu", {
    params:
      typeof params === "object"
        ? params
        : params
          ? { meja_id: params }
          : undefined,
  });

export const checkoutQrOrder = (payload) =>
  request("/qr/checkout", {
    method: "POST",
    body: payload,
  });
