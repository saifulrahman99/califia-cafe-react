import axios from "axios";

// Buat instance Axios dengan baseURL API
const axiosInstance = axios.create({
    baseURL: "/api", // Ganti dengan URL API
    headers: {
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // console.log("Hitting API:", config.baseURL + config.url); // Log URL API yang di-hit
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
