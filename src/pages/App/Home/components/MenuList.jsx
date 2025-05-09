import React, {useContext, useEffect, useMemo, useState} from 'react';

import {formatRupiah} from "@/utils/formatCurrency.js";
import {replaceLocalhostWithServerHost} from "@/utils/replaceHostLocalToHostServer.js";
import MenuService from "@services/menuService.js";
import Ripples from 'react-ripples'
import NullMenuData from "@shared/components/Error/NullMenuData.jsx";
import ScrollToTop from "@pages/App/Home/components/ScrollToTop.jsx";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {MyContext} from "@/context/MyContext.jsx";
import MenuListSkeleton from "@pages/App/Home/components/MenuListSkeleton.jsx";
import {Link} from "react-router-dom";

const MenuList = () => {
    const {isLoading, setIsLoading} = useContext(MyContext);
    const [menus, setMenus] = useState({});
    const [type, setType] = useState('');
    const [listType] = useState(['', 'food', 'snack', 'beverage']);
    const menuService = useMemo(() => MenuService(), []);

    const handleTypeChange = (value) => {
        setType(value);
        window.scrollTo({top: 370, behavior: "smooth"});
    }

    const isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0;
    };

    useEffect(() => {
        const getMenu = async () => {
            setIsLoading(!isLoading); // activate loading
            try {
                const data = await menuService.getAll({
                    type: type,
                    all: true,
                });

                // bentuk data baru dari data awal
                const menus = data.data.data.reduce((acc, menu) => {
                    const category = menu.category.name; // Ambil kategori
                    if (!acc[category]) {
                        acc[category] = []; // Buat array baru jika belum ada kategori
                    }
                    acc[category].push(menu); // Masukkan menu ke kategori
                    return acc;
                }, {});

                // sorting kategori by tipe menu
                const typeOrder = ["food", "snack", "beverage"];
                const sortMenuByType = (menu) => {
                    return Object.fromEntries(
                        Object.entries(menu).sort(([keyA, itemsA], [keyB, itemsB]) => {
                            const typeA = typeOrder.indexOf(itemsA[0]?.type);
                            const typeB = typeOrder.indexOf(itemsB[0]?.type);
                            return typeA - typeB;
                        })
                    );
                };

                // urutkan nama menu secara asc per kategori
                Object.keys(menus).forEach(category => {
                    menus[category].sort((a, b) => a.name.localeCompare(b.name));
                });
                setMenus(sortMenuByType(menus));
                if (data.status === 200) {
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMenu();
    }, [menuService, type]);

    return (
        <div className="pb-24">
            <ScrollToTop/>
            <nav
                style={{marginLeft: "0.5px"}}
                className="mb-6 pt-2 grid grid-cols-4 gap-2 w-full border-b border-slate-200 sticky top-13.5 z-2 bg-white"
                aria-label="Tabs">
                {
                    listType.map((item, index) => {
                        return (
                            <Ripples
                                key={index}
                                className={`cursor-pointer select-none shrink-0 flex justify-center rounded-t-md py-2 font-medium border-b-3 ${item === type ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                                aria-current="page"
                                onClick={() => handleTypeChange(item)}
                                style={{textTransform: "capitalize"}}
                            >
                                {item !== '' ? capitalizeWords(`${item}s`) : 'All'}
                            </Ripples>
                        )
                    })
                }
            </nav>

            <div className="grid grid-cols-2 gap-4 select-none px-4">
                {
                    isLoading ? (
                            <>
                                <MenuListSkeleton/>
                            </>
                        ) :
                        isEmptyObject(menus) ?
                            <NullMenuData/>
                            :
                            // munculkan data menu
                            Object.keys(menus).map((category) => {
                                    return (
                                        <>
                                            <div
                                                id={category}
                                                className="font-semibold text-xl col-span-2 inline-flex items-center w-full after:content-[''] after:flex-1 after:border-b after:border-gray-200 after:ml-2"
                                            >
                                                {category}
                                            </div>

                                            {menus[category].map((menu) => {
                                                let realPrice = menu.discount != null ? menu.price - menu.discount.amount : menu.price;
                                                return (
                                                    <Ripples className="rounded-lg relative">
                                                        {menu.stock < 1 && <div className="absolute inset-0 z-1"></div>}
                                                        <Link
                                                            to={`menu/${menu.id}`}
                                                            className="border border-slate-200 rounded-lg overflow-hidden w-full">
                                                            <div key={menu.id}
                                                                 className={`col relative ${menu.stock < 1 && "grayscale"}`}>

                                                                <div className="w-full aspect-square bg-slate-50 relative">
                                                                    {menu.stock < 1 && <div
                                                                        className="absolute inset-0 flex justify-center items-center text-white font-bold rounded-full bg-black/20 m-4 text-xl">Habis</div>}
                                                                    <img src={replaceLocalhostWithServerHost(menu.image)}
                                                                         alt={menu.name}
                                                                         className={`w-full aspect-square select-none`}/>
                                                                </div>

                                                                <div className="body py-2 px-3">
                                                                    <div
                                                                        className="text-lg text-slate-700 font-medium mb-2">{capitalizeWords(menu.name)}</div>
                                                                    {menu.discount != null ?
                                                                        <>
                                                                        <span
                                                                            className="text-sm inline-block line-through me-1 text-slate-600">{formatRupiah(menu.price)}</span>
                                                                            <span
                                                                                className="text-xs text-white bg-red-400 rounded-md p-1 px-2 font-medium">- {formatRupiah(menu.discount.amount)}</span>
                                                                            <span
                                                                                className="text-lg font-bold text-amber-500 block my-1">{formatRupiah(realPrice)}</span>
                                                                        </>
                                                                        :
                                                                        <>
                                                                        <span
                                                                            className="text-lg font-bold text-amber-500 block my-1">{formatRupiah(realPrice)}</span>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </Ripples>
                                                )
                                            })}
                                        </>
                                    )
                                }
                            )
                }
            </div>
        </div>
    );
};

export default MenuList;