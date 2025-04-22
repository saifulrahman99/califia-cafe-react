import React, {useContext, useEffect, useMemo, useState} from 'react';
import {MyContext} from "@/context/MyContext.jsx";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {calculateOrderTotalPrice} from "@/utils/calculateOrderTotalPrice.js";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import BillService from "@services/billService.js";
import {Link, useNavigate} from "react-router-dom";
import {capitalizeWords} from "@/utils/capitalWords.js";
import animationLoading from "@assets/lottie/loading.json";
import Lottie from "lottie-react";

// Schema Validasi Yup
const schema = yup.object().shape({
    name: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Nama hanya boleh berisi huruf")
        .min(3, "Nama minimal 3 karakter")
        .required("Nama wajib diisi"),

    phone: yup
        .string()
        .matches(/^(?:\+62|62|0)8[1-9][0-9]{8,10}$/, "Nomor WhatsApp tidak valid")
        .required("Nomor WhatsApp wajib diisi"),
});

const CreateBill = () => {
    const billService = useMemo(() => BillService(), []);
    const navigate = useNavigate();
    const {
        cart,
        showToast,
        isLoading,
        setIsLoading,
    } = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: {errors, isValid},
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur", // Error hanya muncul setelah blur
    });
    // State untuk melacak apakah input sudah pernah disentuh
    const [touched, setTouched] = useState({
        name: false,
        phone: false,
    });
    // Watch input perubahan
    const nameValue = watch("name");
    const phoneValue = watch("phone");

    // Validasi ulang setiap kali user mengetik
    useEffect(() => {
        if (touched.name) trigger("name");
    }, [nameValue, touched.name, trigger]);

    useEffect(() => {
        if (touched.phone) trigger("phone");
    }, [phoneValue, touched.phone, trigger]);

    // Ambil invoice dari localStorage
    const getInvoice = () => {
        const data = localStorage.getItem("invoice");
        return data ? JSON.parse(data) : []; // Jika tidak ada, kembalikan array kosong
    };

