import axiosInstance from '@/api/axiosInstance';

function CategoryService() {
    const getAll = async (query) => {
        const {data} = await axiosInstance.get('/categories', {params: query});
        return data;
    }
    const deleteById = async (id) => {
        const {data} = await axiosInstance.delete(`/categories/${id}`);
        return data;
    }
    const update = async (payload) => {
        const {data} = await axiosInstance.put(`/categories`, payload);
        return data;
    }
    const create = async (payload) => {
        const {data} = await axiosInstance.post(`/categories`, payload);
        return data;
    }
    return {
        getAll,
        deleteById,
        update,
        create,
    }
}

export default CategoryService;