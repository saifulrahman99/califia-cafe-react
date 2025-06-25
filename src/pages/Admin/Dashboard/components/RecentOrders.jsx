import React, {useContext, useEffect, useMemo, useState} from 'react';
import BillService from "@services/billService.js";
import ConfirmationModalAdmin from "@shared/components/Modal/ConfirmationModalAdmin.jsx";
import {subscribeToChannel} from "@/pusher/pusher.js";
import {MyContext} from "@/context/MyContext.jsx";
import {useAuth} from "@/context/AuthContext.jsx";
import AdminLoading from "@shared/components/Loading/AdminLoading.jsx";
import Modal from "@shared/components/Modal/Modal.jsx";
import {formatDate} from "@/utils/formatDate.js";
import {formatHour} from "@/utils/formatHour.js";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {Link} from "react-router-dom";

const RecentOrders = ({refresh, setRefresh}) => {
    const [orders, setOrders] = useState([]);
    const billService = useMemo(() => BillService(), []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idOrder, setIdOrder] = useState(null);
    const [statusOrder, setStatusOrder] = useState(null);
    const [titleConfirmation, setTitleConfirmation] = useState(null);
    const {showToast, isProcessDataOpen, setIsProcessDataOpen} = useContext(MyContext);
    const {logout} = useAuth();
    const [selectedBill, setSelectedBill] = useState(null);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);

    const handleSetIdAndStatus = (data) => {
        setIsModalOpen(true);
        setIdOrder(data.id);
        setStatusOrder(data.status);
        setTitleConfirmation(data.title);
    };

    const handleChangeBillStatus = () => {
        const changeStatusOrder = async () => {
            setIsProcessDataOpen(!isProcessDataOpen);
            try {
                return await billService.updateStatus(idOrder, {status: statusOrder});
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
        changeStatusOrder().then((data) => {
            if (data.data.status === "paid") {
                setRefresh(!refresh);
            }
            setIsModalOpen(false)
            setIsProcessDataOpen(false)
        });
    };

    const openInvoicePreview = (bill) => {
        setSelectedBill(bill);
        setIsModalDetailOpen(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirm":
                return "bg-blue-100 text-blue-800";
            case "paid":
                return "bg-green-100 text-green-800";
            case "canceled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
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
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No.
                                    Telp
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
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"><Link
                                        to={`https://wa.me/${order.phone_number}`} target="_blank"
                                        className="hover:underline">{order.phone_number}</Link></td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                        {order.order_type === "DI" ? order.table : "-"}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs select-none">
                                   <span
                                       className={`capitalize px-2 pb-0.5 rounded-full text-sm font-semibold ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap space-x-4 text-sm text-nowrap">
                                        <button
                                            onClick={() => openInvoicePreview(order)}
                                            className="text-slate-500 items-center cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-slate-500 hover:text-white">
                                            Detail
                                        </button>
                                        {order.status === "pending" &&
                                            <button
                                                onClick={() => {
                                                    handleSetIdAndStatus({
                                                        id: order.id,
                                                        status: "canceled",
                                                        title: "Tolak Pesanan"
                                                    });
                                                }}
                                                className="text-red-500 items-center cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white">
                                                Batalkan
                                            </button>
                                        }
                                        {order.status === "pending" ? (
                                            <button
                                                onClick={() => {
                                                    handleSetIdAndStatus({
                                                        id: order.id,
                                                        status: "confirm",
                                                        title: "Setujui Pesanan"
                                                    });
                                                }}
                                                className="text-blue-500 items-center cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white"
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
                                                className="text-blue-500 items-center cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white"
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

            {/* Modal Invoice Preview */}
            {isModalDetailOpen && selectedBill && (
                <Modal isOpen={isModalDetailOpen} onClose={() => setIsModalDetailOpen(false)}
                       title={`Invoice ${selectedBill.invoice_no}`}>
                    <div className="space-y-2">
                        <div><span className="font-semibold">Customer:</span> {selectedBill.customer_name}</div>
                        <div><span
                            className="font-semibold">Order:</span> {selectedBill.order_type === "DI" ? "Dine-in" : "Take Away"}
                        </div>
                        {selectedBill.order_type === "DI" &&
                            <div><span className="font-semibold">Meja:</span> {selectedBill.table}</div>}
                        <div>
                            <span
                                className="font-semibold">Tanggal:</span> {formatDate(selectedBill.trans_date)}, {formatHour(selectedBill.trans_date)}
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <span className="font-semibold">Pesanan:</span>
                            <ul className="list-disc list-inside">
                                {selectedBill.bill_details.map((item, idx) => (
                                    <li key={idx} className="mb-1">
                                        <span
                                            className="font-semibold">{capitalizeWords(item.menu.name)}</span> x{item.qty}
                                        <span
                                            className="float-end">{formatRupiah(item.total_price)}</span>
                                        {item.bill_detail_toppings.length > 0 && (
                                            <ul className="ml-4 list-['+'] list-inside">
                                                {item.bill_detail_toppings.map((top, i) => (
                                                    <li key={i}
                                                        className="mb-1"><span
                                                        className="font-semibold"> {capitalizeWords(top.topping.name)}</span> x{top.qty}
                                                        <span
                                                            className="float-end">{formatRupiah(top.price)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t pt-2 font-bold text-right">
                            Total: {formatRupiah(selectedBill.final_price)}
                        </div>
                    </div>
                </Modal>
            )}

            <ConfirmationModalAdmin
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleChangeBillStatus}
                title={titleConfirmation}
                message="Apakah Anda yakin?"
            />
            <AdminLoading isOpen={isProcessDataOpen} isLoading={true}/>
        </div>
    );
};

export default RecentOrders;