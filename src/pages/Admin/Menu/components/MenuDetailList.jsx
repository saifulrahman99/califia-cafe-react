import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Undo2} from "lucide-react";
import MenuService from "@services/menuService.js";
import {MyContext} from "@/context/MyContext.jsx";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {capitalizeWords} from "@/utils/capitalWords.js";

const MenuDetailList = () => {
    const {id} = useParams();
    const {isLoading, setIsLoading} = useContext(MyContext);
    const navigate = useNavigate();
    const menuService = useMemo(MenuService, []);
    const [menu, setMenu] = useState({});

    useEffect(() => {
        setIsLoading(!isLoading);
        const getMenu = async () => {
            try {
                const response = await menuService.getById(id);
                return response.data;
            } catch (error) {
                console.log(error);
            }
        }
        getMenu().then(data => {
            setMenu(data)
            setIsLoading(false);
        });
    }, [menuService]);
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

            <div className="p-4 rounded bg-white">
                <div className="menu">
                    {isLoading ? (<>Loading...</>) :
                        (
                            <div key={menu.id} className="py-4">
                                <div className="flex menus-start gap-4 flex-col md:flex-row">
                                    <img
                                        src={menu.image}
                                        alt={menu.name}
                                        className="w-70 object-fit rounded border border-slate-300 overflow-hidden mx-auto md:mx-0"
                                    />
                                    <div>
                                        <p><span className="font-semibold">ID:</span> {menu.id}</p>
                                        <p><span className="font-semibold">Nama:</span> {capitalizeWords(menu.name)}</p>
                                        <p><span className="font-semibold">Deskripsi:</span> {menu.description}
                                        </p>
                                        <p><span
                                            className="font-semibold">Harga:</span> {formatRupiah(menu.price)}
                                        </p>
                                        <p><span
                                            className="font-semibold">Stok:</span> {menu.stock > 0 ? menu.stock : 'Habis'}
                                        </p>
                                        <p><span className="font-semibold">Jenis:</span> {capitalizeWords(menu.type)}
                                        </p>
                                        <p><span
                                            className="font-semibold">Kategori:</span> {capitalizeWords(menu.category?.name)}
                                        </p>
                                        <p><span
                                            className="font-semibold">Topping Diaktifkan:</span> {menu.topping_enabled ? 'Ya' : 'Tidak'}
                                        </p>

                                        {menu.discount ? (
                                            <div className="mt-2 text-red-600">
                                                <p><span
                                                    className="font-semibold">Diskon:</span> {menu.discount?.name}
                                                </p>
                                                <p><span
                                                    className="font-semibold">Jumlah Potongan:</span> {formatRupiah(menu.discount?.amount)}
                                                </p>
                                                <p><span
                                                    className="font-semibold">Mulai:</span> {menu.discount?.start_date}
                                                </p>
                                                <p><span
                                                    className="font-semibold">Berakhir:</span> {menu.discount?.end_date}
                                                </p>
                                                <p><span
                                                    className="font-semibold">Aktif:</span> {menu.discount?.is_active ? 'Ya' : 'Tidak'}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 mt-2">Tidak ada diskon</p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default MenuDetailList;