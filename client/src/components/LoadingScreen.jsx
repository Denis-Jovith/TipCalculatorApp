import { motion } from 'framer-motion';

const LINES = ["Denis Jovitus Buberwa's", 'Portfolio'];

const letterVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

// Full-screen branded boot animation - shown while the first batch of portfolio data is
// still in flight, so visitors get something alive instead of a blank flash or plain text.
export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex flex-col items-center justify-center gap-6 bg-brand-gradient-radial dark:bg-brand-gradient-radial-dark px-6 text-center"
    >
      <span className="sr-only">Loading portfolio...</span>

      <div className="relative flex items-center justify-center" aria-hidden="true">
        <motion.div
          className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full opacity-60"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0%, #4FA8A8 25%, transparent 50%, #421fdf 75%, transparent 100%)',
            filter: 'blur(10px)'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        <motion.img
          src="/logo/djb-mark.svg"
          alt=""
          className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-glow"
          initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
          animate={{
            scale: [0.4, 1.15, 0.95, 1, 1.05, 1],
            opacity: 1,
            rotate: 0
          }}
          transition={{
            duration: 1.1,
            ease: 'easeOut',
            scale: { times: [0, 0.45, 0.65, 0.8, 0.9, 1], duration: 1.1 }
          }}
        />
      </div>

      <div aria-hidden="true" className="flex flex-col items-center gap-1">
        {LINES.map((line, lineIndex) => (
          <motion.div
            key={line}
            className="flex flex-wrap justify-center max-w-xs sm:max-w-none"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.03, delayChildren: 0.4 + lineIndex * 0.35 } }
            }}
          >
            {line.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={
                  lineIndex === 0
                    ? 'text-lg sm:text-xl font-display font-semibold text-white'
                    : 'text-2xl sm:text-3xl font-display font-bold text-brand-teal'
                }
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div
        aria-hidden="true"
        className="flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-teal"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>
    </div>
  );
}
