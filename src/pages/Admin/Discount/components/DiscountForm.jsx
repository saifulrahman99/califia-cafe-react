import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import {MyContext} from "@/context/MyContext.jsx";
import DiscountService from "@services/discountService.js";
import {Undo2} from "lucide-react";
import AdminLoading from "@shared/components/Loading/AdminLoading.jsx";
import dayjs from "dayjs";

const today = dayjs().startOf('day');

const schema = yup.object().shape({
    name: yup.string().required("Nama wajib di isi"),
    amount: yup
        .number()
        .typeError("Harus berupa angka")
        .positive("Angka harus positif")
        .required("Jumlah wajib di isi"),
    start_date: yup
        .date()
        .typeError("Tanggal mulai tidak valid")
        .min(today.toDate(), "Tanggal mulai tidak boleh kurang dari hari ini")
        .required("Tanggal mulai wajib di isi"),
    end_date: yup
        .date()
        .typeError("Tanggal selesai tidak valid")
        .min(
            yup.ref('start_date'),
            "Tanggal selesai harus setelah tanggal mulai"
        )
        .required("Tanggal selesai wajib di isi"),
    is_active: yup.boolean().required(),
});

const DiscountForm = () => {
    const {id} = useParams();
    const isEditMode = !!id;
    const {isLoading, setIsLoading, showToast} = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingFetchData, setIsLoadingFetchData] = useState(false);
    const navigate = useNavigate();
    const discountService = useMemo(DiscountService, []);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setIsOpen(true);

        const payload = {
            ...data,
            start_date: dayjs(data.start_date).format("YYYY-MM-DD HH:mm:ss"),
            end_date: dayjs(data.end_date).format("YYYY-MM-DD HH:mm:ss"),
            id: isEditMode ? id : null,
        };
        try {
            if (isEditMode) {
                await discountService.update(payload);
                showToast("success", "Berhasil mengupdate data");
            } else {
                await discountService.create(payload);
                showToast("success", "Berhasil menambahkan data");
            }
            navigate("../");
        } catch {
            showToast("error", "Gagal menyimpan data");
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isEditMode) return;
            setIsLoadingFetchData(true);
            try {
                const {data} = await discountService.getById(id);
                reset({
                    name: data.name,
                    amount: data.amount,
                    start_date: dayjs(data.start_date).format("YYYY-MM-DD HH:mm:ss"),
                    end_date: dayjs(data.end_date).format("YYYY-MM-DD HH:mm:ss"),
                    is_active: data.is_active,
                });
            } catch (e) {
                console.log(e)
                showToast("error", "Gagal mengambil data");
            } finally {
                setIsLoadingFetchData(false);
            }
        };
        fetchData();
    }, [id, isEditMode, reset, discountService]);

    return (
        <>
            <div className="px-4 py-2 font-semibold w-full bg-white rounded mb-4 border border-slate-200">
                <button
                    onClick={() => navigate("../")}
                    className="cursor-pointer flex menus-center gap-x-2">
                    <Undo2 size={20}/>
                    <span>kembali</span>
                </button>
            </div>

            <div className="p-6 bg-white rounded border border-slate-200 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Update" : "Tambah"} Diskon</h2>
                {isLoadingFetchData ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="col-span-2">
                            <label className="block font-semibold mb-2">Nama <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <input
                                type="text"
                                {...register("name")}
                                className="w-full p-2 border rounded border-slate-300 focus:outline-amber-500"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block font-semibold mb-2">Jumlah (Rp) <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <input
                                type="number"
                                {...register("amount")}
                                className="w-full p-2 border rounded border-slate-300 focus:outline-amber-500"
                            />
                            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                        </div>

                        {/* Active Toggle */}
                        <div>
                            <label className="block font-semibold mb-2">Status Aktif <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <Controller
                                control={control}
                                name="is_active"
                                render={({field}) => (
                                    <label
                                        className={`relative block h-6 w-12 rounded-full transition-colors cursor-pointer ${
                                            field.value ? "bg-amber-500" : "bg-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            {...field}
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <span
                                            className="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                                     </label>
                                )}
                            />
                        </div>

                        {/* Dates */}
                        <div>
                            <label className="block font-semibold mb-2">Mulai <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <input
                                type="datetime-local"
                                {...register("start_date")}
                                className="w-full p-2 border rounded border-slate-300 focus:outline-amber-500"
                            />
                            {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Berakhir <span
                                className={"text-red-500 text-xs"}>*</span></label>
                            <input
                                type="datetime-local"
                                {...register("end_date")}
                                className="w-full p-2 border rounded border-slate-300 focus:outline-amber-500"
                            />
                            {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="col-span-2 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded mt-4 cursor-pointer"
                        >
                            {isEditMode ? "Update" : "Simpan"}
                        </button>
                    </form>
                )}
            </div>
            <AdminLoading isOpen={isOpen} isLoading={isLoading}/>
        </>
    );
};

export default DiscountForm;
