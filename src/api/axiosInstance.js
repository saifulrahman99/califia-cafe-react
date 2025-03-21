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
            const {token} = JSON.parse(token);
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default axiosInstance;
