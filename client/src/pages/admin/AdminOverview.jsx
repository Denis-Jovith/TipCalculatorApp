import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Trophy, Star, Sparkles, Briefcase, Inbox, MessageSquare } from 'lucide-react';
import { api } from '../../api/client';

const CARDS = [
  { key: 'projects', label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { key: 'achievements', label: 'Achievements', to: '/admin/achievements', icon: Trophy },
  { key: 'recommendations', label: 'Recommendations', to: '/admin/recommendations', icon: Star },
  { key: 'skills', label: 'Skills', to: '/admin/skills', icon: Sparkles },
  { key: 'experience', label: 'Experience entries', to: '/admin/experience', icon: Briefcase },
  { key: 'messages', label: 'Messages', to: '/admin/messages', icon: Inbox },
  { key: 'comments', label: 'Comments', to: '/admin/comments', icon: MessageSquare }
];

export default function AdminOverview() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    Promise.all([
      api.get('/projects?all=true').then((r) => r.data.length),
      api.get('/achievements?all=true').then((r) => r.data.length),
      api.get('/recommendations/all').then((r) => r.data.length),
      api.get('/skills').then((r) => r.data.length),
      api.get('/experience').then((r) => r.data.length),
      api.get('/messages').then((r) => r.data.length),
      api.get('/comments/all').then((r) => r.data.length)
    ])
      .then(([projects, achievements, recommendations, skills, experience, messages, comments]) =>
        setCounts({ projects, achievements, recommendations, skills, experience, messages, comments })
      )
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
      <p className="text-slate-400 mb-8">
        Everything on your public site — text, images, video, projects, achievements, recommendations, and links —
        is editable from here.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map(({ key, label, to, icon: Icon }) => (
          <Link key={key} to={to} className="glass-card p-5 hover:border-brand-teal/50 transition-colors">
            <Icon className="text-brand-teal mb-3" size={22} />
            <p className="text-3xl font-bold text-white">{counts[key] ?? '—'}</p>
            <p className="text-sm text-slate-400">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
