/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          violet: '#421fdf',
          blue: '#0c22de',
          olive: '#6B8E23',
          teal: '#4FA8A8',
          cream: '#F1E7D0'
        },
        // Semantic tokens backed by CSS variables (see index.css) so the same
        // utility classes render correctly in both light and dark mode.
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-border': 'var(--surface-border)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        faint: 'var(--faint)'
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', '"Space Grotesk"', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #421fdf 0%, #0c22de 100%)',
        // The hero stays a fixed bold band (white text always) in both themes — a pale
        // light-mode gradient here would fail contrast against the white heading text. The
        // deep indigo is now the default (shown on first load / light theme); switching to
        // dark mode swaps in a distinct deep teal-cyan mood (echoes brand-teal + the DJB
        // logo's signal blue) so the theme toggle visibly changes the hero too.
        'brand-gradient-radial': 'radial-gradient(circle at 20% 20%, #2a1868 0%, #0a1442 55%, #030712 100%)',
        'brand-gradient-radial-dark': 'radial-gradient(circle at 20% 20%, #0f6e6e 0%, #0a2a3d 55%, #030712 100%)'
      },
      boxShadow: {
        glow: '0 0 40px rgba(66, 31, 223, 0.45)'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' }
        }
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 55s linear infinite',
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 12s infinite'
      }
    }
  },
  plugins: []
};
