export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const BASE_URL = API_BASE_URL.replace(/\/$/, '');
const API_ORIGIN = new URL(BASE_URL, window.location.origin).origin;

export const resolveBackendAsset = (path = '') => {
    if (!path) {
        return '';
    }

    if (/^(https?:|blob:|data:)/.test(path)) {
        return path;
    }

    return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

const getStoredToken = () => {
    const currentToken = localStorage.getItem('admin_token');
    const legacyToken = localStorage.getItem('token');

    if (currentToken) {
        return currentToken;
    }

    if (legacyToken) {
        localStorage.setItem('admin_token', legacyToken);
        return legacyToken;
    }

    return null;
};

const readJson = async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('token');

            throw new Error('Sesi admin berakhir. Silakan login ulang.');
        }

        const validationMessage = data?.errors
            ? Object.values(data.errors).flat().join(' ')
            : null;

        throw new Error(validationMessage || data.message || 'Permintaan gagal diproses');
    }

    return data;
};

const request = async (path, options = {}) => {
    const { headers = {}, ...requestOptions } = options;
    const isFormData =
        typeof FormData !== 'undefined' && requestOptions.body instanceof FormData;
    const response = await fetch(`${BASE_URL}${path}`, {
        ...requestOptions,
        headers: {
            Accept: 'application/json',
            ...(requestOptions.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
            ...headers,
        },
    });

    return readJson(response);
};

export const loginAdmin = async (username, password) => {
    try {
        const data = await request('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        localStorage.setItem('admin_token', data.data.token);
        localStorage.removeItem('token');

        return data;
    } catch (error) {
        console.error('Error pada api.js:', error);
        throw error;
    }
};

export const logoutAdmin = async () => {
    try {
        const token = getStoredToken();
        const data = await request('/admin/logout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        localStorage.removeItem('token');

        return data;
    } catch (error) {
        console.error('Error pada api.js:', error);
        throw error;
    }
};

export const getPublicCategories = () => request('/public/kategori');

export const getPublicMenus = (kategoriId = '') => {
    const query = kategoriId ? `?kategori_id=${encodeURIComponent(kategoriId)}` : '';

    return request(`/public/menu${query}`);
};

export const createReservation = (payload) =>
    request('/public/reservasi', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

export const getPublicReviews = () => request('/public/review');

export const createReview = (payload) =>
    request('/public/review', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

export const getAdminReservations = () =>
    request('/admin/reservasi', {
        headers: {
            Authorization: `Bearer ${getStoredToken()}`,
        },
    });

export const updateAdminReservationStatus = (reservationId, statusReservasi, mejaId = null) =>
    request(`/admin/reservasi/${reservationId}/status`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${getStoredToken()}`,
        },
        body: JSON.stringify({
            status_reservasi: statusReservasi,
            ...(mejaId ? { meja_id: mejaId } : {}),
        }),
    });

const adminRequest = (path, options = {}) =>
    request(`/admin${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${getStoredToken()}`,
            ...options.headers,
        },
    });

export const getAdminDashboard = () => adminRequest('/dashboard');

export const getAdminMenus = () => adminRequest('/menu');

const isFormDataPayload = (payload) =>
    typeof FormData !== 'undefined' && payload instanceof FormData;

export const createAdminMenu = (payload) =>
    adminRequest('/menu', {
        method: 'POST',
        body: isFormDataPayload(payload) ? payload : JSON.stringify(payload),
    });

export const updateAdminMenu = (menuId, payload) => {
    if (isFormDataPayload(payload)) {
        payload.append('_method', 'PATCH');

        return adminRequest(`/menu/${menuId}`, {
            method: 'POST',
            body: payload,
        });
    }

    return adminRequest(`/menu/${menuId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};

export const deleteAdminMenu = (menuId) =>
    adminRequest(`/menu/${menuId}`, {
        method: 'DELETE',
    });

export const getAdminCategories = () => adminRequest('/kategori');

export const getAdminTables = () => adminRequest('/meja');

export const createAdminTable = (payload) =>
    adminRequest('/meja', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

export const updateAdminTable = (tableId, payload) =>
    adminRequest(`/meja/${tableId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });

export const deleteAdminTable = (tableId) =>
    adminRequest(`/meja/${tableId}`, {
        method: 'DELETE',
    });

export const generateAdminTableQr = (tableId) =>
    adminRequest(`/meja/${tableId}/qr`, {
        method: 'POST',
    });

export const getAdminOrders = () => adminRequest('/pesanan');

export const updateAdminOrderStatus = (orderId, statusPesanan) =>
    adminRequest(`/pesanan/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
            status_pesanan: statusPesanan,
        }),
    });

export const updateAdminOrderPayment = (orderId, statusPembayaran) =>
    adminRequest(`/pesanan/${orderId}/payment`, {
        method: 'PATCH',
        body: JSON.stringify({
            status_pembayaran: statusPembayaran,
        }),
    });

export const getAdminOrderReceipt = (orderId) =>
    adminRequest(`/pesanan/${orderId}/receipt`);

export const getAdminReviews = () => adminRequest('/review');

export const replyAdminReview = (reviewId, reply) =>
    adminRequest(`/review/${reviewId}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({
            balasan_admin: reply,
        }),
    });

export const getAdminReport = ({ period = 'day', date = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('period', period);

    if (date) {
        params.set('date', date);
    }

    return adminRequest(`/laporan?${params.toString()}`);
};

export const getQrMenuContext = (mejaId = '') => {
    const query = mejaId ? `?meja_id=${encodeURIComponent(mejaId)}` : '';

    return request(`/qr/menu${query}`);
};

export const checkoutQrOrder = (payload) =>
    request('/qr/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

