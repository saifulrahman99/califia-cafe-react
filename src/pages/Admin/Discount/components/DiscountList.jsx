import React, {useContext, useEffect, useMemo, useState} from 'react';
import DiscountService from "@services/discountService.js";
import {MyContext} from "@/context/MyContext.jsx";
import ConfirmationModalAdmin from "@shared/components/Modal/ConfirmationModalAdmin.jsx";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {NavLink} from "react-router-dom";
import {CirclePlus, Edit2, Search, Trash} from "lucide-react";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {formatDate} from "@/utils/formatDate.js";
import {formatHour} from "@/utils/formatHour.js";
import AdminLoading from "@shared/components/Loading/AdminLoading.jsx";

const DiscountList = () => {
    const discountService = useMemo(DiscountService, []);
    const [discounts, setDiscounts] = useState([]);
    const {isLoading, setIsLoading, showToast, isProcessDataOpen, setIsProcessDataOpen} = useContext(MyContext);
    const [q, setQ] = useState('');
    const [idToAction, setIdToAction] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(true);
    const [modalMessage, setModalMessage] = useState({
        title: '',
        message: ''
    });

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setQ(e.target.value);
        }
    }

    const handleOpenConfirmationModal = (id, action) => {
        setIsModalOpen(!isModalOpen);
        setIdToAction(id);
        setModalMessage({
            title: action === 'delete' ? 'Hapus Data' : 'Ubah Diskon',
            message: action === 'delete' ? 'Apakah Anda yakin hapus data ini?' : 'Apakah Anda yakin mengubah sttaus diskon ini?'
        });
        setIsDelete(action === 'delete');
    }
    const handleDeleteDiscount = async () => {
        setIsProcessDataOpen(!isProcessDataOpen);
        try {
            await discountService.deleteById(idToAction);
            showToast("success", "Berhasil menghapus diskon", 1000);
            setRefresh(prev => !prev)
        } catch {
            showToast("error", "Gagal menghapus diskon", 1000);
        }
        setIsModalOpen(false);
        setIsProcessDataOpen(false);
    }

    const handleUpdateStatusDiscount = async () => {
        setIsProcessDataOpen(!isProcessDataOpen);
        try {
            await discountService.updateStatus(idToAction);
            showToast("success", "Berhasil mengubah status diskon", 1000);
        } catch {
            showToast("error", "Gagal mengubah status diskon", 1000);
        }
        setRefresh(prev => !prev)
        setIsModalOpen(false);
        setIsProcessDataOpen(false);
    }
    useEffect(() => {
        setIsLoading(!isLoading);
        const getDiscounts = async () => {
            try {
                const response = await discountService.getAll({q: q});
                setDiscounts(response.data);
                setIsLoading(false);
            } catch (err) {
                showToast('error', err.response.data.message, 1000);
            }
        }
        getDiscounts();
    }, [discountService, q, refresh])
    return (
        <>
            <div className="p-4 rounded bg-white border border-slate-200">
                <div className="flex mb-4">
                    <NavLink
                        to={"add-discount"}
                        className="text-amber-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-amber-500 hover:text-white">
                        <CirclePlus size={16}/> tambah diskon baru
                    </NavLink>
                </div>

                <div className="flex items-center mt-2 justify-end">
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

                <div
                    className="verflow-x-auto overflow-y-auto min-h-[20rem] h-[30rem] max-w-[100vw] thin-scrollbar py-4">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Judul
                                Diskon
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">besar
                                diskon
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">tanggal
                                mulai
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">tanggal
                                selesai
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">status</th>
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
                            discounts.length > 0 ?
                                discounts.map((item, index) => (
                                    <tr key={index} className={"odd:bg-white even:bg-gray-50"}>
                                        <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                                        <td className="px-4 py-2 text-gray-800 text-nowrap">{capitalizeWords(item.name)}</td>
                                        <td className="px-4 py-2 text-gray-800 text-nowrap">{formatRupiah(item.amount)}</td>
                                        <td className="px-4 py-2 text-gray-800">
                                            <span className="block text-nowrap">{formatDate(item.start_date)}</span>
                                            <span
                                                className="block text-nowrap">Jam {formatHour(item.start_date)} </span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-800">
                                            <span className="block text-nowrap">{formatDate(item.end_date)}</span>
                                            <span className="block text-nowrap">Jam {formatHour(item.end_date)} </span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-800 text-nowrap select-none">

                                            <div className="flex gap-x-2">

                                                <button
                                                    onClick={() => handleOpenConfirmationModal(item.id, "update-status")}
                                                    htmlFor="AcceptConditions"
                                                    className="relative block h-6 w-12 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-amber-500 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id="AcceptConditions"
                                                        checked={item.is_active}
                                                        readOnly
                                                        className="peer sr-only"/>

                                                    <span
                                                        className="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"
                                                    ></span>
                                                </button>

                                                {item.is_active ? "Aktif" : "Mati"}

                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-nowrap flex gap-x-6">
                                            <NavLink
                                                to={`update-discount/${item.id}`}
                                                className="text-blue-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white">
                                                <Edit2 size={16}/> ubah
                                            </NavLink>
                                            <button
                                                onClick={() => handleOpenConfirmationModal(item.id, "delete")}
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

            </div>
            <ConfirmationModalAdmin
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={isDelete ? handleDeleteDiscount : handleUpdateStatusDiscount}
                title={modalMessage.title}
                message={modalMessage.message}
            />
            <AdminLoading isOpen={isProcessDataOpen} isLoading={true}/>
        </>
    );
};

export default DiscountList;