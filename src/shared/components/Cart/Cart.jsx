import React, {useContext} from 'react';
import {ShoppingBasket} from "lucide-react";
import Ripples from "react-ripples";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {MyContext} from "@/MyContext.jsx";
import {Link} from "react-router-dom";
import {calculateOrderTotalPrice} from "@/utils/calculateOrderTotalPrice.js";

const Cart = () => {
    const {cart} = useContext(MyContext);
    return (
        <div
            className="fixed z-1 -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
            <Ripples className="rounded-lg shadow-2xl shadow-slate-700 overflow-hidden">
                <Link to="/cart" className="flex justify-center">
                    <div className="col bg-white p-3">
                        <div className="realtive w-full">
                            <div
                                className="absolute top-2 ms-4 h-4 w-4 rounded-full text-white font-semibold bg-red-400 text-xs text-center">
                                <span>{cart.length}</span>
                            </div>
                            <ShoppingBasket size={30} className="text-primary"/>
                        </div>
                    </div>
                    <div
                        className="col flex items-center w-full bg-primary justify-center px-4 flex-1 min-w-30">
                        <span
                            className="font-bold text-white text-lg drop-shadow-[2px_2px_0px_gray] select-none">{formatRupiah(calculateOrderTotalPrice(cart))}</span>
                    </div>
                </Link>
            </Ripples>
        </div>
    );
};

export default Cart;