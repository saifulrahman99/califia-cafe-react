import axiosInstance from "@/api/axiosInstance.js";

export default function DiscountService() {
    const getAll = async (query) => {
        const {data} = await axiosInstance.get('/discounts', {params: query});
        return data;
    }
    const deleteById = async (id) => {
        const {data} = await axiosInstance.delete(`/discounts/${id}`);
        return data;
    }
    const getById = async (id) => {
        const {data} = await axiosInstance.get(`/discounts/${id}`);
        return data;
    }

    const updateStatus = async (id) => {
        const {data} = await axiosInstance.patch(`/discounts/${id}`);
        return data;
    }
    const update = async (payload) => {
        const {data} = await axiosInstance.put(`/discounts`, payload);
        return data;
    }
    const create = async (payload) => {
        const {data} = await axiosInstance.post(`/discounts`, payload);
        return data;
    }
    return {
        getAll,
        deleteById,
        update,
        create,
        updateStatus,
        getById
    }
}