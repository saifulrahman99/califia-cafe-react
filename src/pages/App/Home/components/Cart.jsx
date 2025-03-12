import React from 'react';
import {ShoppingBasket} from "lucide-react";
import Ripples from "react-ripples";

const Cart = () => {
    return (
        <div className="fixed z-1 -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer flex justify-center items-center">
            <Ripples className="rounded-lg shadow overflow-hidden">
                <div className="col bg-white p-3">
                    <div className="realtive w-full">
                        <div
                            className="absolute top-2 ms-4 h-4 w-4 rounded-full text-white font-semibold bg-red-400 text-xs text-center">3
                        </div>
                        <ShoppingBasket size={30} className="text-primary"/>
                    </div>
                </div>
                <div
                    className="col flex items-center w-full bg-primary text-center px-4">
                        <span
                            className="font-bold text-white text-lg drop-shadow-[2px_2px_0px_gray] select-none">Rp12.000</span>
                </div>
            </Ripples>
        </div>
    );
};

export default Cart;