import { Star, StarRing } from "@solar-icons/react";

interface RatingStarsProps {
    rating: number;
    showCount?: number;
    size?: number;
}

const RatingStars = ({ rating, showCount, size = 16 }: RatingStarsProps) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {/* Full stars */}
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Star
                        key={`full-${i}`}
                        size={size}
                        className="fill-gold text-gold"
                     weight="Outline"/>
                ))}
                {/* Half star */}
                {hasHalfStar && (
                    <StarRing
                        size={size}
                        className="fill-gold text-gold"
                     weight="Outline"/>
                )}
                {/* Empty stars */}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        size={size}
                        className="text-muted-foreground/30"
                     weight="Outline"/>
                ))}
            </div>
            {showCount !== undefined && (
                <span className="text-sm text-muted-foreground ml-1">
                    ({showCount})
                </span>
            )}
        </div>
    );
};

export default RatingStars;
