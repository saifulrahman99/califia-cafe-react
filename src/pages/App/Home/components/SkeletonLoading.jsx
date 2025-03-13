import React from 'react';

const SkeletonLoading = () => {
    return (
        <>
            <div
                className="col-span-2 block h-4 w-1/2 bg-slate-200 rounded-lg mt-2"
            >
            </div>
            {new Array(6).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div
                        className="col border border-slate-200 rounded-lg overflow-hidden w-full">
                        <div className="w-full aspect-square bg-slate-200">
                        </div>

                        <div className="body py-2 px-3">
                            <span className="mb-4 w-full h-4 rounded-lg bg-slate-200 block"></span>
                            <span className="inline-block me-1 h-4 w-1/2 rounded-lg bg-slate-200"></span>
                            <span className="block my-1 h-4 w-1/2 rounded-lg bg-slate-200"></span>

                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default SkeletonLoading;
