import {useContext, useEffect, useMemo, useState} from 'react';
import MenuService from "@services/menuService.js";
import NullMenuData from "@shared/components/Error/NullMenuData.jsx";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {replaceLocalhostWithServerHost} from "@/utils/repllaceHostLocalToHostServer.js";
import Ripples from "react-ripples";
import {MyContext} from "@/MyContext.jsx";
import LoadingSearchSkeleton from "@pages/App/Search/components/LoadingSearchSkeleton.jsx";
import {Link} from "react-router-dom";

const SearchResult = ({search}) => {
    const {isLoading, setIsLoading} = useContext(MyContext);
    const [recommendMenus, setRecommendMenus] = useState([]);
    const menuService = useMemo(() => MenuService(), []);

    useEffect(() => {
        const getRecommendMenus = async () => {
            setIsLoading(!isLoading);
            try {
                const data = (search === "") ? await menuService.getRecommendable() : await menuService.getAll({q: search});
                setRecommendMenus(data.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getRecommendMenus().then(() => {
            setIsLoading(false);
        });
    }, [menuService, search]);
    return (
        <>
            {isLoading ? <LoadingSearchSkeleton/> :
                <div className="p-5 pt-22 w-full pb-15 select-none">
                    {search === "" ? <span className="font-semibold text-xl">Menu Rekomendasi</span> : null}
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
                                                 className={`w-full py-2 border-b border-slate-200 relative ${menu.stock < 1 ? "grayscale cursor-not-allowed" : "cursor-pointer"}`}
                                            >
                                                {menu.stock < 1 && <div className="absolute inset-0 z-2"></div>}
                                                <Ripples className="rounded-lg w-full">
                                                    <Link to={`/menu/${menu.id}`} className="w-full py-2 flex">
                                                        <div
                                                            className="img min-w-10 max-w-25 bg-slate-50 rounded-lg
                                                      overflow-hidden relative">
                                                            {menu.stock < 1 && <div className="absolute inset-0 flex justify-center items-center text-white font-bold rounded-full bg-black/50 m-4">Habis</div>}
                                                            <img src={replaceLocalhostWithServerHost(menu.image)}
                                                                 alt={menu.name}
                                                                 className="w-50 aspect-square"/>
                                                        </div>
                                                        <div
                                                            className=" body ms-4 w-max-md text-wrap flex flex-col
                                                      justify-between"
                                                            style={{flex: 1}}
                                                        >
                                                            <span
                                                                className=" font-semibold text-lg">{capitalizeWords(menu.name)}</span>
                                                            <div className=" price">
                                                                {
                                                                    menu.discount != null ?
                                                                        <>
                                                                 <span
                                                                     className=" text-sm inline line-through me-1
                                                      text-slate-600">{formatRupiah(menu.price)}</span>
                                                                            <span
                                                                                className=" text-xs text-white
                                                      bg-red-400 rounded-md p-0.5 px-2 font-medium">- {formatRupiah(menu.discount.amount)}</span>
                                                                            <span
                                                                                className=" font-semibold text-amber-500
                                                      block">{formatRupiah(realPrice)}</span>
                                                                        </>
                                                                        :
                                                                        <>
                                                                <span
                                                                    className=" font-semibold text-amber-500">{formatRupiah(menu.price)}</span>
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </Ripples>
                                            </div>
                                        )
                                    })
                                }
                            </>
                    }
                </div>
            }
        </>
    );
};

export default SearchResult;