import axiosInstance from '@/api/axiosInstance';

function MenuService() {
    const getAll = async (query) => {
        const {data} = await axiosInstance.get("/menus", {params: query});
        return data.data;
    }

    const create = async (payload) => {
        const {data} = await axiosInstance.post('/menus', payload);
        return data.data;
    }

    const getById = async (id) => {
        const {data} = await axiosInstance.get(`/menus/${id}`);
        return data.data;
    }

    const update = async (payload) => {
        const {data} = await axiosInstance.put('/menus', payload);
        return data.data;
    }

    const deleteById = async (id) => {
        const {data} = await axiosInstance.delete(`/menus/${id}`);
        return data.data;
    }
    const getRecommendable = async () => {
        const {data} = await axiosInstance.get(`/menus/recommended`);
        return data.data;
    }

    return {
        create,
        getById,
        update,
        deleteById,
        getAll,
        getRecommendable,
    }
}

export default MenuService;
