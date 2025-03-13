import React from 'react';
import {Outlet} from "react-router-dom";
import Cart from "@pages/App/Home/components/Cart.jsx";
import {MyProvider} from "@/MyContext.jsx";

const AppLayout = () => {
    return (
        <>
            <div
                className="w-full max-w-md md:max-w-lg mx-auto border border-t-0 border-b-0 border-slate-200 bg-white overflow-visible min-h-screen">
                <MyProvider>
                    <Outlet/>
                </MyProvider>
                <Cart/>
            </div>
        </>
    );
};

export default AppLayout;