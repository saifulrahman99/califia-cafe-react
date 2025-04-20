import {useContext, useEffect, useState, Fragment} from 'react';
import {ChevronRight, ReceiptText, Search, Utensils} from "lucide-react";
import MenuList from "@pages/App/Home/components/MenuList.jsx";
import Ripples from 'react-ripples'
import {useSearchParams, Link} from "react-router-dom";
import Cart from "@shared/components/Cart/Cart.jsx";
import {MyContext} from "@/MyContext.jsx";
import {BrowserMultiFormatReader} from "@zxing/browser";
import {Dialog, Transition} from "@headlessui/react";

function Home() {
    const [searchParams] = useSearchParams();
    const {cart} = useContext(MyContext);
    const [orderType, setOrderType] = useState("TA");
    const [scrolling, setScrolling] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [tableNumber, setTableNumber] = useState(sessionStorage.getItem("tableNumber"));

    const handleOrderTypeChange = (e) => {
        if (e.target.value === "DI" && (sessionStorage.getItem("tableNumber") === null || searchParams.get("t") === "")) {
            setIsOpen(true);
            const codeReader = new BrowserMultiFormatReader();
            codeReader.decodeFromVideoDevice(undefined, "video", (res, err) => {
                if (res) {
                    window.location.href = res.text; // Redirect ke link
                }
                if (err) console.error(err);
            }).then((r) => {
                console.log(r)
            });

            return () => codeReader.reset();
        }
        sessionStorage.setItem("orderType", e.target.value);
        setOrderType(e.target.value);
    }

    useEffect(() => {
        const tableNum = searchParams.get("t");
        if (tableNum) sessionStorage.setItem("tableNumber", tableNum);
        setTableNumber(sessionStorage.getItem("tableNumber"));
    }, [searchParams]);

    useEffect(() => {
        setOrderType((sessionStorage.getItem("tableNumber") === null || searchParams.get("t") === "") ? "TA" : "DI");
        setOrderType(sessionStorage.getItem("orderType"));
        const handleScroll = () => {
            if (window.scrollY > 60) {
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

    return (
        <>
            {(cart.length > 0) && <Cart/>}
            <div
                className={`header fixed w-full max-w-md md:max-w-lg top-7 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-2 px-4 z-5 transition-all duration-150 ${scrolling ? 'bg-white shadow' : 'bg-transparent'}`}
            >
                <div className="float-end">
                    <Ripples className="bg-white rounded-full hover:cursor-pointer inline me-3">
                        <Link to={"/search"} className="outline-none p-2">
                            <Search strokeWidth={1} size={25}
                                    className="search-button"/>
                        </Link>
                    </Ripples>
                    <Ripples className="bg-white rounded-full hover:cursor-pointer inline">
                        <Link to={"/invoice"} className="outline-none p-2">
                            <ReceiptText strokeWidth={1} size={25}
                                         className="invoice-button"/>
                        </Link>
                    </Ripples>
                </div>
            </div>

            <div className="w-full bg-slate-50 pb-4 select-none">

                <div className="h-54 bg-slate-50 w-full rounded-b-xl overflow-hidden">
                    <img src="/brand.jpg" alt="brand"/>
                </div>

                <div
                    className="bg-white text-slate-600 border border-slate-200 mx-4 rounded-xl relative top-minus-1 mb-minus-1 select-none overflow-hidden cursor-pointer">
                    <Ripples className={"w-full"}>
                        <Link to={"about"} className={" flex flex-1 justify-between items-center p-4"}>

                        <div className="w-2/3">
                            <h1 className="text-lg font-bold mb-3 text-primary">Califia | Food & Beverage</h1>
                            <p className="text-sm text-gray-600">Jam Buka, 08:00 - 21:00</p>
                        </div>
                        <div className="w-1/3 flex justify-end">
                            <ChevronRight strokeWidth={1.5} size={25}/>
                        </div>
                        </Link>
                    </Ripples>
                </div>

                <div
                    className="bg-white text-slate-600 border border-slate-200 mx-4 p-4 rounded-xl flex justify-between flex-wrap">
                    <div className="col">Tipe Pemesanan</div>
                    <div className="col">
                        <select
                            name="OrderType"
                            id="OrderType"
                            value={orderType}
                            onChange={handleOrderTypeChange}
                            className="border border-slate-300 text-slate-800 font-semibold px-5 py-1 rounded-lg text-xs hover:cursor-pointer focus:outline-none"
                        >
                            <option value="TA">Take Away</option>
                            <option value="DI">Dine-In</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <hr className="border-slate-300 my-2 py-2"/>
                        <Utensils size={16} className="inline mb-1 me-1"/>
                        <span className="text-md font-bold">
                                {orderType === "DI" ? "Makan di Tempat" : "Dibawa Pulang"}
                            </span>
                        <div
                            className="float-right font-bold text-md">{((tableNumber !== "null" && tableNumber != null) && orderType !== "TA" && orderType !== null) && `Meja ${tableNumber}`}</div>
                    </div>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div"
                        className="fixed inset-0 flex items-center justify-center z-50 max-w-md md:max-w-lg mx-auto select-none"
                        onClose={() => setIsOpen(true)} unmount={false}>
                    {/* Background overlay */}
                    <Transition.Child
                        as="div"
                        className="absolute inset-0 z-0 bg-black/30 bg-opacity-50"
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    />

                    {/* Modal Container */}
                    <Transition.Child
                        as="div"
                        className="w-full px-8 max-w-md md:max-w-lg mx-auto"
                        enter="transition-transform transition-opacity duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition-transform transition-opacity duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative z-1 h-min-60">
                            {/* Title */}
                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                Scan QR
                            </Dialog.Title>

                            {/* Message */}
                            <p className="my-2 text-gray-600">Silahkan Arahkan Kamera Ke Kode QR</p>
                            <video id="video" className="w-full h-min-60"/>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>

            <MenuList/>
        </>
    );
}

export default Home;
