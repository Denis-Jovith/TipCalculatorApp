import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Trash2, Send, X, Save, ShieldCheck, ShieldOff, Clock } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext.jsx';

const MAX_USERS = 3;

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [lastAcceptUrl, setLastAcceptUrl] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/auth/users');
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const invite = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/auth/users', form);
      toast.success(data.emailed ? 'Invite emailed.' : 'Invite created — SMTP not configured, copy the link below.');
      setLastAcceptUrl(data.acceptUrl || null);
      setForm({ name: '', email: '' });
      setInviting(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send invite');
    } finally {
      setSaving(false);
    }
  };

  const resend = async (u) => {
    try {
      const { data } = await api.post(`/auth/users/${u.id}/resend-invite`);
      toast.success(data.emailed ? 'Invite re-sent.' : 'Invite refreshed — SMTP not configured, copy the link below.');
      setLastAcceptUrl(data.acceptUrl || null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend invite');
    }
  };

  const toggleResetPermission = async (u) => {
    try {
      const { data } = await api.patch(`/auth/users/${u.id}`, { canResetPassword: !u.canResetPassword });
      setUsers((prev) => prev.map((x) => (x.id === data.id ? data : x)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update');
    }
  };

  const toggleStatus = async (u) => {
    const nextStatus = u.status === 'disabled' ? 'active' : 'disabled';
    try {
      const { data } = await api.patch(`/auth/users/${u.id}`, { status: nextStatus });
      setUsers((prev) => prev.map((x) => (x.id === data.id ? data : x)));
      toast.success(nextStatus === 'disabled' ? 'Account disabled' : 'Account re-enabled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update');
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Remove ${u.name} (${u.email}) from the admin?`)) return;
    try {
      await api.delete(`/auth/users/${u.id}`);
      toast.success('Removed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove');
    }
  };

  const atCap = users.length >= MAX_USERS;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Users</h1>
        <button
          onClick={() => setInviting(true)}
          disabled={atCap}
          title={atCap ? `Maximum of ${MAX_USERS} users reached` : undefined}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <UserPlus size={16} /> Invite user
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-4">
        Up to {MAX_USERS} admin accounts ({users.length}/{MAX_USERS} used). Every account is invited by email and
        must verify before it can sign in. Turn off &ldquo;Allow password reset&rdquo; per-user to block forgot-password
        for that account specifically.
      </p>

      {lastAcceptUrl && (
        <div className="glass-card p-4 mb-4 text-sm">
          <p className="text-yellow-400 mb-1">SMTP isn&rsquo;t configured, so the invite link wasn&rsquo;t emailed. Share it manually:</p>
          <code className="block break-all text-slate-300 bg-black/30 rounded px-2 py-1">{lastAcceptUrl}</code>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Password reset</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              users.map((u) => (
                <tr key={u.id} className="text-slate-200 hover:bg-white/5">
                  <td className="px-4 py-3">
                    {u.name} {u.id === me?.id && <span className="text-xs text-slate-500">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.status === 'active' && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal w-fit">
                        <ShieldCheck size={10} /> Active
                      </span>
                    )}
                    {u.status === 'pending' && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 w-fit">
                        <Clock size={10} /> Pending invite
                      </span>
                    )}
                    {u.status === 'disabled' && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 w-fit">
                        <ShieldOff size={10} /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={u.canResetPassword}
                        onChange={() => toggleResetPermission(u)}
                        className="w-4 h-4 accent-brand-teal"
                      />
                      Allowed
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {u.status === 'pending' && (
                        <button
                          onClick={() => resend(u)}
                          className="p-1.5 text-slate-400 hover:text-brand-teal"
                          title="Resend invite"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {u.status !== 'pending' && u.id !== me?.id && (
                        <button
                          onClick={() => toggleStatus(u)}
                          className="p-1.5 text-slate-400 hover:text-yellow-400"
                          title={u.status === 'disabled' ? 'Re-enable' : 'Disable'}
                        >
                          {u.status === 'disabled' ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                        </button>
                      )}
                      {u.id !== me?.id && (
                        <button onClick={() => remove(u)} className="p-1.5 text-slate-400 hover:text-red-400" title="Remove">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {inviting && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={invite} className="glass-card w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Invite a user</h2>
              <button type="button" onClick={() => setInviting(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                />
              </div>
              <p className="text-slate-500 text-xs">
                They&rsquo;ll get an email with a link to verify and set their own password.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setInviting(false)}
                className="px-4 py-2 rounded-full text-sm text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110 disabled:opacity-60"
              >
                <Save size={16} /> {saving ? 'Sending…' : 'Send invite'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
