export default function BrandMark({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="DJB logo"
      className={className}
    >
      <defs>
        <linearGradient id="djb-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#e2e8f0" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="75%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="djb-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <radialGradient id="djb-glow" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.65" />
          <stop offset="60%" stopColor="#1d4ed8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="djb-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="djb-edge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="200" height="200" rx="44" fill="#04050f" />
      <rect width="200" height="200" rx="44" fill="none" stroke="url(#djb-edge)" strokeWidth="1.5" opacity="0.7" />
      <circle cx="100" cy="88" r="88" fill="url(#djb-glow)" />

      <g
        transform="translate(100 122) skewX(-9)"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="102"
        textAnchor="middle"
        letterSpacing="-4"
      >
        <text x="-56" y="0" fill="url(#djb-chrome)">D</text>
        <text x="3" y="0" fill="url(#djb-blue)">J</text>
        <text x="58" y="0" fill="url(#djb-chrome)">B</text>
      </g>
      <g
        transform="translate(100 122) skewX(-9)"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="102"
        textAnchor="middle"
        letterSpacing="-4"
        opacity="0.8"
      >
        <text x="-56" y="0" fill="url(#djb-sheen)">D</text>
        <text x="58" y="0" fill="url(#djb-sheen)">B</text>
      </g>

      <path d="M 38 150 L 54 150 L 38 168 Z" fill="url(#djb-blue)" opacity="0.9" />
      <rect x="46" y="156" width="108" height="4" rx="2" fill="url(#djb-blue)" opacity="0.9" />
    </svg>
  );
}
