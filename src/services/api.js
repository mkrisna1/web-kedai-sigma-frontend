// api.js

const BASE_URL = 'http://127.0.0.1:8000/api';

export const loginAdmin = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login gagal');
        }

        // Simpan token ke localStorage
        localStorage.setItem('token', data.data.token);

        return data; 
    } catch (error) {
        console.error("Error pada api.js:", error);
        throw error; 
    }
};

export const logoutAdmin = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/admin/logout`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Logout gagal');
        }

        // Hapus token dari localStorage
        localStorage.removeItem('token');

        return data;
    } catch (error) {
        console.error("Error pada api.js:", error);
        throw error;
    }
};