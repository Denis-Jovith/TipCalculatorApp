import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Loader2 } from 'lucide-react';
import StyledQR, { downloadStyledQr } from './StyledQR.jsx';

// A scannable, DJB-branded QR card for the Connect section - points at the portfolio's own
// URL so anyone can jump straight from a printed CV, business card, or a phone screen onto
// the live site. The logo is baked into the downloaded PNG (not a CSS overlay).
export default function QRConnectCard({ settings }) {
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef(null);
  const url = settings?.siteUrl || 'https://denisjovitusbuberwa.djb.co.tz';

  const handleDownload = async () => {
    setDownloading(true);
    downloadStyledQr(canvasRef.current, 'djb-portfolio-qr.png');
    setTimeout(() => setDownloading(false), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 flex flex-col items-center text-center gap-4"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-brand-teal">
        <QrCode size={16} aria-hidden="true" /> Scan to visit this portfolio
      </div>

      <a href={url} target="_blank" rel="noopener noreferrer" className="rounded-xl overflow-hidden shadow-glow">
        <StyledQR
          value={url}
          size={220}
          logoUrl="/logo/icon-192.png"
          color={settings?.qrColor || '#4FA8A8'}
          bgColor={settings?.qrBgColor || '#08122c'}
          onReady={(canvas) => {
            canvasRef.current = canvas;
          }}
          className="block w-full h-auto"
        />
      </a>

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-surface-border text-sm font-medium text-fg hover:bg-surface transition-colors disabled:opacity-60"
      >
        {downloading ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Download size={14} aria-hidden="true" />
        )}
        {downloading ? 'Preparing...' : 'Download PNG'}
      </button>

      <p className="text-xs text-faint break-all">{url.replace(/^https?:\/\//, '')}</p>
    </motion.div>
  );
}
