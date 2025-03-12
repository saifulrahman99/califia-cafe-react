import {useEffect, useMemo, useState} from 'react';
import MenuService from "@services/menuService.js";
import NullMenuData from "@shared/components/Error/NullMenuData.jsx";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {replaceLocalhostWithServerHost} from "@/utils/repllaceHostLocalToHostServer.js";
import Ripples from "react-ripples";

const SearchResult = ({search}) => {
    const [recommendMenus, setRecommendMenus] = useState([]);
    const menuService = useMemo(() => MenuService(), []);


    useEffect(() => {
        const getRecommendMenus = async () => {
            try {
                const data = (search === "") ? await menuService.getRecommendable() : await menuService.getAll({q: search});
                setRecommendMenus(data.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getRecommendMenus();
    }, [menuService, search]);
    return (
        <>
            <div className="p-5 pt-2 mt-20 w-full mb-15 select-none">
                {search === "" ? <span className="font-semibold text-lg">Menu Rekomendasi</span> : null}
                {
                    recommendMenus.length < 1 ?
                        <NullMenuData/>
                        :
                        <>
                            {
                                recommendMenus.map((menu, index) => {
                                    let realPrice = menu.discount != null ? menu.price - menu.discount.amount : menu.price;
                                    return (
                                        <div key={index}
                                             className={`w-full rounded-lg py-2 flex border-b border-slate-200`}
                                        >
                                            <Ripples className="rounded-lg py-2">
                                                <div className="img min-w-10 max-w-25 bg-slate-50 rounded-lg overflow-hidden">
                                                    <img src={replaceLocalhostWithServerHost(menu.image)}
                                                         alt={menu.name}
                                                         className="w-full aspect-square"/>
                                                </div>
                                                <div className="body ms-4 relative w-md">
                                                <span
                                                    className="font-semibold text-lg">{capitalizeWords(menu.name)}</span>
                                                    <div className="absolute bottom-0 left-0 w-70 md:w-90">
                                                        {
                                                            menu.discount != null ?
                                                                <>
                                                                 <span
                                                                     className="text-sm inline line-through me-1 text-slate-600">{formatRupiah(menu.price)}</span>
                                                                    <span
                                                                        className="text-xs text-white bg-red-400 rounded-md p-0.5 px-2 font-medium">- {formatRupiah(menu.discount.amount)}</span>
                                                                    <span
                                                                        className="font-semibold text-amber-500 block">{formatRupiah(realPrice)}</span>
                                                                </>
                                                                :
                                                                <>
                                                                <span
                                                                    className="font-semibold text-amber-500">{formatRupiah(menu.price)}</span>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            </Ripples>

                                        </div>
                                    )
                                })
                            }
                        </>
                }
            </div>
        </>
    );
};

export default SearchResult;