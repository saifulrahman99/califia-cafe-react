import React, {useContext, useEffect, useMemo, useState} from 'react';
import BillService from "@services/billService.js";
import ConfirmationModalAdmin from "@shared/components/Modal/ConfirmationModalAdmin.jsx";
import {subscribeToChannel} from "@/pusher/pusher.js";
import {MyContext} from "@/context/MyContext.jsx";
import {useAuth} from "@/context/AuthContext.jsx";

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const billService = useMemo(() => BillService(), []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idOrder, setIdOrder] = useState(null);
    const [statusOrder, setStatusOrder] = useState(null);
    const [titleConfirmation, setTitleConfirmation] = useState(null);
    const {showToast} = useContext(MyContext);
    const {logout} = useAuth();

    const handleSetIdAndStatus = (data) => {
        setIsModalOpen(true);
        setIdOrder(data.id);
        setStatusOrder(data.status);
        setTitleConfirmation(data.title);
    };

    const handleChangeBillStatus = () => {
        const changeStatusOrder = async () => {
            try {
                await billService.updateStatus(idOrder, {status: statusOrder});
            } catch (e) {
                if (e.response.data.status === 401) {
                    showToast("error", "Sesi telah habis, silahkan login kembali", 1000);
                    setTimeout(() => {
                        logout();
                    }, 2000)
                } else {
                    showToast("error", "Gagal mengubah status pesanan", 1000);
                }
            }
        };
        changeStatusOrder().then(() => setIsModalOpen(false));
    };

    useEffect(() => {
        // 1. Fetch initial data
        const loadData = async () => {
            try {
                const response = await billService.getRecentOrders();
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to load orders:", error);
            }
        };

        loadData();

        // 2. Setup real-time subscriptions
        const newOrderUnsub = subscribeToChannel(
            'orders',
            'new-order',
            (newOrder) => {
                setOrders(prev => [newOrder, ...prev]);
            }
        );

        const statusUpdateUnsub = subscribeToChannel(
            'bills',
            'payment-status-updated',
            (updatedOrder) => {
                setOrders(prev => prev.map(order =>
                    order.id === updatedOrder.id ? updatedOrder : order
                ));
            }
        );

        // 3. Cleanup
        return () => {
            newOrderUnsub();
            statusUpdateUnsub();
        };
    }, [billService, orders]);

    return (
        <div>
            <h3 className={"mb-2 font-semibold"}>Pesanan Masuk</h3>
            {orders.length < 1 ? (
                <>
                    Belum ada pesanan
                </>
            ) : (
                <>
                    <div className="overflow-x-auto overflow-y-auto max-h-[25rem] max-w-[100vw] thin-scrollbar">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Customer</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Jenis
                                    Pesanan
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Meja</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order, index) => (
                                <tr key={order.invoice_no} className={"odd:bg-white even:bg-gray-50"}>
                                    <td className={"px-4 py-2 whitespace-nowrap text-sm text-gray-700 font-semibold"}>{++index}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.invoice_no}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.customer_name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                        {order.order_type === "DI" ? "Makan di tempat" : "Dibawa pulang"}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                        {order.order_type === "DI" ? order.table : "-"}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs select-none">
                                    <span
                                        className={`${order.status !== "pending" ? "bg-green-600" : "bg-slate-500"} text-white px-2 pb-1 pt-0.5 rounded-full font-semibold`}>
                                        {order.status}
                                    </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap space-x-4 text-sm">
                                        <button
                                            className="cursor-pointer px-2 py-1 bg-slate-600 text-white rounded hover:bg-slate-500">
                                            Detail
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleSetIdAndStatus({
                                                    id: order.id,
                                                    status: "canceled",
                                                    title: "Tolak Pesanan"
                                                });
                                            }}
                                            className="cursor-pointer px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500">
                                            Batalkan
                                        </button>
                                        {order.status === "pending" ? (
                                            <button
                                                onClick={() => {
                                                    handleSetIdAndStatus({
                                                        id: order.id,
                                                        status: "confirm",
                                                        title: "Setujui Pesanan"
                                                    });
                                                }}
                                                className="cursor-pointer px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-500"
                                            >
                                                Konfirmasi
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    handleSetIdAndStatus({
                                                        id: order.id,
                                                        status: "paid",
                                                    });
                                                }}
                                                className="cursor-pointer px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-500"
                                            >
                                                Bayar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <ConfirmationModalAdmin
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleChangeBillStatus}
                title={titleConfirmation}
                message="Apakah Anda yakin?"
            />
        </div>
    );
};

export default RecentOrders;