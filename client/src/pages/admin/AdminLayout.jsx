import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  FolderKanban,
  Trophy,
  MessageSquare,
  Star,
  Sparkles,
  Briefcase,
  GraduationCap,
  Share2,
  Inbox,
  LogOut,
  ExternalLink,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import BrandMark from '../../components/BrandMark.jsx';

const NAV = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { to: '/admin/recommendations', label: 'Recommendations', icon: Star },
  { to: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/social', label: 'Social Links', icon: Share2 },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
  { to: '/admin/users', label: 'Admin Users', icon: Users }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div data-theme="dark" className="dark min-h-screen bg-[#0a0a1a] text-slate-100 flex">
      <aside className="w-64 shrink-0 border-r border-white/10 bg-white/[0.02] flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BrandMark size={28} className="rounded-md shrink-0" />
            <p className="font-display text-lg font-bold gradient-text">Portfolio CMS</p>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-brand-teal text-[#08122c] font-semibold' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5"
          >
            <ExternalLink size={16} /> View live site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
