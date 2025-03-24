import React, {useContext, useEffect, useMemo, useState} from 'react';
import {MyContext} from "@/MyContext.jsx";
import BillService from "@services/billService.js";
import {subscribeToChannel} from "@/pusher/pusher.js";
import clockLoading from "@assets/lottie/loading.json"
import success from "@assets/lottie/success.json"
import failed from "@assets/lottie/failed.json"
import Lottie from "lottie-react";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {Link} from "react-router-dom";

const BillStatus = () => {
    const billId = sessionStorage.getItem("bill_id");
    const {setCart} = useContext(MyContext);
    const [bill, setBill] = useState(null);
    const billService = useMemo(() => BillService(), []);

    const handleToSetEmptyCart = () => {
        setCart([]);
    }
    useEffect(() => {
        const getBill = async () => {
            return await billService.getById(billId);
        }
        getBill().then(response => {
            setBill(response.data);
        })

        // Subscribe ke Pusher untuk update real-time
        const unsubscribe = subscribeToChannel("bills", "payment-status-updated", (data) => {
            if (data.bill.id === billId) {
                setBill(data.bill);
            }
        });
        return () => {
            unsubscribe(); // Unsubscribe saat komponen unmount
        };
    }, [billId])
    return (
        <>
            <div
                className="fixed inset-0 m-auto max-w-md md:max-w-lg z-4 min-h-screen bg-white border border-y-0 border-x-slate-200 flex justify-center items-center flex-col">

                {bill ? (
                    <>
                        <div className="w-[90%] aspect-square text-slate-700 text-center text-wrap">
                            {bill.status === "pending" && (
                                <>
                                    <Lottie animationData={clockLoading} loop={true} className="w-[50%] m-auto"/>
                                    <h1 className="font-bold text-xl mb-4">Menunggu Pesanan Dikonfirmasi</h1>
                                </>
                            )}
                            {bill.status === "canceled" && (
                                <>
                                    <Lottie animationData={failed} loop={false} className="w-[50%] m-auto"/>
                                    <h1 className="font-bold text-xl mb-4">Pesanan Dibatalkan</h1>
                                    <p>Maaf pesanan anda tidak disetujui, silahkan coba memesan Kembali.</p>
                                </>
                            )}
                            {bill.status === "confirm" && (
                                <>
                                    <Lottie animationData={success} loop={false} className="w-[50%] m-auto"/>
                                    <h1 className="font-bold text-xl mb-4">Pesanan Dikonfirmasi</h1>
                                    <p>Pesanan sudah dikonfirmasi, sialahkan menunggu pesanan anda.</p>
                                </>
                            )}
                        </div>

                        <div
                            className="description relative -top-14 bg-white shadow rounded-3xl border border-slate-100 w-[90%] p-4 px-6">
                            <h2 className="font-bold mb-2">{bill.invoice_no}</h2>
                            <div className="flex justify-between mb-2">
                                <span className="block">Nama</span>
                                <span className="block font-semibold">{bill.customer_name}</span>
                            </div>
                            {bill.table !== null && (
                                <div className="flex justify-between mb-2">
                                    <span className="block">Meja</span>
                                    <span className="block font-semibold">{bill.table}</span>
                                </div>
                            )}

                            <div className="flex justify-between mb-2">
                                <span className="block">Total</span>
                                <span className="block font-semibold">{formatRupiah(bill.final_price)}</span>
                            </div>
                        </div>
                        {bill.status === "confirm" &&
                            <div className="w-full mx-auto max-w-md md:max-w-lg text-center">
                                <button
                                    onClick={handleToSetEmptyCart}
                                    className="btn-primary bg-primary p-2 rounded-lg w-[80%] font-semibold text-white text-lg cursor-pointer">Kembali
                                </button>
                            </div>
                        }
                        {
                            bill.status === "canceled" &&
                            <div className="w-full mx-auto max-w-md md:max-w-lg text-center">
                                <Link to={"/"}>
                                    <button
                                        className="btn-primary bg-primary p-2 rounded-lg w-[80%] font-semibold text-white text-lg cursor-pointer">Kembali
                                    </button>
                                </Link>
                            </div>
                        }
                    </>
                ) : (
                    <Lottie animationData={clockLoading} loop={true} className="w-[50%] m-auto"/>
                )}
            </div>
        </>
    );
};

export default BillStatus;
