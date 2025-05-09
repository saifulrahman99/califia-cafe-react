import React, {useContext, useEffect, useMemo, useState} from 'react';
import CategoryService from "@services/categoryService.js";
import {MyContext} from "@/context/MyContext.jsx";
import {NavLink} from "react-router-dom";
import ConfirmationModalAdmin from "@shared/components/Modal/ConfirmationModalAdmin.jsx";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {Edit2, Search, Trash} from "lucide-react";
import CategoryForm from "@pages/Admin/Category/components/CategoryForm.jsx";

const CategoryList = () => {
    const categoryService = useMemo(CategoryService, []);
    const [categories, setCategories] = useState([]);
    const {isLoading, setIsLoading, showToast} = useContext(MyContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [q, setQ] = useState(null);
    const [idToDelete, setIdToDelete] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [payloadUpdate, setPayloadUpdate] = useState({});

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setQ(e.target.value);
        }
    }
    const handleDeleteCategory = async () => {
        try {
            await categoryService.deleteById(idToDelete);
            showToast("success", "Berhasil menghapus categori", 1000);
            setRefresh(prev => !prev)
        } catch {
            showToast("error", "Gagal menghapus categori", 1000);
        }
        setIsModalOpen(false);
    }
    const handleOpenConfirmationModal = (id) => {
        setIsModalOpen(!isModalOpen);
        setIdToDelete(id);
    }
    const handleToSetPayloadUpdate = (id, name) => {
        setPayloadUpdate({
            id: id,
            name: name,
        });
    }

    useEffect(() => {
        setIsLoading(!isLoading);
        const getMenus = async () => {
            try {
                const response = await categoryService.getAll({q: q});
                return response.data;
            } catch (error) {
                console.log(error);
            }
        }
        getMenus().then(data => {
            setCategories(data)
            setIsLoading(false);
        });
    }, [categoryService, q, refresh]);
    return (
        <>
            <div className="p-4 rounded bg-white border border-slate-200">
                <div className="flex items-center mt-2">
                    <div
                        className="search-box flex items-center gap-x-2 border-2 border-slate-300 rounded-lg py-2 px-2 focus-within:border-amber-500">
                        <Search className="inline text-slate-400" size={20}/>
                        <input
                            onKeyDown={handleSearch}
                            type="text"
                            placeholder="search..."
                            className="focus:outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 md:gap-x-10">
                    <div
                        className="verflow-x-auto overflow-y-auto min-h-[20rem] h-[30rem] max-w-[100vw] thin-scrollbar py-4">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nama</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (<>
                                    <tr>
                                        <td className="px-4 py-2 text-gray-800">
                                            Loading...
                                        </td>
                                    </tr>
                                </>) :
                                categories.length > 0 ?
                                    categories.map((item, index) => (
                                        <tr key={index} className={"odd:bg-white even:bg-gray-50"}>
                                            <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                                            <td className="px-4 py-2 text-gray-800 text-nowrap">{capitalizeWords(item.name)}</td>
                                            <td className="px-4 py-2 text-nowrap flex gap-x-6">
                                                <button
                                                    onClick={() => handleToSetPayloadUpdate(item.id, item.name)}
                                                    className="text-blue-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white">
                                                    <Edit2 size={16}/> ubah
                                                </button>
                                                <button
                                                    onClick={() => handleOpenConfirmationModal(item.id)}
                                                    className="text-red-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white">
                                                    <Trash size={16}/> hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <>
                                        <tr>
                                            <td colSpan={7} className={"text-center py-4"}>Tidak ada data yang bisa
                                                ditampilkan
                                            </td>
                                        </tr>
                                    </>
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className="py-4">
                        <CategoryForm payload={payloadUpdate} setPayload={setPayloadUpdate} setRefresh={setRefresh}/>
                    </div>
                </div>
            </div>
            <ConfirmationModalAdmin
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteCategory}
                title="Hapus Data"
                message="Apakah Anda yakin hapus data ini?"
            />

        </>
    );
};

export default CategoryList;