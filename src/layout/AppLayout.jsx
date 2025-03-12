import React from 'react';
import {Outlet} from "react-router-dom";
import Cart from "@pages/App/Home/components/Cart.jsx";

const AppLayout = () => {
    return (
        <>
            <div
                className="w-full max-w-md md:max-w-lg mx-auto border border-t-0 border-b-0 border-slate-200 bg-white overflow-hidden">
                <Outlet/>
                <Cart/>
            </div>
        </>
    );
};

export default AppLayout;