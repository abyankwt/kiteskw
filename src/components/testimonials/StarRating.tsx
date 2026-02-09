import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number; // 1-5
    size?: number;
    className?: string;
}

export function StarRating({ rating, size = 16, className }: StarRatingProps) {
    return (
        <div className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    size={size}
                    className={cn(
                        "transition-colors",
                        index < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                    )}
                />
            ))}
        </div>
    );
}
