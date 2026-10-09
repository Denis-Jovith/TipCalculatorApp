import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Auto-playing, pausable, keyboard-accessible crossfade carousel. Falls back to a plain
// <img> when there's nothing to cycle through. Pauses on hover/focus and for visitors
// with prefers-reduced-motion (WCAG 2.2.2 requires moving content to be pausable).
export default function ImageCarousel({ images = [], alt = '', interval = 4000, className = '', imgClassName = '' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (images.length < 2 || paused || reducedMotion) return undefined;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(timerRef.current);
  }, [images.length, paused, interval, reducedMotion]);

  if (!images.length) return null;

  if (images.length === 1) {
    return <img src={images[0]} alt={alt} className={`${className} ${imgClassName}`} />;
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt={`${alt} (${index + 1} of ${images.length})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 w-full h-full ${imgClassName}`}
        />
      </AnimatePresence>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show image ${i + 1} of ${images.length}`}
            aria-current={i === index}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
