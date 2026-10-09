import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

/**
 * Canvas-based QR generator. Draws the QR matrix manually so the module shape can be
 * customised (square / rounded / dots), then overlays an optional logo with a styled
 * background. The whole canvas downloads as a single PNG, so the logo is actually baked
 * into the saved file - not just a CSS overlay on top of a plain QR image.
 */
export default function StyledQR({
  value,
  size = 420,
  logoUrl,
  color = '#4FA8A8',
  bgColor = '#08122c',
  moduleShape = 'rounded',
  logoShape = 'circle',
  logoSize = 0.22,
  ecLevel = 'H',
  className = '',
  onReady
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const qr = QRCode.create(value, { errorCorrectionLevel: ecLevel });
      const modules = qr.modules;
      const count = modules.size;
      const data = modules.data;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.maxWidth = `${size}px`;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      const margin = 16;
      const drawable = size - margin * 2;
      const cell = drawable / count;
      ctx.fillStyle = color;

      const drawCell = (x, y) => {
        const px = margin + x * cell;
        const py = margin + y * cell;
        const s = cell;
        if (moduleShape === 'dots') {
          const r = s / 2 - 0.3;
          ctx.beginPath();
          ctx.arc(px + s / 2, py + s / 2, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (moduleShape === 'rounded') {
          const r = s * 0.32;
          ctx.beginPath();
          ctx.moveTo(px + r, py);
          ctx.arcTo(px + s, py, px + s, py + s, r);
          ctx.arcTo(px + s, py + s, px, py + s, r);
          ctx.arcTo(px, py + s, px, py, r);
          ctx.arcTo(px, py, px + s, py, r);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(px, py, s + 0.4, s + 0.4);
        }
      };

      for (let y = 0; y < count; y++) {
        for (let x = 0; x < count; x++) {
          if (data[y * count + x]) drawCell(x, y);
        }
      }

      if (logoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = logoUrl;
        try {
          await new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('logo load failed'));
          });
        } catch {
          if (!cancelled) onReady?.(canvas);
          return;
        }
        if (cancelled) return;

        const lw = drawable * logoSize;
        const pad = lw * 0.16;
        const lx = (size - lw) / 2;
        const ly = (size - lw) / 2;

        ctx.fillStyle = bgColor;
        if (logoShape === 'circle') {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, (lw + pad * 2) / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.save();
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, lw / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, lx, ly, lw, lw);
          ctx.restore();
        } else if (logoShape === 'rounded') {
          const r = lw * 0.18;
          const fx = lx - pad;
          const fy = ly - pad;
          const fw = lw + pad * 2;
          ctx.beginPath();
          ctx.moveTo(fx + r, fy);
          ctx.arcTo(fx + fw, fy, fx + fw, fy + fw, r);
          ctx.arcTo(fx + fw, fy + fw, fx, fy + fw, r);
          ctx.arcTo(fx, fy + fw, fx, fy, r);
          ctx.arcTo(fx, fy, fx + fw, fy, r);
          ctx.closePath();
          ctx.fill();
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(lx + r * 0.6, ly);
          ctx.arcTo(lx + lw, ly, lx + lw, ly + lw, r * 0.6);
          ctx.arcTo(lx + lw, ly + lw, lx, ly + lw, r * 0.6);
          ctx.arcTo(lx, ly + lw, lx, ly, r * 0.6);
          ctx.arcTo(lx, ly, lx + lw, ly, r * 0.6);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, lx, ly, lw, lw);
          ctx.restore();
        } else {
          ctx.fillRect(lx - pad, ly - pad, lw + pad * 2, lw + pad * 2);
          ctx.drawImage(img, lx, ly, lw, lw);
        }
      }

      if (!cancelled) onReady?.(canvas);
    })();
    return () => {
      cancelled = true;
    };
  }, [value, size, logoUrl, color, bgColor, moduleShape, logoShape, logoSize, ecLevel, onReady]);

  return <canvas ref={canvasRef} className={className} />;
}

/** Triggers a download of a canvas (as rendered by StyledQR) as a PNG file. */
export function downloadStyledQr(canvas, filename = 'qr-code.png') {
  if (!canvas) return;
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}
