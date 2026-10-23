import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({
  rating = 0,
  maxRating = 5,
  size = 'w-4 h-4',
  interactive = false,
  onChange = () => {},
}) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(starValue)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'
            }`}
          >
            <Star
              className={`${size} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
