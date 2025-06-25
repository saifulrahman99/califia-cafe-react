import React, {useContext, useEffect, useMemo, useState} from 'react';
import MenuService from "@services/menuService.js";
import {MyContext} from "@/context/MyContext.jsx";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {ChartBar, ChevronDown, ChevronUp, CirclePlus, Edit2, Search, Trash} from "lucide-react";
import {NavLink} from "react-router-dom";
import {capitalizeWords} from "@/utils/capitalWords.js";
import ConfirmationModalAdmin from "@shared/components/Modal/ConfirmationModalAdmin.jsx";
import AdminLoading from "@shared/components/Loading/AdminLoading.jsx";

const MenuList = () => {
    const {isLoading, setIsLoading, showToast, isProcessDataOpen, setIsProcessDataOpen} = useContext(MyContext);
    const [menus, setMenus] = useState([]);
    const menuService = useMemo(MenuService, []);
    const [q, setQ] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paging, setPaging] = useState({
        current_page: 1,
        last_page: 1,
        links: [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [direction, setDirection] = useState(true);
    const [sort, setSort] = useState("name");

    const handlePaginationData = (meta) => {
        const currentPage = meta.current_page;
        const lastPage = meta.last_page;

        let startPage = currentPage - 1;
        if (currentPage >= lastPage) {
            startPage = lastPage - 4;
        }

        if (startPage < 1) startPage = 1;

        const visiblePages = [];
        for (let i = startPage; i < startPage + 4 && i <= lastPage; i++) {
            visiblePages.push({
                label: String(i),
                url: String(i),
                active: i === currentPage,
            });
        }

        // Tambahkan halaman terakhir jika belum ada
        if (!visiblePages.find(link => link.url === String(lastPage)) && lastPage > 0) {
            visiblePages.push({
                label: String(lastPage),
                url: String(lastPage),
                active: currentPage === lastPage,
            });
        }

        // Previous dan Next
        const prevLink = {
            label: '« Prev',
            url: currentPage > 1 ? String(currentPage - 1) : null,
            active: false,
        };
        const nextLink = {
            label: 'Next »',
            url: currentPage < lastPage ? String(currentPage + 1) : null,
            active: false,
        };

        setPaging({
            current_page: currentPage,
            last_page: lastPage,
            links: [prevLink, ...visiblePages, nextLink],
        });
    };

    const handlePageChange = (e) => {
        setPerPage(e.target.value);
    }
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setQ(e.target.value)
            setPage(1);
        }
    };
    const handleOpenConfirmationModal = (id) => {
        setIsModalOpen(!isModalOpen);
        setIdToDelete(id);
    }
    const handleDeleteMenu = async () => {
        setIsProcessDataOpen(!isProcessDataOpen);
        try {
            await menuService.deleteById(idToDelete);
            showToast("success", "Berhasil menghapus menu", 1000);
            setRefresh(prev => !prev)
        } catch {
            showToast("error", "Gagal menghapus menu", 1000);
        }
        setIsModalOpen(false);
        setIsProcessDataOpen(false);
    }

    const handleSort = (data) => {
        setSort(data.sortBy);
        const newDirection = !direction;
        setDirection(newDirection);
    }

    useEffect(() => {
        setIsLoading(!isLoading);
        const getMenus = async () => {
            try {
                const response = await menuService.getAll({
                    q: q,
                    page: page,
                    perPage: perPage,
                    direction: direction ? "asc" : "desc",
                    sortBy: sort,
                });
                return response.data;
            } catch (error) {
                console.log(error);
            }
        }
        getMenus().then(data => {
            setMenus(data.data)
            handlePaginationData(data.meta);
            setIsLoading(false);
        });
    }, [menuService, page, perPage, q, refresh, sort, direction]);
    return (
        <>
            <div className="px-4 py-2 rounded bg-white border border-slate-200">
                <div className="flex my-2">
                    <NavLink
                        to={"add-menu"}
                        className="text-amber-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-amber-500 hover:text-white">
                        <CirclePlus size={16}/> tambah menu baru
                    </NavLink>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="perpage">
                        <select onChange={handlePageChange}
                                className={"cursor-pointer p-1 px-2 rounded-lg border-2 border-slate-300 focus:outline-none focus-within:border-amber-500"}>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="25">25</option>
                        </select>
                    </div>
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
                    className="verflow-x-auto overflow-y-auto min-h-[20rem] max-h-[30rem] max-w-[100vw] thin-scrollbar py-4 mb-4">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                            <th
                                onClick={() => handleSort({sortBy: "name"})}
                                className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Nama
                                Menu {
                                    sort === "name" ?
                                        sort === "name" && direction ?
                                            <ChevronDown size={18} className="inline mb-0.5"/> :
                                            <ChevronUp size={18} className="inline mb-0.5"/>
                                        : <ChevronDown size={18} className="inline mb-0.5"/>
                                }
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Kategori</th>
                            <th
                                className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Jenis
                            </th>
                            <th
                                onClick={() => handleSort({sortBy: "price"})}
                                className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Harga {
                                sort === "price" ?
                                    sort === "price" && direction ?
                                        <ChevronDown size={18} className="inline mb-0.5"/> :
                                        <ChevronUp size={18} className="inline mb-0.5"/>
                                    : <ChevronDown size={18} className="inline mb-0.5"/>
                            }
                            </th>
                            <th
                                onClick={() => handleSort({sortBy: "stock"})}
                                className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Stok {
                                sort === "stock" ?
                                    sort === "stock" && direction ?
                                        <ChevronDown size={18} className="inline mb-0.5"/> :
                                        <ChevronUp size={18} className="inline mb-0.5"/>
                                    : <ChevronDown size={18} className="inline mb-0.5"/>
                            }
                            </th>
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
                            menus.length > 0 ?
                                menus.map((item, index) => (
                                    <tr key={index} className={"odd:bg-white even:bg-gray-50"}>
                                        <td className="px-4 py-2 text-gray-800">{(paging.current_page - 1) * perPage + index + 1}</td>
                                        <td className="px-4 py-2 text-gray-800 text-nowrap">{capitalizeWords(item.name)}</td>
                                        <td className="px-4 py-2 text-gray-800 text-nowrap">{capitalizeWords(item.category?.name)}</td>
                                        <td className="px-4 py-2 text-gray-800 text-nowrap">{capitalizeWords(item.type)}</td>
                                        <td className="px-4 py-2 text-gray-800">{formatRupiah(item.price)}</td>
                                        <td className="px-4 py-2">
                                            {item.stock > 0 ? (
                                                <span
                                                    className={`font-medium ${item.stock >= 10 ? "text-green-600" : "text-amber-500"}`}>{item.stock}</span>
                                            ) : (
                                                <span
                                                    className="text-red-700 font-medium text-sm">Habis</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-nowrap flex gap-x-6">
                                            <NavLink
                                                to={`detail/${item.id}`}
                                                className="text-slate-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-slate-500 hover:text-white">
                                                <ChartBar size={16}/> detail
                                            </NavLink>
                                            <NavLink
                                                to={`update-menu/${item.id}`}
                                                className="text-blue-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white">
                                                <Edit2 size={16}/> ubah
                                            </NavLink>
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
                <div className="paging flex justify-between px-4 pb-4 flex-col md:flex-row text-sm">
                    <div className="page-label">
                        Halaman {paging.current_page} dari {paging.last_page}
                    </div>
                    <div className="page-nav">
                        <ul className="flex justify-center gap-1 text-gray-900">
                            {paging.links.map((link, index) => (
                                <li key={index}>
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => link.url && setPage(link.url)}
                                        className={`cursor-pointer px-3 py-1.5 rounded-md text-sm font-medium ${link.active ? 'bg-amber-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''} `}>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <ConfirmationModalAdmin
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteMenu}
                title="Hapus Data"
                message="Apakah Anda yakin hapus data ini?"
            />
            <AdminLoading isOpen={isProcessDataOpen} isLoading={true}/>
        </>
    );
};

export default MenuList;