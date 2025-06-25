import React, {useContext, useEffect, useMemo, useState} from "react";
import {MyContext} from "@/context/MyContext.jsx";
import {Search, ChevronDown, ChevronUp, Eye, ChartBar} from "lucide-react";
import {formatRupiah} from "@/utils/formatCurrency.js";
import BillService from "@services/billService.js";
import Modal from "@/shared/components/Modal/Modal.jsx";
import {formatDate} from "@/utils/formatDate.js";
import {formatHour} from "@/utils/formatHour.js";
import {Link} from "react-router-dom";
import {capitalizeWords} from "@/utils/capitalWords.js"; // pastikan Anda punya komponen Modal

const TransactionList = () => {
    const {
        isLoading,
        setIsLoading,
    } = useContext(MyContext);

    const [transactions, setTransactions] = useState([]);
    const billService = useMemo(BillService, []);
    const [q, setQ] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paging, setPaging] = useState({current_page: 1, last_page: 1, links: []});
    const [direction, setDirection] = useState(true);
    const [sort, setSort] = useState("trans_date");

    const [selectedBill, setSelectedBill] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handlePageChange = (e) => setPerPage(e.target.value);
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setQ(e.target.value)
            setPage(1);
        }
    };
    const handleSort = (key) => {
        setSort(key);
        setDirection(!direction);
    };

    const openInvoicePreview = (bill) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirm":
                return "bg-blue-100 text-blue-800";
            case "paid":
                return "bg-green-100 text-green-800";
            case "canceled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const response = await billService.getAll({
                    q, page, perPage, sortBy: sort, direction: direction ? "desc" : "asc",
                });

                const {data, meta} = response.data;
                setTransactions(data);
                handlePaginationData(meta);
            } catch (err) {
                console.error("Failed to fetch transactions", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [page, perPage, q, sort, direction]);

    return (
        <div className="px-4 py-2 rounded bg-white border border-slate-200">
            <div className="flex items-center justify-between mt-2">
                <select onChange={handlePageChange} className="p-1 px-2 rounded-lg border-2 border-slate-300">
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                </select>
                <div className="flex items-center gap-2 border-2 border-slate-300 rounded-lg px-2 py-1">
                    <Search size={20} className="text-slate-400"/>
                    <input
                        type="text"
                        onKeyDown={handleSearch}
                        placeholder="Cari invoice atau customer..."
                        className="focus:outline-none text-sm py-1"
                    />
                </div>
            </div>

            <div className="overflow-auto mt-4 thin-scrollbar">
                <table className="w-full table-auto text-left divide-y text-gray-600">
                    <thead className="bg-gray-100 border-0 text-sm uppercase">
                    <tr>
                        <th className="px-3 py-2">No</th>
                        <th className="px-3 py-2">Invoice</th>
                        <th className="px-3 py-2">Customer</th>
                        <th className="px-3 py-2">No HP</th>
                        <th onClick={() => handleSort("trans_date")}
                            className="px-3 py-2 cursor-pointer flex items-center gap-x-1">
                            Tanggal{" "}
                            {sort === "trans_date" && (direction ? <ChevronDown size={14}/> : <ChevronUp size={14}/>)}
                        </th>
                        <th className="px-3 py-2">Meja</th>
                        <th className="px-3 py-2">Order</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="10" className="text-center py-4">Loading...</td>
                        </tr>
                    ) : transactions.length ? (
                        transactions.map((trx, i) => (
                            <tr key={trx.id} className="odd:bg-white even:bg-gray-50">
                                <td className="px-3 py-2 text-nowrap">{(paging.current_page - 1) * perPage + i + 1}</td>
                                <td className="px-3 py-2 text-nowrap">{trx.invoice_no}</td>
                                <td className="px-3 py-2 text-nowrap">{trx.customer_name}</td>
                                <td className="px-3 py-2 text-nowrap">
                                    <Link to={`https://wa.me/${trx.phone_number}`} target="_blank"
                                          className="hover:underline">{trx.phone_number}</Link>
                                </td>
                                <td className="px-3 py-2 text-nowrap">{formatDate(trx.trans_date)}, {formatHour(trx.trans_date)}</td>
                                <td className="px-3 py-2 text-nowrap">{trx.table ? trx.table : "-"}</td>
                                <td className="px-3 py-2 text-nowrap">{trx.order_type}</td>
                                <td className="px-3 py-2 text-nowrap">
                                    <span
                                        className={`capitalize px-2 pb-0.5 rounded-full text-sm font-semibold ${getStatusBadgeClass(trx.status)}`}>{trx.status}</span>
                                </td>
                                <td className="px-3 py-2 text-nowrap">{formatRupiah(trx.final_price)}</td>
                                <td className="px-3 py-2 text-nowrap">
                                    <button
                                        onClick={() => openInvoicePreview(trx)}
                                        className="text-slate-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-slate-500 hover:text-white"
                                    >
                                        <ChartBar size={16}/> Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center py-4">Tidak ada data transaksi</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center py-4 text-sm flex-wrap gap-y-2">
                <div>
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
                                    className={`text-nowrap cursor-pointer px-3 py-1.5 rounded-md text-sm font-medium ${link.active ? 'bg-amber-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''} `}>
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal Invoice Preview */}
            {isModalOpen && selectedBill && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                       title={`Invoice ${selectedBill.invoice_no}`}>
                    <div className="space-y-2">
                        <div><span className="font-semibold">Customer:</span> {selectedBill.customer_name}</div>
                        <div><span
                            className="font-semibold">Order:</span> {selectedBill.order_type === "DI" ? "Dine-in" : "Take Away"}
                        </div>
                        {selectedBill.order_type === "DI" &&
                            <div><span className="font-semibold">Meja:</span> {selectedBill.table}</div>}
                        <div>
                            <span
                                className="font-semibold">Tanggal:</span> {formatDate(selectedBill.trans_date)}, {formatHour(selectedBill.trans_date)}
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <span className="font-semibold">Pesanan:</span>
                            <ul className="list-disc list-inside">
                                {selectedBill.bill_details.map((item, idx) => (
                                    <li key={idx} className="mb-1">
                                        <span
                                            className="font-semibold">{capitalizeWords(item.menu.name)}</span> x{item.qty}
                                        <span
                                            className="float-end">{formatRupiah(item.total_price)}</span>
                                        {item.bill_detail_toppings.length > 0 && (
                                            <ul className="ml-4 list-['+'] list-inside">
                                                {item.bill_detail_toppings.map((top, i) => (
                                                    <li key={i}
                                                        className="mb-1"><span
                                                        className="font-semibold"> {capitalizeWords(top.topping.name)}</span> x{top.qty}
                                                        <span
                                                            className="float-end">{formatRupiah(top.price)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t pt-2 font-bold text-right">
                            Total: {formatRupiah(selectedBill.final_price)}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TransactionList;
