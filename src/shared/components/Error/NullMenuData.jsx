import React from 'react';
import noData from '@assets/images/no-data.svg';

const NullMenuData = () => {
    return (
        <div className="col-span-2 text-center">
            <img
                className="img-fluid mb-2 max-w-60 mt-12 block m-auto"
                src={noData}
                alt="tidak ada menu tersedia"
            />
            <span className="text-slate-700 font-semibold">Tidak Ada Menu Tersedia</span>
        </div>
    );
};

export default NullMenuData;