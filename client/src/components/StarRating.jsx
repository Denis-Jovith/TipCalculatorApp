import { Star } from 'lucide-react';

// Read-only display when `onChange` is omitted; an interactive 1-5 picker when provided.
export default function StarRating({ value = 0, onChange, size = 18 }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === 'function';

  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined} aria-label="Rating">
      {stars.map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            className="text-amber-600 dark:text-amber-400 hover:scale-110 transition-transform"
          >
            <Star size={size} fill={star <= value ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        ) : (
          <Star
            key={star}
            size={size}
            aria-hidden="true"
            className="text-amber-600 dark:text-amber-400"
            fill={star <= value ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        )
      )}
      {!interactive && <span className="sr-only">{value} out of 5 stars</span>}
    </div>
  );
}
