import React, {useContext, useEffect, useMemo, useState} from 'react';
import ToppingService from "@services/toppingService.js";
import {MyContext} from "@/context/MyContext.jsx";
import ConfirmationModalAdmin from "@shared/components/Modal/ConfirmationModalAdmin.jsx";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {NavLink} from "react-router-dom";
import {CirclePlus, Edit2, Search, Trash} from "lucide-react";
import {formatRupiah} from "@/utils/formatCurrency.js";

const ToppingList = () => {
    const toppingService = useMemo(ToppingService, []);
    const [toppings, setToppings] = useState([]);
    const {isLoading, setIsLoading, showToast} = useContext(MyContext);
    const [q, setQ] = useState('');
    const [idToAction, setIdToAction] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState({title: '', message: ''});
    const [type, setType] = useState(null)

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setQ(e.target.value);
        }
    }

    const handleOpenConfirmationModal = (id) => {
        setIsModalOpen(true);
        setIdToAction(id);
        setModalMessage({
            title: 'Hapus Data',
            message: 'Yakin ingin menghapus topping ini?'
        });
    }

    const handleDeleteTopping = async () => {
        try {
            await toppingService.deleteById(idToAction);
            showToast("success", "Berhasil menghapus topping", 1000);
            setRefresh(prev => !prev);
        } catch {
            showToast("error", "Gagal menghapus topping", 1000);
        }
        setIsModalOpen(false);
    }

    useEffect(() => {
        setIsLoading(true);
        const getToppings = async () => {
            try {
                const response = await toppingService.getAll({q, type});
                setToppings(response.data);
            } catch (err) {
                showToast('error', err.response?.data?.message || 'Gagal memuat data', 1000);
            } finally {
                setIsLoading(false);
            }
        };
        getToppings();
    }, [toppingService, q, refresh, type]);

    return (
        <>
            <div className="p-4 rounded bg-white border border-slate-200">
                <div className="flex mb-4">
                    <NavLink
                        to={"add-topping"}
                        className="text-amber-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-amber-500 hover:text-white">
                        <CirclePlus size={16}/> tambah topping baru
                    </NavLink>
                </div>


                <div className="flex items-center mt-2 justify-between gap-x-1">
                    <div>
                        <select
                            onChange={(e) => setType(e.target.value)}
                            className="p-1 border rounded border-slate-300 focus:outline-amber-500"
                        >
                            <option value="">All</option>
                            <option value="food">Makanan</option>
                            <option value="beverage">Minuman</option>
                            <option value="snack">Snack</option>
                        </select>
                    </div>
                    <div
                        className="search-box flex items-center gap-x-2 border-2 border-slate-300 rounded-lg py-2 px-2 focus-within:border-amber-500">
                        <Search className="text-slate-400" size={20}/>
                        <input
                            onKeyDown={handleSearch}
                            type="text"
                            placeholder="search..."
                            className="focus:outline-none text-sm"
                        />
                    </div>
                </div>

                <div
                    className="overflow-x-auto overflow-y-auto min-h-[20rem] h-[30rem] max-w-[100vw] thin-scrollbar py-4">
                    <table className="w-full divide-y divide-gray-200 text-slate-600">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-xs text-left uppercase tracking-wider text-gray-600">No</th>
                            <th className="px-4 py-2 text-xs text-left uppercase tracking-wider text-gray-600">Nama</th>
                            <th className="px-4 py-2 text-xs text-left uppercase tracking-wider text-gray-600">Tipe</th>
                            <th className="px-4 py-2 text-xs text-left uppercase tracking-wider text-gray-600">Harga</th>
                            <th className="px-4 py-2 text-xs text-left uppercase tracking-wider text-gray-600">Stok</th>
                            <th className="px-4 py-2 text-xs text-left uppercase tracking-wider text-gray-600">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td className="px-4 py-2" colSpan={6}>Loading...</td>
                            </tr>
                        ) : toppings.length > 0 ? (
                            toppings.map((item, index) => (
                                <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{capitalizeWords(item.name)}</td>
                                    <td className="px-4 py-2 capitalize">{item.type}</td>
                                    <td className="px-4 py-2">{formatRupiah(item.price)}</td>
                                    <td className="px-4 py-2">{item.stock}</td>
                                    <td className="px-4 py-2 flex gap-x-4">
                                        <NavLink
                                            to={`update-topping/${item.id}`}
                                            className="text-blue-500 flex items-center gap-1 border shadow px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white">
                                            <Edit2 size={16}/> ubah
                                        </NavLink>
                                        <button
                                            onClick={() => handleOpenConfirmationModal(item.id)}
                                            className="text-red-500 flex items-center gap-1 border shadow px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white">
                                            <Trash size={16}/> hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4">Tidak ada topping untuk ditampilkan</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModalAdmin
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteTopping}
                title={modalMessage.title}
                message={modalMessage.message}
            />
        </>
    );
};

export default ToppingList;
