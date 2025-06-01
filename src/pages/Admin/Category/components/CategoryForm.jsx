import React, {useContext, useEffect, useMemo} from 'react';
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {RotateCcw} from "lucide-react";
import CategoryService from "@services/categoryService.js";
import {MyContext} from "@/context/MyContext.jsx";
import AdminLoading from "@shared/components/Loading/AdminLoading.jsx";

const schema = yup.object().shape({
    name: yup.string().required("Nama wajib di isi"),
});

const CategoryForm = ({payload, setPayload, setRefresh}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });
    const categoryService = useMemo(CategoryService, []);
    const {showToast, isProcessDataOpen, setIsProcessDataOpen} = useContext(MyContext);

    const onSubmit = async (data) => {
        try {
            setIsProcessDataOpen(!isProcessDataOpen);
            if (Object.keys(payload).length > 0) {
                await categoryService.update({
                    id: payload.id,
                    name: data.name,
                })
                showToast("success", "berhasil mengubah", 1000)
            } else {
                await categoryService.create({name: data.name,});
                showToast("success", "berhasil menyimpan", 1000)
            }

            resetHandler();
            setRefresh(prev => !prev);
        } catch (err) {
            if (err.response.status === 422) {
                showToast("error", "tidak ada yang dirubah", 1000)
            }
        }
        setIsProcessDataOpen(false);
    }
    const resetHandler = () => {
        setPayload({});
        reset({name: null,});
    }

    useEffect(() => {
        if (Object.keys(payload).length > 0) {
            reset({name: payload.name});
        }
    }, [payload]);
    return (
        <>
            <div className="p-4 border border-slate-200 rounded">
                <div className="flex justify-between">
                    <h1 className={"text-lg font-semibold mb-4"}>Form</h1>
                    <button
                        onClick={resetHandler}
                        className="flex items-center gap-x-1 text-red-500 font-semibold cursor-pointer"><RotateCcw
                        size={18}/> reset
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="grid">
                    <div className="col-span-2">
                        <label className="block font-semibold mb-2">Nama <span
                            className={"text-red-500 text-xs"}>*</span></label>
                        <input
                            type="text"
                            {...register("name")}
                            className="w-full p-2 border border-slate-300 outline-amber-500 focus:outline-amber-500 rounded-md"
                        />
                        {errors["name"] && (
                            <p className="text-red-500 text-sm mt-2">{errors["name"]?.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 text-white p-2 rounded-md hover:bg-amber-600 col-span-2 max-w-md mt-5 mb-4 mx-auto cursor-pointer shadow"
                    >{Object.keys(payload).length > 0 ? "Update" : "Simpan"}
                    </button>
                </form>
            </div>
            <AdminLoading isOpen={isProcessDataOpen} isLoading={true}/>
        </>
    );
};

export default CategoryForm;