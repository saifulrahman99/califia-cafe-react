import axiosInstance from '@/api/axiosInstance';

function BillService() {
    const create = async (payload) => {
        const {data} = await axiosInstance.post('/bills', payload);
        return data;
    }
    const getAll = async (query) => {
        const {data} = await axiosInstance.get('/bills', {params: query});
        return data;
    }
    const getById = async (id) => {
        const {data} = await axiosInstance.get(`/bills/${id}`);
        return data;
    }
    const updateStatus = async (id, payload) => {
        const {data} = await axiosInstance.patch(`/bills/${id}`, payload);
        return data;
    }
    const deleteById = async (id) => {
        const {data} = await axiosInstance.delete(`/bills/${id}`);
        return data;
    }
    const getByIDs = async (payload) => {
        const {data} = await axiosInstance.post('/bills/invoices', payload);
        return data;
    }
    const getRecentOrders = async () => {
        const {data} = await axiosInstance.get('/bills/recent')
        return data;
    }
    return {
        create,
        getById,
        getAll,
        deleteById,
        updateStatus,
        getByIDs,
        getRecentOrders
    }
}

export default BillService;