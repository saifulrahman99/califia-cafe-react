import React, {useContext} from 'react';
import {MyContext} from "@/MyContext.jsx";
import {formatRupiah} from "@/utils/formatCurrency.js";
import {calculateOrderTotalPrice} from "@/utils/calculateOrderTotalPrice.js";

const Checkout = () => {
    const {
        cart,
        setCart,
    } = useContext(MyContext);


    return (
        <>
            {
                cart.length > 0 && (
                    <div className="w-full fixed -bottom-3.5 py-3 left-0 text-slate-700">
                        <div
                            className="m-auto w-full max-w-md md:max-w-lg bg-white p-4 border border-b-0 border-slate-200 rounded-t-2xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.15)] flex justify-between items-center">
                            <div>
                                <span className="block text-lg font-semibold -mb-1">Total</span>
                                <span
                                    className="text-2xl font-bold">{formatRupiah(calculateOrderTotalPrice(cart))}</span>
                            </div>
                            <div>
                                <button
                                    className="btn-primary bg-primary py-2 px-6 text-lg font-semibold text-white rounded-lg shadow cursor-pointer">Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Checkout;