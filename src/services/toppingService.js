import axiosInstance from '@/api/axiosInstance';

function ToppingService() {
    const getAll = async (query) => {
        const {data} = await axiosInstance.get("/toppings", {params: query});
        return data;
    }

    const create = async (payload) => {
        const {data} = await axiosInstance.post('/toppings', payload);
        return data;
    }

    const getById = async (id) => {
        const {data} = await axiosInstance.get(`/toppings/${id}`);
        return data;
    }

    const update = async (payload) => {
        const {data} = await axiosInstance.put('/toppings', payload);
        return data;
    }

    const deleteById = async (id) => {
        const {data} = await axiosInstance.delete(`/toppings/${id}`);
        return data;
    }

    return {
        getAll,
        create,
        getById,
        update,
        deleteById,
    }
}

export default ToppingService;