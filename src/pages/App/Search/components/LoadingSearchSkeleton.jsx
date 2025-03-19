import React from 'react';

const LoadingSearchSkeleton = () => {
    return (
        <div className="pt-20 px-6 min-h-screen">
            <span className="h-4 w-1/2 block bg-slate-200 rounded-lg mt-3"></span>
            {
                new Array(6).fill(null).map((_, index) => (
                    <div key={index}
                         className="w-full rounded-lg py-4 flex border-b border-slate-200 animate-pulse"
                    >
                        <div
                            className="img w-50 sm:w-30 aspect-square bg-slate-200 rounded-lg overflow-hidden">
                        </div>
                        <div className="body ms-4 relative w-md">
                            <span
                                className="h-4 w-1/2 bg-slate-200 block rounded-lg mt-2"></span>

                            <div className="absolute bottom-0 left-0 w-70 md:w-90">
                                <span
                                    className="h-4 w-1/3 bg-slate-200 block mb-2 rounded-lg"></span>
                                <span
                                    className="h-4 w-1/3 bg-slate-200 block rounded-lg"></span>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default LoadingSearchSkeleton;