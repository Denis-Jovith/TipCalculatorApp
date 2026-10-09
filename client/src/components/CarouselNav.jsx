import { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Press-and-hold repeat: a tap/click scrolls one card, holding down keeps scrolling until
// released. Implemented on pointer events alone (covers mouse + touch + pen) so we can
// preventDefault() on pointerdown and skip the browser's follow-up synthetic click -
// otherwise a quick tap would fire the step twice.
function useHoldToRepeat(onStep, { holdDelay = 350, repeatEvery = 200 } = {}) {
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }, []);

  const start = useCallback(() => {
    onStep();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(onStep, repeatEvery);
    }, holdDelay);
  }, [onStep, holdDelay, repeatEvery]);

  useEffect(() => stop, [stop]);

  return { start, stop };
}

function NavButton({ direction, onStep, label }) {
  const { start, stop } = useHoldToRepeat(onStep);

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        start();
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onStep();
        }
      }}
      className={`absolute top-1/2 -translate-y-1/2 ${
        direction === 'left' ? 'left-0 sm:-left-4' : 'right-0 sm:-right-4'
      } z-10 w-10 h-10 rounded-full flex items-center justify-center bg-surface/90 text-fg border border-surface-border shadow-sm hover:bg-surface-2 active:scale-95 transition-transform`}
    >
      {direction === 'left' ? (
        <ChevronLeft size={20} aria-hidden="true" />
      ) : (
        <ChevronRight size={20} aria-hidden="true" />
      )}
    </button>
  );
}

// Drop-in prev/next controls for a useAutoScrollRow-powered row. Sits absolutely inside a
// `relative` wrapper around the scroll row; hidden on touch-only layouts narrower than sm
// isn't necessary since the buttons don't block the row itself (they overlay its edges).
export default function CarouselNav({ scrollStep }) {
  return (
    <>
      <NavButton direction="left" label="Scroll left" onStep={() => scrollStep('left')} />
      <NavButton direction="right" label="Scroll right" onStep={() => scrollStep('right')} />
    </>
  );
}
