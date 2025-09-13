import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useParams} from "react-router-dom";
import BillService from "@services/billService.js";
import {MyContext} from "@/context/MyContext.jsx";
import Lottie from "lottie-react";
import clockLoading from "@assets/lottie/loading.json";
import {Phone} from "lucide-react";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {capitalizeWords} from "@/utils/capitalWords.js";

const InvoiceDetail = () => {
    const {id} = useParams();
    const billService = useMemo(BillService, []);
    const [invoice, setInvoice] = useState({});
    const {isLoading, setIsLoading} = useContext(MyContext);

    const toNormalDate = (date) => {
        const dateSplit = date.split(" ")[0].split("-");
        return dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0];
    }
    const toNormalTime = (date) => {
        const dateSplit = date.split(" ")[1].split(":");
        return dateSplit[0] + ":" + dateSplit[1];
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "confirm":
                return "text-sky-300 border-sky-300";
            case "paid":
                return "text-green-300 border-green-300";
            case "canceled":
                return "text-red-200 border-red-200";
            default:
                return "text-slate-200 border-slate-200"
        }
    }
    useEffect(() => {
        setIsLoading(!isLoading);
        const getInvoice = async () => {
            return await billService.getById(id);
        }
        getInvoice().then((response) => {
            setInvoice(response.data);
            console.log(response.data);
            setIsLoading(false);
        });
    }, [billService])
    return (
        <>
            {
                isLoading ? <div
                        className="min-h-screen fixed inset-0 flex justify-center items-center flex-col max-w-md md:max-w-lg mx-auto">
                        <Lottie animationData={clockLoading} loop={true} className="mx-auto w-[50%] "/>
                        <span className="relative block -top-10 text-lg md:-top-14">Loading</span>
                    </div> :
                    <>

                        {Object.keys(invoice).length > 1 &&
                            <div className={"relative select-none min-h-[80vh]"}>
                                <div
                                    className="absolute inset-0 max-w-md md:max-w-lg mx-auto flex justify-center items-center text-7xl md:text-8xl opacity-30 font-bold">
                                    <span
                                        className={`rotate-320 ${getStatusColor(invoice.status)} border-6 p-4 rounded-full`}>{invoice.status.toUpperCase()}</span>
                                </div>

                                <div className="flex justify-between items-center mb-6 relative z-2">
                                    <header className="font-bold text-5xl tracking-wide">Invoice</header>
                                    <img src="/logo.png" alt="brand"
                                         className="w-20 aspect-square rounded-full border border-slate-300"/>
                                </div>
                                <div className="flex mb-6 relative z-2">
                                    <div className="w-1/2 text-wrap">
                                        <h2 className="mb-2">Kepada:</h2>
                                        <span
                                            className="font-semibold block mb-1">{invoice.customer_name.toUpperCase()}</span>
                                        <span className="block"> <Phone strokeWidth={1} size={16}
                                                                        className="inline-block mb-1"/> +{invoice.phone_number}</span>
                                    </div>

                                    <div className="w-1/2 ps-6 text-wrap">
                                        <h2 className="mb-2">Detail Invoice:</h2>
                                        <span className="block font-semibold">{invoice.invoice_no}</span>
                                        <p className="">tanggal: <span>{toNormalDate(invoice.trans_date)}</span></p>
                                        <p>Jam: {toNormalTime(invoice.trans_date)}</p>
                                    </div>
                                </div>

                                <div className="order-details">
                                    <table className="w-full">
                                        <thead className="border-2 border-x-0 border-slate-300">
                                        <tr>
                                            <th className={"text-start"}>Item</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>Qty</th>
                                            <th>Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
                                        {invoice.bill_details.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={index} className="text-center">
                                                        <td className="text-start py-1 pe-1">{capitalizeWords(item.menu.name)}</td>
                                                        <td>{formatRupiah(item.price)}</td>
                                                        <td>{formatRupiah(item.discount_price)}</td>
                                                        <td>{item.qty}</td>
                                                        <td>{formatRupiah(item.total_price)}</td>
                                                    </tr>
                                                    {item.bill_detail_toppings.length > 0 &&
                                                        <>
                                                            <tr>
                                                                <td colSpan={5}>Toppings:</td>
                                                            </tr>
                                                            {item.bill_detail_toppings.map((toppingItem, index) => {
                                                                return (
                                                                    <tr key={index} className="text-center">
                                                                        <td className="text-start py-1 pe-1">{capitalizeWords(toppingItem.topping.name)}</td>
                                                                        <td>{formatRupiah(toppingItem.price)}</td>
                                                                        <td>0</td>
                                                                        <td>{toppingItem.qty}</td>
                                                                        <td>{formatRupiah(toppingItem.price * toppingItem.qty)}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </>
                                                    }
                                                </>
                                            )
                                        })}
                                        <tr className="text-center border-2 font-bold border-x-0 border-b-0 border-t-slate-300">
                                            <td colSpan={4} className="text-end pe-4">Total</td>
                                            <td>{formatRupiah(invoice.final_price)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                    </>
            }
        </>
    );
};

export default InvoiceDetail;