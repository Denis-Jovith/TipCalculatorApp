// lucide-react doesn't ship TikTok or Threads glyphs (they were dropped as brand marks), so
// these fill the gap — drawn in the same 24x24 / stroke-based style as the rest of the icon
// set so they blend in rather than looking like a fallback.

export function TikTokIcon({ size = 24, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function ThreadsIcon({ size = 24, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3c-4 0-7 2.5-7 7.5S8.5 21 12.5 21c3 0 5-1.3 5-3.6 0-2-1.6-3-3.6-3.1-2.3-.1-3.9.9-3.9 2.5 0 1 .8 1.7 2 1.7" />
      <path d="M9 10.5c0-2 1.3-3 3.3-3 2.4 0 3.7 1.4 3.7 3.8v1" />
    </svg>
  );
}
