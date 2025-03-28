import React from 'react';

const InvoiceDetailSkeleton = () => {
    return (
        <>
            <div className="col-span-2 block h-4 w-1/2 bg-slate-200 rounded-lg my-4 animate-pulse m-auto"></div>
            <div className="w-1/3 h-4 bg-slate-200 my-4 rounded-lg"></div>
            {new Array(6).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse mb-4">
                    <div
                        className="col border border-slate-200 shadow rounded-lg overflow-hidden w-full p-3 relative">
                        <div className="w-1/2 h-4 bg-slate-200 mb-2 rounded-lg"></div>

                        <span className="inline-block me-1 mb-2 h-4 w-1/3 rounded-lg bg-slate-200"></span>
                        <span className="block my-1 h-4 w-1/3 rounded-lg bg-slate-200"></span>
                        <span className="block my-1 h-4 w-1/3 rounded-lg bg-slate-200 mb-4"></span>
                        <hr className={"border-slate-200 mb-4"}/>
                        <span className="block my-1 h-4 w-1/4 rounded-lg bg-slate-200 m-auto"></span>
                        <span className="block my-1 h-4 w-1/4 rounded-lg bg-slate-200 absolute top-2 right-3"></span>
                        <span
                            className="block my-1 h-4 w-1/4 rounded-lg bg-slate-200 absolute bottom-12 right-3"></span>
                    </div>
                </div>
            ))}
        </>
    );
};

export default InvoiceDetailSkeleton;