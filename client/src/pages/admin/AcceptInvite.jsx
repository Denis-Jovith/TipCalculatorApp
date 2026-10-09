import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserCheck } from 'lucide-react';
import { api } from '../../api/client';

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/auth/accept-invite', { email, token, password });
      toast.success('Account ready — sign in below.');
      navigate('/admin/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept invite');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div data-theme="dark" className="dark min-h-screen flex items-center justify-center bg-brand-gradient-radial px-4">
        <div className="glass-card w-full max-w-sm p-8 text-center">
          <p className="text-white">This invite link is missing information.</p>
          <Link to="/admin/login" className="text-brand-teal underline text-sm mt-3 inline-block">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-theme="dark" className="dark min-h-screen flex items-center justify-center bg-brand-gradient-radial px-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-sm p-8 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Set your password</h1>
          <p className="text-sm text-slate-400 mt-1">{email}</p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">New password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-teal"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Confirm password</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-teal"
          />
        </div>
        <p className="text-slate-500 text-xs">At least 8 characters.</p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-teal text-[#08122c] font-semibold hover:brightness-110 disabled:opacity-60"
        >
          <UserCheck size={16} /> {submitting ? 'Setting up…' : 'Activate account'}
        </button>
      </form>
    </div>
  );
}
