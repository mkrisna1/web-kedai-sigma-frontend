// api.js

const BASE_URL = 'http://127.0.0.1:8000/api';

export const loginAdmin = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                // Memberitahu backend bahwa kita mengirim dan menerima JSON
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({ 
                username: username, 
                password: password 
            })
        });

        const data = await response.json();

        // Jika status HTTP bukan 200 OK (misal: 401 Unauthorized karena password salah)
        if (!response.ok) {
            throw new Error(data.message || 'Login gagal, periksa kembali username dan password.');
        }

        return data; 
    } catch (error) {
        console.error("Error pada api.js:", error);
        throw error; 
    }
};