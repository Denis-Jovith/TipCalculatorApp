import { useEffect, useRef, useState } from 'react';

// Keeps a loading screen visible for at least `minMs` after mount, even if the underlying
// data resolves sooner - so a fast connection doesn't clip the boot animation mid-flight
// before it's readable. Never adds delay beyond what a slow connection already imposes:
// once minMs has passed, it flips true the instant isDataReady does too.
export function useMinLoadingTime(isDataReady, minMs = 2800) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const remaining = minMs - (Date.now() - startRef.current);
    const timer = setTimeout(() => setMinTimeElapsed(true), Math.max(remaining, 0));
    return () => clearTimeout(timer);
  }, [minMs]);

  return isDataReady && minTimeElapsed;
}
