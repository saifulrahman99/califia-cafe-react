import axiosInstance from "@/api/axiosInstance.js";

export default function DiscountService() {
    const getAll = async (query) => {
        const {data} = await axiosInstance.get('/discounts', {params: query});
        return data;
    }
    return {
        getAll,
    }
}