import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!loading && user) {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-theme="dark" className="dark min-h-screen flex items-center justify-center bg-brand-gradient-radial px-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-sm p-8 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your portfolio content</p>
        </div>

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
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-teal"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-teal text-[#08122c] font-semibold hover:brightness-110 disabled:opacity-60"
        >
          <LogIn size={16} /> {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <Link to="/admin/forgot-password" className="block text-center text-sm text-brand-teal underline">
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
