import axiosInstance from "@/api/axiosInstance.js";

const AuthService = () => {
    const login = async (payload) => {
        const {data} = await axiosInstance.post("/auth/login", payload);
        const token = data.data.token;
        localStorage.setItem("token", token);
        return data.data;
    }
    return {
        login,
    }
}
export default AuthService;