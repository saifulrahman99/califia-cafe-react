import React from 'react';
import {Outlet, Link} from "react-router-dom";
import {ToastContainer} from "react-toastify";

const AppLayout = () => {
    return (
        <div className="AppLayout bg-neutral-50">
            <div
                className="w-full max-w-md md:max-w-lg mx-auto border border-t-0 border-b-0 border-slate-200 bg-white overflow-visible min-h-screen">
                <Outlet/>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default AppLayout;