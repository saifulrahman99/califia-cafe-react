import React from 'react';
import {NavLink, Outlet} from "react-router-dom";

const Category = () => {
    return (
        <div>
            <div className="px-4 py-2 font-semibold w-full bg-white rounded mb-4 border border-slate-200">
                <h1 className="block font-semibold text-lg">Kategori</h1>
            </div>
            <Outlet/>
        </div>
    );
};

export default Category;