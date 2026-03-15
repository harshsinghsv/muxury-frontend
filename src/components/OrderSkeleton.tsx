import React from "react";

const OrderSkeleton = () => {
    return (
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 md:p-6 mb-4 md:mb-6">
            <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="flex flex-col gap-2 w-1/2">
                    {/* Order ID */}
                    <div className="h-6 bg-[#F5F0EE] animate-pulse rounded w-1/2" />
                    {/* Date */}
                    <div className="h-4 bg-[#EBEBEB] animate-pulse rounded w-1/3" />
                </div>
                {/* Status Pill */}
                <div className="h-8 w-24 bg-[#F5F0EE] animate-pulse rounded-full" />
            </div>
            
            <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-[#EBEBEB]">
                {/* Items count */}
                <div className="h-5 bg-[#EBEBEB] animate-pulse rounded w-16" />
                {/* Total */}
                <div className="h-7 bg-[#F5F0EE] animate-pulse rounded w-24" />
            </div>
        </div>
    );
};

export default OrderSkeleton;
