import axiosInstance from "@/api/axiosInstance.js";

const AuthService = () => {
    const login = async (payload) => {
        const {data} = await axiosInstance.post("/auth/login", payload);
        return data;
    }
    return {
        login,
    }
}
export default AuthService;