import axiosInstance from '@/api/axiosInstance';

function CategoryService() {
    const getAll = async (query) => {
        const {data} = await axiosInstance.get('/categories', {params: query});
        return data;
    }
    return {
        getAll,
    }
}

export default CategoryService;