import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('pwa_install_dismissed') === '1');

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem('pwa_install_dismissed', '1');
    setDismissed(true);
  };

  const install = async () => {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        role="status"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 glass-card p-4 flex items-center gap-3 shadow-glow"
      >
        <div className="flex-1 text-sm text-muted">
          <p className="font-semibold text-fg">Install this portfolio</p>
          <p className="text-muted text-xs">Add it to your home screen for quick, app-like access.</p>
        </div>
        <button
          onClick={install}
          className="p-2 rounded-full bg-brand-teal text-[#08122c] hover:brightness-110"
          aria-label="Install app"
        >
          <Download size={18} />
        </button>
        <button onClick={dismiss} className="p-2 text-muted hover:text-fg" aria-label="Dismiss install prompt">
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
