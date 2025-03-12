import {useEffect, useState} from 'react';
import {ReceiptText, Search, Utensils} from "lucide-react";
import MenuList from "@pages/App/Home/components/MenuList.jsx";
import Ripples from 'react-ripples'
import {Link, useSearchParams} from "react-router-dom";

function Home() {
    const [orderType, setOrderType] = useState("DI");
    const [searchParams] = useSearchParams();
    const table = searchParams.get("t");
    const [scrolling, setScrolling] = useState(false);

    const handleOrderTypeChange = (e) => {
        setOrderType(e.target.value);
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
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
            <div
                className={`header fixed w-full max-w-md md:max-w-lg py-2 px-4 z-1 transition-all duration-300 ${scrolling ? 'bg-white shadow' : 'bg-transparent'}`}
            >
                <div className="float-end">
                    <Ripples className="bg-white p-2 rounded-full hover:cursor-pointer inline me-3">
                        <Link to={"/search"}>
                            <Search strokeWidth={1} size={25}
                                    className="search-button"/>
                        </Link>
                    </Ripples>
                    <Ripples className="bg-white p-2 rounded-full hover:cursor-pointer inline">
                        <ReceiptText strokeWidth={1} size={25}
                                     className="invoice-button"/>
                    </Ripples>
                </div>
            </div>

            <div className="w-full bg-slate-50 pb-4 select-none">

                <div className="h-54 bg-slate-50 w-full rounded-b-xl overflow-hidden">
                    <img src="/brand.jpg" alt="brand"/>
                </div>

                <div
                    className="bg-white text-slate-600 border border-slate-200 mx-4 p-4 rounded-xl relative top-minus-1 mb-minus-1 select-none">
                    <h1 className="text-md font-bold mb-3 text-primary">Califia Cafe</h1>
                    <p className="text-sm text-gray-600">
                        Jam Buka, 08:00 - 21:00
                    </p>
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
                            <option value="DI">Dine-In</option>
                            <option value="TA">Take Away</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <hr className="border-slate-300 my-2 py-2"/>
                        <Utensils size={16} className="inline mb-1 me-1"/>
                        <span className="text-md font-bold">
                                {orderType === "DI" ? "Makan di Tempat" : "Dibawa Pulang"}
                            </span>
                        <div
                            className="float-right font-bold text-md">{((table != null && table !== '') && orderType !== "TA") && `Meja ${table}`}</div>
                    </div>
                </div>
            </div>

            <MenuList/>
        </>
    );
}

export default Home;
