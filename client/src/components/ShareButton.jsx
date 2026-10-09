import { useState } from 'react';
import toast from 'react-hot-toast';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ title, text, url, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = { title, text, url };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the native share sheet — not an error worth surfacing.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border border-surface-border text-fg text-sm font-medium hover:bg-surface transition-colors ${className}`}
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
}
