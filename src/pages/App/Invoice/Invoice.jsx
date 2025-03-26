import React from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import {Undo2} from "lucide-react";

const Invoice = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate("/"); // Fallback ke halaman utama
        }
    };
    return (
        <>
            <div
                className={`header fixed w-full max-w-md md:max-w-lg py-2 px-4 z-1 flex items-center top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 bg-white shadow`}
            >
                <div
                    onClick={handleGoBack}
                    className={`p-1 me-3 cursor-pointer rounded-full bg-white`}>
                    <Undo2 size={25} strokeWidth={1.2}/>
                </div>
            </div>

            <div className="py-15 px-4">
                <Outlet/>
            </div>
        </>
    );
};

export default Invoice;