import * as Icons from 'lucide-react';
import { TikTokIcon, ThreadsIcon } from './BrandSocialIcons.jsx';

const CUSTOM_ICONS = { TikTok: TikTokIcon, Threads: ThreadsIcon };

function resolveIcon(name) {
  return CUSTOM_ICONS[name] || Icons[name] || Icons.Link;
}

export default function SocialBar({ socialLinks = [], variant = 'bar' }) {
  const visible = socialLinks.filter((s) => s.visible !== false);
  if (!visible.length) return null;

  if (variant === 'bar') {
    return (
      <div className="flex flex-wrap justify-center rounded-t-[2.5rem] border-2 border-brand-olive divide-x divide-brand-olive overflow-hidden">
        {visible.map((link) => {
          const Icon = resolveIcon(link.icon);
          return (
            <a
              key={link._id || link.platform}
              href={link.url}
              aria-label={link.platform}
              className="flex flex-col items-center gap-1 px-6 sm:px-8 py-4 bg-brand-teal/90 hover:bg-brand-teal transition-colors text-[#08122c]"
            >
              <Icon size={24} aria-hidden="true" />
              <span className="text-xs font-semibold">{link.platform}</span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {visible.map((link) => {
        const Icon = resolveIcon(link.icon);
        return (
          <a
            key={link._id || link.platform}
            href={link.url}
            aria-label={link.platform}
            title={link.platform}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-surface border border-surface-border text-fg hover:bg-brand-teal hover:text-[#08122c] transition-colors"
          >
            <Icon size={18} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
