import {useContext, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import MenuService from "@services/menuService.js";
import {MinusIcon, PlusIcon, Undo2} from "lucide-react";
import {replaceLocalhostWithServerHost} from "@/utils/repllaceHostLocalToHostServer.js";
import {capitalizeWords} from "@/utils/capitalWords.js";
import {formatRupiah} from "@/utils/formatCurrency.js";
import ToppingService from "@services/toppingService.js";
import {MyContext} from "@/context/MyContext.jsx";
import MenuDetailSkeleton from "@pages/App/Detail/components/MenuDetailSkeleton.jsx";

const MenuDetail = () => {
    const {id} = useParams();
    const menuService = useMemo(() => MenuService(), []);
    const toppingService = useMemo(() => ToppingService(), []);
    const [scrolling, setScrolling] = useState(false);
    const [menu, setMenu] = useState({});
    const [toppings, setToppings] = useState([]);
    const navigate = useNavigate();
    const {addToCart, isLoading, setIsLoading, showToast} = useContext(MyContext);
    const [realPrice, setRealPrice] = useState(0);
    const [menuQty, setMenuQty] = useState(1);
    const [orderTotalPrice, setOrderTotalPrice] = useState(0);
    const [toppingCarts, setToppingCarts] = useState([]);
    const [note, setNote] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            menuId: id,
            name: menu.name,
            price: realPrice,
            qty: menuQty,
            note: note,
            stock: menu.stock,
            type: menu.type,
            toppingEnabled: menu.topping_enabled
        }, toppingCarts);
        setIsOpen(!isOpen);
        showToast("success", "Berhasil Ditambahkan", 1000);
        setTimeout(() => handleGoBack(), 1800);
    }

    const handleModifyToppingCart = (topping, qty) => {
        const toppingCart = toppingCarts.find((item) => item.id === topping.id);
        // setOrderTotalPrice();
        if (toppingCart != null) {
            // remove topping
            if (qty < 1) {
                setToppingCarts(toppingCarts.filter(item => item.id !== topping.id));
                return
            }
            // update topping
            setToppingCarts(toppingCarts.map((item) => {
                return item.id === topping.id ? {
                    ...item,
                    name: topping.name,
                    qty: qty,
                    price: topping.price,
                    stock: topping.stock
                } : item
            }));
        } else {
            // add topping
            setToppingCarts([...toppingCarts, {
                id: topping.id,
                name: topping.name,
                qty: qty,
                price: topping.price,
                stock: topping.stock
            }]);
        }
    }

    const handleModifyQtyMenu = (qty) => {
        setMenuQty(qty);
        setOrderTotalPrice(qty * realPrice);
    }
    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate("/"); // Fallback ke halaman utama
        }
    };
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolling(true); // Ubah warna jika scroll > 50px
            } else {
                setScrolling(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, []);

    useEffect(() => {
        setIsLoading(!isLoading);
        const getMenu = async () => {
            try {
                const data = await menuService.getById(id);
                setMenu(data.data);
                const realPrice = data.data.discount != null ? data.data.price - data.data.discount.amount : data.data.price;
                setRealPrice(realPrice);
                setOrderTotalPrice(realPrice);
            } catch (e) {
                console.log(e.message);
            }
        }

        const getToppings = async () => {
            try {
                const data = await toppingService.getAll();
                const type = (menu.type !== "beverage") ? ["food", "snack"] : ["beverage"];
                setToppings(data.data.filter(item => type.includes(item.type)));
            } catch (e) {
                console.log(e.message);
            }
            setIsLoading(false);
        }
        getMenu().then(getToppings);
    }, [menuService, toppingService]);

    return (
        <>
            <div
                className={`bg-black/30 fixed inset-0 z-0 w-full max-w-md md:max-w-lg m-auto transition-opacity duration-300 ${isOpen ? 'opacity-100 z-4' : 'opacity-0'}`}/>
            <div
                className={`header fixed w-full max-w-md md:max-w-lg py-2 px-4 z-2 flex items-center top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${scrolling ? 'bg-white shadow' : 'bg-transparent'}`}
            >
                <div
                    onClick={handleGoBack}
                    className={`p-1 me-3 cursor-pointer rounded-full bg-white`}>
                    <Undo2 size={25} strokeWidth={1.2}/>
                </div>
            </div>

            {isLoading ? <MenuDetailSkeleton/> :
                <>
                    <div className={`content pb-40 select-none relative z-1 ${menu.stock < 1 && "grayscale"}`}>
                        {menu.stock < 1 && <div className="absolute inset-0 z-1"></div>}
                        <div className="image aspect-video overflow-hidden flex flex-col justify-center items-center">
                            <img src={replaceLocalhostWithServerHost(menu.image)} alt={menu.name} className="w-full"/>
                        </div>
                        <div className="body px-4 mt-3 text-slate-700 md:text-lg">
                            <h1 className="text-2xl font-semibold text-slate-700 mb-1">{capitalizeWords(menu.name)}</h1>
                            {menu.discount != null ?
                                <>
                            <span
                                className="inline-block line-through me-1 text-slate-600">{formatRupiah(menu.price)}</span>
                                    <span
                                        className="text-xs text-white bg-red-400 rounded-md p-1 px-2 font-medium">- {formatRupiah(menu.discount.amount)}</span>
                                    <span
                                        className="text-xl font-bold text-amber-500 block my-1">{formatRupiah(realPrice)}</span>
                                </>
                                :
                                <>
                            <span
                                className="text-xl font-bold text-amber-500 block my-1">{formatRupiah(realPrice)}</span>
                                </>
                            }
                            <p className="text-justify">{menu.description}</p>

                            <div className="field-group mb-2 mt-4">
                                <label htmlFor="catatan" className="block font-semibold mb-2">Catatan <span
                                    className="font-medium text-sm">(Opsional)</span></label>
                                <textarea name="note" id="catatan"
                                          onChange={(e) => setNote(e.target.value)}
                                          className="outline-none w-full min-h-20 border border-slate-300 rounded-lg px-3 py-1"
                                          placeholder="contoh: sedikit garam"></textarea>
                            </div>

                            {menu.topping_enabled ? (
                                <div className="list-toppings">
                                    <span className="block text-lg font-semibold mb-2">Topping</span>
                                    {toppings.map((topping, index) => {
                                        // cek apakah ada di toppingCarts, jika ada munuclkan qty
                                        const toppingItem = toppingCarts.find((item) => item.id === topping.id);
                                        let itemQty = (toppingItem != null) ? toppingItem.qty : 0;
                                        return (
                                            <div key={index}
                                                 className={`w-full mb-2 p-2 border border-slate-200 rounded-lg flex justify-between items-center shadow ${topping.stock < 1 && "grayscale"}`}>
                                                <div className="name">
                                                    <span className="block">{capitalizeWords(topping.name)}</span>
                                                    <span
                                                        className="block font-semibold">{formatRupiah(topping.price)}</span>
                                                </div>
                                                {toppingItem != null ? (
                                                    <div className="qty">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    handleModifyToppingCart(topping, itemQty - 1)
                                                                    setOrderTotalPrice(orderTotalPrice + (-1 * topping.price))
                                                                }}
                                                                type="button"
                                                                className={`text-gray-600 transition hover:bg-slate-100 rounded-full p-2 border border-slate-200 cursor-pointer active:bg-slate-200`}>
                                                                <MinusIcon strokeWidth={1.5} size={16}/>
                                                            </button>

                                                            <input
                                                                type="number"
                                                                id="Quantity"
                                                                value={toppingItem.qty}
                                                                min="0"
                                                                className="h-10 w-10 text-slate-500 border-gray-200 mx-2 text-center sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none focus:outline-none cursor-default select-none"
                                                                readOnly={true}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    handleModifyToppingCart(topping, itemQty + 1)
                                                                    setOrderTotalPrice(orderTotalPrice + (1 * topping.price))
                                                                }}
                                                                type="button"
                                                                disabled={itemQty >= topping.stock}
                                                                className={`text-gray-600 transition hover:bg-slate-100 rounded-full p-2 border border-slate-200 active:bg-slate-200 ${itemQty < topping.stock ? 'cursor-pointer' : 'cursor-no-drop'}`}>
                                                                <PlusIcon strokeWidth={1.5} size={16}/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {topping.stock < 1 ?
                                                            <span
                                                                className="text-slate-500 font-semibold text-xs"> Habis</span> :
                                                            <button
                                                                onClick={() => {
                                                                    handleModifyToppingCart(topping, itemQty + 1)
                                                                    setOrderTotalPrice(orderTotalPrice + (1 * topping.price))
                                                                }}
                                                                className="px-2 py-1 btn-primary bg-primary rounded-lg text-white cursor-pointer shadow flex items-center text-sm">
                                                                <PlusIcon strokeWidth={1}/> Tambah
                                                            </button>
                                                        }
                                                    </>
                                                )}

                                            </div>
                                        )
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div
                        className={`header fixed w-full max-w-md md:max-w-lg ${menu.stock < 1 ? "pb-5 grayscale" : "pb-3"} pt-2 px-4 z-1 bg-white border border-t-slate-200 border-x-0 border-b-0 flex items-center flex-wrap -bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-t-2xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.15)]`}
                    >
                        <div className="qty text-slate-700 w-1/2 mt-2 mb-4">
                            {menu.stock < 1 ?
                                <span className="text-slate-500 font-semibold block">Habis</span> :
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleModifyQtyMenu(menuQty - 1)}
                                        disabled={menuQty < 2}
                                        type="button"
                                        className={`text-gray-600 transition hover:bg-slate-100 rounded-full p-2 border border-slate-200 ${menuQty > 1 ? 'cursor-pointer' : 'cursor-no-drop'} active:bg-slate-200`}>
                                        <MinusIcon strokeWidth={1.5} size={16}/>
                                    </button>

                                    <input
                                        type="number"
                                        id="Quantity"
                                        value={menuQty}
                                        min="1"
                                        className="h-10 w-5 text-slate-500 border-gray-200 mx-2 text-center font-semibold [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none focus:outline-none cursor-default select-none"
                                        readOnly={true}
                                    />
                                    <button
                                        onClick={() => handleModifyQtyMenu(menuQty + 1)}
                                        disabled={menuQty >= menu.stock}
                                        type="button"
                                        className={`text-gray-600 transition hover:bg-slate-100 rounded-full p-2 border border-slate-200 ${menuQty < menu.stock ? 'cursor-pointer' : 'cursor-no-drop'} active:bg-slate-200`}>
                                        <PlusIcon strokeWidth={1.5} size={16}/>
                                    </button>

                                </div>
                            }
                        </div>
                        <div className="block w-1/2">
                            <span
                                className="inline-block font-bold mb-2 text-xl text-end w-full text-slate-600"> Total: {formatRupiah(orderTotalPrice)}</span>
                        </div>
                        {menu.stock < 1 ?
                            <button
                                className="btn-primary w-full bg-primary font-semibold text-white py-2 rounded-md cursor-not-allowed shadow text-lg">Tambah
                                Pesanan
                            </button>
                            :
                            <button
                                onClick={handleAddToCart}
                                className="btn-primary w-full bg-primary font-semibold text-white py-2 rounded-md cursor-pointer shadow text-lg">Tambah
                                Pesanan
                            </button>

                        }
                    </div>
                </>
            }

        </>
    );
};

export default MenuDetail;