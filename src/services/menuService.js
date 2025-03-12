import axiosInstance from '@/api/axiosInstance';

function MenuService() {
    const getAll = async (query) => {
        const {data} = await axiosInstance.get("/menus", {params: query});
        return data;
    }

    const create = async (payload) => {
        const {data} = await axiosInstance.post('/menus', payload);
        return data;
    }

    const getById = async (id) => {
        const {data} = await axiosInstance.get(`/menus/${id}`);
        return data;
    }

    const update = async (payload) => {
        const {data} = await axiosInstance.put('/menus', payload);
        return data;
    }

    const deleteById = async (id) => {
        const {data} = await axiosInstance.delete(`/menus/${id}`);
        return data;
    }
    const getRecommendable = async () => {
        const {data} = await axiosInstance.get(`/menus/recommended`);
        return data;
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
