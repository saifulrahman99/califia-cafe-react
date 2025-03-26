import React from 'react';

const MenuDetailSkeleton = () => {
    return (
        <>
            <div className="content pb-25 select-none animate-pulse">
                <div
                    className="image aspect-video overflow-hidden flex flex-col justify-center items-center w-full bg-slate-200"></div>
                <div className="body px-4 mt-3 md:text-lg">
                    <span className="mb-4 w-2/3 h-4 rounded-lg bg-slate-200 block"></span>
                    <span className="mb-4 w-1/3 h-4 rounded-lg bg-slate-200 block"></span>
                    <span className="mb-4 w-full h-10 rounded-lg bg-slate-200 block"></span>

                    <div className="field-group mb-2 mt-4">
                        <span className="mb-4 w-1/3 h-4 rounded-lg bg-slate-200 block"></span>
                        <span className="mb-4 w-full h-7 rounded-lg bg-slate-200 block"></span>
                    </div>

                    <span className="mt-8 mb-4 w-1/3 h-4 rounded-lg bg-slate-200 block"></span>
                    <span className="mb-4 w-full h-10 rounded-lg bg-slate-200 block"></span>
                    <span className="mb-4 w-full h-10 rounded-lg bg-slate-200 block"></span>
                </div>
            </div>

            <div
                className="header fixed w-full max-w-md md:max-w-lg pt-3 pb-4 px-4 z-1 bg-white shadow border border-t-slate-200 border-x-0 border-b-0 flex items-center -bottom-12.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-t-lg animate-pulse"
            >
                <div className="w-1/3">
                    <span className="mb-4 w-full h-4 rounded-lg bg-slate-200 block"></span>
                    <div className="qty">
                        <div className="flex items-center gap-1">
                            <span className="mb-4 w-2/3 h-7 rounded-lg bg-slate-200 block"></span>
                        </div>
                    </div>
                </div>

                <div className="w-2/3 ms-4 flex flex-col">
                    <div>
                        <span className="mb-4 w-1/3 h-4 inline-block"></span>
                        <span className="mb-4 w-2/3 h-4 rounded-lg bg-slate-200 inline-block"></span>
                    </div>
                    <span className="mb-4 w-full h-7 rounded-lg bg-slate-200 block"></span>
                </div>
            </div>
        </>
    );
};

export default MenuDetailSkeleton;