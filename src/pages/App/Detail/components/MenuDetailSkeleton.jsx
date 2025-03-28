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
                className="header fixed w-full max-w-md md:max-w-lg pt-3 pb-1 px-4 z-1 bg-white shadow border border-t-slate-200 border-x-0 border-b-0 flex items-center -bottom-15 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-t-lg animate-pulse flex-wrap"
            >
                <div className="w-1/3">
                    <span className="mb-4 w-full h-6 rounded-lg bg-slate-200 block"></span>
                </div>

                <div className="w-2/3 flex flex-col">
                    <div className={"text-end"}>
                        <span className="mb-4 w-2/3 h-4 rounded-lg bg-slate-200 inline-block"></span>
                    </div>
                </div>
                <div className="mb-4 w-full h-10 rounded-lg bg-slate-200 block"></div>
            </div>
        </>
    );
};

export default MenuDetailSkeleton;