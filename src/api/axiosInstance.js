import axios from "axios";

// Buat instance Axios dengan baseURL API
const axiosInstance = axios.create({
    baseURL: "/api", // Ganti dengan URL API
    headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token mungkin telah kedaluwarsa, lakukan sesuatu, misalnya logout
            console.log('Token expired or invalid');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
