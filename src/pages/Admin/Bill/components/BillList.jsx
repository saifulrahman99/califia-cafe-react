import React, {useContext, useEffect, useMemo, useState} from "react";
import {MyContext} from "@/context/MyContext.jsx";
import {Search, ChevronDown, ChevronUp, Eye, ChartBar, PrinterIcon} from "lucide-react";
import {formatRupiah} from "@/utils/formatCurrency.js";
import BillService from "@services/billService.js";
import Modal from "@/shared/components/Modal/Modal.jsx"; // pastikan Anda punya komponen Modal
import {formatDate} from "@/utils/formatDate.js";
import {formatHour} from "@/utils/formatHour.js";
import {Link} from "react-router-dom";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {connectToPrinter} from "@/utils/connectToPrinter.js";
import ReceiptTemplate from "@shared/components/Bill/ReceiptTemplate.jsx";
import {render} from "react-thermal-printer";
import {logoCafe} from "@/utils/logoCafe.js";
import {logoInstagram} from "@/utils/logoInstagram.js";
import {logoTiktok} from "@/utils/logoTiktok.js";

const TransactionList = () => {
    const {
        isLoading,
        setIsLoading,
        showToast,
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
    const [device, setDevice] = useState(null);

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

    const handleToConnectThePrinter = () => {
        connectToPrinter(setDevice).then((response) => {
            if (response) {
                showToast("success", "Berhasil Terhubung", 1000)
            } else {
                showToast("error", "gagal terhubung", 1000);
            }
        });
    }

    const handlePrint = async () => {
        if (!device) return showToast("warning", "Hubungkan printer terlebih dahulu", 1000);
        if (!selectedBill || selectedBill.status !== 'paid') return showToast("warning", 'Bill belum dibayar', 1000);

        try {
            const receipt = <ReceiptTemplate bill={selectedBill}/>;
            const data = await render(receipt);
            await device.transferOut(1, data);
            showToast("success", "Cetak berhasil", 1000);
        } catch (err) {
            console.error(err);
            showToast("error", "Gagal mencetak", 1000);
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
            <div className="flex">
                <button
                    onClick={handleToConnectThePrinter}
                    className="text-amber-500 flex items-center gap-1 cursor-pointer border shadow px-2 py-1 rounded-lg hover:bg-amber-500 hover:text-white">Connect
                    To Printer
                </button>
            </div>
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
                       title={`Invoice`}>
                    <div
                        className="font-mono border-dotted border-2 p-2 text-xs md:text-lg md:p-4 tracking-tighter max-h-150 overflow-y-auto">
                        <img src={logoCafe()} alt="logo cafe" className={'max-w-[50%] mx-auto my-2'}/>
                        <p className="text-center">Jl. Raya Banyuwangi No. 67, Gudang, Asembagus, Situbondo, Jawa Timur,
                            68373 </p>
                        <p className="text-center mb-2">085735717592</p>
                        <div className="flex justify-between">
                            <span>{formatDate(selectedBill.trans_date)}</span>
                            <span>{formatHour(selectedBill.trans_date)}</span>
                        </div>
                        <div>{selectedBill.invoice_no}</div>
                        <div className="flex justify-between">
                            <span>Customer</span>
                            <span>{selectedBill.customer_name}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Order</span>
                            <span>
                            {selectedBill.order_type === "DI" ? "Dine-in" : "Take Away"}
                                {selectedBill.order_type === "DI" &&
                                    <>{` (${selectedBill.table})`}</>}
                            </span>
                        </div>

                        <div></div>
                        <div className="border-t-2 border-dotted pt-2 mt-2">
                            <span className="">Pesanan:</span>

                            {selectedBill.bill_details.map((item, idx) => (
                                <div key={idx} className="mb-2 border-b-2 border-dotted">
                                    <div className="text-wrap">{capitalizeWords(item.menu.name)}</div>
                                    <div className="flex justify-between">
                                        <span>x{item.qty} {formatRupiah(item.price)}{item.discount_price > 0 && `(-${formatRupiah(item.discount_price)})`}</span>
                                        <span>{formatRupiah(item.total_price)}</span>
                                    </div>

                                    <div className="clear-both"></div>
                                    {item.bill_detail_toppings.length > 0 && (
                                        <ul className="ml-4 list-['+'] list-inside">
                                            {item.bill_detail_toppings.map((top, i) => (
                                                <li key={i}
                                                    className="mb-1"><span
                                                    className=""> {capitalizeWords(top.topping.name)}</span> x{top.qty}
                                                    <span
                                                        className="float-end">{formatRupiah(top.price)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="py-2 text-right mb-4 border-b-2 border-dotted">
                            Total: {formatRupiah(selectedBill.final_price)}
                        </div>

                        <div className="flex gap-x-2 items-center">
                            <img src={logoInstagram()} alt="logo instagram" className={'max-w-3 md:max-w-4'}/>
                            <span>Califiasfood</span>
                        </div>
                        <div className="flex gap-x-2 items-center mb-2">
                            <img src={logoTiktok()} alt="logo tiktok" className={'max-w-3 md:max-w-4'}/>
                            <span>Califiasfood</span>
                        </div>
                    </div>

                    {selectedBill.status === "paid" &&
                        <div className="button mt-4">
                            <button
                                onClick={handlePrint}
                                className="print cursor-pointer bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-600 flex mx-auto gap-x-2 items-center">
                                <PrinterIcon size={18}/> Print
                            </button>
                        </div>}
                </Modal>
            )}
        </div>
    );
};

export default TransactionList;
