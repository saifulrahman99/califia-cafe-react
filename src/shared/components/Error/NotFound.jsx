import React from 'react';
import notFound from '@assets/images/page-not-found.svg';
import {Link} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import Ripples from "react-ripples";

const NotFound = () => {
    return (
        <>
            <div
                className="w-full h-150 max-w-md md:max-w-lg mx-auto bg-white overflow-hidden text-center">
                <img
                    className="img-fluid mb-2 max-w-80 m-auto mt-40"
                    src={notFound}
                    alt="page not found"
                />
                <Ripples>
                    <Link to={"/"} className="bg-slate-100 p-2 px-4 rounded-xl text-slate-500">
                        <ArrowLeft strokeWidth={1} size={25} className="inline"/> Kembali
                    </Link>
                </Ripples>
            </div>
        </>
    );
};

export default NotFound;