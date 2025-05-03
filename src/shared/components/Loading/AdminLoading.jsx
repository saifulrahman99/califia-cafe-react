import React from 'react';
import Lottie from "lottie-react";
import animationLoading from "@assets/lottie/loading.json";

const AdminLoading = ({isOpen, isLoading}) => {
    return (
        <>
            <div
                className={`bg-black/30 fixed inset-0 flex justify-center items-center -z-1 w-full transition-opacity duration-300 ${isOpen ? 'opacity-100 z-99' : 'opacity-0'}`}>
                <div
                    className={`w-40 h-40 bg-white/95 rounded-xl transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
                    <Lottie
                        animationData={animationLoading}
                        loop={true}
                    />
                    <span className="font-semibold block relative -top-10 text-center text-slate-700">Loading</span>
                </div>
            </div>
        </>
    );
};

export default AdminLoading;