import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from './Lightbox.jsx';

// Auto-playing, pausable, keyboard-accessible crossfade carousel. Falls back to a plain
// <img> when there's nothing to cycle through. Pauses on hover/focus and for visitors
// with prefers-reduced-motion (WCAG 2.2.2 requires moving content to be pausable). Click any
// frame to open it full-screen via Lightbox.
export default function ImageCarousel({ images = [], alt = '', interval = 4000, className = '', imgClassName = '' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef(null);

  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (images.length < 2 || paused || lightboxOpen || reducedMotion) return undefined;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(timerRef.current);
  }, [images.length, paused, lightboxOpen, interval, reducedMotion]);

  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="cursor-zoom-in block w-full focus:outline-none"
          aria-label={`Enlarge ${alt || 'image'}`}
        >
          <img src={images[0]} alt={alt} className={`${className} ${imgClassName}`} />
        </button>
        <Lightbox src={lightboxOpen ? images[0] : null} alt={alt} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="absolute inset-0 w-full h-full cursor-zoom-in focus:outline-none"
        aria-label={`Enlarge image ${index + 1} of ${images.length}`}
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
      </button>

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

      <Lightbox
        src={lightboxOpen ? images[index] : null}
        alt={`${alt} (${index + 1} of ${images.length})`}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
