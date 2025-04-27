import React, {useEffect, useMemo, useState} from 'react';
import RecentOrders from "@pages/Admin/Dashboard/components/RecentOrders.jsx";
import BillService from "@services/billService.js";
import {formatRupiah} from "@/utils/formatCurrency.js";
import LowStock from "@pages/Admin/Dashboard/components/LowStock.jsx";
import SalesOverview from "@pages/Admin/Dashboard/components/SalesOverview.jsx";

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const billService = useMemo(() => BillService(), []);
    const getTotalOrders = (data) => data.length;

    const getProductSold = (data) => {
        let total = 0;
        data.forEach(order => {
            order.bill_details.forEach(detail => {
                total += detail.qty;
            });
        });
        return total;
    };

    const getRevenue = (data) => {
        return data.reduce((sum, order) => sum + order.final_price, 0);
    };

    const getAverageOrderValue = (data) => {
        const revenue = getRevenue(data);
        const orders = getTotalOrders(data);
        return orders > 0 ? revenue / orders : 0;
    };

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await billService.getAll({status: "paid", paging: 0});
                setOrders(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getOrders();
    }, [billService]);
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                <div className="p-4 bg-white border border-slate-200 rounded">
                    <span className={"font-semibold"}>Pesanan Selesai</span>
                    <p className={"font-semibold text-xl"}>{getTotalOrders(orders)}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded">
                    <span className={"font-semibold"}>Produk Terjual</span>
                    <p className={"font-semibold text-xl"}>{getProductSold(orders)}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded">
                    <span className={"font-semibold"}>Keuntungan</span>
                    <p className={"font-semibold text-xl"}>{formatRupiah(getRevenue(orders))}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded">
                    <span className={"font-semibold"}>Rata-Rata Nilai Pesanan</span>
                    <p className={"font-semibold text-xl"}>{formatRupiah(getAverageOrderValue(orders))}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-2 gap-y-2 my-4">
                <div className="border border-slate-200 col-span-2 p-4 bg-white rounded">
                    <RecentOrders/>
                </div>
                <div className="border border-slate-200 col-span-1 p-4 bg-white rounded w-full">
                    <LowStock/>
                </div>
            </div>

            <div className="border border-slate-200 p-4 bg-white rounded">
                <SalesOverview/>
            </div>

        </>
    );
};

export default Dashboard;