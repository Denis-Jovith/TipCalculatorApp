import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { api } from '../../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      // Endpoint always responds 200 with a generic message — nothing to catch in practice.
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-theme="dark" className="dark min-h-screen flex items-center justify-center bg-brand-gradient-radial px-4">
      <div className="glass-card w-full max-w-sm p-8 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Forgot password</h1>
          <p className="text-sm text-slate-400 mt-1">We&rsquo;ll email you a reset link if your account allows it.</p>
        </div>

        {sent ? (
          <p className="text-sm text-slate-300 text-center">
            If that account exists and is eligible for a reset, an email has been sent. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-teal text-[#08122c] font-semibold hover:brightness-110 disabled:opacity-60"
            >
              <Mail size={16} /> {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <Link to="/admin/login" className="block text-center text-sm text-brand-teal underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
