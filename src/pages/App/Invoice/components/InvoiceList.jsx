import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Check, ChevronRight, Timer, Undo2, X} from "lucide-react";
import BillService from "@services/billService.js";
import {MyContext} from "@/context/MyContext.jsx";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {Link} from "react-router-dom";
import InvoiceDetailSkeleton from "@pages/App/Invoice/components/InvoiceDetailSkeleton.jsx";

const InvoiceList = () => {
    const billService = useMemo(() => BillService(), [])
    const {isLoading, setIsLoading} = useContext(MyContext);
    const [groupedInvoices, setGroupedInvoices] = useState([]);

    const groupByDate = (data) => {
        return data.reduce((acc, transaction) => {
            const date = transaction.trans_date.split(" ")[0]; // Ambil YYYY-MM-DD saja
            if (!acc[date]) acc[date] = [];
            acc[date].push(transaction);
            return acc;
        }, {});
    };

    const getTimeFromDate = (date) => {
        const time = date.split(" ")[1];
        const ourAndMinutes = time.split(":");
        return `${ourAndMinutes[0]}:${ourAndMinutes[1]}`;
    }

    const getSymbolStatusInvoice = (status) => {
        switch (status) {
            case "confirm":
                return (<><Check className="bg-green-300 text-white p-1 rounded-full me-1"/></>);
            case "paid":
                return (<><Check className="bg-green-300 text-white p-1 rounded-full me-1"/></>);
            case "canceled":
                return (<><X className="bg-red-300 text-white p-1 rounded-full me-1"/></>);
            default:
                (<><Timer className="bg-slate-300 text-slate-700 p-1 rounded-full me-1"></Timer></>);
        }
    }

    useEffect(() => {
        setIsLoading(!isLoading);
        const storedInvoice = localStorage.getItem("invoice");
        const getInvoice = async () => {
            try {
                if (storedInvoice !== null) {
                    const parsedInvoice = JSON.parse(storedInvoice);
                    const response = await billService.getByIDs({ids: parsedInvoice});
                    setGroupedInvoices(groupByDate(response.data.data))
                }
            } catch (err) {
                console.log("Error details:", err.response?.data);
            }
            setIsLoading(false);
        }
        getInvoice();
    }, [billService])
    return (
        <>
            {
                isLoading ?
                    <>
                        <InvoiceDetailSkeleton/>
                    </>
                    :
                    <>
                        <div className="my-3">
                            <div className="flex items-center">
                                <span className="h-px flex-1 bg-slate-700"></span>
                                <span className="shrink-0 px-6  text-xl font-bold">Riwayat Pesanan</span>
                                <span className="h-px flex-1 bg-slate-700"></span>
                            </div>
                        </div>
                        {Object.keys(groupedInvoices).length < 1 ? <div
                                className="absolute inset-0 flex justify-center items-center font-semibold">Belum Ada Transaksi</div> :
                            <>
                                {Object.keys(groupedInvoices).map((date) => (
                                    <div key={date}>
                                        <span className="font-bold mb-2 block">{date}</span>
                                        {groupedInvoices[date].map((invoice) => (
                                            <section key={invoice.id}
                                                     className={`p-3 pb-1 rounded-lg shadow border border-slate-100 mb-4`}>
                                                <div className="relative">
                                                    <header
                                                        className="font-bold">{invoice.invoice_no}
                                                    </header>
                                                    <p className="mb-2 font-semibold text-sm text-primary">{invoice.table !== null ? "Makan di Tempat" : "Dibawa Pulang"}</p>
                                                    <p>{invoice.customer_name}</p>
                                                    <p>Total : <span
                                                        className="font-semibold">{formatRupiah(invoice.final_price)}</span>
                                                    </p>
                                                    <span
                                                        className="block absolute top-0 right-0 text-sm text-slate-500">{getTimeFromDate(invoice.trans_date)}</span>
                                                    <span
                                                        className="absolute bottom-0 right-0 flex items-center justify-center font-semibold">
                                                    {getSymbolStatusInvoice(invoice.status)}
                                                        {capitalizeWords(invoice.status)}
                                                </span>
                                                </div>
                                                <hr className="my-2 border-slate-200"/>
                                                <Link to={`detail/${invoice.id}`}>
                                                    <button
                                                        className="m-auto p-2 font-medium cursor-pointer text-xs flex justify-between items-center">
                                                        <span className="block mb-1">details</span> <ChevronRight
                                                        size={16}/></button>
                                                </Link>
                                            </section>
                                        ))}
                                    </div>
                                ))}
                            </>
                        }
                    </>
            }
        </>
    );
};

export default InvoiceList;