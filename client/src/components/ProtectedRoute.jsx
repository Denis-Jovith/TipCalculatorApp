import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div data-theme="dark" className="dark min-h-screen flex items-center justify-center bg-[#0a0a1a] text-white">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