// Tambahkan ID Bill baru ke invoice tanpa menghapus yang lama
    const addBillToInvoice = (billId) => {
        const invoice = getInvoice(); // Ambil data invoice yang sudah ada
        invoice.push(billId); // Tambahkan ID Bill baru
        localStorage.setItem("invoice", JSON.stringify(invoice)); // Simpan kembali ke localStorage
    };

    const onSubmit = (data) => {
        setIsOpen(!isOpen);
        const bill = {
            "customer_name": capitalizeWords(data.name),
            "phone_number": data.phone,
            "table": sessionStorage.getItem("orderType") === "DI" && sessionStorage.getItem("tableNumber") !== null ? "Meja " + sessionStorage.getItem("tableNumber") : null,
            "bill_details": cart.map((item) => {
                return {
                    menu_id: item.menuId,
                    qty: item.qty,
                    note: item.note,
                    bill_detail_toppings: (item.toppings.length > 0) ? item.toppings.map((topping) => {
                        return {
                            topping_id: topping.id,
                            qty: topping.qty
                        }
                    }) : null
                }
            })
        }
        const createBill = async () => {
            setIsLoading(!isLoading);
            try {
                const data = await billService.create(bill);
                addBillToInvoice(data.data.id);
                if (data.status === 201) {
                    sessionStorage.setItem("bill_id", data.data.id);
                    setIsLoading(false);
                    showToast("success", "Pesanan Berhasil Dibuat", 1000);
                    setTimeout(() => navigate("../bill-status"), 1800);
                }
            } catch (err) {
                console.log(err)
            }
        }
        createBill()
    };

    return (
        <>
            <div
                className={`bg-black/30 fixed inset-0 flex justify-center items-center z-0 w-full max-w-md md:max-w-lg m-auto transition-opacity duration-300 ${isOpen ? 'opacity-100 z-4' : 'opacity-0'}`}>
                <div
                    className={`w-40 bg-white rounded-xl transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
                    <Lottie
                        animationData={animationLoading}
                        loop={true}
                    />
                    <span className="font-semibold block relative -top-10 text-center text-slate-700">Loading</span>
                </div>
            </div>

            <div className="pt-15 pb-30 text-slate-700 px-4 select-none">
                <div className="my-4">
                   <span className="flex items-center">
                       <span className="h-px flex-1 bg-slate-700"></span>
                       <span className="shrink-0 px-6  text-xl font-bold">Informasi Pemesanan</span>
                       <span className="h-px flex-1 bg-slate-700"></span>
                    </span>
                </div>
                <span
                    className="block m-auto max-w-50 text-center py-1 bg-sky-50 border border-sky-200 text-sky-500 rounded-lg text-xs font-semibold">
                    {sessionStorage.getItem("orderType") === "DI" && sessionStorage.getItem("tableNumber") !== null ? "Makan di Tempat" : "Dibawa Pulang"}
                </span>

                <div className="form mt-6">
                    <form onSubmit={handleSubmit(onSubmit)}
                          className="space-y-2 w-full"
                          autoComplete="off"
                    >
                        <div className="mb-4">
                            <label htmlFor="Name" className="relative">
                                <input
                                    {...register("name")}
                                    type="text"
                                    id="Name"
                                    placeholder=""
                                    className="peer w-full p-3 rounded border border-gray-300 sm:text-sm focus:outline-none active:bg-white"
                                    autoComplete="off"
                                    onBlur={() => setTouched((prev) => ({
                                        ...prev,
                                        name: true
                                    }))} // Set sebagai "touched" saat blur
                                />

                                <span
                                    className="absolute inset-y-0 start-3 -translate-y-5.5 bg-white px-0.5 font-medium text-slate-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5.5"
                                >Nama</span>
                            </label>
                            <span
                                className={`h-5 mt-1 block transition-opacity duration-300 ${(touched.name && errors.name) ? "opacity-100" : "opacity-0"}`}>
                            {touched.name && errors.name &&
                                <p className="text-red-400 text-xs ms-2">{errors.name.message}</p>}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="Phone" className="relative">
                                <input
                                    {...register("phone")}
                                    type="text"
                                    id="Phone"
                                    className="peer w-full p-3 rounded border border-gray-300 sm:text-sm focus:outline-none active:bg-white"
                                    autoComplete="off"
                                    placeholder=""
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onBeforeInput={(e) => {
                                        if (!/^\d+$/.test(e.data)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onBlur={() => setTouched((prev) => ({
                                        ...prev,
                                        phone: true
                                    }))} // Set sebagai "touched" saat blur
                                />

                                <span
                                    className="absolute inset-y-0 start-3 -translate-y-5.5 bg-white px-0.5  font-medium text-slate-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5.5"
                                >Nomor Whatsapp</span>
                            </label>
                            <span
                                className={`h-5 mt-1 block transition-opacity duration-300 ${(touched.phone && errors.phone) ? "opacity-100" : "opacity-0"}`}>
                            {touched.phone && errors.phone &&
                                <p className="text-red-400 text-xs ms-2">{errors.phone.message}</p>}
                            </span>
                        </div>
                        {
                            cart.length > 0 && (
                                <div className="w-full fixed -bottom-3.5 py-3 left-0 text-slate-700">
                                    <div
                                        className="m-auto w-full max-w-md md:max-w-lg bg-white p-4 pb-3 border border-b-0 border-slate-200 rounded-t-2xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.15)] flex justify-between items-center">
                                        <div>
                                            <span className="block text-lg font-semibold -mb-1">Total</span>
                                            <span
                                                className="text-2xl font-bold">{formatRupiah(calculateOrderTotalPrice(cart))}</span>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={!isValid}
                                                className={`${isValid ? "btn-primary bg-primary text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}  py-2 px-6 text-lg font-semibold rounded-lg shadow`}
                                            >Buat Pesanan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateBill;