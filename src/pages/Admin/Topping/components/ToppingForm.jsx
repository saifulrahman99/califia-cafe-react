import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import {MyContext} from "@/context/MyContext.jsx";
import ToppingService from "@services/toppingService.js";
import {Undo2} from "lucide-react";
import AdminLoading from "@shared/components/Loading/AdminLoading.jsx";

const schema = yup.object().shape({
    name: yup.string().required("Nama topping wajib diisi"),
    type: yup.string().required("Tipe wajib dipilih"),
    price: yup.number().typeError("Harus berupa angka").positive("Harga harus lebih dari 0").required("Harga wajib diisi"),
    stock: yup.number().typeError("Harus berupa angka").min(0, "Stok tidak boleh negatif").required("Stok wajib diisi"),
});

const ToppingForm = () => {
    const {id} = useParams();
    const isEditMode = !!id;
    const {isLoading, setIsLoading, showToast} = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingFetchData, setIsLoadingFetchData] = useState(false);
    const navigate = useNavigate();
    const toppingService = useMemo(ToppingService, []);

    const {
        register,
        handleSubmit,
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
            id: isEditMode ? id : null,
        };

        try {
            if (isEditMode) {
                await toppingService.update(payload);
                showToast("success", "Berhasil mengupdate topping");
            } else {
                await toppingService.create(payload);
                showToast("success", "Berhasil menambahkan topping");
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
                const {data} = await toppingService.getById(id);
                reset({
                    name: data.name,
                    type: data.type,
                    price: data.price,
                    stock: data.stock,
                });
            } catch {
                showToast("error", "Gagal mengambil data topping");
            } finally {
                setIsLoadingFetchData(false);
            }
        };
        fetchData();
    }, [id, isEditMode, reset, toppingService]);

    return (
        <>
            <div className="px-4 py-2 font-semibold w-full bg-white rounded mb-4 border border-slate-200">
                <button
                    onClick={() => navigate("../")}
                    className="cursor-pointer flex items-center gap-x-2">
                    <Undo2 size={20}/> <span>Kembali</span>
                </button>
            </div>

            <div className="p-6 bg-white rounded border border-slate-200 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Update" : "Tambah"} Topping</h2>

                {isLoadingFetchData ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        {/* Nama */}
                        <div className="col-span-2">
                            <label className="block font-semibold mb-2">Nama Topping <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register("name")}
                                className="w-full p-2 border rounded border-slate-300 focus:outline-amber-500"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Tipe */}
                        <div className="col-span-2">
                            <label className="block font-semibold mb-2">Tipe <span className="text-red-500">*</span></label>
                            <select
                                {...register("type")}
                                className="w-full p-2 border rounded border-slate-300 focus:outline-amber-500"
                            >
                                <option value="">Pilih tipe</option>
                                <option value="food">Makanan</option>
                                <option value="drink">Minuman</option>
                            </select>
                            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                        </div>

                        {/* Harga */}
                        <div>
                            <label className="block font-semibold mb-2">Harga (Rp) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                {...register("price")}
                                className="w-full p-2 border rounded border-slate-300 focus:outline-amber-500"
                            />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>

                        {/* Stok */}
                        <div>
                            <label className="block font-semibold mb-2">Stok <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                {...register("stock")}
                                className="w-full p-2 border rounded border-slate-300 focus:outline-amber-500"
                            />
                            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
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

export default ToppingForm;
