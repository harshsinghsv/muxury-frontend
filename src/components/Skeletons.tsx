import React from 'react';

/**
 * Page-level skeleton loaders for different content types
 */

export const PageSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4 md:space-y-6 px-5 md:px-12">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-5 md:p-6 space-y-3 animate-pulse">
        <div className="h-4 bg-[#EBEBEB] rounded w-3/4"></div>
        <div className="h-4 bg-[#EBEBEB] rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export const ProductGridSkeleton: React.FC<{ columns?: number }> = ({ columns = 2 }) => (
  <div className={`grid grid-cols-${columns} gap-4 md:gap-6 px-5 md:px-12`}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-[#EBEBEB] rounded-2xl h-[200px] md:h-[300px] mb-3"></div>
        <div className="h-4 bg-[#EBEBEB] rounded mb-2"></div>
        <div className="h-3 bg-[#EBEBEB] rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

export const CartItemSkeleton: React.FC = () => (
  <div className="flex gap-4 items-center bg-white p-5 md:p-6 rounded-2xl border border-[#EBEBEB] animate-pulse">
    <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] bg-[#EBEBEB] rounded-xl flex-shrink-0"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-[#EBEBEB] rounded w-full"></div>
      <div className="h-4 bg-[#EBEBEB] rounded w-3/4"></div>
      <div className="h-3 bg-[#EBEBEB] rounded w-1/2"></div>
    </div>
  </div>
);

export const OrderCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EBEBEB] space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-[#EBEBEB] rounded w-1/2"></div>
        <div className="h-3 bg-[#EBEBEB] rounded w-1/3"></div>
      </div>
      <div className="h-5 bg-[#EBEBEB] rounded-full w-20"></div>
    </div>
    <div className="h-px bg-[#EBEBEB]"></div>
    <div className="flex justify-between">
      <div className="h-4 bg-[#EBEBEB] rounded w-1/4"></div>
      <div className="h-4 bg-[#EBEBEB] rounded w-1/4"></div>
    </div>
  </div>
);

export default PageSkeleton;
