import { useCallback, useEffect, useRef } from 'react';

// Auto-advances a horizontally scroll-snapped row one card at a time, pausing whenever the
// visitor touches it - hovers, drags, scrolls, focuses a link inside, or uses the manual
// scroll buttons - and resuming a moment after they let go. Respects prefers-reduced-motion
// (no motion at all, since the content is still fully reachable via manual scrolling either way).
//
// Deliberately advances card-by-card via scrollTo() rather than nudging scrollLeft a pixel
// at a time - this row uses scroll-snap-mandatory, which immediately snaps any in-between
// scroll position back to the nearest card, so a smooth continuous drift would just get
// cancelled out every frame.
export function useAutoScrollRow({ interval = 3200 } = {}) {
  const ref = useRef(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const scheduleResume = useCallback((delay = 2500) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  }, []);

  const getStep = (el) => {
    const firstChild = el.children[0];
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '0') || 0;
    return firstChild ? firstChild.getBoundingClientRect().width + gap : el.clientWidth * 0.85;
  };

  // Exposed so a parent component can wire up manual prev/next buttons (including
  // press-and-hold repeat) against the same row + pause/resume behavior as autoplay.
  const scrollStep = useCallback(
    (direction) => {
      const el = ref.current;
      if (!el) return;
      pause();
      scheduleResume();
      const max = el.scrollWidth - el.clientWidth;
      const step = getStep(el);
      const target =
        direction === 'right' ? Math.min(el.scrollLeft + step, max) : Math.max(el.scrollLeft - step, 0);
      el.scrollTo({ left: target, behavior: 'smooth' });
    },
    [pause, scheduleResume]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const advance = () => {
      if (pausedRef.current || el.scrollWidth <= el.clientWidth) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }
      el.scrollTo({ left: Math.min(el.scrollLeft + getStep(el), max), behavior: 'smooth' });
    };

    const onPointerLeave = () => scheduleResume(800);
    const onPointerUp = () => scheduleResume();
    const onFocusOut = () => scheduleResume();
    const onWheel = () => {
      pause();
      scheduleResume();
    };

    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerleave', onPointerLeave);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', onPointerUp, { passive: true });
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', onFocusOut);
    el.addEventListener('wheel', onWheel, { passive: true });

    const tickId = setInterval(advance, interval);

    return () => {
      clearInterval(tickId);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      el.removeEventListener('pointerenter', pause);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', onPointerUp);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', onFocusOut);
      el.removeEventListener('wheel', onWheel);
    };
  }, [interval, pause, scheduleResume]);

  return { ref, scrollStep };
}
