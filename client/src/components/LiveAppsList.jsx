import { ExternalLink, Rocket } from 'lucide-react';

const STATUS_STYLE = {
  live: { label: 'Live', dot: 'bg-emerald-400' },
  beta: { label: 'Beta', dot: 'bg-amber-400' },
  'coming-soon': { label: 'Coming soon', dot: 'bg-slate-400' }
};

// Real, currently-operated platforms - distinct from the portfolio's "Projects" case studies.
// Shown on the /links page as quick, scannable proof of live, running systems.
export default function LiveAppsList({ apps = [] }) {
  const visible = apps.filter((a) => a.visible !== false);
  if (!visible.length) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-3">
        <Rocket size={15} aria-hidden="true" /> Live applications I run
      </div>
      <div className="space-y-2">
        {visible.map((app) => {
          const status = STATUS_STYLE[app.status] || STATUS_STYLE.live;
          const isLive = app.status !== 'coming-soon';
          const content = (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`} aria-hidden="true" />
                <span className="truncate">
                  <span className="text-white font-medium">{app.name}</span>
                  {app.description && <span className="block text-xs text-white/50 truncate">{app.description}</span>}
                </span>
              </div>
              <span className="flex items-center gap-1.5 shrink-0 text-xs text-white/60">
                {status.label}
                {isLive && <ExternalLink size={13} aria-hidden="true" />}
              </span>
            </>
          );
          const className =
            'flex items-center justify-between gap-3 w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 transition-colors';
          return isLive ? (
            <a
              key={app._id || app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${className} hover:bg-white/10`}
            >
              {content}
            </a>
          ) : (
            <div key={app._id || app.name} className={`${className} opacity-60`}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
