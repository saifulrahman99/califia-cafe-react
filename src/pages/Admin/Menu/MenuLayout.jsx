import React from 'react';
import {Outlet} from "react-router-dom";

const MenuLayout = () => {
    return (
        <div>
            <Outlet/>
        </div>
    );
};

export default MenuLayout;