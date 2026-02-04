const ProductSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />

            {/* Category skeleton */}
            <div className="h-3 w-16 bg-muted rounded mb-2" />

            {/* Name skeleton */}
            <div className="h-5 w-3/4 bg-muted rounded mb-2" />

            {/* Rating skeleton */}
            <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 w-4 bg-muted rounded" />
                ))}
            </div>

            {/* Price skeleton */}
            <div className="h-5 w-20 bg-muted rounded" />
        </div>
    );
};

export default ProductSkeleton;
