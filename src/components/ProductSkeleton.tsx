const ProductSkeleton = () => {
    return (
        <div className="group flex flex-col pt-1">
            {/* Image Placeholder */}
            <div className="w-full aspect-[3/4] bg-[#F5F0EE] animate-pulse rounded-2xl mb-4" />
            
            {/* Brand / Name Placeholder */}
            <div className="h-4 bg-[#EBEBEB] animate-pulse rounded w-3/4 mb-2" />
            
            {/* Price Placeholder */}
            <div className="h-4 bg-[#EBEBEB] animate-pulse rounded w-1/4 mt-1" />
        </div>
    );
};

export default ProductSkeleton;
